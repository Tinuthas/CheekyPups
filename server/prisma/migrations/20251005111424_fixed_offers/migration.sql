/*
  Warnings:

  - You are about to drop the column `offering_id` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `booking_id` to the `offering` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_offering" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "owner" TEXT,
    "phone" TEXT,
    "ownerId" INTEGER,
    "type" TEXT,
    "notes" TEXT,
    "booking_id" INTEGER NOT NULL,
    CONSTRAINT "offering_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offering" ("id", "notes", "owner", "ownerId", "phone", "type") SELECT "id", "notes", "owner", "ownerId", "phone", "type" FROM "offering";
DROP TABLE "offering";
ALTER TABLE "new_offering" RENAME TO "offering";
CREATE TABLE "new_bookings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "day_booking_id" INTEGER NOT NULL,
    "dog_id" INTEGER,
    CONSTRAINT "bookings_day_booking_id_fkey" FOREIGN KEY ("day_booking_id") REFERENCES "daysBooking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("day_booking_id", "dog_id", "id", "status", "time") SELECT "day_booking_id", "dog_id", "id", "status", "time" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
