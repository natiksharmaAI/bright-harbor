const https = require('https');
const fs = require('fs');

async function downloadBonding() {
  const url1 = 'https://www.whitesdental.co.uk/wp-content/uploads/2023/03/Composite-Bonding-Before-And-After-London-1-1.png';
  const url2 = 'https://cdn.prod.website-files.com/6335ddb658061a498cf7a461/6a204f8a761d53cd3fc2a9df_dental-bonding-chipped-tooth-before-after-washington-dc%202%20copy.webp';

  const dl = (u, dest) => new Promise(resolve => {
    https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      console.log('Status for', dest, res.statusCode);
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(dest));
        res.on('end', () => {
          console.log('Saved', dest);
          resolve();
        });
      } else {
        resolve();
      }
    }).on('error', e => {
      console.log('Error', dest, e.message);
      resolve();
    });
  });

  await dl(url1, 'temp_bonding_1.png');
  await dl(url2, 'temp_bonding_2.webp');
}

downloadBonding();
