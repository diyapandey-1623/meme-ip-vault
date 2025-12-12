'use client';

interface PresetButtonsProps {
  onPresetClick: (prompt: string) => void;
  disabled: boolean;
}

const presets = [
  {
    label: '😂 Funny',
    prompt: 'A hilarious meme with a funny expression, comedy style, vibrant colors',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    label: '🎮 Gaming',
    prompt: 'Epic gaming meme with retro pixel art style, arcade aesthetic, neon colors',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    label: '🎨 Anime',
    prompt: 'Cute anime meme character with kawaii style, manga aesthetic, pastel colors',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    label: '🔥 Trending',
    prompt: 'Viral trending meme format, modern internet culture, bold typography',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    label: '🎲 Random',
    prompt: 'Completely random and unexpected meme concept, surreal and creative',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export default function PresetButtons({ onPresetClick, disabled }: PresetButtonsProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">⚡ Quick Presets</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onPresetClick(preset.prompt)}
            disabled={disabled}
            className={`px-4 py-3 bg-gradient-to-r ${preset.gradient} hover:scale-105 text-white font-bold rounded-lg transition-all transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-sm`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
