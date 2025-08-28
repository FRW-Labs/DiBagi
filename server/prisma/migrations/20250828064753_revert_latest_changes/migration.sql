/*
  Warnings:

  - You are about to drop the `ItemParticipants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `UserID` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ItemParticipants" DROP CONSTRAINT "ItemParticipants_ItemID_fkey";

-- DropForeignKey
ALTER TABLE "public"."ItemParticipants" DROP CONSTRAINT "ItemParticipants_UserID_fkey";

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "UserID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."ItemParticipants";

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
