'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConnectWalletPage() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    checkWalletStatus();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
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

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener?.('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const checkWalletStatus = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check if user explicitly disconnected
      const isDisconnected = localStorage.getItem('wallet_disconnected');
      if (isDisconnected) {
        return; // Don't auto-reconnect
      }
      
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        }) as string[];
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
        const chainId = await window.ethereum.request({ 
          method: 'eth_chainId' 
        }) as string;
        // Story Aeneid Testnet chain ID: 0x523 (1315 in decimal)
        setIsCorrectNetwork(chainId === '0x523' || parseInt(chainId, 16) === 1315);
      } catch (error) {
        console.error('Error checking network:', error);
        setIsCorrectNetwork(false);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await checkNetwork();
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const switchToAeneid = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    setError('');

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x523' }], // 1315 in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x523',
                chainName: 'Story Aeneid Testnet',
                nativeCurrency: {
                  name: 'IP',
                  symbol: 'IP',
                  decimals: 18,
                },
                rpcUrls: ['https://aeneid.storyrpc.io'],
                blockExplorerUrls: ['https://aeneid.explorer.story.foundation/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      } else {
        console.error('Error switching network:', switchError);
      }
    }
  };

  const handleContinue = () => {
    if (!walletAddress) {
      return; // Do nothing if no wallet
    }
    
    if (!isCorrectNetwork) {
      // Switch network instead of continuing
      switchToAeneid();
    } else {
      // Network is correct, proceed to upload
      router.push('/upload-meme');
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-bold">
            ← Back to Home
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <span className="text-cyan-400 font-semibold text-lg">Step 1: Connect Wallet</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-cyan-500 mb-6">
            🔐 Connect Your Wallet
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Connect your MetaMask wallet to start protecting your memes on Story Protocol blockchain
          </p>
        </div>

        {/* Main Card */}
        <div className="relative mb-12">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 animate-pulse"></div>
          
          {/* Card Content */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500/30 rounded-2xl p-8 md:p-12">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* MetaMask Not Detected */}
            {typeof window !== 'undefined' && !window.ethereum && (
              <div className="text-center mb-8 bg-amber-900/20 border-2 border-amber-500/50 rounded-xl p-8">
                <div className="text-6xl mb-4">🦊</div>
                <h3 className="text-2xl font-bold text-amber-300 mb-4">MetaMask Not Detected</h3>
                <p className="text-amber-200 mb-6">You need MetaMask to use this platform</p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg"
                >
                  Download MetaMask
                </a>
              </div>
            )}

            {/* Connect Button */}
            {!walletAddress && typeof window !== 'undefined' && window.ethereum && (
              <div className="text-center mb-8">
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-2xl rounded-2xl hover:from-cyan-400 hover:to-purple-500 transition-all shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? '🔄 Connecting...' : '🦊 Connect MetaMask'}
                </button>
                <p className="text-gray-400 mt-4 text-sm">Click to connect your wallet</p>
              </div>
            )}

            {/* Status Display */}
            {walletAddress && (
              <div className="bg-black/70 rounded-xl p-6 mb-8 border-2 border-gray-700">
                <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  Connection Status
                </h3>
                
                <div className="space-y-4">
                  {/* Wallet Address */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Wallet Address</span>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-mono text-lg">{formatAddress(walletAddress)}</span>
                    </div>
                  </div>
                  
                  {/* Network Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Network</span>
                    {isCorrectNetwork ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-400 font-semibold">Story Aeneid Testnet</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-400 font-semibold">Wrong Network</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Switch Network Warning */}
            {walletAddress && !isCorrectNetwork && (
              <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-red-300 mb-3">Wrong Network Detected</h3>
                    <p className="text-red-200 mb-4">
                      You're connected to the wrong network. Please switch to Story Aeneid Testnet to continue.
                    </p>
                    <button
                      onClick={switchToAeneid}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg hover:from-red-400 hover:to-pink-500 transition-all shadow-lg"
                    >
                      Switch to Story Aeneid
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            {walletAddress && isCorrectNetwork && (
              <Link
                href="/upload"
                className="block w-full py-6 rounded-xl font-black text-white text-2xl text-center
                  bg-gradient-to-r from-cyan-500 to-purple-600
                  hover:from-cyan-400 hover:to-purple-500
                  transition-all duration-300
                  shadow-2xl shadow-cyan-500/30
                  hover:shadow-purple-500/50
                  hover:scale-105"
              >
                Continue to Upload Meme →
              </Link>
            )}

            {/* Help Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-500 text-sm">Need help?</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://chainlist.org/chain/1315" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline text-sm"
                >
                  Add Network via Chainlist
                </a>
                <span className="text-gray-600">•</span>
                <a 
                  href="https://docs.story.foundation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline text-sm"
                >
                  Story Protocol Docs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/30">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="text-cyan-400 font-bold text-lg mb-2">Secure</h3>
            <p className="text-gray-400 text-sm">Your wallet stays in your control. We never access your private keys.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/30">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-purple-400 font-bold text-lg mb-2">Fast</h3>
            <p className="text-gray-400 text-sm">Register your memes on-chain in seconds with Story Protocol.</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/20 to-red-900/20 p-6 rounded-xl border border-pink-500/30">
            <div className="text-4xl mb-3">🌐</div>
            <h3 className="text-pink-400 font-bold text-lg mb-2">Decentralized</h3>
            <p className="text-gray-400 text-sm">Your IP ownership is stored on blockchain, permanent and immutable.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
