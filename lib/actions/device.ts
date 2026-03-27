"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { generatePasscode, passcodesToMathProblems } from "@/lib/passcode";
import { assignIcloudAccount } from "@/lib/icloud-accounts";
import { revalidatePath } from "next/cache";

export async function createDevice(name: string, wordsRequired: number) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const passcode = generatePasscode();
    const mathProblems = passcodesToMathProblems(passcode);
    const icloud = assignIcloudAccount();
    const encrypted = encrypt(passcode);

    const device = await db.device.create({
      data: {
        userId,
        name,
        encryptedPasscode: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        icloudAccount: icloud.email,
        wordsRequired,
      },
    });

    revalidatePath("/dashboard");

    return {
      deviceId: device.id,
      mathProblems,
      icloudAccount: icloud,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("createDevice failed:", msg);
    return { error: msg };
  }
}

export async function getDevices() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.device.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      wordsRequired: true,
      icloudAccount: true,
      createdAt: true,
    },
  });
}

export async function deleteDevice(deviceId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.device.deleteMany({
    where: { id: deviceId, userId },
  });

  revalidatePath("/dashboard");
}
