/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ItemParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."ItemParticipants" DROP CONSTRAINT "ItemParticipants_ItemID_fkey";

-- AlterTable
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_pkey",
ALTER COLUMN "ItemID" DROP DEFAULT,
ALTER COLUMN "ItemID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("ItemID");
DROP SEQUENCE "Item_ItemID_seq";

-- AlterTable
ALTER TABLE "public"."ItemParticipants" DROP CONSTRAINT "ItemParticipants_pkey",
ALTER COLUMN "ItemID" SET DATA TYPE TEXT,
ADD CONSTRAINT "ItemParticipants_pkey" PRIMARY KEY ("ItemID", "UserID");

-- AddForeignKey
ALTER TABLE "public"."ItemParticipants" ADD CONSTRAINT "ItemParticipants_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "public"."Item"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;
