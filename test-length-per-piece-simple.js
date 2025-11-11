// test-length-per-piece-simple.js
// Простой тест поля "Длина 1 шт." для прутковых металлов

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ПОЛЕ "ДЛИНА 1 ШТ."');
console.log('='.repeat(80));
console.log('');

// Подсчитать сколько металлов поддерживают это поле
let countWithStandardLengths = 0;
let examplesWithStandardLengths = [];

for (const [key, metal] of Object.entries(metalDatabase.metals)) {
  if (Array.isArray(metal.standardLengths)) {
    countWithStandardLengths++;
    if (examplesWithStandardLengths.length < 5) {
      examplesWithStandardLengths.push(`${metal.name} (${metal.standardLengths.join(', ')} м)`);
    }
  }
}

console.log('📊 Статистика:');
console.log(`   • Металлов с полем "Длина 1 шт.": ${countWithStandardLengths}`);
console.log('');
console.log('📋 Примеры:');
examplesWithStandardLengths.forEach(ex => console.log(`   • ${ex}`));
console.log('');

// Простой тест расчёта
console.log('='.repeat(80));
console.log('🔧 ПРИМЕР РАСЧЁТА');
console.log('='.repeat(80));
console.log('');

// Пример: Арматура А3, диаметр 10 мм, 10 прутков по 11.7 м
const testCase = {
  metalType: 'armature_a3',
  size: '10',
  pieces: 10,
  lengthPerPiece: 11.7
};

const metal = metalDatabase.metals[testCase.metalType];

console.log(`📦 Металл: ${metal.name}`);
console.log(`📐 Размер: ${testCase.size} мм`);
console.log(`🔢 Количество: ${testCase.pieces} шт.`);
console.log(`📏 Длина 1 шт: ${testCase.lengthPerPiece} м`);
console.log('');

// Шаг 1: Фронтенд считает общую длину
const totalLength = testCase.pieces * testCase.lengthPerPiece;
console.log('Шаг 1 (Frontend): Расчёт общей длины');
console.log(`   ${testCase.pieces} шт. × ${testCase.lengthPerPiece} м/шт. = ${totalLength} м`);
console.log('');

// Шаг 2: Бэкенд считает вес по длине
console.log('Шаг 2 (Backend): Расчёт веса');
const result = calculator.calculateMetal({
  metalType: testCase.metalType,
  size: testCase.size,
  length: totalLength,
  pieces: testCase.pieces
}, metalDatabase);

if (result.success) {
  console.log(`   ✅ Вес: ${result.weight.toFixed(4)} т (${(result.weight * 1000).toFixed(2)} кг)`);
  console.log(`   ✅ Длина: ${result.length} м`);
  console.log(`   ✅ Штуки: ${result.pieces} шт.`);
  console.log('');

  console.log('='.repeat(80));
  console.log('✅ ТЕСТ УСПЕШЕН!');
  console.log('='.repeat(80));
  console.log('');

  console.log('Как использовать в калькуляторе:');
  console.log('  1. Выберите прутковый металл (арматура, труба, уголок и т.д.)');
  console.log('  2. Выберите размер');
  console.log('  3. Появится поле "📏 Длина 1 шт."');
  console.log('  4. Введите длину одного прутка (например, 11.7 м)');
  console.log('  5. Введите количество штук (например, 10)');
  console.log('  6. Калькулятор автоматически посчитает:');
  console.log('     • Общую длину = Штуки × Длина 1 шт.');
  console.log('     • Вес с учётом резки');
  console.log('');
} else {
  console.log(`   ❌ ОШИБКА: ${result.error}`);
}
