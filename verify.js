const fs = require('fs');
const path = require('path');
const http = require('http');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const regex = /src=["']([^"']+)["']/g;
let match;
let missing = [];
let total = 0;

while ((match = regex.exec(html)) !== null) {
  const src = match[1];
  if (!src.startsWith('http') && !src.startsWith('data:')) {
    total++;
    const full = path.join(__dirname, src);
    if (!fs.existsSync(full)) {
      missing.push(src);
    }
  }
}

console.log(`Total local images in HTML: ${total}`);
if (missing.length === 0) {
  console.log('✅ ALL images exist on disk!');
} else {
  console.error('❌ Missing images:', missing);
}

// Test HTTP server
const testUrls = ['/', '/styles.css', '/script.js', '/images/hero-clinic.jpg'];
let pending = testUrls.length;

testUrls.forEach(url => {
  http.get(`http://localhost:3000${url}`, res => {
    console.log(`HTTP GET ${url}: ${res.statusCode} (${res.headers['content-type']})`);
    pending--;
    if (pending === 0) process.exit(0);
  }).on('error', err => {
    console.error(`HTTP GET ${url} error:`, err.message);
    pending--;
    if (pending === 0) process.exit(1);
  });
});
