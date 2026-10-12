const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testOffsets() {
  const images = ['smile_man1.jpg', 'smile_woman2.jpg', 'smile_woman3.jpg', 'smile_woman4.jpg', 'smile_man2.jpg'];
  const testDir = path.join(__dirname, 'test_smiles');
  const outDir = path.join(__dirname, 'cropped_smiles');

  for (const imgName of images) {
    const meta = await sharp(path.join(testDir, imgName)).metadata();
    console.log(imgName, meta.width, meta.height);
    // Let's sample 3 crops at different vertical positions
    for (const topRatio of [0.35, 0.45, 0.55]) {
      const top = Math.round(meta.height * topRatio);
      const left = Math.round(meta.width * 0.2);
      const width = Math.round(meta.width * 0.6);
      const height = Math.round(width * (533 / 800));
      const outName = `${imgName.replace('.jpg', '')}_top${topRatio}.jpg`;
      await sharp(path.join(testDir, imgName))
        .extract({ left, top, width, height })
        .resize(800, 533)
        .toFile(path.join(outDir, outName));
      console.log(`Saved ${outName}`);
    }
  }
}

testOffsets();
