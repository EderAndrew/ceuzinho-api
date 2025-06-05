/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - Added the required column `photUrl` to the `kids` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "kids" ADD COLUMN     "photUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "documentUrl" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
ADD COLUMN     "photoUrl" TEXT;
