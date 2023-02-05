/*
  Warnings:

  - You are about to drop the `Extract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Owner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vaccine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Extract_attendanceId_key";

-- DropIndex
DROP INDEX "Owner_emailAddress_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Extract";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Owner";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vaccine";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "owners" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phoneOne" TEXT NOT NULL,
    "phoneTwo" TEXT,
    "emailAddress" TEXT NOT NULL,
    "address" TEXT
);

-- CreateTable
CREATE TABLE "vaccines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateVaccine" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    CONSTRAINT "vaccines_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "extracts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" DECIMAL NOT NULL,
    "description" TEXT,
    "attendanceId" TEXT,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "extracts_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "extracts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthdayDate" DATETIME,
    "gender" TEXT,
    "colour" TEXT,
    "breed" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "dogs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dogs" ("birthdayDate", "breed", "colour", "gender", "id", "name", "ownerId") SELECT "birthdayDate", "breed", "colour", "gender", "id", "name", "ownerId" FROM "dogs";
DROP TABLE "dogs";
ALTER TABLE "new_dogs" RENAME TO "dogs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "owners_emailAddress_key" ON "owners"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "extracts_attendanceId_key" ON "extracts"("attendanceId");
