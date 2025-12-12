'use client';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function PromptInput({ prompt, setPrompt, onGenerate, loading }: PromptInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">✨ Describe Your Meme</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A funny cat wearing sunglasses at the beach, digital art style..."
            className="w-full px-4 py-3 bg-black border-2 border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all min-h-[120px] resize-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-cyan-500/50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating Magic...
            </span>
          ) : (
            '🚀 Generate Meme with AI'
          )}
        </button>
      </form>
    </div>
  );
}
