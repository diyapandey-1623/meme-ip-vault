/*
  Warnings:

  - You are about to drop the column `collaborators` on the `Meme` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memeId" TEXT NOT NULL,
    CONSTRAINT "Collaborator_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "onChain" BOOLEAN NOT NULL DEFAULT false
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
CREATE INDEX "Collaborator_memeId_idx" ON "Collaborator"("memeId");

-- CreateIndex
CREATE INDEX "Collaborator_walletAddress_idx" ON "Collaborator"("walletAddress");
