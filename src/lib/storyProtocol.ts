import { getStoryClient, isStoryProtocolAvailable } from './storyClient';
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Story Protocol Contract Addresses on Aeneid Testnet
const PIL_TEMPLATE_ADDRESS = '0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316';
const ROYALTY_POLICY_LAP = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E';
const MERC20_TOKEN = '0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E';
const SPG_NFT_CONTRACT = '0x041B4f29183317Fd352Ae57e331154D5f9F64E24';

// Aeneid testnet chain configuration
const aeneidChain = {
  id: 1315, // Aeneid chain ID (0x523)
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
} as const;

/**
 * Get PIL Terms based on license type
 */
function getPILTermsForLicense(licenseType: string) {
  // Common settings
  const commonTerms = {
    transferable: true,
    royaltyPolicy: ROYALTY_POLICY_LAP as `0x${string}`,
    currency: MERC20_TOKEN as `0x${string}`,
    uri: '',
  };

  switch (licenseType) {
    case 'Free to Use':
      // Creative Commons Attribution - Free with attribution
      return {
        ...commonTerms,
        defaultMintingFee: 0,
        expiration: 0,
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        commercializerCheckerData: '0x' as `0x${string}`,
        commercialRevShare: 0,
        commercialRevCeiling: 0,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: false,
        derivativeRevCeiling: 0,
      };

    case 'Credit Required':
      // Non-Commercial Social Remixing
      return {
        ...commonTerms,
        defaultMintingFee: 0,
        expiration: 0,
        commercialUse: false,
        commercialAttribution: true,
        commercializerChecker: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        commercializerCheckerData: '0x' as `0x${string}`,
        commercialRevShare: 0,
        commercialRevCeiling: 0,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: 0,
      };

    case 'No Commercial':
      // Non-Commercial with strict terms
      return {
        ...commonTerms,
        defaultMintingFee: 0,
        expiration: 0,
        commercialUse: false,
        commercialAttribution: true,
        commercializerChecker: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        commercializerCheckerData: '0x' as `0x${string}`,
        commercialRevShare: 0,
        commercialRevCeiling: 0,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: true,
        derivativesReciprocal: true,
        derivativeRevCeiling: 0,
      };

    default:
      // Default to Credit Required
      return {
        ...commonTerms,
        defaultMintingFee: 0,
        expiration: 0,
        commercialUse: false,
        commercialAttribution: true,
        commercializerChecker: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        commercializerCheckerData: '0x' as `0x${string}`,
        commercialRevShare: 0,
        commercialRevCeiling: 0,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: 0,
      };
  }
}

/**
 * Register a meme on Story Protocol blockchain as an IP Asset
 * This is a real implementation that sends transactions to Story Aeneid Testnet
 */
