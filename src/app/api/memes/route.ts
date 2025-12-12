import { NextRequest, NextResponse } from 'next/server';
import { generateImageHash } from '@/lib/imageUtils';
import { registerMemeOnChain } from '@/lib/storyProtocol';
import { isStoryProtocolAvailable } from '@/lib/storyClient';

// GET - List all memes (disabled - no database)
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Database disabled for serverless deployment. Memes are stored on IPFS and Story Protocol blockchain.',
    memes: []
  });
}

// POST - Upload new meme (database-free version)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const license = formData.get('license') as string;
    const creatorName = (formData.get('creatorName') as string) || 'Anonymous';
    const registerOnChain = formData.get('registerOnChain') !== 'false';

    if (!file || !title || !license) {
      return NextResponse.json(
        { error: 'Missing required fields: image, title, and license are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size must be less than 10MB' },
        { status: 400 }
      );
    }

    console.log('📸 Processing meme upload...');
    console.log('📁 File:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
    console.log('📝 Title:', title);
    console.log('⚖️ License:', license);

    // Generate hash for blockchain registration
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = await generateImageHash(buffer);
    
    console.log('🔐 Image hash:', hash);

    // Upload to IPFS
    let ipfsHash = '';
    let ipfsGatewayUrl = '';
    
    try {
      console.log('📤 Uploading to IPFS via Pinata...');
      const jwtToken = process.env.PINATA_JWT;
      
      if (!jwtToken) {
        throw new Error('PINATA_JWT not configured');
      }

      const pinataFormData = new FormData();
      pinataFormData.append('file', file);
      
      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: { 
          type: 'meme', 
          title, 
          creator: creatorName,
          license,
          uploadedAt: new Date().toISOString() 
        }
      });
      pinataFormData.append('pinataMetadata', metadata);
      
      const ipfsResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwtToken}` },
        body: pinataFormData,
      });
      
      if (!ipfsResponse.ok) {
        const errorText = await ipfsResponse.text();
        throw new Error(`IPFS upload failed: ${errorText}`);
      }

      const ipfsData = await ipfsResponse.json();
      ipfsHash = ipfsData.IpfsHash;
      ipfsGatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      
      console.log('✅ IPFS Upload Success!');
      console.log('🔗 IPFS Hash:', ipfsHash);
      console.log('🌐 Gateway URL:', ipfsGatewayUrl);
      
    } catch (ipfsError: any) {
      console.error('❌ IPFS upload error:', ipfsError);
      return NextResponse.json(
        { error: 'Failed to upload to IPFS', details: ipfsError.message },
        { status: 500 }
      );
    }

    // Register on Story Protocol blockchain
    let blockchainData = null;
    
    if (registerOnChain && isStoryProtocolAvailable()) {
      try {
        console.log('🔗 Registering on Story Protocol blockchain...');
        const result = await registerMemeOnChain(
          hash, 
          title, 
          `Meme by ${creatorName}`, 
          license
        );
        
        if (result.success && result.ipId) {
          blockchainData = {
            ipId: result.ipId,
            txHash: result.txHash,
            licenseTermsId: result.licenseTermsId,
          };
          
          console.log('✅ Blockchain registration successful!');
          console.log('🆔 IP ID:', result.ipId);
          console.log('📝 TX Hash:', result.txHash);
        } else {
          console.warn('⚠️ Blockchain registration failed:', result.error);
        }
        
      } catch (blockchainError: any) {
        console.error('❌ Blockchain registration error:', blockchainError);
        // Continue without blockchain - IPFS upload was successful
      }
    } else {
      console.log('⏭️ Skipping blockchain registration');
    }

    // Return success with all data
    const response = {
      success: true,
      message: 'Meme uploaded successfully!',
      data: {
        title,
        description,
        license,
        creatorName,
        hash,
        ipfs: {
          hash: ipfsHash,
          url: `ipfs://${ipfsHash}`,
          gatewayUrl: ipfsGatewayUrl,
        },
        blockchain: blockchainData,
        timestamp: new Date().toISOString(),
      }
    };

    console.log('✅ Meme upload complete!');
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('❌ Meme upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload meme', details: error.message },
      { status: 500 }
    );
  }
}
  } catch (error) {
    console.error('Error creating meme:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create meme' },
      { status: 500 }
    );
  }
}
