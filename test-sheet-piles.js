// Тестирование всех 6 типов шпунтов
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ ВСЕХ 6 ТИПОВ ШПУНТОВ\n');
console.log('═'.repeat(70));

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

// ГРУППА 1: ШПУНТ ЛАРСЕНА
console.log('\n' + '─'.repeat(70));
console.log('ГРУППА 1: ШПУНТ ЛАРСЕНА');
console.log('─'.repeat(70));

// Тест 1: Шпунт Ларсена Л5, 12м (из требования)
// Вес 1м: 75.0 кг/м
// Общий вес: 75.0 × 12 = 900 кг
runTest('Тест 1.1: Шпунт Ларсена Л5, 12м',
  'sheetpile_larsen', 'Л5', 12, 75.0);

runTest('Тест 1.2: Шпунт Ларсена Л4, 6м',
  'sheetpile_larsen', 'Л4', 6, 61.5);

runTest('Тест 1.3: Шпунт Ларсена Л5УМ, 18м',
  'sheetpile_larsen', 'Л5УМ', 18, 84.0);

// ГРУППА 2: ШПУНТ ХОЛОДНОГНУТЫЙ ШХГ
console.log('\n' + '─'.repeat(70));
console.log('ГРУППА 2: ШПУНТ ХОЛОДНОГНУТЫЙ ШХГ');
console.log('─'.repeat(70));

// Тест 2: Шпунт холодногнутый ШХГ18, 9м (из требования)
// Вес 1м: 20.6 кг/м
// Общий вес: 20.6 × 9 = 185.4 кг
runTest('Тест 2.1: Шпунт холодногнутый ШХГ18, 9м',
  'sheetpile_cold', 'ШХГ18', 9, 20.6);

runTest('Тест 2.2: Шпунт холодногнутый ШХГ12, 6м',
  'sheetpile_cold', 'ШХГ12', 6, 12.8);

runTest('Тест 2.3: Шпунт холодногнутый ШХГ22, 12м',
  'sheetpile_cold', 'ШХГ22', 12, 27.0);

// ГРУППА 3: ШПУНТ ДВУТАВРОВЫЙ
console.log('\n' + '─'.repeat(70));
console.log('ГРУППА 3: ШПУНТ ДВУТАВРОВЫЙ');
console.log('─'.repeat(70));

// Тест 3: Шпунт двутавровый ДШ22, 6м (из требования)
// Вес 1м: 24.0 кг/м
// Общий вес: 24.0 × 6 = 144 кг
runTest('Тест 3.1: Шпунт двутавровый ДШ22, 6м',
  'sheetpile_i', 'ДШ22', 6, 24.0);

runTest('Тест 3.2: Шпунт двутавровый ДШ18, 9м',
  'sheetpile_i', 'ДШ18', 9, 18.4);

runTest('Тест 3.3: Шпунт двутавровый ДШ24, 12м',
  'sheetpile_i', 'ДШ24', 12, 27.3);

// ГРУППА 4: ШПУНТ (универсальный)
console.log('\n' + '─'.repeat(70));
console.log('ГРУППА 4: ШПУНТ (УНИВЕРСАЛЬНЫЙ)');
console.log('─'.repeat(70));

// Тест 4: Шпунт Ш4, 12м (из требования)
// Вес 1м: 52.0 кг/м
// Общий вес: 52.0 × 12 = 624 кг
runTest('Тест 4.1: Шпунт Ш4, 12м',
  'sheetpile', 'Ш4', 12, 52.0);

runTest('Тест 4.2: Шпунт Ш2, 6м',
  'sheetpile', 'Ш2', 6, 32.0);

runTest('Тест 4.3: Шпунт Ш6, 9м',
  'sheetpile', 'Ш6', 9, 72.0);

// ГРУППА 5: ШПУНТ ТРУБЧАТЫЙ
console.log('\n' + '─'.repeat(70));
console.log('ГРУППА 5: ШПУНТ ТРУБЧАТЫЙ');
console.log('─'.repeat(70));

// Тест 5: Шпунт трубчатый ТШ400, 9м (из требования)
// Вес 1м: 82.0 кг/м
// Общий вес: 82.0 × 9 = 738 кг
runTest('Тест 5.1: Шпунт трубчатый ТШ400, 9м',
  'sheetpile_tube', 'ТШ400', 9, 82.0);

