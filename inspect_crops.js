const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'cropped_smiles');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function cropSmile(srcName, cropBox, outName) {
  const src = path.join(__dirname, 'test_smiles', srcName);
  const dest = path.join(outDir, outName);
  await sharp(src)
    .extract(cropBox)
    .resize(800, 533, { fit: 'cover' })
    .toFile(dest);
  console.log(`Saved ${outName}`);
}

async function run() {
  // Let's test cropping each image around the smile
  // In a portrait of 1200x1800:
  // mouth is roughly around left: 350, top: 900-1100, width: 500, height: 350
  
  // For smile_mouth1 (1200x1200):
  // Let's check metadata of smile_mouth1
  const metaMouth = await sharp(path.join(__dirname, 'test_smiles', 'smile_mouth1.jpg')).metadata();
  console.log('smile_mouth1 meta:', metaMouth);
  
  // Let's create a direct 800x533 crop of smile_mouth1 centered
  await sharp(path.join(__dirname, 'test_smiles', 'smile_mouth1.jpg'))
    .resize(800, 533, { fit: 'cover', position: 'center' })
    .toFile(path.join(outDir, 'crop_mouth1_center.jpg'));

  // smile_woman1 (1200x1798)
  await sharp(path.join(__dirname, 'test_smiles', 'smile_woman1.jpg'))
    .extract({ left: 300, top: 850, width: 600, height: 400 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'crop_woman1_smile.jpg'));

  // smile_woman2 (1200x1800)
  await sharp(path.join(__dirname, 'test_smiles', 'smile_woman2.jpg'))
    .extract({ left: 300, top: 800, width: 600, height: 400 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'crop_woman2_smile.jpg'));

  // smile_woman3 (1200x1800)
  await sharp(path.join(__dirname, 'test_smiles', 'smile_woman3.jpg'))
    .extract({ left: 300, top: 850, width: 600, height: 400 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'crop_woman3_smile.jpg'));

  // smile_man1 (1200x1800)
  await sharp(path.join(__dirname, 'test_smiles', 'smile_man1.jpg'))
    .extract({ left: 300, top: 850, width: 600, height: 400 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'crop_man1_smile.jpg'));

  console.log('All crops created in cropped_smiles/');
}

run();
