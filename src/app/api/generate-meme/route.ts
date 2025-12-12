import { NextRequest, NextResponse } from 'next/server';

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

/**
 * API Route to generate memes using AI image generation
 * Using Stability AI SD3 - High quality image generation
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    const apiKey = process.env.STABILITY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'STABILITY_API_KEY is not set in .env' },
        { status: 500 }
      );
    }

    console.log('🎨 Generating image with Stability AI SD3...');
    console.log('📝 Prompt:', prompt);

    // Create FormData for Stability AI API
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('mode', 'text-to-image');
    formData.append('output_format', 'png');
    formData.append('aspect_ratio', '1:1');

    const stabilityRes = await fetch(STABILITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'image/*',
      },
      body: formData,
    });

    if (!stabilityRes.ok) {
      const text = await stabilityRes.text();
      console.error('❌ Stability AI error:', stabilityRes.status, text);
      
      // Handle specific errors
      if (stabilityRes.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key', message: 'Your Stability AI API key is invalid. Get one at https://platform.stability.ai/account/keys' },
          { status: 401 }
        );
      }

      if (stabilityRes.status === 402) {
        return NextResponse.json(
          { error: 'Insufficient credits', message: 'You need to add credits to your Stability AI account.' },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: `Stability AI error (${stabilityRes.status}): ${text}` },
        { status: 500 }
      );
    }

    const arrayBuffer = await stabilityRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = stabilityRes.headers.get('content-type') || 'image/png';

    console.log('✅ Image generated successfully:', arrayBuffer.byteLength, 'bytes');

    // Return base64 image to frontend
    return NextResponse.json({
      success: true,
      imageUrl: `data:${mimeType};base64,${base64}`,
      prompt: prompt,
      model: 'Stable Diffusion 3',
    });

  } catch (e: any) {
    console.error('❌ Image generation failed:', e);
    return NextResponse.json(
      { error: e.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
