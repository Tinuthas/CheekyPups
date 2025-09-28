-- RedefineTables
PRAGMA foreign_keys=OFF;
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
