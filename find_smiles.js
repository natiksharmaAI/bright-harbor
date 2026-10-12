const https = require('https');
const fs = require('fs');

function fetchPage(query) {
  return new Promise((resolve) => {
    https.get(`https://unsplash.com/s/photos/${query}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        const matches = [...data.matchAll(/https:\/\/images\.unsplash\.com\/(photo-[a-zA-Z0-9_-]+)\?[^"'\s>]+/g)];
        const ids = [...new Set(matches.map(m => m[1]))];
        resolve(ids);
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const queries = ['teeth-smile', 'close-up-smile', 'dental-teeth', 'white-teeth'];
  const allIds = new Set();
  for (const q of queries) {
    const ids = await fetchPage(q);
    console.log(`Query ${q}: found ${ids.length} images`);
    ids.forEach(id => allIds.add(id));
  }
  fs.writeFileSync('candidate_photos.json', JSON.stringify([...allIds], null, 2));
  console.log(`Total unique IDs: ${allIds.size}`);
}

run();
