-- CreateTable
CREATE TABLE "Meme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "watermarkedImageUrl" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "license" TEXT NOT NULL,
    "inMarketplace" BOOLEAN NOT NULL DEFAULT false,
    "creatorName" TEXT NOT NULL DEFAULT 'Anonymous'
);

-- CreateTable
CREATE TABLE "UsageLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memeId" TEXT NOT NULL,
    CONSTRAINT "UsageLink_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Meme_hash_idx" ON "Meme"("hash");

-- CreateIndex
CREATE INDEX "Meme_license_idx" ON "Meme"("license");

-- CreateIndex
CREATE INDEX "Meme_inMarketplace_idx" ON "Meme"("inMarketplace");

-- CreateIndex
CREATE INDEX "UsageLink_memeId_idx" ON "UsageLink"("memeId");
