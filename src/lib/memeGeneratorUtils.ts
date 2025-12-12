/**
 * Utility functions for AI Meme Generator
 */

/**
 * Convert a base64 string or URL to a File object
 */
export async function urlToFile(url: string, filename: string = 'generated-meme.png'): Promise<File> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || 'image/png' });
  } catch (error) {
    throw new Error('Failed to convert image to file');
  }
}

/**
 * Convert a canvas to a File object
 */
export function canvasToFile(canvas: HTMLCanvasElement, filename: string = 'meme.png'): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob from canvas'));
        return;
      }
      const file = new File([blob], filename, { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
}

/**
 * Download a canvas as an image file
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string = 'meme.png') {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Add text overlay to an image
 */
export async function addTextToImage(
  imageUrl: string,
  topText: string,
  bottomText: string,
  watermark: string = 'Created on Meme IP Vault'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Configure text style
      const fontSize = Math.floor(img.width / 15);
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 10;
      ctx.fillStyle = 'white';

      // Draw top text
      if (topText) {
        const y = fontSize + 20;
        ctx.strokeText(topText.toUpperCase(), img.width / 2, y);
        ctx.fillText(topText.toUpperCase(), img.width / 2, y);
      }

      // Draw bottom text
      if (bottomText) {
        const y = img.height - 20;
        ctx.strokeText(bottomText.toUpperCase(), img.width / 2, y);
        ctx.fillText(bottomText.toUpperCase(), img.width / 2, y);
      }

      // Draw watermark
      ctx.font = `${Math.floor(fontSize / 2)}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText(watermark, img.width - 10, img.height - 10);

      // Convert to data URL
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Store generated meme data in localStorage
 */
export interface GeneratedMemeData {
  imageUrl: string;
  prompt: string;
  topText?: string;
  bottomText?: string;
  timestamp: string;
}

export function storeGeneratedMeme(data: GeneratedMemeData) {
  localStorage.setItem('generatedMeme', JSON.stringify(data));
}

export function getStoredGeneratedMeme(): GeneratedMemeData | null {
  const data = localStorage.getItem('generatedMeme');
  return data ? JSON.parse(data) : null;
}

export function clearStoredGeneratedMeme() {
  localStorage.removeItem('generatedMeme');
  localStorage.removeItem('generatedMemeForMint');
}
