/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `purchases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "purchases" ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER;
