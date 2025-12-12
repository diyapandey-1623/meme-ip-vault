# 🔗 Story Protocol Integration Guide

This guide explains how to integrate Story Protocol blockchain for on-chain IP protection of memes.

## What is Story Protocol?

Story Protocol is a blockchain network designed specifically for intellectual property (IP) management. By integrating it into Meme IP Vault, your memes get:

- **On-chain proof of ownership** - Immutable blockchain records
- **Programmable IP licenses** - Smart contract enforced licensing
- **Royalty tracking** - Automatic royalty payments
- **IP discoverability** - Discoverable on Story Protocol network

## Network Information

### Story Aeneid Testnet Details
- **Network Name**: Story Aeneid Testnet
- **Chain ID**: 1315 (0x523 in hex)
- **Currency Symbol**: IP
- **RPC URL**: https://aeneid.storyrpc.io
- **Block Explorer**: https://aeneid.explorer.story.foundation/
- **Faucet**: https://faucet.story.foundation/

## Prerequisites

### 1. Node.js & npm
- Node.js version 18 or later
- npm version 8 or later
- Check versions: `node -v` and `npm -v`

### 2. Story Protocol Wallet
You need a wallet with:
- Private key
- Some testnet tokens (for gas fees)
- **Correct network**: Chain ID 1315

## Adding Story Aeneid to MetaMask

### Method 1: Manual Addition
1. Open MetaMask
2. Click the network dropdown at the top
3. Click "Add Network" or "Add a network manually"
4. Enter the following details:

```
Network Name: Story Aeneid Testnet
RPC URL: https://aeneid.storyrpc.io
Chain ID: 1315
Currency Symbol: IP
Block Explorer URL: https://aeneid.explorer.story.foundation/
```

5. Click "Save"

### Method 2: Using Chainlist
1. Visit https://chainlist.org/chain/1315
2. Connect your wallet
3. Click "Add to MetaMask"

### Method 3: Using Story's Official Link
1. Visit https://chainid.network/chain/1315/
2. Follow the prompts to add the network

## Available RPC Endpoints

You can use any of these RPC URLs:

| RPC Provider | URL | Official |
|-------------|-----|----------|
| Story | `https://aeneid.storyrpc.io` | ✅ |
| Ankr | `https://rpc.ankr.com/story_aeneid_testnet` | |
| QuickNode | `https://www.quicknode.com/chains/story` | |
| Alchemy | `https://story-aeneid.g.alchemy.com/v2/${API_KEY}` | |

**Default**: Your project uses the official `https://aeneid.storyrpc.io`

## Block Explorers

| Explorer | URL | Purpose |
|----------|-----|---------|
| Blockscout | https://aeneid.storyscan.io | General transactions |
| IP Explorer | https://aeneid.explorer.story.foundation | IP Assets, Licenses, Royalties |
| Stakeme | https://aeneid.storyscan.app/ | Alternative explorer |

**Note**: Use the **IP Explorer** to view your registered memes!

## Installation Steps

### Step 1: Install Dependencies

The Story Protocol SDK is already added to `package.json`. Install it:

```bash
npm install
```

This installs:
- `@story-protocol/core-sdk` - Story Protocol SDK
- `viem` - Ethereum library for wallet operations

### Step 2: Get Testnet Tokens

1. Create a new wallet or use an existing one
2. Get your wallet's **private key** (KEEP THIS SECRET!)
3. Get your wallet's **address**
4. **Switch to Story Aeneid network** (Chain ID: 1315)
5. Visit one of these faucets (each gives 10 IP):
   - **Official Faucet**: https://aeneid.faucet.story.foundation/
   - **Google Cloud Faucet**: https://cloud.google.com/application/web3/faucet/story/aeneid
   - Paste your wallet address
   - Request testnet IP tokens
   - Wait 1-2 minutes

### Step 3: Configure Environment Variables

Update your `.env` file:

```env
DATABASE_URL="file:./dev.db"

# Story Protocol Configuration
WALLET_PRIVATE_KEY="your_actual_private_key_without_0x"
RPC_PROVIDER_URL="https://aeneid.storyrpc.io"
NEXT_PUBLIC_CHAIN_ID="aeneid"

# Optional: NFT Contract Address (if you have your own)
NFT_CONTRACT_ADDRESS="your_nft_contract_address"
WALLET_ADDRESS="your_wallet_address"
LICENSE_TEMPLATE_ADDRESS="your_license_template_address"
```

**Important Security Notes:**
- ⚠️ **NEVER commit `.env` file to git**
- ⚠️ **NEVER share your private key**
- ⚠️ Use a separate wallet for testing
- ⚠️ Only use testnet tokens, never mainnet

### Step 4: Update Database Schema

Since we added new fields to the Meme model, create a new migration:

```bash
npx prisma migrate dev --name add_story_protocol_fields
```

This adds:
- `ipId` - Story Protocol IP Asset ID
- `ipTxHash` - Transaction hash
- `licenseTermsId` - License terms ID
- `onChain` - Whether registered on blockchain

## How It Works

### Automatic Registration Flow

