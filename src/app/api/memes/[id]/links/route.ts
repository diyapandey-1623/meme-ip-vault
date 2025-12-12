import { NextRequest, NextResponse } from 'next/server';

// POST - Add usage link (disabled - no database)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ 
    error: 'Database disabled',
    message: 'Usage tracking requires database.'
  }, { status: 501 });
  /*
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Verify meme exists
    const meme = await prisma.meme.findUnique({
      where: { id: params.id },
    });

    if (!meme) {
      return NextResponse.json({ error: 'Meme not found' }, { status: 404 });
    }

    // Create usage link
    const usageLink = await prisma.usageLink.create({
      data: {
        url,
        memeId: params.id,
      },
    });

    return NextResponse.json(usageLink);
  } catch (error) {
    console.error('Error adding usage link:', error);
    return NextResponse.json(
      { error: 'Failed to add usage link' },
      { status: 500 }
    );
  }
}

// GET - Get all usage links for a meme
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const links = await prisma.usageLink.findMany({
      where: { memeId: params.id },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching usage links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage links' },
      { status: 500 }
    );
  }
}
