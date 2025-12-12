import { NextRequest, NextResponse } from 'next/server';

// GET - Get single meme (disabled - no database)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ 
    error: 'Database disabled',
    message: 'Memes are stored on IPFS and Story Protocol blockchain. Use the blockchain explorer or IPFS gateway to view memes.',
    id: params.id
  }, { status: 501 });
}

// PUT - Update meme (disabled - no database)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ 
    error: 'Database disabled',
    message: 'Cannot update memes. Blockchain data is immutable.'
  }, { status: 501 });
}

// DELETE - Delete meme (disabled - no database)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ 
    error: 'Database disabled',
    message: 'Cannot delete memes. Blockchain data is immutable.'
  }, { status: 501 });
}

