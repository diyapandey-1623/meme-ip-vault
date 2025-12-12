# 🚀 AI Meme Generator - Quick Reference

## URLs
- **Generate Page**: http://localhost:3000/generate
- **Upload/Mint**: http://localhost:3000/upload
- **Home**: http://localhost:3000

## File Locations
```
📁 Main Page: src/app/generate/page.tsx
📁 API: src/app/api/generate-meme/route.ts
📁 Components: src/components/generate/*.tsx
📁 Utils: src/lib/memeGeneratorUtils.ts
```

## User Flow
```
Generate → Add Text → Download/Mint → Upload → Story Protocol → NFT
```

## Quick Test
1. `npm run dev`
2. Visit `/generate`
3. Type: "funny cat with sunglasses"
4. Click "Generate"
5. Add text (optional)
6. Click "Use This Meme → Mint as NFT"
7. Complete minting

## Add Real AI (Replicate)
```bash
npm install replicate
```

`.env.local`:
```
REPLICATE_API_KEY=r8_xxxxx
```

Copy code from `AI_PROVIDER_EXAMPLES.md` → Replicate section

## Key Features
✅ 5 Preset buttons
✅ Text overlay (top/bottom)
✅ Watermark automatic
✅ Download as PNG
✅ Mint integration
✅ Mobile responsive
✅ Error handling
✅ Loading states

## Components
- **PromptInput** - User input
- **PresetButtons** - Quick categories
- **MemeEditor** - Text overlay
- **AIImageResult** - Display & actions

## localStorage Keys
```javascript
'generatedMeme'         // Current generation data
'generatedMemeForMint'  // Passed to upload page
```

## Customization

### Colors
```typescript
// PresetButtons.tsx
gradient: 'from-purple-500 to-pink-500'
```

### Text Style
```typescript
// AIImageResult.tsx
ctx.font = 'bold 60px Impact';
ctx.fillStyle = 'white';
```

### Watermark
```typescript
ctx.fillText('Your Text', x, y);
```

## API Providers

| Provider | Package | Key Format |
|----------|---------|------------|
| Replicate | `replicate` | `r8_xxx` |
| OpenAI | `openai` | `sk-xxx` |
| Stability | `axios` | `sk-xxx` |
| Hugging Face | none | `hf_xxx` |

## Presets
1. 😂 Funny - Comedy/hilarious style
2. 🎮 Gaming - Retro/pixel art
3. 🎨 Anime - Kawaii/manga
4. 🔥 Trending - Viral/modern
5. 🎲 Random - Surreal/creative

## Error Messages
```typescript
'Please enter a prompt'    // Empty input
'Failed to generate meme'  // API error
'Image must be uploaded'   // IPFS failure
```

## Performance
- Initial load: ~50KB
- Canvas render: <100ms
- API call: 10-30s
- Download: instant
- Mint: blockchain dependent

## Mobile Breakpoints
```css
sm: 640px   // 2 columns
md: 768px   // 3 columns
lg: 1024px  // 5 columns
```

## Status
🟢 **WORKING** - Mock images
🟡 **PENDING** - Real AI (add API key)

## Next Actions
1. Test mock version
2. Choose AI provider
3. Add API key
4. Test real generation
5. Deploy!

---

Need help? Check:
- `AI_GENERATOR_COMPLETE_SUMMARY.md` - Full documentation
- `SETUP_AI_GENERATOR.md` - Setup guide
- `AI_PROVIDER_EXAMPLES.md` - Code examples
