/*
  Warnings:

  - Added the required column `paid` to the `attendances` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullDay" BOOLEAN NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "day_id" TEXT NOT NULL,
    "dog_id" TEXT NOT NULL,
    "extract_id" TEXT,
    CONSTRAINT "attendances_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendances_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_attendances" ("day_id", "dog_id", "extract_id", "fullDay", "id") SELECT "day_id", "dog_id", "extract_id", "fullDay", "id" FROM "attendances";
DROP TABLE "attendances";
ALTER TABLE "new_attendances" RENAME TO "attendances";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
