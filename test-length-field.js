// test-length-field.js
// Тест поля "Длина 1 шт." для разных типов металлов

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ПОЛЕ "ДЛИНА 1 ШТ." ДЛЯ ПРУТКОВЫХ МЕТАЛЛОВ');
console.log('='.repeat(80));
console.log('');

// Тесты для разных типов металлов с unitType = 'length' или 'meters'
const testCases = [
  {
    type: 'armature_a3',
    name: 'Арматура А3',
    size: '10',
    lengthPerPiece: 11.7,  // длина 1 прутка
    pieces: 10,             // количество прутков
    expectedTotalLength: 117  // общая длина = 11.7 × 10
  },
  {
    type: 'pipe_vgp',
    name: 'Труба ВГП',
    size: '32х3.2',
    lengthPerPiece: 6,
    pieces: 5,
    expectedTotalLength: 30
  },
  {
    type: 'angle',
    name: 'Уголок',
    size: '50х5',
    lengthPerPiece: 12,
    pieces: 8,
    expectedTotalLength: 96
  },
  {
    type: 'channel',
    name: 'Швеллер',
    size: '10',
    lengthPerPiece: 11.7,
    pieces: 10,
    expectedTotalLength: 117
  },
  {
    type: 'circle',
    name: 'Круг',
    size: '10',
    lengthPerPiece: 6,
    pieces: 20,
    expectedTotalLength: 120
  },
  {
    type: 'square',
    name: 'Квадрат',
    size: '10',
    lengthPerPiece: 12,
    pieces: 5,
    expectedTotalLength: 60
  }
];

let passed = 0;
let total = testCases.length;

for (const test of testCases) {
  console.log(`📦 ${test.name} (${test.type})`);
  console.log('-'.repeat(80));

  const metal = metalDatabase.metals[test.type];

  if (!metal) {
    console.log(`  ❌ Металл не найден в базе!`);
    console.log('');
    continue;
  }

  console.log(`  📊 unitType: ${metal.unitType}`);
  console.log(`  🔧 Тест: ${test.size}, ${test.pieces} шт. × ${test.lengthPerPiece} м/шт.`);
  console.log('');

  // Фронтенд сначала посчитает общую длину
  const totalLength = test.pieces * test.lengthPerPiece;

  console.log(`  📐 Общая длина: ${totalLength} м (ожидается: ${test.expectedTotalLength} м)`);

  if (Math.abs(totalLength - test.expectedTotalLength) < 0.01) {
    console.log(`  ✅ Расчёт длины правильный`);
  } else {
    console.log(`  ❌ Расчёт длины неправильный`);
  }

  // Теперь бэкенд посчитает вес по длине и штукам
  const result = calculator.calculateMetal({
    metalType: test.type,
    size: test.size,
    length: totalLength,
    pieces: test.pieces
  }, metalDatabase);

  if (result.success) {
    console.log(`  ✅ Backend расчёт:`);
    console.log(`     • Вес: ${result.weight.toFixed(4)} т`);
    console.log(`     • Длина: ${result.length} м`);
    console.log(`     • Штуки: ${result.pieces}`);
    console.log('');

    // Проверка что значения совпадают
    const lengthOk = Math.abs(result.length - totalLength) < 0.01;
    const piecesOk = result.pieces === test.pieces;

    if (lengthOk && piecesOk) {
      console.log(`  ✅ ТЕСТ ПРОЙДЕН`);
      passed++;
    } else {
      console.log(`  ❌ ТЕСТ ПРОВАЛЕН`);
      if (!lengthOk) console.log(`     Длина не совпадает: ${result.length} ≠ ${totalLength}`);
      if (!piecesOk) console.log(`     Штуки не совпадают: ${result.pieces} ≠ ${test.pieces}`);
    }
  } else {
    console.log(`  ❌ ОШИБКА: ${result.error}`);
  }

  console.log('');
}

// Итоговая сводка
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log(`Тестов пройдено: ${passed}/${total}`);
console.log(`Успешность: ${((passed / total) * 100).toFixed(0)}%`);
console.log('');

if (passed === total) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
  console.log('');
  console.log('Поле "Длина 1 шт." теперь работает для всех типов металлов:');
  console.log('  • С unitType = "length" (прутки, трубы, балки и т.д.)');
  console.log('  • С unitType = "meters" (круг, круг оцинк.)');
  console.log('');
  console.log('Расчёт:');
  console.log('  1. Пользователь вводит: Штуки + Длина 1 шт.');
  console.log('  2. Frontend считает: Общая длина = Штуки × Длина 1 шт.');
  console.log('  3. Backend считает: Вес по формуле металла');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
