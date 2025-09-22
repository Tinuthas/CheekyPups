-- CreateTable
CREATE TABLE "daysBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "notes" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "day_booking_id" INTEGER NOT NULL,
    "dog_id" INTEGER NOT NULL,
    CONSTRAINT "bookings_day_booking_id_fkey" FOREIGN KEY ("day_booking_id") REFERENCES "daysBooking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_extracts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" DECIMAL NOT NULL,
    "description" TEXT,
    "date" DATETIME,
    "attendanceId" INTEGER,
    "bookingId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "extracts_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "extracts_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "extracts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_extracts" ("attendanceId", "date", "description", "id", "ownerId", "value") SELECT "attendanceId", "date", "description", "id", "ownerId", "value" FROM "extracts";
DROP TABLE "extracts";
ALTER TABLE "new_extracts" RENAME TO "extracts";
CREATE UNIQUE INDEX "extracts_attendanceId_key" ON "extracts"("attendanceId");
CREATE UNIQUE INDEX "extracts_bookingId_key" ON "extracts"("bookingId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "daysBooking_date_key" ON "daysBooking"("date");
