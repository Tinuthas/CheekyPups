-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vaccines" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateVaccine" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "dogId" INTEGER NOT NULL,
    CONSTRAINT "vaccines_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_vaccines" ("dateVaccine", "dogId", "id", "type") SELECT "dateVaccine", "dogId", "id", "type" FROM "vaccines";
DROP TABLE "vaccines";
ALTER TABLE "new_vaccines" RENAME TO "vaccines";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
