'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PromptInput from '@/components/generate/PromptInput';
import AIImageResult from '@/components/generate/AIImageResult';
import MemeEditor from '@/components/generate/MemeEditor';
import PresetButtons from '@/components/generate/PresetButtons';

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  const generateMeme = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    
    if (!finalPrompt.trim()) {
      setError('Please enter a prompt or select a preset');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Better error messages for Hugging Face
        if (response.status === 503) {
          const waitTime = data.estimated_time || 20;
          throw new Error(`AI model is warming up. Please wait ${Math.ceil(waitTime)} seconds and try again.`);
        }
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a minute before trying again.');
        }
        throw new Error(data.message || data.error || 'Failed to generate meme');
      }

      setGeneratedImage(data.imageUrl);
      
      // Store in localStorage for later use
      localStorage.setItem('generatedMeme', JSON.stringify({
        imageUrl: data.imageUrl,
        prompt: finalPrompt,
        topText,
        bottomText,
        timestamp: new Date().toISOString(),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meme');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    generateMeme(presetPrompt);
  };

  const handleUseInMint = () => {
    if (generatedImage) {
      // Store the generated image data
      localStorage.setItem('generatedMemeForMint', JSON.stringify({
        imageUrl: generatedImage,
        prompt,
        topText,
        bottomText,
      }));
      
      // Navigate to upload page
      router.push('/upload?from=generate');
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-pulse">
            🤖 AI Meme Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Create unique memes with AI, then mint them as NFTs on Story Protocol
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-900/20 border-2 border-red-500 p-6 rounded-lg animate-pulse">
            <p className="text-red-300 font-bold">❌ {error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input & Controls */}
          <div className="space-y-6">
            {/* Preset Buttons */}
            <PresetButtons onPresetClick={handlePresetClick} disabled={loading} />

            {/* Prompt Input */}
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={() => generateMeme()}
              loading={loading}
            />

            {/* Meme Text Editor */}
            <MemeEditor
              topText={topText}
              setTopText={setTopText}
              bottomText={bottomText}
              setBottomText={setBottomText}
            />

            {/* Info Card */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-2 border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-cyan-500 font-bold text-lg mb-3">💡 Tips for Better Memes</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Be specific: "A cat wearing sunglasses at the beach"</li>
                <li>• Add style: "cyberpunk style", "pixel art", "cartoon"</li>
                <li>• Use presets for quick inspiration</li>
                <li>• Add text overlay for classic meme format</li>
                <li>• Generated memes include "Meme IP Vault" watermark</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Generated Image */}
          <div>
            <AIImageResult
              imageUrl={generatedImage}
              loading={loading}
              topText={topText}
              bottomText={bottomText}
              onUseInMint={handleUseInMint}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
