export interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  watermarkedImageUrl: string;
  hash: string;
  timestamp: Date;
  license: 'Free to Use' | 'Credit Required' | 'No Commercial';
  inMarketplace: boolean;
  creatorName: string;
  usageLinks?: UsageLink[];
}

export interface UsageLink {
  id: string;
  url: string;
  addedAt: Date;
  memeId: string;
}

export const LICENSE_TYPES = {
  FREE: 'Free to Use',
  CREDIT: 'Credit Required',
  NO_COMMERCIAL: 'No Commercial',
} as const;

export type LicenseType = typeof LICENSE_TYPES[keyof typeof LICENSE_TYPES];
