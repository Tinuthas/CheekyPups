-- CreateTable
CREATE TABLE "dogs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "birthdayDate" TIMESTAMP(3),
    "gender" TEXT,
    "colour" TEXT,
    "breed" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "dogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "secondOwner" TEXT,
    "phoneOne" TEXT NOT NULL,
    "phoneTwo" TEXT,
    "emailAddress" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "type" TEXT,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccines" (
    "id" SERIAL NOT NULL,
    "dateVaccine" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "dogId" INTEGER NOT NULL,

    CONSTRAINT "vaccines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" SERIAL NOT NULL,
    "typeDay" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "day_id" INTEGER NOT NULL,
    "dog_id" INTEGER NOT NULL,
    "extract_id" INTEGER,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracts" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "paidValue" DECIMAL(65,30),
    "totalValue" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "done" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3),
    "type" TEXT,
    "attendanceId" INTEGER,
    "bookingId" INTEGER,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "extracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daysBooking" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "daysBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "day_booking_id" INTEGER NOT NULL,
    "dog_id" INTEGER,
    "notes" TEXT,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offering" (
    "id" SERIAL NOT NULL,
    "owner" TEXT,
    "phone" TEXT,
    "ownerId" INTEGER,
    "type" TEXT,
    "notes" TEXT,
    "bookingId" INTEGER NOT NULL,

    CONSTRAINT "offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferences" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "till" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "valueStarted" DECIMAL(65,30) NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "valueCard" DECIMAL(65,30) NOT NULL,
    "valueOther" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "till_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owners_emailAddress_key" ON "owners"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "extracts_attendanceId_key" ON "extracts"("attendanceId");

-- CreateIndex
CREATE UNIQUE INDEX "extracts_bookingId_key" ON "extracts"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "daysBooking_date_key" ON "daysBooking"("date");

-- CreateIndex
CREATE UNIQUE INDEX "offering_bookingId_key" ON "offering"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "preferences_key_key" ON "preferences"("key");

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccines" ADD CONSTRAINT "vaccines_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracts" ADD CONSTRAINT "extracts_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracts" ADD CONSTRAINT "extracts_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracts" ADD CONSTRAINT "extracts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_day_booking_id_fkey" FOREIGN KEY ("day_booking_id") REFERENCES "daysBooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offering" ADD CONSTRAINT "offering_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
