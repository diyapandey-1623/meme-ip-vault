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
    "collaborators" TEXT,
    "ipId" TEXT,
    "ipTxHash" TEXT,
    "licenseTermsId" TEXT,
    "onChain" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Meme" ("creatorName", "description", "hash", "id", "imageUrl", "inMarketplace", "ipId", "ipTxHash", "ipfsUrl", "license", "licenseTermsId", "onChain", "timestamp", "title", "watermarkedImageUrl") SELECT "creatorName", "description", "hash", "id", "imageUrl", "inMarketplace", "ipId", "ipTxHash", "ipfsUrl", "license", "licenseTermsId", "onChain", "timestamp", "title", "watermarkedImageUrl" FROM "Meme";
DROP TABLE "Meme";
ALTER TABLE "new_Meme" RENAME TO "Meme";
CREATE INDEX "Meme_hash_idx" ON "Meme"("hash");
CREATE INDEX "Meme_license_idx" ON "Meme"("license");
CREATE INDEX "Meme_inMarketplace_idx" ON "Meme"("inMarketplace");
CREATE INDEX "Meme_ipId_idx" ON "Meme"("ipId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
