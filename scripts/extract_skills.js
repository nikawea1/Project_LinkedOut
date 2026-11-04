const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\5d7b2a16-92df-4c4d-b8dc-c5e3be2c8c9b\\scratch\\skills_extracted';
fs.mkdirSync(targetDir, { recursive: true });

const zips = [
  {
    name: 'awesome-design-skills',
    path: 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\5d7b2a16-92df-4c4d-b8dc-c5e3be2c8c9b\\.user_uploaded\\media_1793721314296_af83004c.zip'
  },
  {
    name: 'skills-main',
    path: 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\5d7b2a16-92df-4c4d-b8dc-c5e3be2c8c9b\\.user_uploaded\\media_1793721314293_5732aadc.zip'
  },
  {
    name: 'claudedesignskills',
    path: 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\5d7b2a16-92df-4c4d-b8dc-c5e3be2c8c9b\\.user_uploaded\\media_1793721314294_d1588935.zip'
  }
];

for (const z of zips) {
  const out = path.join(targetDir, z.name);
  fs.mkdirSync(out, { recursive: true });
  console.log(`Extracting ${z.name}...`);
  try {
    execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${z.path}' -DestinationPath '${out}' -Force"`);
    console.log(`Done ${z.name}`);
  } catch (err) {
    console.error(`Failed ${z.name}: ${err.message}`);
  }
}
