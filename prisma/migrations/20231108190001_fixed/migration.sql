/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationRequest` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Session_accessToken_key` ON `Session`;

-- AlterTable
ALTER TABLE `Session` DROP COLUMN `accessToken`;

-- AlterTable
ALTER TABLE `VerificationRequest` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
