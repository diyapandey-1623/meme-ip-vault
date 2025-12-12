# Real Blockchain Registration Guide

## Current Issue

Your meme vault is NOT actually registering images on the Story Protocol blockchain. Here's why and how to fix it:

## The Problem

Story Protocol's `client.ipAsset.register()` method requires you to **own the NFT** you're trying to register. You can't just use an arbitrary `tokenId` on someone else's NFT contract (like the SPG NFT contract).

### What Was Happening:
```typescript
// ❌ This FAILS because you don't own tokenId on that contract
await client.ipAsset.register({
  nftContract: '0x041B4F29183317Fd352AE57e331154d5F9F64e24', // SPG NFT
  tokenId: BigInt(Date.now()), // Random token you don't own
  ...
});
```

## The Solution

You have **3 options** to properly register memes on Story Protocol:

### Option 1: Deploy Your Own NFT Contract (Recommended)

1. **Deploy an ERC721 NFT contract** where your wallet is the owner
2. **Mint NFTs** for each meme upload
3. **Register those NFTs** as IP Assets on Story Protocol

```typescript
// 1. Deploy your own NFT contract (do this once)
// Use OpenZeppelin's ERC721 contract
// Contract address will be something like: 0xYourContract...

// 2. When user uploads meme:
const nftContract = '0xYourOwnNFTContract';
const tokenId = await mintNFT(userAddress, metadataURI); // Mint new NFT

// 3. Register on Story Protocol
const response = await client.ipAsset.register({
  nftContract: nftContract,
  tokenId: tokenId,
  ipMetadata: { ... }
});
```

**Steps:**
1. Create `contracts/MemeNFT.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    
    constructor() ERC721("Meme IP Vault", "MEME") Ownable(msg.sender) {}
    
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds++;
        _mint(to, _tokenIds);
        return _tokenIds;
    }
}
```

2. Deploy using Hardhat/Foundry to Aeneid testnet
3. Update your code to use your contract address

### Option 2: Use Story Protocol Gateway (SPG)

Use the SPG contract which handles minting + registration in one call:

```typescript
const response = await client.nftClient.mintAndRegisterIpAssetWithPilTerms({
  nftContract: SPG_NFT_CONTRACT,
  pilType: 'non-commercial-social-remixing',
  metadata: {
    name: title,
    description: description,
    image: imageUrl, // Must be publicly accessible URL
  },
});
```

**Requirements:**
- Images must be hosted on IPFS or public URL
- Cannot use local file system paths
- Requires uploading images to IPFS first

### Option 3: Use Existing NFTs

If users already own NFTs, they can register those:

```typescript
// User must own this NFT
const response = await client.ipAsset.register({
  nftContract: userNftContract,
  tokenId: userTokenId,
  ipMetadata: { ... }
});
```

## Recommended Implementation

For your meme vault, **Option 1** is best:

1. **Deploy ERC721 contract** (one-time setup)
2. **Mint NFT** when user uploads meme
3. **Register NFT** as IP Asset on Story Protocol
4. **Store everything** in your database

### Complete Implementation:

```typescript
// 1. Deploy NFT contract (contracts/MemeNFT.sol)
// Deploy to Aeneid testnet: 0xYourMemeNFTContract

// 2. Update .env
MEME_NFT_CONTRACT=0xYourMemeNFTContract

// 3. Create minting function (src/lib/nftMinting.ts)
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import MemeNFTABI from './MemeNFT.json';

export async function mintMemeNFT(
  recipientAddress: string,
  metadataURI: string
): Promise<bigint> {
  const account = privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}`);
  const client = createWalletClient({
    account,
    chain: aeneid,
    transport: http('https://aeneid.storyrpc.io'),
  });

  const { request } = await client.simulateContract({
    address: process.env.MEME_NFT_CONTRACT,
    abi: MemeNFTABI,
    functionName: 'mint',
    args: [recipientAddress, metadataURI],
  });

  const hash = await client.writeContract(request);
  const receipt = await client.waitForTransactionReceipt({ hash });
  
  // Extract tokenId from event logs
  const tokenId = BigInt(receipt.logs[0].topics[3]);
  return tokenId;
}

// 4. Update Story Protocol registration
export async function registerMemeOnChain(
  memeHash: string,
  title: string,
  description: string,
  licenseType: string,
  imageUrl: string
): Promise<{
  success: boolean;
  ipId?: string;
  txHash?: string;
  tokenId?: string;
}> {
  try {
    const client = getStoryClient();
    const walletAddress = privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}`).address;

    // Step 1: Mint NFT
    console.log('🎨 Minting NFT...');
    const metadata = { title, description, image: imageUrl, contentHash: memeHash };
    const metadataURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;
    
    const tokenId = await mintMemeNFT(walletAddress, metadataURI);
    console.log(`✅ NFT minted: Token ID ${tokenId}`);

    // Step 2: Register as IP Asset
    console.log('⛓️ Registering on Story Protocol...');
    const response = await client.ipAsset.register({
      nftContract: process.env.MEME_NFT_CONTRACT as `0x${string}`,
      tokenId: tokenId,
      ipMetadata: {
        ipMetadataURI: metadataURI,
        ipMetadataHash: `0x${memeHash.substring(0, 64).padEnd(64, '0')}`,
        nftMetadataURI: metadataURI,
        nftMetadataHash: `0x${memeHash.substring(0, 64).padEnd(64, '0')}`,
      },
    });

    // Step 3: Attach license terms
    await client.license.attachLicenseTerms({
      ipId: response.ipId,
      licenseTemplate: PIL_TEMPLATE_ADDRESS,
      licenseTermsId: licenseType === 'Free to Use' ? BigInt(1) : BigInt(2),
    });

    return {
      success: true,
      ipId: response.ipId,
      txHash: response.txHash,
      tokenId: tokenId.toString(),
    };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: error.message };
  }
}
```

## Current Status

Your application is currently in **DEMO MODE** - it generates mock blockchain data instead of real transactions. To make it work for real:

1. Deploy your own NFT contract
2. Implement minting functionality  
3. Update `registerMemeOnChain()` to use your contract
4. Ensure wallet has enough testnet IP tokens for gas

## Gas Costs

Each registration requires ~3 transactions:
- **Mint NFT**: ~0.001 IP (~$0.001)
- **Register IP Asset**: ~0.002 IP (~$0.002)
- **Attach License**: ~0.001 IP (~$0.001)
- **Total per meme**: ~0.004 IP (~$0.004)

Get testnet tokens from: https://faucet.story.foundation/

## Resources

- [Deploy ERC721 with Hardhat](https://hardhat.org/tutorial/deploying-your-first-contract)
- [Story Protocol Docs](https://docs.story.foundation/)
- [OpenZeppelin ERC721](https://docs.openzeppelin.com/contracts/4.x/erc721)
- [Aeneid Testnet Info](https://docs.story.foundation/network/network-info/aeneid)
