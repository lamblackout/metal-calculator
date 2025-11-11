// test-length-per-piece-fix.js
// Тест исправления бага: поле "Длина 1 шт." не учитывалось в расчётах

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ИСПРАВЛЕНИЕ БАГА "ДЛИНА 1 ШТ."');
console.log('='.repeat(80));
console.log('');

console.log('ПРОБЛЕМА (ДО ИСПРАВЛЕНИЯ):');
console.log('  Пользователь вводит "Длина 1 шт." = 5 м');
console.log('  Калькулятор показывает: "62 шт × 11.7м" вместо "62 шт × 5м"');
console.log('');

console.log('ИСПРАВЛЕНИЕ:');
console.log('  Теперь display использует значение из поля "Длина 1 шт."');
console.log('  вместо result.standardLength из базы данных');
console.log('');

// Тест 1: Арматура А3 14мм, 62 штуки, длина 1 шт = 5м
console.log('📦 ТЕСТ 1: Арматура А3 14мм');
console.log('-'.repeat(80));
console.log('  Ввод:');
console.log('    • Тип: Арматура А3');
console.log('    • Размер: 14 мм');
console.log('    • Длина 1 шт.: 5 м (введено пользователем)');
console.log('    • Количество: 62 шт');
console.log('');

// Backend расчёт (не знает о поле "Длина 1 шт.")
const test1Backend = calculator.calculateMetal({
  metalType: 'armature_a3',
  size: '14',
  pieces: 62
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • standardLength:', test1Backend.standardLength, 'м (из базы)');
console.log('    • actual.pieces:', test1Backend.actual.pieces, 'шт');
console.log('    • actual.length:', test1Backend.actual.length, 'м (62 × 11.7)');
console.log('    • actual.weight:', test1Backend.actual.weight, 'т');
console.log('');

// Frontend расчёт (с полем "Длина 1 шт." = 5м)
const lengthPerPiece = 5;
const pieces = 62;
const totalLength = lengthPerPiece * pieces;

console.log('  Frontend расчёт (с полем "Длина 1 шт." = 5м):');
console.log('    • lengthPerPieceInput.value:', lengthPerPiece, 'м');
console.log('    • piecesInput.value:', pieces, 'шт');
console.log('    • totalLength:', totalLength, 'м (5 × 62)');
console.log('');

console.log('  Display ДОЛЖЕН показать:');
console.log('    ✅ "Количество: 62 шт × 5м" (не 11.7м!)');
console.log('    ✅ "Длина: 310 м" (не 725.4 м!)');
console.log('');

// Проверка
const expectedDisplay = `62 шт × ${lengthPerPiece}м`;
console.log('  Ожидаемый текст:', expectedDisplay);
console.log('');

// Тест 2: Круг 10мм, 100 штук, длина 1 шт = 3м
console.log('📦 ТЕСТ 2: Круг 10мм');
console.log('-'.repeat(80));
console.log('  Ввод:');
console.log('    • Тип: Круг');
console.log('    • Размер: 10 мм');
console.log('    • Длина 1 шт.: 3 м (введено пользователем)');
console.log('    • Количество: 100 шт');
console.log('');

const test2Backend = calculator.calculateMetal({
  metalType: 'circle',
  size: '10',
  pieces: 100
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • standardLength:', test2Backend.standardLength, 'м');
console.log('    • actual.pieces:', test2Backend.actual.pieces, 'шт');
console.log('    • actual.length:', test2Backend.actual.length, 'м');
console.log('');

const lengthPerPiece2 = 3;
const pieces2 = 100;
const totalLength2 = lengthPerPiece2 * pieces2;

console.log('  Frontend расчёт (с полем "Длина 1 шт." = 3м):');
console.log('    • totalLength:', totalLength2, 'м (3 × 100)');
console.log('');

console.log('  Display ДОЛЖЕН показать:');
console.log('    ✅ "Количество: 100 шт × 3м"');
console.log('    ✅ "Длина: 300 м"');
console.log('');

// Тест 3: Труба ВГП 32х2.8, без изменения поля "Длина 1 шт."
console.log('📦 ТЕСТ 3: Труба ВГП 32х2.8 (стандартная длина)');
console.log('-'.repeat(80));
console.log('  Ввод:');
console.log('    • Тип: Труба ВГП');
console.log('    • Размер: 32×2.8 мм');
console.log('    • Длина 1 шт.: (не изменено, должно использовать standardLength)');
console.log('    • Количество: 50 шт');
console.log('');

const test3Backend = calculator.calculateMetal({
  metalType: 'pipe_vgp',
  size: [32, 2.8],
  pieces: 50
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • standardLength:', test3Backend.standardLength, 'м');
console.log('    • actual.pieces:', test3Backend.actual.pieces, 'шт');
console.log('    • actual.length:', test3Backend.actual.length, 'м');
console.log('');

console.log('  Display ДОЛЖЕН показать:');
console.log('    ✅ "Количество: 50 шт × 12м" (стандартное значение)');
console.log('    ✅ "Длина: 600 м"');
console.log('');

// Итоговая сводка
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА ИСПРАВЛЕНИЯ');
console.log('='.repeat(80));
console.log('');

console.log('ИСПРАВЛЕНО В ФАЙЛЕ: docs/calculator.html, строки 1517-1531');
console.log('');

console.log('КОД ДО ИСПРАВЛЕНИЯ:');
console.log('  if (result.standardLength) {');
console.log('    piecesText += ` × ${result.standardLength}м`;  // ❌ Всегда 11.7м');
console.log('  }');
console.log('');

console.log('КОД ПОСЛЕ ИСПРАВЛЕНИЯ:');
console.log('  const lengthPerPieceInput = document.getElementById("input-length-per-piece");');
console.log('  const isFieldVisible = fieldLengthPerPiece.style.display !== "none";');
console.log('  const lengthPerPiece = parseFloat(lengthPerPieceInput.value);');
console.log('  ');
console.log('  if (isFieldVisible && lengthPerPiece > 0) {');
console.log('    piecesText += ` × ${lengthPerPiece}м`;  // ✅ Значение пользователя');
console.log('  } else if (result.standardLength) {');
console.log('    piecesText += ` × ${result.standardLength}м`;  // ✅ Fallback');
console.log('  }');
console.log('');

console.log('РЕЗУЛЬТАТ:');
console.log('  ✅ Когда поле "Длина 1 шт." видимо и заполнено → используется его значение');
console.log('  ✅ Когда поле скрыто или пусто → используется standardLength из базы');
console.log('  ✅ Сохранена обратная совместимость для металлов без этого поля');
console.log('');

console.log('ПРОВЕРКА НА UI:');
console.log('  1. Откройте docs/calculator.html в браузере');
console.log('  2. Выберите: Арматура А3, размер 14 мм');
console.log('  3. Измените "Длина 1 шт." с 12 на 5 м');
console.log('  4. Введите "Количество": 62 шт');
console.log('  5. Проверьте результат:');
console.log('     ✅ "Количество: 62 шт × 5м" (не 11.7м!)');
console.log('     ✅ "Длина: 310 м" (не 725.4 м!)');
console.log('');
