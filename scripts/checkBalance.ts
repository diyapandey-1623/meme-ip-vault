import { createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Aeneid testnet configuration
const aeneidChain = {
  id: 1315, // 0x523 in hex
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

async function checkWalletBalance() {
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  
  if (!privateKey) {
    console.error('❌ WALLET_PRIVATE_KEY not found in .env file');
    process.exit(1);
  }

  const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}` as `0x${string}`);
  
  console.log('🔍 Checking wallet balance...\n');
  console.log(`📍 Wallet Address: ${account.address}`);
  
  const publicClient = createPublicClient({
    chain: aeneidChain,
    transport: http('https://aeneid.storyrpc.io'),
  });
  
  try {
    const balance = await publicClient.getBalance({ address: account.address });
    const balanceInIP = Number(balance) / 1e18;
    
    console.log(`💰 Balance: ${balance} wei`);
    console.log(`💰 Balance: ${balanceInIP.toFixed(6)} IP\n`);
    
    if (balance === BigInt(0)) {
      console.log('⚠️  Your wallet has no funds!');
      console.log('🚰 Get testnet tokens from: https://faucet.story.foundation/');
      console.log(`📋 Use this address: ${account.address}\n`);
    } else {
      console.log('✅ Wallet has sufficient balance for transactions\n');
    }
    
    // Check if this is the correct network
    const chainId = await publicClient.getChainId();
    console.log(`🌐 Connected to Chain ID: ${chainId}`);
    console.log(`🔗 Expected Chain ID: ${aeneidChain.id}`);
    
    if (chainId === aeneidChain.id) {
      console.log('✅ Connected to correct network (Aeneid Testnet)\n');
    } else {
      console.log('⚠️  Warning: Connected to different network!\n');
    }
    
  } catch (error) {
    console.error('❌ Error checking balance:', error);
    process.exit(1);
  }
}

checkWalletBalance();
