const https = require('https');
const fs = require('fs');

async function downloadCases() {
  const cases = [25, 26, 27, 28, 29, 30, 31, 32, 34, 35];
  for (const c of cases) {
    const url = `https://waltondental.com/wp-content/uploads/2026/01/Case${c}-1.jpg`;
    await new Promise(resolve => {
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if (res.statusCode === 200) {
          res.pipe(fs.createWriteStream(`walton_case_${c}.jpg`));
          res.on('end', () => {
            console.log(`Saved walton_case_${c}.jpg`);
            resolve();
          });
        } else {
          console.log(`Status for ${c}:`, res.statusCode);
          resolve();
        }
      }).on('error', e => {
        console.log(`Error ${c}:`, e.message);
        resolve();
      });
    });
  }
}

downloadCases();
