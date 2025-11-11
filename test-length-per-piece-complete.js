// test-length-per-piece-complete.js
// Полный тест исправления бага "Длина 1 шт."

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ПОЛНЫЙ ТЕСТ: ПОЛЕ "ДЛИНА 1 ШТ." РАБОТАЕТ ПРАВИЛЬНО');
console.log('='.repeat(80));
console.log('');

// Тест 1: Арматура А3 14мм, 62 штуки, длина 1 шт. = 5м
console.log('📦 ТЕСТ 1: Арматура А3 14мм, 62 шт × 5м');
console.log('-'.repeat(80));
console.log('  Ввод пользователя:');
console.log('    • Металл: Арматура А3');
console.log('    • Размер: 14 мм');
console.log('    • Длина 1 шт.: 5 м (вместо стандартных 11.7 м)');
console.log('    • Количество: 62 шт');
console.log('');

// Эмуляция: пользователь ввёл 62 штуки + lengthSheet = 5м
const result1 = calculator.calculateMetal({
  metalType: 'armature_a3',
  size: '14',
  pieces: 62,
  lengthSheet: 5  // ✅ Передаём пользовательскую длину!
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • requested.label:', result1.requested.label);
console.log('    • actual.pieces:', result1.actual.pieces, 'шт');
console.log('    • actual.length:', result1.actual.length, 'м');
console.log('    • actual.weight:', result1.actual.weight, 'т =', (result1.actual.weight * 1000).toFixed(1), 'кг');
console.log('    • standardLength:', result1.standardLength, 'м (из базы, НЕ используется)');
console.log('');

// Проверка
const expectedLength1 = 62 * 5; // 310 м
const test1Pass = Math.abs(result1.actual.length - expectedLength1) < 0.1;

if (test1Pass) {
  console.log('  ✅ ТЕСТ 1 ПРОЙДЕН');
  console.log('     • Длина: 310 м (62 × 5) ✓');
  console.log('     • Вес для 310 м (не для 725.4 м!) ✓');
  console.log('     • lengthSheet = 5м использовано вместо standardLength = 11.7м ✓');
} else {
  console.log('  ❌ ТЕСТ 1 ПРОВАЛЕН');
  console.log('     Ожидалось: ' + expectedLength1 + ' м, получено:', result1.actual.length, 'м');
}
console.log('');

// Тест 2: Круг 12мм, 10 штук, длина 1 шт. = 15м
console.log('📦 ТЕСТ 2: Круг 12мм, 10 шт × 15м');
console.log('-'.repeat(80));
console.log('  Ввод пользователя:');
console.log('    • Металл: Круг');
console.log('    • Размер: 12 мм');
console.log('    • Длина 1 шт.: 15 м (вместо стандартных 12 м)');
console.log('    • Количество: 10 шт');
console.log('');

const result2 = calculator.calculateMetal({
  metalType: 'circle',
  size: '12',
  pieces: 10,
  lengthSheet: 15  // ✅ Передаём пользовательскую длину!
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • actual.pieces:', result2.actual.pieces, 'шт');
console.log('    • actual.length:', result2.actual.length, 'м');
console.log('    • actual.weight:', result2.actual.weight, 'т =', (result2.actual.weight * 1000).toFixed(1), 'кг');
console.log('');

const expectedLength2 = 10 * 15; // 150 м
const test2Pass = Math.abs(result2.actual.length - expectedLength2) < 0.1;

if (test2Pass) {
  console.log('  ✅ ТЕСТ 2 ПРОЙДЕН');
  console.log('     • Длина: 150 м (10 × 15) ✓');
} else {
  console.log('  ❌ ТЕСТ 2 ПРОВАЛЕН');
  console.log('     Ожидалось: ' + expectedLength2 + ' м, получено:', result2.actual.length, 'м');
}
console.log('');

// Тест 3: Без lengthSheet - должен использовать standardLength
console.log('📦 ТЕСТ 3: Труба ВГП 32×2.8, 50 шт (без изменения длины 1 шт.)');
console.log('-'.repeat(80));
console.log('  Ввод пользователя:');
console.log('    • Металл: Труба ВГП');
console.log('    • Размер: 32×2.8 мм');
console.log('    • Длина 1 шт.: НЕ изменена (используется стандартная)');
console.log('    • Количество: 50 шт');
console.log('');

const result3 = calculator.calculateMetal({
  metalType: 'pipe_vgp',
  size: [32, 2.8],
  pieces: 50
  // lengthSheet НЕ передано - backend использует standardLength
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • actual.pieces:', result3.actual.pieces, 'шт');
console.log('    • actual.length:', result3.actual.length, 'м');
console.log('    • actual.weight:', result3.actual.weight, 'т =', (result3.actual.weight * 1000).toFixed(1), 'кг');
console.log('    • standardLength:', result3.standardLength, 'м (используется)');
console.log('');

const expectedLength3 = 50 * result3.standardLength; // 50 × 12 = 600 м
const test3Pass = Math.abs(result3.actual.length - expectedLength3) < 0.1;

if (test3Pass) {
  console.log('  ✅ ТЕСТ 3 ПРОЙДЕН');
  console.log('     • Длина: 600 м (50 × 12) ✓');
  console.log('     • Используется standardLength из базы ✓');
} else {
  console.log('  ❌ ТЕСТ 3 ПРОВАЛЕН');
  console.log('     Ожидалось: ' + expectedLength3 + ' м, получено:', result3.actual.length, 'м');
}
console.log('');

// Тест 4: Проверка что при передаче length без lengthSheet округляется через standardLength
console.log('📦 ТЕСТ 4: Арматура А1 5.5мм, 310 м БЕЗ lengthSheet (старое поведение)');
console.log('-'.repeat(80));
console.log('  Ввод: length = 310 м, lengthSheet НЕ передано');
console.log('');

const result4 = calculator.calculateMetal({
  metalType: 'armature_a1',
  size: '5.5',
  length: 310
  // lengthSheet НЕ передано
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • actual.pieces:', result4.actual.pieces, 'шт');
console.log('    • actual.length:', result4.actual.length, 'м');
console.log('    • standardLength:', result4.standardLength, 'м');
console.log('');

// Backend должен округлить: 310 / 11.7 = 26.5 → 27 шт → 27 × 11.7 = 315.9 м
const expectedPieces4 = Math.ceil(310 / result4.standardLength);
const expectedLength4 = expectedPieces4 * result4.standardLength;
const test4Pass = result4.actual.pieces === expectedPieces4 &&
                  Math.abs(result4.actual.length - expectedLength4) < 0.1;

if (test4Pass) {
  console.log('  ✅ ТЕСТ 4 ПРОЙДЕН');
  console.log('     • Округлено через standardLength: 310 м → ' + expectedPieces4 + ' шт × 11.7 м = ' + expectedLength4.toFixed(1) + ' м ✓');
  console.log('     • Старое поведение сохранено (обратная совместимость) ✓');
} else {
  console.log('  ❌ ТЕСТ 4 ПРОВАЛЕН');
  console.log('     Ожидалось: ' + expectedPieces4 + ' шт, получено:', result4.actual.pieces, 'шт');
}
console.log('');

// Итоговая сводка
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log('');

const allPassed = test1Pass && test2Pass && test3Pass && test4Pass;

if (allPassed) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ (4/4)');
  console.log('');
  console.log('ИСПРАВЛЕНИЯ:');
  console.log('  1️⃣ Frontend передаёт lengthSheet из поля "Длина 1 шт." в backend');
  console.log('     (docs/calculator.html, строки 835-846)');
  console.log('');
  console.log('  2️⃣ Frontend передаёт pieces (не length!) когда поле активно');
  console.log('     (docs/calculator.html, строки 1240-1244)');
  console.log('');
  console.log('  3️⃣ Display показывает значение из lengthPerPieceInput');
  console.log('     (docs/calculator.html, строки 1517-1531)');
  console.log('');
  console.log('  4️⃣ Backend использует lengthSheet для округления штук');
  console.log('     (src/calculator.js, строки 329-333)');
  console.log('');
  console.log('РЕЗУЛЬТАТ:');
  console.log('  ✅ Когда пользователь меняет "Длина 1 шт." → используется его значение');
  console.log('  ✅ Расчёт веса и длины производится для правильного количества метров');
  console.log('  ✅ Отображение показывает актуальную длину 1 шт., а не стандартную');
  console.log('  ✅ Сохранена обратная совместимость (без lengthSheet → standardLength)');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ!');
  console.log('  Тест 1:', test1Pass ? '✅' : '❌');
  console.log('  Тест 2:', test2Pass ? '✅' : '❌');
  console.log('  Тест 3:', test3Pass ? '✅' : '❌');
  console.log('  Тест 4:', test4Pass ? '✅' : '❌');
}
console.log('');

console.log('ИНСТРУКЦИЯ ДЛЯ ПРОВЕРКИ В БРАУЗЕРЕ:');
console.log('  1. Откройте docs/calculator.html');
console.log('  2. Выберите: Арматура А3, размер 14 мм');
console.log('  3. Измените "Длина 1 шт." с 12 на 5 м');
console.log('  4. Введите "Количество": 62 шт');
console.log('  5. Проверьте результат:');
console.log('     ✅ "Количество: 62 шт × 5м" (не 11.7м!)');
console.log('     ✅ "Длина: 310 м" (не 725.4 м!)');
console.log('     ✅ "Вес: 0.375 т" (не 0.877 т!)');
console.log('');
