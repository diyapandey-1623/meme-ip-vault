'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import ConnectModal from './ConnectModal';

export default function ConnectButton() {
  const { walletAddress, connected, disconnect, chainId } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowDropdown(false);
  };

  const handleSwitchWallet = () => {
    setShowDropdown(false);
    setShowModal(true);
  };

  if (connected && walletAddress) {
    return (
      <>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative px-6 py-2.5 rounded-full font-medium text-white
              bg-gradient-to-r from-green-500 to-emerald-500
              hover:from-green-400 hover:to-emerald-400
              transition-all duration-300 shadow-lg
              hover:shadow-green-500/50 hover:shadow-xl
              flex items-center gap-2"
            aria-label="Wallet menu"
          >
            {/* Connected Indicator */}
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            
            {/* Address */}
            <span className="font-mono">{formatAddress(walletAddress)}</span>
            
            {/* Dropdown Arrow */}
            <svg 
              className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>

            {/* Chain Badge (if not on Story Protocol testnet) */}
            {chainId && chainId !== 1513 && (
              <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                Wrong Network
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                {/* Wallet Info */}
                <div className="p-4 border-b border-gray-800">
                  <p className="text-xs text-gray-400 mb-1">Connected Wallet</p>
                  <p className="text-sm text-white font-mono break-all">{walletAddress}</p>
                  
                  {/* Chain Info */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${chainId === 1513 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <p className="text-xs text-gray-400">
                      Chain ID: <span className="text-white">{chainId || 'Unknown'}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={handleSwitchWallet}
                    className="w-full px-4 py-3 text-left text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center gap-2 font-semibold rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Switch Wallet
                  </button>

                  <button
                    onClick={handleDisconnect}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 font-semibold rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Connect Modal */}
        <ConnectModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative px-6 py-2.5 rounded-full font-semibold text-white
          bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500
          hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400
          transition-all duration-300 shadow-lg
          hover:shadow-cyan-500/50 hover:shadow-xl"
        aria-label="Connect wallet"
      >
        Connect Wallet
      </button>

      {/* Connect Modal */}
      <ConnectModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
