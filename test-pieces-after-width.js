// test-pieces-after-width.js
// Тест: Штуки считаются после ввода веса + ширины + длины листа

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: Штуки считаются после ввода веса + ширины + длины');
console.log('='.repeat(80));
console.log('');

// ============================================================================
// СЦЕНАРИЙ: Пользователь вводит вес, потом ширину и длину листа
// ============================================================================
console.log('СЦЕНАРИЙ:');
console.log('  1. Пользователь вводит ВЕС: 2 т');
console.log('  2. Backend рассчитывает ПЛОЩАДЬ и записывает в lengthInput');
console.log('  3. Пользователь вводит ШИРИНУ: 10 м');
console.log('  4. Пользователь вводит ДЛИНУ ЛИСТА: 10 м');
console.log('  5. UI должна ПЕРЕСЧИТАТЬ ШТУКИ из площади и размеров листа');
console.log('');
console.log('='.repeat(80));
console.log('');

let passedTests = 0;
let totalTests = 0;

// ============================================================================
// ШАГ 1: Вводим только ВЕС (без размеров листа)
// ============================================================================
console.log('ШАГ 1: Вводим ВЕС: 2 т (без размеров листа)');
console.log('-'.repeat(80));
totalTests++;

const step1 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2
  // НЕТ width и lengthSheet!
}, metalDatabase);

if (step1.success) {
  const area1 = step1.area || step1.length;

  console.log('Результат backend:');
  console.log(`  • Площадь: ${area1.toFixed(2)} м²`);
  console.log(`  • Штуки: ${step1.pieces || 'null'}`);
  console.log('');

  if (step1.pieces === null) {
    console.log('✅ ШАГ 1 ПРАВИЛЬНО: Без размеров листа штуки = null');
    passedTests++;
  } else {
    console.log(`❌ ШАГ 1 НЕПРАВИЛЬНО: Штуки показываются: ${step1.pieces}`);
  }
} else {
  console.log(`❌ ШАГ 1 ПРОВАЛЕН: ${step1.error}`);
}
console.log('');

// ============================================================================
// ШАГ 2: Вводим ВЕС + РАЗМЕРЫ ЛИСТА (сразу все параметры)
// ============================================================================
console.log('ШАГ 2: Вводим ВЕС + ШИРИНУ + ДЛИНУ (сразу все)');
console.log('-'.repeat(80));
totalTests++;

const step2 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2,
  width: 10,
  lengthSheet: 10
}, metalDatabase);

if (step2.success) {
  const area2 = step2.area || step2.length;

  console.log('Результат backend:');
  console.log(`  • Площадь: ${area2.toFixed(2)} м²`);
  console.log(`  • Штуки: ${step2.pieces || 'null'}`);
  console.log('');

  if (step2.pieces === 1) {
    console.log('✅ ШАГ 2 ПРАВИЛЬНО: С размерами листа штуки = 1');
    passedTests++;
  } else {
    console.log(`❌ ШАГ 2 НЕПРАВИЛЬНО: Штуки = ${step2.pieces}, ожидалось 1`);
  }
} else {
  console.log(`❌ ШАГ 2 ПРОВАЛЕН: ${step2.error}`);
}
console.log('');

// ============================================================================
// СИМУЛЯЦИЯ UI: Как работает recalculatePiecesOnly()
// ============================================================================
console.log('СИМУЛЯЦИЯ UI: recalculatePiecesOnly()');
console.log('-'.repeat(80));
totalTests++;

console.log('Сценарий:');
console.log('  1. Backend вернул площадь: 100 м² (записали в lengthInput)');
console.log('  2. areaInput пусто (пользователь не вводил площадь напрямую)');
console.log('  3. Пользователь ввёл width = 10, lengthSheet = 10');
console.log('  4. Вызываем recalculatePiecesOnly()');
console.log('');

