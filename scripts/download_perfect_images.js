const https = require('https');
const fs = require('fs');
const path = require('path');

const PERFECT_MAP = [
  {
    file: 'prod-1.jpg',
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    title: 'Плед «Я на созвоне» (уютный шерстяной плед)'
  },
  {
    file: 'prod-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Big_red_emergency_stop_button_%282972000481%29.jpg',
    title: 'Кнопка «Отвечу завтра» (большая красная кнопка)'
  },
  {
    file: 'prod-3.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Working_from_Bed_-_A_Man_Works_from_Home_with_a_Laptop_in_Bed.jpg',
    title: 'Лежанка для ноутбука (работа с ноутбуком на кровати)'
  },
  {
    file: 'prod-4.jpg',
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    title: 'Автокликер мышки (компьютерная мышь)'
  },
  {
    file: 'prod-5.jpg',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    title: 'Подписка на пиццу (горячая пицца)'
  },
  {
    file: 'prod-6.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Disposable_foam_earplugs.jpg',
    title: 'Беруши «Не слышу начальство» (настоящие беруши)'
  },
  {
    file: 'prod-7.jpg',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    title: 'Кружка «Ещё 5 минуточек» (керамическая кружка с кофе)'
  },
  {
    file: 'prod-8.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Modern_office_workspace_with_a_stylish_desk.jpg',
    title: 'Фон для видеозвонка «Офис» (современный офис)'
  },
  {
    file: 'prod-9.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Bowl_of_Popcorn_%28Unsplash%29.jpg',
    title: 'Набор снеков «Дедлайн» (большая чаша попкорна)'
  },
  {
    file: 'prod-10.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/DoNotDisturbSign.jpg',
    title: 'Табличка «Не беспокоить» (настоящая табличка Do Not Disturb на ручке двери)'
  },
  {
    file: 'prod-11.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Individual_reading_a_book_on_a_comfortable_sofa_in_a_modern_living_room.jpg',
    title: 'Диван-трансформер «Кабинет» (удобный диван в гостиной)'
  },
  {
    file: 'prod-12.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Energy_Drink_Battery_Cans.jpg',
    title: 'Энергетик «Потом» (банки энергетического напитка)'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (u) => {
      https.get(u, {
        headers: {
          'User-Agent': 'LentyainEducationalStudentProject/2.0 (student@edu.by; contact@lentyain.by)'
        }
      }, (res) => {
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
      }).on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
    };
    get(url);
  });
}

async function run() {
  console.log('Downloading 100% matched product images...');
  for (const item of PERFECT_MAP) {
    const dest = path.join('img', 'products', item.file);
    try {
      await download(item.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`✓ [MATCHED] ${item.file} -> ${item.title} (${size} bytes)`);
    } catch (e) {
      console.error(`✗ [FAIL] ${item.file}: ${e.message}`);
    }
  }
  console.log('Finished updating product images.');
}

run();
