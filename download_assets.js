const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = {
  'gallery-tools.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=85',
  'gallery-smile-patient.jpg': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=85',
  'gallery-aligner-detail.jpg': 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1000&q=85',
  'gallery-clinic-entrance.jpg': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85',
  'avatar-priya.jpg': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
  'avatar-daniel.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85',
  'avatar-marcus.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85',
  'avatar-hannah.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const [filename, url] of Object.entries(downloads)) {
    const dest = path.join(imagesDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, dest);
      const stat = fs.statSync(dest);
      console.log(`Saved ${filename}: ${stat.size} bytes`);
    } catch (e) {
      console.error(`Failed ${filename}: ${e.message}`);
    }
  }
}

run();
