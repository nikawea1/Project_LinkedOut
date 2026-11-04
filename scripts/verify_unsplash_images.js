const https = require('https');

const candidates = [
  { id: '1584100936595-c0654b55a2e2', name: 'Плед' },
  { id: '1544652478-6653e09f18a2', name: 'Кнопка' },
  { id: '1588872657578-7efd1f1555ed', name: 'Лежанка для ноутбука' },
  { id: '1615663245857-ac93bb7c39e7', name: 'Мышь' },
  { id: '1513104890138-7c749659a591', name: 'Пицца' },
  { id: '1590658268037-6bf12165a8df', name: 'Наушники/беруши' },
  { id: '1514432324607-a09d9b4aefdd', name: 'Кружка' },
  { id: '1497366216548-37526070297c', name: 'Офис' },
  { id: '1578849278619-e73505e9610f', name: 'Попкорн/снеки' },
  { id: '1584438784894-089d6a62b8fa', name: 'Табличка Не беспокоить' },
  { id: '1555041469-a586c61ea9bc', name: 'Диван' },
  { id: '1622543925917-763c34d1a86e', name: 'Энергетик' }
];

async function check() {
  for (const c of candidates) {
    const url = `https://images.unsplash.com/photo-${c.id}?w=400&q=80`;
    await new Promise((resolve) => {
      https.get(url, (res) => {
        console.log(`${c.name} (${c.id}): status ${res.statusCode}, type: ${res.headers['content-type']}`);
        resolve();
      }).on('error', (e) => {
        console.log(`${c.name} (${c.id}): error ${e.message}`);
        resolve();
      });
    });
  }
}

check();
