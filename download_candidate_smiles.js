const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const testDir = path.join(__dirname, 'test_smiles');
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

const candidates = [
  { name: 'smile_man1', id: '1507003211169-0a1dd7228f2d' },
  { name: 'smile_woman1', id: '1544005313-94ddf0286df2' },
  { name: 'smile_woman2', id: '1494790108377-be9c29b29330' },
  { name: 'smile_woman3', id: '1517841905240-472988babdf9' },
  { name: 'smile_woman4', id: '1580489944761-15a19d654956' },
  { name: 'smile_mouth1', id: '1595152772835-219674b2a8a6' },
  { name: 'smile_man2', id: '1500648767791-00dcc994a43e' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => reject(err));
  });
}

async function run() {
  for (const item of candidates) {
    const dest = path.join(testDir, item.name + '.jpg');
    const url = `https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=1200&q=85`;
    console.log(`Downloading ${item.name}...`);
    try {
      await download(url, dest);
      const meta = await sharp(dest).metadata();
      console.log(`Saved ${item.name}: ${meta.width}x${meta.height}`);
    } catch(e) {
      console.error(item.name, e.message);
    }
  }
}

run();
