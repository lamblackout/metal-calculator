// Тестирование крепежа (болты, гайки, шайбы)
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ КРЕПЕЖА\n');
console.log('═'.repeat(60));

let passed = 0;
let failed = 0;
const failedTests = [];

// Функция для запуска теста
function runTest(name, metalType, size, quantity, expectedWeightTotal) {
  console.log(`\n📝 ${name}`);

  try {
    const result = calculateMetal({
      metalType: metalType,
      size: size,
      length: quantity  // Для крепежа length = количество штук
    }, metalDatabase);

    if (!result.success) {
      console.log(`   ❌ ОШИБКА: ${result.error}`);
      failed++;
      failedTests.push(name);
      return;
    }

    const weightKg = (result.weight * 1000).toFixed(2);
    const weightPerPiece = (result.weightPerMeter * 1000).toFixed(4);

    console.log(`   Размер: ${size}`);
    console.log(`   Количество: ${quantity} шт`);
    console.log(`   Вес 1 шт: ${weightPerPiece} г`);
    console.log(`   Общий вес: ${weightKg} кг`);

    // Проверка ожидаемого веса, если указан
    if (expectedWeightTotal !== undefined) {
      const tolerance = Math.max(0.01, expectedWeightTotal * 0.01); // 1% tolerance or 0.01kg minimum
      const actualWeight = result.weight * 1000;
      const match = Math.abs(actualWeight - expectedWeightTotal) < tolerance;
      if (match) {
        console.log(`   ✅ ПРОЙДЕН (ожидалось: ${expectedWeightTotal} кг)`);
        passed++;
      } else {
        console.log(`   ❌ ПРОВАЛЕН: ожидалось ${expectedWeightTotal} кг, получено ${weightKg} кг`);
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

// ГРУППА 1: БОЛТЫ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: БОЛТЫ');
console.log('─'.repeat(60));

// Тест 1: Болты М8, 1000 штук
// Вес 1000 шт: 3.2 кг (из таблицы)
// Ожидаемый вес: 3.2 кг
runTest('Тест 1.1: Болты М8, 1000 шт',
  'bolt', 'М8', 1000, 3.2);

// Тест 2: Болты М16, 500 штук
// Вес 1000 шт: 16.5 кг
// Вес 1 шт: 16.5 / 1000 = 0.0165 кг
// Ожидаемый вес: 0.0165 × 500 = 8.25 кг
runTest('Тест 1.2: Болты М16, 500 шт',
  'bolt', 'М16', 500, 8.25);

runTest('Тест 1.3: Болты М6, 2000 шт',
  'bolt', 'М6', 2000, 3.6);

runTest('Тест 1.4: Болты М24, 100 шт',
  'bolt', 'М24', 100, 4.35);

runTest('Тест 1.5: Болты М30, 250 шт',
  'bolt', 'М30', 250);

runTest('Тест 1.6: Болты М48, 50 шт',
  'bolt', 'М48', 50);

// ГРУППА 2: ГАЙКИ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: ГАЙКИ');
console.log('─'.repeat(60));

// Тест 3: Гайки М12, 2000 штук
// Вес 1000 шт: 2.85 кг
// Ожидаемый вес: 2.85 × 2 = 5.7 кг
runTest('Тест 2.1: Гайки М12, 2000 шт',
  'nut', 'М12', 2000, 5.7);

runTest('Тест 2.2: Гайки М8, 1000 шт',
  'nut', 'М8', 1000, 0.96);

runTest('Тест 2.3: Гайки М20, 500 шт',
  'nut', 'М20', 500);

runTest('Тест 2.4: Гайки М16, 1500 шт',
  'nut', 'М16', 1500);

runTest('Тест 2.5: Гайки М36, 100 шт',
  'nut', 'М36', 100);

// ГРУППА 3: ШАЙБЫ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 3: ШАЙБЫ');
console.log('─'.repeat(60));

// Тест 4: Шайбы М10, 5000 штук
// Вес 1000 шт: 0.62 кг
// Ожидаемый вес: 0.62 × 5 = 3.1 кг
runTest('Тест 3.1: Шайбы М10, 5000 шт',
  'washer', 'М10', 5000, 3.1);

runTest('Тест 3.2: Шайбы М6, 1000 шт',
  'washer', 'М6', 1000, 0.21);

runTest('Тест 3.3: Шайбы М16, 3000 шт',
  'washer', 'М16', 3000);

runTest('Тест 3.4: Шайбы М24, 500 шт',
  'washer', 'М24', 500);

runTest('Тест 3.5: Шайбы М30, 1000 шт',
  'washer', 'М30', 1000);

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
console.log('📦 СТАТУС ВСЕХ ТИПОВ КРЕПЕЖА В БД');
console.log('═'.repeat(60));

const types = ['bolt', 'nut', 'washer'];

types.forEach(key => {
  const m = metalDatabase.metals[key];
  if (m) {
    const sizesCount = m.sizes ? m.sizes.length : 0;
    const weightsCount = m.weights ? Object.keys(m.weights).length : 0;
    console.log(`   ✅ ${key.padEnd(10)} → ${m.name} (${sizesCount} размеров, ${weightsCount} весов)`);
  } else {
    console.log(`   ❌ ${key.padEnd(10)} → НЕ НАЙДЕН`);
  }
});

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВЕСЬ КРЕПЁЖ РАБОТАЕТ!');
  console.log('═'.repeat(60));
  console.log('\n✅ Что готово:');
  console.log('   • Болты: 15 размеров (М6-М48), формула metiz');
  console.log('   • Гайки: 15 размеров (М6-М48), формула metiz');
  console.log('   • Шайбы: 15 размеров (М6-М48), формула metiz');
  console.log('   • Веса на 1000 штук (perThousand: true)');
  console.log('   • Расчёт: вес_1000шт / 1000 × количество');
  console.log('   • Все 3 типа протестированы');
  console.log('\n📝 КРЕПЁЖ ДОБАВЛЕН В СИСТЕМУ');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
