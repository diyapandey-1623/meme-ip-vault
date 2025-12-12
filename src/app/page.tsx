import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black py-32 px-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8">
            <span className="text-white" style={{textShadow: '0 0 8px #00f3ff'}}>Own Your Memes</span> <br/>
            <span className="text-cyan-500">Forever</span>
          </h1>

          <div className="text-3xl md:text-4xl font-bold mb-8 h-12 overflow-hidden">
            <span className="inline-block animate-bounce text-cyan-500">
              Proof that you were the funny one first
            </span>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Protect your memes on-chain and ensure you always get credit.
          </p>
          
          <div className="flex justify-center mb-4">
            <Link 
              href="/signin"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl px-12 py-5 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300"
              style={{boxShadow: '0 0 30px rgba(0, 243, 255, 0.5)'}}
            >
              Start Protecting
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-cyan-500">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 w-32 h-32 mx-auto mb-6 rounded-2xl flex items-center justify-center border-2 border-cyan-500/50 group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">📤</span>
              </div>
              <div className="bg-cyan-500 text-black font-black px-4 py-1 rounded-full inline-block mb-3">STEP 1</div>
              <h3 className="text-2xl font-bold text-white mb-3">Upload</h3>
              <p className="text-gray-400">Upload your meme to the platform</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 w-32 h-32 mx-auto mb-6 rounded-2xl flex items-center justify-center border-2 border-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">🔗</span>
              </div>
              <div className="bg-purple-500 text-white font-black px-4 py-1 rounded-full inline-block mb-3">STEP 2</div>
              <h3 className="text-2xl font-bold text-white mb-3">Register</h3>
              <p className="text-gray-400">Mint & secure IP asset on Story Protocol</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 w-32 h-32 mx-auto mb-6 rounded-2xl flex items-center justify-center border-2 border-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">📜</span>
              </div>
              <div className="bg-blue-500 text-white font-black px-4 py-1 rounded-full inline-block mb-3">STEP 3</div>
              <h3 className="text-2xl font-bold text-white mb-3">Verify</h3>
              <p className="text-gray-400">Get on-chain proof of ownership</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 w-32 h-32 mx-auto mb-6 rounded-2xl flex items-center justify-center border-2 border-pink-500/50 group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">✅</span>
              </div>
              <div className="bg-pink-500 text-white font-black px-4 py-1 rounded-full inline-block mb-3">STEP 4</div>
              <h3 className="text-2xl font-bold text-white mb-3">Get Credit</h3>
              <p className="text-gray-400">Your origin always recognized</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-4 text-cyan-500">
            Core Features
          </h2>
          <p className="text-center text-gray-400 text-xl mb-16">Everything you need to protect your meme IP</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-8 rounded-2xl border-2 border-cyan-500/30 hover:border-cyan-500 transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-3">On-Chain IP Registration</h3>
              <p className="text-gray-300">Permanent, immutable proof of ownership on Story Protocol blockchain</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-8 rounded-2xl border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">Proof of Originality</h3>
              <p className="text-gray-300">Timestamp and perceptual hash to prove you created it first</p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/20 to-red-900/20 p-8 rounded-2xl border-2 border-pink-500/30 hover:border-pink-500 transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-4">🧬</div>
              <h3 className="text-2xl font-bold text-pink-400 mb-3">Remix Attribution</h3>
              <p className="text-gray-300">Track derivatives and ensure credit flows back to you</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-8 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500 transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-4">🛰️</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-3">Global Visibility</h3>
              <p className="text-gray-300">Your meme is discoverable and verifiable worldwide</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 p-8 rounded-2xl border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-4">🗄️</div>
              <h3 className="text-2xl font-bold text-green-400 mb-3">Personal Meme Vault</h3>
              <p className="text-gray-300">Organize and showcase your entire meme portfolio</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-8 rounded-2xl border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-3">Standardized Licensing</h3>
              <p className="text-gray-300">Choose from pre-built license terms or create custom ones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by Story Protocol Section */}
      <div className="bg-black py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative group">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-pink-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            
            {/* Main box */}
            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-cyan-500/30 rounded-3xl p-12 overflow-hidden">
              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="inline-block mb-6">
                  <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-black text-sm px-6 py-2 rounded-full">
                    BLOCKCHAIN INFRASTRUCTURE
                  </div>
                </div>

                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Powered by Story Protocol
                  </span>
                </h2>

                <div className="max-w-3xl mx-auto space-y-4 mb-8">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    <span className="text-cyan-400 font-bold">Story Protocol</span> is the world's IP blockchain, making it simple to license, remix, and monetize creative content on-chain.
                  </p>
                  <p className="text-gray-400 text-base leading-relaxed">
                    With Story Protocol, your memes become programmable IP assets with <span className="text-purple-400 font-semibold">verifiable ownership</span>, <span className="text-pink-400 font-semibold">transparent attribution</span>, and <span className="text-cyan-400 font-semibold">automated licensing</span>. Every derivative, remix, and reuse can be tracked back to you, the original creator.
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 hover:bg-cyan-500/20 transition-all duration-300">
                    <div className="text-4xl mb-3">🔒</div>
                    <h3 className="text-cyan-400 font-bold text-lg mb-2">Immutable Proof</h3>
                    <p className="text-gray-400 text-sm">On-chain records that can never be altered or deleted</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 hover:bg-purple-500/20 transition-all duration-300">
                    <div className="text-4xl mb-3">🌐</div>
                    <h3 className="text-purple-400 font-bold text-lg mb-2">Global Registry</h3>
                    <p className="text-gray-400 text-sm">Your IP is registered on a decentralized, worldwide network</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6 hover:bg-pink-500/20 transition-all duration-300">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="text-pink-400 font-bold text-lg mb-2">Smart Licensing</h3>
                    <p className="text-gray-400 text-sm">Programmable terms that execute automatically</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="https://www.story.foundation/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30"
                  >
                    Learn More About Story Protocol
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a 
                    href="https://aeneid.explorer.story.foundation/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-transparent border-2 border-purple-500 text-purple-400 font-bold px-8 py-4 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300"
                  >
                    View on Story Explorer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-4 text-cyan-500">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-400 text-xl mb-16">Everything you need to know</p>
          
          <div className="space-y-4">
            <details className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-xl border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300">
              <summary className="cursor-pointer p-6 font-bold text-xl text-white flex justify-between items-center">
                <span>What is Meme IP Vault?</span>
                <span className="text-cyan-400 text-2xl group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-300 text-lg">
                Meme IP Vault is a platform where you can protect your memes on-chain using Story Protocol, ensuring you always remain the original creator.
              </div>
            </details>

            <details className="group bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl border-2 border-red-500/30 hover:border-red-500 transition-all duration-300">
              <summary className="cursor-pointer p-6 font-bold text-xl text-white flex justify-between items-center">
                <span>What problem does Meme IP Vault solve?</span>
                <span className="text-red-400 text-2xl group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-300 text-lg">
                Today, memes get stolen and reused without credit. Platforms often control your content, there's no clear proof of the original creator, and creators have no simple way to show that a meme truly started with them.
              </div>
            </details>

            <details className="group bg-gradient-to-br from-green-900/20 to-cyan-900/20 rounded-xl border-2 border-green-500/30 hover:border-green-500 transition-all duration-300">
              <summary className="cursor-pointer p-6 font-bold text-xl text-white flex justify-between items-center">
                <span>How does Meme IP Vault solve this?</span>
                <span className="text-green-400 text-2xl group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-300 text-lg">
                Meme IP Vault uses blockchain-powered protection. When you register a meme, we turn it into an IP asset on Story Protocol. That gives you immutable, public proof of ownership and a permanent record that you are the original creator.
              </div>
            </details>

            <details className="group bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border-2 border-cyan-500/30 hover:border-cyan-500 transition-all duration-300">
              <summary className="cursor-pointer p-6 font-bold text-xl text-white flex justify-between items-center">
                <span>Do I need technical blockchain knowledge?</span>
                <span className="text-purple-400 text-2xl group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-300 text-lg">
                Not at all! Just connect your wallet or sign in with Google, and upload — we handle minting and registration automatically.
              </div>
            </details>

            <details className="group bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-xl border-2 border-pink-500/30 hover:border-pink-500 transition-all duration-300">
              <summary className="cursor-pointer p-6 font-bold text-xl text-white flex justify-between items-center">
                <span>Will my meme be public?</span>
                <span className="text-pink-400 text-2xl group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-300 text-lg">
                On-chain registration means ownership records are public. The meme image can be public or stored on IPFS depending on your preference.
              </div>
            </details>

            <details className="group bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border-2 border-blue-500/30 hover:border-blue-500 transition-all duration-300">
              <summary className="cursor-pointer p-6 font-bold text-xl text-white flex justify-between items-center">
                <span>What do I need to get started?</span>
                <span className="text-blue-400 text-2xl group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-300 text-lg">
                A Web3 wallet (like MetaMask) or a Google account, your meme file, and a few minutes.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
