const https = require('https');

const ids = [
  { id: '1584100936595-c0654b55a2e2', label: 'Плед' },
  { id: '1544652478-6653e09f18a2', label: 'Кнопка 1' },
  { id: '1595225476474-87563907a212', label: 'Кнопка 2' },
  { id: '1588872657578-7efd1f1555ed', label: 'Лежанка' },
  { id: '1615663245857-ac93bb7c39e7', label: 'Мышь' },
  { id: '1513104890138-7c749659a591', label: 'Пицца' },
  { id: '1590658268037-6bf12165a8df', label: 'Беруши' },
  { id: '1514432324607-a09d9b4aefdd', label: 'Кружка' },
  { id: '1497366216548-37526070297c', label: 'Офис' },
  { id: '1578849278619-e73505e9610f', label: 'Снеки' },
  { id: '1584438784894-089d6a62b8fa', label: 'Табличка 1' },
  { id: '1555041469-a586c61ea9bc', label: 'Диван' },
  { id: '1622543925917-763c34d1a86e', label: 'Энергетик' }
];

async function check() {
  for (const item of ids) {
    await new Promise((resolve) => {
      https.get('https://unsplash.com/photos/' + item.id, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          const m = d.match(/<meta property="og:title" content="([^"]+)"/i);
          const desc = d.match(/<meta property="og:description" content="([^"]+)"/i);
          console.log(`[${item.label}] (${item.id}):\n  TITLE: ${m ? m[1] : 'none'}\n  DESC: ${desc ? desc[1].slice(0, 100) : 'none'}\n`);
          resolve();
        });
      }).on('error', () => resolve());
    });
  }
}

check();
