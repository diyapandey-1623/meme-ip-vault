'use client';

import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-cyan-500 mb-8">My Profile</h1>
        
        <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-8 text-center">
          <p className="text-2xl text-gray-300 mb-4">
            🔗 Database Disabled - Fully Decentralized Mode
          </p>
          <p className="text-gray-400 mb-6">
            All memes are stored on IPFS and registered on Story Protocol blockchain.
          </p>
          <p className="text-gray-400 mb-6">
            Your memes are tracked on the blockchain by your wallet address.
          </p>
          <a
            href="https://explorer.story.foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cyan-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-cyan-400 transition-colors mb-4"
          >
            View Your IPs on Story Explorer →
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
import Link from 'next/link';
import Image from 'next/image';

interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  watermarkedImageUrl: string;
  timestamp: string;
  license: string;
  onChain: boolean;
}

export default function ProfilePage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const walletAddress = '0x94234AE398d8ab6f1866d892d30b67727a898513';

  useEffect(() => {
    fetchUserMemes();
  }, []);

  const fetchUserMemes = async () => {
    try {
      const response = await fetch('/api/memes');
      if (response.ok) {
        const data = await response.json();
        setMemes(data);
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChainMemes = memes.filter(m => m.onChain).length;
  const totalMemes = memes.length;

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-2xl p-8 mb-8 border-2 border-cyan-500/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-6xl border-4 border-cyan-400">
                👤
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black mb-2 text-cyan-500">
                My Profile
              </h1>
              <p className="text-gray-400 font-mono text-sm mb-6 break-all">{walletAddress}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 px-6 py-4 rounded-xl border-2 border-cyan-500/50">
                  <div className="text-3xl font-bold text-cyan-400">{totalMemes}</div>
                  <div className="text-xs text-gray-400">Total Memes</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 px-6 py-4 rounded-xl border-2 border-purple-500/50">
                  <div className="text-3xl font-bold text-purple-400">{onChainMemes}</div>
                  <div className="text-xs text-gray-400">On-Chain</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-cyan-900/50 px-6 py-4 rounded-xl border-2 border-green-500/50">
                  <div className="text-3xl font-bold text-green-400">Protected</div>
                  <div className="text-xs text-gray-400">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Memes Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-cyan-500">
              My Memes
            </h2>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-gray-400">Loading your memes...</p>
            </div>
          )}

          {!loading && memes.length === 0 && (
            <div className="text-center py-20 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-2xl border-2 border-dashed border-cyan-500/50">
              <div className="text-8xl mb-6">🎨</div>
              <h3 className="text-3xl font-bold text-cyan-400 mb-4">No memes yet</h3>
              <p className="text-xl text-gray-400 mb-8">Start protecting your meme IP today!</p>
            </div>
          )}

          {!loading && memes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme) => (
                <Link
                  key={meme.id}
                  href={`/certificate/${meme.id}`}
                  className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-cyan-500/30 hover:border-cyan-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={meme.watermarkedImageUrl || meme.imageUrl}
                      alt={meme.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {meme.onChain && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold" style={{boxShadow: '0 0 15px rgba(0, 243, 255, 0.6)'}}>
                        ⛓️ On-Chain
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {meme.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{meme.description}</p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {new Date(meme.timestamp).toLocaleDateString()}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/50">
                        {meme.license}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
