const https = require('https');

https.get('https://www.drwhitesmile.com/smile-gallery/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Extract captions or case names
    const matches = [...data.matchAll(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/g)].map(m => m[1]);
    console.log('Headings:', matches);
    const imgMatches = [...data.matchAll(/<img[^>]+src="([^">]+smile_gallery[^">]+)"[^>]*alt="([^">]*)"/g)].map(m => ({ src: m[1], alt: m[2] }));
    console.log('Images:', imgMatches.slice(0, 20));
  });
}).on('error', e => console.log('Err:', e.message));
