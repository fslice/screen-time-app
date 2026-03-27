"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { getRandomWord } from "@/lib/words";

export async function startUnlockSession(deviceId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify the device belongs to the user
  const device = await db.device.findFirst({
    where: { id: deviceId, userId },
  });
  if (!device) throw new Error("Device not found");

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
  };
}

export async function submitWord(sessionId: string, typedWord: string) {
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

  // Override word instantly completes the challenge
  const OVERRIDE_WORD = "altogether";
  const trimmed = typedWord.trim().toLowerCase();
  const isOverride = trimmed === OVERRIDE_WORD;

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
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const session = await db.willpowerSession.findFirst({
    where: { id: sessionId },
    include: {
      device: {
        select: {
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

  // Mark that the password was revealed
  await db.willpowerSession.update({
    where: { id: sessionId },
    data: { passwordRevealedAt: new Date() },
  });

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
