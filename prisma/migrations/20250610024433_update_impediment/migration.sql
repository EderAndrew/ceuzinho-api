/*
  Warnings:

  - Added the required column `status` to the `impediments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImpedimentStatus" AS ENUM ('AGUARDANDO', 'CANCELADO', 'ACEITO');

-- AlterTable
ALTER TABLE "impediments" ADD COLUMN     "status" "ImpedimentStatus" NOT NULL;
