import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, value } = await request.json();

    if (!userId || !value) {
      return NextResponse.json(
        { error: 'User ID and rating value required' },
        { status: 400 }
      );
    }

    if (value < 1 || value > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
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

    // Check if user already rated
    const existingRating = await prisma.rating.findUnique({
      where: {
        memeId_userId: {
          memeId,
          userId,
        },
      },
    });

    let newRatingSum = meme.ratingSum;
    let newRatingCount = meme.ratingCount;

    if (existingRating) {
      // Update existing rating
      const oldValue = existingRating.value;
      newRatingSum = meme.ratingSum - oldValue + value;

      await prisma.$transaction([
        prisma.rating.update({
          where: { id: existingRating.id },
          data: { value },
        }),
        prisma.meme.update({
          where: { id: memeId },
          data: {
            ratingSum: newRatingSum,
            averageRating: newRatingSum / newRatingCount,
          },
        }),
      ]);
    } else {
      // Create new rating
      newRatingSum = meme.ratingSum + value;
      newRatingCount = meme.ratingCount + 1;

      await prisma.$transaction([
        prisma.rating.create({
          data: {
            memeId,
            userId,
            value,
          },
        }),
        prisma.meme.update({
          where: { id: memeId },
          data: {
            ratingSum: newRatingSum,
            ratingCount: newRatingCount,
            averageRating: newRatingSum / newRatingCount,
          },
        }),
      ]);
    }

    const averageRating = newRatingSum / newRatingCount;

    return NextResponse.json({
      success: true,
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingCount: newRatingCount,
      userRating: value,
    });
  } catch (error: any) {
    console.error('❌ Error rating meme:', error);
    return NextResponse.json(
      { error: 'Failed to rate meme', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get rating info
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
        averageRating: true,
        ratingCount: true,
      },
    });

    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' },
        { status: 404 }
      );
    }

    let userRating = null;

    if (userId) {
      const rating = await prisma.rating.findUnique({
        where: {
          memeId_userId: {
            memeId: params.id,
            userId,
          },
        },
      });
      userRating = rating?.value || null;
    }

    return NextResponse.json({
      averageRating: parseFloat(meme.averageRating.toFixed(1)),
      ratingCount: meme.ratingCount,
      userRating,
    });
  } catch (error: any) {
    console.error('❌ Error fetching rating:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rating' },
      { status: 500 }
    );
  }
}
