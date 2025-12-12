import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to upload images to IPFS via Pinata
 * This makes images publicly accessible for NFT metadata
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const jwtToken = process.env.PINATA_JWT;

    if (!jwtToken) {
      return NextResponse.json(
        { 
          error: 'IPFS not configured',
          message: 'Please add PINATA_JWT to your .env file. Get free keys at https://pinata.cloud'
        },
        { status: 500 }
      );
    }

    console.log('📤 Starting IPFS upload via Pinata...');
    console.log('📁 File name:', file.name);
    console.log('📏 File size:', file.size, 'bytes');

    // Upload to Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'meme',
        uploadedAt: new Date().toISOString()
      }
    });
    pinataFormData.append('pinataMetadata', metadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: pinataFormData,
    });

    console.log('📡 Pinata API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Pinata error:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload to IPFS', details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('✅ Pinata response:', data);
    
    // Return ipfs:// URI for Story Protocol metadata
    const ipfsHash = data.IpfsHash;
    const ipfsUrl = `ipfs://${ipfsHash}`;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    console.log('✅ Uploaded to IPFS successfully!');
    console.log('🔗 IPFS Hash:', ipfsHash);
    console.log('🔗 IPFS URI:', ipfsUrl);
    console.log('🌐 Gateway URL:', gatewayUrl);

    return NextResponse.json({
      success: true,
      ipfsHash,
      ipfsUrl,
      gatewayUrl,
      pinSize: data.PinSize,
    });

  } catch (error: any) {
    console.error('❌ IPFS upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload to IPFS', message: error.message },
      { status: 500 }
    );
  }
}
