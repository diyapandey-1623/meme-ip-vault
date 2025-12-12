'use client';

import Link from 'next/link';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-cyan-500 mb-8">Explore Memes</h1>
        
        <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-8 text-center">
          <p className="text-2xl text-gray-300 mb-4">
            🔗 Database Disabled - Fully Decentralized Mode
          </p>
          <p className="text-gray-400 mb-6">
            All memes are stored on IPFS and registered on Story Protocol blockchain.
          </p>
          <p className="text-gray-400 mb-6">
            To view registered memes, use the Story Protocol blockchain explorer:
          </p>
          <a
            href="https://explorer.story.foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cyan-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-cyan-400 transition-colors"
          >
            View on Story Explorer →
          </a>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <Link 
              href="/upload"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-500 transition-colors"
            >
              Upload New Meme
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

