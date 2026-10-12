const https = require('https');

https.get('https://smileartsny.com/before-and-after/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const urls = [...d.matchAll(/https:\/\/smileartsny\.com\/wp-content\/uploads\/[^\s"'<>]+\.(?:jpg|png|webp)/g)].map(m => m[0]);
    console.log(urls);
  });
});
