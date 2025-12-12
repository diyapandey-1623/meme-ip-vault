'use client';

import { useState, useEffect } from 'react';

interface StarRatingProps {
  memeId: string;
  initialRating?: number;
  initialCount?: number;
  userId?: string | null;
  onRatingChange?: (rating: number, average: number, count: number) => void;
  compact?: boolean;
  interactive?: boolean;
}

export default function StarRating({
  memeId,
  initialRating = 0,
  initialCount = 0,
  userId,
  onRatingChange,
  compact = false,
  interactive = true,
}: StarRatingProps) {
  const [averageRating, setAverageRating] = useState(initialRating);
  const [ratingCount, setRatingCount] = useState(initialCount);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    // Fetch current rating
    const fetchRating = async () => {
      try {
        const url = userId
          ? `/api/memes/${memeId}/rate?userId=${userId}`
          : `/api/memes/${memeId}/rate`;
        const response = await fetch(url);
        const data = await response.json();
        
        setAverageRating(data.averageRating);
        setRatingCount(data.ratingCount);
        setUserRating(data.userRating);
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [memeId, userId]);

  const handleRate = async (value: number) => {
    if (!userId) {
      alert('Please connect your wallet to rate this meme');
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/memes/${memeId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, value }),
      });

      const data = await response.json();

      if (data.success) {
        setAverageRating(data.averageRating);
        setRatingCount(data.ratingCount);
        setUserRating(data.userRating);
        setShowRatingModal(false);
        onRatingChange?.(data.userRating, data.averageRating, data.ratingCount);
      }
    } catch (error) {
      console.error('Error rating meme:', error);
      alert('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size = 'w-4 h-4', interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && handleRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            disabled={!interactive || loading}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform disabled:opacity-50`}
            aria-label={`Rate ${star} stars`}
          >
            <svg
              className={`${size} ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-600'
              }`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-sm">
        {renderStars(averageRating, 'w-4 h-4', false)}
        <span className="text-gray-300 font-semibold">{averageRating.toFixed(1)}</span>
        <span className="text-gray-500">({ratingCount})</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {renderStars(averageRating, 'w-6 h-6', false)}
          <span className="text-2xl font-bold text-yellow-400">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-gray-400">({ratingCount} ratings)</span>
      </div>

      {interactive && userId && (
        <div>
          {userRating ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Your rating:</p>
              <div className="flex items-center gap-2">
                {renderStars(userRating, 'w-5 h-5', false)}
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="text-sm text-purple-400 hover:text-purple-300 underline"
                >
                  Change rating
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowRatingModal(true)}
              className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Rate this meme
            </button>
          )}

          {showRatingModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4">Rate this meme</h3>
                <div className="flex justify-center mb-6">
                  {renderStars(hoverRating || userRating || 0, 'w-10 h-10', true)}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
