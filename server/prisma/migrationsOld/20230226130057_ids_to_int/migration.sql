/*
  Warnings:

  - The primary key for the `vaccines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `dogId` on the `vaccines` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `vaccines` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `extracts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `attendanceId` on the `extracts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `extracts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `ownerId` on the `extracts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `days` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `days` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `owners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `owners` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `dogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dogs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `ownerId` on the `dogs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `attendances` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `day_id` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `dog_id` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `extract_id` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vaccines" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateVaccine" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "dogId" INTEGER NOT NULL,
    CONSTRAINT "vaccines_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_vaccines" ("dateVaccine", "dogId", "id", "type") SELECT "dateVaccine", "dogId", "id", "type" FROM "vaccines";
DROP TABLE "vaccines";
ALTER TABLE "new_vaccines" RENAME TO "vaccines";
CREATE TABLE "new_extracts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" DECIMAL NOT NULL,
    "description" TEXT,
    "date" DATETIME,
    "attendanceId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "extracts_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "extracts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_extracts" ("attendanceId", "date", "description", "id", "ownerId", "value") SELECT "attendanceId", "date", "description", "id", "ownerId", "value" FROM "extracts";
DROP TABLE "extracts";
ALTER TABLE "new_extracts" RENAME TO "extracts";
CREATE UNIQUE INDEX "extracts_attendanceId_key" ON "extracts"("attendanceId");
CREATE TABLE "new_days" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_days" ("date", "id") SELECT "date", "id" FROM "days";
DROP TABLE "days";
ALTER TABLE "new_days" RENAME TO "days";
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");
CREATE TABLE "new_owners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phoneOne" TEXT NOT NULL,
    "phoneTwo" TEXT,
    "emailAddress" TEXT NOT NULL,
    "address" TEXT
);
INSERT INTO "new_owners" ("address", "emailAddress", "id", "name", "phoneOne", "phoneTwo") SELECT "address", "emailAddress", "id", "name", "phoneOne", "phoneTwo" FROM "owners";
DROP TABLE "owners";
ALTER TABLE "new_owners" RENAME TO "owners";
CREATE UNIQUE INDEX "owners_emailAddress_key" ON "owners"("emailAddress");
CREATE TABLE "new_dogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birthdayDate" DATETIME,
    "gender" TEXT,
    "colour" TEXT,
    "breed" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "dogs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dogs" ("birthdayDate", "breed", "colour", "gender", "id", "name", "ownerId") SELECT "birthdayDate", "breed", "colour", "gender", "id", "name", "ownerId" FROM "dogs";
DROP TABLE "dogs";
ALTER TABLE "new_dogs" RENAME TO "dogs";
CREATE TABLE "new_attendances" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullDay" BOOLEAN NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "day_id" INTEGER NOT NULL,
    "dog_id" INTEGER NOT NULL,
    "extract_id" INTEGER,
    CONSTRAINT "attendances_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendances_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_attendances" ("day_id", "dog_id", "extract_id", "fullDay", "id", "paid") SELECT "day_id", "dog_id", "extract_id", "fullDay", "id", "paid" FROM "attendances";
DROP TABLE "attendances";
ALTER TABLE "new_attendances" RENAME TO "attendances";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
