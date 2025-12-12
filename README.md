# 🔐 Meme IP Vault

> **Secure, Own, and Protect Your Memes Forever on the Blockchain**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Story Protocol](https://img.shields.io/badge/Story_Protocol-Integrated-purple?style=flat)](https://www.storyprotocol.xyz/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎬 Demo Video

> **[Add Demo Video Link Here]**

---

## 📝 Summary

**Meme IP Vault** is a Web3-powered platform that enables creators to **register, protect, and monetize their memes** as on-chain intellectual property using **Story Protocol**. The platform combines AI-powered meme generation with blockchain-based copyright registration, creating an immutable proof of ownership. Users can generate memes using AI, upload existing ones, register them on-chain, showcase them in a marketplace, and earn from licensing—all while maintaining verifiable ownership through wallet-based authentication.

In the age of viral content, creators lose attribution and revenue. Meme IP Vault solves this by bringing **ownership, provenance, and royalty tracking** to meme culture.

---

## ✨ Key Features

- 🎨 **AI Meme Generation** – Create unique memes using AI with customizable prompts and text overlays
- ⛓️ **On-Chain IP Registration** – Register memes as intellectual property on Story Protocol blockchain
- 🏪 **Meme Marketplace** – Explore and discover registered memes with licensing information
- ⭐ **Rating & Verification System** – Community-driven ratings with verified badge for authentic memes
- 👛 **MetaMask Wallet Integration** – Secure wallet-based authentication with multi-wallet support
- 🔒 **Copyright Protection Workflow** – Complete workflow from creation to on-chain registration
- 💰 **Royalty Tracking** – Built-in royalty payment system for licensed usage
- 📊 **Social Engagement** – Like, rate, and interact with meme NFTs
- 🌐 **IPFS Storage** – Decentralized image storage for permanent availability
- 📜 **License Management** – Support for Commercial, Non-Commercial, and CC0 licenses

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | SQLite (Development), PostgreSQL (Production-ready) |
| **Blockchain** | Story Protocol, Ethereum (Sepolia Testnet) |
| **Storage** | IPFS via Pinata |
| **Authentication** | NextAuth.js, Web3 Wallet (MetaMask) |
| **AI Integration** | OpenAI DALL-E API |
| **Smart Contracts** | Story Protocol SDK (@story-protocol/core-sdk) |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  (Next.js Frontend - Tailwind CSS, React Components)        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Meme APIs    │  │ AI Generator │  │ Royalty API  │      │
│  │ (CRUD)       │  │ (DALL-E)     │  │ (Payments)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│   Prisma DB  │ │   IPFS   │ │    Story     │
│   (SQLite)   │ │ (Pinata) │ │   Protocol   │
│              │ │          │ │  (Blockchain)│
└──────────────┘ └──────────┘ └──────────────┘
      │                              │
      │                              ▼
      │                    ┌──────────────────┐
      │                    │  IP Registration │
      │                    │  License Terms   │
      │                    │  Royalty Split   │
      └────────────────────┤  On-Chain Assets │
                           └──────────────────┘
```

**Flow:**
1. User connects wallet → Authenticates via MetaMask
2. Generate/Upload meme → Stored locally & uploaded to IPFS
3. Register on Story Protocol → Creates on-chain IP asset with license terms
4. Meme listed in Marketplace → Discoverable with ownership proof
5. Community engagement → Likes, ratings, verification badges
6. Royalty tracking → Payment system for licensed usage

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Node.js 18+ and npm/yarn
- MetaMask wallet extension
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/meme-ip-vault.git
cd meme-ip-vault
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Story Protocol Configuration
NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL="https://testnet.storyrpc.io"
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID="1513"
STORY_PROTOCOL_PRIVATE_KEY="your_wallet_private_key_here"

# IPFS/Pinata (for decentralized storage)
PINATA_API_KEY="your_pinata_api_key"
PINATA_SECRET_KEY="your_pinata_secret_key"

# AI Generation (Optional - for meme generator)
OPENAI_API_KEY="your_openai_api_key"

# NextAuth
NEXTAUTH_SECRET="generate_random_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Initialize Database
```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Step 5: (Optional) Run Utility Scripts
```bash
# Check wallet balance on Story Protocol
npx ts-node scripts/checkBalance.ts

# Clean unregistered memes from database
npx ts-node scripts/cleanUnregisteredMemes.ts
```

### Step 6: Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit **http://localhost:3000** 🎉

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite/PostgreSQL connection string | ✅ Yes |
| `NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL` | Story Protocol RPC endpoint | ✅ Yes |
| `NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID` | Chain ID (1513 for testnet) | ✅ Yes |
| `STORY_PROTOCOL_PRIVATE_KEY` | Wallet private key for signing transactions | ✅ Yes |
| `PINATA_API_KEY` | Pinata API key for IPFS uploads | ✅ Yes |
| `PINATA_SECRET_KEY` | Pinata secret key | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI generation | ⚠️ Optional |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | ✅ Yes |
| `NEXTAUTH_URL` | Base URL for authentication callbacks | ✅ Yes |

> ⚠️ **Security Note:** Never commit `.env` files to version control. Use `.env.example` for reference.

---

## 📁 Folder Structure

```
meme-ip-vault/
├── prisma/
│   ├── schema.prisma          # Database schema with Meme, Like, Rating models
│   ├── migrations/            # Database migration history
│   └── dev.db                 # SQLite database (development)
├── public/
│   └── uploads/               # User-uploaded memes (originals + watermarked)
├── scripts/
│   ├── checkBalance.ts        # Check Story Protocol wallet balance
│   └── cleanUnregisteredMemes.ts  # Clean unregistered memes from DB
├── src/
│   ├── app/                   # Next.js 14 App Router
│   │   ├── api/               # API routes (memes, auth, royalty)
│   │   ├── certificate/       # Meme detail/certificate pages
│   │   ├── explore/           # Browse all registered memes
│   │   ├── generate/          # AI meme generator
│   │   ├── marketplace/       # Meme marketplace
│   │   ├── profile/           # User profile page
│   │   └── upload/            # Upload existing memes
│   ├── components/            # React components
│   │   ├── BlockchainStatus.tsx
│   │   ├── ConnectWalletButton.tsx
│   │   ├── LikeButton.tsx
│   │   ├── StarRating.tsx
│   │   └── VerifiedBadge.tsx
│   ├── lib/                   # Utility libraries
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── storyProtocol.ts   # Story Protocol integration
│   │   ├── ipfsUpload.ts      # IPFS upload utilities
│   │   └── imageUtils.ts      # Image processing utilities
│   └── types/                 # TypeScript type definitions
├── .env.local                 # Environment variables (not in git)
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json               # Project dependencies
```

---

## ⛓️ Story Protocol Integration

### How It Works

**Story Protocol** is a blockchain protocol for programmable IP (Intellectual Property). It allows creators to register digital assets as **IP Assets** with customizable license terms and royalty splits.

#### Registration Flow:

1. **Upload to IPFS**
   - Meme image uploaded to IPFS via Pinata
   - Returns permanent IPFS URL (e.g., `ipfs://Qm...`)

2. **Register IP Asset**
   ```typescript
   const ipAsset = await client.ipAsset.register({
     nftContract: NFT_CONTRACT_ADDRESS,
     tokenId: memeId,
     ipMetadata: {
       title: meme.title,
       description: meme.description,
       ipType: "Meme",
     }
   });
   ```

3. **Attach License Terms**
   - Commercial Use License
   - Non-Commercial License
   - Creative Commons Zero (CC0)

4. **Record On-Chain**
   - Transaction hash stored in database
   - IP ID (unique identifier) linked to meme
   - Immutable ownership proof

---

##  Acknowledgments

- **[Story Protocol](https://www.storyprotocol.xyz/)** – For the IP blockchain infrastructure
- **[Pinata](https://pinata.cloud/)** – For IPFS hosting services
- **[OpenAI](https://openai.com/)** – For AI image generation capabilities
- **[Next.js Team](https://nextjs.org/)** – For the amazing framework

---

<div align="center">

**Built with ❤️ for HackQuest Web3**

⭐ Star this repo if you found it helpful!

</div>
