/**
 * Script untuk copy frontend files ke app/www
 * Jalankan: node prepare.js
 */

const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, '..', 'frontend');
const DEST = path.join(__dirname, 'www');
const API_URL = 'https://vibecodeai-production.up.railway.app';

// Buat folder www
if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      let content = fs.readFileSync(srcPath);
      // Untuk file HTML — pastikan API URL sudah benar
      if (entry.name.endsWith('.html')) {
        content = content.toString()
          .replace(/window\.FINTJAM_API_URL\s*=\s*['"][^'"]*['"]/g,
                   `window.FINTJAM_API_URL = '${API_URL}'`);
        fs.writeFileSync(destPath, content, 'utf8');
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

copyDir(SRC, DEST);
console.log('✅ Frontend files copied to app/www');
console.log(`   API URL: ${API_URL}`);
