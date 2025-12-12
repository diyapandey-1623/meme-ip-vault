import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import ConnectWalletButton from '@/components/ConnectWalletButton'

export const metadata: Metadata = {
  title: 'Meme IP Vault - Protect Your Memes',
  description: 'Protect your meme creations with timestamps, watermarks, and ownership proof',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-black/95 backdrop-blur-md border-b border-cyan-500/20 text-white shadow-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* High-End Corporate Web3 Logo */}
              <Link href="/" className="group flex items-center gap-4 hover:scale-[1.02] transform transition-all duration-500">
                {/* Secure Vault Icon */}
                <div className="relative">
                  {/* Outer Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  
                  {/* Main Vault Container - 64x64 */}
                  <div className="relative w-16 h-16">
                    {/* Gradient Border with Soft Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl p-[2px]">
                      {/* Inner Dark Body - Metallic Look */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[14px] flex items-center justify-center relative overflow-hidden">
                        
                        {/* Digital Meme Element - Pixelated Smile (Background) */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 opacity-30">
                          <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                            {/* Pixel Grid Smile Pattern */}
                            <rect x="4" y="0" width="4" height="4" fill="#06b6d4" opacity="0.8"/>
                            <rect x="24" y="0" width="4" height="4" fill="#06b6d4" opacity="0.8"/>
                            <rect x="0" y="12" width="4" height="4" fill="#a855f7"/>
                            <rect x="4" y="16" width="4" height="4" fill="#a855f7"/>
                            <rect x="8" y="16" width="4" height="4" fill="#a855f7"/>
                            <rect x="12" y="16" width="4" height="4" fill="#ec4899"/>
                            <rect x="16" y="16" width="4" height="4" fill="#ec4899"/>
                            <rect x="20" y="16" width="4" height="4" fill="#ec4899"/>
                            <rect x="24" y="16" width="4" height="4" fill="#ec4899"/>
                            <rect x="28" y="12" width="4" height="4" fill="#ec4899"/>
                          </svg>
                        </div>
                        
                        {/* Hexagonal Lock (Blockchain-Inspired) */}
                        <div className="relative z-10 flex flex-col items-center mt-1">
                          {/* Lock Shackle - Clean Arc */}
                          <div className="w-7 h-5 border-[3px] border-cyan-400 rounded-t-full mb-[-3px] shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                          
                          {/* Lock Body - Hexagon Shape (Blockchain Symbol) */}
                          <svg width="28" height="26" viewBox="0 0 28 26" fill="none" className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            <path d="M14 1L26.1244 6.75V18.25L14 24L1.87564 18.25V6.75L14 1Z" fill="url(#lockGradient)" stroke="url(#lockStroke)" strokeWidth="1.5"/>
                            {/* Keyhole */}
                            <circle cx="14" cy="12" r="3" fill="#0a0a0a"/>
                            <rect x="13" y="12" width="2" height="6" rx="1" fill="#0a0a0a"/>
                            <defs>
                              <linearGradient id="lockGradient" x1="1.87564" y1="1" x2="26.1244" y2="24" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#06b6d4"/>
                                <stop offset="50%" stopColor="#8b5cf6"/>
                                <stop offset="100%" stopColor="#ec4899"/>
                              </linearGradient>
                              <linearGradient id="lockStroke" x1="1.87564" y1="1" x2="26.1244" y2="24" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#22d3ee"/>
                                <stop offset="100%" stopColor="#f472b6"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        
                        {/* Corner Tech Accents - Clean Geometric Lines */}
                        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-sm"></div>
                        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-purple-400/70 rounded-tr-sm"></div>
                        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-purple-400/70 rounded-bl-sm"></div>
                        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-pink-400/70 rounded-br-sm"></div>
                        
                        {/* Blockchain Link Symbol (Bottom Right) */}
                        <div className="absolute bottom-1 right-1 opacity-80">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="3.5" cy="3.5" r="2.5" stroke="#06b6d4" strokeWidth="1.2" fill="none"/>
                            <circle cx="8.5" cy="8.5" r="2.5" stroke="#ec4899" strokeWidth="1.2" fill="none"/>
                            <line x1="5" y1="5" x2="7" y2="7" stroke="url(#chainGradient)" strokeWidth="1.8" strokeLinecap="round"/>
                            <defs>
                              <linearGradient id="chainGradient" x1="5" y1="5" x2="7" y2="7">
                                <stop offset="0%" stopColor="#06b6d4"/>
                                <stop offset="100%" stopColor="#ec4899"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated Pulse Ring on Hover */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/0 group-hover:border-cyan-400/40 transition-all duration-500 group-hover:animate-pulse"></div>
                  </div>
                </div>

                {/* Professional Wordmark */}
                <div className="flex flex-col">
                  {/* Main Title - Bold Corporate Typography */}
                  <div className="text-3xl font-black tracking-tight leading-none">
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                      Meme IP Vault
                    </span>
                  </div>
                  
                  {/* Professional Tagline - Three Core Values */}
                  <div className="text-[10px] font-bold tracking-[0.2em] mt-1 flex items-center gap-1.5">
                    <span className="text-cyan-400 drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]">SECURE</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]">OWN</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-pink-400 drop-shadow-[0_0_4px_rgba(236,72,153,0.4)]">PROTECT</span>
                  </div>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                <Link href="/" className="px-4 py-2 font-semibold text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200">
                  Home
                </Link>
                <Link href="/generate" className="px-4 py-2 font-semibold text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z"/>
                    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
                  </svg>
                  Generate
                </Link>
                <Link href="/upload" className="px-4 py-2 font-semibold text-gray-300 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-200">
                  Upload
                </Link>
                <Link href="/explore" className="px-4 py-2 font-semibold text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200">
                  Explore
                </Link>
                <Link href="/marketplace" className="px-4 py-2 font-semibold text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200">
                  Marketplace
                </Link>
                <Link href="/profile" className="px-4 py-2 font-semibold text-gray-300 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-200">
                  Profile
                </Link>
                <div className="ml-2">
                  <ConnectWalletButton />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Social Icons */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-gray-400 hover:text-cyan-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-gray-400 hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-gray-400 hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-gray-400 hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              </a>
            </div>
            
            {/* Copyright and Links */}
            <div className="text-center">
              <p className="font-bold mb-3">© {new Date().getFullYear()} Meme IP Vault - Protecting Meme Creators 🎨</p>
              <p className="text-sm text-gray-400 mb-3">Own, protect, and control your memes.</p>
              <div className="flex justify-center gap-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
