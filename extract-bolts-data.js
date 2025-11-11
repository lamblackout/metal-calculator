// extract-bolts-data.js
// Извлечь данные болтов из Болты.txt и подготовить JSON

const fs = require('fs');

// Прочитать файл
const content = fs.readFileSync('Болты.txt', 'utf-8');

console.log('Извлечение данных из Болты.txt...');
console.log('');

// Найти секции с данными (учитываем префикс VM2414:xxx)
const sizesMatch = content.match(/\/\/ ===== 1\. РАЗМЕРЫ БОЛТОВ =====\s*\n[^\[]*\[([\s\S]*?)\]/);
const weightsMatch = content.match(/\/\/ ===== 2\. ВЕСА БОЛТОВ[\s\S]*?\{([\s\S]*?)\n\s*\}/m);
const standardsMatch = content.match(/\/\/ ===== 3\. ГОСТы БОЛТОВ[\s\S]*?\{([\s\S]*?)\n\s*\}/m);

if (!sizesMatch || !weightsMatch || !standardsMatch) {
  console.error('❌ Не удалось найти все секции в файле!');
  console.log('sizesMatch:', !!sizesMatch);
  console.log('weightsMatch:', !!weightsMatch);
  console.log('standardsMatch:', !!standardsMatch);
  process.exit(1);
}

// Парсим sizes
let sizesStr = '[' + sizesMatch[1].trim() + ']';
const sizes = JSON.parse(sizesStr);

// Парсим weights
let weightsStr = '{' + weightsMatch[1].trim() + '}';
const weights = JSON.parse(weightsStr);

// Парсим standards
let standardsStr = '{' + standardsMatch[1].trim() + '}';
const standards = JSON.parse(standardsStr);

console.log('✅ Данные успешно извлечены:');
console.log(`  • Sizes: ${sizes.length}`);
console.log(`  • Weights: ${Object.keys(weights).length}`);
console.log(`  • Standards: ${Object.keys(standards).length}`);
console.log('');

// Проверка целостности
const sizesCount = sizes.length;
const weightsCount = Object.keys(weights).length;
const standardsCount = Object.keys(standards).length;

if (sizesCount !== weightsCount || sizesCount !== standardsCount) {
  console.warn('⚠️ ВНИМАНИЕ: Количество записей не совпадает!');
  console.warn(`  Sizes: ${sizesCount}`);
  console.warn(`  Weights: ${weightsCount}`);
  console.warn(`  Standards: ${standardsCount}`);
} else {
  console.log('✅ Целостность данных подтверждена');
}
console.log('');

// Создать объект для базы данных
const boltsData = {
  name: 'Болты',
  gost: 'ГОСТ 7805-70, DIN 933, DIN 603 и др.',
  category: 'Крепёж',
  formula: 'fasteners',
  unitType: 'pieces',
  sizes: sizes,
  weights: weights,
  standards: standards
};

// Сохранить в отдельный файл
fs.writeFileSync('bolts-data.json', JSON.stringify(boltsData, null, 2), 'utf-8');

console.log('✅ Данные сохранены в bolts-data.json');
console.log('');

// Показать примеры
console.log('Примеры данных:');
console.log('  Размеры:', sizes.slice(0, 5).join(', '));
console.log('  Веса:', JSON.stringify(Object.fromEntries(Object.entries(weights).slice(0, 3)), null, 2));
console.log('  Стандарты:', JSON.stringify(Object.fromEntries(Object.entries(standards).slice(0, 3)), null, 2));
console.log('');

// Найти уникальные стандарты
const uniqueStandards = [...new Set(Object.values(standards))];
console.log(`Уникальные стандарты (${uniqueStandards.length}):`, uniqueStandards.join(', '));
