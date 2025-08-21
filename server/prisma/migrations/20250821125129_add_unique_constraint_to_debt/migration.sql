/*
  Warnings:

  - A unique constraint covering the columns `[UserID,BillID]` on the table `Debt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Debt_UserID_BillID_key" ON "public"."Debt"("UserID", "BillID");
