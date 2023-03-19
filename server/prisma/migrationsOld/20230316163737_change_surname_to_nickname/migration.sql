/*
  Warnings:

  - You are about to drop the column `surname` on the `dogs` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_extracts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" DECIMAL NOT NULL,
    "description" TEXT,
    "date" DATETIME,
    "attendanceId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "extracts_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "extracts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_extracts" ("attendanceId", "date", "description", "id", "ownerId", "value") SELECT "attendanceId", "date", "description", "id", "ownerId", "value" FROM "extracts";
DROP TABLE "extracts";
ALTER TABLE "new_extracts" RENAME TO "extracts";
CREATE UNIQUE INDEX "extracts_attendanceId_key" ON "extracts"("attendanceId");
CREATE TABLE "new_dogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "birthdayDate" DATETIME,
    "gender" TEXT,
    "colour" TEXT,
    "breed" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "dogs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dogs" ("avatarUrl", "birthdayDate", "breed", "colour", "gender", "id", "name", "ownerId") SELECT "avatarUrl", "birthdayDate", "breed", "colour", "gender", "id", "name", "ownerId" FROM "dogs";
DROP TABLE "dogs";
ALTER TABLE "new_dogs" RENAME TO "dogs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
