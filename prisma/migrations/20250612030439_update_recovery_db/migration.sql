/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `recoveries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[otc]` on the table `recoveries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recoveries_userEmail_key" ON "recoveries"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "recoveries_otc_key" ON "recoveries"("otc");
