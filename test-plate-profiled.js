// Тестирование плиты и профнастила
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ ПЛИТЫ И ПРОФНАСТИЛА\n');
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
      const tolerance = Math.max(0.5, expectedWeightPerMeter * 0.01); // 1% tolerance or 0.5kg minimum
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

// ГРУППА 1: ПЛИТА
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: ПЛИТА');
console.log('─'.repeat(60));

// Тест 1: Плита 1500×50, 6м
// Ширина: 1500мм = 1.5м
// Толщина: 50мм
// Длина: 6м
// Площадь: 1.5 × 6 = 9 м²
// Объем: 9 × 0.05 = 0.45 м³
// Вес: 0.45 × 7850 = 3532.5 кг
// Вес 1м: 3532.5 / 6 = 588.75 кг/м
runTest('Тест 1.1: Плита 1500×50мм, 6м',
  'plate', [1500, 50], 6, 588.75);

// Тест 2: Плита 2000×100, 6м
// Ширина: 2000мм = 2м
// Толщина: 100мм
// Длина: 6м
// Площадь: 2 × 6 = 12 м²
// Объем: 12 × 0.1 = 1.2 м³
// Вес: 1.2 × 7850 = 9420 кг
// Вес 1м: 9420 / 6 = 1570 кг/м
runTest('Тест 1.2: Плита 2000×100мм, 6м',
  'plate', [2000, 100], 6, 1570);

runTest('Тест 1.3: Плита 1500×36мм, 12м',
  'plate', [1500, 36], 12);

runTest('Тест 1.4: Плита 2000×80мм, 6м',
  'plate', [2000, 80], 6);

// ГРУППА 2: ПРОФНАСТИЛ ОКРАШЕННЫЙ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: ПРОФНАСТИЛ ОКРАШЕННЫЙ');
console.log('─'.repeat(60));

// Тест 3: Профнастил 1000×0.5, 6м
// Ширина: 1000мм = 1м
// Толщина: 0.5мм
// Длина: 6м
// Площадь: 1 × 6 = 6 м²
// Объем: 6 × 0.0005 = 0.003 м³
// Вес: 0.003 × 7850 = 23.55 кг
// Вес 1м: 23.55 / 6 = 3.925 кг/м
runTest('Тест 2.1: Профнастил окраш. 1000×0.5мм, 6м',
  'profiled_painted', [1000, 0.5], 6, 3.925);

// Тест 4: Профнастил 1150×0.7, 12м
// Ширина: 1150мм = 1.15м
// Толщина: 0.7мм
// Длина: 12м
// Площадь: 1.15 × 12 = 13.8 м²
// Объем: 13.8 × 0.0007 = 0.00966 м³
// Вес: 0.00966 × 7850 = 75.831 кг
// Вес 1м: 75.831 / 12 = 6.319 кг/м
runTest('Тест 2.2: Профнастил окраш. 1150×0.7мм, 12м',
  'profiled_painted', [1150, 0.7], 12, 6.319);

runTest('Тест 2.3: Профнастил окраш. 1000×0.4мм, 6м',
  'profiled_painted', [1000, 0.4], 6);

runTest('Тест 2.4: Профнастил окраш. 1150×0.8мм, 6м',
  'profiled_painted', [1150, 0.8], 6);

// ГРУППА 3: ПРОФНАСТИЛ ОЦИНКОВАННЫЙ
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 3: ПРОФНАСТИЛ ОЦИНКОВАННЫЙ');
console.log('─'.repeat(60));

runTest('Тест 3.1: Профнастил оц. 1000×0.5мм, 6м',
  'profiled_galv', [1000, 0.5], 6, 3.925);

runTest('Тест 3.2: Профнастил оц. 1150×0.6мм, 12м',
  'profiled_galv', [1150, 0.6], 12);

runTest('Тест 3.3: Профнастил оц. 1000×0.45мм, 6м',
  'profiled_galv', [1000, 0.45], 6);

runTest('Тест 3.4: Профнастил оц. 1150×0.7мм, 12м',
  'profiled_galv', [1150, 0.7], 12);

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
console.log('📦 СТАТУС ВСЕХ ТИПОВ В БД');
console.log('═'.repeat(60));

const types = ['plate', 'profiled_painted', 'profiled_galv'];

types.forEach(key => {
  const m = metalDatabase.metals[key];
  if (m) {
    const sizesCount = m.sizes ? m.sizes.length : 0;
    console.log(`   ✅ ${key.padEnd(20)} → ${m.name} (${sizesCount} размеров)`);
  } else {
    console.log(`   ❌ ${key.padEnd(20)} → НЕ НАЙДЕН`);
  }
});

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВСЕ ПЛИТЫ И ПРОФНАСТИЛ РАБОТАЮТ!');
  console.log('═'.repeat(60));
  console.log('\n✅ Что готово:');
  console.log('   • Плита: 30 размеров (1500мм и 2000мм, толщина 36-200мм)');
  console.log('   • Профнастил окраш.: 14 размеров (1000мм и 1150мм, толщина 0.4-0.8мм)');
  console.log('   • Профнастил оц.: 14 размеров (1000мм и 1150мм, толщина 0.4-0.8мм)');
  console.log('   • Формула расчёта: ширина × длина × толщина × ρ');
  console.log('   • Все 3 типа протестированы');
  console.log('\n📝 РАЗМЕРЫ ДОБАВЛЕНЫ В БД');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
