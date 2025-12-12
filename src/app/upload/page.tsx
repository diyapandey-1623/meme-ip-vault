'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mintAndRegisterMeme } from '@/lib/walletStoryClient';

const LICENSE_OPTIONS = [
  { value: 'Free to Use', label: 'Free to Use - Anyone can use it' },
  { value: 'Credit Required', label: 'Credit Required - Must credit the creator' },
  { value: 'No Commercial', label: 'No Commercial - Brands cannot use it' },
];

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mintingStatus, setMintingStatus] = useState<'idle' | 'uploading' | 'registering' | 'success' | 'error'>('idle');
  const [mintResult, setMintResult] = useState<{ipId?: string; txHash?: string; tokenId?: string} | null>(null);
  const [error, setError] = useState('');
  const [memeId, setMemeId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    license: 'Free to Use',
    inMarketplace: false,
    creatorName: '',
    isCollaboration: false,
  });

  const [collaborators, setCollaborators] = useState<Array<{name: string; walletAddress: string}>>([{name: '', walletAddress: ''}]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    checkWalletConnection();
    
    // Check if coming from AI generator
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'generate') {
      loadGeneratedMeme();
    }
    
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', () => window.location.reload());
      
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const loadGeneratedMeme = async () => {
    try {
      const storedData = localStorage.getItem('generatedMemeForMint');
      if (!storedData) return;

      const { imageUrl, prompt } = JSON.parse(storedData);
      
      console.log('📥 Loading AI-generated meme from localStorage');
      console.log('🖼️ Image URL type:', imageUrl.substring(0, 30) + '...');
      
      // Convert base64 data URL to File object
      let file: File;
      
      if (imageUrl.startsWith('data:')) {
        // It's a base64 data URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        file = new File([blob], `ai-generated-${Date.now()}.png`, { 
          type: 'image/png',
          lastModified: Date.now()
        });
      } else {
        // It's a regular URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        file = new File([blob], `generated-meme-${Date.now()}.png`, { 
          type: blob.type || 'image/png',
          lastModified: Date.now()
        });
      }
      
      console.log('✅ File created:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      setSelectedFile(file);
      setPreviewUrl(imageUrl);
      setFormData(prev => ({
        ...prev,
        title: prompt.substring(0, 50) || 'AI Generated Meme',
        description: `Generated with AI: ${prompt}`,
      }));

      // Clear from localStorage
      localStorage.removeItem('generatedMemeForMint');
    } catch (error) {
      console.error('❌ Error loading generated meme:', error);
      setError('Failed to load AI-generated image. Please try generating again.');
    }
  };

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check if user explicitly disconnected
      const isDisconnected = localStorage.getItem('wallet_disconnected');
      if (isDisconnected) {
        return; // Don't auto-reconnect
      }
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          await checkNetwork();
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const checkNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
        setIsCorrectNetwork(chainId === '0x523' || parseInt(chainId, 16) === 1315);
      } catch (error) {
        console.error('Error checking network:', error);
        setIsCorrectNetwork(false);
      }
    }
  };

  const handleAccountsChanged = (...args: any[]) => {
    const accounts = args[0] as string[];
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      checkNetwork();
    } else {
      setWalletAddress(null);
      setIsCorrectNetwork(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Please install MetaMask to use this feature');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      setWalletAddress(accounts[0]);
      await checkNetwork();
    } catch (error) {
      setError('Failed to connect wallet');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isCorrectNetwork) {
      setError('Please switch to Story Aeneid Testnet (Chain ID: 1315)');
      return;
    }
    
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setMintingStatus('uploading');

    try {
      // Step 1: Upload to IPFS and register on blockchain via API
      console.log('📤 Starting upload process...');
      console.log('📁 File details:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
      
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('license', formData.license);
      formDataToSend.append('creatorName', formData.creatorName || 'Anonymous');
      formDataToSend.append('registerOnChain', 'false'); // We'll handle blockchain registration in frontend

      const uploadResponse = await fetch('/api/memes', {
        method: 'POST',
        body: formDataToSend,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload meme');
      }

      console.log('✅ Upload successful!', uploadData);
      
      // Extract IPFS data from response
      const publicImageUrl = uploadData.data.ipfs.url; // ipfs://CID format
      const ipfsHash = uploadData.data.ipfs.hash;
      const gatewayUrl = uploadData.data.ipfs.gatewayUrl;
      
      console.log('🔗 IPFS URI:', publicImageUrl);
      console.log('🔗 IPFS Hash:', ipfsHash);
      console.log('🌐 Gateway URL:', gatewayUrl);

      // Step 2: Mint NFT and register as IP Asset
      console.log('🔗 Starting blockchain registration...');
      console.log('⚠️ Please confirm the transaction in MetaMask');
      setMintingStatus('registering');

      const mintResult = await mintAndRegisterMeme(
        publicImageUrl,
        formData.title,
        formData.description
      );

      console.log('📋 Mint result:', mintResult);

      if (!mintResult.success) {
        throw new Error(mintResult.error || 'Blockchain registration failed');
      }

      // Success!
      console.log('✅ Blockchain registration successful!');
      console.log('🆔 IP Asset ID:', mintResult.ipId);
      console.log('📝 Transaction Hash:', mintResult.txHash);
      console.log('🎫 Token ID:', mintResult.tokenId);
      
      setMintResult(mintResult);
      setMintingStatus('success');

      // Show success message with all data
      alert(`
✅ Meme Uploaded Successfully!

📝 Title: ${formData.title}
🔗 IPFS: ${ipfsHash}
🌐 View: ${gatewayUrl}

🔗 Blockchain:
🆔 IP ID: ${mintResult.ipId}
📝 TX: ${mintResult.txHash}
🎫 Token: ${mintResult.tokenId}

View on Story Explorer:
https://explorer.story.foundation
      `.trim());

    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload meme');
      setMintingStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-bold">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-cyan-500/30">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-cyan-500 mb-4">
              Upload Your Meme
            </h1>
            <p className="text-gray-300 text-lg">
              Protect your creation with blockchain-powered IP registration
            </p>
          </div>



          {/* Wallet Connection Status */}
          {!walletAddress && (
            <div className="mb-8 bg-amber-900/20 border-l-4 border-amber-400 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-300 mb-2">Wallet Required</h3>
                  <p className="text-amber-200 mb-4">
                    You need to connect your wallet to upload and register memes on-chain.
                  </p>
                  <button
                    onClick={connectWallet}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}

          {walletAddress && !isCorrectNetwork && (
            <div className="mb-8 bg-red-900/20 border-l-4 border-red-400 p-6 rounded-lg">
              <div className="flex items-start">
                <div>
                  <h3 className="text-lg font-bold text-red-300 mb-2">Wrong Network</h3>
                  <p className="text-red-200">
                    Please switch to Story Aeneid Testnet (Chain ID: 1315) to continue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg">
              <div className="flex items-center">
                <p className="text-red-300 font-bold">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {mintingStatus === 'success' && mintResult && (
            <div className="mb-8 bg-green-900/20 border-l-4 border-green-500 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-green-300 mb-4">✅ Registration Successful!</h3>
                  <div className="space-y-3 text-green-200">
                    <div className="bg-green-900/30 p-4 rounded-lg">
                      <p className="text-sm text-green-300 mb-1">IP Asset ID</p>
                      <p className="font-mono text-sm break-all">{mintResult.ipId}</p>
                    </div>
                    <div className="bg-green-900/30 p-4 rounded-lg">
                      <p className="text-sm text-green-300 mb-1">Token ID</p>
                      <p className="font-mono text-sm">{mintResult.tokenId}</p>
                    </div>
                    {mintResult.txHash && (
                      <div className="pt-2">
                        <a 
                          href={`https://aeneid.explorer.story.foundation/tx/${mintResult.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full text-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                          🔍 View on Story Explorer →
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-green-300 mt-4 italic">✨ Redirecting to certificate in 3 seconds...</p>
                </div>
              </div>
            </div>
          )}

          {/* Registering Progress */}
          {mintingStatus === 'registering' && (
            <div className="mb-8 bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-lg">
              <div className="flex items-start">
                <div>
                  <h3 className="text-lg font-bold text-blue-300 mb-2">⏳ Registering on Blockchain</h3>
                  <div className="space-y-3 text-blue-200">
                    <p className="font-bold text-yellow-300">
                      ⚡ ACTION REQUIRED: Check MetaMask and confirm the transaction!
                    </p>
                    <p>
                      1. A MetaMask popup should appear - click "Confirm"
                    </p>
                    <p>
                      2. Transaction will be mined on Story Aeneid Testnet (10-30 seconds)
                    </p>
                    <p className="text-sm text-blue-300 mt-3">
                      💡 If you don't see MetaMask popup, click the MetaMask extension icon in your browser.
                    </p>
                    <p className="text-sm text-yellow-300 mt-2">
                      ⚠️ Make sure you have IP tokens for gas fees. Get free testnet tokens at: 
                      <a 
                        href="https://aeneid.faucet.story.foundation/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline ml-1 hover:text-yellow-200"
                      >
                        Story Faucet
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-4 border-dashed border-cyan-500/30 rounded-2xl p-8 text-center bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-96 mx-auto rounded-lg shadow-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('');
                      setSelectedFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-12 h-12 hover:bg-red-600 transform hover:scale-110 transition-all duration-200 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <label className="cursor-pointer">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-8 rounded-full inline-block hover:scale-110 transform transition-all duration-300 shadow-xl">
                      Choose Image File
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                  <p className="text-gray-500 mt-4">or drag and drop</p>
                </>
              )}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">
                Meme Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-cyan-500/30 text-white rounded-xl focus:border-cyan-500 focus:outline-none text-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="My Awesome Meme"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-800 border-2 border-cyan-500/30 text-white rounded-xl focus:border-cyan-500 focus:outline-none text-lg"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell the world about your meme..."
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">
                Creator Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 border-2 border-cyan-500/30 text-white rounded-xl focus:border-cyan-500 focus:outline-none text-lg"
                value={formData.creatorName}
                onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                placeholder="Your name or pseudonym"
              />
            </div>

            {/* Collaboration Option */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="collaboration"
                  checked={formData.isCollaboration}
                  onChange={(e) => setFormData({ ...formData, isCollaboration: e.target.checked })}
                  className="w-5 h-5 rounded border-purple-500/30 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="collaboration" className="text-white font-bold text-base cursor-pointer flex items-center gap-2">
                  This is a collaboration
                </label>
              </div>
              
              {formData.isCollaboration && (
                <div className="mt-4 space-y-3">
                  <label className="block text-purple-300 font-bold mb-2 text-sm">
                    Add Collaborators
                  </label>
                  
                  {collaborators.map((collab, index) => (
                    <div key={index} className="grid md:grid-cols-2 gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <label className="block text-purple-200 text-xs mb-1">Collaborator Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-900 border border-purple-500/30 text-white rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                          value={collab.name}
                          onChange={(e) => {
                            const newCollaborators = [...collaborators];
                            newCollaborators[index].name = e.target.value;
                            setCollaborators(newCollaborators);
                          }}
                          placeholder="Alice"
                        />
                      </div>
                      <div>
                        <label className="block text-purple-200 text-xs mb-1">Wallet Address</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 bg-gray-900 border border-purple-500/30 text-white rounded-lg focus:border-purple-500 focus:outline-none text-sm font-mono"
                            value={collab.walletAddress}
                            onChange={(e) => {
                              const newCollaborators = [...collaborators];
                              newCollaborators[index].walletAddress = e.target.value;
                              setCollaborators(newCollaborators);
                            }}
                            placeholder="0x123..."
                          />
                          {collaborators.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setCollaborators(collaborators.filter((_, i) => i !== index))}
                              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => setCollaborators([...collaborators, {name: '', walletAddress: ''}])}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-sm transition-all"
                  >
                    + Add Another Collaborator
                  </button>
                  
                  <p className="text-purple-300 text-xs mt-2">
                    Each collaborator's name and wallet address will be recorded on-chain.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2">
                License Type *
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-800 border-2 border-cyan-500/30 text-white rounded-xl focus:border-cyan-500 focus:outline-none text-lg"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
              >
                {LICENSE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-xl">
              <input
                type="checkbox"
                id="marketplace"
                checked={formData.inMarketplace}
                onChange={(e) => setFormData({ ...formData, inMarketplace: e.target.checked })}
                className="w-6 h-6 rounded border-cyan-500/30 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="marketplace" className="text-gray-300 font-medium text-lg cursor-pointer">
                List in marketplace for licensing opportunities
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFile || !walletAddress || !isCorrectNetwork}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-2xl py-6 rounded-full hover:scale-105 transform transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {mintingStatus === 'uploading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading Image...
                </span>
              ) : mintingStatus === 'registering' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Minting NFT & Registering IP...
                </span>
              ) : mintingStatus === 'success' ? (
                <span className="flex items-center justify-center">
                  ✅ Success! Redirecting...
                </span>
              ) : !walletAddress ? (
                '🔐 Connect Wallet to Upload'
              ) : !isCorrectNetwork ? (
                '⚠️ Switch to Story Aeneid Network'
              ) : (
                '🚀 Mint NFT & Register as IP Asset'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
