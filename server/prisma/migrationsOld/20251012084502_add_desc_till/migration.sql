/*
  Warnings:

  - Added the required column `description` to the `till` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_till" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "valueStarted" DECIMAL NOT NULL,
    "value" DECIMAL NOT NULL,
    "valueCard" DECIMAL NOT NULL,
    "valueOther" DECIMAL NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_till" ("date", "id", "value", "valueCard", "valueOther", "valueStarted") SELECT "date", "id", "value", "valueCard", "valueOther", "valueStarted" FROM "till";
DROP TABLE "till";
ALTER TABLE "new_till" RENAME TO "till";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
