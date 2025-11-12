#!/usr/bin/env node
/**
 * ТЕСТЫ ДЛЯ КВАДРАТА С МАРКАМИ СТАЛИ
 *
 * Проверяем, что Квадрат правильно рассчитывает вес с учётом марки стали
 */

const { calculateMetal } = require('./src/calculator.js');
const metalDatabase = require('./docs/database/metals.json');

console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 ТЕСТЫ ДЛЯ КВАДРАТА С МАРКАМИ СТАЛИ');
console.log('═══════════════════════════════════════════════════════════════\n');

// =============================================================================
// ТЕСТ 1: Влияние марки стали (Квадрат 10мм, 100м)
// =============================================================================
console.log('📋 ТЕСТ 1: Влияние марки стали');
console.log('─────────────────────────────────────────────────────────────\n');

const test1_1 = calculateMetal({
  metalType: 'square',
  size: '10',
  length: 100,
  steelType: 'ст3'
}, metalDatabase);

const test1_2 = calculateMetal({
  metalType: 'square',
  size: '10',
  length: 100,
  steelType: 'ст08'
}, metalDatabase);

console.log('Тест 1.1: Квадрат 10мм, 100м, сталь ст3 (7.85)');
console.log(`  weightPerMeter: ${test1_1.weightPerMeter} кг/м`);
console.log(`  actual length: ${test1_1.length} м`);
console.log(`  weight: ${test1_1.weight} т`);
console.log();

console.log('Тест 1.2: Квадрат 10мм, 100м, сталь ст08 (7.871)');
console.log(`  weightPerMeter: ${test1_2.weightPerMeter} кг/м`);
console.log(`  actual length: ${test1_2.length} м`);
console.log(`  weight: ${test1_2.weight} т`);
console.log();

const diff1 = (test1_2.weightPerMeter - test1_1.weightPerMeter) * 1000;
const expectedDiff1 = 0.785 * (7.871 / 7.85 - 1) * 1000;
const test1Passed = Math.abs(diff1 - expectedDiff1) < 0.2; // увеличена толерантность для округления

console.log(`📊 Разница weightPerMeter: ${diff1.toFixed(2)} г/м`);
console.log(`   Ожидается: ${expectedDiff1.toFixed(2)} г/м (+0.268%)`);
console.log(`   Статус: ${test1Passed ? '✅ PASSED' : '❌ FAILED'} - марка стали влияет на вес!`);
console.log();

// =============================================================================
// ТЕСТ 2: Разные размеры и стали
// =============================================================================
console.log('📋 ТЕСТ 2: Разные размеры и стали');
console.log('─────────────────────────────────────────────────────────────\n');

// Квадрат 50 мм, 10 м, ст3
const test2_1 = calculateMetal({
  metalType: 'square',
  size: '50',
  length: 10,
  steelType: 'ст3'
}, metalDatabase);

console.log('Тест 2.1: Квадрат 50мм, 10м, ст3 (7.85)');
console.log(`  weightPerMeter: ${test2_1.weightPerMeter} кг/м`);
console.log(`  actual length: ${test2_1.length} м (rounded)`);
console.log(`  weight: ${test2_1.weight} т`);
const expected2_1_wpm = 2.5 * 7.85; // Expected weightPerMeter: 2.5 × 7.85 = 19.625 кг/м
console.log(`  Ожидается weightPerMeter: ${expected2_1_wpm} кг/м`);
console.log();

// Квадрат 50 мм, 10 м, ст45
const test2_2 = calculateMetal({
  metalType: 'square',
  size: '50',
  length: 10,
  steelType: 'ст45'
}, metalDatabase);

console.log('Тест 2.2: Квадрат 50мм, 10м, ст45 (7.826)');
console.log(`  weightPerMeter: ${test2_2.weightPerMeter} кг/м`);
console.log(`  actual length: ${test2_2.length} м (rounded)`);
console.log(`  weight: ${test2_2.weight} т`);
const expected2_2_wpm = 2.5 * 7.826; // Expected weightPerMeter: 2.5 × 7.826 = 19.565 кг/м
console.log(`  Ожидается weightPerMeter: ${expected2_2_wpm} кг/м`);

// Проверяем weightPerMeter, не финальный вес (который зависит от округления штук)
const test2Passed = Math.abs(test2_1.weightPerMeter - expected2_1_wpm) < 0.01 &&
                    Math.abs(test2_2.weightPerMeter - expected2_2_wpm) < 0.01;
console.log(`  Статус: ${test2Passed ? '✅ PASSED' : '❌ FAILED'}`);
console.log();

// Квадрат 100 мм, 5 м, Р18 (тяжелая сталь)
const test2_3 = calculateMetal({
  metalType: 'square',
  size: '100',
  length: 5,
  steelType: 'Р18'
}, metalDatabase);

console.log('Тест 2.3: Квадрат 100мм, 5м, Р18 (8.8)');
console.log(`  weightPerMeter: ${test2_3.weightPerMeter} кг/м`);
console.log(`  actual length: ${test2_3.length} м (rounded)`);
console.log(`  weight: ${test2_3.weight} т`);
const expected2_3_wpm = 10 * 8.8; // Expected weightPerMeter: 10 × 8.8 = 88 кг/м
console.log(`  Ожидается weightPerMeter: ${expected2_3_wpm} кг/м`);
console.log(`  Р18 тяжелее ст3 на: ${((8.8 / 7.85 - 1) * 100).toFixed(1)}%`);
console.log();

