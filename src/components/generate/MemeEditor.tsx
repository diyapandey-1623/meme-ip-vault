'use client';

interface MemeEditorProps {
  topText: string;
  setTopText: (text: string) => void;
  bottomText: string;
  setBottomText: (text: string) => void;
}

export default function MemeEditor({ topText, setTopText, bottomText, setBottomText }: MemeEditorProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-pink-500 rounded-2xl p-6 shadow-2xl shadow-pink-500/20">
      <h2 className="text-2xl font-bold text-pink-400 mb-4">📝 Add Meme Text (Optional)</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Top Text
          </label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="WHEN YOU FINALLY..."
            className="w-full px-4 py-3 bg-black border-2 border-pink-500/30 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all uppercase"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Bottom Text
          </label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="...FIGURE IT OUT"
            className="w-full px-4 py-3 bg-black border-2 border-pink-500/30 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all uppercase"
            maxLength={50}
          />
        </div>

        <p className="text-xs text-gray-400">
          Classic meme format with white text and black outline
        </p>
      </div>
    </div>
  );
}
