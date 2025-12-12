'use client';

import { useState } from 'react';

interface VerifiedBadgeProps {
  verified: boolean;
  compact?: boolean;
}

export default function VerifiedBadge({ verified, compact = false }: VerifiedBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!verified) return null;

  if (compact) {
    return (
      <div
        className="relative inline-flex"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="bg-green-500/20 border border-green-500/50 rounded-full px-2 py-1 flex items-center gap-1">
          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-semibold text-green-400">Verified</span>
        </div>

        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10 border border-green-500/30">
            Verified by Meme IP Vault — owner proof checked
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2">
      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <span className="text-sm font-semibold text-green-400">Verified Meme</span>
        <p className="text-xs text-gray-400">Ownership proof checked by Meme IP Vault</p>
      </div>
    </div>
  );
}
