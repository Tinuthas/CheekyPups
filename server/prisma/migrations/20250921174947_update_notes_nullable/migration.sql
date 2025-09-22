-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_daysBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "notes" TEXT
);
INSERT INTO "new_daysBooking" ("date", "id", "notes") SELECT "date", "id", "notes" FROM "daysBooking";
DROP TABLE "daysBooking";
ALTER TABLE "new_daysBooking" RENAME TO "daysBooking";
CREATE UNIQUE INDEX "daysBooking_date_key" ON "daysBooking"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