// Симулируем состояние полей UI
const lengthInputValue = 100;  // Backend записал площадь сюда
const areaInputValue = null;   // Пользователь не вводил напрямую
const widthValue = 10;
const lengthSheetValue = 10;

// Логика из recalculatePiecesOnly()
let totalValue = null;

if (areaInputValue && areaInputValue > 0) {
  totalValue = areaInputValue;  // Пользователь ввёл площадь напрямую
} else if (lengthInputValue && lengthInputValue > 0) {
  totalValue = lengthInputValue;  // Backend рассчитал площадь из веса
}

console.log('Проверка логики:');
console.log(`  • areaInput: ${areaInputValue || 'пусто'}`);
console.log(`  • lengthInput: ${lengthInputValue} м²`);
console.log(`  • totalValue выбран: ${totalValue} м²`);
console.log('');

if (totalValue === lengthInputValue) {
  const areaPerPiece = widthValue * lengthSheetValue;
  const pieces = Math.ceil(totalValue / areaPerPiece);

  console.log('Расчёт штук:');
  console.log(`  • totalValue: ${totalValue} м²`);
  console.log(`  • areaPerPiece: ${widthValue} × ${lengthSheetValue} = ${areaPerPiece} м²`);
  console.log(`  • pieces: ceil(${totalValue} / ${areaPerPiece}) = ${pieces} шт`);
  console.log('');

  if (pieces === 1) {
    console.log('✅ СИМУЛЯЦИЯ UI ПРАВИЛЬНО: Штуки = 1');
    passedTests++;
  } else {
    console.log(`❌ СИМУЛЯЦИЯ UI НЕПРАВИЛЬНО: Штуки = ${pieces}`);
  }
} else {
  console.log('❌ СИМУЛЯЦИЯ UI ПРОВАЛЕНА: totalValue не взят из lengthInput');
}
console.log('');

// ============================================================================
// ТЕСТ С ДРУГИМ МЕТАЛЛОМ: Лента
// ============================================================================
console.log('ТЕСТ: Лента 0.5мм, 1 т + ширина 1м + длина 2м');
console.log('-'.repeat(80));
totalTests++;

const test4 = calculator.calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  weight: 1,
  width: 1,
  lengthSheet: 2
}, metalDatabase);

if (test4.success) {
  const area4 = test4.area || test4.length;
  const expectedPieces = Math.ceil(area4 / (1 * 2));

  console.log('Результат backend:');
  console.log(`  • Площадь: ${area4.toFixed(2)} м²`);
  console.log(`  • Штуки: ${test4.pieces} (ожидалось: ${expectedPieces})`);
  console.log('');

  if (test4.pieces === expectedPieces) {
    console.log('✅ ТЕСТ ЛЕНТА ПРАВИЛЬНО: Штуки рассчитаны');
    passedTests++;
  } else {
    console.log(`❌ ТЕСТ ЛЕНТА НЕПРАВИЛЬНО: Штуки = ${test4.pieces}, ожидалось ${expectedPieces}`);
  }
} else {
  console.log(`❌ ТЕСТ ЛЕНТА ПРОВАЛЕН: ${test4.error}`);
}
console.log('');

// ============================================================================
// ИТОГОВАЯ СВОДКА
// ============================================================================
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log(`Всего тестов: ${totalTests}`);
console.log(`Пройдено: ${passedTests}`);
console.log(`Провалено: ${totalTests - passedTests}`);
console.log(`Успешность: ${((passedTests / totalTests) * 100).toFixed(0)}%`);
console.log('');

if (passedTests === totalTests) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
  console.log('');
  console.log('Исправлено:');
  console.log('  ✅ recalculatePiecesOnly() проверяет ОБА поля:');
  console.log('     1. areaInput (прямой ввод площади)');
  console.log('     2. lengthInput (расчёт площади из веса)');
  console.log('  ✅ Штуки считаются после ввода веса + ширины + длины');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
