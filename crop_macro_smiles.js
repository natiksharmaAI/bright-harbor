const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testSmiles() {
  const outDir = path.join(__dirname, 'macro_smiles');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. smile_woman2 (Red lipstick, beautiful open teeth smile):
  // 1200x1800. Teeth are around top: 400 to 700, left: 300 to 900
  await sharp(path.join(__dirname, 'test_smiles', 'smile_woman2.jpg'))
    .extract({ left: 240, top: 380, width: 720, height: 480 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'smile_case_red_lips.jpg'));
  console.log('Saved smile_case_red_lips.jpg');

  // 2. smile_man1 (Bearded man with bright white teeth smile):
  // 1200x1800. In top0.45, mouth was at top of crop.
  // So mouth is around top: 600 to 900!
  await sharp(path.join(__dirname, 'test_smiles', 'smile_man1.jpg'))
    .extract({ left: 240, top: 620, width: 720, height: 480 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'smile_case_man_beard.jpg'));
  console.log('Saved smile_case_man_beard.jpg');

  // 3. smile_mouth1 (Young man with hat, laughing wide open smile):
  // 1200x1200. Mouth is around top: 450 to 750, left: 280 to 900
  await sharp(path.join(__dirname, 'test_smiles', 'smile_mouth1.jpg'))
    .extract({ left: 280, top: 460, width: 640, height: 426 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'smile_case_young_man.jpg'));
  console.log('Saved smile_case_young_man.jpg');

  // 4. smile_wide1 (1200x1200):
  await sharp(path.join(__dirname, 'test_smiles', 'smile_wide1.jpg'))
    .resize(800, 533, { fit: 'cover', position: 'center' })
    .toFile(path.join(outDir, 'smile_case_wide1.jpg'));
  console.log('Saved smile_case_wide1.jpg');

  // 5. smile_wide2 (1200x1798):
  await sharp(path.join(__dirname, 'test_smiles', 'smile_wide2.jpg'))
    .extract({ left: 250, top: 600, width: 700, height: 466 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'smile_case_wide2.jpg'));
  console.log('Saved smile_case_wide2.jpg');

  // 6. smile_wide3 (1200x1800):
  await sharp(path.join(__dirname, 'test_smiles', 'smile_wide3.jpg'))
    .extract({ left: 250, top: 600, width: 700, height: 466 })
    .resize(800, 533)
    .toFile(path.join(outDir, 'smile_case_wide3.jpg'));
  console.log('Saved smile_case_wide3.jpg');
}

testSmiles().catch(console.error);
