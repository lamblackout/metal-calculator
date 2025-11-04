// Комплексное тестирование уголков и швеллеров
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ УГОЛКОВ И ШВЕЛЛЕРОВ\n');
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
    const weightPerMeter = result.weightPerMeter.toFixed(3);

    console.log(`   Размер: ${Array.isArray(size) ? size.join('×') : size} мм`);
    console.log(`   Длина: ${length} м`);
    console.log(`   Вес 1м: ${weightPerMeter} кг/м`);
    console.log(`   Общий вес: ${weightKg} кг`);

    // Проверка ожидаемого веса, если указан
    if (expectedWeightPerMeter !== undefined) {
      const match = Math.abs(result.weightPerMeter - expectedWeightPerMeter) < 0.1;
      if (match) {
        console.log(`   ✅ ПРОЙДЕН`);
        passed++;
      } else {
        console.log(`   ❌ ПРОВАЛЕН: ожидалось ${expectedWeightPerMeter} кг/м`);
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

// ГРУППА 1: УГОЛКИ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: УГОЛКИ (4 типа)');
console.log('─'.repeat(60));

runTest('Тест 1.1: Уголок 50×50×5, 6м (равнополочный)',
  'angle', [50, 50, 5], 6, 3.77);

runTest('Тест 1.2: Уголок 40×40×4, 6м (равнополочный)',
  'angle', [40, 40, 4], 6);

runTest('Тест 1.3: Уголок 20×20×3, 6м',
  'angle', [20, 20, 3], 6, 0.9);

runTest('Тест 1.4: Уголок гнутый 25×25×2, 6м',
  'angle_bent', [25, 25, 2], 6);

runTest('Тест 1.5: Уголок оцинк. 32×32×3, 6м',
  'angle_galv', [32, 32, 3], 6);

runTest('Тест 1.6: Уголок гнутый оцинк. 40×40×2, 6м',
  'angle_bent_galv', [40, 40, 2], 6);

// ГРУППА 2: ШВЕЛЛЕРЫ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: ШВЕЛЛЕРЫ (4 типа, табличные веса)');
console.log('─'.repeat(60));

runTest('Тест 2.1: Швеллер 10, 12м',
  'channel', 10, 12, 9.46);

runTest('Тест 2.2: Швеллер 12, 12м',
  'channel', 12, 12, 11.5);

runTest('Тест 2.3: Швеллер 16, 12м',
  'channel', 16, 12, 15.9);

runTest('Тест 2.4: Швеллер гнутый 10, 12м',
  'channel_bent', 10, 12, 9.46);

runTest('Тест 2.5: Швеллер оцинк. 12, 12м',
  'channel_galv', 12, 12, 11.5);

runTest('Тест 2.6: Швеллер гнутый оц. 10, 12м',
  'channel_bent_galv', 10, 12, 9.46);

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

// Проверка статуса всех уголков и швеллеров
console.log('\n' + '═'.repeat(60));
console.log('📦 СТАТУС ВСЕХ УГОЛКОВ И ШВЕЛЛЕРОВ В БД');
console.log('═'.repeat(60));

const angleTypes = ['angle', 'angle_bent', 'angle_galv', 'angle_bent_galv'];
const channelTypes = ['channel', 'channel_bent', 'channel_galv', 'channel_bent_galv'];

console.log('\n📐 УГОЛКИ (formula: angle):');
angleTypes.forEach(key => {
  const m = metalDatabase.metals[key];
  if (m) {
    console.log(`   ✅ ${key.padEnd(20)} → ${m.name} (${m.sizes.length} размеров)`);
  } else {
    console.log(`   ❌ ${key.padEnd(20)} → НЕ НАЙДЕН`);
  }
});

console.log('\n📊 ШВЕЛЛЕРЫ (formula: channel):');
channelTypes.forEach(key => {
  const m = metalDatabase.metals[key];
  if (m) {
    const weightsCount = m.weights ? Object.keys(m.weights).length : 0;
    console.log(`   ✅ ${key.padEnd(20)} → ${m.name} (${m.sizes.length} размеров, ${weightsCount} весов)`);
  } else {
    console.log(`   ❌ ${key.padEnd(20)} → НЕ НАЙДЕН`);
  }
});

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВСЕ УГОЛКИ И ШВЕЛЛЕРЫ РАБОТАЮТ!');
  console.log('═'.repeat(60));
  console.log('\n✅ Что готово:');
  console.log('   • 4 типа уголков (равнополочные и неравнополочные)');
  console.log('   • Формула расчёта: ρ × S × (A + B - S) / 1000000');
  console.log('   • 4 типа швеллеров (табличные веса из ГОСТ)');
  console.log('   • Все 8 типов протестированы');
  console.log('\n📝 Следующий шаг: Добавить UI для уголков');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
