# AI Meme Generator Integration Guide

## Overview
Complete AI-powered meme generation feature integrated with your Story Protocol minting flow.

## Features Implemented ✅

### 1. **AI Generation Page** (`/generate`)
- Clean, responsive UI with neon colors matching your theme
- Text prompt input with validation
- 5 preset buttons (Funny, Gaming, Anime, Trending, Random)
- Top/Bottom text overlay (classic meme format)
- Automatic watermark: "Created on Meme IP Vault"

### 2. **Components Created**
Located in `src/components/generate/`:

- **PromptInput.tsx** - Text input with submit button and loading state
- **PresetButtons.tsx** - 5 colorful preset categories
- **MemeEditor.tsx** - Top/Bottom text inputs
- **AIImageResult.tsx** - Canvas-based image display with text overlay, download, and mint buttons

### 3. **API Integration**
File: `src/app/api/generate-meme/route.ts`

Currently uses **mock implementation** with random placeholder images.

#### To Connect Real AI API:

**Option A: Replicate (Recommended - Free Tier)**
```bash
npm install replicate
```

Add to `.env`:
```
REPLICATE_API_KEY=your_key_here
```

Uncomment the Replicate code in `route.ts`

**Option B: OpenAI DALL-E 3**
```bash
npm install openai
```

```typescript
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: prompt,
  n: 1,
  size: "1024x1024",
});
const imageUrl = response.data[0].url;
```

**Option C: Stability AI**
```bash
npm install axios
```

```typescript
const response = await axios.post(
  'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
  { text_prompts: [{ text: prompt }] },
  { headers: { Authorization: `Bearer ${process.env.STABILITY_API_KEY}` }}
);
```

### 4. **Mint Flow Integration**

When user clicks "Use This Meme → Mint as NFT":

1. Image data stored in `localStorage` with key `generatedMemeForMint`
2. User redirected to `/upload?from=generate`
3. Upload page detects the param and loads the generated meme
4. Converts base64/URL to `File` object automatically
5. Pre-fills title and description
6. User can proceed with normal minting flow

**Files Modified:**
- `src/app/upload/page.tsx` - Added `loadGeneratedMeme()` function

### 5. **Navigation**
Added "🤖 Generate with AI" button to home page hero section.

## File Structure

```
src/
├── app/
│   ├── generate/
│   │   └── page.tsx                    # Main AI generator page
│   ├── api/
│   │   └── generate-meme/
│   │       └── route.ts                # AI generation API
│   └── upload/
│       └── page.tsx                    # Modified for AI integration
├── components/
│   └── generate/
│       ├── PromptInput.tsx             # Prompt input component
│       ├── PresetButtons.tsx           # Preset categories
│       ├── MemeEditor.tsx              # Text overlay editor
│       └── AIImageResult.tsx           # Result display with canvas
```

## How It Works

### User Flow:
1. User clicks "🤖 Generate with AI" on home page
2. Enters prompt or clicks preset button
3. AI generates image (10-30s)
4. User adds optional top/bottom text
5. Canvas renders image + text + watermark
6. User can download OR mint as NFT
7. If minting, redirected to upload page with image pre-loaded
8. Complete normal minting flow on Story Protocol

### Technical Flow:
```
User Input → /api/generate-meme → AI API → Base64/URL
           → Canvas Rendering → Text Overlay → Watermark
           → localStorage → /upload → File Conversion → Mint
```

## Customization

### Change AI Model:
Edit `src/app/api/generate-meme/route.ts` and replace mock implementation.

### Modify Presets:
Edit `src/components/generate/PresetButtons.tsx`:
```typescript
const presets = [
  { label: '😂 Funny', prompt: '...', gradient: '...' },
  // Add more presets
];
```

### Adjust Text Styling:
Edit `AIImageResult.tsx` → `drawMemeWithText()` function:
```typescript
ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
ctx.fillStyle = 'white'; // Change text color
ctx.strokeStyle = 'black'; // Change outline color
```

### Change Watermark:
Edit `AIImageResult.tsx`:
```typescript
ctx.fillText('Your Custom Watermark', img.width - 10, img.height - 10);
```

## API Keys Required

### For Production:

**Replicate (Easiest)**
- Sign up: https://replicate.com
- Get API token
- Free tier: 50 predictions/month

**OpenAI DALL-E**
- Sign up: https://platform.openai.com
- Get API key
- Pricing: ~$0.02 per image

**Stability AI**
- Sign up: https://stability.ai
- Get API key
- Free tier available

## Environment Variables

Add to `.env.local`:
```
# Choose ONE:
REPLICATE_API_KEY=r8_xxx...
# OR
OPENAI_API_KEY=sk-xxx...
# OR
STABILITY_API_KEY=sk-xxx...
```

## Testing

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/generate
3. Enter prompt: "A funny cat wearing sunglasses"
4. Click generate
5. Add text overlay (optional)
6. Test download button
7. Test "Use in Mint" → Should redirect to upload page
8. Verify image loads in upload form
9. Complete minting flow

## Mobile Responsive

All components are fully responsive:
- Preset buttons: 2 columns on mobile, 5 on desktop
- Canvas: Auto-scales to container width
- Touch-friendly buttons
- Smooth animations

## Error Handling

- Invalid prompt → Shows error message
- API failure → User-friendly error display
- Network timeout → Retry prompt
- Image load failure → Falls back gracefully

## Future Enhancements

- [ ] Image style selection (cartoon, realistic, pixel art)
- [ ] Batch generation (multiple variations)
- [ ] Save favorites to profile
- [ ] Share generated memes
- [ ] Remix existing memes
- [ ] Custom font selection
- [ ] Meme template library
- [ ] Collaborative generation

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API keys in `.env`
3. Test API endpoint directly: `POST /api/generate-meme`
4. Check localStorage for stored data

## Deployment

When deploying:
1. Add environment variables to hosting platform
2. Test API endpoints in production
3. Monitor API usage/costs
4. Set rate limits if needed

---

**Status**: ✅ Ready to use with mock images. Add real API key for production.
