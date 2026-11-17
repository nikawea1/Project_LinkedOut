const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Копируем HTML файлы в dist и корректируем путь к стилям для корня dist
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  let content = fs.readFileSync(src, 'utf8');
  content = content.replace(/href="dist\/style\.css"/g, 'href="style.css"');
  fs.writeFileSync(dest, content, 'utf8');
});

// Добавляем .nojekyll для корректной работы на GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// Рекурсивное копирование папок
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

// Копируем дополнительные файлы в dist (.xlsx, .toml, .json)
const extraFiles = ['tabel_prokrastinacii_demo.xlsx', '_redirects', '_routes.json'];
extraFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

copyDir(path.join(rootDir, 'js'), path.join(distDir, 'js'));
copyDir(path.join(rootDir, 'img'), path.join(distDir, 'img'));
copyDir(path.join(rootDir, 'components'), path.join(distDir, 'components'));

console.log(`[build:dist] Successfully prepared dist folder with ${htmlFiles.length} HTML pages, js/, and img/.`);
