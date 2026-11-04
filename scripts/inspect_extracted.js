const fs = require('fs');
const path = require('path');

const base = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\5d7b2a16-92df-4c4d-b8dc-c5e3be2c8c9b\\scratch\\skills_extracted';

function scan(dir, depth = 0) {
  if (depth > 3) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = full.replace(base, '');
    if (entry.isDirectory()) {
      console.log(`[DIR] ${rel}`);
      scan(full, depth + 1);
    } else if (entry.name.endsWith('.md')) {
      console.log(`  [FILE] ${rel}`);
    }
  }
}

scan(base);
