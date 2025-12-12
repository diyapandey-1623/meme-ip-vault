'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

// Web3Modal configuration with dynamic imports
let providerOptions: any = {};
let web3Modal: Web3Modal | null = null;

// Client-side only initialization
if (typeof window !== 'undefined') {
  try {
    const WalletConnectProvider = require('@walletconnect/web3-provider').default;
    const CoinbaseWalletSDK = require('@coinbase/wallet-sdk').default;

    providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            1513: process.env.NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL || 'https://testnet.storyrpc.io',
            9001: 'https://aeneid.storyrpc.io',
          },
          qrcodeModalOptions: {
            mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
          },
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: 'Meme IP Vault',
          jsonRpcUrl: process.env.NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL || 'https://testnet.storyrpc.io',
          chainId: parseInt(process.env.NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID || '1513'),
          darkMode: true,
        },
      },
    };
  } catch (error) {
    console.warn('Optional wallet providers not available:', error);
    // Continue without WalletConnect/Coinbase if packages aren't installed
  }

  web3Modal = new Web3Modal({
    network: 'sepolia',
    cacheProvider: true,
    providerOptions,
    theme: {
      background: 'rgb(17, 24, 39)',
      main: 'rgb(6, 182, 212)',
      secondary: 'rgb(156, 163, 175)',
      border: 'rgba(6, 182, 212, 0.3)',
      hover: 'rgb(3, 105, 161)',
    },
  });
}

export interface WalletState {
  walletAddress: string | null;
  connected: boolean;
  provider: any;
  signer: ethers.Signer | null;
  chainId: number | null;
  providerType: 'injected' | 'walletconnect' | 'coinbase' | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    walletAddress: null,
    connected: false,
    provider: null,
    signer: null,
    chainId: null,
    providerType: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Initialize from cache on mount
  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connect(localStorage.getItem('connectedProviderType') as any);
    }
  }, []);

  /**
   * Connect to wallet
   * @param providerType - 'injected' (MetaMask), 'walletconnect', or 'coinbase'
   */
  const connect = useCallback(async (providerType?: 'injected' | 'walletconnect' | 'coinbase') => {
    if (!web3Modal) {
      setError('Web3Modal not initialized');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      // Check for MetaMask if injected is requested
      if (providerType === 'injected' && typeof window !== 'undefined') {
        if (!window.ethereum) {
          setError('MetaMask not detected. Please install MetaMask.');
          window.open('https://metamask.io/download/', '_blank');
          setConnecting(false);
          return;
        }
      }

      // Connect to provider
      const instance = await web3Modal.connect();
      const ethersProvider = new ethers.BrowserProvider(instance);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const network = await ethersProvider.getNetwork();
      const chainId = Number(network.chainId);

      // Determine provider type
      let detectedProviderType: 'injected' | 'walletconnect' | 'coinbase' = 'injected';
      if (instance.isWalletConnect) {
        detectedProviderType = 'walletconnect';
      } else if (instance.isCoinbaseWallet) {
        detectedProviderType = 'coinbase';
      }

      // Save to localStorage
      localStorage.setItem('connectedProviderType', detectedProviderType);

      // Update state
      setState({
        walletAddress: address,
        connected: true,
        provider: instance,
        signer,
        chainId,
        providerType: detectedProviderType,
      });

      // Setup event listeners
      setupListeners(instance);

      // TODO: Optional - verify signature for backend authentication
      // const message = `Sign this message to authenticate with Meme IP Vault\nTimestamp: ${Date.now()}`;
      // const signature = await signer.signMessage(message);
      // Send to backend for verification

      console.log('✅ Wallet connected:', address);
      setConnecting(false);
    } catch (err: any) {
      console.error('❌ Connection error:', err);
      
      if (err.code === 4001) {
        setError('Connection rejected. Please try again.');
      } else if (err.message?.includes('User closed modal')) {
        setError('Connection cancelled');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
      
      setConnecting(false);
    }
  }, []);

  /**
   * Disconnect wallet and clear all state
   */
  const disconnect = useCallback(async () => {
    if (!state.provider) return;

    try {
      // Remove event listeners
      if (state.provider.removeListener) {
        state.provider.removeListener('accountsChanged', handleAccountsChanged);
        state.provider.removeListener('chainChanged', handleChainChanged);
        state.provider.removeListener('disconnect', handleDisconnect);
      }

      // Disconnect WalletConnect
      if (state.providerType === 'walletconnect' && state.provider.disconnect) {
        await state.provider.disconnect();
      }

      // Clear cached provider
      if (web3Modal) {
        web3Modal.clearCachedProvider();
      }

      // Clear localStorage
      localStorage.removeItem('connectedProviderType');

      // Reset state
      setState({
        walletAddress: null,
        connected: false,
        provider: null,
        signer: null,
        chainId: null,
        providerType: null,
      });

      console.log('✅ Wallet disconnected');
    } catch (err) {
      console.error('❌ Disconnect error:', err);
    }
  }, [state.provider, state.providerType]);

  /**
   * Switch to a specific network
   */
  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!state.provider) {
      setError('No provider connected');
      return;
    }

    try {
      const chainIdHex = `0x${targetChainId.toString(16)}`;
      
      await state.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      console.log(`✅ Switched to chain ${targetChainId}`);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await state.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: 'Story Protocol Testnet',
                rpcUrls: [process.env.NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL || 'https://testnet.storyrpc.io'],
                nativeCurrency: {
                  name: 'IP',
                  symbol: 'IP',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://testnet.storyscan.xyz'],
              },
            ],
          });
        } catch (addError) {
          setError('Failed to add network');
        }
      } else {
        setError('Failed to switch network');
      }
    }
  }, [state.provider]);

  /**
   * Setup event listeners for provider
   */
  const setupListeners = (provider: any) => {
    if (!provider.on) return;

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);
  };

  /**
   * Handle account changes
   */
  const handleAccountsChanged = async (accounts: string[]) => {
    console.log('🔄 Accounts changed:', accounts);
    
    if (accounts.length === 0) {
      // User disconnected
      disconnect();
    } else {
      // Account switched
      setState(prev => ({
        ...prev,
        walletAddress: accounts[0],
      }));
    }
  };

  /**
   * Handle chain changes
   */
  const handleChainChanged = (chainIdHex: string) => {
    const newChainId = parseInt(chainIdHex, 16);
    console.log('🔄 Chain changed:', newChainId);
    
    setState(prev => ({
      ...prev,
      chainId: newChainId,
    }));

    // Reload page on chain change (recommended by MetaMask)
    window.location.reload();
  };

  /**
   * Handle disconnect events
   */
  const handleDisconnect = () => {
    console.log('🔌 Provider disconnected');
    disconnect();
  };

  return {
    // State
    walletAddress: state.walletAddress,
    connected: state.connected,
    provider: state.provider,
    signer: state.signer,
    chainId: state.chainId,
    providerType: state.providerType,
    connecting,
    error,

    // Methods
    connect,
    disconnect,
    switchNetwork,
    clearError: () => setError(null),
  };
}
