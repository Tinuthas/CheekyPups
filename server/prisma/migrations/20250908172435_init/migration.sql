-- CreateTable
CREATE TABLE "dogs" (
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

-- CreateTable
CREATE TABLE "owners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phoneOne" TEXT NOT NULL,
    "phoneTwo" TEXT,
    "emailAddress" TEXT NOT NULL,
    "address" TEXT
);

-- CreateTable
CREATE TABLE "vaccines" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateVaccine" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "dogId" INTEGER NOT NULL,
    CONSTRAINT "vaccines_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "days" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullDay" BOOLEAN NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "day_id" INTEGER NOT NULL,
    "dog_id" INTEGER NOT NULL,
    "extract_id" INTEGER,
    CONSTRAINT "attendances_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendances_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "extracts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" DECIMAL NOT NULL,
    "description" TEXT,
    "date" DATETIME,
    "attendanceId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "extracts_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "extracts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "owners_emailAddress_key" ON "owners"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "extracts_attendanceId_key" ON "extracts"("attendanceId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
