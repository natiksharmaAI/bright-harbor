const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateCases() {
  const testDir = path.join(__dirname, 'test_smiles');
  const imagesDir = path.join(__dirname, 'images');

  const W = 800;
  const H = 533;

  console.log('Generating pixel-perfect macro smile transformations...');

  // =========================================================================
  // CASE 1: TEETH WHITENING (Red lips, big smile)
  // Base: smile_woman2.jpg
  // =========================================================================
  const case1Base = await sharp(path.join(testDir, 'smile_woman2.jpg'))
    .extract({ left: 350, top: 580, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  // After: Luminous, sparkling, pearl-white teeth
  await sharp(case1Base)
    .modulate({ brightness: 1.15, saturation: 0.95 })
    .sharpen({ sigma: 1.2 })
    .toFile(path.join(imagesDir, 'ba-whitening-after.jpg'));

  // Before: Realistic deep tea/coffee yellowing on the teeth (teeth located around cx: 400, cy: 230)
  const case1BeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <radialGradient id="whiteningStain" cx="50%" cy="43%" r="28%">
          <stop offset="0%" stop-color="#b5832a" stop-opacity="0.80"/>
          <stop offset="45%" stop-color="#bf8f34" stop-opacity="0.60"/>
          <stop offset="75%" stop-color="#9e6d18" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#80530b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Target teeth area inside the mouth opening -->
      <ellipse cx="400" cy="225" rx="145" ry="48" fill="url(#whiteningStain)" style="mix-blend-mode: multiply;" />
      <!-- Darker enamel tartar warmth along cervical gumline -->
      <path d="M 270 205 Q 400 215 530 205" stroke="#7a4f0d" stroke-width="6" opacity="0.5" fill="none" style="mix-blend-mode: multiply;"/>
    </svg>
  `);

  await sharp(case1Base)
    .modulate({ brightness: 0.90, saturation: 1.25 })
    .composite([{ input: case1BeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-whitening-before.jpg'));

  console.log('✅ Case 1: Teeth Whitening ready');

  // =========================================================================
  // CASE 2: CLEAR ALIGNERS (Bearded man, teeth at cx: 400, cy: 260)
  // Base: smile_man1.jpg
  // =========================================================================
  const case2Base = await sharp(path.join(testDir, 'smile_man1.jpg'))
    .extract({ left: 350, top: 720, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  // After: Straight, harmonious, perfectly aligned arch
  await sharp(case2Base)
    .modulate({ brightness: 1.05 })
    .toFile(path.join(imagesDir, 'ba-aligners-after.jpg'));

  // Before: Crowded overlapping front incisors with shadow depth
  const case2BeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Overlapping central incisor shadow -->
      <polygon points="380,240 395,240 388,285 370,285" fill="#170802" opacity="0.65"/>
      <path d="M 382 238 Q 388 260 378 288" stroke="#0d0401" stroke-width="5" fill="none" opacity="0.85"/>
      <!-- Lateral incisor rotation shadow on opposite side -->
      <polygon points="425,242 438,242 432,286 418,286" fill="#170802" opacity="0.55"/>
      <path d="M 427 240 Q 425 262 430 288" stroke="#0d0401" stroke-width="4.5" fill="none" opacity="0.80"/>
      <!-- Lower tooth tilt shadow -->
      <line x1="340" y1="245" x2="355" y2="285" stroke="#261005" stroke-width="4" opacity="0.5"/>
    </svg>
  `);

  await sharp(case2Base)
    .composite([{ input: case2BeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-aligners-before.jpg'));

  console.log('✅ Case 2: Clear Aligners ready');

  // =========================================================================
  // CASE 3: PORCELAIN VENEERS (Studio woman, teeth at cx: 400, cy: 330)
  // Base: smile_test_g.jpg
  // =========================================================================
  const case3Base = await sharp(path.join(testDir, 'smile_test_g.jpg'))
    .extract({ left: 350, top: 750, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  // After: Flawless porcelain veneers with natural translucency
  await sharp(case3Base)
    .modulate({ brightness: 1.08, saturation: 0.98 })
    .toFile(path.join(imagesDir, 'ba-veneers-after.jpg'));

  // Before: Chipped incisor corner, trauma fracture line & uneven edge
  const case3BeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Chipped incisal corner on right central incisor -->
      <polygon points="418,348 448,345 438,368 412,364" fill="#120502" opacity="0.95"/>
      <!-- Hairline trauma crack across enamel -->
      <path d="M 428 322 L 434 338 L 430 350" stroke="#361506" stroke-width="2.5" opacity="0.8" fill="none"/>
      <!-- Adjacent incisor wear and uneven margin -->
      <line x1="365" y1="358" x2="395" y2="362" stroke="#240e04" stroke-width="4" opacity="0.65"/>
      <!-- Old resin discoloration patch -->
      <ellipse cx="430" cy="336" rx="14" ry="18" fill="#8c6a2e" opacity="0.38" style="mix-blend-mode: multiply;"/>
    </svg>
  `);

  await sharp(case3Base)
    .composite([{ input: case3BeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-veneers-before.jpg'));

  console.log('✅ Case 3: Porcelain Veneers ready');

  // =========================================================================
  // CASE 4: DENTAL IMPLANT (Young man laughing, teeth at cx: 400, cy: 220)
  // Base: smile_mouth1.jpg
  // =========================================================================
  const case4Base = await sharp(path.join(testDir, 'smile_mouth1.jpg'))
    .extract({ left: 350, top: 520, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  // After: Restored premolar with seamless zirconia crown
  await sharp(case4Base)
    .modulate({ brightness: 1.05 })
    .toFile(path.join(imagesDir, 'ba-implant-after.jpg'));

  // Before: Visible missing premolar gap in upper arch (x: 520 to 570, y: 220 to 280)
  const case4BeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Dark tooth socket gap -->
      <polygon points="515,225 565,230 555,285 505,278" fill="#080201" opacity="0.98"/>
      <ellipse cx="535" cy="255" rx="24" ry="32" fill="#050100" opacity="0.99"/>
      <!-- Pink gum ridge contour above missing tooth -->
      <path d="M 505 224 Q 535 212 565 228" stroke="#8a2e2e" stroke-width="7" fill="none" opacity="0.9"/>
      <!-- Soft interdental shadow from neighboring tooth -->
      <polygon points="505,224 518,224 512,280 500,278" fill="#000" opacity="0.75"/>
    </svg>
  `);

  await sharp(case4Base)
    .composite([{ input: case4BeforeSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-implant-before.jpg'));

  console.log('✅ Case 4: Dental Implant ready');

  // =========================================================================
  // CASE 5: COMPOSITE BONDING (DIASTEMA GAP CLOSURE)
  // Base: smile_test_g.jpg (Studio woman, central incisors midline at x: 400, y: 335)
  // =========================================================================
  const case5Base = await sharp(path.join(testDir, 'smile_test_g.jpg'))
    .extract({ left: 350, top: 750, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  // After: Gap closed evenly with smooth composite bonding
  await sharp(case5Base)
    .modulate({ brightness: 1.04 })
    .toFile(path.join(imagesDir, 'ba-bonding-after.jpg'));

  // Before: Noticeable midline diastema (gap between two front central teeth)
  const case5BeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <!-- Dark empty diastema space -->
      <polygon points="393,322 411,322 415,368 389,368" fill="#0a0301" opacity="0.97"/>
      <ellipse cx="402" cy="345" rx="8" ry="24" fill="#050100" opacity="0.98"/>
      <!-- Gum papilla triangle at top of gap -->
      <polygon points="395,318 409,318 405,328 398,328" fill="#8c3333" opacity="0.92"/>
      <!-- Soft depth shadow into mouth cavity -->
      <rect x="398" y="325" width="8" height="42" fill="#000" opacity="0.88"/>
    </svg>
  `);

  await sharp(case5Base)
    .composite([{ input: case5BeforeSvg, blend: 'over' }])
    .toFile(path.join(imagesDir, 'ba-bonding-before.jpg'));

  console.log('✅ Case 5: Composite Bonding ready');

  // =========================================================================
  // CASE 6: FULL SMILE MAKEOVER (Rejuvenated full smile)
  // Base: smile_man1.jpg
  // =========================================================================
  const case6Base = await sharp(path.join(testDir, 'smile_man1.jpg'))
    .extract({ left: 350, top: 720, width: 500, height: 333 })
    .resize(W, H)
    .toBuffer();

  // After: Radiant, harmonious, bright rejuvenated full smile
  await sharp(case6Base)
    .modulate({ brightness: 1.16, saturation: 0.95 })
    .sharpen({ sigma: 1.5 })
    .toFile(path.join(imagesDir, 'ba-makeover-after.jpg'));

  // Before: Worn flat incisal edges, heavy aging yellowing & chips
  const case6BeforeSvg = Buffer.from(`
    <svg width="${W}" height="${H}">
      <defs>
        <radialGradient id="makeoverAge" cx="50%" cy="50%" r="35%">
          <stop offset="0%" stop-color="#9e7323" stop-opacity="0.75"/>
          <stop offset="50%" stop-color="#ad802c" stop-opacity="0.50"/>
          <stop offset="100%" stop-color="#7a5214" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Dull yellowing discoloration across enamel -->
      <ellipse cx="400" cy="260" rx="145" ry="42" fill="url(#makeoverAge)" style="mix-blend-mode: multiply;" />
      <!-- Worn, flat, abraded incisal edge line -->
      <line x1="310" y1="284" x2="490" y2="284" stroke="#210f05" stroke-width="5.5" opacity="0.65"/>
      <!-- Chipped tooth corner on lateral -->
      <polygon points="350,278 368,276 362,290 345,288" fill="#140501" opacity="0.85"/>
      <!-- Old dark filling shadow -->
      <ellipse cx="455" cy="268" rx="8" ry="10" fill="#2b201a" opacity="0.6"/>
    </svg>
  `);

  await sharp(case6Base)
    .modulate({ brightness: 0.88, saturation: 1.25 })
    .composite([{ input: case6BeforeSvg, blend: 'multiply' }])
    .toFile(path.join(imagesDir, 'ba-makeover-before.jpg'));

  console.log('✅ Case 6: Full Smile Makeover ready');
  console.log('🎉 ALL 6 macro transformations successfully created!');
}

generateCases().catch(console.error);
