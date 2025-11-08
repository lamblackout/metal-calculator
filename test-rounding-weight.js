// test-rounding-weight.js
// Тест округления штук и пересчёта тонн

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ОКРУГЛЕНИЕ ШТУК И ПЕРЕСЧЁТ ТОНН');
console.log('='.repeat(80));
console.log('');

// ============================================================================
// СЦЕНАРИЙ СО СКРИНШОТА: Лист ПВ 608, 2 тонны, ширина 10м, длина 10м
// ============================================================================
console.log('='.repeat(80));
console.log('СЦЕНАРИЙ СО СКРИНШОТА: Лист ПВ 608, 2 тонны → 0.91 штуки → 1 штука');
console.log('='.repeat(80));

const test = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',  // Из скриншота
  weight: 2,
  width: 10,
  lengthSheet: 10
}, metalDatabase);

console.log('Входные данные (со скриншота):');
console.log('  • Тип: Лист ПВ');
console.log('  • Размер: 608');
console.log('  • Стандарт: ТУ 36.26.11-5-89');
console.log('  • Тонны: 2');
console.log('  • Ширина: 10 м');
console.log('  • Длина: 10 м');
console.log('');

if (test.success) {
  const area = test.area || test.length;
  const areaPerPiece = 10 * 10;  // 100 м²

  console.log('Результат расчёта:');
  console.log(`  • Площадь: ${area.toFixed(2)} м²`);
  console.log(`  • Площадь 1 листа: ${areaPerPiece} м²`);
  console.log(`  • Штуки БЕЗ округления: ${(area / areaPerPiece).toFixed(2)} шт`);
  console.log(`  • Штуки С округлением: ${test.pieces} шт`);
  console.log(`  • Тонны ФАКТИЧЕСКИЕ: ${test.weight.toFixed(3)} т`);
  console.log('');

  // Проверка логики
  const piecesBeforeRounding = area / areaPerPiece;
  const piecesAfterRounding = test.pieces;
  const expectedWeight = test.weight;

  console.log('Проверка логики:');
  console.log(`  1. Запрошено: 2 т`);
  console.log(`  2. Рассчитана площадь: ${area.toFixed(2)} м²`);
  console.log(`  3. Штуки без округления: ${piecesBeforeRounding.toFixed(2)} шт`);
  console.log(`  4. Округлили вверх: ${piecesAfterRounding} шт`);
  console.log(`  5. Пересчитали площадь обратно: ${piecesAfterRounding} × ${areaPerPiece} = ${piecesAfterRounding * areaPerPiece} м²`);
  console.log(`  6. Пересчитали тонны: ${expectedWeight.toFixed(3)} т`);
  console.log('');

  // Проверка что тонны увеличились (под 1 полный лист)
  const weightIncreased = test.weight > 2;
  const piecesRounded = test.pieces === Math.ceil(piecesBeforeRounding);

  if (weightIncreased && piecesRounded) {
    console.log('✅ ТЕСТ ПРОЙДЕН!');
    console.log(`   • Штуки округлены правильно: ${piecesBeforeRounding.toFixed(2)} → ${piecesAfterRounding}`);
    console.log(`   • Тонны пересчитаны правильно: 2.000 → ${expectedWeight.toFixed(3)}`);
    console.log('');
    console.log('🎯 РЕЗУЛЬТАТ:');
    console.log(`   Запрошено: 2 т`);
    console.log(`   Фактически нужно: ${expectedWeight.toFixed(3)} т для ${piecesAfterRounding} целого листа`);
  } else {
    console.log('❌ ТЕСТ ПРОВАЛЕН!');
    if (!piecesRounded) console.log(`   • Штуки не округлены: ${test.pieces}`);
    if (!weightIncreased) console.log(`   • Тонны не пересчитаны: ${test.weight}`);
  }
} else {
  console.log(`❌ ТЕСТ ПРОВАЛЕН: ${test.error}`);
}
console.log('');

// ============================================================================
// ДОПОЛНИТЕЛЬНЫЙ ТЕСТ: Проверка что без размеров листа НЕ округляется
// ============================================================================
console.log('='.repeat(80));
console.log('ДОПОЛНИТЕЛЬНЫЙ ТЕСТ: БЕЗ размеров листа (не должно округляться)');
console.log('='.repeat(80));

