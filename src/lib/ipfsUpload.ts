/**
 * IPFS Upload utility using Pinata
 * This uploads images to IPFS so they're publicly accessible for NFT metadata
 */

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

/**
 * Upload a file to IPFS via Pinata
 * Returns the IPFS URL that can be used in NFT metadata
 */
export async function uploadToIPFS(file: File): Promise<string> {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('Pinata API keys not configured. Please add PINATA_API_KEY and PINATA_SECRET_KEY to your .env file');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Optional: Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'meme',
        uploadedAt: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata upload failed: ${errorText}`);
    }

    const data: PinataResponse = await response.json();
    
    // Return the public IPFS gateway URL
    // Using Pinata's dedicated gateway for faster loading
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    
    console.log('✅ Uploaded to IPFS:', ipfsUrl);
    return ipfsUrl;
  } catch (error) {
    console.error('❌ IPFS upload failed:', error);
    throw error;
  }
}

/**
 * Upload JSON metadata to IPFS
 * Used for storing NFT metadata on-chain
 */
export async function uploadJSONToIPFS(jsonData: object): Promise<string> {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('Pinata API keys not configured');
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretKey,
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: {
          name: 'meme-metadata.json',
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata JSON upload failed: ${errorText}`);
    }

    const data: PinataResponse = await response.json();
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    
    console.log('✅ Uploaded metadata to IPFS:', ipfsUrl);
    return ipfsUrl;
  } catch (error) {
    console.error('❌ IPFS metadata upload failed:', error);
    throw error;
  }
}
