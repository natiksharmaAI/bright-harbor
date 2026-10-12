const fs = require('fs');
const https = require('https');
const path = require('path');

const services = {
  'service-general.jpg': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
  'service-cosmetic.jpg': 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80',
  'service-ortho.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
  'service-implants.jpg': 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=80',
  'service-pediatric.jpg': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  'service-emergency.jpg': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=80',
  'service-restorative.jpg': 'https://images.unsplash.com/photo-1571772930227-3ce646f387dd?auto=format&fit=crop&w=600&q=80',
  'service-sedation.jpg': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => fs.unlink(dest, () => reject(err)));
  });
}

async function run() {
  const imagesDir = path.join(__dirname, 'images');
  for (const [name, url] of Object.entries(services)) {
    const dest = path.join(imagesDir, name);
    try {
      await download(url, dest);
      console.log(`Saved ${name}`);
    } catch (e) {
      console.error(`Error ${name}: ${e.message}`);
    }
  }
}

run();
