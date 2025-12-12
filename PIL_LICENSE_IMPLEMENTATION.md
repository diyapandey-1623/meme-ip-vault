# PIL License Terms Implementation

## Overview
Your Meme IP Vault now implements **Programmable IP License (PIL)** terms from Story Protocol. Each meme you upload is automatically registered as an IP Asset with proper license terms attached on the Story Protocol Aeneid testnet.

## How It Works

### 1. License Type Mapping
When users select a license type, the system maps it to appropriate PIL terms:

#### **Free to Use** → Creative Commons Attribution
- ✅ Commercial use allowed
- ✅ Derivatives allowed
- ✅ Attribution required
- ❌ No revenue share required
- Perfect for: Viral memes meant for wide distribution

#### **Credit Required** → Non-Commercial Social Remixing
- ❌ No commercial use
- ✅ Derivatives allowed
- ✅ Attribution required
- ✅ Reciprocal (derivatives must use same terms)
- Perfect for: Personal/educational content

#### **No Commercial** → Strict Non-Commercial
- ❌ No commercial use
- ✅ Derivatives allowed with approval
- ✅ Attribution required
- ✅ Reciprocal terms
- Perfect for: Personal artwork, copyrighted content

### 2. Registration Process

```typescript
// Step 1: User uploads meme with license selection
POST /api/memes
{
  title: "My Meme",
  license: "Credit Required"
}

// Step 2: System registers PIL terms on-chain
const pilTerms = getPILTermsForLicense("Credit Required");
const licenseTermsId = await client.license.registerPILTerms(pilTerms);

// Step 3: Register IP Asset on Story Protocol
const response = await client.ipAsset.register({
  nftContract: '0x041B4F29183317Fd352AE57e331154d5F9F64e24',
  tokenId: BigInt(Date.now()),
  ipMetadata: { ... }
});

// Step 4: Attach license terms to the IP Asset
await client.license.attachLicenseTerms({
  ipId: response.ipId,
  licenseTermsId: licenseTermsId,
  licenseTemplate: PIL_TEMPLATE_ADDRESS
});

// Step 5: Save to database
await prisma.meme.update({
  data: {
    ipId: response.ipId,
    ipTxHash: response.txHash,
    licenseTermsId: licenseTermsId.toString(),
    onChain: true
  }
});
```

### 3. PIL Terms Configuration

Each license uses specific PIL parameters:

```typescript
{
  transferable: true,              // License can be transferred
  royaltyPolicy: ROYALTY_POLICY_LAP, // Liquid Absolute Percentage policy
  currency: MERC20_TOKEN,          // Payment token
  defaultMintingFee: 0,            // No fee to mint licenses
  commercialUse: false,            // Varies by license type
  commercialAttribution: true,     // Attribution required
  derivativesAllowed: true,        // Can create derivatives
  derivativesReciprocal: true,     // Derivatives use same terms
  // ... more parameters
}
```

## Story Protocol Contracts (Aeneid Testnet)

- **PIL Template**: `0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316`
- **Royalty Policy (LAP)**: `0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E`
- **Revenue Token (MERC20)**: `0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E`
- **SPG NFT Contract**: `0x041B4F29183317Fd352AE57e331154d5F9F64e24`

## Certificate Page Display

When a meme is successfully registered on-chain, the certificate page shows:

```
⛓️ On-Chain Protection
Story Protocol IP Asset

IP Asset ID: 0x1234...
Transaction Hash: 0xabcd... (clickable link to explorer)
PIL License Terms ID: 123
✓ Programmable IP License (PIL) terms attached
```

## Benefits

1. **Legally Enforceable**: PIL terms are smart contract-based and automatically enforced
2. **Protocol-Wide**: License terms are shared across all Story Protocol applications
3. **Transparent**: All terms are on-chain and publicly verifiable
4. **Flexible**: Support for commercial use, derivatives, and revenue sharing
5. **Standard Compliance**: Follows Story Protocol's PIL framework

## Technical Implementation

### Files Modified:
- `src/lib/storyProtocol.ts` - Added PIL terms mapping and registration
- `src/app/api/memes/route.ts` - Updated to save licenseTermsId
- `src/app/certificate/[id]/page.tsx` - Display license terms ID

### Key Functions:
- `getPILTermsForLicense()` - Maps user license to PIL parameters
- `registerMemeOnChain()` - Registers IP Asset with PIL terms
- `client.license.registerPILTerms()` - Creates new PIL terms on-chain
- `client.license.attachLicenseTerms()` - Attaches terms to IP Asset

## Testing

Upload a new meme and check the certificate page to see:
1. IP Asset registered on Story Protocol
2. Transaction hash with clickable link
3. PIL License Terms ID displayed
4. "On-Chain Protection" status

## References

- [Story Protocol PIL Documentation](https://docs.story.foundation/concepts/programmable-ip-license/pil-terms)
- [PIL Flavors](https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors)
- [License Terms Registration Guide](https://docs.story.foundation/developers/smart-contracts-guide/license-terms)
