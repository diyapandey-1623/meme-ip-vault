'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  watermarkedImageUrl: string;
  timestamp: string;
  license: string;
  creatorName: string;
  inMarketplace: boolean;
}

export default function MarketplacePage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplaceMemes();
  }, []);

  const fetchMarketplaceMemes = async () => {
    try {
      const response = await fetch('/api/memes?marketplace=true');
      if (response.ok) {
        const data = await response.json();
        setMemes(data);
      }
    } catch (error) {
      console.error('Error fetching marketplace memes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-bold">
            ← Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-5xl font-black text-center mb-4 text-cyan-500">Meme Marketplace</h1>
          <p className="text-center text-gray-300 text-xl">
            Discover memes available for licensing requests
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-cyan-500/30 mb-8">
          <h3 className="font-bold text-lg mb-2 text-cyan-400">📋 How It Works</h3>
          <p className="text-gray-300">
          These memes are available for licensing requests. Contact the creators to discuss 
          usage rights, collaborations, or commercial opportunities.
        </p>
      </div>

        {/* Memes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mb-4"></div>
            <p className="text-gray-300 font-bold">Loading marketplace...</p>
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border-2 border-cyan-500/30">
            <p className="text-gray-300 text-lg mb-4">
              No memes listed in marketplace yet.
            </p>
            <Link href="/upload" className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3 rounded-full hover:scale-110 transform transition-all duration-300">
              Upload & List Your Meme
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memes.map((meme) => (
              <Link href={`/certificate/${meme.id}`} key={meme.id}>
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-green-500/30 hover:border-green-500 transition-all hover:scale-105 shadow-lg hover:shadow-green-500/30">
                <div className="relative h-48 bg-gray-800">
                  <Image
                    src={meme.watermarkedImageUrl}
                    alt={meme.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    📦 Available
                  </div>
                </div>
                  <div className="p-4 bg-gradient-to-br from-gray-900 to-black">
                    <h3 className="font-bold text-lg mb-2 truncate text-white">{meme.title}</h3>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {meme.description}
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400">
                        Created by <span className="text-gray-300 font-semibold">{meme.creatorName}</span>
                      </div>
                      <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg text-xs text-center border border-cyan-500/30 font-semibold">
                        {meme.license}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
