'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ipfsUrl: string;
  ipId: string | null;
  ipTxHash: string | null;
  onChain: boolean;
  creator: {
    name: string;
    walletAddress: string;
  } | null;
}

export default function EvolvePage({ params }: { params: { memeId: string } }) {
  const router = useRouter();
  const [originalMeme, setOriginalMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  
  // Form state
  const [derivativeFile, setDerivativeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [licenseType, setLicenseType] = useState('commercial');

  useEffect(() => {
    fetchOriginalMeme();
  }, [params.memeId]);

  const fetchOriginalMeme = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching original meme:', params.memeId);
      
      const response = await fetch(`/api/memes/${params.memeId}`);
      
      if (!response.ok) {
        throw new Error('Meme not found');
      }
      
      const data = await response.json();
      console.log('✅ Fetched meme:', data);
      
      setOriginalMeme(data);
    } catch (error) {
      console.error('❌ Error fetching meme:', error);
      setError('Original meme not found or still syncing on-chain');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDerivativeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!derivativeFile || !title) {
      alert('Please provide an image and title for your evolution');
      return;
    }

    if (!originalMeme?.ipId) {
      alert('Original meme must be registered on Story Protocol first');
      return;
    }

    setMinting(true);

    try {
      // 1. Upload derivative to IPFS
      console.log('📤 Uploading derivative to IPFS...');
      const formData = new FormData();
      formData.append('file', derivativeFile);

      const uploadResponse = await fetch('/api/upload-ipfs', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const { ipfsUrl } = await uploadResponse.json();
      console.log('✅ Uploaded to IPFS:', ipfsUrl);

      // 2. Create derivative meme record
      console.log('💾 Creating derivative meme record...');
      const createResponse = await fetch('/api/memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl: ipfsUrl,
          ipfsUrl,
          parentIpId: originalMeme.ipId,
          licenseType,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create derivative record');
      }

      const { meme: newMeme } = await createResponse.json();
      console.log('✅ Created derivative meme:', newMeme);

      // 3. Register derivative on Story Protocol
      // TODO: Implement Story Protocol derivative registration
      
      alert('Evolution created successfully!');
      router.push(`/certificate/${newMeme.id}`);
    } catch (error: any) {
      console.error('❌ Error creating evolution:', error);
      alert(`Failed to create evolution: ${error.message}`);
    } finally {
      setMinting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading original IP…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !originalMeme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300 mb-6">
            {error || 'Original meme not found or still syncing on-chain'}
          </p>
          <button
            onClick={() => router.push('/explore')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4">
            EVOLVE THE STORY
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create a derivative work and extend the legacy of an existing IP.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN - Original IP */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 h-fit sticky top-4">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
              <span>🎨</span> Evolving From
            </h2>
            
            <div className="space-y-6">
              {/* Original Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-lg shadow-purple-500/20">
                <Image
                  src={originalMeme.imageUrl || originalMeme.ipfsUrl}
                  alt={originalMeme.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Original Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Title</label>
                  <p className="text-white font-semibold text-xl mt-1">{originalMeme.title}</p>
                </div>

                {originalMeme.description && (
                  <div>
                    <label className="text-sm text-gray-400 uppercase tracking-wide">Description</label>
                    <p className="text-gray-300 mt-1">{originalMeme.description}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Creator</label>
                  <p className="text-gray-300 font-mono text-sm mt-1">
                    {originalMeme.creator?.name || 'Anonymous'}
                  </p>
                </div>

                {/* Status Badge */}
                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Status</label>
                  <div className="mt-2">
                    {originalMeme.ipId ? (
                      <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-500/50 rounded-lg px-4 py-2">
                        <span className="text-green-400 text-lg">✅</span>
                        <span className="text-green-400 font-semibold">Registered on Story</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-yellow-900/30 border border-yellow-500/50 rounded-lg px-4 py-2">
                        <span className="text-yellow-400 text-lg">⏳</span>
                        <span className="text-yellow-400 font-semibold">Pending on Story</span>
                      </div>
                    )}
                  </div>
                </div>

                {originalMeme.ipId && (
                  <>
                    <div>
                      <label className="text-sm text-gray-400 uppercase tracking-wide">IP Asset ID</label>
                      <p className="text-purple-400 font-mono text-xs break-all mt-1 bg-gray-900/50 p-3 rounded-lg">
                        {originalMeme.ipId}
                      </p>
                    </div>

                    <a
                      href={`https://aeneid.explorer.story.foundation/ipa/${originalMeme.ipId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-sm w-full justify-center"
                    >
                      <span>🔍 View on Story Explorer</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Create Evolution */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <span>🧬</span> Create Evolution
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">
                  Evolved Image *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="derivative-file"
                    required
                  />
                  <label
                    htmlFor="derivative-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-cyan-500/50 rounded-xl cursor-pointer hover:border-cyan-400 transition-colors bg-gray-900/50 hover:bg-gray-900/70"
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain rounded-xl p-2"
                        />
                        <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          Preview
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <svg className="w-16 h-16 mx-auto mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-cyan-400 font-semibold text-lg mb-1">Click to upload your evolution</p>
                        <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your evolution a title"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe how your work builds upon the original..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors resize-none"
                />
              </div>

              {/* License Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">
                  License Type
                </label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                >
                  <option value="commercial">Commercial Use</option>
                  <option value="non-commercial">Non-Commercial</option>
                  <option value="personal">Personal Use Only</option>
                </select>
              </div>

              {/* License Notice */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">⚖️</span>
                  <div>
                    <p className="text-yellow-400 font-semibold text-sm mb-1">License Agreement</p>
                    <p className="text-gray-300 text-sm">
                      By creating a derivative, you agree to the terms of the parent IP's license. 
                      Revenue sharing may apply according to the license terms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={minting || !derivativeFile || !title || !originalMeme.ipId}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:shadow-none text-lg"
              >
                {minting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Registering derivative IP on Story…</span>
                  </span>
                ) : !originalMeme.ipId ? (
                  <span>⏳ Waiting for original to be registered</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🚀 Mint Evolved Meme</span>
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Build Upon</h3>
            <p className="text-gray-300 text-sm">
              Create new works inspired by existing IP while respecting creator rights
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
            <div className="text-4xl mb-3">⛓️</div>
            <h3 className="text-lg font-bold text-cyan-400 mb-2">On-Chain Legacy</h3>
            <p className="text-gray-300 text-sm">
              Your derivative is linked to the parent IP on Story Protocol blockchain
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-lg font-bold text-pink-400 mb-2">Fair Revenue</h3>
            <p className="text-gray-300 text-sm">
              Automatic royalty sharing ensures original creators benefit from derivatives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
