"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { generatePasscode, generatePasscodeSequences } from "@/lib/passcode";
import type { PasscodeSequences } from "@/lib/passcode";
import { assignIcloudAccount } from "@/lib/icloud-accounts";
import { revalidatePath } from "next/cache";

async function ensureUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await db.user.findUnique({ where: { id: userId } });
  if (!existing) {
    const clerkUser = await currentUser();
    await db.user.create({
      data: {
        id: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      },
    });
  }
  return userId;
}

export async function createDevice(name: string, wordsRequired: number, autoUnlockDays: number | null = null) {
  if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
    return { error: "Invalid device name" };
  }
  if (typeof wordsRequired !== "number" || !Number.isInteger(wordsRequired) || wordsRequired < 1 || wordsRequired > 10000) {
    return { error: "Words required must be an integer between 1 and 10,000" };
  }
  if (autoUnlockDays !== null && (typeof autoUnlockDays !== "number" || !Number.isInteger(autoUnlockDays) || autoUnlockDays < 1 || autoUnlockDays > 365)) {
    return { error: "Auto-unlock days must be between 1 and 365" };
  }

  try {
    const userId = await ensureUser();

    const passcode = generatePasscode();
    const sequences = generatePasscodeSequences(passcode);
    const icloud = assignIcloudAccount();
    const encrypted = encrypt(passcode);

    const autoUnlockAt = autoUnlockDays
      ? new Date(Date.now() + autoUnlockDays * 24 * 60 * 60 * 1000)
      : null;

    const device = await db.device.create({
      data: {
        userId,
        name,
        encryptedPasscode: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        icloudAccount: icloud.email,
        wordsRequired,
        autoUnlockAt,
      },
    });

    revalidatePath("/dashboard");

    return {
      deviceId: device.id,
      sequences,
      icloudAccount: icloud,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("createDevice failed:", msg);
    return { error: msg };
  }
}

export async function getDevices() {
  const userId = await ensureUser();

  return db.device.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      wordsRequired: true,
      icloudAccount: true,
      unlockedAt: true,
      createdAt: true,
    },
  });
}

export async function getCurrentPasscode(deviceId: string) {
  if (typeof deviceId !== "string" || deviceId.length === 0 || deviceId.length > 100) {
    throw new Error("Invalid device ID");
  }

  const userId = await ensureUser();

  const device = await db.device.findFirst({
    where: { id: deviceId, userId },
    select: { encryptedPasscode: true, iv: true, authTag: true },
  });
  if (!device) throw new Error("Device not found");

  return decrypt({
    ciphertext: device.encryptedPasscode,
    iv: device.iv,
    authTag: device.authTag,
  });
}

export async function resetDevice(deviceId: string) {
  if (typeof deviceId !== "string" || deviceId.length === 0 || deviceId.length > 100) {
    return { error: "Invalid device ID" };
  }

  try {
    const userId = await ensureUser();

    const device = await db.device.findFirst({
      where: { id: deviceId, userId },
    });
    if (!device) return { error: "Device not found" };

    const passcode = generatePasscode();
    const sequences = generatePasscodeSequences(passcode);
    const encrypted = encrypt(passcode);

    // Reset auto-unlock timer if device had one
    const autoUnlockAt = device.autoUnlockAt
      ? new Date(Date.now() + (device.autoUnlockAt.getTime() - device.createdAt.getTime()))
      : null;

    await db.device.update({
      where: { id: deviceId },
      data: {
        encryptedPasscode: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        unlockedAt: null,
        autoUnlockAt,
      },
    });

    revalidatePath("/dashboard");

    return { sequences };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("resetDevice failed:", msg);
    return { error: msg };
  }
}

export async function deleteDevice(deviceId: string) {
  if (typeof deviceId !== "string" || deviceId.length === 0 || deviceId.length > 100) {
    throw new Error("Invalid device ID");
  }

  const userId = await ensureUser();

  await db.device.deleteMany({
    where: { id: deviceId, userId },
  });

  revalidatePath("/dashboard");
}
