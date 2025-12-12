'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LikeButton from '@/components/LikeButton';
import StarRating from '@/components/StarRating';
import VerifiedBadge from '@/components/VerifiedBadge';

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
  ipId?: string | null;
  ipTxHash?: string | null;
  onChain: boolean;
  ipfsUrl?: string | null;
  likesCount?: number;
  averageRating?: number;
  ratingCount?: number;
  verified?: boolean;
}

export default function ExplorePage() {
  const router = useRouter();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchMemes();
    fetchWalletAddress();
  }, []);

  const fetchWalletAddress = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check if user explicitly disconnected
      const isDisconnected = localStorage.getItem('wallet_disconnected');
      if (isDisconnected) {
        return; // Don't auto-reconnect
      }
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts && accounts.length > 0) {
          setUserAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error fetching wallet address:', error);
      }
    }
  };

  useEffect(() => {
    if (selectedLicense === 'all') {
      setFilteredMemes(memes);
    } else {
      setFilteredMemes(memes.filter((meme) => meme.license === selectedLicense));
    }
  }, [selectedLicense, memes]);

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/memes');
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Fetched memes:', data.map((m: Meme) => ({ 
          id: m.id, 
          title: m.title, 
          ipId: m.ipId, 
          onChain: m.onChain 
        })));
        setMemes(data);
        setFilteredMemes(data);
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (address: string | undefined) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewOnStory = (ipId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://aeneid.explorer.story.foundation/ipa/${ipId}`, '_blank');
  };

  const handleEvolve = (memeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/evolve/${memeId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-bold text-lg transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
            🗃️ Meme IP Vault
          </h1>
          <p className="text-gray-400 text-xl">
            Explore Story Protocol Protected Memes
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <label className="text-gray-300 font-semibold">Filter by License:</label>
              <select
                className="px-4 py-2 bg-black/50 border border-cyan-500/50 text-white rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
              >
                <option value="all">All Licenses</option>
                <option value="Free to Use">Free to Use</option>
                <option value="Credit Required">Credit Required</option>
                <option value="No Commercial">No Commercial</option>
              </select>
            </div>
            <div className="text-cyan-400 font-bold">
              {filteredMemes.length} meme{filteredMemes.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-300 font-bold text-xl">Loading memes...</p>
          </div>
        )}

        {!loading && filteredMemes.length === 0 && (
          <div className="text-center py-20 bg-gray-900/30 backdrop-blur rounded-3xl border-2 border-dashed border-purple-500/30">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-cyan-500 mb-4">No memes found</h3>
            <p className="text-xl text-gray-300 mb-8">
              {selectedLicense === 'all' 
                ? 'Be the first to upload a meme!' 
                : 'No memes match this license filter'}
            </p>
            <Link
              href="/upload"
              className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold px-10 py-4 rounded-full text-lg hover:scale-110 transform transition-all duration-300 shadow-2xl shadow-purple-500/50"
            >
              Upload Meme 🚀
            </Link>
          </div>
        )}

        {!loading && filteredMemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemes.map((meme) => (
              <div
                key={meme.id}
                className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-purple-500/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2"
              >
                {/* Image Section with Status Badge */}
                <div className="relative h-72 overflow-hidden bg-gray-800">
                  <Image
                    src={meme.ipfsUrl || meme.watermarkedImageUrl || meme.imageUrl}
                    alt={meme.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to watermarked or original image
                      const target = e.target as HTMLImageElement;
                      if (target.src !== meme.imageUrl) {
                        target.src = meme.imageUrl;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                  
                  {/* Status Badge Overlay */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {meme.verified && (
                      <div>
                        <VerifiedBadge verified={true} compact={true} />
                      </div>
                    )}
                    {meme.ipId ? (
                      <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg border border-green-400">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        ✅ Registered on Story
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-yellow-500/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                        ⏳ Pending
                      </div>
                    )}
                  </div>

                  {meme.inMarketplace && (
                    <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      🏪 For Sale
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <Link href={`/certificate/${meme.id}`} className="block mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {meme.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{meme.description}</p>
                  </Link>
                  
                  {/* Social Engagement */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
                    <LikeButton
                      memeId={meme.id}
                      initialCount={meme.likesCount || 0}
                      userId={userAddress}
                      compact={true}
                    />
                    <StarRating
                      memeId={meme.id}
                      initialRating={meme.averageRating || 0}
                      initialCount={meme.ratingCount || 0}
                      userId={userAddress}
                      compact={true}
                      interactive={false}
                    />
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-400">Creator:</span>
                      <br />
                      <span className="font-mono">{meme.creatorName || 'Anonymous'}</span>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                      {meme.license}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {meme.ipId && (
                      <>
                        {/* View on Story Explorer Button */}
                        <button
                          onClick={(e) => handleViewOnStory(meme.ipId!, e)}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2 group/btn"
                        >
                          <span>View on Story Explorer</span>
                          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>

                        {/* Evolve Button */}
                        <button
                          onClick={(e) => handleEvolve(meme.id, e)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 group/btn relative"
                          title="Create a remix or derivative IP from this meme"
                        >
                          <span>🧬 Evolve</span>
                          <svg className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                      </>
                    )}

                    {!meme.ipId && (
                      <div className="text-center py-3 text-gray-500 text-sm">
                        Waiting for blockchain confirmation...
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="mt-3 text-xs text-gray-600 text-center">
                    {new Date(meme.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
