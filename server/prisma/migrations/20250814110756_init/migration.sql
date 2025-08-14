-- CreateEnum
CREATE TYPE "public"."DebtStatus" AS ENUM ('paid', 'unpaid');

-- CreateTable
CREATE TABLE "public"."User" (
    "UserID" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "public"."Group" (
    "GroupID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Created_by_user" TEXT NOT NULL,
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("GroupID")
);

-- CreateTable
CREATE TABLE "public"."GroupMembers" (
    "UserID" INTEGER NOT NULL,
    "GroupID" INTEGER NOT NULL,

    CONSTRAINT "GroupMembers_pkey" PRIMARY KEY ("UserID","GroupID")
);

-- CreateTable
CREATE TABLE "public"."Bill" (
    "BillID" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Bill_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Total_amount" INTEGER NOT NULL,
    "Tax_and_service" INTEGER,
    "Discount" INTEGER,
    "Receipts_image_url" TEXT,
    "GroupID" INTEGER NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("BillID")
);

-- CreateTable
CREATE TABLE "public"."Item" (
    "ItemID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Price" INTEGER NOT NULL,
    "BillID" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("ItemID")
);

-- CreateTable
CREATE TABLE "public"."ItemParticipants" (
    "ItemID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "ItemParticipants_pkey" PRIMARY KEY ("ItemID","UserID")
);

-- CreateTable
CREATE TABLE "public"."Debt" (
    "DebtID" SERIAL NOT NULL,
    "Amount Owed" INTEGER NOT NULL,
    "Status" "public"."DebtStatus" NOT NULL,
    "BillID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("DebtID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "public"."User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "public"."User"("Email");

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_Created_by_user_fkey" FOREIGN KEY ("Created_by_user") REFERENCES "public"."User"("Username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMembers" ADD CONSTRAINT "GroupMembers_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMembers" ADD CONSTRAINT "GroupMembers_GroupID_fkey" FOREIGN KEY ("GroupID") REFERENCES "public"."Group"("GroupID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bill" ADD CONSTRAINT "Bill_GroupID_fkey" FOREIGN KEY ("GroupID") REFERENCES "public"."Group"("GroupID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_BillID_fkey" FOREIGN KEY ("BillID") REFERENCES "public"."Bill"("BillID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemParticipants" ADD CONSTRAINT "ItemParticipants_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "public"."Item"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemParticipants" ADD CONSTRAINT "ItemParticipants_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Debt" ADD CONSTRAINT "Debt_BillID_fkey" FOREIGN KEY ("BillID") REFERENCES "public"."Bill"("BillID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Debt" ADD CONSTRAINT "Debt_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
