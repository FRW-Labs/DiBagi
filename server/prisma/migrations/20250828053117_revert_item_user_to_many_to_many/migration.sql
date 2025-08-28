/*
  Warnings:

  - You are about to drop the column `UserID` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_UserID_fkey";

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "UserID";

-- CreateTable
CREATE TABLE "public"."ItemParticipants" (
                                             "ItemID" TEXT NOT NULL,
                                             "UserID" INTEGER NOT NULL,
                                             "Quantity" INTEGER NOT NULL,

                                             CONSTRAINT "ItemParticipants_pkey" PRIMARY KEY ("ItemID","UserID")
);

-- AddForeignKey
ALTER TABLE "public"."ItemParticipants" ADD CONSTRAINT "ItemParticipants_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "public"."Item"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemParticipants" ADD CONSTRAINT "ItemParticipants_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;