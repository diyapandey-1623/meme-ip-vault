import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ 
    likes: 0,
    averageRating: 0,
    totalRatings: 0,
    userLiked: false,
    userRating: null
  });
  /*
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const meme = await prisma.meme.findUnique({
      where: { id: params.id },
      select: {
        likesCount: true,
        averageRating: true,
        ratingCount: true,
        verified: true,
      },
    });

    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' },
        { status: 404 }
      );
    }

    let userLike = false;
    let userRating = null;

    if (userId) {
      const [like, rating] = await Promise.all([
        prisma.like.findUnique({
          where: {
            memeId_userId: {
              memeId: params.id,
              userId,
            },
          },
        }),
        prisma.rating.findUnique({
          where: {
            memeId_userId: {
              memeId: params.id,
              userId,
            },
          },
        }),
      ]);

      userLike = !!like;
      userRating = rating?.value || null;
    }

    return NextResponse.json({
      likesCount: meme.likesCount,
      averageRating: parseFloat(meme.averageRating.toFixed(1)),
      ratingCount: meme.ratingCount,
      verified: meme.verified,
      userLike,
      userRating,
    });
  } catch (error: any) {
    console.error('❌ Error fetching meme meta:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meme metadata' },
      { status: 500 }
    );
  }
}
