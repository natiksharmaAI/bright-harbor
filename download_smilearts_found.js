const https = require('https');
const fs = require('fs');

async function downloadSmileArts() {
  const list = ['veneers1.jpg', 'invisalign1.jpg', 'implants2.jpg'];
  for (const name of list) {
    const url = `https://smileartsny.com/wp-content/uploads/2021/08/${name}`;
    await new Promise(resolve => {
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if (res.statusCode === 200) {
          res.pipe(fs.createWriteStream(`smilearts_${name}`));
          res.on('end', () => {
            console.log(`Saved smilearts_${name}`);
            resolve();
          });
        } else {
          console.log(`Status for ${name}:`, res.statusCode);
          resolve();
        }
      }).on('error', e => {
        console.log(`Error ${name}:`, e.message);
        resolve();
      });
    });
  }
}

downloadSmileArts();
