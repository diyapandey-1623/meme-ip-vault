// Example implementations for real AI providers
// Copy one of these into src/app/api/generate-meme/route.ts

// ============================================================
// OPTION 1: REPLICATE (RECOMMENDED - FREE TIER AVAILABLE)
// ============================================================

import Replicate from 'replicate';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `${prompt}, meme style, high quality, digital art, funny`,
          negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
          width: 1024,
          height: 1024,
          num_inference_steps: 30,
        }
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
    });
  } catch (error: any) {
    console.error('Replicate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meme', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// OPTION 2: OPENAI DALL-E 3 (BEST QUALITY, PAID)
// ============================================================

import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a funny meme image: ${prompt}. Make it meme-worthy, humorous, and shareable.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    const imageUrl = response.data[0].url;

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
    });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meme', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// OPTION 3: STABILITY AI (GOOD BALANCE)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: `${prompt}, meme style, funny, high quality, digital art`,
              weight: 1,
            },
            {
              text: 'blurry, low quality, distorted, ugly',
              weight: -1,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.statusText}`);
    }

    const data = await response.json();
    const base64Image = data.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
    });
  } catch (error: any) {
    console.error('Stability AI error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meme', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// OPTION 4: HUGGING FACE (FREE, MANY MODELS)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${prompt}, meme style, funny, high quality`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
    });
  } catch (error: any) {
    console.error('Hugging Face error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meme', message: error.message },
      { status: 500 }
    );
  }
}
