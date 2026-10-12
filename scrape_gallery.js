const http = require('http');
const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const html = await fetch('http://ambiancedental.ca/smile-gallery/');
    const urls = [...html.matchAll(/https?:\/\/[^\s"'<>]+(?:\.webp|\.jpg|\.png)/g)].map(m => m[0]);
    const filtered = [...new Set(urls.filter(u => u.includes('BeforeAfter') || u.includes('gallery') || u.includes('uploads')))];
    console.log('Found ambiance URLs:', filtered);
  } catch (e) {
    console.log('Error:', e.message);
  }
}

run();
