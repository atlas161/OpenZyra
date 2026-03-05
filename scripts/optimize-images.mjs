#!/usr/bin/env node
/**
 * Image Optimization Script
 * Generates multiple sizes of OpenZyra.webp for responsive loading
 * 
 * Usage: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_IMAGE = join(__dirname, '..', 'medias', 'OpenZyra.webp');
const OUTPUT_DIR = join(__dirname, '..', 'medias');

// Sizes to generate (width in pixels)
const SIZES = [
  { width: 400, suffix: '400' },   // Mobile
  { width: 800, suffix: '800' },   // Tablet
  { width: 1200, suffix: '1200' } // Desktop
];

async function optimizeImages() {
  console.log('🖼️  Optimizing OpenZyra logo images...\n');

  if (!existsSync(SOURCE_IMAGE)) {
    console.error('❌ Source image not found:', SOURCE_IMAGE);
    process.exit(1);
  }

  // Get original image metadata
  const metadata = await sharp(SOURCE_IMAGE).metadata();
  console.log(`📊 Original: ${metadata.width}x${metadata.height}px (${Math.round(metadata.size / 1024)}KB)`);

  for (const size of SIZES) {
    const outputFile = join(OUTPUT_DIR, `OpenZyra-${size.suffix}.webp`);
    
    try {
      await sharp(SOURCE_IMAGE)
        .resize(size.width, null, { // null height maintains aspect ratio
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({
          quality: 85,
          effort: 4
        })
        .toFile(outputFile);

      const stats = await sharp(outputFile).metadata();
      console.log(`✅ Generated: OpenZyra-${size.suffix}.webp (${stats.width}x${stats.height}px)`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size.suffix}:`, error.message);
    }
  }

  console.log('\n🎉 Image optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Update your <img> tags to use srcset for responsive images');
  console.log('2. Update the preload link in index.html to use the 400px version');
}

optimizeImages().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
