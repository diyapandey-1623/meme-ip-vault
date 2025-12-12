import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate a perceptual hash of an image
 * This creates a unique fingerprint that can detect similar/duplicate images
 */
export async function generateImageHash(imageBuffer: Buffer): Promise<string> {
  try {
    // Resize to 8x8 and convert to grayscale for consistent hashing
    const resized = await sharp(imageBuffer)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();

    // Calculate average pixel value
    let sum = 0;
    for (let i = 0; i < resized.length; i++) {
      sum += resized[i];
    }
    const avg = sum / resized.length;

    // Create hash: 1 if pixel > avg, 0 otherwise
    let hash = '';
    for (let i = 0; i < resized.length; i++) {
      hash += resized[i] > avg ? '1' : '0';
    }

    // Convert binary string to hex for shorter representation
    return Buffer.from(hash, 'binary').toString('hex');
  } catch (error) {
    console.error('Error generating image hash:', error);
    throw new Error('Failed to generate image hash');
  }
}

/**
 * Add watermark to an image using sharp
 */
export async function addWatermark(
  imageBuffer: Buffer,
  text: string = 'MEME IP VAULT'
): Promise<Buffer> {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // Create watermark text as SVG
    const fontSize = Math.max(width / 20, 20);
    const smallFontSize = Math.max(width / 40, 12);
    
    const watermarkSvg = `
      <svg width="${width}" height="${height}">
        <style>
          .watermark { 
            fill: rgba(255, 255, 255, 0.5); 
            font-family: Arial, sans-serif; 
            font-weight: bold;
            font-size: ${fontSize}px;
            text-anchor: middle;
          }
          .watermark-stroke { 
            fill: none;
            stroke: rgba(0, 0, 0, 0.5); 
            stroke-width: 2;
            font-family: Arial, sans-serif; 
            font-weight: bold;
            font-size: ${fontSize}px;
            text-anchor: middle;
          }
          .small-watermark { 
            fill: rgba(255, 255, 255, 0.7); 
            font-family: Arial, sans-serif; 
            font-size: ${smallFontSize}px;
            text-anchor: end;
          }
        </style>
        <text x="${width / 2}" y="${height / 2}" class="watermark-stroke">${text}</text>
        <text x="${width / 2}" y="${height / 2}" class="watermark">${text}</text>
        <text x="${width - 10}" y="${height - 10}" class="small-watermark">© Meme IP Vault</text>
      </svg>
    `;

    // Composite the watermark over the image
    const watermarkedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    return watermarkedBuffer;
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw new Error('Failed to add watermark');
  }
}

/**
 * Compare two image hashes to detect duplicates
 * Returns similarity percentage (0-100)
 */
export function compareHashes(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return 0;

  let matches = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] === hash2[i]) matches++;
  }

  return (matches / hash1.length) * 100;
}

/**
 * Save uploaded file to disk (only in development)
 */
export async function saveUploadedFile(
  file: File,
  subfolder: string = 'originals'
): Promise<string> {
  // Skip local file storage in production/serverless (read-only filesystem)
  // Check multiple indicators for production environment
  const isProduction = 
    process.env.NODE_ENV === 'production' || 
    process.env.VERCEL === '1' || 
    process.env.NETLIFY === 'true' ||
    !process.cwd().includes('C:\\') && !process.cwd().includes('c:\\'); // Not on Windows local dev
  
  if (isProduction) {
    // Return a placeholder path - actual storage is in IPFS
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.name);
    return `/uploads/${subfolder}/${uniqueSuffix}${ext}`;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist (development only)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = path.extname(file.name);
  const filename = `${uniqueSuffix}${ext}`;
  const filepath = path.join(uploadDir, filename);

  // Save file
  await fs.writeFile(filepath, buffer);

  // Return relative URL path
  return `/uploads/${subfolder}/${filename}`;
}

/**
 * Process uploaded image: validate, generate hash, create watermarked version
 */
export async function processUploadedImage(file: File): Promise<{
  originalUrl: string;
  watermarkedUrl: string;
  hash: string;
}> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10MB');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate hash
  const hash = await generateImageHash(buffer);

  // Save original
  const originalUrl = await saveUploadedFile(file, 'originals');

  // Create and save watermarked version
  const watermarkedBuffer = await addWatermark(buffer);
  
  // Convert Buffer to Uint8Array for Blob constructor
  const watermarkedArray = new Uint8Array(watermarkedBuffer);
  const watermarkedBlob = new Blob([watermarkedArray], { type: 'image/png' });
  const watermarkedFile = new File([watermarkedBlob], file.name, {
    type: 'image/png',
  });
  const watermarkedUrl = await saveUploadedFile(
    watermarkedFile,
    'watermarked'
  );

  return {
    originalUrl,
    watermarkedUrl,
    hash,
  };
}
