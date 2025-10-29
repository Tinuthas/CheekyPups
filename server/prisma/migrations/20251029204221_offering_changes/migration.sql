/*
  Warnings:

  - You are about to drop the column `bookingId` on the `offering` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "offering" DROP CONSTRAINT "offering_bookingId_fkey";

-- DropIndex
DROP INDEX "offering_bookingId_key";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "offering_id" INTEGER;

-- AlterTable
ALTER TABLE "offering" DROP COLUMN "bookingId";

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "offering"("id") ON DELETE SET NULL ON UPDATE CASCADE;
