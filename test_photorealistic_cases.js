const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildPhotorealistic() {
  const testDir = path.join(__dirname, 'test_smiles');
  const imagesDir = path.join(__dirname, 'images');
  const W = 800;
  const H = 533;

  // =========================================================================
  // 1. TEETH WHITENING
  // Base: smile_woman2.jpg (Red lips, wide smile)
  // =========================================================================
  const whiteBase = await sharp(path.join(testDir, 'smile_woman2.jpg'))
    .extract({ left: 350, top: 580, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  // After: Luminous bright pearl white
  await sharp(whiteBase)
    .modulate({ brightness: 1.15, saturation: 0.95 })
    .sharpen({ sigma: 1.2 })
    .toFile(path.join(imagesDir, 'ba-whitening-after.jpg'));

  // Before: Realistic deep coffee/tea stains with soft feathered gaussian blur
  const whiteningBeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <radialGradient id="teaStain" cx="50%" cy="43%" r="30%">
          <stop offset="0%" stop-color="#b07d24" stop-opacity="0.85"/>
          <stop offset="50%" stop-color="#c29035" stop-opacity="0.65"/>
          <stop offset="80%" stop-color="#8c5d12" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#8c5d12" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Smooth blurred stain across tooth arch -->
      <ellipse cx="400" cy="230" rx="140" ry="45" fill="url(#teaStain)" filter="url(#softBlur)" style="mix-blend-mode: multiply;" />
      <!-- Subtle cervical margin staining -->
      <ellipse cx="400" cy="210" rx="120" ry="20" fill="#7a4c0a" opacity="0.45" filter="url(#softBlur)" style="mix-blend-mode: multiply;" />
    </svg>
  `);

  await sharp(whiteBase)
    .modulate({ brightness: 0.88, saturation: 1.30 })
    .composite([{ input: whiteningBeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-whitening-before.jpg'));

  console.log('✅ Case 1: Whitening photorealistic');

  // =========================================================================
  // 2. CLEAR ALIGNERS
  // Base: smile_man1.jpg (Bearded man)
  // =========================================================================
  const alignBase = await sharp(path.join(testDir, 'smile_man1.jpg'))
    .extract({ left: 350, top: 720, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  await sharp(alignBase)
    .modulate({ brightness: 1.05 })
    .toFile(path.join(imagesDir, 'ba-aligners-after.jpg'));

  const alignBeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <filter id="shadowBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <!-- Overlapping incisor natural shadow -->
      <path d="M 382 242 Q 388 262 380 286" stroke="#0e0401" stroke-width="4.5" fill="none" opacity="0.80" filter="url(#shadowBlur)"/>
      <polygon points="380,242 388,242 382,286 376,286" fill="#120501" opacity="0.60" filter="url(#shadowBlur)"/>
      <!-- Lateral incisor rotation shadow -->
      <path d="M 425 244 Q 423 264 428 286" stroke="#0e0401" stroke-width="4.5" fill="none" opacity="0.75" filter="url(#shadowBlur)"/>
      <polygon points="423,244 430,244 427,286 420,286" fill="#120501" opacity="0.55" filter="url(#shadowBlur)"/>
      <!-- Soft interproximal depth gradient -->
      <ellipse cx="380" cy="265" rx="6" ry="20" fill="#000" opacity="0.4" filter="url(#shadowBlur)"/>
      <ellipse cx="425" cy="265" rx="6" ry="20" fill="#000" opacity="0.35" filter="url(#shadowBlur)"/>
    </svg>
  `);

  await sharp(alignBase)
    .composite([{ input: alignBeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-aligners-before.jpg'));

  console.log('✅ Case 2: Aligners photorealistic');

  // =========================================================================
  // 3. PORCELAIN VENEERS
  // Base: smile_test_g.jpg (Studio woman, teeth at cx: 400, cy: 335)
  // =========================================================================
  const veneerBase = await sharp(path.join(testDir, 'smile_test_g.jpg'))
    .extract({ left: 350, top: 750, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  await sharp(veneerBase)
    .modulate({ brightness: 1.08, saturation: 0.98 })
    .toFile(path.join(imagesDir, 'ba-veneers-after.jpg'));

  const veneerBeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <filter id="chipBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <filter id="softStain" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <!-- Natural chipped incisor corner on central incisor -->
      <polygon points="418,348 445,346 438,366 414,364" fill="#0a0301" opacity="0.94" filter="url(#chipBlur)"/>
      <!-- Hairline fracture line -->
      <path d="M 428 325 Q 432 338 428 348" stroke="#2b1104" stroke-width="2" opacity="0.8" fill="none" filter="url(#chipBlur)"/>
      <!-- Worn uneven edge on neighboring tooth -->
      <line x1="365" y1="358" x2="395" y2="362" stroke="#1f0a02" stroke-width="3" opacity="0.65" filter="url(#chipBlur)"/>
      <!-- Uneven dull tone on damaged tooth -->
      <ellipse cx="430" cy="336" rx="16" ry="18" fill="#8c6a2e" opacity="0.45" filter="url(#softStain)" style="mix-blend-mode: multiply;"/>
    </svg>
  `);

  await sharp(veneerBase)
    .composite([{ input: veneerBeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-veneers-before.jpg'));

  console.log('✅ Case 3: Veneers photorealistic');

  // =========================================================================
  // 4. DENTAL IMPLANT
  // Base: smile_mouth1.jpg (Young man laughing, teeth at cx: 400, cy: 220)
  // =========================================================================
  const implantBase = await sharp(path.join(testDir, 'smile_mouth1.jpg'))
    .extract({ left: 350, top: 520, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  await sharp(implantBase)
    .modulate({ brightness: 1.05 })
    .toFile(path.join(imagesDir, 'ba-implant-after.jpg'));

  const implantBeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <filter id="gapBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <radialGradient id="socketDark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#020000" stop-opacity="1"/>
          <stop offset="70%" stop-color="#080201" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#140603" stop-opacity="0.85"/>
        </radialGradient>
      </defs>
      <!-- Dark tooth socket gap -->
      <ellipse cx="535" cy="255" rx="22" ry="30" fill="url(#socketDark)" filter="url(#gapBlur)"/>
      <!-- Natural curved gum contour above missing tooth -->
      <path d="M 508 226 Q 535 215 562 230" stroke="#7a2626" stroke-width="6" fill="none" opacity="0.92" filter="url(#gapBlur)"/>
      <!-- Shadow cast from adjacent tooth -->
      <ellipse cx="512" cy="254" rx="8" ry="24" fill="#000" opacity="0.75" filter="url(#gapBlur)"/>
    </svg>
  `);

  await sharp(implantBase)
    .composite([{ input: implantBeforeSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-implant-before.jpg'));

  console.log('✅ Case 4: Implant photorealistic');

  // =========================================================================
  // 5. COMPOSITE BONDING (DIASTEMA CLOSURE)
  // Base: smile_test_g.jpg (Studio woman, teeth at cx: 400, cy: 335)
  // =========================================================================
  const bondingBase = await sharp(path.join(testDir, 'smile_test_g.jpg'))
    .extract({ left: 350, top: 750, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  await sharp(bondingBase)
    .modulate({ brightness: 1.05 })
    .toFile(path.join(imagesDir, 'ba-bonding-after.jpg'));

  const bondingBeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <filter id="diastemaBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <linearGradient id="gapDepth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#140502" stop-opacity="0.7"/>
          <stop offset="50%" stop-color="#020100" stop-opacity="0.98"/>
          <stop offset="100%" stop-color="#140502" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <!-- Diastema space between central incisors -->
      <polygon points="395,324 411,324 414,366 392,366" fill="url(#gapDepth)" filter="url(#diastemaBlur)"/>
      <ellipse cx="403" cy="345" rx="7" ry="20" fill="#000" filter="url(#diastemaBlur)"/>
      <!-- Soft gum papilla at top -->
      <polygon points="396,320 410,320 405,328 399,328" fill="#7a2a2a" opacity="0.9" filter="url(#diastemaBlur)"/>
    </svg>
  `);

  await sharp(bondingBase)
    .composite([{ input: bondingBeforeSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-bonding-before.jpg'));

  console.log('✅ Case 5: Bonding photorealistic');

  // =========================================================================
  // 6. FULL SMILE MAKEOVER
  // Base: smile_man1.jpg (Bearded man)
  // =========================================================================
  const makeoverBase = await sharp(path.join(testDir, 'smile_man1.jpg'))
    .extract({ left: 350, top: 720, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  await sharp(makeoverBase)
    .modulate({ brightness: 1.15, saturation: 0.95 })
    .sharpen({ sigma: 1.4 })
    .toFile(path.join(imagesDir, 'ba-makeover-after.jpg'));

  const makeoverBeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <filter id="makeoverBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="edgeBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <radialGradient id="ageStain" cx="50%" cy="50%" r="35%">
          <stop offset="0%" stop-color="#996c1e" stop-opacity="0.75"/>
          <stop offset="60%" stop-color="#ad802c" stop-opacity="0.50"/>
          <stop offset="100%" stop-color="#734e12" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Diffuse aging discoloration on enamel -->
      <ellipse cx="400" cy="260" rx="140" ry="38" fill="url(#ageStain)" filter="url(#makeoverBlur)" style="mix-blend-mode: multiply;" />
      <!-- Worn, flat incisal edge line -->
      <line x1="315" y1="284" x2="485" y2="284" stroke="#1c0c04" stroke-width="4.5" opacity="0.65" filter="url(#edgeBlur)"/>
      <!-- Small chip on lateral incisor -->
      <polygon points="352,278 366,276 361,288 347,287" fill="#120401" opacity="0.80" filter="url(#edgeBlur)"/>
    </svg>
  `);

  await sharp(makeoverBase)
    .modulate({ brightness: 0.88, saturation: 1.25 })
    .composite([{ input: makeoverBeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-makeover-before.jpg'));

  console.log('✅ Case 6: Makeover photorealistic');
}

buildPhotorealistic().catch(console.error);
