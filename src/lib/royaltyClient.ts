import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';

const config: StoryConfig = {
  account: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
  transport: http(process.env.RPC_PROVIDER_URL),
  chainId: 'aeneid',
};

export const storyClient = StoryClient.newClient(config);

// WIP Token Address (Wrapped IP token used for royalty payments)
export const WIP_TOKEN_ADDRESS = '0x1514000000000000000000000000000000000000';

/**
 * Pay royalty to an IP Asset
 * @param receiverIpId - The IP Asset receiving the payment
 * @param payerIpId - The IP Asset making the payment (use zeroAddress for external payments)
 * @param amount - Amount in wei (use parseEther to convert from ether)
 */
export async function payRoyaltyToIpAsset(
  receiverIpId: `0x${string}`,
  payerIpId: `0x${string}`,
  amount: bigint
) {
  try {
    const result = await storyClient.royalty.payRoyaltyOnBehalf({
      receiverIpId,
      payerIpId,
      token: WIP_TOKEN_ADDRESS,
      amount,
    });

    return {
      success: true,
      txHash: result.txHash,
    };
  } catch (error) {
    console.error('Error paying royalty:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Claim earned royalties for an IP Asset
 * @param ancestorIpId - The ancestor IP Asset claiming royalties
 * @param claimer - The address claiming the revenue
 * @param childIpIds - Array of child IP IDs
 * @param royaltyPolicies - Array of royalty policy addresses
 * @param currencyTokens - Array of currency token addresses
 */
export async function claimRoyalties(
  ancestorIpId: `0x${string}`,
  claimer: `0x${string}`,
  childIpIds: `0x${string}`[],
  royaltyPolicies: `0x${string}`[],
  currencyTokens: `0x${string}`[] = [WIP_TOKEN_ADDRESS as `0x${string}`]
) {
  try {
    const result = await storyClient.royalty.claimAllRevenue({
      ancestorIpId,
      claimer,
      childIpIds,
      royaltyPolicies,
      currencyTokens
    });

    return {
      success: true,
      txHash: result.txHashes?.[0],
    };
  } catch (error) {
    console.error('Error claiming royalties:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get claimable revenue for an IP Asset
 * @param ipId - The IP Asset ID (royalty vault)
 * @param claimer - The address of the claimer
 * @param token - Revenue token address
 */
export async function getClaimableRevenue(
  ipId: `0x${string}`,
  claimer: `0x${string}`,
  token: string = WIP_TOKEN_ADDRESS
) {
  try {
    const revenue = await storyClient.royalty.claimableRevenue({
      ipId,
      claimer,
      token: token as `0x${string}`,
    });

    return {
      success: true,
      claimableRevenue: revenue,
    };
  } catch (error) {
    console.error('Error getting claimable revenue:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
