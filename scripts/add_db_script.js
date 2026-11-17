const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = [
  'index.html', 'feed.html', 'shop.html', 'board.html', 'messenger.html',
  'dashboard.html', 'checkout.html', 'register.html', 'design-system.html', 'data-hub.html'
];

files.forEach(f => {
  const filePath = path.join(rootDir, f);
  let c = fs.readFileSync(filePath, 'utf8');
  if (!c.includes('js/db.js')) {
    if (c.includes('<script src="js/data.js"></script>')) {
      c = c.replace('<script src="js/data.js"></script>', '<script src="js/db.js"></script>\n  <script src="js/data.js"></script>');
    } else if (c.includes('<script src="js/store.js"></script>')) {
      c = c.replace('<script src="js/store.js"></script>', '<script src="js/db.js"></script>\n  <script src="js/store.js"></script>');
    }
    fs.writeFileSync(filePath, c, 'utf8');
    console.log('Added js/db.js to', f);
  }
});
