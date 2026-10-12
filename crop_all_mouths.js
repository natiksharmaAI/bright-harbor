const sharp = require('sharp');
const path = require('path');

async function testAllMouths() {
  const testDir = path.join(__dirname, 'test_smiles');

  // 1. smile_woman2 (Red lips):
  // left: 350, top: 620, width: 500, height: 333
  await sharp(path.join(testDir, 'smile_woman2.jpg'))
    .extract({ left: 350, top: 620, width: 500, height: 333 })
    .resize(800, 533)
    .toFile(path.join(__dirname, 'macro_mouth_1_redlips.jpg'));

  // 2. smile_man1 (Bearded man):
  // 1200x1800. In smile_man1_top0.45 (top: 810), the mouth was right at the top.
  // So mouth is around top: 700 to 1050!
  await sharp(path.join(testDir, 'smile_man1.jpg'))
    .extract({ left: 350, top: 720, width: 500, height: 333 })
    .resize(800, 533)
    .toFile(path.join(__dirname, 'macro_mouth_2_beard.jpg'));

  // 3. smile_mouth1 (Young man laughing):
  // 1200x1200. In preview, mouth was around top: 460.
  await sharp(path.join(testDir, 'smile_mouth1.jpg'))
    .extract({ left: 350, top: 520, width: 500, height: 333 })
    .resize(800, 533)
    .toFile(path.join(__dirname, 'macro_mouth_3_youngman.jpg'));

  // 4. smile_test_g (Studio high-key woman):
  // 1200x1510. Mouth is around top: 750, left: 350
  await sharp(path.join(testDir, 'smile_test_g.jpg'))
    .extract({ left: 350, top: 750, width: 500, height: 333 })
    .resize(800, 533)
    .toFile(path.join(__dirname, 'macro_mouth_4_studiowoman.jpg'));

  console.log('Saved all 4 macro mouth crops!');
}

testAllMouths().catch(console.error);
