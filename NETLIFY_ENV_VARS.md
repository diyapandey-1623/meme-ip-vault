# Environment Variables for Netlify

Go to your Netlify dashboard → Site settings → Environment variables

Add these variables:

## Required Variables

1. **NODE_ENV**
   - Value: `production`
   - Important: This ensures the app skips local file storage

2. **DATABASE_URL**
   - Value: `file:./dev.db`
   - Note: SQLite will reset on each deployment (use external DB for persistence)

3. **WALLET_PRIVATE_KEY**
   - Value: `13e70f643325f94f31037f58863f72038b3e84f3a5fa66a98e1299916c02fabe`

4. **RPC_PROVIDER_URL**
   - Value: `https://aeneid.storyrpc.io`

5. **NEXT_PUBLIC_CHAIN_ID**
   - Value: `aeneid`

6. **CHAIN_ID**
   - Value: `aeneid`

7. **PINATA_JWT**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZjdkM2RlYi0xNGU0LTQ3YzUtYThhYi1jNmRiZTE0NDE3NmUiLCJlbWFpbCI6ImRpeWFwYW5kZXkuMTYyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTkzZWE0YTVkNjViODMxZTQxZTgiLCJzY29wZWRLZXlTZWNyZXQiOiJjYWU1MTE2MDI5MTBmMzdhM2QyZGZjMGQzM2E0YzUyZTY1MjMzNGI4OTBmOTQ2ODg5ZGYxMTFmMjczYzU0YTI4IiwiZXhwIjoxNzk2ODk0MDYwfQ.uAU6ctl_uxU2RdaoSY3HM2xwgvO50nr2DIn5OLGcxjY`

8. **PINATA_API_KEY**
   - Value: `993ea4a5d65b831e41e8`

9. **PINATA_SECRET_KEY**
   - Value: `cae511602910f37a3d2dfc0d33a4c52e652334b890f946889df111f273c54a28`

## Optional (for NextAuth, if using)

10. **NEXTAUTH_URL**
    - Value: Your Netlify URL (e.g., `https://your-app.netlify.app`)

11. **NEXTAUTH_SECRET**
    - Value: Generate a random secret key

## After Adding Variables

1. Save all variables
2. Go to Deploys tab
3. Click "Trigger deploy" → "Clear cache and deploy site"
4. Wait 2-3 minutes for deployment

This will ensure the production environment check works correctly!