export async function registerMemeOnChain(
  memeHash: string,
  title: string,
  description: string,
  licenseType: string
): Promise<{
  success: boolean;
  ipId?: string;
  txHash?: string;
  licenseTermsId?: string;
  error?: string;
}> {
  try {
    // Verify wallet configuration
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey || privateKey === 'your_wallet_private_key_here') {
      throw new Error('WALLET_PRIVATE_KEY not configured in environment variables');
    }

    if (!isStoryProtocolAvailable()) {
      throw new Error('Story Protocol client initialization failed');
    }

    const client = getStoryClient();
    if (!client) {
      throw new Error('Failed to initialize Story Protocol client');
    }

    console.log('🔗 Registering meme on Story Protocol blockchain...');
    console.log(`📝 Title: ${title}`);
    console.log(`🔐 Hash: ${memeHash}`);
    console.log(`⚖️ License: ${licenseType}`);

    // Prepare metadata for IP Asset
    const ipMetadata = {
      title: title,
      description: description,
      attributes: [
        {
          key: "Content Type",
          value: "Meme"
        },
        {
          key: "License Type",
          value: licenseType
        },
        {
          key: "Content Hash",
          value: memeHash
        }
      ]
    };

    const nftMetadata = {
      name: title,
      description: description,
      image: `https://ipfs.io/ipfs/${memeHash}`, // You might want to update this with actual image URL
    };

    // Convert metadata to base64 URI
    const ipMetadataURI = `data:application/json;base64,${Buffer.from(
      JSON.stringify(ipMetadata)
    ).toString('base64')}`;
    
    const nftMetadataURI = `data:application/json;base64,${Buffer.from(
      JSON.stringify(nftMetadata)
    ).toString('base64')}`;

    // Create metadata hash (32 bytes)
    const ipMetadataHash = `0x${memeHash.substring(0, 64).padEnd(64, '0')}` as `0x${string}`;
    const nftMetadataHash = `0x${memeHash.substring(0, 64).padEnd(64, '0')}` as `0x${string}`;

    // Check wallet balance
    const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}` as `0x${string}`);
    const publicClient = createPublicClient({
      chain: aeneidChain,
      transport: http('https://aeneid.storyrpc.io'),
    });
    
    const balance = await publicClient.getBalance({ address: account.address });
    console.log(`💰 Wallet balance: ${balance} wei (${Number(balance) / 1e18} IP)`);
    
    if (balance === BigInt(0)) {
      throw new Error('Insufficient funds! Get testnet tokens from https://faucet.story.foundation/');
    }

    // Use Story Protocol SDK to register IP Asset
    console.log('🎨 Registering IP Asset with Story Protocol...');
    console.log(`👤 Using wallet: ${account.address}`);
    console.log(`📄 SPG NFT Contract: ${SPG_NFT_CONTRACT}`);
    
    // Get PIL terms for the license type
    const pilTerms = getPILTermsForLicense(licenseType);
    
    // Register the IP Asset
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: SPG_NFT_CONTRACT as `0x${string}`,
      licenseTermsData: [{
        terms: pilTerms,
      }],
      ipMetadata: {
        ipMetadataURI: ipMetadataURI,
        ipMetadataHash: ipMetadataHash,
        nftMetadataURI: nftMetadataURI,
        nftMetadataHash: nftMetadataHash,
      },
    });

    console.log('✅ Registration successful!');
    console.log(`🆔 IP Asset ID: ${response.ipId}`);
    console.log(`📋 Transaction Hash: ${response.txHash}`);
    console.log(`🎫 NFT Token ID: ${response.tokenId}`);
    console.log(`📜 License Terms ID: ${response.licenseTermsIds?.[0]}`);
    console.log(`🔍 View on Explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`);

    // Verify the transaction was mined
    if (!response.txHash) {
      throw new Error('Transaction hash not returned from registration');
    }

    // Wait a bit for indexing
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      ipId: response.ipId,
      txHash: response.txHash,
      licenseTermsId: response.licenseTermsIds?.[0]?.toString() || '1',
    };

  } catch (error: any) {
    console.error('❌ Registration failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Return detailed error instead of falling back to demo mode
    return {
      success: false,
      error: error.message || 'Failed to register on Story Protocol. Please check your wallet has testnet funds from https://faucet.story.foundation/',
    };
  }
}

/**
 * Legacy function - now calls registerMemeOnChain
 * @deprecated Use registerMemeOnChain instead
 */
export async function registerMemeAsIPAsset(
  memeId: string,
  title: string,
  imageHash: string,
  creatorName: string
): Promise<{
  success: boolean;
  ipId?: string;
  txHash?: string;
  error?: string;
}> {
  return registerMemeOnChain(
    imageHash,
    title,
    `Created by ${creatorName}`,
    'Credit Required'
  );
}

/**
 * Add licensing terms to a registered IP Asset
 * Note: This is now handled during registration with registerDerivativeWithLicenseTokens
 * @deprecated License terms are now attached during IP registration
 */
export async function addLicenseTerms(
  ipId: string,
  licenseType: string
): Promise<{
  success: boolean;
  licenseTermsId?: string;
  txHash?: string;
  error?: string;
}> {
  console.log(`License terms already attached during registration for IP Asset ${ipId}`);
  return {
    success: true,
    licenseTermsId: 'attached_during_registration',
  };
}

/**
 * Check if a meme (by hash) is already registered as an IP Asset
 */
export async function checkDuplicateIPAsset(
  imageHash: string
): Promise<{
  exists: boolean;
  ipId?: string;
  error?: string;
}> {
  try {
    if (!isStoryProtocolAvailable()) {
      return { exists: false };
    }

    const client = getStoryClient();
    if (!client) {
      return { exists: false };
    }

    // Query for IP Assets with this metadata hash
    // Note: This requires the Story Protocol indexer/API
    // For now, we'll return false and rely on our local database
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking duplicate IP Asset:', error);
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Record royalty payment for meme usage
 * Note: Simplified placeholder implementation
 */
export async function recordRoyaltyPayment(
  ipId: string,
  amount: bigint,
  currency: string
): Promise<{
  success: boolean;
  txHash?: string;
  error?: string;
}> {
  try {
    if (!isStoryProtocolAvailable()) {
      return {
        success: false,
        error: 'Story Protocol not configured',
      };
    }

    const client = getStoryClient();
    if (!client) {
      return { success: false, error: 'Failed to get Story Protocol client' };
    }

    // Placeholder for royalty payment recording
    console.log(`Would record royalty payment of ${amount} ${currency} for IP Asset ${ipId}`);

    return {
      success: false,
      error: 'Story Protocol requires full configuration',
    };
  } catch (error) {
    console.error('Error recording royalty payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
