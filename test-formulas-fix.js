// test-formulas-fix.js
// Тесты для проверки что марка стали и оцинковка влияют на вес

const { calculateMetal } = require('./src/calculator');
const database = require('./docs/database/metals.json');

console.log('='.repeat(80));
console.log('🧪 ТЕСТЫ ФОРМУЛ: МАРКА СТАЛИ И ОЦИНКОВКА');
console.log('='.repeat(80));
console.log('');

// ТЕСТ 1: Круг - влияние марки стали
console.log('ТЕСТ 1: Круг - влияние марки стали');
console.log('-'.repeat(80));

const test1a = calculateMetal({
  metalType: 'circle',
  size: '5',
  steelType: 'ст3',
  length: 10000
}, database);

const test1b = calculateMetal({
  metalType: 'circle',
  size: '5',
  steelType: 'ст08',
  length: 10000
}, database);

console.log('Круг 5 мм, 10000 м, сталь ст3 (7.85):');
console.log('  Вес:', test1a.actual.weight, 'т');
console.log('');
console.log('Круг 5 мм, 10000 м, сталь ст08 (7.871):');
console.log('  Вес:', test1b.actual.weight, 'т');
console.log('');

const diff1 = ((test1b.actual.weight - test1a.actual.weight) / test1a.actual.weight * 100).toFixed(3);
console.log(`Разница: ${diff1}% (ожидается ~0.268%)`);

if (Math.abs(parseFloat(diff1) - 0.268) < 0.01) {
  console.log('✅ ТЕСТ 1 ПРОЙДЕН - марка стали влияет на вес круга!');
} else {
  console.log('❌ ТЕСТ 1 ПРОВАЛЕН - марка стали НЕ влияет или влияет неправильно!');
}

console.log('');
console.log('='.repeat(80));

// ТЕСТ 2: Лента окраш. - влияние марки стали
console.log('ТЕСТ 2: Лента/штрипс окраш. - влияние марки стали');
console.log('-'.repeat(80));

const test2a = calculateMetal({
  metalType: 'strip_tape_painted',
  size: '0.3',
  steelType: 'ст3',
  zincOption: '100 г/м²',
  area: 10000
}, database);

const test2b = calculateMetal({
  metalType: 'strip_tape_painted',
  size: '0.3',
  steelType: 'ст08',
  zincOption: '100 г/м²',
  area: 10000
}, database);

console.log('Лента окраш. 0.3 мм, 10000 м², ст3 (7.85), оцинк 100 г/м²:');
console.log('  Вес:', test2a.actual.weight, 'т (ожидается ~31.4 т)');
console.log('');
console.log('Лента окраш. 0.3 мм, 10000 м², ст08 (7.871), оцинк 100 г/м²:');
console.log('  Вес:', test2b.actual.weight, 'т (ожидается ~31.484 т)');
console.log('');

const diff2 = ((test2b.actual.weight - test2a.actual.weight) / test2a.actual.weight * 100).toFixed(3);
console.log(`Разница: ${diff2}% (ожидается ~0.268%)`);

if (Math.abs(parseFloat(diff2) - 0.268) < 0.01) {
  console.log('✅ ТЕСТ 2 ПРОЙДЕН - марка стали влияет на вес ленты окраш.!');
} else {
  console.log('❌ ТЕСТ 2 ПРОВАЛЕН - марка стали НЕ влияет или влияет неправильно!');
}

console.log('');
console.log('='.repeat(80));

// ТЕСТ 3: Лента окраш. - влияние оцинковки
console.log('ТЕСТ 3: Лента/штрипс окраш. - влияние оцинковки');
console.log('-'.repeat(80));

const test3a = calculateMetal({
  metalType: 'strip_tape_painted',
  size: '0.3',
  steelType: 'ст3',
  zincOption: '100 г/м²',
  area: 10000
}, database);

const test3b = calculateMetal({
  metalType: 'strip_tape_painted',
  size: '0.3',
  steelType: 'ст3',
  zincOption: '60 г/м²',
  area: 10000
}, database);

console.log('Лента окраш. 0.3 мм, 10000 м², ст3, оцинк 100 г/м²:');
console.log('  Вес:', test3a.actual.weight, 'т (ожидается ~31.4 т)');
console.log('');
console.log('Лента окраш. 0.3 мм, 10000 м², ст3, оцинк 60 г/м²:');
console.log('  Вес:', test3b.actual.weight, 'т (ожидается ~31.0 т)');
console.log('');

const diffAbs = (test3a.actual.weight - test3b.actual.weight).toFixed(3);
console.log(`Разница: ${diffAbs} т (ожидается ~0.4 т)`);

if (Math.abs(parseFloat(diffAbs) - 0.4) < 0.05) {
  console.log('✅ ТЕСТ 3 ПРОЙДЕН - оцинковка влияет на вес ленты окраш.!');
} else {
  console.log('❌ ТЕСТ 3 ПРОВАЛЕН - оцинковка НЕ влияет или влияет неправильно!');
}

console.log('');
console.log('='.repeat(80));
console.log('ИТОГ:');
console.log('Все тесты должны быть пройдены для правильной работы формул!');
console.log('='.repeat(80));
