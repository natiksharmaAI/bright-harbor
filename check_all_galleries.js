const sharp = require('sharp');
const fs = require('fs');

async function inspectAll() {
  for (let i = 1; i <= 25; i++) {
    const f = `temp_gallery_${i}.png`;
    if (!fs.existsSync(f)) continue;
    const meta = await sharp(f).metadata();
    console.log(`gallery_${i}: ${meta.width}x${meta.height}`);
  }
}
inspectAll();
