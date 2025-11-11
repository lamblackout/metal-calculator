// add-all-fasteners-to-database.js
// Добавить все типы крепежа в базу данных

const fs = require('fs');

console.log('='.repeat(80));
console.log('🔧 ДОБАВЛЕНИЕ ВСЕХ ТИПОВ КРЕПЕЖА В БАЗУ ДАННЫХ');
console.log('='.repeat(80));
console.log('');

// Список файлов с данными
const fastenerFiles = [
  { file: 'screws-data.json', key: 'screws', name: 'Винты' },
  { file: 'nuts-data.json', key: 'nuts', name: 'Гайки' },
  { file: 'nails-data.json', key: 'nails', name: 'Гвозди' },
  { file: 'self_tapping_screws-data.json', key: 'self_tapping_screws', name: 'Саморезы' },
  { file: 'washers-data.json', key: 'washers', name: 'Шайбы' },
  { file: 'split_pins-data.json', key: 'split_pins', name: 'Шплинты' },
  { file: 'wood_screws-data.json', key: 'wood_screws', name: 'Шурупы' }
];

// Загрузить базу данных
console.log('📂 Загрузка базы данных...');
const database = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));
console.log('');

let added = 0;
let updated = 0;
let totalSizes = 0;

// Добавить каждый тип
for (const item of fastenerFiles) {
  console.log(`📦 Добавление: ${item.name} (${item.key})...`);

  try {
    // Загрузить данные
    const data = JSON.parse(fs.readFileSync(item.file, 'utf-8'));

    // Проверить есть ли уже в базе
    const exists = !!database.metals[item.key];

    // Добавить/обновить
    database.metals[item.key] = data;

    console.log(`  ✅ ${exists ? 'Обновлено' : 'Добавлено'}`);
    console.log(`     • Размеров: ${data.sizes.length}`);
    console.log(`     • Весов: ${Object.keys(data.weights).length}`);
    console.log(`     • Стандартов: ${Object.keys(data.standards).length}`);
    console.log('');

    totalSizes += data.sizes.length;

    if (exists) {
      updated++;
    } else {
      added++;
    }

  } catch (error) {
    console.log(`  ❌ ОШИБКА: ${error.message}`);
    console.log('');
  }
}

// Сохранить базу данных
console.log('💾 Сохранение базы данных...');
fs.writeFileSync('./docs/database/metals.json', JSON.stringify(database, null, 2), 'utf-8');
console.log('');

// Проверка
console.log('🔍 Проверка...');
const reloaded = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));
let verified = 0;

for (const item of fastenerFiles) {
  if (reloaded.metals[item.key]) {
    console.log(`  ✅ ${item.name} (${item.key}) - в базе`);
    verified++;
  } else {
    console.log(`  ❌ ${item.name} (${item.key}) - НЕ НАЙДЕН!`);
  }
}
console.log('');

// Итоговая сводка
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log(`Обработано типов: ${fastenerFiles.length}`);
console.log(`Добавлено новых: ${added}`);
console.log(`Обновлено: ${updated}`);
console.log(`Проверено: ${verified}/${fastenerFiles.length}`);
console.log(`Всего размеров: ${totalSizes}`);
console.log('');

if (verified === fastenerFiles.length) {
  console.log('✅ ВСЕ ТИПЫ КРЕПЕЖА УСПЕШНО ДОБАВЛЕНЫ В БАЗУ ДАННЫХ!');
  console.log('');
  console.log('Крепёж в базе (включая Болты):');
  console.log('  ✅ Болты (bolts) - уже было');
  fastenerFiles.forEach(item => {
    const data = reloaded.metals[item.key];
    console.log(`  ✅ ${item.name} (${item.key}) - ${data.sizes.length} размеров`);
  });
} else {
  console.log('❌ ЕСТЬ ПРОБЛЕМЫ! Проверьте вывод выше.');
}
console.log('');
