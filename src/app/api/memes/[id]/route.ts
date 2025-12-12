import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get single meme
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meme = await prisma.meme.findUnique({
      where: { id: params.id },
      include: {
        usageLinks: {
          orderBy: {
            addedAt: 'desc',
          },
        },
      },
    });

    if (!meme) {
      return NextResponse.json({ error: 'Meme not found' }, { status: 404 });
    }

    console.log('📤 GET /api/memes/[id] - Returning meme:', {
      id: meme.id,
      title: meme.title,
      imageUrl: meme.imageUrl,
      ipfsUrl: meme.ipfsUrl,
      ipId: meme.ipId,
      ipTxHash: meme.ipTxHash,
      onChain: meme.onChain,
    });

    return NextResponse.json(meme);
  } catch (error) {
    console.error('Error fetching meme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meme' },
      { status: 500 }
    );
  }
}

// PATCH - Update meme with blockchain info
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { ipId, txHash, tokenId, ipfsUrl } = body;

    console.log('📥 PATCH /api/memes/[id] - Updating meme:', params.id);
    console.log('📥 Received data:', { ipId, txHash, tokenId, ipfsUrl });

    // Prepare update data - only include fields that have values
    const updateData: any = {};
    
    if (ipId) {
      updateData.ipId = ipId;
      updateData.onChain = true; // Mark as on-chain when ipId exists
      console.log('✅ Setting ipId:', ipId);
    }
    
    if (txHash) {
      updateData.ipTxHash = txHash;
      console.log('✅ Setting txHash:', txHash);
    }
    
    if (ipfsUrl) {
      updateData.ipfsUrl = ipfsUrl;
      console.log('✅ Setting ipfsUrl:', ipfsUrl);
    }

    console.log('📝 Update data being saved:', updateData);

    // Update the meme with blockchain info
    const updatedMeme = await prisma.meme.update({
      where: { id: params.id },
      data: updateData,
      include: {
        usageLinks: true,
      },
    });

    console.log('✅ Meme updated successfully in database!');
    console.log('📊 Updated values:', {
      id: updatedMeme.id,
      ipId: updatedMeme.ipId,
      ipTxHash: updatedMeme.ipTxHash,
      onChain: updatedMeme.onChain,
      ipfsUrl: updatedMeme.ipfsUrl,
    });

    return NextResponse.json({
      success: true,
      meme: updatedMeme,
    });
  } catch (error: any) {
    console.error('❌ Error updating meme:', error);
    console.error('❌ Error details:', error.message);
    return NextResponse.json(
      { error: 'Failed to update meme', details: error.message },
      { status: 500 }
    );
  }
}
