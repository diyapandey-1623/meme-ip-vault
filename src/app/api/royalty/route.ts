import { NextRequest, NextResponse } from 'next/server';

const STORY_API_URL = 'https://staging-api.storyprotocol.net/api/v4';
const STORY_API_KEY = 'KOTbaGUSWQ6cUJWhiJYiOjPgB0kTRu1eCFFvQL0IWls'; // Aeneid testnet key

/**
 * POST /api/royalty/pay
 * Pay royalty to an IP Asset
 * 
 * Body:
 * - receiverIpId: The IP Asset receiving payment
 * - payerIpId: The IP Asset making payment (use 0x0000000000000000000000000000000000000000 for tips)
 * - amount: Amount in WIP tokens (as string)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receiverIpId, payerIpId, amount } = body;

    if (!receiverIpId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: receiverIpId, amount' },
        { status: 400 }
      );
    }

    // Note: Actual blockchain transaction would require wallet integration
    // This is a placeholder for the API structure
    const response = {
      success: true,
      message: 'Royalty payment initiated',
      receiverIpId,
      payerIpId: payerIpId || '0x0000000000000000000000000000000000000000',
      amount,
      token: '0x1514000000000000000000000000000000000000', // WIP token
      note: 'This requires wallet integration to execute the actual transaction',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error paying royalty:', error);
    return NextResponse.json(
      { error: 'Failed to pay royalty' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/royalty/claimable?ipId=0x...&snapshotId=123
 * Get claimable revenue for an IP Asset
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ipId = searchParams.get('ipId');
    const snapshotId = searchParams.get('snapshotId');

    if (!ipId) {
      return NextResponse.json(
        { error: 'Missing required parameter: ipId' },
        { status: 400 }
      );
    }

    // Query Story Protocol API for claimable revenue
    // This would require the actual API endpoint structure
    const response = {
      success: true,
      ipId,
      snapshotId: snapshotId || 'latest',
      claimableRevenue: '0',
      token: '0x1514000000000000000000000000000000000000',
      note: 'This requires Story Protocol API integration',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching claimable revenue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claimable revenue' },
      { status: 500 }
    );
  }
}
