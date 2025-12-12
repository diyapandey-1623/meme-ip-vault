'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
  memeId: string;
  initialLiked?: boolean;
  initialCount?: number;
  userId?: string | null;
  onLikeChange?: (liked: boolean, count: number) => void;
  compact?: boolean;
}

export default function LikeButton({
  memeId,
  initialLiked = false,
  initialCount = 0,
  userId,
  onLikeChange,
  compact = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current like status
    if (userId) {
      fetch(`/api/memes/${memeId}/like?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setLiked(data.liked);
          setCount(data.likesCount);
        })
        .catch((err) => console.error('Error fetching like status:', err));
    }
  }, [memeId, userId]);

  const handleLike = async () => {
    if (!userId) {
      alert('Please connect your wallet to like this meme');
      return;
    }

    if (loading) return;

    setLoading(true);

    // Optimistic update
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;
    setLiked(newLiked);
    setCount(newCount);

    try {
      const response = await fetch(`/api/memes/${memeId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setLiked(data.liked);
        setCount(data.likesCount);
        onLikeChange?.(data.liked, data.likesCount);
      } else {
        // Rollback on error
        setLiked(!newLiked);
        setCount(count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Rollback on error
      setLiked(!newLiked);
      setCount(count);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleLike}
        disabled={loading}
        className="inline-flex items-center gap-1 text-sm hover:scale-110 transition-transform disabled:opacity-50"
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <svg
          className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className="text-gray-300">{count}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 ${
        liked
          ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
          : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:text-red-400'
      }`}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <svg
        className={`w-5 h-5 ${liked ? 'fill-red-500' : 'fill-none'}`}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
      <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
    </button>
  );
}
