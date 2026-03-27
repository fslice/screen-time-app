/*
  Warnings:

  - You are about to drop the column `userId` on the `WillpowerSession` table. All the data in the column will be lost.
  - You are about to drop the `ScreenTimePassword` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deviceId` to the `WillpowerSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScreenTimePassword" DROP CONSTRAINT "ScreenTimePassword_userId_fkey";

-- DropForeignKey
ALTER TABLE "WillpowerSession" DROP CONSTRAINT "WillpowerSession_userId_fkey";

-- AlterTable
ALTER TABLE "WillpowerSession" DROP COLUMN "userId",
ADD COLUMN     "currentWord" TEXT,
ADD COLUMN     "deviceId" TEXT NOT NULL,
ALTER COLUMN "wordsRequired" DROP DEFAULT;

-- DropTable
DROP TABLE "ScreenTimePassword";

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "encryptedPasscode" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "icloudAccount" TEXT NOT NULL,
    "wordsRequired" INTEGER NOT NULL DEFAULT 600,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WillpowerSession" ADD CONSTRAINT "WillpowerSession_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
