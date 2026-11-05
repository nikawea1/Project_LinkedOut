const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  fs.copyFileSync(src, dest);
});

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(rootDir, 'js'), path.join(distDir, 'js'));
copyDir(path.join(rootDir, 'img'), path.join(distDir, 'img'));

console.log(`[build:dist] Successfully prepared dist folder with ${htmlFiles.length} HTML pages, js/, and img/.`);
