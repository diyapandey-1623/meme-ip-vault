'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import PayRoyaltyForm from '@/components/PayRoyaltyForm';
import BlockchainStatus from '@/components/BlockchainStatus';
import LikeButton from '@/components/LikeButton';
import StarRating from '@/components/StarRating';
import VerifiedBadge from '@/components/VerifiedBadge';

interface UsageLink {
  id: string;
  url: string;
  addedAt: string;
}

interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  watermarkedImageUrl: string;
  hash: string;
  timestamp: string;
  license: string;
  creatorName: string;
  inMarketplace: boolean;
  usageLinks: UsageLink[];
  ipId?: string | null;
  ipTxHash?: string | null;
  licenseTermsId?: string | null;
  onChain: boolean;
  likesCount?: number;
  averageRating?: number;
  ratingCount?: number;
  verified?: boolean;
}

export default function CertificatePage() {
  const params = useParams();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchMeme();
    }
    fetchWalletAddress();
  }, [params.id]);

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

  // Auto-refresh every 5 seconds if blockchain registration is pending (no ipId yet)
  useEffect(() => {
    if (meme && !meme.ipId) {
      console.log('⏳ IP registration pending, auto-refreshing every 5 seconds...');
      const interval = setInterval(() => {
        console.log('🔄 Checking for ipId...');
        fetchMeme();
      }, 5000);
      return () => clearInterval(interval);
    } else if (meme && meme.ipId) {
      console.log('✅ IP Asset registered:', meme.ipId);
    }
  }, [meme?.ipId]);

  const fetchMeme = async () => {
    try {
      const response = await fetch(`/api/memes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Certificate fetched data:', {
          imageUrl: data.imageUrl,
          ipfsUrl: data.ipfsUrl,
          title: data.title,
          ipId: data.ipId,
          txHash: data.ipTxHash,
          onChain: data.onChain,
        });
        setMeme(data);
      }
    } catch (error) {
      console.error('Error fetching meme:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUsageLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkUrl.trim()) return;

    setAddingLink(true);
    try {
      const response = await fetch(`/api/memes/${params.id}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newLinkUrl }),
      });

      if (response.ok) {
        setNewLinkUrl('');
        fetchMeme(); // Refresh meme data
      }
    } catch (error) {
      console.error('Error adding usage link:', error);
    } finally {
      setAddingLink(false);
    }
  };

  const downloadWatermarked = () => {
    if (meme) {
      const link = document.createElement('a');
      link.href = meme.watermarkedImageUrl;
      link.download = `${meme.title}-watermarked.png`;
      link.click();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Loading certificate...</p>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Meme Not Found</h1>
          <Link href="/" className="btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>

      {/* Certificate Header */}
      <div className="card p-8 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">🎭 Meme Certificate</h1>
          {meme.inMarketplace && (
            <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
              📦 Listed in Marketplace
            </span>
          )}
        </div>
        <p className="text-gray-600">
          Official proof of ownership and registration timestamp
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Images */}
        <div>
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Original Meme</h2>
            <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={meme.imageUrl}
                alt={meme.title}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Watermarked Version</h2>
              <button onClick={downloadWatermarked} className="btn-secondary text-sm">
                ⬇️ Download
              </button>
            </div>
            <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={meme.watermarkedImageUrl}
                alt={`${meme.title} - Watermarked`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="card p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">{meme.title}</h2>
            <p className="text-gray-700 mb-6">{meme.description}</p>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="text-sm text-gray-500 mb-1">Creator</p>
                <p className="font-bold text-lg">{meme.creatorName}</p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <p className="text-sm text-gray-500 mb-1">License Information</p>
                <p className="font-bold text-lg bg-primary/10 text-primary px-3 py-2 rounded inline-block">
                  {meme.license}
                </p>
              </div>

              {/* Verified Badge */}
              {meme.verified && (
                <div className="border-l-4 border-green-500 pl-4">
                  <VerifiedBadge verified={true} compact={false} />
                </div>
              )}
            </div>
          </div>

          {/* Social Engagement Section */}
          <div className="card p-6 mb-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 text-white">Community Engagement</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">Like this meme:</p>
                <LikeButton
                  memeId={meme.id}
                  initialCount={meme.likesCount || 0}
                  userId={userAddress}
                  compact={false}
                />
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-2">Rate this meme:</p>
                <StarRating
                  memeId={meme.id}
                  initialRating={meme.averageRating || 0}
                  initialCount={meme.ratingCount || 0}
                  userId={userAddress}
                  compact={false}
                  interactive={true}
                />
              </div>
            </div>
          </div>

          {/* License Info */}
          <div className="card p-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30">
            <h3 className="font-bold mb-2 text-white">📋 License Information</h3>
            <p className="text-sm text-gray-300">
              {meme.license === 'Free to Use' &&
                'This meme can be used freely by anyone without restrictions.'}
              {meme.license === 'Credit Required' &&
                'This meme can be used, but you must credit the original creator.'}
              {meme.license === 'No Commercial' &&
                'This meme cannot be used by brands or for commercial purposes.'}
            </p>
            {meme.onChain && (
              <p className="text-xs text-green-400 mt-3 font-semibold">
                ✅ This license is enforced on-chain via Story Protocol
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pay Royalty Section */}
      {meme.ipId && (
        <div className="mb-8">
          <PayRoyaltyForm 
            ipAssetId={meme.ipId}
            ipAssetTitle={meme.title}
            onSuccess={fetchMeme}
          />
        </div>
      )}
    </div>
  );
}
