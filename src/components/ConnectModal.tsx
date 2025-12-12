'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const { connect, connecting, error, clearError } = useWallet();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  if (!isOpen) return null;

  const walletOptions = [
    {
      id: 'injected',
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      icon: '🦊',
      available: typeof window !== 'undefined' && !!window.ethereum,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan QR code with your mobile wallet',
      icon: '📱',
      available: true,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect using Coinbase Wallet',
      icon: '🔵',
      available: true,
    },
  ];

  const handleConnect = async (providerId: string) => {
    setSelectedProvider(providerId);
    clearError();

    if (providerId === 'injected' && typeof window !== 'undefined' && !window.ethereum) {
      // Show MetaMask install prompt
      return;
    }

    await connect(providerId as 'injected' | 'walletconnect' | 'coinbase');
    
    if (!error) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-cyan-500/50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Connect Wallet
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Choose your preferred wallet to connect to Meme IP Vault
          </p>
        </div>

        {/* Wallet Options */}
        <div className="p-6 space-y-3">
          {walletOptions.map((wallet) => (
            <div key={wallet.id}>
              {wallet.available ? (
                <button
                  onClick={() => handleConnect(wallet.id)}
                  disabled={connecting && selectedProvider === wallet.id}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-cyan-900/30 hover:to-purple-900/30 border-2 border-gray-700 hover:border-cyan-500/50 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  aria-label={`Connect with ${wallet.name}`}
                >
                  {/* Icon */}
                  <div className="text-4xl">{wallet.icon}</div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {wallet.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {wallet.description}
                    </div>
                  </div>

                  {/* Loading or Arrow */}
                  <div className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                    {connecting && selectedProvider === wallet.id ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ) : (
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl transition-all duration-300 hover:border-orange-500/50 group"
                >
                  {/* Icon */}
                  <div className="text-4xl opacity-50">{wallet.icon}</div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-500">
                      {wallet.name} <span className="text-xs">(Not Installed)</span>
                    </div>
                    <div className="text-xs text-orange-400 group-hover:text-orange-300">
                      Click to install MetaMask extension
                    </div>
                  </div>

                  {/* External Link Icon */}
                  <div className="text-orange-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div className="flex-1">
                <div className="font-bold text-red-400 text-sm">Connection Error</div>
                <div className="text-red-300 text-xs mt-1">{error}</div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300"
                aria-label="Clear error"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-cyan-500/30 bg-gray-900/50">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your private keys never leave your wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
