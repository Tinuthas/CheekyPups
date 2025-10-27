/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `offering` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN "offering_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "offering_booking_id_key" ON "offering"("booking_id");
