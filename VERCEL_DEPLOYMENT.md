# Vercel Deployment Guide

## Step 1: Push Latest Code to GitHub
Already done! ✅

## Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository: `diyapandey-1623/meme-ip-vault`
4. Click "Import"

## Step 3: Configure Environment Variables

**CRITICAL:** Add these environment variables in Vercel dashboard before deploying:

### Go to: Project Settings → Environment Variables

Add each of these:

1. **PINATA_JWT**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZjdkM2RlYi0xNGU0LTQ3YzUtYThhYi1jNmRiZTE0NDE3NmUiLCJlbWFpbCI6ImRpeWFwYW5kZXkuMTYyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTkzZWE0YTVkNjViODMxZTQxZTgiLCJzY29wZWRLZXlTZWNyZXQiOiJjYWU1MTE2MDI5MTBmMzdhM2QyZGZjMGQzM2E0YzUyZTY1MjMzNGI4OTBmOTQ2ODg5ZGYxMTFmMjczYzU0YTI4IiwiZXhwIjoxNzk2ODk0MDYwfQ.uAU6ctl_uxU2RdaoSY3HM2xwgvO50nr2DIn5OLGcxjY
   ```

2. **WALLET_PRIVATE_KEY**
   ```
   13e70f643325f94f31037f58863f72038b3e84f3a5fa66a98e1299916c02fabe
   ```

3. **RPC_PROVIDER_URL**
   ```
   https://aeneid.storyrpc.io
   ```

4. **NEXT_PUBLIC_CHAIN_ID**
   ```
   aeneid
   ```

5. **CHAIN_ID**
   ```
   aeneid
   ```

6. **DATABASE_URL**
   ```
   file:./dev.db
   ```

### Optional (for NextAuth - not required for core functionality):

7. **NEXTAUTH_SECRET**
   ```
   your-secret-key-change-this-in-production
   ```

8. **NEXTAUTH_URL**
   - Leave empty for now, Vercel auto-sets this

## Step 4: Deploy Settings

- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)
- **Node.js Version:** 18.x (should be default)

Click "Deploy"

## Step 5: Wait for Build

The build should take 2-5 minutes. Watch the logs for any errors.

## Step 6: Test After Deployment

Once deployed, test these features:

1. **Homepage loads** ✅
2. **Connect MetaMask wallet** ✅
3. **Upload a meme image** ✅
4. **IPFS upload works** - Check console for "✅ IPFS Upload Success"
5. **Register on Story Protocol** ✅

## Common Issues & Solutions

### Issue 1: "ENOENT: no such file or directory, mkdir"
**Solution:** Already fixed! The code now detects Vercel environment and skips local file storage.

### Issue 2: "IPFS not configured"
**Solution:** Make sure `PINATA_JWT` is set in Vercel environment variables.

### Issue 3: Images not uploading
**Solution:** 
- Check browser console for errors
- Verify IPFS upload logs in Vercel function logs
- Make sure image is under 10MB

### Issue 4: Story Protocol registration fails
**Solution:**
- Verify `WALLET_PRIVATE_KEY` is correct
- Check wallet has test tokens (use faucet if needed)
- Verify `RPC_PROVIDER_URL` is correct

## Redeploy After Fixing Issues

If you change environment variables:
1. Go to Deployments tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"
4. Check "Use existing build cache" (optional)

## View Logs

To debug issues:
1. Go to your project in Vercel
2. Click "Functions" tab
3. Click on a function to see logs
4. Or click "Deployments" → Click deployment → "View Function Logs"

## Success Indicators

Your deployment is successful when you can:
- ✅ Upload an image
- ✅ See "✅ IPFS Upload Success" in browser console
- ✅ Register meme on Story Protocol
- ✅ Get back an IP ID and transaction hash
- ✅ View meme in Explore page

## Need Help?

Check function logs in Vercel dashboard for detailed error messages.
