-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_createdBy_fkey";

-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "scheduleType" DROP NOT NULL,
ALTER COLUMN "tema" DROP NOT NULL,
ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
