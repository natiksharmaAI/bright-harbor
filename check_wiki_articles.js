const https = require('https');

const titles = [
  'Tooth_whitening',
  'Diastema_(dentistry)',
  'Veneer_(dentistry)',
  'Dental_implant',
  'Orthodontics',
  'Dental_composite',
  'Dental_restoration'
].join('|');

const url = `https://en.wikipedia.org/w/api.php?action=query&prop=images&titles=${titles}&format=json`;

https.get(url, { headers: { 'User-Agent': 'BrightHarborDental/1.0' } }, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      for (const page of Object.values(json.query.pages)) {
        console.log('=== Page:', page.title, '===');
        if (page.images) {
          page.images.forEach(img => console.log('  ', img.title));
        }
      }
    } catch(e) { console.error(e); }
  });
});
