// Комплексное тестирование канатов и проволоки
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ КАНАТОВ И ПРОВОЛОКИ\n');
console.log('═'.repeat(60));

let passed = 0;
let failed = 0;
const failedTests = [];

function runTest(name, metalType, size, length, expectedWeightPerMeter) {
  console.log(`\n📝 ${name}`);

  try {
    const result = calculateMetal({
      metalType: metalType,
      size: size,
      length: length
    }, metalDatabase);

    if (!result.success) {
      console.log(`   ❌ ОШИБКА: ${result.error}`);
      failed++;
      failedTests.push(name);
      return;
    }

    const weightKg = (result.weight * 1000).toFixed(2);
    const weightPerMeter = result.weightPerMeter.toFixed(3);

    console.log(`   Размер: ${size} мм`);
    console.log(`   Длина: ${length} м`);
    console.log(`   Вес 1м: ${weightPerMeter} кг/м`);
    console.log(`   Общий вес: ${weightKg} кг`);

    if (expectedWeightPerMeter !== undefined) {
      const match = Math.abs(result.weightPerMeter - expectedWeightPerMeter) < 0.01;
      if (match) {
        console.log(`   ✅ ПРОЙДЕН`);
        passed++;
      } else {
        console.log(`   ❌ ПРОВАЛЕН: ожидалось ${expectedWeightPerMeter} кг/м`);
        failed++;
        failedTests.push(name);
      }
    } else {
      console.log(`   ✅ ПРОЙДЕН`);
      passed++;
    }

  } catch (error) {
    console.log(`   ❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
    failed++;
    failedTests.push(name);
  }
}

// ТЕСТ КАНАТОВ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: КАНАТЫ');
console.log('─'.repeat(60));

runTest('Тест 1.1: Канат обычный 10мм, 100м',
  'rope', 10, 100, 0.519);

runTest('Тест 1.2: Канат обычный 15мм, 100м',
  'rope', 15, 100, 1.17);

runTest('Тест 1.3: Канат обычный 20мм, 100м',
  'rope', 20, 100, 2.08);

// КАНАТ АРМАТУРНЫЙ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: КАНАТ АРМАТУРНЫЙ');
console.log('─'.repeat(60));

runTest('Тест 2.1: Канат арматурный 10мм, 100м',
  'rope_armature', 10, 100, 0.533);

runTest('Тест 2.2: Канат арматурный 12мм, 100м',
  'rope_armature', 12, 100, 0.685);

runTest('Тест 2.3: Канат арматурный 15мм, 100м',
  'rope_armature', 15, 100, 1.2);

// КАНАТ ОЦИНКОВАННЫЙ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 3: КАНАТ ОЦИНКОВАННЫЙ');
console.log('─'.repeat(60));

runTest('Тест 3.1: Канат оцинк. 10мм, 100м',
  'rope_galv', 10, 100, 0.519);

runTest('Тест 3.2: Канат оцинк. 15мм, 100м',
  'rope_galv', 15, 100, 1.17);

runTest('Тест 3.3: Канат оцинк. 20мм, 100м',
  'rope_galv', 20, 100, 2.08);

// ПРОВОЛОКА
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 4: ПРОВОЛОКА');
console.log('─'.repeat(60));

runTest('Тест 4.1: Проволока 5мм, 100м',
  'wire', 5, 100);

runTest('Тест 4.2: Проволока 8мм, 100м',
  'wire', 8, 100);

runTest('Тест 4.3: Проволока 10мм, 100м',
  'wire', 10, 100);

// ПРОВОЛОКА ОЦИНКОВАННАЯ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 5: ПРОВОЛОКА ОЦИНКОВАННАЯ');
console.log('─'.repeat(60));

runTest('Тест 5.1: Проволока оцинк. 5мм, 100м',
  'wire_galv', 5, 100);

runTest('Тест 5.2: Проволока оцинк. 8мм, 100м',
  'wire_galv', 8, 100);

runTest('Тест 5.3: Проволока оцинк. 10мм, 100м',
  'wire_galv', 10, 100);

// ИТОГИ
console.log('\n' + '═'.repeat(60));
console.log('📊 ИТОГИ ТЕСТИРОВАНИЯ');
console.log('═'.repeat(60));
console.log(`✅ Пройдено: ${passed}`);
console.log(`❌ Провалено: ${failed}`);
console.log(`📈 Успешность: ${(passed / (passed + failed) * 100).toFixed(1)}%`);

if (failedTests.length > 0) {
  console.log('\n❌ Проваленные тесты:');
  failedTests.forEach(test => console.log(`   - ${test}`));
}

// Проверка статуса
console.log('\n' + '═'.repeat(60));
console.log('📦 СТАТУС КАНАТОВ И ПРОВОЛОКИ');
console.log('═'.repeat(60));

const metals = [
  { key: 'rope', name: 'Канат обычный' },
  { key: 'rope_armature', name: 'Канат арматурный' },
  { key: 'rope_galv', name: 'Канат оцинк.' },
  { key: 'wire', name: 'Проволока' },
  { key: 'wire_galv', name: 'Проволока оцинк.' }
];

metals.forEach(m => {
  const metal = metalDatabase.metals[m.key];
  if (!metal) {
    console.log(`❌ ${m.name}: НЕ НАЙДЕН В БД`);
    return;
  }

  const sizesCount = metal.sizes ? metal.sizes.length :
    metal.weights ? Object.keys(metal.weights).length : 0;

  const formula = metal.formula;
  const useKg = metal.useKilograms ? 'useKilograms: ✅' : '';

  console.log(`✅ ${m.name}: ${sizesCount} размеров, formula: ${formula} ${useKg}`);
});

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! КАНАТЫ И ПРОВОЛОКА РАБОТАЮТ!');
  console.log('═'.repeat(60));
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
