'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const router = useRouter();

  // Redirect to wallet connection since Google sign-in is removed
  useEffect(() => {
    router.push('/connect-wallet');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Sign-in card */}
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 md:p-12 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-4xl">🎨</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Meme IP Vault</h1>
          <p className="text-gray-400">Own your memes. Protect your IP.</p>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={() => router.push('/connect-wallet')}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
        >
          🔐 Connect Wallet
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Powered by Story Protocol • HackQuest
        </div>
      </div>
    </div>
  );
}
