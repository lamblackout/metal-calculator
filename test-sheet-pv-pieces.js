// test-sheet-pv-pieces.js
// Тестирование расчёта штук для Листа ПВ (площадной тип)

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТИРОВАНИЕ: Лист ПВ — ПЛОЩАДНОЙ ТИП (с шириной и длиной)');
console.log('='.repeat(80));
console.log('');

let passedTests = 0;
let totalTests = 0;

// ============================================================================
// ТЕСТ 1: Лист ПВ с шириной и длиной листа
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 1: Лист ПВ — 1 тонна → площадь → штуки (с шириной × длиной)');
console.log('='.repeat(80));
totalTests++;

const test1 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  standard: 'ТУ 0971-001-44028369-2011 т.2',  // коэф. 1.014
  weight: 1,
  width: 1,         // Ширина листа: 1 м
  lengthSheet: 2    // Длина листа: 2 м
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лист ПВ (площадной)');
console.log('  • Размер: 404');
console.log('  • Стандарт: ТУ 0971-001-44028369-2011 т.2 (коэф. 1.014)');
console.log('  • Тонны: 1');
console.log('  • Ширина листа: 1 м');
console.log('  • Длина листа: 2 м');
console.log('');

if (test1.success) {
  const totalArea = test1.area || test1.length;
  const areaPerPiece = 1 * 2;  // 2 м²
  const expectedPieces = Math.ceil(totalArea / areaPerPiece);

  console.log('Результат backend:');
  console.log(`  • Площадь: ${totalArea.toFixed(2)} м²`);
  console.log(`  • Площадь 1 листа: 1 × 2 = 2 м²`);
  console.log(`  • Штуки: ${test1.pieces || 'null'} (ожидалось: ${expectedPieces})`);
  console.log('');

  // Формула: area / (width × length)
  const expectedArea = 1000 / (1.014 * 7.85);  // ~125.63 м²
  const areaOk = Math.abs(totalArea - expectedArea) < 0.5;
  const piecesOk = test1.pieces === expectedPieces;

  if (areaOk && piecesOk) {
    console.log('✅ ТЕСТ 1 ПРОЙДЕН: Лист ПВ как площадной тип (area / (width × length))');
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 1 ПРОВАЛЕН:');
    if (!areaOk) console.log(`   • Площадь неправильная: ${totalArea} вместо ${expectedArea.toFixed(2)}`);
    if (!piecesOk) console.log(`   • Штуки неправильные: ${test1.pieces} вместо ${expectedPieces}`);
  }
} else {
  console.log(`❌ ТЕСТ 1 ПРОВАЛЕН: ${test1.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 2: Лист ПВ БЕЗ размеров листа (для обратной совместимости)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 2: Лист ПВ — 1 тонна БЕЗ размеров листа (обратная совместимость)');
console.log('='.repeat(80));
totalTests++;

const test2 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  standard: 'ТУ 0971-001-44028369-2011 т.2',
  weight: 1
  // НЕТ width и lengthSheet!
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лист ПВ');
console.log('  • Размер: 404');
console.log('  • Стандарт: ТУ 0971-001-44028369-2011 т.2');
console.log('  • Тонны: 1');
console.log('  • БЕЗ размеров листа');
console.log('');

if (test2.success) {
  console.log('Результат backend:');
  console.log(`  • Площадь/Длина: ${(test2.area || test2.length).toFixed(2)} м²`);
  console.log(`  • Штуки: ${test2.pieces || 'null'} (ожидалось: null)`);
  console.log('');

  if (test2.pieces === null || test2.pieces === undefined) {
    console.log('✅ ТЕСТ 2 ПРОЙДЕН: Без размеров листа штуки не показываются');
    passedTests++;
  } else {
    console.log(`❌ ТЕСТ 2 ПРОВАЛЕН: Штуки показываются без размеров: ${test2.pieces}`);
  }
} else {
  console.log(`❌ ТЕСТ 2 ПРОВАЛЕН: ${test2.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 3: Лист ПВ оцинк. с размерами листа
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 3: Лист ПВ оцинк. — 1 тонна → площадь → штуки');
console.log('='.repeat(80));
totalTests++;

const test3 = calculator.calculateMetal({
  metalType: 'sheet_pv_galv',
  size: '406',
  standard: 'ТУ 36.26.11-5-89',  // коэф. 2
  zincOption: '275 г/м² (одностороннее)',
  weight: 1,
  width: 1,
  lengthSheet: 1
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лист ПВ оцинк.');
console.log('  • Размер: 406');
console.log('  • Стандарт: ТУ 36.26.11-5-89 (коэф. 2)');
console.log('  • Оцинковка: 275 г/м²');
console.log('  • Тонны: 1');
console.log('  • Ширина: 1 м, Длина: 1 м (1 м² на лист)');
console.log('');

if (test3.success) {
  const totalArea = test3.area || test3.length;
  const areaPerPiece = 1 * 1;  // 1 м²
  const expectedPieces = Math.ceil(totalArea / areaPerPiece);

  console.log('Результат backend:');
  console.log(`  • Площадь: ${totalArea.toFixed(2)} м²`);
  console.log(`  • Площадь 1 листа: 1 × 1 = 1 м²`);
  console.log(`  • Штуки: ${test3.pieces || 'null'} (ожидалось: ${expectedPieces})`);
  console.log('');

  const piecesOk = test3.pieces === expectedPieces;

  if (piecesOk) {
    console.log('✅ ТЕСТ 3 ПРОЙДЕН: Лист ПВ оцинк. работает как площадной тип');
    passedTests++;
  } else {
    console.log(`❌ ТЕСТ 3 ПРОВАЛЕН: Штуки неправильные: ${test3.pieces} вместо ${expectedPieces}`);
  }
} else {
  console.log(`❌ ТЕСТ 3 ПРОВАЛЕН: ${test3.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 4: Изменение размеров листа (симуляция UI)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 4: Симуляция UI — изменение размеров листа');
console.log('='.repeat(80));
totalTests++;

console.log('Сценарий:');
console.log('  1. Ввести тонны: 1');
console.log('  2. Ввести ширину: 2 м, длину: 2 м');
console.log('  3. Изменить ширину на: 1 м');
console.log('');

// Шаг 1: Тонны + размеры 2×2
const step1 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  standard: 'ТУ 0971-001-44028369-2011 т.2',
  weight: 1,
  width: 2,
  lengthSheet: 2
}, metalDatabase);

// Шаг 2: Те же тонны + размеры 1×2
const step2 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  standard: 'ТУ 0971-001-44028369-2011 т.2',
  weight: 1,
  width: 1,
  lengthSheet: 2
}, metalDatabase);

if (step1.success && step2.success) {
  const area1 = step1.area || step1.length;
  const area2 = step2.area || step2.length;
  const pieces1 = step1.pieces;
  const pieces2 = step2.pieces;

  console.log('Результат:');
  console.log(`  • Ширина 2м: Площадь ${area1.toFixed(2)} м², Штуки ${pieces1} (площадь листа 4 м²)`);
  console.log(`  • Ширина 1м: Площадь ${area2.toFixed(2)} м², Штуки ${pieces2} (площадь листа 2 м²)`);
  console.log('');

  const areaUnchanged = Math.abs(area1 - area2) < 0.01;  // Площадь НЕ меняется
  const piecesChanged = pieces2 > pieces1;  // Штуки УВЕЛИЧИЛИСЬ (меньше площадь листа)

  if (areaUnchanged && piecesChanged) {
    console.log('✅ ТЕСТ 4 ПРОЙДЕН:');
    console.log('   • Площадь НЕ изменилась (правильно!)');
    console.log('   • Штуки пересчитались (правильно!)');
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 4 ПРОВАЛЕН:');
    if (!areaUnchanged) console.log(`   • Площадь изменилась: ${area1} → ${area2}`);
    if (!piecesChanged) console.log(`   • Штуки не пересчитались: ${pieces1} → ${pieces2}`);
  }
} else {
  console.log('❌ ТЕСТ 4 ПРОВАЛЕН: Ошибка расчёта');
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
  console.log('  ✅ Лист ПВ теперь ПЛОЩАДНОЙ тип (не линейный)');
  console.log('  ✅ Формула: pieces = area / (width × lengthSheet)');
  console.log('  ✅ При изменении ширины → пересчитываются штуки');
  console.log('  ✅ Площадь НЕ меняется при изменении размеров листа');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
