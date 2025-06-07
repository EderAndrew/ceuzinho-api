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

-- AddForeignKey
ALTER TABLE "recoveries" ADD CONSTRAINT "recoveries_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
