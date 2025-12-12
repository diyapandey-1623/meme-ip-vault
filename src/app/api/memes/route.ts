import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processUploadedImage, compareHashes } from '@/lib/imageUtils';
import { registerMemeOnChain, addLicenseTerms } from '@/lib/storyProtocol';
import { isStoryProtocolAvailable } from '@/lib/storyClient';

// GET - List all memes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const license = searchParams.get('license');
    const marketplace = searchParams.get('marketplace');

    const where: any = {};
    if (license) {
      where.license = license;
    }
    if (marketplace === 'true') {
      where.inMarketplace = true;
    }

    const memes = await prisma.meme.findMany({
      where,
      include: {
        usageLinks: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(memes);
  } catch (error) {
    console.error('Error fetching memes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memes' },
      { status: 500 }
    );
  }
}

// POST - Upload new meme
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const license = formData.get('license') as string;
    const inMarketplace = formData.get('inMarketplace') === 'true';
    const creatorName = (formData.get('creatorName') as string) || 'Anonymous';
    const registerOnChain = formData.get('registerOnChain') !== 'false'; // Default true for backwards compatibility
    const isCollaboration = formData.get('isCollaboration') === 'true';
    const collaboratorsJson = formData.get('collaborators') as string;
    const ipfsUrl = formData.get('ipfsUrl') as string;

    // Parse collaborators array
    let collaboratorsData: Array<{name: string; walletAddress: string}> = [];
    if (isCollaboration && collaboratorsJson) {
      try {
        collaboratorsData = JSON.parse(collaboratorsJson);
      } catch (e) {
        console.error('Failed to parse collaborators:', e);
      }
    }

    if (!file || !title || !license) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process image: generate hash, create watermarked version
    const { originalUrl, watermarkedUrl, hash } = await processUploadedImage(
      file
    );

    // Upload to IPFS for Story Protocol
    let ipfsHash = '';
    let ipfsGatewayUrl = '';
    
    if (registerOnChain) {
      try {
        console.log('📤 Uploading to IPFS...');
        const jwtToken = process.env.PINATA_JWT;
        
        if (jwtToken) {
          const pinataFormData = new FormData();
          pinataFormData.append('file', file);
          
          const metadata = JSON.stringify({
            name: file.name,
            keyvalues: { type: 'meme', title, uploadedAt: new Date().toISOString() }
          });
          pinataFormData.append('pinataMetadata', metadata);
          
          const ipfsResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${jwtToken}` },
            body: pinataFormData,
          });
          
          if (ipfsResponse.ok) {
            const ipfsData = await ipfsResponse.json();
            ipfsHash = ipfsData.IpfsHash;
            ipfsGatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
            console.log('✅ IPFS Upload Success:', ipfsGatewayUrl);
          } else {
            console.warn('⚠️ IPFS upload failed, continuing without it');
          }
        }
      } catch (ipfsError) {
        console.error('❌ IPFS upload error:', ipfsError);
        // Continue without IPFS
      }
    }

    // Check for duplicates
    const allMemes = await prisma.meme.findMany({
      select: { id: true, hash: true, title: true },
    });

    const duplicates = allMemes
      .map((meme: { id: string; hash: string; title: string }) => ({
        ...meme,
        similarity: compareHashes(hash, meme.hash),
      }))
      .filter((meme: { id: string; hash: string; title: string; similarity: number }) => meme.similarity > 90); // >90% similarity = potential duplicate

    // Create meme record
    let meme = await prisma.meme.create({
      data: {
        title,
        description,
        imageUrl: originalUrl,
        watermarkedImageUrl: watermarkedUrl,
        hash,
        license,
        inMarketplace,
        creatorName,
        isCollaboration,
        ipfsUrl: ipfsGatewayUrl || ipfsUrl, // Use uploaded IPFS URL or provided one
        collaborators: {
          create: collaboratorsData.map(c => ({
            name: c.name,
            walletAddress: c.walletAddress,
          }))
        }
      },
      include: {
        usageLinks: true,
        collaborators: true,
      },
    });

    // Register on Story Protocol blockchain (only if registerOnChain is true)
    if (registerOnChain && isStoryProtocolAvailable()) {
      try {
        console.log('🔗 Starting blockchain registration...');
        const result = await registerMemeOnChain(hash, title, `Meme by ${creatorName}`, license);
        
        if (result.success && result.ipId) {
          // Update meme with Story Protocol data
          await prisma.meme.update({
            where: { id: meme.id },
            data: {
              ipId: result.ipId,
              ipTxHash: result.txHash,
              licenseTermsId: result.licenseTermsId,
              onChain: true,
            },
          });

          // Refresh meme data to include blockchain info
          meme = await prisma.meme.findUnique({
            where: { id: meme.id },
            include: { 
              usageLinks: true,
              collaborators: true,
            },
          }) || meme;

          console.log(`✅ IP Asset registered: ${result.ipId}`);
          console.log(`📋 Transaction: ${result.txHash}`);
          console.log(`⚖️ License Terms: ${result.licenseTermsId}`);
        } else if (result.error) {
          console.error('❌ Blockchain registration failed:', result.error);
        }
      } catch (error: any) {
        console.error('❌ Story Protocol registration error:', error);
      }
    }

    return NextResponse.json({
      meme,
      duplicates: duplicates.length > 0 ? duplicates : null,
      storyProtocol: isStoryProtocolAvailable()
        ? { enabled: true, message: 'Registering on Story Protocol blockchain...' }
        : { enabled: false, message: 'Story Protocol not configured' },
    });
  } catch (error) {
    console.error('Error creating meme:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create meme' },
      { status: 500 }
    );
  }
}
