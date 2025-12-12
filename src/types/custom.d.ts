// TypeScript declarations for wallet provider modules

declare module '@walletconnect/web3-provider';
declare module '@coinbase/wallet-sdk';
declare module 'web3modal';

// Extend Window interface for Ethereum provider
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isBraveWallet?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}

export {};
