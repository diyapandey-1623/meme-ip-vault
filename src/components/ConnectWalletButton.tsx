'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Only check connection if user hasn't explicitly disconnected
    const isDisconnected = localStorage.getItem('wallet_disconnected');
    if (!isDisconnected) {
      checkConnection();
    }

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (...args: any[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          setWalletAddress(null);
        } else {
          // Only auto-connect if not explicitly disconnected
          const isDisconnected = localStorage.getItem('wallet_disconnected');
          if (!isDisconnected) {
            setWalletAddress(accounts[0]);
          }
        }
      };

      window.ethereum.on?.('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        }) as string[];
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async (walletType: 'metamask' | 'coinbase' | 'walletconnect') => {
    if (typeof window === 'undefined') return;

    setIsConnecting(true);
    setShowWalletModal(false);
    
    try {
      // Remove disconnect flag when user explicitly connects
      localStorage.removeItem('wallet_disconnected');
      
      let accounts: string[] = [];

      if (walletType === 'metamask') {
        if (!window.ethereum) {
          alert('MetaMask is not installed. Redirecting to download page...');
          window.open('https://metamask.io/download/', '_blank');
          return;
        }
        
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        
      } else if (walletType === 'coinbase') {
        // Check for Coinbase Wallet
        if (!window.ethereum || !(window.ethereum as any)?.isCoinbaseWallet) {
          alert('Coinbase Wallet not detected. Please install Coinbase Wallet extension.');
          window.open('https://www.coinbase.com/wallet/downloads', '_blank');
          return;
        }
        
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        
      } else if (walletType === 'walletconnect') {
        alert('WalletConnect integration coming soon! Please use MetaMask or Coinbase Wallet for now.');
        return;
      }

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setShowDropdown(false);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        alert('Connection request rejected. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    console.log('🔴 DISCONNECT WALLET BUTTON CLICKED');
    
    try {
      // Set disconnect flag FIRST to prevent auto-reconnect
      if (typeof window !== 'undefined') {
        localStorage.setItem('wallet_disconnected', 'true');
      }
      
      // Provider-level disconnect/close if available
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Try to disconnect if provider supports it
          if ((window.ethereum as any).disconnect) {
            await (window.ethereum as any).disconnect().catch(() => {});
          }
          if ((window.ethereum as any).close) {
            await (window.ethereum as any).close().catch(() => {});
          }
          
          // Remove all listeners
          try {
            if ((window.ethereum as any).removeAllListeners) {
              (window.ethereum as any).removeAllListeners();
            } else {
              window.ethereum.removeListener?.('accountsChanged', () => {});
              window.ethereum.removeListener?.('chainChanged', () => {});
              window.ethereum.removeListener?.('disconnect', () => {});
            }
          } catch (e) {
            console.log('Error removing listeners:', e);
          }
        } catch (e) {
          console.log('Error disconnecting provider:', e);
        }
      }
      
      // Clear Web3Modal and wallet-related storage
      if (typeof window !== 'undefined') {
        // Clear common wallet cache keys
        const walletKeys = [
          'WEB3_CONNECT_CACHED_PROVIDER',
          'walletconnect',
          'WALLETCONNECT_DEEPLINK_CHOICE',
          'connected',
          '-walletlink:https://www.walletlink.org:session:id',
          '-walletlink:https://www.walletlink.org:session:secret',
          '-walletlink:https://www.walletlink.org:session:linked'
        ];
        
        walletKeys.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        // Clear all keys that contain wallet-related terms
        Object.keys(localStorage).forEach(key => {
          if (key.toLowerCase().includes('wallet') || 
              key.toLowerCase().includes('web3') || 
              key.toLowerCase().includes('metamask') || 
              key.toLowerCase().includes('ethereum') ||
              key.toLowerCase().includes('coinbase')) {
            localStorage.removeItem(key);
          }
        });
        
        // Final clear
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Clear app state
      setWalletAddress(null);
      setShowDropdown(false);
      
      // Sign out from NextAuth session
      await signOut({ redirect: false }).catch(err => console.log('SignOut error:', err));
      
      console.log('✅ Wallet disconnected, reloading page...');
      
      // Small delay then reload to ensure all state is cleared
      setTimeout(() => {
        window.location.href = '/';
      }, 200);
      
    } catch (error) {
      console.error('❌ Error disconnecting wallet:', error);
      
      // Force clear anyway
      setWalletAddress(null);
      setShowDropdown(false);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('wallet_disconnected', 'true');
        localStorage.clear();
        sessionStorage.clear();
      }
      
      window.location.href = '/';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Prevent hydration errors
  if (!mounted) {
    return (
      <button
        disabled
        className="relative px-6 py-2.5 rounded-full font-semibold text-white
          bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500
          opacity-50 cursor-not-allowed"
      >
        Connect Wallet
      </button>
    );
  }

  if (walletAddress) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative px-6 py-2.5 rounded-full font-medium text-white
            bg-gradient-to-r from-green-500 to-emerald-500
            hover:from-green-400 hover:to-emerald-400
            transition-all duration-300 shadow-lg
            hover:shadow-green-500/50 hover:shadow-xl
            flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          {formatAddress(walletAddress)}
          <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Connected Wallet</p>
                <p className="text-sm text-white font-mono break-all">{walletAddress}</p>
              </div>
              <button
                onClick={disconnectWallet}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect Wallet
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowWalletModal(true)}
        disabled={isConnecting}
        className="relative px-6 py-2.5 rounded-full font-semibold text-white
          bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500
          hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400
          transition-all duration-300 shadow-lg
          hover:shadow-cyan-500/50 hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          'Connect Wallet'
        )}
      </button>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setShowWalletModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border-2 border-cyan-500/30 rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
              {/* Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
                  <button
                    onClick={() => setShowWalletModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-400 mt-2 text-sm">Choose your preferred wallet to connect</p>
              </div>

              {/* Wallet Options */}
              <div className="p-6 space-y-3">
                {/* MetaMask */}
                <button
                  onClick={() => connectWallet('metamask')}
                  disabled={isConnecting}
                  className="w-full p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl hover:border-orange-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🦊</span>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-white font-semibold text-lg">MetaMask</h3>
                      <p className="text-gray-400 text-sm">Connect with MetaMask wallet</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Coinbase Wallet */}
                <button
                  onClick={() => connectWallet('coinbase')}
                  disabled={isConnecting}
                  className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl hover:border-blue-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">💼</span>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-white font-semibold text-lg">Coinbase Wallet</h3>
                      <p className="text-gray-400 text-sm">Connect with Coinbase Wallet</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* WalletConnect */}
                <button
                  onClick={() => connectWallet('walletconnect')}
                  disabled={isConnecting}
                  className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl hover:border-purple-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-white font-semibold text-lg">WalletConnect</h3>
                      <p className="text-gray-400 text-sm">Scan with mobile wallet</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800 bg-gray-800/50">
                <p className="text-xs text-gray-400 text-center">
                  🔒 We do not own your private keys and cannot access your funds
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
