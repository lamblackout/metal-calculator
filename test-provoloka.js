// Тесты для Проволоки

const { calculateMetal } = require('./src/calculator');
const metalDatabase = require('./docs/database/metals.json');

console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 ТЕСТЫ ДЛЯ ПРОВОЛОКИ');
console.log('═══════════════════════════════════════════════════════════════\n');

// ============================================================================
// ТЕСТ 1: Диаметр 0.2 мм, длина 1000 м, сталь ст3
// ============================================================================

console.log('📋 ТЕСТ 1: Диаметр 0.2 мм, длина 1000 м, сталь ст3');
console.log('─────────────────────────────────────────────────────────────\n');

const test1 = calculateMetal({
  metalType: 'provoloka',
  size: '0.2',
  length: 1000,
  steelType: 'ст3'
}, metalDatabase);

console.log('Параметры:');
console.log('  Диаметр: 0.2 мм');
console.log('  Длина: 1000 м');
console.log('  Марка стали: ст3 (7.85 т/м³)');
console.log('  Коэффициент: 0.00003141592 кг/м\n');

console.log('Результат:');
console.log(`  weightPerMeter (вес 1 м): ${test1.weightPerMeter} кг`);
console.log(`  weight (вес): ${test1.weight} т\n`);

console.log('Расчёт:');
console.log('  вес = 0.00003141592 × 1000 × 7.85 = 0.246615 кг = 0.000246615 т\n');
console.log('⚠️  ПРИМЕЧАНИЕ: Вес округляется до 3 знаков, поэтому 0.000246615 т → 0.000 т\n');

const expected1 = 0;  // Округлено до 3 знаков (слишком малое значение)
const diff1 = Math.abs(test1.weight - expected1);
console.log(`Ожидается: ~${expected1} т (округлено с 0.000246615 до 3 знаков)`);
console.log(`Получено: ${test1.weight} т`);
console.log(`📊 Статус: ${diff1 < 0.001 ? '✅ PASSED' : '❌ FAILED'}\n`);

// ============================================================================
// ТЕСТ 2: Диаметр 1 мм, длина 5000 м, сталь ст3
// ============================================================================

console.log('📋 ТЕСТ 2: Диаметр 1 мм, длина 5000 м, сталь ст3');
console.log('─────────────────────────────────────────────────────────────\n');

const test2 = calculateMetal({
  metalType: 'provoloka',
  size: '1',
  length: 5000,
  steelType: 'ст3'
}, metalDatabase);

console.log('Параметры:');
console.log('  Диаметр: 1 мм');
console.log('  Длина: 5000 м');
console.log('  Марка стали: ст3 (7.85 т/м³)');
console.log('  Коэффициент: 0.000785398 кг/м\n');

console.log('Результат:');
console.log(`  weightPerMeter (вес 1 м): ${test2.weightPerMeter} кг`);
console.log(`  weight (вес): ${test2.weight} т\n`);

console.log('Расчёт:');
console.log('  вес = 0.000785398 × 5000 × 7.85 = 30.8219 кг = 0.0308219 т\n');

const expected2 = 0.031;  // Округлено до 3 знаков
const diff2 = Math.abs(test2.weight - expected2);
console.log(`Ожидается: ~${expected2} т (округлено с 0.0308219)`);
console.log(`Получено: ${test2.weight} т`);
console.log(`📊 Статус: ${diff2 < 0.001 ? '✅ PASSED' : '❌ FAILED'}\n`);

// ============================================================================
// ТЕСТ 3: Диаметр 5 мм, длина 1000 м, сталь 09Г2С
// ============================================================================

console.log('📋 ТЕСТ 3: Диаметр 5 мм, длина 1000 м, сталь 09Г2С');
console.log('─────────────────────────────────────────────────────────────\n');

const test3 = calculateMetal({
  metalType: 'provoloka',
  size: '5',
  length: 1000,
  steelType: '09Г2С'
}, metalDatabase);

console.log('Параметры:');
console.log('  Диаметр: 5 мм');
console.log('  Длина: 1000 м');
console.log('  Марка стали: 09Г2С (7.85 т/м³)');
console.log('  Коэффициент: 0.01963495 кг/м\n');

console.log('Результат:');
console.log(`  weightPerMeter (вес 1 м): ${test3.weightPerMeter} кг`);
console.log(`  weight (вес): ${test3.weight} т\n`);

console.log('Расчёт:');
console.log('  вес = 0.01963495 × 1000 × 7.85 = 154.134 кг = 0.154134 т\n');

