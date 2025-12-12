'use client';

import { useRef, useEffect } from 'react';

interface AIImageResultProps {
  imageUrl: string | null;
  loading: boolean;
  topText: string;
  bottomText: string;
  onUseInMint: () => void;
}

export default function AIImageResult({ imageUrl, loading, topText, bottomText, onUseInMint }: AIImageResultProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      drawMemeWithText();
    }
  }, [imageUrl, topText, bottomText]);

  const drawMemeWithText = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Draw text if provided
      const fontSize = Math.floor(img.width / 15);
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 10;
      ctx.fillStyle = 'white';

      // Top text
      if (topText) {
        const y = fontSize + 20;
        ctx.strokeText(topText.toUpperCase(), img.width / 2, y);
        ctx.fillText(topText.toUpperCase(), img.width / 2, y);
      }

      // Bottom text
      if (bottomText) {
        const y = img.height - 20;
        ctx.strokeText(bottomText.toUpperCase(), img.width / 2, y);
        ctx.fillText(bottomText.toUpperCase(), img.width / 2, y);
      }

      // Watermark
      ctx.font = `${Math.floor(fontSize / 2)}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText('Created on Meme IP Vault', img.width - 10, img.height - 10);
    };
    img.src = imageUrl;
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meme-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20 min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 border-8 border-cyan-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-cyan-400 text-xl font-bold animate-pulse">
            🎨 AI is creating your meme...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This usually takes 10-30 seconds
          </p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-2xl p-8 shadow-2xl min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-gray-400 text-lg">
            Your generated meme will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500 rounded-2xl p-6 shadow-2xl shadow-green-500/20">
      <h2 className="text-2xl font-bold text-green-400 mb-4">✨ Your Generated Meme</h2>
      
      {/* Canvas for drawing text overlay */}
      <div className="relative mb-6 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto border-2 border-green-500/30 rounded-lg"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={downloadMeme}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-500/50"
        >
          ⬇️ Download Meme
        </button>

        <button
          onClick={onUseInMint}
          className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
        >
          🚀 Use This Meme → Mint as NFT
        </button>

        <p className="text-xs text-gray-400 text-center">
          Click "Use This Meme" to mint it on Story Protocol as an IP Asset
        </p>
      </div>
    </div>
  );
}
