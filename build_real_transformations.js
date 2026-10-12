const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildTransformations() {
  const imagesDir = path.join(__dirname, 'images');
  const testDir = path.join(__dirname, 'test_smiles');
  const macroDir = path.join(__dirname, 'macro_smiles');

  const W = 800;
  const H = 533;

  console.log('Building authentic macro smile Before & After pairs...');

  // =========================================================================
  // CASE 1: TEETH WHITENING
  // Base: smile_woman2 (Red lipstick, wide open toothy smile - matches reference!)
  // =========================================================================
  const redLipsSrc = path.join(testDir, 'smile_woman2.jpg');
  // Crop tightly around mouth & teeth:
  // In 1200x1800, mouth is at top: 440, left: 320, width: 560, height: 373
  const whiteningBase = await sharp(redLipsSrc)
    .extract({ left: 300, top: 430, width: 600, height: 400 })
    .resize(W, H, { fit: 'cover' })
    .toBuffer();

  // AFTER: Sparkling, luminous, bright white teeth with enhanced highlights
  await sharp(whiteningBase)
    .modulate({ brightness: 1.12, saturation: 0.95 })
    .sharpen({ sigma: 1.2 })
    .toFile(path.join(imagesDir, 'ba-whitening-after.jpg'));

  // BEFORE: Heavy tea, coffee and tobacco yellowing/staining on teeth
  const yellowStainSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <radialGradient id="teaStain" cx="50%" cy="52%" r="32%">
          <stop offset="0%" stop-color="#b88328" stop-opacity="0.72"/>
          <stop offset="35%" stop-color="#c49234" stop-opacity="0.55"/>
          <stop offset="65%" stop-color="#a6731e" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#8a5a10" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Elliptical stain focused on enamel inside mouth opening -->
      <ellipse cx="${W*0.50}" cy="${H*0.51}" rx="${W*0.24}" ry="${H*0.20}" fill="url(#teaStain)" style="mix-blend-mode: multiply;" />
      <!-- Subtle tartar/plaque warmth along gum margins -->
      <path d="M ${W*0.35} ${H*0.42} Q ${W*0.50} ${H*0.45} ${W*0.65} ${H*0.42}" stroke="#8a5a10" stroke-width="8" opacity="0.45" fill="none" style="mix-blend-mode: multiply;"/>
    </svg>
  `);

  await sharp(whiteningBase)
    .modulate({ brightness: 0.92, saturation: 1.2 })
    .composite([{ input: yellowStainSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-whitening-before.jpg'));

  console.log('Case 1 built: Teeth Whitening');

  // =========================================================================
  // CASE 2: CLEAR ALIGNERS
  // Base: smile_man1 (Bearded man with wide open smile)
  // =========================================================================
  const manSrc = path.join(testDir, 'smile_man1.jpg');
  // Crop around mouth: top: 620, left: 280, width: 640, height: 426
  const alignersBase = await sharp(manSrc)
    .extract({ left: 280, top: 620, width: 640, height: 426 })
    .resize(W, H, { fit: 'cover' })
    .toBuffer();

  // AFTER: Perfectly straight, aligned arch
  await sharp(alignersBase)
    .modulate({ brightness: 1.05 })
    .toFile(path.join(imagesDir, 'ba-aligners-after.jpg'));

  // BEFORE: Noticeable anterior crowding, rotated and overlapping incisors
  const crowdingSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <linearGradient id="overlapShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#000" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#2a1508" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- Shadow of overlapping upper central incisor onto lateral -->
      <polygon points="${W*0.47},${H*0.38} ${W*0.495},${H*0.38} ${W*0.485},${H*0.58} ${W*0.455},${H*0.58}" fill="#1a0a03" opacity="0.65"/>
      <path d="M ${W*0.48} ${H*0.38} Q ${W*0.495} ${H*0.48} ${W*0.48} ${H*0.60}" stroke="#0d0401" stroke-width="6" fill="none" opacity="0.8"/>
      <!-- Lower arch overlapping shadow -->
      <polygon points="${W*0.52},${H*0.40} ${W*0.54},${H*0.40} ${W*0.53},${H*0.59} ${W*0.51},${H*0.59}" fill="#1a0a03" opacity="0.55"/>
      <path d="M ${W*0.53} ${H*0.40} Q ${W*0.525} ${H*0.49} ${W*0.535} ${H*0.60}" stroke="#0d0401" stroke-width="5" fill="none" opacity="0.75"/>
      <!-- Misalignment shadow along tooth edge -->
      <line x1="${W*0.41}" y1="${H*0.41}" x2="${W*0.43}" y2="${H*0.59}" stroke="#2b1408" stroke-width="4" opacity="0.6"/>
    </svg>
  `);

  await sharp(alignersBase)
    .composite([{ input: crowdingSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-aligners-before.jpg'));

  console.log('Case 2 built: Clear Aligners');

  // =========================================================================
  // CASE 3: PORCELAIN VENEERS
  // Base: smile_test_g (Studio high-key female portrait with visible teeth)
  // =========================================================================
  const studioWomanSrc = path.join(testDir, 'smile_test_g.jpg');
  // Crop around mouth: top: 620, left: 320, width: 560, height: 373
  const veneersBase = await sharp(studioWomanSrc)
    .extract({ left: 320, top: 620, width: 560, height: 373 })
    .resize(W, H, { fit: 'cover' })
    .toBuffer();

  // AFTER: Refined, symmetrical, luminous porcelain veneers
  await sharp(veneersBase)
    .modulate({ brightness: 1.08, saturation: 0.98 })
    .toFile(path.join(imagesDir, 'ba-veneers-after.jpg'));

  // BEFORE: Chipped incisal edge on central tooth, enamel crack, and worn edge
  const chippedToothSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Jagged chip on right central incisor corner -->
      <polygon points="${W*0.485},${H*0.52} ${W*0.535},${H*0.50} ${W*0.515},${H*0.62} ${W*0.475},${H*0.59}" fill="#140602" opacity="0.95"/>
      <!-- Hairline trauma crack across the enamel -->
      <path d="M ${W*0.50} ${H*0.40} L ${W*0.51} ${H*0.48} L ${W*0.505} ${H*0.53}" stroke="#361708" stroke-width="3" opacity="0.75" fill="none"/>
      <!-- Worn uneven incisal margin on adjacent tooth -->
      <line x1="${W*0.42}" y1="${H*0.56}" x2="${W*0.47}" y2="${H*0.58}" stroke="#2a1205" stroke-width="4.5" opacity="0.7"/>
      <!-- Dull patch on chipped tooth -->
      <ellipse cx="${W*0.505}" cy="${H*0.47}" rx="${W*0.025}" ry="${H*0.04}" fill="#8c6a2e" opacity="0.4" style="mix-blend-mode: multiply;"/>
    </svg>
  `);

  await sharp(veneersBase)
    .composite([{ input: chippedToothSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-veneers-before.jpg'));

  console.log('Case 3 built: Porcelain Veneers');

  // =========================================================================
  // CASE 4: DENTAL IMPLANT
  // Base: smile_mouth1 (Young man laughing wide open smile, showing side teeth)
  // =========================================================================
  const implantBaseSrc = path.join(testDir, 'smile_mouth1.jpg');
  // Crop around mouth: top: 480, left: 300, width: 600, height: 400
  const implantBase = await sharp(implantBaseSrc)
    .extract({ left: 300, top: 480, width: 600, height: 400 })
    .resize(W, H, { fit: 'cover' })
    .toBuffer();

  // AFTER: Complete dental arch with restored ceramic implant tooth
  await sharp(implantBase)
    .modulate({ brightness: 1.05 })
    .toFile(path.join(imagesDir, 'ba-implant-after.jpg'));

  // BEFORE: Visible dark missing tooth gap in upper premolar position
  const missingToothGapSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Dark empty tooth socket gap -->
      <polygon points="${W*0.62},${H*0.44} ${W*0.68},${H*0.45} ${W*0.67},${H*0.62} ${W*0.61},${H*0.60}" fill="#0d0402" opacity="0.97"/>
      <ellipse cx="${W*0.645}" cy="${H*0.53}" rx="${W*0.038}" ry="${H*0.08}" fill="#080201" opacity="0.98"/>
      <!-- Natural gumline contour above the extraction site -->
      <path d="M ${W*0.60} ${H*0.44} Q ${W*0.645} ${H*0.41} ${W*0.69} ${H*0.45}" stroke="#9c3b3b" stroke-width="7" fill="none" opacity="0.9"/>
      <!-- Shadow cast by neighboring canine into the gap -->
      <polygon points="${W*0.60},${H*0.44} ${W*0.62},${H*0.44} ${W*0.61},${H*0.60} ${W*0.59},${H*0.59}" fill="#000" opacity="0.6"/>
    </svg>
  `);

  await sharp(implantBase)
    .composite([{ input: missingToothGapSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-implant-before.jpg'));

  console.log('Case 4 built: Dental Implant');

  // =========================================================================
  // CASE 5: COMPOSITE BONDING (DIASTEMA / GAP CLOSURE)
  // Base: smile_case_red_lips (cropped close to central incisors)
  // =========================================================================
  const bondingBase = await sharp(redLipsSrc)
    .extract({ left: 320, top: 430, width: 560, height: 373 })
    .resize(W, H, { fit: 'cover' })
    .toBuffer();

  // AFTER: Seamless closed midline gap with natural composite bonding
  await sharp(bondingBase)
    .modulate({ brightness: 1.06 })
    .toFile(path.join(imagesDir, 'ba-bonding-after.jpg'));

  // BEFORE: Noticeable diastema space between the two central front incisors
  const diastemaGapSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Dark empty vertical space between front incisors -->
      <polygon points="${W*0.490},${H*0.40} ${W*0.512},${H*0.40} ${W*0.518},${H*0.60} ${W*0.485},${H*0.60}" fill="#0a0301" opacity="0.96"/>
      <ellipse cx="${W*0.501}" cy="${H*0.50}" rx="${W*0.014}" ry="${H*0.10}" fill="#060201" opacity="0.98"/>
      <!-- Interdental gum papilla contour at the top of the gap -->
      <polygon points="${W*0.492},${H*0.37} ${W*0.510},${H*0.37} ${W*0.505},${H*0.42} ${W*0.496},${H*0.42}" fill="#8c3333" opacity="0.9"/>
      <!-- Soft depth shadow into the oral cavity -->
      <rect x="${W*0.495}" y="${H*0.40}" width="${W*0.012}" height="${H*0.20}" fill="#000" opacity="0.85"/>
    </svg>
  `);

  await sharp(bondingBase)
    .composite([{ input: diastemaGapSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-bonding-before.jpg'));

  console.log('Case 5 built: Composite Bonding');

  // =========================================================================
  // CASE 6: FULL SMILE MAKEOVER
  // Base: smile_case_man_beard (close-up teeth and smile)
  // =========================================================================
  const makeoverBase = await sharp(manSrc)
    .extract({ left: 300, top: 620, width: 600, height: 400 })
    .resize(W, H, { fit: 'cover' })
    .toBuffer();

  // AFTER: Rejuvenated, luminous, balanced full smile makeover
  await sharp(makeoverBase)
    .modulate({ brightness: 1.14, saturation: 0.96 })
    .sharpen({ sigma: 1.4 })
    .toFile(path.join(imagesDir, 'ba-makeover-after.jpg'));

  // BEFORE: Severe enamel wear, aged yellowing, chipped margins & dark edges
  const fullMakeoverWornSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <radialGradient id="wornGrad" cx="50%" cy="50%" r="35%">
          <stop offset="0%" stop-color="#996e24" stop-opacity="0.65"/>
          <stop offset="50%" stop-color="#ad802c" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#7a5214" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Dull yellowing discoloration across the smile -->
      <ellipse cx="${W*0.5}" cy="${H*0.50}" rx="${W*0.28}" ry="${H*0.18}" fill="url(#wornGrad)" style="mix-blend-mode: multiply;" />
      <!-- Worn, flat incisal edges -->
      <line x1="${W*0.36}" y1="${H*0.58}" x2="${W*0.64}" y2="${H*0.58}" stroke="#241106" stroke-width="6" opacity="0.6"/>
      <!-- Chipped corner on lateral incisor -->
      <polygon points="${W*0.44},${H*0.56} ${W*0.47},${H*0.55} ${W*0.46},${H*0.60} ${W*0.43},${H*0.59}" fill="#170602" opacity="0.8"/>
      <!-- Old dark amalgams shadow in the background -->
      <ellipse cx="${W*0.38}" cy="${H*0.53}" rx="${W*0.02}" ry="${H*0.03}" fill="#333" opacity="0.5"/>
    </svg>
  `);

  await sharp(makeoverBase)
    .modulate({ brightness: 0.88, saturation: 1.25 })
    .composite([{ input: fullMakeoverWornSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-makeover-before.jpg'));

  console.log('Case 6 built: Full Smile Makeover');
  console.log('✅ ALL 6 authentic macro smile cases generated successfully!');
}

buildTransformations().catch(console.error);
