/*
  Warnings:

  - You are about to drop the column `teatcherOne` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `teatcherTwo` on the `schedules` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ScheduleStatus" AS ENUM ('AGUARDANDO', 'AULA', 'FINALIZADO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_teatcherOne_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_teatcherTwo_fkey";

-- AlterTable
ALTER TABLE "public"."schedules" DROP COLUMN "teatcherOne",
DROP COLUMN "teatcherTwo",
ADD COLUMN     "status" "public"."ScheduleStatus" NOT NULL DEFAULT 'AGUARDANDO',
ADD COLUMN     "teacherOne" INTEGER,
ADD COLUMN     "teacherTwo" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_teacherOne_fkey" FOREIGN KEY ("teacherOne") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_teacherTwo_fkey" FOREIGN KEY ("teacherTwo") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
