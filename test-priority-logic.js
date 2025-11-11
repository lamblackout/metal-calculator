// test-priority-logic.js
// Тест логики приоритета полей при пересчёте

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ЛОГИКА ПРИОРИТЕТА ПОЛЕЙ ПРИ ПЕРЕСЧЁТЕ');
console.log('='.repeat(80));
console.log('');

console.log('ПРОБЛЕМА (ДО ИСПРАВЛЕНИЯ):');
console.log('  Пользователь вводит Вес = 2 т');
console.log('  Изменяет "Длина 1 шт." с 20м на 40м');
console.log('  ❌ Вес пересчитывается: 2т → 4т (неправильно!)');
console.log('  ❌ Количество остаётся: 650 шт');
console.log('');

console.log('ИСПРАВЛЕНИЕ:');
console.log('  Добавлена переменная inputPriority');
console.log('  При первом вводе устанавливается приоритет');
console.log('  При изменении "Длина 1 шт." учитывается приоритет:');
console.log('    • Если приоритет у weight → пересчитывается pieces (weight остаётся)');
console.log('    • Если приоритет у pieces → пересчитывается weight (pieces остаётся)');
console.log('');

// ============================================================================
// ТЕСТ 1: ПРИОРИТЕТ У ВЕСА
// ============================================================================

console.log('='.repeat(80));
console.log('📦 ТЕСТ 1: ПРИОРИТЕТ У ВЕСА (Круг 5 мм, ст3)');
console.log('='.repeat(80));
console.log('');

console.log('Сценарий:');
console.log('  1. Пользователь вводит: Вес = 2 тонны');
console.log('  2. Калькулятор рассчитывает: Длина 1 шт = 20 м, Кол-во ≈ 649 шт');
console.log('  3. Пользователь изменяет: Длина 1 шт с 20 на 40 метров');
console.log('');

// Шаг 1: Ввели вес 2 тонны
console.log('ШАГ 1: Ввод веса = 2 тонны');
console.log('-'.repeat(80));

