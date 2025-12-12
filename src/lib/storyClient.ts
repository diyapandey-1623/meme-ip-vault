import { http } from 'viem';
import { Account, privateKeyToAccount, Address } from 'viem/accounts';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';

/**
 * Initialize Story Protocol Client with private key
 * This is used for backend operations (admin account)
 */
export function initStoryClient(): StoryClient | null {
  try {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    
    if (!privateKey) {
      console.warn('WALLET_PRIVATE_KEY not set. Story Protocol features will be disabled.');
      return null;
    }

    // Remove '0x' prefix if present and add it back
    const cleanKey = privateKey.replace('0x', '');
    const formattedKey: Address = `0x${cleanKey}` as Address;
    
    const account: Account = privateKeyToAccount(formattedKey);

    const config: StoryConfig = {
      account: account,
      transport: http(process.env.RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io'),
      chainId: 'aeneid', // Aeneid testnet chain ID
    };

    return StoryClient.newClient(config);
  } catch (error) {
    console.error('Failed to initialize Story Protocol client:', error);
    return null;
  }
}

/**
 * Get a singleton instance of the Story Protocol client
 */
let clientInstance: StoryClient | null = null;

export function getStoryClient(): StoryClient | null {
  if (!clientInstance) {
    clientInstance = initStoryClient();
  }
  return clientInstance;
}

/**
 * Check if Story Protocol is available
 */
export function isStoryProtocolAvailable(): boolean {
  return getStoryClient() !== null;
}
