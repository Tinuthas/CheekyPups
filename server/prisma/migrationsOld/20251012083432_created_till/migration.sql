-- CreateTable
CREATE TABLE "till" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "valueStarted" DECIMAL NOT NULL,
    "value" DECIMAL NOT NULL,
    "valueCard" DECIMAL NOT NULL,
    "valueOther" DECIMAL NOT NULL
);
