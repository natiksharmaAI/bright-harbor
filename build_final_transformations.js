const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildAll() {
  const W = 800;
  const H = 533;
  const imagesDir = path.join(__dirname, 'images');

  console.log('Generating Case 1: Teeth Whitening...');
  await sharp('temp_gallery_6.png')
    .extract({ left: 4, top: 34, width: 258, height: 196 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-whitening-before.jpg'));

  await sharp('temp_gallery_6.png')
    .extract({ left: 300, top: 34, width: 258, height: 196 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-whitening-after.jpg'));
  console.log('✅ Case 1: Whitening done');

  console.log('Generating Case 2: Clear Aligners...');
  await sharp('temp_gallery_7.png')
    .extract({ left: 4, top: 4, width: 258, height: 254 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-aligners-before.jpg'));

  await sharp('temp_gallery_7.png')
    .extract({ left: 304, top: 4, width: 254, height: 254 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-aligners-after.jpg'));
  console.log('✅ Case 2: Aligners done');

  console.log('Generating Case 3: Porcelain Veneers...');
  await sharp('smilearts_veneers1.jpg')
    .extract({ left: 0, top: 10, width: 927, height: 320 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-veneers-before.jpg'));

  await sharp('smilearts_veneers1.jpg')
    .extract({ left: 0, top: 380, width: 927, height: 330 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-veneers-after.jpg'));
  console.log('✅ Case 3: Veneers done');

  console.log('Generating Case 4: Dental Implant...');
  await sharp('temp_implant_case.jpg')
    .extract({ left: 40, top: 20, width: 1898, height: 780 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-implant-before.jpg'));

  await sharp('temp_implant_case.jpg')
    .extract({ left: 40, top: 1720, width: 1898, height: 780 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-implant-after.jpg'));
  console.log('✅ Case 4: Implant done');

  console.log('Generating Case 5: Composite Bonding...');
  await sharp('temp_bonding_2.webp')
    .extract({ left: 20, top: 10, width: 1040, height: 440 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-bonding-before.jpg'));

  await sharp('temp_bonding_2.webp')
    .extract({ left: 20, top: 600, width: 1040, height: 440 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-bonding-after.jpg'));
  console.log('✅ Case 5: Bonding done');

  console.log('Generating Case 6: Full Smile Makeover...');
  await sharp('temp_gallery_3.png')
    .extract({ left: 4, top: 4, width: 260, height: 254 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-makeover-before.jpg'));

  await sharp('temp_gallery_3.png')
    .extract({ left: 298, top: 4, width: 260, height: 254 })
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(imagesDir, 'ba-makeover-after.jpg'));
  console.log('✅ Case 6: Makeover done');

  console.log('🌟 All 6 photorealistic transformation cases successfully written!');
}

buildAll().catch(e => console.error(e));
