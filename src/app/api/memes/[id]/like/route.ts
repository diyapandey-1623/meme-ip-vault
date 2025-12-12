import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID (wallet address) required' },
        { status: 400 }
      );
    }

    const memeId = params.id;

    // Check if meme exists
    const meme = await prisma.meme.findUnique({
      where: { id: memeId },
    });

    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' },
        { status: 404 }
      );
    }

    // Check if user already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        memeId_userId: {
          memeId,
          userId,
        },
      },
    });

    let liked = false;
    let likesCount = meme.likesCount;

    if (existingLike) {
      // Unlike: remove like
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.meme.update({
          where: { id: memeId },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        }),
      ]);
      likesCount = Math.max(0, likesCount - 1);
      liked = false;
    } else {
      // Like: add like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            memeId,
            userId,
          },
        }),
        prisma.meme.update({
          where: { id: memeId },
          data: {
            likesCount: {
              increment: 1,
            },
          },
        }),
      ]);
      likesCount = likesCount + 1;
      liked = true;
    }

    return NextResponse.json({
      success: true,
      likesCount,
      liked,
    });
  } catch (error: any) {
    console.error('❌ Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Check if user liked and get count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const meme = await prisma.meme.findUnique({
      where: { id: params.id },
      select: {
        likesCount: true,
      },
    });

    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' },
        { status: 404 }
      );
    }

    let liked = false;

    if (userId) {
      const existingLike = await prisma.like.findUnique({
        where: {
          memeId_userId: {
            memeId: params.id,
            userId,
          },
        },
      });
      liked = !!existingLike;
    }

    return NextResponse.json({
      likesCount: meme.likesCount,
      liked,
    });
  } catch (error: any) {
    console.error('❌ Error fetching like status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like status' },
      { status: 500 }
    );
  }
}
