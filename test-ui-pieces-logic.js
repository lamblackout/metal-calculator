// test-ui-pieces-logic.js
// Тестирование новой логики расчёта количества штук

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТИРОВАНИЕ ЛОГИКИ РАСЧЁТА ШТУК (UI СЦЕНАРИИ)');
console.log('='.repeat(80));
console.log('');

let passedTests = 0;
let totalTests = 0;

// ============================================================================
// СЦЕНАРИЙ 1: Пользователь вводит тонны БЕЗ размеров листа
// ============================================================================
console.log('='.repeat(80));
console.log('СЦЕНАРИЙ 1: Тонны БЕЗ размеров листа (площадной тип)');
console.log('='.repeat(80));
totalTests++;

const scenario1 = calculator.calculateMetal({
  metalType: 'sheet_hot',
  size: '10',
  steelType: 'ст3',
  weight: 7
  // НЕТ width и lengthSheet!
}, metalDatabase);

console.log('Действия:');
console.log('  1. Пользователь выбирает "Лист г/к", размер 10мм, сталь ст3');
console.log('  2. Вводит тонны: 7');
console.log('  3. НЕ вводит ширину и длину листа');
console.log('');

if (scenario1.success) {
  console.log('Результат backend:');
  console.log(`  • Площадь: ${scenario1.area || scenario1.length} м²`);
  console.log(`  • Штуки: ${scenario1.pieces || 'null'} (ожидалось: null или undefined)`);
  console.log('');

  if (scenario1.pieces === null || scenario1.pieces === undefined) {
    console.log('✅ СЦЕНАРИЙ 1 ПРОЙДЕН: Штуки НЕ показываются (нет размеров листа)');
    passedTests++;
  } else {
    console.log(`❌ СЦЕНАРИЙ 1 ПРОВАЛЕН: Штуки показываются без размеров листа: ${scenario1.pieces}`);
  }
} else {
  console.log(`❌ СЦЕНАРИЙ 1 ПРОВАЛЕН: ${scenario1.error}`);
}
console.log('');

// ============================================================================
// СЦЕНАРИЙ 2: Пользователь вводит тонны С размерами листа
// ============================================================================
console.log('='.repeat(80));
console.log('СЦЕНАРИЙ 2: Тонны С размерами листа (площадной тип)');
console.log('='.repeat(80));
totalTests++;

const scenario2 = calculator.calculateMetal({
  metalType: 'sheet_hot',
  size: '10',
  steelType: 'ст3',
  weight: 7,
  width: 10,
  lengthSheet: 10
}, metalDatabase);

console.log('Действия:');
console.log('  1. Пользователь выбирает "Лист г/к", размер 10мм, сталь ст3');
console.log('  2. Вводит тонны: 7');
console.log('  3. Вводит ширину: 10 м, длину листа: 10 м');
console.log('');

if (scenario2.success) {
  const totalArea = scenario2.area || scenario2.length;
  const areaPerPiece = 10 * 10;
  const expectedPieces = Math.ceil(totalArea / areaPerPiece);

  console.log('Результат backend:');
  console.log(`  • Площадь: ${totalArea.toFixed(2)} м²`);
  console.log(`  • Площадь 1 листа: 10 × 10 = 100 м²`);
  console.log(`  • Штуки: ${scenario2.pieces} (ожидалось: ${expectedPieces})`);
  console.log('');

  if (scenario2.pieces === expectedPieces) {
    console.log('✅ СЦЕНАРИЙ 2 ПРОЙДЕН: Штуки рассчитаны правильно');
    passedTests++;
  } else {
    console.log(`❌ СЦЕНАРИЙ 2 ПРОВАЛЕН: Неправильное количество штук`);
  }
} else {
  console.log(`❌ СЦЕНАРИЙ 2 ПРОВАЛЕН: ${scenario2.error}`);
}
console.log('');

// ============================================================================
// СЦЕНАРИЙ 3: Лист ПВ (линейный тип) С длиной листа
// ============================================================================
console.log('='.repeat(80));
console.log('СЦЕНАРИЙ 3: Лист ПВ (линейный) С длиной листа');
console.log('='.repeat(80));
totalTests++;