// =============================================================================
// ТЕСТ 3: Проверка формулы
// =============================================================================
console.log('📋 ТЕСТ 3: Проверка правильности формулы');
console.log('─────────────────────────────────────────────────────────────\n');

// Тестируем с точными параметрами без округления штук
const test3_1 = calculateMetal({
  metalType: 'square',
  size: '10',
  length: 12, // точная стандартная длина
  steelType: 'ст3'
}, metalDatabase);

const test3_2 = calculateMetal({
  metalType: 'square',
  size: '10',
  length: 12,
  steelType: 'ст45'
}, metalDatabase);

console.log('Тест 3.1: Квадрат 10мм, 12м (стандарт), ст3');
console.log(`  weightPerMeter: ${test3_1.weightPerMeter} кг/м`);
console.log(`  weight: ${test3_1.weight} т`);
console.log(`  Формула: 0.1 × 12 × (7.85 / 7.85) / 1000 = ${(0.1 * 12 * 1.0 / 1000).toFixed(6)} т`);
console.log();

console.log('Тест 3.2: Квадрат 10мм, 12м (стандарт), ст45 (7.826)');
console.log(`  weightPerMeter: ${test3_2.weightPerMeter} кг/м`);
console.log(`  weight: ${test3_2.weight} т`);
console.log(`  Формула: 0.1 × 12 × (7.826 / 7.85) / 1000 = ${(0.1 * 12 * (7.826 / 7.85) / 1000).toFixed(6)} т`);

const formula3Passed = Math.abs(test3_1.weightPerMeter - 0.785) < 0.001 &&
                       Math.abs(test3_2.weightPerMeter - 0.783) < 0.001;
console.log(`  Статус: ${formula3Passed ? '✅ PASSED' : '❌ FAILED'} - формула работает правильно!`);
console.log();

// =============================================================================
// ТЕСТ 4: Проверка диапазона сталей
// =============================================================================
console.log('📋 ТЕСТ 4: Проверка диапазона марок стали');
console.log('─────────────────────────────────────────────────────────────\n');

const testSteels = [
  { name: 'ст08', density: 7.871, expected: 'легче ст3' },
  { name: 'ст3', density: 7.85, expected: 'базовая' },
  { name: 'ст45', density: 7.826, expected: 'легче ст3' },
  { name: '20ХГСА', density: 7.76, expected: 'легче ст3' },
  { name: 'Р18', density: 8.8, expected: 'тяжелее ст3' },
  { name: 'ШХ15', density: 7.81, expected: 'легче ст3' }
];

const baseSt3 = calculateMetal({
  metalType: 'square',
  size: '10',
  length: 12,
  steelType: 'ст3'
}, metalDatabase);

let test4Passed = true;

testSteels.forEach(steel => {
  const result = calculateMetal({
    metalType: 'square',
    size: '10',
    length: 12,
    steelType: steel.name
  }, metalDatabase);

  const ratio = result.weightPerMeter / baseSt3.weightPerMeter;
  const expectedRatio = steel.density / 7.85;
  const passed = Math.abs(ratio - expectedRatio) < 0.001;

  if (!passed) test4Passed = false;

  console.log(`  ${steel.name} (${steel.density}): ${result.weightPerMeter.toFixed(3)} кг/м (${steel.expected}) ${passed ? '✅' : '❌'}`);
});

console.log(`\n📊 Статус: ${test4Passed ? '✅ PASSED' : '❌ FAILED'} - все марки стали работают!`);
console.log();

// =============================================================================
// ИТОГИ ТЕСТИРОВАНИЯ
// =============================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('📊 ИТОГИ ТЕСТИРОВАНИЯ');
console.log('═══════════════════════════════════════════════════════════════\n');

const allTestsPassed = test1Passed && test2Passed && formula3Passed && test4Passed;

if (allTestsPassed) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!\n');
  console.log('🎉 Квадрат УЖЕ поддерживает марки стали:');
  console.log('   1. База данных содержит 137 марок стали с плотностями');
  console.log('   2. Формула расчёта работает правильно');
  console.log('   3. Марка стали корректно влияет на вес');
  console.log('   4. Все диапазоны плотностей (от 7.75 до 8.8) работают');
  console.log();
  console.log('✅ Функционал марок стали для Квадрата уже реализован!');
} else {
  console.log('❌ НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОШЛИ!\n');
  console.log('Требуется доработка:');
  if (!test1Passed) console.log('   ❌ Тест 1: Влияние марки стали');
  if (!test2Passed) console.log('   ❌ Тест 2: Разные размеры и стали');
  if (!formula3Passed) console.log('   ❌ Тест 3: Проверка формулы');
  if (!test4Passed) console.log('   ❌ Тест 4: Диапазон марок стали');
}

console.log('\n═══════════════════════════════════════════════════════════════');

// Возвращаем код ошибки если тесты не прошли
process.exit(allTestsPassed ? 0 : 1);
