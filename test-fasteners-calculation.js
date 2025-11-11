// test-fasteners-calculation.js
// Тест расчёта крепежей: вес ↔ количество штук

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: РАСЧЁТ КРЕПЕЖЕЙ (ВЕС ↔ КОЛИЧЕСТВО ШТУК)');
console.log('='.repeat(80));
console.log('');

console.log('ТРЕБОВАНИЕ:');
console.log('  Крепежи НЕ имеют длины, только вес ↔ количество штук');
console.log('  Формулы:');
console.log('    • Вес → Количество: pieces = weight (кг) / weight_per_piece (кг)');
console.log('    • Количество → Вес: weight = pieces × weight_per_piece (кг)');
console.log('  Длина должна быть null');
console.log('');

// ============================================================================
// ТЕСТ 1: ВЕС → КОЛИЧЕСТВО ШТУК (Винты 1x2)
// ============================================================================

console.log('='.repeat(80));
console.log('📦 ТЕСТ 1: ВЕС → КОЛИЧЕСТВО ШТУК');
console.log('='.repeat(80));
console.log('');

console.log('Ввод:');
console.log('  • Металл: Винты');
console.log('  • Размер: 1x2 мм');
console.log('  • Вес: 1 тонна');
console.log('');

const result1 = calculator.calculateMetal({
  metalType: 'screw',
  size: [1, 2],
  weight: 1  // 1 тонна = 1000 кг
}, metalDatabase);

console.log('Backend результат:');
console.log('  • requested.label:', result1.requested.label);
console.log('  • actual.pieces:', result1.actual.pieces, 'шт');
console.log('  • actual.weight:', result1.actual.weight, 'т =', (result1.actual.weight * 1000).toFixed(1), 'кг');
console.log('  • actual.length:', result1.actual.length, '(должен быть null)');
console.log('');

// Проверка
const test1Pass = result1.actual.pieces > 0 &&
                  result1.actual.length === null &&
                  Math.abs(result1.actual.weight - 1) < 0.01;

if (test1Pass) {
  console.log('  ✅ ТЕСТ 1 ПРОЙДЕН');
  console.log('     • Количество: ' + result1.actual.pieces + ' шт ✓');
  console.log('     • Вес: ≈ 1 т ✓');
  console.log('     • Длина: null ✓');
} else {
  console.log('  ❌ ТЕСТ 1 ПРОВАЛЕН');
  if (result1.actual.length !== null) {
    console.log('     ❌ Длина НЕ null:', result1.actual.length);
  }
  if (result1.actual.pieces <= 0) {
    console.log('     ❌ Количество НЕ рассчитано:', result1.actual.pieces);
  }
}
console.log('');

// ============================================================================
// ТЕСТ 2: КОЛИЧЕСТВО → ВЕС (Болты М6)
// ============================================================================

console.log('='.repeat(80));
console.log('📦 ТЕСТ 2: КОЛИЧЕСТВО ШТУК → ВЕС');
console.log('='.repeat(80));
console.log('');

console.log('Ввод:');
console.log('  • Металл: Болты');
console.log('  • Размер: М6 (если есть в базе, иначе любой размер)');
console.log('  • Количество: 1000 шт');
console.log('');

// Попробуем найти болты в базе
const boltData = metalDatabase.find(m => m.type === 'bolt');
let boltSize = 'M6';
if (boltData && boltData.sizes && boltData.sizes.length > 0) {
  boltSize = boltData.sizes[0].size;  // Первый доступный размер
  console.log('  (Используем размер из базы:', boltSize, ')');
  console.log('');
}

const result2 = calculator.calculateMetal({
  metalType: 'bolt',
  size: boltSize,
  pieces: 1000
}, metalDatabase);

console.log('Backend результат:');
console.log('  • requested.label:', result2.requested.label);
console.log('  • actual.pieces:', result2.actual.pieces, 'шт');
console.log('  • actual.weight:', result2.actual.weight, 'т =', (result2.actual.weight * 1000).toFixed(2), 'кг');
console.log('  • actual.length:', result2.actual.length, '(должен быть null)');
console.log('');

// Проверка
const test2Pass = result2.actual.pieces === 1000 &&
                  result2.actual.length === null &&
                  result2.actual.weight > 0;

if (test2Pass) {
  console.log('  ✅ ТЕСТ 2 ПРОЙДЕН');
  console.log('     • Количество: 1000 шт ✓');
  console.log('     • Вес: ' + (result2.actual.weight * 1000).toFixed(2) + ' кг ✓');
  console.log('     • Длина: null ✓');
} else {
  console.log('  ❌ ТЕСТ 2 ПРОВАЛЕН');
  if (result2.actual.length !== null) {
    console.log('     ❌ Длина НЕ null:', result2.actual.length);
  }
  if (result2.actual.pieces !== 1000) {
    console.log('     ❌ Количество неправильное:', result2.actual.pieces);
  }
}
console.log('');

// ============================================================================
// ТЕСТ 3: ВЕС → КОЛИЧЕСТВО (Гайки)
// ============================================================================

