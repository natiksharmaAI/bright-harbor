const fs = require('fs');
const path = require('path');

let html = '<!DOCTYPE html><html><head><title>Review</title></head><body style="background:#111;color:#eee;font-family:sans-serif;padding:20px;"><h1>Gallery Review</h1><div style="display:flex;flex-wrap:wrap;gap:20px;">';

for (let i = 1; i <= 25; i++) {
  const f = `temp_gallery_${i}.png`;
  if (fs.existsSync(path.join(__dirname, f))) {
    html += `<div style="background:#222;padding:10px;border-radius:8px;border:1px solid #444;">
      <h3 style="margin:0 0 8px 0;color:#38bdf8;">Case ${i}</h3>
      <img src="${f}" style="height:160px;display:block;border-radius:4px;">
    </div>`;
  }
}

html += '</div></body></html>';
fs.writeFileSync(path.join(__dirname, 'gallery_review.html'), html);
console.log('Saved gallery_review.html');
