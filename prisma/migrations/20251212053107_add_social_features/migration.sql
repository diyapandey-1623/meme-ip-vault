-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memeId" TEXT NOT NULL,
    CONSTRAINT "Like_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "memeId" TEXT NOT NULL,
    CONSTRAINT "Rating_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "watermarkedImageUrl" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "ipfsUrl" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "license" TEXT NOT NULL,
    "inMarketplace" BOOLEAN NOT NULL DEFAULT false,
    "creatorName" TEXT NOT NULL DEFAULT 'Anonymous',
    "isCollaboration" BOOLEAN NOT NULL DEFAULT false,
    "ipId" TEXT,
    "ipTxHash" TEXT,
    "licenseTermsId" TEXT,
    "onChain" BOOLEAN NOT NULL DEFAULT false,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "ratingSum" INTEGER NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Meme" ("creatorName", "description", "hash", "id", "imageUrl", "inMarketplace", "ipId", "ipTxHash", "ipfsUrl", "isCollaboration", "license", "licenseTermsId", "onChain", "timestamp", "title", "watermarkedImageUrl") SELECT "creatorName", "description", "hash", "id", "imageUrl", "inMarketplace", "ipId", "ipTxHash", "ipfsUrl", "isCollaboration", "license", "licenseTermsId", "onChain", "timestamp", "title", "watermarkedImageUrl" FROM "Meme";
DROP TABLE "Meme";
ALTER TABLE "new_Meme" RENAME TO "Meme";
CREATE INDEX "Meme_hash_idx" ON "Meme"("hash");
CREATE INDEX "Meme_license_idx" ON "Meme"("license");
CREATE INDEX "Meme_inMarketplace_idx" ON "Meme"("inMarketplace");
CREATE INDEX "Meme_ipId_idx" ON "Meme"("ipId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Like_memeId_idx" ON "Like"("memeId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_memeId_userId_key" ON "Like"("memeId", "userId");

-- CreateIndex
CREATE INDEX "Rating_memeId_idx" ON "Rating"("memeId");

-- CreateIndex
CREATE INDEX "Rating_userId_idx" ON "Rating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_memeId_userId_key" ON "Rating"("memeId", "userId");
