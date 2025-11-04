// Тестирование листов и полос
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ ЛИСТОВ И ПОЛОС\n');
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

// ГРУППА 1: ЛИСТЫ (7 типов)
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: ЛИСТЫ (7 типов)');
console.log('─'.repeat(60));

// Формула для листа: Вес 1м² = ширина_м × 1м × толщина_мм × ρ / 1000
// Для ширины 1000мм (1м) и толщины 1мм: 1 × 1 × 1 × 7850 / 1000 = 7.85 кг/м²
// Но наши листы имеют размер [ширина, толщина] и длину
// Для [1000, 1] и длины 1м: вес = 1 × 1 × 0.001 × 7850 = 7.85 кг/м (вес погонного метра)

runTest('Тест 1.1: Лист г/к 1000×1мм, 1м',
  'sheet_hot', [1000, 1], 1, 7.85);

runTest('Тест 1.2: Лист х/к 1000×2мм, 1м',
  'sheet_cold', [1000, 2], 1, 15.7);

runTest('Тест 1.3: Лист окраш. 1250×1.5мм, 1м',
  'sheet_painted', [1250, 1.5], 1, 14.72);

runTest('Тест 1.4: Лист оцинк. 1000×0.5мм, 1м',
  'sheet_galv', [1000, 0.5], 1, 3.925);

runTest('Тест 1.5: Лист ПВ 1000×3мм, 1м',
  'sheet_pv', [1000, 3], 1, 23.55);

runTest('Тест 1.6: Лист ПВ оцинк. 1250×2мм, 1м',
  'sheet_pv_galv', [1250, 2], 1, 19.625);

runTest('Тест 1.7: Лист рифленый 1000×4мм, 1м',
  'sheet_checkered', [1000, 4], 1, 31.4);

// ГРУППА 2: ПОЛОСЫ (5 типов)
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: ПОЛОСЫ (5 типов)');
console.log('─'.repeat(60));

// Формула для полосы: Вес 1м = ширина_мм × толщина_мм × ρ / 1000000
// Для ширины 100мм и толщины 10мм: 100 × 10 × 7850 / 1000000 = 7.85 кг/м

runTest('Тест 2.1: Полоса 100×10мм, 1м',
  'strip', [100, 10], 1, 7.85);

runTest('Тест 2.2: Полоса оцинк. 50×5мм, 1м',
  'strip_galv', [50, 5], 1, 1.9625);

runTest('Тест 2.3: Лента/штрипс 40×4мм, 1м',
  'strip_tape', [40, 4], 1, 1.256);

runTest('Тест 2.4: Лента/штрипс окраш. 60×3мм, 1м',
  'strip_tape_painted', [60, 3], 1, 1.413);

runTest('Тест 2.5: Лента/штрипс оц. 80×2мм, 1м',
  'strip_tape_galv', [80, 2], 1, 1.256);

// Тест с реальной длиной
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 3: ТЕСТЫ С РЕАЛЬНОЙ ДЛИНОЙ');
console.log('─'.repeat(60));

runTest('Тест 3.1: Лист г/к 1000×1мм, 12м',
  'sheet_hot', [1000, 1], 12, 7.85);

runTest('Тест 3.2: Полоса 100×10мм, 6м',
  'strip', [100, 10], 6, 7.85);

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

// Проверка статуса всех листов и полос в БД
console.log('\n' + '═'.repeat(60));
console.log('📦 СТАТУС ВСЕХ ЛИСТОВ И ПОЛОС В БД');
console.log('═'.repeat(60));

const sheetTypes = ['sheet_hot', 'sheet_cold', 'sheet_painted', 'sheet_galv', 'sheet_pv', 'sheet_pv_galv', 'sheet_checkered'];
const stripTypes = ['strip', 'strip_galv', 'strip_tape', 'strip_tape_painted', 'strip_tape_galv'];

console.log('\n📄 ЛИСТЫ (formula: sheet):');
sheetTypes.forEach(key => {
  const m = metalDatabase.metals[key];
  if (m) {
    console.log(`   ✅ ${key.padEnd(20)} → ${m.name}`);
  } else {
    console.log(`   ❌ ${key.padEnd(20)} → НЕ НАЙДЕН`);
  }
});

console.log('\n📏 ПОЛОСЫ (formula: strip):');
stripTypes.forEach(key => {
  const m = metalDatabase.metals[key];
  if (m) {
    console.log(`   ✅ ${key.padEnd(20)} → ${m.name}`);
  } else {
    console.log(`   ❌ ${key.padEnd(20)} → НЕ НАЙДЕН`);
  }
});

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВСЕ ЛИСТЫ И ПОЛОСЫ РАБОТАЮТ!');
  console.log('═'.repeat(60));
  console.log('\n✅ Что готово:');
  console.log('   • 7 типов листов (г/к, х/к, окраш., оцинк., ПВ, ПВ оцинк., рифл.)');
  console.log('   • Формула расчёта: ширина × толщина × длина × ρ / 1000000');
  console.log('   • 5 типов полос и лент (обычные, оцинк., штрипсы)');
  console.log('   • Формула расчёта: ширина × толщина × ρ / 1000000');
  console.log('   • Все 12 типов протестированы');
  console.log('\n📝 Следующий шаг: Обновить UI для листов и полос');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
