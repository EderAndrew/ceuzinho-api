-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROFESSOR', 'PARENTE', 'PASTOR');

-- CreateEnum
CREATE TYPE "Room" AS ENUM ('MATERNAL', 'INFANTIL_I', 'INFANTIL_II');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('MANHÃ', 'TARDE', 'NOITE');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "ImpedimentStatus" AS ENUM ('AGUARDANDO', 'CANCELADO', 'ACEITO');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('AGUARDANDO', 'AULA', 'FINALIZADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role",
    "photo" TEXT,
    "photoUrl" TEXT,
    "phone" TEXT,
    "sex" "Sex" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "bgColor" TEXT NOT NULL,
    "firstAccess" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recoveries" (
    "id" SERIAL NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userEmail" TEXT NOT NULL,
    "otc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "recoveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kids" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "photo" TEXT NOT NULL,
    "photUrl" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "room" "Room" NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "kids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issues" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "kidId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "month" TEXT,
    "timeStart" TEXT,
    "timeEnd" TEXT,
    "period" "Period",
    "scheduleType" TEXT,
    "room" "Room",
    "tema" TEXT,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'AGUARDANDO',
    "info" TEXT,
    "createdBy" INTEGER,
    "teacherOne" INTEGER,
    "teacherTwo" INTEGER,
    "ministratorOne" TEXT,
    "ministratorTwo" TEXT,
    "document" TEXT,
    "documentUrl" TEXT,
    "bgColor" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "dataInitial" TIMESTAMP(3) NOT NULL,
    "dataFinal" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classRooms" (
    "id" SERIAL NOT NULL,
    "startClass" BOOLEAN NOT NULL DEFAULT false,
    "closeClass" BOOLEAN NOT NULL DEFAULT false,
    "scheduleId" INTEGER NOT NULL,
    "kidId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classRooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impediments" (
    "id" SERIAL NOT NULL,
    "info" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    "acceptId" INTEGER,
    "scheduleId" INTEGER NOT NULL,
    "status" "ImpedimentStatus" NOT NULL DEFAULT 'AGUARDANDO',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "impediments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "recoveries_userEmail_key" ON "recoveries"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "recoveries_otc_key" ON "recoveries"("otc");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recoveries" ADD CONSTRAINT "recoveries_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kids" ADD CONSTRAINT "kids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "kids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_teacherOne_fkey" FOREIGN KEY ("teacherOne") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_teacherTwo_fkey" FOREIGN KEY ("teacherTwo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classRooms" ADD CONSTRAINT "classRooms_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classRooms" ADD CONSTRAINT "classRooms_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "kids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impediments" ADD CONSTRAINT "impediments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impediments" ADD CONSTRAINT "impediments_acceptId_fkey" FOREIGN KEY ("acceptId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impediments" ADD CONSTRAINT "impediments_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