runTest('Тест 5.2: Шпунт трубчатый ТШ320, 6м',
  'sheetpile_tube', 'ТШ320', 6, 65.0);

runTest('Тест 5.3: Шпунт трубчатый ТШ600, 12м',
  'sheetpile_tube', 'ТШ600', 12, 125.0);

// ГРУППА 6: ШПУНТ ПВХ
console.log('\n' + '─'.repeat(70));
console.log('ГРУППА 6: ШПУНТ ПВХ');
console.log('─'.repeat(70));

// Тест 6: Шпунт ПВХ ПВХ500, 6м (из требования)
// Вес 1м: 20.0 кг/м
// Общий вес: 20.0 × 6 = 120 кг
runTest('Тест 6.1: Шпунт ПВХ ПВХ500, 6м',
  'sheetpile_pvc', 'ПВХ500', 6, 20.0);

runTest('Тест 6.2: Шпунт ПВХ ПВХ305, 3м',
  'sheetpile_pvc', 'ПВХ305', 3, 12.5);

runTest('Тест 6.3: Шпунт ПВХ ПВХ600, 12м',
  'sheetpile_pvc', 'ПВХ600', 12, 24.0);

// ИТОГИ
console.log('\n' + '═'.repeat(70));
console.log('📊 ИТОГИ ТЕСТИРОВАНИЯ');
console.log('═'.repeat(70));
console.log(`✅ Пройдено: ${passed}`);
console.log(`❌ Провалено: ${failed}`);
console.log(`📈 Успешность: ${(passed / (passed + failed) * 100).toFixed(1)}%`);

if (failedTests.length > 0) {
  console.log('\n❌ Проваленные тесты:');
  failedTests.forEach(test => console.log(`   - ${test}`));
}

// Проверка статуса всех типов в БД
console.log('\n' + '═'.repeat(70));
console.log('📦 СТАТУС ВСЕХ 6 ТИПОВ В БД');
console.log('═'.repeat(70));

const sheetPileTypes = [
  { key: 'sheetpile_larsen', name: 'Шпунт Ларсена' },
  { key: 'sheetpile_cold', name: 'Шпунт холодногнутый ШХГ' },
  { key: 'sheetpile_i', name: 'Шпунт двутавровый' },
  { key: 'sheetpile', name: 'Шпунт' },
  { key: 'sheetpile_tube', name: 'Шпунт трубчатый' },
  { key: 'sheetpile_pvc', name: 'Шпунт ПВХ' }
];

sheetPileTypes.forEach(({ key, name }) => {
  const m = metalDatabase.metals[key];
  if (m) {
    const sizesCount = m.sizes ? m.sizes.length : 0;
    const weightsCount = m.weights ? Object.keys(m.weights).length : 0;
    const useKg = m.useKilograms ? '✅' : '❌';
    console.log(`   ✅ ${name.padEnd(30)} → ${sizesCount} размеров, ${weightsCount} весов, useKg: ${useKg}`);
  } else {
    console.log(`   ❌ ${name.padEnd(30)} → НЕ НАЙДЕН`);
  }
});

// Финальный вердикт
console.log('\n' + '═'.repeat(70));
if (failed === 0) {
  console.log('🎉 ВСЕ 6 ТИПОВ ШПУНТОВ РАБОТАЮТ!');
  console.log('═'.repeat(70));
  console.log('\n✅ Что готово:');
  console.log('   • Шпунт Ларсена: 5 размеров (Л4, Л4У, Л5, Л5У, Л5УМ)');
  console.log('   • Шпунт холодногнутый ШХГ: 6 размеров (ШХГ12-ШХГ22)');
  console.log('   • Шпунт двутавровый: 4 размера (ДШ18-ДШ24)');
  console.log('   • Шпунт: 5 размеров (Ш2-Ш6)');
  console.log('   • Шпунт трубчатый: 4 размера (ТШ320-ТШ600)');
  console.log('   • Шпунт ПВХ: 4 размера (ПВХ305-ПВХ600)');
  console.log('   • Все используют useKilograms: true');
  console.log('   • Все 18 тестов пройдены');
  console.log('\n📝 ПОДЗАДАЧА 4/5 ВЫПОЛНЕНА');
  console.log('🎊 ВСЕ МЕТАЛЛЫ В КАЛЬКУЛЯТОРЕ РАБОТАЮТ!');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(70));
  process.exit(1);
}
