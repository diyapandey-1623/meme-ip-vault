'use client';

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { custom, createPublicClient, http, defineChain } from 'viem';
import { createWalletClient } from 'viem';

// Define Story Aeneid Testnet chain
const aeneid = defineChain({
  id: 1315,
  name: 'Story Aeneid Testnet',
  network: 'aeneid',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Story Explorer', url: 'https://aeneid.storyscan.io' },
  },
  testnet: true,
});

// SPG NFT Contract on Story Aeneid Testnet (Official Public Collection)
export const SPG_NFT_CONTRACT = '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc' as `0x${string}`;

// Public client for reading blockchain data
const publicClient = createPublicClient({
  chain: aeneid,
  transport: http("https://aeneid.storyrpc.io"),
});

/**
 * Create a Story Protocol client using the user's connected wallet (MetaMask)
 * Network: Story Aeneid Testnet (chainId: 1315 / 0x523)
 * RPC: https://aeneid.storyrpc.io
 */
export async function createWalletStoryClient(): Promise<StoryClient | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    // Get the connected accounts
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    }) as string[];
    
    if (accounts.length === 0) {
      throw new Error('No wallet connected. Please connect your wallet first.');
    }

    // Create wallet client using custom transport (MetaMask)
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      account: accounts[0] as `0x${string}`,
    });

    const config: StoryConfig = {
      account: walletClient.account,
      transport: custom(window.ethereum),
      chainId: 'aeneid',
    };

    const client = StoryClient.newClient(config);
    return client;
  } catch (error) {
    return null;
  }
}

/**
 * Mint and register a meme as an IP Asset using Story Protocol Gateway (SPG)
 * This combines NFT minting + IP registration in ONE transaction
 */
export async function mintAndRegisterMeme(
  imageUrl: string,
  title: string,
  description: string
): Promise<{
  success: boolean;
  ipId?: string;
  txHash?: string;
  tokenId?: string;
  error?: string;
}> {
  try {
    // Validate inputs
    if (!imageUrl || !title) {
      throw new Error('Image URL and title are required');
    }
    
    // Create client with user's wallet
    const client = await createWalletStoryClient();
    if (!client) {
      throw new Error('Failed to initialize Story Protocol client. Please connect your wallet.');
    }

    // Prepare metadata following ERC721 standard
    const nftMetadata = {
      name: title,
      description: description || `A meme NFT: ${title}`,
      image: imageUrl, // This is the critical field for NFT image display
      attributes: [
        {
          trait_type: "Content Type",
          value: "Meme"
        },
        {
          trait_type: "Created",
          value: new Date().toISOString()
        }
      ]
    };

    const ipMetadata = {
      title: title,
      description: description || `A meme IP Asset: ${title}`,
      ipType: "Meme",
      attributes: [
        { key: "Content Type", value: "Meme" },
        { key: "Created", value: new Date().toISOString() }
      ]
    };

    // Convert to base64 data URIs with proper formatting
    const nftMetadataJSON = JSON.stringify(nftMetadata);
    const ipMetadataJSON = JSON.stringify(ipMetadata);
    
    const nftMetadataURI = `data:application/json;base64,${btoa(nftMetadataJSON)}`;
    const ipMetadataURI = `data:application/json;base64,${btoa(ipMetadataJSON)}`;
    
    // Create proper 32-byte hash using browser's crypto API (SHA-256)
    const encoder = new TextEncoder();
    const nftData = encoder.encode(nftMetadataJSON);
    const ipData = encoder.encode(ipMetadataJSON);
    
    const nftHashBuffer = await crypto.subtle.digest('SHA-256', nftData);
    const ipHashBuffer = await crypto.subtle.digest('SHA-256', ipData);
    
    // Convert ArrayBuffer to hex string with 0x prefix
    const toHexString = (buffer: ArrayBuffer): `0x${string}` => {
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `0x${hashHex}` as `0x${string}`;
    };
    
    const nftMetadataHash = toHexString(nftHashBuffer);
    const ipMetadataHash = toHexString(ipHashBuffer);

    // Use registerIpAsset with mint type (official Story Protocol method)
    console.log('🔗 Calling Story Protocol registerIpAsset...');
    const response = await client.ipAsset.registerIpAsset({
      nft: {
        type: 'mint',
        spgNftContract: SPG_NFT_CONTRACT,
      },
      ipMetadata: {
        ipMetadataURI,
        ipMetadataHash,
        nftMetadataURI,
        nftMetadataHash,
      },
    });

    if (!response.txHash) {
      throw new Error('Transaction hash not returned from Story Protocol');
    }

    console.log('📝 Transaction submitted:', response.txHash);
    console.log('⏳ Waiting for transaction confirmation...');

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash: response.txHash as `0x${string}`,
      confirmations: 1,
    });

    console.log('✅ Transaction confirmed!');
    console.log('🆔 IP Asset ID:', response.ipId);
    console.log('📋 Transaction Hash:', response.txHash);
    console.log('🎫 Token ID:', response.tokenId);

    return {
      success: true,
      ipId: response.ipId,
      txHash: response.txHash,
      tokenId: response.tokenId?.toString(),
    };

  } catch (error: any) {
    // Provide user-friendly error messages
    let errorMessage = error.message || 'Unknown error occurred';

    if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
      errorMessage = 'Transaction was rejected in your wallet';
    } else if (errorMessage.includes('insufficient funds')) {
      errorMessage = 'Insufficient IP tokens for gas fees. Get testnet tokens from Story faucet: https://aeneid.faucet.story.foundation/';
    } else if (errorMessage.includes('network')) {
      errorMessage = 'Network error. Please check your connection to Story Aeneid Testnet (Chain ID: 1315 / 0x523).';
    } else if (errorMessage.includes('nonce')) {
      errorMessage = 'Nonce error. Please reset your MetaMask account or try again.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
