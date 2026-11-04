const https = require('https');
const fs = require('fs');
const path = require('path');

const PRODUCTS_MAP = [
  { id: 1, query: 'wool knitted blanket sofa', file: 'prod-1.jpg' },
  { id: 2, query: 'red emergency push button', file: 'prod-2.jpg' },
  { id: 3, query: 'laptop lap desk bed', file: 'prod-3.jpg' },
  { id: 4, query: 'computer optical mouse', file: 'prod-4.jpg' },
  { id: 5, query: 'pizza pepperoni', file: 'prod-5.jpg' },
  { id: 6, query: 'earplugs foam', file: 'prod-6.jpg' },
  { id: 7, query: 'ceramic coffee mug filled', file: 'prod-7.jpg' },
  { id: 8, query: 'modern open office interior', file: 'prod-8.jpg' },
  { id: 9, query: 'popcorn bowl snack', file: 'prod-9.jpg' },
  { id: 10, query: 'DoNotDisturbSign.jpg', direct: 'https://upload.wikimedia.org/wikipedia/commons/7/76/DoNotDisturbSign.jpg', file: 'prod-10.jpg' },
  { id: 11, query: 'modern living room sofa couch', file: 'prod-11.jpg' },
  { id: 12, query: 'energy drink can cold', file: 'prod-12.jpg' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (u) => {
      https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`Status ${res.statusCode} for ${u}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      }).on('error', (e) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(e);
      });
    };
    get(url);
  });
}

function searchWikimedia(query) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url`;
    https.get(url, { headers: { 'User-Agent': 'AntigravityApp/1.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          if (j.query && j.query.pages) {
            const first = Object.values(j.query.pages)[0];
            if (first && first.imageinfo && first.imageinfo[0]) {
              return resolve({ title: first.title, url: first.imageinfo[0].url });
            }
          }
        } catch (e) {}
        resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for (const item of PRODUCTS_MAP) {
    const dest = path.join('img', 'products', item.file);
    let imgUrl = item.direct;
    if (!imgUrl) {
      const res = await searchWikimedia(item.query);
      if (res && res.url) {
        imgUrl = res.url;
        console.log(`Found for ${item.file} (${item.query}): ${res.title}`);
      }
    }
    if (imgUrl) {
      try {
        await downloadFile(imgUrl, dest);
        console.log(`✓ Downloaded ${item.file} from ${imgUrl.slice(0, 70)}...`);
      } catch (err) {
        console.error(`✗ Failed ${item.file}: ${err.message}`);
      }
    }
  }
}

run();
