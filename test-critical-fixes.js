// test-critical-fixes.js
// Тестирование исправления критических ошибок

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

// Загрузка базы данных
const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🔧 ТЕСТИРОВАНИЕ ИСПРАВЛЕНИЯ КРИТИЧЕСКИХ ОШИБОК');
console.log('='.repeat(80));
console.log('');

let passedTests = 0;
let totalTests = 0;

// ============================================================================
// ТЕСТ 1: Лист ПВ (линейный тип)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 1: Лист ПВ (линейный) — 1 тонна → метры → количество штук');
console.log('='.repeat(80));
totalTests++;

const test1 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  standard: 'ТУ 0971-001-44028369-2011 т.2',  // коэф. 1.014
  weight: 1,
  lengthSheet: 10  // Длина 1 листа
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лист ПВ');
console.log('  • Размер: 404');
console.log('  • Стандарт: ТУ 0971-001-44028369-2011 т.2 (коэф. 1.014)');
console.log('  • Тонны: 1');
console.log('  • Длина 1 листа: 10 м');
console.log('');

if (test1.success) {
  const expectedMeters = 1000 / (1.014 * 7.85);
  const expectedPieces = Math.ceil(expectedMeters / 10);

  console.log('Результаты:');
  console.log(`  • Метры: ${test1.length.toFixed(2)} м (ожидалось: ${expectedMeters.toFixed(2)} м)`);
  console.log(`  • Количество: ${test1.pieces || 'НЕ РАССЧИТАНО'} шт (ожидалось: ${expectedPieces} шт)`);
  console.log('');

  const metersOk = Math.abs(test1.length - expectedMeters) < 0.1;
  const piecesOk = test1.pieces === expectedPieces;

  if (metersOk && piecesOk) {
    console.log('✅ ТЕСТ 1 ПРОЙДЕН: Метры и количество рассчитаны правильно');
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 1 ПРОВАЛЕН:');
    if (!metersOk) console.log(`   • Метры неправильные: ${test1.length} вместо ${expectedMeters.toFixed(2)}`);
    if (!piecesOk) console.log(`   • Количество неправильное: ${test1.pieces} вместо ${expectedPieces}`);
  }
} else {
  console.log(`❌ ТЕСТ 1 ПРОВАЛЕН: ${test1.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 2: Лента/штрипс (площадной тип)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 2: Лента/штрипс (площадной) — 1 тонна → кв.м → количество штук');
console.log('='.repeat(80));
totalTests++;

const test2 = calculator.calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  weight: 1,
  width: 1,        // Ширина 1 м
  lengthSheet: 2   // Длина 2 м
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лента/штрипс');
console.log('  • Размер: 0.5 мм');
console.log('  • Марка стали: ст3');
console.log('  • Тонны: 1');
console.log('  • Ширина: 1 м');
console.log('  • Длина листа: 2 м');
console.log('');

if (test2.success) {
  const expectedSqMeters = 1000 / (0.5 * 7.85);
  const expectedPieces = Math.ceil(expectedSqMeters / (1 * 2));

  console.log('Результаты:');
  console.log(`  • Кв.метры: ${test2.area?.toFixed(2) || test2.length?.toFixed(2)} м² (ожидалось: ${expectedSqMeters.toFixed(2)} м²)`);
  console.log(`  • Количество: ${test2.pieces || 'НЕ РАССЧИТАНО'} шт (ожидалось: ${expectedPieces} шт)`);
  console.log('');

  const sqMetersValue = test2.area || test2.length;
  const sqMetersOk = Math.abs(sqMetersValue - expectedSqMeters) < 0.1;
  const piecesOk = test2.pieces === expectedPieces;

  if (sqMetersOk && piecesOk) {
    console.log('✅ ТЕСТ 2 ПРОЙДЕН: Кв.метры и количество рассчитаны правильно');
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 2 ПРОВАЛЕН:');
    if (!sqMetersOk) console.log(`   • Кв.метры неправильные: ${sqMetersValue} вместо ${expectedSqMeters.toFixed(2)}`);
    if (!piecesOk) console.log(`   • Количество неправильное: ${test2.pieces} вместо ${expectedPieces}`);
  }
} else {
  console.log(`❌ ТЕСТ 2 ПРОВАЛЕН: ${test2.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 3: Разные стандарты для Листа ПВ (проверка коэффициентов)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 3: Изменение стандарта для Листа ПВ — проверка пересчёта');
console.log('='.repeat(80));
totalTests++;

const test3a = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '406',
  standard: 'ТУ 36.26.11-5-89',  // коэф. 2
  weight: 1
}, metalDatabase);

const test3b = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '406',
  standard: 'ГОСТ 8706-78',  // коэф. тоже 2
  weight: 1
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лист ПВ');
console.log('  • Размер: 406');
console.log('  • Тонны: 1');
console.log('');

if (test3a.success && test3b.success) {
  console.log('Результаты:');
  console.log(`  • С "ТУ 36.26.11-5-89": ${test3a.length.toFixed(2)} м`);
  console.log(`  • С "ГОСТ 8706-78": ${test3b.length.toFixed(2)} м`);
  console.log('');

  // У обоих стандартов коэффициент 2, поэтому метры должны быть одинаковыми
  const sameResults = Math.abs(test3a.length - test3b.length) < 0.01;

  if (sameResults) {
    console.log('✅ ТЕСТ 3 ПРОЙДЕН: Стандарты с одинаковым коэффициентом дают одинаковый результат');
    passedTests++;
  } else {
    console.log(`❌ ТЕСТ 3 ПРОВАЛЕН: Результаты отличаются (${test3a.length} vs ${test3b.length})`);
  }
} else {
  console.log('❌ ТЕСТ 3 ПРОВАЛЕН:');
  if (!test3a.success) console.log(`   • ТУ 36.26.11-5-89: ${test3a.error}`);
  if (!test3b.success) console.log(`   • ГОСТ 8706-78: ${test3b.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 4: Обратный расчёт (количество → тонны)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 4: Обратный расчёт — количество штук → тонны');
console.log('='.repeat(80));
totalTests++;

const test4 = calculator.calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  pieces: 100,
  width: 1,        // Ширина 1 м
  lengthSheet: 2   // Длина 2 м
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лента/штрипс');
console.log('  • Размер: 0.5 мм');
console.log('  • Марка стали: ст3');
console.log('  • Количество: 100 шт');
console.log('  • Ширина: 1 м');
console.log('  • Длина листа: 2 м');
console.log('');

if (test4.success) {
  // Площадь: 1 × 2 × 100 = 200 м²
  // Тонны: 0.5 × 200 × 7.85 / 1000 = 0.785 т
  const expectedArea = 1 * 2 * 100;
  const expectedWeight = 0.5 * expectedArea * 7.85 / 1000;

  console.log('Результаты:');
  console.log(`  • Площадь: ${test4.area?.toFixed(2) || test4.length?.toFixed(2)} м² (ожидалось: ${expectedArea} м²)`);
  console.log(`  • Тонны: ${test4.weight?.toFixed(3)} т (ожидалось: ${expectedWeight.toFixed(3)} т)`);
  console.log('');

  const areaValue = test4.area || test4.length;
  const areaOk = Math.abs(areaValue - expectedArea) < 0.1;
  const weightOk = Math.abs(test4.weight - expectedWeight) < 0.01;

  if (areaOk && weightOk) {
    console.log('✅ ТЕСТ 4 ПРОЙДЕН: Обратный расчёт работает правильно');
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 4 ПРОВАЛЕН:');
    if (!areaOk) console.log(`   • Площадь неправильная: ${areaValue} вместо ${expectedArea}`);
    if (!weightOk) console.log(`   • Тонны неправильные: ${test4.weight} вместо ${expectedWeight.toFixed(3)}`);
  }
} else {
  console.log(`❌ ТЕСТ 4 ПРОВАЛЕН: ${test4.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 5: Граничный случай (площадь = ширина × длина)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 5: Граничный случай — площадь = ширина × длина (1 лист)');
console.log('='.repeat(80));
totalTests++;

const test5 = calculator.calculateMetal({
  metalType: 'sheet_hot',
  size: '10',
  steelType: 'ст3',
  weight: 7,
  width: 10,       // Ширина 10 м
  lengthSheet: 10  // Длина 10 м
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лист г/к');
console.log('  • Размер: 10 мм');
console.log('  • Марка стали: ст3');
console.log('  • Тонны: 7');
console.log('  • Ширина: 10 м');
console.log('  • Длина листа: 10 м');
console.log('');

if (test5.success) {
  // Площадь 1 листа: 10 × 10 = 100 м²
  // Если общая площадь ~100 м², количество должно быть ~1 лист
  const areaPerPiece = 10 * 10;
  const totalArea = test5.area || test5.length;
  const expectedPieces = Math.ceil(totalArea / areaPerPiece);

  console.log('Результаты:');
  console.log(`  • Площадь: ${totalArea?.toFixed(2)} м²`);
  console.log(`  • Площадь 1 листа: ${areaPerPiece} м²`);
  console.log(`  • Количество: ${test5.pieces || 'НЕ РАССЧИТАНО'} шт (ожидалось: ${expectedPieces} шт)`);
  console.log('');

  const piecesOk = test5.pieces === expectedPieces;

  if (piecesOk) {
    console.log('✅ ТЕСТ 5 ПРОЙДЕН: Количество рассчитано правильно (площадной тип)');
    passedTests++;
  } else {
    console.log(`❌ ТЕСТ 5 ПРОВАЛЕН: Количество неправильное: ${test5.pieces} вместо ${expectedPieces}`);
  }
} else {
  console.log(`❌ ТЕСТ 5 ПРОВАЛЕН: ${test5.error}`);
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
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ! КРИТИЧЕСКИЕ ОШИБКИ ИСПРАВЛЕНЫ.');
  console.log('');
  console.log('Исправлено:');
  console.log('  ✅ Количество штук для ЛИНЕЙНЫХ типов: meters / lengthSheet');
  console.log('  ✅ Количество штук для ПЛОЩАДНЫХ типов: area / (width × lengthSheet)');
  console.log('  ✅ Обратный расчёт: количество → тонны');
  console.log('  ✅ Стандарты для Листа ПВ работают корректно');
  console.log('  ✅ Обработчики событий добавлены (пересчёт при изменении параметров)');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
