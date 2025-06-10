/*
  Warnings:

  - You are about to drop the column `userId` on the `impediments` table. All the data in the column will be lost.
  - Added the required column `requestId` to the `impediments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "impediments" DROP CONSTRAINT "impediments_userId_fkey";

-- AlterTable
ALTER TABLE "impediments" DROP COLUMN "userId",
ADD COLUMN     "acceptId" INTEGER,
ADD COLUMN     "requestId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "impediments" ADD CONSTRAINT "impediments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impediments" ADD CONSTRAINT "impediments_acceptId_fkey" FOREIGN KEY ("acceptId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
