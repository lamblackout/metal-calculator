// Тестирование рельсов и полособульба
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ РЕЛЬСОВ И ПОЛОСОБУЛЬБА\n');
console.log('═'.repeat(60));

let passed = 0;
let failed = 0;
const failedTests = [];

// Функция для запуска теста
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
    const weightPerMeter = result.weightPerMeter.toFixed(2);

    console.log(`   Размер: ${size}`);
    console.log(`   Длина: ${length} м`);
    console.log(`   Вес 1м: ${weightPerMeter} кг/м`);
    console.log(`   Общий вес: ${weightKg} кг`);

    // Проверка ожидаемого веса, если указан
    if (expectedWeightPerMeter !== undefined) {
      const tolerance = Math.max(0.1, expectedWeightPerMeter * 0.01); // 1% tolerance
      const match = Math.abs(result.weightPerMeter - expectedWeightPerMeter) < tolerance;
      if (match) {
        console.log(`   ✅ ПРОЙДЕН (ожидалось: ${expectedWeightPerMeter} кг/м)`);
        passed++;
      } else {
        console.log(`   ❌ ПРОВАЛЕН: ожидалось ${expectedWeightPerMeter} кг/м, получено ${weightPerMeter} кг/м`);
        failed++;
        failedTests.push(name);
      }
    } else {
      // Проверка что вес больше нуля
      if (result.weight > 0 && result.weightPerMeter > 0) {
        console.log(`   ✅ ПРОЙДЕН`);
        passed++;
      } else {
        console.log(`   ❌ ПРОВАЛЕН: вес = 0`);
        failed++;
        failedTests.push(name);
      }
    }

  } catch (error) {
    console.log(`   ❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
    failed++;
    failedTests.push(name);
  }
}

// ГРУППА 1: РЕЛЬСЫ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: РЕЛЬСЫ');
console.log('─'.repeat(60));

// Тест 1: Рельс Р18, 6м
// Вес 1м: 18.0 кг/м (из таблицы)
// Общий вес: 18.0 × 6 = 108 кг
runTest('Тест 1.1: Рельс Р18, 6м',
  'rail', 'Р18', 6, 18.0);

// Тест 2: Рельс Р24, 12м (из требования)
// Вес 1м: 24.0 кг/м (из таблицы)
// Общий вес: 24.0 × 12 = 288 кг
runTest('Тест 1.2: Рельс Р24, 12м',
  'rail', 'Р24', 12, 24.0);

// Тест 3: Рельс Р43, 6м
// Вес 1м: 43.5 кг/м (из таблицы)
// Общий вес: 43.5 × 6 = 261 кг
runTest('Тест 1.3: Рельс Р43, 6м',
  'rail', 'Р43', 6, 43.5);

// Тест 4: Рельс Р50, 6м (из требования)
// Вес 1м: 51.7 кг/м (из таблицы)
// Общий вес: 51.7 × 6 = 310.2 кг
runTest('Тест 1.4: Рельс Р50, 6м',
  'rail', 'Р50', 6, 51.7);

// Тест 5: Рельс Р65, 12м
// Вес 1м: 64.9 кг/м (из таблицы)
// Общий вес: 64.9 × 12 = 778.8 кг
runTest('Тест 1.5: Рельс Р65, 12м',
  'rail', 'Р65', 12, 64.9);

// Тест 6: Рельс Р75, 6м
// Вес 1м: 74.4 кг/м (из таблицы)
// Общий вес: 74.4 × 6 = 446.4 кг
runTest('Тест 1.6: Рельс Р75, 6м',
  'rail', 'Р75', 6, 74.4);

// ГРУППА 2: ПОЛОСОБУЛЬБ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: ПОЛОСОБУЛЬБ');
console.log('─'.repeat(60));

// Тест 7: Полособульб 100×8, 6м
// Вес 1м: 9.2 кг/м (из таблицы)
// Общий вес: 9.2 × 6 = 55.2 кг
runTest('Тест 2.1: Полособульб 100×8, 6м',
  'bulb_flat', '100×8', 6, 9.2);

// Тест 8: Полособульб 120×9, 12м (из требования)
// Вес 1м: 12.2 кг/м (из таблицы)
// Общий вес: 12.2 × 12 = 146.4 кг
runTest('Тест 2.2: Полособульб 120×9, 12м',
  'bulb_flat', '120×9', 12, 12.2);

// Тест 9: Полособульб 160×10, 6м
// Вес 1м: 17.8 кг/м (из таблицы)
// Общий вес: 17.8 × 6 = 106.8 кг
runTest('Тест 2.3: Полособульб 160×10, 6м',
  'bulb_flat', '160×10', 6, 17.8);

// Тест 10: Полособульб 200×11, 6м (из требования)
// Вес 1м: 23.8 кг/м (из таблицы)
// Общий вес: 23.8 × 6 = 142.8 кг
runTest('Тест 2.4: Полособульб 200×11, 6м',
  'bulb_flat', '200×11', 6, 23.8);

// Тест 11: Полособульб 260×13, 12м
// Вес 1м: 35.2 кг/м (из таблицы)
// Общий вес: 35.2 × 12 = 422.4 кг
runTest('Тест 2.5: Полособульб 260×13, 12м',
  'bulb_flat', '260×13', 12, 35.2);

// Тест 12: Полособульб 320×15, 6м
// Вес 1м: 48.8 кг/м (из таблицы)
// Общий вес: 48.8 × 6 = 292.8 кг
runTest('Тест 2.6: Полособульб 320×15, 6м',
  'bulb_flat', '320×15', 6, 48.8);

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

// Проверка статуса в БД
console.log('\n' + '═'.repeat(60));
console.log('📦 СТАТУС В БД');
console.log('═'.repeat(60));

const rail = metalDatabase.metals.rail;
const bulb = metalDatabase.metals.bulb_flat;

console.log('\n🚂 РЕЛЬСЫ:');
if (rail) {
  console.log(`   ✅ Найдено: ${rail.name}`);
  console.log(`   📏 Размеров: ${rail.sizes ? rail.sizes.length : 0}`);
  console.log(`   ⚖️  Весов: ${rail.weights ? Object.keys(rail.weights).length : 0}`);
  console.log(`   🔧 useKilograms: ${rail.useKilograms ? 'да' : 'нет'}`);
  console.log(`   📐 Formula: ${rail.formula}`);
} else {
  console.log('   ❌ НЕ НАЙДЕНО');
}

console.log('\n🔩 ПОЛОСОБУЛЬБ:');
if (bulb) {
  console.log(`   ✅ Найдено: ${bulb.name}`);
  console.log(`   📏 Размеров: ${bulb.sizes ? bulb.sizes.length : 0}`);
  console.log(`   ⚖️  Весов: ${bulb.weights ? Object.keys(bulb.weights).length : 0}`);
  console.log(`   🔧 useKilograms: ${bulb.useKilograms ? 'да' : 'нет'}`);
  console.log(`   📐 Formula: ${bulb.formula}`);
} else {
  console.log('   ❌ НЕ НАЙДЕНО');
}

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВСЕ РЕЛЬСЫ И ПОЛОСОБУЛЬБ РАБОТАЮТ!');
  console.log('═'.repeat(60));
  console.log('\n✅ Что готово:');
  console.log('   • Рельсы: 8 размеров (Р18-Р75), веса в кг/м из таблицы');
  console.log('   • Полособульб: 12 размеров (100×8 до 320×15), веса в кг/м');
  console.log('   • Оба типа используют useKilograms: true');
  console.log('   • Все 12 тестов пройдены');
  console.log('\n📝 ПОДЗАДАЧА 3/5 ВЫПОЛНЕНА');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