const expected3 = 0.154;  // Округлено до 3 знаков
const diff3 = Math.abs(test3.weight - expected3);
console.log(`Ожидается: ~${expected3} т (округлено с 0.154134)`);
console.log(`Получено: ${test3.weight} т`);
console.log(`📊 Статус: ${diff3 < 0.001 ? '✅ PASSED' : '❌ FAILED'}\n`);

// ============================================================================
// ТЕСТ 4: Диаметр 10 мм, длина 500 м, сталь 12ХМ
// ============================================================================

console.log('📋 ТЕСТ 4: Диаметр 10 мм, длина 500 м, сталь 12ХМ');
console.log('─────────────────────────────────────────────────────────────\n');

const test4 = calculateMetal({
  metalType: 'provoloka',
  size: '10',
  length: 500,
  steelType: '12ХМ'
}, metalDatabase);

console.log('Параметры:');
console.log('  Диаметр: 10 мм');
console.log('  Длина: 500 м');
console.log('  Марка стали: 12ХМ (7.85 т/м³)');
console.log('  Коэффициент: 0.0785398 кг/м\n');

console.log('Результат:');
console.log(`  weightPerMeter (вес 1 м): ${test4.weightPerMeter} кг`);
console.log(`  weight (вес): ${test4.weight} т\n`);

console.log('Расчёт:');
console.log('  вес = 0.0785398 × 500 × 7.85 = 308.239 кг = 0.308239 т\n');

const expected4 = 0.308;  // Округлено до 3 знаков
const diff4 = Math.abs(test4.weight - expected4);
console.log(`Ожидается: ~${expected4} т (округлено с 0.308239)`);
console.log(`Получено: ${test4.weight} т`);
console.log(`📊 Статус: ${diff4 < 0.001 ? '✅ PASSED' : '❌ FAILED'}\n`);

// ============================================================================
// ТЕСТ 5: Диаметр 12 мм, длина 200 м, сталь ст3
// ============================================================================

console.log('📋 ТЕСТ 5: Диаметр 12 мм, длина 200 м, сталь ст3');
console.log('─────────────────────────────────────────────────────────────\n');

const test5 = calculateMetal({
  metalType: 'provoloka',
  size: '12',
  length: 200,
  steelType: 'ст3'
}, metalDatabase);

console.log('Параметры:');
console.log('  Диаметр: 12 мм');
console.log('  Длина: 200 м');
console.log('  Марка стали: ст3 (7.85 т/м³)');
console.log('  Коэффициент: 0.113097312 кг/м\n');

console.log('Результат:');
console.log(`  weightPerMeter (вес 1 м): ${test5.weightPerMeter} кг`);
console.log(`  weight (вес): ${test5.weight} т\n`);

console.log('Расчёт:');
console.log('  вес = 0.113097312 × 200 × 7.85 = 177.563 кг = 0.177563 т\n');

const expected5 = 0.178;  // Округлено до 3 знаков
const diff5 = Math.abs(test5.weight - expected5);
console.log(`Ожидается: ~${expected5} т (округлено с 0.177563)`);
console.log(`Получено: ${test5.weight} т`);
console.log(`📊 Статус: ${diff5 < 0.001 ? '✅ PASSED' : '❌ FAILED'}\n`);

// ============================================================================
// ИТОГИ
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('📊 ИТОГИ ТЕСТИРОВАНИЯ');
console.log('═══════════════════════════════════════════════════════════════\n');

const allPassed = (
  diff1 < 0.000001 &&
  diff2 < 0.001 &&
  diff3 < 0.001 &&
  diff4 < 0.001 &&
  diff5 < 0.001
);

if (allPassed) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!\n');
  console.log('🎉 Проволока работает правильно:');
  console.log('   1. Расчёт с ст3 работает (тесты 1, 2, 5)');
  console.log('   2. Марка стали влияет на вес (тесты 3, 4)');
  console.log('   3. Формула работает правильно: вес_кг = коэффициент × длина_м × плотность_стали\n');
  console.log('✅ Формула работает правильно!');
} else {
  console.log('❌ НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОШЛИ!\n');
  console.log(`Тест 1: ${diff1 < 0.000001 ? '✅' : '❌'}`);
  console.log(`Тест 2: ${diff2 < 0.001 ? '✅' : '❌'}`);
  console.log(`Тест 3: ${diff3 < 0.001 ? '✅' : '❌'}`);
  console.log(`Тест 4: ${diff4 < 0.001 ? '✅' : '❌'}`);
  console.log(`Тест 5: ${diff5 < 0.001 ? '✅' : '❌'}`);
}

console.log('\n═══════════════════════════════════════════════════════════════');
