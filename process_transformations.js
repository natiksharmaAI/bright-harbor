const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processCases() {
  const W = 800;
  const H = 533;
  const imagesDir = path.join(__dirname, 'images');

  console.log('--- Processing Case 1: Teeth Whitening ---');
  // temp_gallery_6.png (562x263)
  // Left half: before (yellow/dull), Right half: after (bright white)
  const meta6 = await sharp('temp_gallery_6.png').metadata();
  console.log('gallery_6 meta:', meta6);
  // Crop margins to remove any white border if needed
  const halfW6 = Math.floor(meta6.width / 2);
  await sharp('temp_gallery_6.png')
    .extract({ left: 4, top: 2, width: halfW6 - 8, height: meta6.height - 4 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-whitening-before.jpg'));

  await sharp('temp_gallery_6.png')
    .extract({ left: halfW6 + 4, top: 2, width: halfW6 - 8, height: meta6.height - 4 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-whitening-after.jpg'));
  console.log('✅ Case 1 processed');

  console.log('--- Processing Case 2: Clear Aligners ---');
  // temp_gallery_7.png (562x263)
  // Left half: before (crowded/high canines), Right half: after (straight arch)
  const meta7 = await sharp('temp_gallery_7.png').metadata();
  const halfW7 = Math.floor(meta7.width / 2);
  await sharp('temp_gallery_7.png')
    .extract({ left: 4, top: 2, width: halfW7 - 8, height: meta7.height - 4 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-aligners-before.jpg'));

  await sharp('temp_gallery_7.png')
    .extract({ left: halfW7 + 4, top: 2, width: halfW7 - 8, height: meta7.height - 4 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-aligners-after.jpg'));
  console.log('✅ Case 2 processed');

  console.log('--- Processing Case 3: Porcelain Veneers ---');
  // smilearts_veneers1.jpg: 960x789
  // Top panel: before, Bottom panel: after
  const metaV = await sharp('smilearts_veneers1.jpg').metadata();
  console.log('veneers1 meta:', metaV);
  const halfHV = Math.floor(metaV.height / 2);
  await sharp('smilearts_veneers1.jpg')
    .extract({ left: 0, top: 0, width: metaV.width, height: halfHV - 4 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-veneers-before.jpg'));

  await sharp('smilearts_veneers1.jpg')
    .extract({ left: 0, top: halfHV + 4, width: metaV.width, height: halfHV - 8 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-veneers-after.jpg'));
  console.log('✅ Case 3 processed');

  console.log('--- Processing Case 4: Dental Implant ---');
  // temp_implant_case.jpg: 1000x1333 (3 panels: top is titanium abutments in gum, bottom is ceramic crowns)
  const metaImp = await sharp('temp_implant_case.jpg').metadata();
  console.log('implant meta:', metaImp);
  // Panel 1: top ~0 to 420
  // Panel 3: bottom ~860 to 1330
  await sharp('temp_implant_case.jpg')
    .extract({ left: 0, top: 10, width: metaImp.width, height: 420 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-implant-before.jpg'));

  await sharp('temp_implant_case.jpg')
    .extract({ left: 0, top: 880, width: metaImp.width, height: 440 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-implant-after.jpg'));
  console.log('✅ Case 4 processed');

  console.log('--- Processing Case 5: Composite Bonding ---');
  // temp_bonding_2.webp: 1000x1000
  // Top: broken chipped central incisor (y: 0 to 460)
  // Bottom: bonded incisor (y: 530 to 990)
  const metaBond = await sharp('temp_bonding_2.webp').metadata();
  console.log('bonding meta:', metaBond);
  await sharp('temp_bonding_2.webp')
    .extract({ left: 0, top: 0, width: metaBond.width, height: 460 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-bonding-before.jpg'));

  await sharp('temp_bonding_2.webp')
    .extract({ left: 0, top: 530, width: metaBond.width, height: 460 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-bonding-after.jpg'));
  console.log('✅ Case 5 processed');

  console.log('--- Processing Case 6: Full Smile Makeover ---');
  // temp_gallery_3.png (562x263)
  // Left half: before (broken missing decayed), Right half: after (restored smile)
  const meta3 = await sharp('temp_gallery_3.png').metadata();
  const halfW3 = Math.floor(meta3.width / 2);
  await sharp('temp_gallery_3.png')
    .extract({ left: 4, top: 2, width: halfW3 - 8, height: meta3.height - 4 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-makeover-before.jpg'));

  await sharp('temp_gallery_3.png')
    .extract({ left: halfW3 + 4, top: 2, width: halfW3 - 8, height: meta3.height - 4 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(path.join(imagesDir, 'ba-makeover-after.jpg'));
  console.log('✅ Case 6 processed');

  console.log('🎉 All 6 genuine clinical cases processed successfully!');
}

processCases().catch(e => console.error(e));