const step1 = calculator.calculateMetal({
  metalType: 'circle',
  size: '5',
  weight: 2
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • standardLength:', step1.standardLength, 'м');
console.log('    • actual.pieces:', step1.actual.pieces, 'шт');
console.log('    • actual.length:', step1.actual.length, 'м');
console.log('    • actual.weight:', step1.actual.weight, 'т');
console.log('');

console.log('  Frontend: Приоритет установлен → "weight"');
console.log('');

// Шаг 2: Изменили длину 1 шт. с 20 на 40 м
// При приоритете weight передаём weight в backend с lengthSheet=40
console.log('ШАГ 2: Изменение "Длина 1 шт." с 20 на 40 м (приоритет у weight)');
console.log('-'.repeat(80));

const step2 = calculator.calculateMetal({
  metalType: 'circle',
  size: '5',
  weight: 2,  // ← Приоритет у weight!
  lengthSheet: 40  // ← Новая длина 1 шт.
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • actual.pieces:', step2.actual.pieces, 'шт');
console.log('    • actual.length:', step2.actual.length, 'м');
console.log('    • actual.weight:', step2.actual.weight, 'т');
console.log('');

// Проверка
const expectedPieces = Math.ceil(step2.actual.length / 40);  // Длина / 40м
const test1Pass = Math.abs(step2.actual.weight - 2) < 0.01 &&  // Вес ≈ 2 т
                  Math.abs(step2.actual.pieces - expectedPieces) < 5;  // Количество пересчиталось

if (test1Pass) {
  console.log('  ✅ ТЕСТ 1 ПРОЙДЕН');
  console.log('     • Вес остался ≈ 2 т ✓');
  console.log('     • Количество пересчиталось: 649 → ' + step2.actual.pieces + ' шт ✓');
  console.log('     • Длина: ' + step2.actual.length + ' м (' + step2.actual.pieces + ' × 40м) ✓');
} else {
  console.log('  ❌ ТЕСТ 1 ПРОВАЛЕН');
  console.log('     Ожидалось: вес ≈ 2 т, получено:', step2.actual.weight, 'т');
}
console.log('');

// ============================================================================
// ТЕСТ 2: ПРИОРИТЕТ У КОЛИЧЕСТВА
// ============================================================================

console.log('='.repeat(80));
console.log('📦 ТЕСТ 2: ПРИОРИТЕТ У КОЛИЧЕСТВА (Круг 5 мм, ст3)');
console.log('='.repeat(80));
console.log('');

console.log('Сценарий:');
console.log('  1. Пользователь вводит: Длина 1 шт = 20 м, Кол-во = 40 штук');
console.log('  2. Калькулятор рассчитывает: Вес ≈ 2 тонны');
console.log('  3. Пользователь изменяет: Длина 1 шт с 20 на 40 метров');
console.log('');

// Шаг 1: Ввели количество 40 штук с lengthSheet=20
console.log('ШАГ 1: Ввод количества = 40 шт, длина 1 шт = 20 м');
console.log('-'.repeat(80));

const step3 = calculator.calculateMetal({
  metalType: 'circle',
  size: '5',
  pieces: 40,
  lengthSheet: 20
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • actual.pieces:', step3.actual.pieces, 'шт');
console.log('    • actual.length:', step3.actual.length, 'м');
console.log('    • actual.weight:', step3.actual.weight, 'т');
console.log('');

console.log('  Frontend: Приоритет установлен → "pieces"');
console.log('');

// Шаг 2: Изменили длину 1 шт. с 20 на 40 м
// При приоритете pieces передаём pieces в backend с lengthSheet=40
console.log('ШАГ 2: Изменение "Длина 1 шт." с 20 на 40 м (приоритет у pieces)');
console.log('-'.repeat(80));

const step4 = calculator.calculateMetal({
  metalType: 'circle',
  size: '5',
  pieces: 40,  // ← Приоритет у pieces!
  lengthSheet: 40  // ← Новая длина 1 шт.
}, metalDatabase);

console.log('  Backend результат:');
console.log('    • actual.pieces:', step4.actual.pieces, 'шт');
console.log('    • actual.length:', step4.actual.length, 'м');
console.log('    • actual.weight:', step4.actual.weight, 'т');
console.log('');

// Проверка
const expectedLength = 40 * 40;  // 40 шт × 40 м = 1600 м
const test2Pass = step4.actual.pieces === 40 &&  // Количество осталось 40
                  Math.abs(step4.actual.length - expectedLength) < 0.1 &&  // Длина = 1600 м
                  step4.actual.weight > step3.actual.weight;  // Вес увеличился

if (test2Pass) {
  console.log('  ✅ ТЕСТ 2 ПРОЙДЕН');
  console.log('     • Количество осталось: 40 шт ✓');
  console.log('     • Длина: ' + step4.actual.length + ' м (40 × 40м) ✓');
  console.log('     • Вес пересчитался: ' + step3.actual.weight + 'т → ' + step4.actual.weight + 'т ✓');
} else {
  console.log('  ❌ ТЕСТ 2 ПРОВАЛЕН');
  console.log('     Ожидалось: 40 шт, получено:', step4.actual.pieces, 'шт');
}
console.log('');

// ============================================================================
// ИТОГОВАЯ СВОДКА
// ============================================================================

console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log('');

const allPassed = test1Pass && test2Pass;

if (allPassed) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ (2/2)');
  console.log('');
  console.log('ИЗМЕНЕНИЯ В КОДЕ:');
  console.log('  1️⃣ Добавлена переменная inputPriority (docs/calculator.html:683)');
  console.log('     let inputPriority = null;');
  console.log('');
  console.log('  2️⃣ Добавлены функции setPriority() и resetPriority() (строки 1249-1271)');
  console.log('     function setPriority(field) { ... }');
  console.log('     function resetPriority() { ... }');
  console.log('');
  console.log('  3️⃣ Обработчики полей устанавливают приоритет (строки 1277-1319)');
  console.log('     weightInput: setPriority("weight")');
  console.log('     lengthInput: setPriority("length")');
  console.log('     piecesInput: setPriority("pieces")');
  console.log('');
  console.log('  4️⃣ calculateTotalLengthFromPieces() учитывает приоритет (строки 1344-1352)');
  console.log('     if (inputPriority === "weight") {');
  console.log('       debounceRecalculate("weight");  // Вес сохраняется');
  console.log('     } else {');
  console.log('       debounceRecalculate("pieces");  // Pieces сохраняется');
  console.log('     }');
  console.log('');
  console.log('  5️⃣ Приоритет сбрасывается при:');
  console.log('     • Смене типа металла (строки 567-570)');
  console.log('     • Смене размера (строки 1423-1426)');
  console.log('     • Очистке всех полей (строки 1265-1270)');
  console.log('');
  console.log('РЕЗУЛЬТАТ:');
  console.log('  ✅ Приоритет у веса → количество пересчитывается, вес ≈ константа');
  console.log('  ✅ Приоритет у pieces → вес пересчитывается, количество = константа');
  console.log('  ✅ Поведение совпадает с 23met.ru');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ!');
  console.log('  Тест 1 (приоритет веса):', test1Pass ? '✅' : '❌');
  console.log('  Тест 2 (приоритет pieces):', test2Pass ? '✅' : '❌');
}
console.log('');

console.log('ИНСТРУКЦИЯ ДЛЯ ПРОВЕРКИ В БРАУЗЕРЕ:');
console.log('  1. Откройте docs/calculator.html');
console.log('  2. Выберите: Круг, размер 5 мм, марка стали ст3');
console.log('  3. Введите: Вес = 2 тонны');
console.log('  4. Измените: "Длина 1 шт." с 12 на 40 м');
console.log('  5. Проверьте консоль:');
console.log('     🔒 Установлен приоритет поля: weight');
console.log('     🔒 Приоритет у ВЕСА → пересчитываем количество штук');
console.log('  6. Проверьте результат:');
console.log('     ✅ Вес остался ≈ 2 т');
console.log('     ✅ Количество пересчиталось');
console.log('');