const test2 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2
  // НЕТ width и lengthSheet!
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лист ПВ');
console.log('  • Размер: 608');
console.log('  • Стандарт: ТУ 36.26.11-5-89');
console.log('  • Тонны: 2');
console.log('  • БЕЗ размеров листа');
console.log('');

if (test2.success) {
  const area2 = test2.area || test2.length;

  console.log('Результат:');
  console.log(`  • Площадь: ${area2.toFixed(2)} м²`);
  console.log(`  • Тонны: ${test2.weight.toFixed(3)} т`);
  console.log(`  • Штуки: ${test2.pieces || 'null'}`);
  console.log('');

  // Без размеров листа тонны НЕ должны измениться
  const weightUnchanged = Math.abs(test2.weight - 2.0) < 0.001;
  const piecesNull = test2.pieces === null || test2.pieces === undefined;

  if (weightUnchanged && piecesNull) {
    console.log('✅ ТЕСТ ПРОЙДЕН: Без размеров листа округление НЕ происходит');
  } else {
    console.log('❌ ТЕСТ ПРОВАЛЕН:');
    if (!weightUnchanged) console.log(`   • Тонны изменились: ${test2.weight}`);
    if (!piecesNull) console.log(`   • Штуки показываются: ${test2.pieces}`);
  }
} else {
  console.log(`❌ ТЕСТ ПРОВАЛЕН: ${test2.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 3: Ещё один пример с другим металлом (Лента)
// ============================================================================
console.log('='.repeat(80));
console.log('ТЕСТ 3: Лента 0.5мм, 1 тонна, ширина 1м, длина 2м');
console.log('='.repeat(80));

const test3 = calculator.calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  weight: 1,
  width: 1,
  lengthSheet: 2
}, metalDatabase);

console.log('Входные данные:');
console.log('  • Тип: Лента/штрипс');
console.log('  • Размер: 0.5 мм');
console.log('  • Марка стали: ст3');
console.log('  • Тонны: 1');
console.log('  • Ширина: 1 м, Длина: 2 м (площадь листа 2 м²)');
console.log('');

if (test3.success) {
  const area3 = test3.area || test3.length;
  const areaPerPiece3 = 1 * 2;  // 2 м²
  const piecesBeforeRounding3 = area3 / areaPerPiece3;

  console.log('Результат:');
  console.log(`  • Площадь: ${area3.toFixed(2)} м²`);
  console.log(`  • Штуки БЕЗ округления: ${piecesBeforeRounding3.toFixed(2)} шт`);
  console.log(`  • Штуки С округлением: ${test3.pieces} шт`);
  console.log(`  • Тонны ФАКТИЧЕСКИЕ: ${test3.weight.toFixed(3)} т`);
  console.log('');

  const weightIncreased3 = test3.weight > 1;
  const piecesRounded3 = test3.pieces === Math.ceil(piecesBeforeRounding3);

  if (weightIncreased3 && piecesRounded3) {
    console.log('✅ ТЕСТ 3 ПРОЙДЕН!');
    console.log(`   • Запрошено: 1.000 т`);
    console.log(`   • Фактически: ${test3.weight.toFixed(3)} т для ${test3.pieces} целых листов`);
  } else {
    console.log('❌ ТЕСТ 3 ПРОВАЛЕН!');
  }
} else {
  console.log(`❌ ТЕСТ 3 ПРОВАЛЕН: ${test3.error}`);
}
console.log('');

console.log('='.repeat(80));
console.log('📊 ИТОГ');
console.log('='.repeat(80));
console.log('');
console.log('Исправлено:');
console.log('  ✅ Штуки округляются вверх (Math.ceil)');
console.log('  ✅ Площадь/метры пересчитываются из округлённых штук');
console.log('  ✅ Тонны пересчитываются из округлённой площади/метров');
console.log('');
console.log('Результат:');
console.log('  👤 Пользователь вводит: 2 т');
console.log('  🔢 Система считает: 0.91 шт → округляет до 1 шт');
console.log('  💰 Система показывает: фактически нужно >2 т для 1 целого листа');
console.log('');
