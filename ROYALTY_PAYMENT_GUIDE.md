# Royalty Payment System

## Overview

The Meme IP Vault now supports paying royalties to IP Assets using Story Protocol's royalty system. This allows users to:

1. **Tip creators** - Send $WIP tokens to show appreciation
2. **Pay revenue share** - If you're a derivative IP, pay your parent IPs their due share
3. **Automatic distribution** - Parent IPs automatically receive their negotiated percentage

## How It Works

### Payment Flow

When you pay an IP Asset:

1. Payment is made in **$WIP tokens** (Wrapped IP)
2. The [Royalty Module](https://docs.story.foundation/concepts/royalty-module) automatically handles distribution
3. Parent IPs with `commercialRevShare` terms receive their percentage
4. All payments are transparent and on-chain

### Example Scenario

Let's say a meme has the following structure:
- **Parent Meme** (Original): Negotiated 50% commercial revenue share
- **Child Meme** (Derivative): Your remix

If someone pays the Child Meme 2 $WIP:
- Child receives: 1 $WIP (50%)
- Parent receives: 1 $WIP (50%)

This happens automatically via smart contracts!

## Using the Payment Feature

### On Certificate Page

1. Navigate to any meme's certificate page
2. Find the "💰 Support This IP Asset" section
3. Enter the amount in $WIP tokens
4. Click "Send Payment"
5. Confirm the transaction in your wallet

### API Endpoint

```typescript
POST /api/royalty

Body:
{
  "receiverIpId": "0x...", // The IP Asset receiving payment
  "payerIpId": "0x0000000000000000000000000000000000000000", // Zero address for tips
  "amount": "1000000000000000000" // Amount in wei (1 WIP = 10^18 wei)
}
```

### Client-Side Component

```tsx
import PayRoyaltyForm from '@/components/PayRoyaltyForm';

<PayRoyaltyForm 
  ipAssetId={meme.ipId}
  ipAssetTitle={meme.title}
  onSuccess={() => console.log('Payment successful!')}
/>
```

## Key Concepts

### $WIP Token

- **Address**: `0x1514000000000000000000000000000000000000`
- **Purpose**: Whitelisted revenue token for Story Protocol
- **Auto-wrapping**: If you don't have enough $WIP, the system wraps $IP automatically

### Whitelisted Revenue Tokens

Only certain tokens can be used for payments:
- $WIP (Wrapped IP) - Main revenue token
- MockERC20 (Testnet) - For testing: `0xF2104833d386a2734a4eB3B8ad6FC6812F29E38E`

### Zero Address for Tips

When tipping an IP Asset (not paying as another IP):
```typescript
payerIpId: "0x0000000000000000000000000000000000000000"
```

This indicates you're a 3rd party supporter, not a derivative IP.

## API Documentation

### Story Protocol API

**Testnet (Aeneid)**:
- Endpoint: `https://staging-api.storyprotocol.net/api/v4`
- API Key: `KOTbaGUSWQ6cUJWhiJYiOjPgB0kTRu1eCFFvQL0IWls`
- Rate Limit: 300 requests/second

**Mainnet**:
- Endpoint: `https://api.storyapis.com/api/v4`
- API Key: `MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U`

## Future Enhancements

1. **Claim Revenue**: Add ability for creators to claim their earned royalties
2. **Revenue Dashboard**: Show total earned, claimable amounts, payment history
3. **Wallet Integration**: Full Web3 wallet support (MetaMask, WalletConnect)
4. **Batch Payments**: Pay multiple IP Assets at once
5. **Revenue Splits**: View detailed payment flow through ancestor tree

## Resources

- [Story Protocol Royalty Module](https://docs.story.foundation/concepts/royalty-module)
- [Pay IPA Tutorial](https://docs.story.foundation/developers/pay-ipa)
- [Claim Revenue Tutorial](https://docs.story.foundation/developers/claim-revenue)
- [TypeScript SDK Reference](https://docs.story.foundation/sdk-reference/royalty)

## Notes

- ⚠️ **Wallet Required**: Actual payments require Web3 wallet connection
- ⚠️ **Gas Fees**: Transactions on blockchain require ETH for gas
- ✅ **Automatic Distribution**: Parent IPs receive share automatically
- ✅ **Transparent**: All payments are recorded on-chain