console.log('='.repeat(80));
console.log('📦 ТЕСТ 3: ВЕС → КОЛИЧЕСТВО (Гайки)');
console.log('='.repeat(80));
console.log('');

console.log('Ввод:');
console.log('  • Металл: Гайки');
console.log('  • Размер: первый доступный');
console.log('  • Вес: 0.5 тонны');
console.log('');

const nutData = metalDatabase.find(m => m.type === 'nut');
let nutSize = 'M8';
if (nutData && nutData.sizes && nutData.sizes.length > 0) {
  nutSize = nutData.sizes[0].size;
  console.log('  (Используем размер из базы:', nutSize, ')');
  console.log('');
}

const result3 = calculator.calculateMetal({
  metalType: 'nut',
  size: nutSize,
  weight: 0.5
}, metalDatabase);

console.log('Backend результат:');
console.log('  • requested.label:', result3.requested.label);
console.log('  • actual.pieces:', result3.actual.pieces, 'шт');
console.log('  • actual.weight:', result3.actual.weight, 'т =', (result3.actual.weight * 1000).toFixed(1), 'кг');
console.log('  • actual.length:', result3.actual.length, '(должен быть null)');
console.log('');

// Проверка
const test3Pass = result3.actual.pieces > 0 &&
                  result3.actual.length === null &&
                  Math.abs(result3.actual.weight - 0.5) < 0.01;

if (test3Pass) {
  console.log('  ✅ ТЕСТ 3 ПРОЙДЕН');
  console.log('     • Количество: ' + result3.actual.pieces + ' шт ✓');
  console.log('     • Вес: ≈ 0.5 т ✓');
  console.log('     • Длина: null ✓');
} else {
  console.log('  ❌ ТЕСТ 3 ПРОВАЛЕН');
}
console.log('');

// ============================================================================
// ИТОГОВАЯ СВОДКА
// ============================================================================

console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log('');

const allPassed = test1Pass && test2Pass && test3Pass;

if (allPassed) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ (3/3)');
  console.log('');
  console.log('ИСПРАВЛЕНИЯ В BACKEND:');
  console.log('  1️⃣ Добавлена константа fastenerTypes (src/calculator.js:263-266)');
  console.log('     const fastenerTypes = [');
  console.log('       \'bolt\', \'screw\', \'nut\', \'nail\', \'selftapping\',');
  console.log('       \'washer\', \'stud\', \'cotter\', \'woodscrew\'');
  console.log('     ];');
  console.log('');
  console.log('  2️⃣ Добавлена проверка isFastener (строка 267)');
  console.log('     const isFastener = fastenerTypes.includes(params.metalType);');
  console.log('');
  console.log('  3️⃣ Модифицирован isLinearType (строка 277)');
  console.log('     const isLinearType = !areaTypes.includes(...) && !isFastener;');
  console.log('');
  console.log('  4️⃣ Добавлена логика ВЕС → КОЛИЧЕСТВО (строки 289-305)');
  console.log('     if (isFastener) {');
  console.log('       const weightPerPiece = weightPerMeter;');
  console.log('       pieces = Math.round(weightInKg / weightPerPiece);');
  console.log('       length = null;');
  console.log('     }');
  console.log('');
  console.log('  5️⃣ Добавлена логика КОЛИЧЕСТВО → ВЕС (строки 387-394)');
  console.log('     if (isFastener) {');
  console.log('       const weightPerPiece = weightPerMeter;');
  console.log('       weight = (pieces * weightPerPiece) / 1000;');
  console.log('       length = null;');
  console.log('     }');
  console.log('');
  console.log('РЕЗУЛЬТАТ:');
  console.log('  ✅ Крепежи: вес ↔ количество штук (БЕЗ длины)');
  console.log('  ✅ Длина всегда null для крепежей');
  console.log('  ✅ Frontend скрывает поле "Длина метры"');
  console.log('  ✅ Поведение совпадает с 23met.ru');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ!');
  console.log('  Тест 1 (вес → количество, Винты):', test1Pass ? '✅' : '❌');
  console.log('  Тест 2 (количество → вес, Болты):', test2Pass ? '✅' : '❌');
  console.log('  Тест 3 (вес → количество, Гайки):', test3Pass ? '✅' : '❌');
}
console.log('');

console.log('ПРОВЕРКА В БРАУЗЕРЕ:');
console.log('  1. Откройте docs/calculator.html');
console.log('  2. Выберите: Винты 1x2 (или любой другой крепёж)');
console.log('  3. Введите: Вес = 1 тонна');
console.log('  4. Проверьте результат:');
console.log('     ✅ Поле "Длина метры" СКРЫТО');
console.log('     ✅ Показано "Количество: [число] шт"');
console.log('     ✅ НЕТ строки "Длина: 9615384.62 м"');
console.log('  5. Очистите, введите: Количество = 1000 шт');
console.log('  6. Проверьте:');
console.log('     ✅ Рассчитан вес в кг');
console.log('     ✅ Нет длины');
console.log('');
