## 🚀 Quick Start Guide

## Your Meme IP Vault is Ready!

The application is now running at: **http://localhost:3000**

### 🔗 New Feature: Blockchain Protection!
Your app now supports **Story Protocol** for on-chain IP registration. See details at the bottom of this guide.

## What You Can Do Now

### 1. View the Home Page
- Open your browser to `http://localhost:3000`
- See the landing page with features overview
- No memes yet? That's expected for a fresh install!

### 2. Upload Your First Meme
1. Click the **"Upload Your Meme"** button
2. Select an image file from your computer
3. Fill in:
   - **Title** (required) - Give your meme a catchy name
   - **Description** (optional) - Add context
   - **Creator Name** (optional) - Your name or alias
   - **License** (required) - Choose usage rules:
     - Free to Use
     - Credit Required
     - No Commercial
   - **Marketplace** (optional) - Check to list for licensing
4. Click **"Upload & Protect My Meme"**
5. You'll be redirected to your meme's certificate page!

### 3. View Your Meme Certificate
After upload, you'll see:
- ✅ Original meme image
- ✅ Watermarked version (download available)
- ✅ Timestamp (proof of when you uploaded it)
- ✅ Unique ID
- ✅ Image hash (fingerprint)
- ✅ License information
- ✅ Usage tracking section

### 4. Track Where Your Meme Appears
On the certificate page:
1. Scroll to "Track Meme Usage" section
2. Paste URLs where you've seen your meme online
3. Build a record of where your meme is being used

### 5. Explore All Memes
- Visit `http://localhost:3000/explore`
- See all uploaded memes
- Filter by license type
- Click any meme to see its certificate

### 6. Browse the Marketplace
- Visit `http://localhost:3000/marketplace`
- See memes available for licensing requests
- Only shows memes where creators opted in

## Testing the Duplicate Detection

Want to test duplicate detection?
1. Upload a meme
2. Download the meme from the certificate page
3. Try uploading the same meme again
4. You'll see a warning: "⚠️ Potential Duplicate Detected!"

## Key Features Demonstrated

✅ **Upload** - Image storage and processing  
✅ **Watermark** - Automatic watermark generation  
✅ **Hash** - Unique fingerprint creation  
✅ **Timestamp** - Proof of upload time  
✅ **License** - Usage rules management  
✅ **Tracking** - Record where memes appear online  
✅ **Duplicate Detection** - Hash comparison for similar images  
✅ **Certificate** - Official proof of ownership  
✅ **Marketplace** - Optional listing for licensing  

## File Locations

- **Original images**: `public/uploads/originals/`
- **Watermarked images**: `public/uploads/watermarked/`
- **Database**: `prisma/dev.db` (SQLite)

## Troubleshooting

### Server won't start?
```bash
npm run dev
```

### Database issues?
```bash
npx prisma migrate dev
```

### Need to reset the database?
```bash
# Delete the database file
rm prisma/dev.db
# Delete migrations
rm -rf prisma/migrations
# Recreate database
npx prisma migrate dev --name init
```

### Can't see uploaded images?
- Check that `public/uploads/originals/` and `public/uploads/watermarked/` directories exist
- Verify file permissions

## Next Steps

1. Upload several different memes
2. Try different license types
3. Add usage tracking links
4. Explore the marketplace
5. Test duplicate detection
6. Download watermarked versions

## Pro Tips

💡 **Image Hash** - The hash is unique to the visual content, not the file  
💡 **Watermark** - Always download the watermarked version for sharing  
💡 **Certificate** - Each meme has a unique URL you can share as proof  
💡 **Tracking** - Add links as you find your meme online  
💡 **Marketplace** - List memes to attract licensing opportunities  
💡 **Blockchain** - Enable Story Protocol for permanent on-chain protection  

## 🔗 Story Protocol Integration (Optional)

### What is it?
Story Protocol adds **blockchain-based IP protection** to your memes:
- Permanent, immutable ownership records
- Smart contract enforced licensing
- Viewable on blockchain explorer
- Industry-standard IP protection

### Quick Setup
1. Read the detailed guide: `STORY_PROTOCOL_SETUP.md`
2. Get a wallet and testnet tokens
3. Add your private key to `.env`:
   ```
   WALLET_PRIVATE_KEY="your_private_key_here"
   ```
4. Restart the server
5. Upload a meme - it registers on blockchain automatically!

### Without Story Protocol
Don't worry! The app works perfectly without it:
- All features still work
- Memes protected in local database
- No blockchain needed
- Can enable later anytime

### With Story Protocol
When enabled:
- ⛓️ Memes register as IP Assets on Story Protocol blockchain
- 🔗 Certificate shows IP Asset ID and transaction hash
- ✅ License terms enforced by smart contracts
- 🌐 Viewable on blockchain explorer

**See `STORY_PROTOCOL_SETUP.md` for complete instructions!**  

## Customization Ideas

Want to enhance the app? Consider:
- Adding user authentication
- Integrating with social media APIs
- Adding email notifications
- Creating PDF certificates
- Implementing blockchain timestamping
- Adding more watermark styles

---

**Enjoy protecting your memes! 🎭**

For any issues, check the main README.md file for detailed documentation.
