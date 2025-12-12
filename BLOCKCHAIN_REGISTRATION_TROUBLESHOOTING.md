# Troubleshooting Story Protocol Registration

## Problem: Meme shows "on-chain" but doesn't appear in Story Explorer

### Root Cause
Your previous code had a fallback to "demo mode" that created fake transaction hashes and IP IDs when registration failed. This made the UI show memes as "on-chain" even though they weren't actually registered on the blockchain.

### Solution Applied
I've removed the demo mode fallback. Now the system will:
1. **Properly fail** if registration doesn't work
2. **Show detailed error messages** to help debug
3. **Only mark memes as on-chain** if they're actually registered

## How to Verify Registration Works

### Step 1: Check Wallet Balance
Your wallet needs testnet tokens to pay for gas fees.

```bash
# Check your wallet address
# Your private key: 13e70f643325f94f31037f58863f72038b3e84f3a5fa66a98e1299916c02fabe
# Derives to address: (you'll see this in logs when uploading)
```

Get testnet tokens from: **https://faucet.story.foundation/**

### Step 2: Test Registration
1. Upload a new meme
2. Check the terminal/console logs for:
   ```
   🔗 Registering meme on Story Protocol blockchain...
   💰 Wallet balance: XXX wei (X.XX IP)
   🎨 Registering IP Asset with Story Protocol...
   ✅ Registration successful!
   🆔 IP Asset ID: 0x...
   📋 Transaction Hash: 0x...
   ```

### Step 3: Verify on Explorer
If registration succeeds, you should see:
```
🔍 View on Explorer: https://aeneid.explorer.story.foundation/ipa/0x...
```

Click that link to verify the IP Asset exists.

## Common Errors and Fixes

### Error: "Insufficient funds"
**Problem**: Wallet has no testnet tokens  
**Fix**: Get tokens from https://faucet.story.foundation/

### Error: "Story Protocol client initialization failed"
**Problem**: WALLET_PRIVATE_KEY not set correctly  
**Fix**: Check your `.env` file has the private key (without quotes)

### Error: "Transaction hash not returned"
**Problem**: Transaction failed or timed out  
**Fix**: 
- Check wallet has enough balance
- Try again (network might be congested)
- Check Story Protocol status

### Error: "Failed to register on Story Protocol"
**Problem**: Generic error from SDK  
**Fix**: Check the detailed error in console logs

## What Changed in the Code

### Before (Bad)
```typescript
try {
  const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({...});
  return { success: true, ipId: response.ipId };
} catch (error) {
  console.log('⚠️ Falling back to demo mode...');
  
  // ❌ Creates FAKE data
  const mockIpId = `0x${Math.random()...}`;
  const mockTxHash = `0x${Math.random()...}`;
  
  return {
    success: true,  // ❌ LIE - it actually failed!
    ipId: mockIpId,
    txHash: mockTxHash,
  };
}
```

### After (Good)
```typescript
try {
  // Check wallet balance first
  const balance = await publicClient.getBalance({ address: account.address });
  if (balance === BigInt(0)) {
    throw new Error('Insufficient funds!');
  }

  const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({...});
  
  // Verify transaction hash exists
  if (!response.txHash) {
    throw new Error('Transaction hash not returned');
  }

  return {
    success: true,
    ipId: response.ipId,
    txHash: response.txHash,
  };
} catch (error) {
  console.error('❌ Registration failed:', error);
  
  // ✅ Return actual error
  return {
    success: false,
    error: error.message,
  };
}
```

## Testing Checklist
- [ ] Wallet has testnet tokens from faucet
- [ ] `.env` file has correct `WALLET_PRIVATE_KEY`
- [ ] Upload a test meme
- [ ] Check console logs for success message
- [ ] Copy IP Asset ID from logs
- [ ] Visit `https://aeneid.explorer.story.foundation/ipa/{ipAssetId}`
- [ ] Verify the IP Asset shows up on explorer

## Additional Resources

- **Story Explorer**: https://aeneid.explorer.story.foundation/
- **Testnet Faucet**: https://faucet.story.foundation/
- **Story Protocol Docs**: https://docs.story.foundation/
- **Registration Tutorial**: https://docs.story.foundation/developers/register-an-nft

## Metadata Structure

The new implementation uses proper metadata format:

```typescript
// IP Metadata (Story Protocol format)
{
  title: "My Meme",
  description: "A funny meme",
  attributes: [
    { key: "Content Type", value: "Meme" },
    { key: "License Type", value: "Credit Required" },
    { key: "Content Hash", value: "abc123..." }
  ]
}

// NFT Metadata (ERC-721 format)
{
  name: "My Meme",
  description: "A funny meme",
  image: "https://ipfs.io/ipfs/..."
}
```

Both are stored as base64-encoded data URIs on-chain.
