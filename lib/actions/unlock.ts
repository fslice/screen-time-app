"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { getRandomWord } from "@/lib/words";

export async function startUnlockSession(deviceId: string) {
  if (typeof deviceId !== "string" || deviceId.length === 0 || deviceId.length > 100) {
    throw new Error("Invalid device ID");
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify the device belongs to the user
  const device = await db.device.findFirst({
    where: { id: deviceId, userId },
  });
  if (!device) throw new Error("Device not found");

  // Auto-unlock: if the timer has elapsed, create a completed session immediately
  const autoUnlocked = device.autoUnlockAt && new Date() >= device.autoUnlockAt;

  if (autoUnlocked) {
    // Check if there's already a completed session from auto-unlock
    const completedSession = await db.willpowerSession.findFirst({
      where: { deviceId, completedAt: { not: null } },
      orderBy: { createdAt: "desc" },
    });

    if (completedSession) {
      return {
        sessionId: completedSession.id,
        wordsRequired: device.wordsRequired,
        wordsCompleted: device.wordsRequired,
        currentWord: null,
        deviceName: device.name,
        autoUnlocked: true,
      };
    }

    const session = await db.willpowerSession.create({
      data: {
        deviceId,
        wordsRequired: device.wordsRequired,
        wordsCompleted: device.wordsRequired,
        currentWord: null,
        completedAt: new Date(),
      },
    });

    return {
      sessionId: session.id,
      wordsRequired: device.wordsRequired,
      wordsCompleted: device.wordsRequired,
      currentWord: null,
      deviceName: device.name,
      autoUnlocked: true,
    };
  }

  // Check for an existing incomplete session
  const existing = await db.willpowerSession.findFirst({
    where: { deviceId, completedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    return {
      sessionId: existing.id,
      wordsRequired: existing.wordsRequired,
      wordsCompleted: existing.wordsCompleted,
      currentWord: existing.currentWord ?? getRandomWord(),
      deviceName: device.name,
      autoUnlocked: false,
    };
  }

  const firstWord = getRandomWord();
  const session = await db.willpowerSession.create({
    data: {
      deviceId,
      wordsRequired: device.wordsRequired,
      currentWord: firstWord,
    },
  });

  return {
    sessionId: session.id,
    wordsRequired: session.wordsRequired,
    wordsCompleted: 0,
    currentWord: firstWord,
    deviceName: device.name,
    autoUnlocked: false,
  };
}

export async function submitWord(sessionId: string, typedWord: string) {
  if (typeof sessionId !== "string" || sessionId.length === 0 || sessionId.length > 100) {
    throw new Error("Invalid session ID");
  }
  if (typeof typedWord !== "string" || typedWord.length === 0 || typedWord.length > 200) {
    throw new Error("Invalid word");
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const session = await db.willpowerSession.findFirst({
    where: { id: sessionId },
    include: { device: { select: { userId: true } } },
  });

  if (!session || session.device.userId !== userId) {
    throw new Error("Session not found");
  }
  if (session.completedAt) {
    throw new Error("Session already completed");
  }

  const trimmed = typedWord.trim().toLowerCase();
  const overrideWord = process.env.OVERRIDE_WORD?.toLowerCase();
  const isOverride = !!overrideWord && trimmed === overrideWord;

  // Check if the typed word matches (case-insensitive, trimmed)
  const correct = isOverride || trimmed === session.currentWord?.toLowerCase();

  if (!correct) {
    return { correct: false, wordsCompleted: session.wordsCompleted, currentWord: session.currentWord! };
  }

  const newCompleted = isOverride ? session.wordsRequired : session.wordsCompleted + 1;
  const isFinished = newCompleted >= session.wordsRequired;
  const nextWord = isFinished ? null : getRandomWord();

  await db.willpowerSession.update({
    where: { id: sessionId },
    data: {
      wordsCompleted: newCompleted,
      currentWord: nextWord,
      completedAt: isFinished ? new Date() : null,
    },
  });

  return {
    correct: true,
    wordsCompleted: newCompleted,
    currentWord: nextWord,
    completed: isFinished,
  };
}

export async function revealPasscode(sessionId: string) {
  if (typeof sessionId !== "string" || sessionId.length === 0 || sessionId.length > 100) {
    throw new Error("Invalid session ID");
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const session = await db.willpowerSession.findFirst({
    where: { id: sessionId },
    include: {
      device: {
        select: {
          id: true,
          userId: true,
          encryptedPasscode: true,
          iv: true,
          authTag: true,
          icloudAccount: true,
        },
      },
    },
  });

  if (!session || session.device.userId !== userId) {
    throw new Error("Session not found");
  }
  if (!session.completedAt) {
    throw new Error("Challenge not completed yet");
  }

  // Mark that the password was revealed + flag device as unlocked
  const now = new Date();
  await Promise.all([
    db.willpowerSession.update({
      where: { id: sessionId },
      data: { passwordRevealedAt: now },
    }),
    db.device.update({
      where: { id: session.device.id },
      data: { unlockedAt: now },
    }),
  ]);

  const passcode = decrypt({
    ciphertext: session.device.encryptedPasscode,
    iv: session.device.iv,
    authTag: session.device.authTag,
  });

  return {
    passcode,
    icloudAccount: session.device.icloudAccount,
  };
}