1. **User uploads a meme** via the Upload page
2. **Server processes the image**:
   - Generates perceptual hash
   - Creates watermarked version
   - Saves to database
3. **Background Story Protocol registration** (if configured):
   - Registers meme as IP Asset on Story Protocol
   - Attaches license terms
   - Records transaction hash
   - Updates database with `ipId` and `onChain: true`

### What Gets Registered?

When a meme is uploaded:
- **IP Asset** - The meme itself becomes an NFT IP Asset
- **Metadata** - Title, hash, creator info
- **License Terms** - Based on user selection:
  - Free to Use → `commercial-remix`
  - Credit Required → `non-commercial-social-remixing`
  - No Commercial → `non-commercial-social-remixing`

### Certificate Page Enhancement

The certificate page now shows:
- ✅ **On-Chain Status** - Whether registered on blockchain
- 🔗 **IP Asset ID** - Story Protocol identifier
- 🔗 **Transaction Hash** - Link to blockchain explorer
- ⛓️ **License Enforcement** - Smart contract enforced licensing

## Testing the Integration

### Test Without Story Protocol (Local Only)

If `WALLET_PRIVATE_KEY` is not set:
- App works normally
- Memes are saved to local database
- No blockchain registration
- Certificate shows "Pending or Not Configured"

### Test With Story Protocol (Full Integration)

1. Set up `.env` with valid private key and testnet tokens
2. Upload a meme
3. Wait a few seconds for blockchain confirmation
4. Refresh the certificate page
5. You should see:
   - "Story Protocol IP Asset" badge
   - IP Asset ID
   - Transaction hash with link to explorer

## Architecture

### Files Added/Modified

1. **`src/lib/storyClient.ts`**
   - Initializes Story Protocol client
   - Handles private key account setup
   - Singleton pattern for client instance

2. **`src/lib/storyProtocol.ts`**
   - `registerMemeAsIPAsset()` - Registers meme on-chain
   - `addLicenseTerms()` - Attaches license terms
   - `checkDuplicateIPAsset()` - Checks for duplicates
   - `recordRoyaltyPayment()` - Records royalty payments

3. **`src/app/api/memes/route.ts`**
   - Updated to call Story Protocol registration
   - Non-blocking async registration
   - Returns status in response

4. **`prisma/schema.prisma`**
   - Added Story Protocol fields to Meme model

5. **`src/app/certificate/[id]/page.tsx`**
   - Shows on-chain status
   - Displays IP Asset ID
   - Links to blockchain explorer

## API Response Example

When uploading a meme with Story Protocol enabled:

```json
{
  "meme": {
    "id": "clx123...",
    "title": "Epic Meme",
    "hash": "abc123...",
    "onChain": true,
    "ipId": "0x789...",
    "ipTxHash": "0xdef456..."
  },
  "duplicates": null,
  "storyProtocol": {
    "enabled": true,
    "message": "Registering on Story Protocol blockchain..."
  }
}
```

## Troubleshooting

### "Story Protocol not configured"
- Check that `WALLET_PRIVATE_KEY` is set in `.env`
- Verify private key format (without '0x' prefix is fine)
- Restart the dev server after updating `.env`

### "Failed to register IP Asset"
- Check wallet has testnet tokens
- Verify RPC URL is correct
- Check Story Protocol testnet status
- Look at console logs for detailed errors

### "Transaction failed"
- Insufficient gas/tokens
- Network congestion
- Invalid contract addresses

### Database errors after adding Story Protocol
- Run: `npx prisma migrate dev`
- This creates new migration for added fields

## Advanced Features

### Custom NFT Contract

If you want to use your own NFT contract:

1. Deploy an NFT contract on Story Protocol testnet
2. Set `NFT_CONTRACT_ADDRESS` in `.env`
3. Update `registerMemeAsIPAsset()` to use your contract

### License Templates

Story Protocol supports custom license templates:

1. Create a custom license template
2. Set `LICENSE_TEMPLATE_ADDRESS` in `.env`
3. Modify license mapping in `storyProtocol.ts`

### Royalty Collection

To enable royalty collection:

1. Set up royalty vault
2. Configure royalty split percentages
3. Use `recordRoyaltyPayment()` when usage fees are collected

## Resources

- [Story Protocol Documentation](https://docs.story.foundation/)
- [Story Protocol SDK Reference](https://github.com/storyprotocol/story-protocol-sdk)
- [Testnet Explorer](https://testnet.storyscan.xyz/)
- [Faucet](https://faucet.story.foundation/)
- [Discord Community](https://discord.gg/storyprotocol)

## Security Best Practices

1. **Never expose private keys** in client-side code
2. **Use environment variables** for sensitive data
3. **Keep `.env` in `.gitignore`**
4. **Use separate wallets** for development and production
5. **Rotate keys regularly**
6. **Monitor wallet balance** for unexpected transactions

## Next Steps

1. ✅ Install dependencies
2. ✅ Get testnet tokens
3. ✅ Configure environment variables
4. ✅ Run database migration
5. ✅ Test with a meme upload
6. ✅ Check certificate page for on-chain status
7. 🚀 Deploy to production with mainnet configuration

---

**Your memes are now protected by blockchain! 🔗🎭**
