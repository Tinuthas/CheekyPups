-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_owners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "secondOwner" TEXT,
    "phoneOne" TEXT NOT NULL,
    "phoneTwo" TEXT,
    "emailAddress" TEXT,
    "address" TEXT,
    "notes" TEXT
);
INSERT INTO "new_owners" ("address", "emailAddress", "id", "name", "notes", "phoneOne", "phoneTwo", "secondOwner") SELECT "address", "emailAddress", "id", "name", "notes", "phoneOne", "phoneTwo", "secondOwner" FROM "owners";
DROP TABLE "owners";
ALTER TABLE "new_owners" RENAME TO "owners";
CREATE UNIQUE INDEX "owners_emailAddress_key" ON "owners"("emailAddress");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
