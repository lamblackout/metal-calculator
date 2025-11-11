// test-pieces-fix.js
// Тест исправления расчёта количества штук для прутковых металлов

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ИСПРАВЛЕНИЕ РАСЧЁТА КОЛИЧЕСТВА ШТУК');
console.log('='.repeat(80));
console.log('');

// Тест 1: 100 штук арматуры → должно дать 1170 м
console.log('📦 ТЕСТ 1: 100 штук Арматуры А1, 5.5 мм');
console.log('-'.repeat(80));

const test1 = calculator.calculateMetal({
  metalType: 'armature_a1',
  size: '5.5',
  pieces: 100
}, metalDatabase);

console.log('  Запрошено:', test1.requested.label);
console.log('  Фактически:');
console.log('    • Штуки:', test1.actual.pieces, 'шт');
console.log('    • Длина:', test1.actual.length, 'м');
console.log('    • Вес:', test1.actual.weight, 'т =', (test1.actual.weight * 1000).toFixed(1), 'кг');
console.log('');

// Проверка
const expectedLength1 = 100 * 11.7; // 1170 м
const test1Pass = Math.abs(test1.actual.length - expectedLength1) < 0.1;

if (test1Pass) {
  console.log('  ✅ ТЕСТ 1 ПРОЙДЕН');
  console.log('     100 шт × 11.7 м = ' + expectedLength1 + ' м ✓');
} else {
  console.log('  ❌ ТЕСТ 1 ПРОВАЛЕН');
  console.log('     Ожидалось: ' + expectedLength1 + ' м, получено:', test1.actual.length, 'м');
}
console.log('');

// Тест 2: 100 метров арматуры → должно округлить до 9 шт (105.3 м)
console.log('📦 ТЕСТ 2: 100 метров Арматуры А1, 5.5 мм');
console.log('-'.repeat(80));

const test2 = calculator.calculateMetal({
  metalType: 'armature_a1',
  size: '5.5',
  length: 100
}, metalDatabase);

console.log('  Запрошено:', test2.requested.label);
console.log('  Фактически:');
console.log('    • Штуки:', test2.actual.pieces, 'шт');
console.log('    • Длина:', test2.actual.length, 'м');
console.log('    • Вес:', test2.actual.weight, 'т =', (test2.actual.weight * 1000).toFixed(1), 'кг');
console.log('');

// Проверка
const expectedPieces2 = Math.ceil(100 / 11.7); // 9 шт
const expectedLength2 = expectedPieces2 * 11.7; // 105.3 м
const test2Pass = test2.actual.pieces === expectedPieces2 &&
                  Math.abs(test2.actual.length - expectedLength2) < 0.1;

if (test2Pass) {
  console.log('  ✅ ТЕСТ 2 ПРОЙДЕН');
  console.log('     100 м → ' + expectedPieces2 + ' шт × 11.7 м = ' + expectedLength2.toFixed(1) + ' м ✓');
} else {
  console.log('  ❌ ТЕСТ 2 ПРОВАЛЕН');
  console.log('     Ожидалось: ' + expectedPieces2 + ' шт, получено:', test2.actual.pieces, 'шт');
}
console.log('');

// Тест 3: Другие прутковые металлы (труба, уголок)
console.log('📦 ТЕСТ 3: 50 штук Трубы ВГП 32х2.8');
console.log('-'.repeat(80));

const test3 = calculator.calculateMetal({
  metalType: 'pipe_vgp',
  size: [32, 2.8],
  pieces: 50
}, metalDatabase);

console.log('  Запрошено:', test3.requested.label);
console.log('  Фактически:');
console.log('    • Штуки:', test3.actual.pieces, 'шт');
console.log('    • Длина:', test3.actual.length, 'м');
console.log('    • Вес:', test3.actual.weight, 'т =', (test3.actual.weight * 1000).toFixed(1), 'кг');
console.log('');

// Проверка
const expectedLength3 = 50 * 12; // 600 м (standardLength для труб = 12 м)
const test3Pass = Math.abs(test3.actual.length - expectedLength3) < 0.1;

if (test3Pass) {
  console.log('  ✅ ТЕСТ 3 ПРОЙДЕН');
  console.log('     50 шт × 12 м = ' + expectedLength3 + ' м ✓');
} else {
  console.log('  ❌ ТЕСТ 3 ПРОВАЛЕН');
  console.log('     Ожидалось: ' + expectedLength3 + ' м, получено:', test3.actual.length, 'м');
}
console.log('');

// Итоговая сводка
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));

const allPassed = test1Pass && test2Pass && test3Pass;

if (allPassed) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ (3/3)');
  console.log('');
  console.log('Исправление:');
  console.log('  ✅ Все прутковые металлы теперь корректно определяются как линейные');
  console.log('  ✅ Расчёт штук → длина работает правильно');
  console.log('  ✅ Расчёт длина → штуки работает правильно');
  console.log('  ✅ Используется standardLength из базы данных');
  console.log('');
  console.log('БАГ БЫЛ:');
  console.log('  linearTypes = [\'circle\', \'circle_galv\', \'rope\']');
  console.log('  ❌ Арматура, трубы, уголки не входили → считались площадными');
  console.log('  ❌ length = pieces (неправильно)');
  console.log('');
  console.log('ИСПРАВЛЕНО:');
  console.log('  areaTypes = [листы, ленты]');
  console.log('  isLinearType = !areaTypes.includes(metalType)');
  console.log('  ✅ Все прочие металлы (арматура, трубы и т.д.) → линейные');
  console.log('  ✅ length = pieces × standardLength (правильно)');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ!');
  console.log('  Тест 1:', test1Pass ? '✅' : '❌');
  console.log('  Тест 2:', test2Pass ? '✅' : '❌');
  console.log('  Тест 3:', test3Pass ? '✅' : '❌');
}
console.log('');
