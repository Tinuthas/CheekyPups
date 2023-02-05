-- CreateTable
CREATE TABLE "dogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthdayDate" DATETIME,
    "gender" TEXT,
    "colour" TEXT,
    "breed" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "dogs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phoneOne" TEXT NOT NULL,
    "phoneTwo" TEXT,
    "emailAddress" TEXT NOT NULL,
    "address" TEXT
);

-- CreateTable
CREATE TABLE "Vaccine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateVaccine" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    CONSTRAINT "Vaccine_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullDay" BOOLEAN NOT NULL,
    "day_id" TEXT NOT NULL,
    "dog_id" TEXT NOT NULL,
    "extract_id" TEXT,
    CONSTRAINT "attendances_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendances_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Extract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" DECIMAL NOT NULL,
    "description" TEXT,
    "attendanceId" TEXT,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Extract_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Extract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_emailAddress_key" ON "Owner"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_extract_id_key" ON "attendances"("extract_id");

-- CreateIndex
CREATE UNIQUE INDEX "Extract_attendanceId_key" ON "Extract"("attendanceId");
