// test-ui-scenario.js
// Эмуляция сценария из скриншота

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: СЦЕНАРИЙ ИЗ СКРИНШОТА');
console.log('='.repeat(80));
console.log('');

console.log('СЦЕНАРИЙ: Пользователь вводит оба поля');
console.log('  • Длина: 10.00 м');
console.log('  • Количество: 10 шт');
console.log('');

// Шаг 1: Пользователь ввёл длину 10 м
console.log('ШАГ 1: Ввод в поле "Длина" → 10 м');
console.log('-'.repeat(80));

const result1 = calculator.calculateMetal({
  metalType: 'armature_a1',
  size: '5.5',
  length: 10
}, metalDatabase);

console.log('Расчёт (только length):');
console.log('  Запрошено:', result1.requested.label);
console.log('  Фактически:');
console.log('    • Вес:', result1.actual.weight, 'т =', (result1.actual.weight * 1000).toFixed(1), 'кг');
console.log('    • Длина:', result1.actual.length, 'м');
console.log('    • Штуки:', result1.actual.pieces);
console.log('');

console.log('  → UI должен обновить:');
console.log('     weightInput.value =', result1.actual.weight.toFixed(3), 'т');
console.log('     lengthInput.value =', result1.actual.length.toFixed(2), 'м');
console.log('     piecesInput.value =', result1.actual.pieces);
console.log('');

// Шаг 2: Пользователь ввёл штуки 10 (НЕ очистив длину!)
console.log('ШАГ 2: Ввод в поле "Количество" → 10 шт');
console.log('-'.repeat(80));

const result2 = calculator.calculateMetal({
  metalType: 'armature_a1',
  size: '5.5',
  pieces: 10
}, metalDatabase);

console.log('Расчёт (только pieces):');
console.log('  Запрошено:', result2.requested.label);
console.log('  Фактически:');
console.log('    • Вес:', result2.actual.weight, 'т =', (result2.actual.weight * 1000).toFixed(1), 'кг');
console.log('    • Длина:', result2.actual.length, 'м');
console.log('    • Штуки:', result2.actual.pieces);
console.log('');

console.log('  → UI должен обновить:');
console.log('     weightInput.value =', result2.actual.weight.toFixed(3), 'т');
console.log('     lengthInput.value =', result2.actual.length.toFixed(2), 'м');
console.log('     piecesInput.value =', result2.actual.pieces, '(НЕ обновлять, т.к. sourceField)');
console.log('');

// Анализ скриншота
console.log('='.repeat(80));
console.log('📸 АНАЛИЗ СКРИНШОТА');
console.log('='.repeat(80));
console.log('');

console.log('На скриншоте показано:');
console.log('  Ввод:');
console.log('    • Длина: 10.00 м');
console.log('    • Количество: 10 шт');
console.log('');
console.log('  Результат:');
console.log('    • Запрошено: 10 шт');
console.log('    • Количество: 10 шт × 11.7м');
console.log('    • Длина: 10 м');
console.log('    • Вес: 0.002 т (2.0 кг)');
console.log('');

console.log('ПРОБЛЕМА:');
console.log('  ❌ Если запрошено "10 шт", то:');
console.log('     • Длина должна быть 117 м (10 × 11.7), а НЕ 10 м!');
console.log('     • Вес должен быть 0.022 т (22 кг), а НЕ 0.002 т (2 кг)!');
console.log('');
console.log('  ❌ Если запрошено "10 м", то:');
console.log('     • Штуки должны быть 1 (округлено от 0.85), а НЕ 10!');
console.log('     • Длина должна быть 11.7 м (после округления), а НЕ 10 м!');
console.log('');

console.log('ВЫВОД:');
console.log('  UI показывает СМЕСЬ данных:');
console.log('    • "Запрошено: 10 шт" - взято из последнего расчёта (pieces)');
console.log('    • "Длина: 10 м" - взято из ПОЛЯ ВВОДА, а не из result.actual.length!');
console.log('    • "Вес: 0.002 т" - взято из result.actual.weight');
console.log('');
console.log('  ⚠️ ПРОБЛЕМА: UI НЕ обновляет поле lengthInput из result.actual.length!');
console.log('');

console.log('ПРИЧИНА:');
console.log('  Когда sourceField === "pieces", условие:');
console.log('    if (sourceField !== "length" || lengthChanged)');
console.log('');
console.log('  должно быть истинным (sourceField === "pieces" !== "length"),');
console.log('  и length ДОЛЖЕН обновиться до 117 м.');
console.log('');
console.log('  Но на скриншоте length = 10 м → значит код НЕ обновил поле!');
console.log('');

console.log('ВОЗМОЖНЫЕ ПРИЧИНЫ:');
console.log('  1️⃣ Debounce задержка - расчёт ещё не выполнился');
console.log('  2️⃣ Пользователь ввёл длину ПОСЛЕ штук, и она перезаписала результат');
console.log('  3️⃣ Код UI имеет баг и НЕ обновляет поле length');
console.log('  4️⃣ Условие lengthChanged проверяет старое значение в поле');
console.log('');
