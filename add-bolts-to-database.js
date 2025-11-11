// add-bolts-to-database.js
// Добавить болты в базу данных docs/database/metals.json

const fs = require('fs');

// Загрузить данные болтов
const boltsData = JSON.parse(fs.readFileSync('bolts-data.json', 'utf-8'));

console.log('Добавление болтов в базу данных...');
console.log('');

// Загрузить текущую базу
const database = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

// Проверить есть ли уже болты
if (database.metals.bolts) {
  console.log('⚠️ В базе уже есть bolts! Заменяю...');
}

// Добавить болты
database.metals.bolts = boltsData;

// Сохранить базу
fs.writeFileSync('./docs/database/metals.json', JSON.stringify(database, null, 2), 'utf-8');

console.log('✅ Болты добавлены в базу данных!');
console.log('');

console.log('Информация:');
console.log(`  • Название: ${boltsData.name}`);
console.log(`  • Категория: ${boltsData.category}`);
console.log(`  • Тип единиц: ${boltsData.unitType}`);
console.log(`  • Формула: ${boltsData.formula}`);
console.log(`  • Размеров: ${boltsData.sizes.length}`);
console.log(`  • Весов: ${Object.keys(boltsData.weights).length}`);
console.log(`  • Стандартов: ${Object.keys(boltsData.standards).length}`);
console.log('');

// Проверка
const reloaded = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));
if (reloaded.metals.bolts) {
  console.log('✅ ПРОВЕРКА: Болты успешно сохранены в базе!');
} else {
  console.log('❌ ОШИБКА: Болты НЕ сохранены!');
}
