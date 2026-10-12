const sharp = require('sharp');
const path = require('path');

async function testCrop() {
  const src = path.join(__dirname, 'test_smiles', 'smile_woman2.jpg');
  await sharp(src)
    .extract({ left: 350, top: 620, width: 500, height: 333 })
    .resize(800, 533)
    .toFile(path.join(__dirname, 'test_mouth_crop.jpg'));
  console.log('Saved test_mouth_crop.jpg');
}
testCrop();
