import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Admin wallet addresses (add your admin addresses here)
const ADMIN_ADDRESSES = [
  // Add admin wallet addresses in lowercase
  '0x...', // Replace with actual admin address
];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { verified, adminAddress } = await request.json();

    if (!adminAddress) {
      return NextResponse.json(
        { error: 'Admin address required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!ADMIN_ADDRESSES.includes(adminAddress.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access only' },
        { status: 403 }
      );
    }

    const meme = await prisma.meme.update({
      where: { id: params.id },
      data: { verified },
    });

    return NextResponse.json({
      success: true,
      verified: meme.verified,
    });
  } catch (error: any) {
    console.error('❌ Error updating verification:', error);
    return NextResponse.json(
      { error: 'Failed to update verification', details: error.message },
      { status: 500 }
    );
  }
}
