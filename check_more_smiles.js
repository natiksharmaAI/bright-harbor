const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const candidates = [
  { name: 'smile_test_a', id: '1501196354995-cbb51c65aaea' },
  { name: 'smile_test_b', id: '1522075469751-3a6694fb2f61' },
  { name: 'smile_test_c', id: '1570295999919-56ceb5ecca61' },
  { name: 'smile_test_d', id: '1492562080023-ab3db95bfbce' },
  { name: 'smile_test_e', id: '1517841905240-472988babdf9' },
  { name: 'smile_test_f', id: '1539571696357-5a69c17a67c6' },
  { name: 'smile_test_g', id: '1580489944761-15a19d654956' }
];

async function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, res => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(dest)).on('finish', () => resolve(true));
      } else resolve(false);
    }).on('error', () => resolve(false));
  });
}

async function run() {
  const dir = path.join(__dirname, 'test_smiles');
  for (const c of candidates) {
    const dest = path.join(dir, c.name + '.jpg');
    const ok = await download(`https://images.unsplash.com/photo-${c.id}?auto=format&fit=crop&w=1200&q=85`, dest);
    if (ok) {
      const meta = await sharp(dest).metadata();
      // Crop center 60%
      const cropW = Math.round(meta.width * 0.6);
      const cropH = Math.round(cropW * 533 / 800);
      const cropTop = Math.round(meta.height * 0.35);
      const cropLeft = Math.round(meta.width * 0.2);
      await sharp(dest)
        .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
        .resize(800, 533)
        .toFile(path.join(dir, 'preview_' + c.name + '.jpg'));
      console.log('Processed', c.name);
    }
  }
}

run();
