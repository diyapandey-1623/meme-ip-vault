// @ts-ignore - Prisma client types may not be fully loaded in script context
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// @ts-ignore
const prisma = new PrismaClient();

async function cleanUnregisteredMemes() {
  try {
    console.log('🔍 Finding memes not registered on Story Protocol...');
    
    // Find all memes without ipId (not registered on Story Protocol)
    const unregisteredMemes = await prisma.meme.findMany({
      where: {
        OR: [
          { ipId: null },
          { ipId: '' },
          { onChain: false }
        ]
      },
      include: {
        usageLinks: true,
        collaborators: true
      }
    });

    console.log(`\n📊 Found ${unregisteredMemes.length} unregistered memes`);

    if (unregisteredMemes.length === 0) {
      console.log('✅ No unregistered memes to clean!');
      return;
    }

    // Display memes to be deleted
    console.log('\n🗑️  Memes to be deleted:');
    unregisteredMemes.forEach((meme: any, index: number) => {
      console.log(`${index + 1}. "${meme.title}" (ID: ${meme.id})`);
      console.log(`   - Image: ${meme.imageUrl}`);
      console.log(`   - IPFS: ${meme.ipfsUrl || 'None'}`);
      console.log(`   - Story IP: ${meme.ipId || 'Not registered'}`);
    });

    // Delete image files
    console.log('\n🗂️  Deleting image files...');
    let filesDeleted = 0;
    let filesFailed = 0;

    for (const meme of unregisteredMemes) {
      // Delete original image
      if (meme.imageUrl && meme.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join(process.cwd(), 'public', meme.imageUrl);
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            filesDeleted++;
            console.log(`   ✅ Deleted: ${imagePath}`);
          }
        } catch (error) {
          filesFailed++;
          console.log(`   ❌ Failed to delete: ${imagePath}`);
        }
      }

      // Delete watermarked image
      if (meme.watermarkedImageUrl && meme.watermarkedImageUrl.startsWith('/uploads/')) {
        const watermarkedPath = path.join(process.cwd(), 'public', meme.watermarkedImageUrl);
        try {
          if (fs.existsSync(watermarkedPath)) {
            fs.unlinkSync(watermarkedPath);
            filesDeleted++;
            console.log(`   ✅ Deleted: ${watermarkedPath}`);
          }
        } catch (error) {
          filesFailed++;
          console.log(`   ❌ Failed to delete: ${watermarkedPath}`);
        }
      }
    }

    console.log(`\n📁 Files deleted: ${filesDeleted}, Failed: ${filesFailed}`);

    // Delete from database
    console.log('\n💾 Deleting from database...');
    
    const deleteResult = await prisma.meme.deleteMany({
      where: {
        OR: [
          { ipId: null },
          { ipId: '' },
          { onChain: false }
        ]
      }
    });

    console.log(`✅ Deleted ${deleteResult.count} memes from database`);
    
    console.log('\n🎉 Cleanup complete!');
    console.log('\n📊 Summary:');
    console.log(`   - Memes deleted: ${deleteResult.count}`);
    console.log(`   - Files deleted: ${filesDeleted}`);
    console.log(`   - Files failed: ${filesFailed}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanUnregisteredMemes()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
