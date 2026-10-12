const https = require('https');

function test(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 200) {
        console.log('FOUND:', url, res.headers['content-length']);
      }
      resolve();
    }).on('error', () => resolve());
  });
}

async function probe() {
  const prefixes = [
    'https://smileartsny.com/wp-content/uploads/2021/08/',
    'https://smileartsny.com/wp-content/uploads/2021/07/',
    'https://smileartsny.com/wp-content/uploads/2021/09/'
  ];
  const names = [
    'implants1-scaled.jpg', 'implants1.jpg', 'implants2.jpg', 'implants3.jpg',
    'bonding1.jpg', 'bonding2.jpg', 'bonding-scaled.jpg', 'bonding1-scaled.jpg',
    'veneers1.jpg', 'veneers2.jpg', 'veneers1-scaled.jpg', 'veneers-scaled.jpg',
    'whitening1.jpg', 'whitening2.jpg', 'whitening-scaled.jpg',
    'invisalign1.jpg', 'invisalign2.jpg', 'invisalign-scaled.jpg'
  ];

  for (const p of prefixes) {
    for (const n of names) {
      await test(p + n);
    }
  }
  console.log('Done probing');
}

probe();
