-- DropForeignKey
ALTER TABLE "public"."Bill" DROP CONSTRAINT "Bill_GroupID_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupMembers" DROP CONSTRAINT "GroupMembers_GroupID_fkey";

-- AddForeignKey
ALTER TABLE "public"."GroupMembers" ADD CONSTRAINT "GroupMembers_GroupID_fkey" FOREIGN KEY ("GroupID") REFERENCES "public"."Group"("GroupID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bill" ADD CONSTRAINT "Bill_GroupID_fkey" FOREIGN KEY ("GroupID") REFERENCES "public"."Group"("GroupID") ON DELETE CASCADE ON UPDATE CASCADE;