const scenario3 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  standard: 'ТУ 0971-001-44028369-2011 т.2',
  weight: 1,
  lengthSheet: 10
}, metalDatabase);

console.log('Действия:');
console.log('  1. Пользователь выбирает "Лист ПВ", размер 404');
console.log('  2. Выбирает стандарт "ТУ 0971-001-44028369-2011 т.2"');
console.log('  3. Вводит тонны: 1');
console.log('  4. Вводит длину листа: 10 м (БЕЗ ширины - для линейного типа)');
console.log('');

if (scenario3.success) {
  const expectedPieces = Math.ceil(scenario3.length / 10);

  console.log('Результат backend:');
  console.log(`  • Метры: ${scenario3.length.toFixed(2)} м`);
  console.log(`  • Штуки: ${scenario3.pieces} (ожидалось: ${expectedPieces})`);
  console.log('');

  if (scenario3.pieces === expectedPieces) {
    console.log('✅ СЦЕНАРИЙ 3 ПРОЙДЕН: Штуки рассчитаны правильно (линейный тип)');
    passedTests++;
  } else {
    console.log(`❌ СЦЕНАРИЙ 3 ПРОВАЛЕН: Неправильное количество штук`);
  }
} else {
  console.log(`❌ СЦЕНАРИЙ 3 ПРОВАЛЕН: ${scenario3.error}`);
}
console.log('');

// ============================================================================
// СЦЕНАРИЙ 4: Проверка формулы для площадных типов
// ============================================================================
console.log('='.repeat(80));
console.log('СЦЕНАРИЙ 4: Формула для площадных типов (100 м² → 1 лист 10×10)');
console.log('='.repeat(80));
totalTests++;

const scenario4 = calculator.calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  weight: 0.3925,  // Для получения ~100 м²
  width: 10,
  lengthSheet: 10
}, metalDatabase);

console.log('Действия:');
console.log('  1. Пользователь выбирает "Лента/штрипс", размер 0.5мм, сталь ст3');
console.log('  2. Вводит тонны: 0.3925 (чтобы получить ~100 м²)');
console.log('  3. Вводит ширину: 10 м, длину листа: 10 м');
console.log('');

if (scenario4.success) {
  const totalArea = scenario4.area || scenario4.length;
  const areaPerPiece = 10 * 10;
  const expectedPieces = Math.ceil(totalArea / areaPerPiece);

  console.log('Результат backend:');
  console.log(`  • Площадь: ${totalArea.toFixed(2)} м²`);
  console.log(`  • Площадь 1 листа: 10 × 10 = 100 м²`);
  console.log(`  • Штуки: ${scenario4.pieces} (ожидалось: ${expectedPieces})`);
  console.log('');

  // Проверка: если площадь ~100 м², то должен быть 1 лист
  if (Math.abs(totalArea - 100) < 5 && scenario4.pieces === 1) {
    console.log('✅ СЦЕНАРИЙ 4 ПРОЙДЕН: 100 м² / (10×10) = 1 лист');
    passedTests++;
  } else {
    console.log(`❌ СЦЕНАРИЙ 4 ПРОВАЛЕН: Неправильный расчёт`);
  }
} else {
  console.log(`❌ СЦЕНАРИЙ 4 ПРОВАЛЕН: ${scenario4.error}`);
}
console.log('');

// ============================================================================
// ИТОГОВАЯ СВОДКА
// ============================================================================
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log(`Всего сценариев: ${totalTests}`);
console.log(`Пройдено: ${passedTests}`);
console.log(`Провалено: ${totalTests - passedTests}`);
console.log(`Успешность: ${((passedTests / totalTests) * 100).toFixed(0)}%`);
console.log('');

if (passedTests === totalTests) {
  console.log('✅ ВСЕ СЦЕНАРИИ ПРОЙДЕНЫ! ЛОГИКА РАБОТАЕТ ПРАВИЛЬНО.');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
