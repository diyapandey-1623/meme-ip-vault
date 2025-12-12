# Multi-Wallet Connection Setup

## 📦 Installation

Install the required dependencies:

```bash
npm install ethers@6 web3modal@1.9.12 @walletconnect/web3-provider@1.8.0 @coinbase/wallet-sdk
```

Or with yarn:

```bash
yarn add ethers@6 web3modal@1.9.12 @walletconnect/web3-provider@1.8.0 @coinbase/wallet-sdk
```

## 🔑 Environment Variables

Add these to your `.env.local` file:

```env
# Optional: Get free Infura ID from https://infura.io
NEXT_PUBLIC_INFURA_ID=your_infura_project_id

# Story Protocol (already configured)
NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL=https://testnet.storyrpc.io
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=1513
```

## 🚀 Usage

### 1. Wrap your app with WalletProvider (Optional Context)

If you want global wallet state, create a context provider:

```tsx
// src/contexts/WalletContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWallet as useWalletHook } from '@/hooks/useWallet';

const WalletContext = createContext<ReturnType<typeof useWalletHook> | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useWalletHook();
  
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
```

Then wrap your app in `src/app/layout.tsx`:

```tsx
import { WalletProvider } from '@/contexts/WalletContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
```

### 2. Use the WalletConnectButton in your header

Replace the existing `ConnectWalletButton` with the new `WalletConnectButton`:

```tsx
// src/app/layout.tsx
import WalletConnectButton from '@/components/WalletConnectButton';

// In your navbar:
<WalletConnectButton />
```

### 3. Access wallet state in any component

```tsx
'use client';

import { useWallet } from '@/hooks/useWallet';

export default function MyComponent() {
  const { walletAddress, connected, signer, chainId } = useWallet();

  if (!connected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <p>Connected: {walletAddress}</p>
      <p>Chain ID: {chainId}</p>
    </div>
  );
}
```

### 4. Sign transactions

```tsx
const { signer, walletAddress } = useWallet();

// Send transaction
const tx = await signer.sendTransaction({
  to: '0x...',
  value: ethers.parseEther('0.1'),
});

await tx.wait();
```

### 5. Switch networks

```tsx
const { switchNetwork } = useWallet();

// Switch to Story Protocol testnet
await switchNetwork(1513);
```

## 🔐 Security Notes

- Private keys NEVER leave the user's wallet
- Connection state is stored in localStorage (only provider type, not keys)
- All sensitive operations happen in the user's wallet extension/app
- Sign-in signature verification should be done on your backend (see TODO comments)

## 🎨 Customization

### Customize Modal Theme

Edit the `web3Modal` theme in `src/hooks/useWallet.tsx`:

```tsx
theme: {
  background: 'rgb(17, 24, 39)',      // Modal background
  main: 'rgb(6, 182, 212)',            // Primary color (cyan)
  secondary: 'rgb(156, 163, 175)',     // Secondary text
  border: 'rgba(6, 182, 212, 0.3)',    // Border color
  hover: 'rgb(3, 105, 161)',           // Hover state
},
```

### Add More Wallets

Add to the `walletOptions` array in `src/components/ConnectModal.tsx`:

```tsx
{
  id: 'brave',
  name: 'Brave Wallet',
  description: 'Connect using Brave browser wallet',
  icon: '🦁',
  available: typeof window !== 'undefined' && window.ethereum?.isBraveWallet,
},
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'ethers'"

Make sure you installed ethers v6:
```bash
npm install ethers@6
```

### Wrong Network Warning

If users connect to the wrong network, the UI will show an orange "Wrong Network" badge. They can switch to Story Protocol testnet (chain ID 1513) from the dropdown menu.

### MetaMask Not Detected

The modal will show an "Install MetaMask" button linking to https://metamask.io/download/

### WalletConnect QR Not Showing

Make sure you have a valid Infura ID in your environment variables. Get one free at https://infura.io

## 📚 API Reference

### `useWallet()` Hook

Returns:

```tsx
{
  // State
  walletAddress: string | null;
  connected: boolean;
  provider: any;
  signer: ethers.Signer | null;
  chainId: number | null;
  providerType: 'injected' | 'walletconnect' | 'coinbase' | null;
  connecting: boolean;
  error: string | null;

  // Methods
  connect: (providerType?: 'injected' | 'walletconnect' | 'coinbase') => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (targetChainId: number) => Promise<void>;
  clearError: () => void;
}
```

### Events Handled

- `accountsChanged` - Auto-updates when user switches accounts
- `chainChanged` - Auto-updates and reloads page on network change
- `disconnect` - Auto-disconnects and clears state

## 🎯 Next Steps

1. **Backend Authentication**: Implement signature verification on your backend
2. **Session Management**: Store JWT tokens after successful wallet authentication
3. **Protected Routes**: Gate upload/mint features behind wallet connection
4. **Network Validation**: Force users to switch to Story Protocol testnet before transactions
