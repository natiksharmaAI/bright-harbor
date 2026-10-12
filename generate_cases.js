const fs = require('fs');
const https = require('https');
const path = require('path');
const sharp = require('sharp');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error('HTTP status ' + response.statusCode));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function prepareCases() {
  const imagesDir = path.join(__dirname, 'images');
  const tempDir = path.join(__dirname, 'temp_cases');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  // Curated high quality dental macro smile photography URLs
  const smileSources = {
    'smile_macro_1.jpg': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=90',
    'smile_macro_2.jpg': 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=90',
    'smile_macro_3.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=90',
    'smile_macro_4.jpg': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=90'
  };

  for (const [filename, url] of Object.entries(smileSources)) {
    const dest = path.join(tempDir, filename);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading ${filename}...`);
      await download(url, dest);
    }
  }

  console.log('Generating Before & After pairs with sharp...');

  // Standard dimensions for all before-after cases: 800 x 533 (3:2 ratio)
  const W = 800;
  const H = 533;

  // Case 1: Teeth Whitening
  // Base: smile_macro_1.jpg (close smile)
  const base1 = await sharp(path.join(tempDir, 'smile_macro_1.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // After: luminous, clean white pearl smile
  const after1 = await sharp(base1)
    .modulate({ brightness: 1.08, saturation: 0.95 })
    .toFile(path.join(imagesDir, 'ba-whitening-after.jpg'));

  // Before: noticeably stained / yellowed coffee warm tone teeth
  // We composite a warmer yellowish overlay with soft radial gradient over teeth
  const yellowSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <radialGradient id="stain" cx="50%" cy="50%" r="35%">
          <stop offset="0%" stop-color="#d4a34b" stop-opacity="0.55"/>
          <stop offset="40%" stop-color="#c8923a" stop-opacity="0.35"/>
          <stop offset="70%" stop-color="#b88628" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#b88628" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="${W/2}" cy="${H/2 + 10}" rx="${W*0.28}" ry="${H*0.22}" fill="url(#stain)" style="mix-blend-mode: multiply;" />
    </svg>
  `);

  await sharp(base1)
    .modulate({ brightness: 0.94, saturation: 1.15 })
    .composite([{ input: yellowSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-whitening-before.jpg'));

  console.log('Case 1 generated: Whitening');

  // Case 2: Clear Aligners
  // Base: smile_macro_2.jpg
  const base2 = await sharp(path.join(tempDir, 'smile_macro_2.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // After: straight, aligned teeth
  await sharp(base2)
    .modulate({ brightness: 1.05, saturation: 1.02 })
    .toFile(path.join(imagesDir, 'ba-aligners-after.jpg'));

  // Before: slight crowding simulation overlay
  const crowdingSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <linearGradient id="overlap1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#111" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="#222" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="overlap2" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stop-color="#111" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- Shadow between overlapping incisors -->
      <path d="M ${W*0.48} ${H*0.42} Q ${W*0.49} ${H*0.58} ${W*0.47} ${H*0.68}" stroke="#2a1508" stroke-width="5" fill="none" opacity="0.75" />
      <path d="M ${W*0.54} ${H*0.44} Q ${W*0.53} ${H*0.56} ${W*0.55} ${H*0.66}" stroke="#2a1508" stroke-width="4.5" fill="none" opacity="0.65" />
      <polygon points="${W*0.46},${H*0.45} ${W*0.485},${H*0.45} ${W*0.48},${H*0.65} ${W*0.455},${H*0.64}" fill="#0e0704" opacity="0.45"/>
    </svg>
  `);

  await sharp(base2)
    .composite([{ input: crowdingSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-aligners-before.jpg'));

  console.log('Case 2 generated: Clear Aligners');

  // Case 3: Veneers (Chipped / uneven to refined symmetrical)
  // Base: smile_macro_4.jpg
  const base3 = await sharp(path.join(tempDir, 'smile_macro_4.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // After: refined, pristine porcelain veneers with uniform luminescence
  await sharp(base3)
    .modulate({ brightness: 1.06, saturation: 0.98 })
    .toFile(path.join(imagesDir, 'ba-veneers-after.jpg'));

  // Before: chipped incisor corner & slight uneven edge
  const chippedSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Jagged chip cutout on incisor edge -->
      <polygon points="${W*0.46},${H*0.58} ${W*0.505},${H*0.56} ${W*0.49},${H*0.63} ${W*0.45},${H*0.61}" fill="#1a0d05" opacity="0.9" />
      <!-- hairline crack/wear line -->
      <path d="M ${W*0.48} ${H*0.45} L ${W*0.49} ${H*0.57}" stroke="#3d2010" stroke-width="2.5" opacity="0.7" />
      <!-- mild discoloration patch -->
      <ellipse cx="${W*0.48}" cy="${H*0.52}" rx="${W*0.04}" ry="${H*0.05}" fill="#a37e3d" opacity="0.35" style="mix-blend-mode: multiply;" />
    </svg>
  `);

  await sharp(base3)
    .composite([{ input: chippedSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-veneers-before.jpg'));

  console.log('Case 3 generated: Veneers');

  // Case 4: Dental Implant (visible premolar gap to restored crown)
  // Base: smile_macro_3.jpg
  const base4 = await sharp(path.join(tempDir, 'smile_macro_3.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // After: complete arch with seamless porcelain implant crown
  await sharp(base4)
    .modulate({ brightness: 1.04, saturation: 1.0 })
    .toFile(path.join(imagesDir, 'ba-implant-after.jpg'));

  // Before: dark missing gap in the premolar zone
  const gapSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <ellipse cx="${W*0.62}" cy="${H*0.54}" rx="${W*0.038}" ry="${H*0.07}" fill="#120603" opacity="0.96"/>
      <path d="M ${W*0.585} ${H*0.48} Q ${W*0.62} ${H*0.47} ${W*0.655} ${H*0.49}" stroke="#a84343" stroke-width="6" fill="none" opacity="0.8"/>
    </svg>
  `);

  await sharp(base4)
    .composite([{ input: gapSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-implant-before.jpg'));

  console.log('Case 4 generated: Dental Implant');

  // Case 5: Bonding (Midline Diastema Gap to Closed)
  // Base: smile_macro_1.jpg
  const base5 = await sharp(path.join(tempDir, 'smile_macro_1.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // After: closed diastema with natural aesthetic bonding
  await sharp(base5)
    .modulate({ brightness: 1.02 })
    .toFile(path.join(imagesDir, 'ba-bonding-after.jpg'));

  // Before: noticeable midline space (diastema gap)
  const diastemaSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <polygon points="${W*0.494},${H*0.42} ${W*0.508},${H*0.42} ${W*0.514},${H*0.60} ${W*0.488},${H*0.60}" fill="#0d0402" opacity="0.94"/>
      <!-- Soft gum papilla shadow above gap -->
      <polygon points="${W*0.495},${H*0.40} ${W*0.507},${H*0.40} ${W*0.504},${H*0.44} ${W*0.498},${H*0.44}" fill="#7a2a28" opacity="0.85"/>
    </svg>
  `);

  await sharp(base5)
    .composite([{ input: diastemaSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-bonding-before.jpg'));

  console.log('Case 5 generated: Bonding');

  // Case 6: Full Smile Makeover (worn down & discolored to radiant balanced smile)
  // Base: smile_macro_4.jpg
  const base6 = await sharp(path.join(tempDir, 'smile_macro_4.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // After: full smile makeover, radiant white, harmonic contours
  await sharp(base6)
    .modulate({ brightness: 1.1, saturation: 0.96 })
    .toFile(path.join(imagesDir, 'ba-makeover-after.jpg'));

  // Before: worn incisal edges, yellowing and uneven dark edges
  const wornSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Warm discoloration filter -->
      <ellipse cx="${W*0.5}" cy="${H*0.52}" rx="${W*0.3}" ry="${H*0.2}" fill="#b8832a" opacity="0.4" style="mix-blend-mode: multiply;" />
      <!-- Worn incisal edge shadow -->
      <line x1="${W*0.42}" y1="${H*0.60}" x2="${W*0.58}" y2="${H*0.60}" stroke="#221108" stroke-width="6" opacity="0.5"/>
    </svg>
  `);

  await sharp(base6)
    .modulate({ brightness: 0.92, saturation: 1.1 })
    .composite([{ input: wornSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-makeover-before.jpg'));

  console.log('Case 6 generated: Full Smile Makeover');
  console.log('All 6 Before & After cases successfully created!');
}

prepareCases().catch(err => {
  console.error(err);
  process.exit(1);
});
