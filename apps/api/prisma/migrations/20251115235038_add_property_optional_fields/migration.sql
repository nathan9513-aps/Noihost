-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CleaningJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "bookingId" TEXT,
    "cleanerId" TEXT,
    "scheduledDate" DATETIME NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "checklistData" TEXT,
    "photos" TEXT,
    "notes" TEXT,
    "problemReported" BOOLEAN NOT NULL DEFAULT false,
    "problemDescription" TEXT,
    "problemPhotos" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CleaningJob_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CleaningJob_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CleaningJob_cleanerId_fkey" FOREIGN KEY ("cleanerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CleaningJob" ("bookingId", "checklistData", "cleanerId", "completedAt", "createdAt", "duration", "id", "notes", "photos", "price", "problemDescription", "problemPhotos", "problemReported", "propertyId", "scheduledDate", "scheduledTime", "startedAt", "status", "updatedAt") SELECT "bookingId", "checklistData", "cleanerId", "completedAt", "createdAt", "duration", "id", "notes", "photos", "price", "problemDescription", "problemPhotos", "problemReported", "propertyId", "scheduledDate", "scheduledTime", "startedAt", "status", "updatedAt" FROM "CleaningJob";
DROP TABLE "CleaningJob";
ALTER TABLE "new_CleaningJob" RENAME TO "CleaningJob";
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "squareMeters" INTEGER,
    "squareFeet" INTEGER,
    "photos" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "accessInstructions" TEXT,
    "cleaningDuration" INTEGER NOT NULL DEFAULT 120,
    "cleaningPrice" REAL,
    "checkInTime" TEXT NOT NULL DEFAULT '15:00',
    "checkOutTime" TEXT NOT NULL DEFAULT '11:00',
    "specialNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "bathrooms", "bedrooms", "checkInTime", "checkOutTime", "city", "cleaningDuration", "cleaningPrice", "country", "createdAt", "description", "id", "isActive", "latitude", "longitude", "name", "ownerId", "photos", "specialNotes", "squareMeters", "state", "type", "updatedAt", "zipCode") SELECT "address", "bathrooms", "bedrooms", "checkInTime", "checkOutTime", "city", "cleaningDuration", "cleaningPrice", "country", "createdAt", "description", "id", "isActive", "latitude", "longitude", "name", "ownerId", "photos", "specialNotes", "squareMeters", "state", "type", "updatedAt", "zipCode" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
