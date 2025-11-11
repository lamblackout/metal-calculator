// ИНТЕГРАЦИОННЫЙ ТЕСТ: Расчёт листов через калькулятор
// Проверяет что листы корректно интегрированы в calculateMetal()

const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('\n🧪 ИНТЕГРАЦИОННЫЙ ТЕСТ: Расчёт листов\n');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

// Найдём первый лист в БД
const sheetTypes = Object.entries(metalDatabase.metals)
  .filter(([key, metal]) => metal.category === 'Лист' && metal.formula === 'sheet')
  .slice(0, 3);

console.log(`\nНайдено типов листов: ${sheetTypes.length}`);
console.log('Будем тестировать первые 3 типа:\n');

sheetTypes.forEach(([key, metal]) => {
  console.log(`  - ${metal.name} (${key})`);
  console.log(`    Толщины: ${metal.thicknesses.slice(0, 5).join(', ')}${metal.thicknesses.length > 5 ? '...' : ''}`);
});

// ═══════════════════════════════════════════════════════════════════
// Тест 1: Лист холоднокатаный 1мм × 1м²
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(70));
console.log('📦 Тест 1: Лист холоднокатаный 1мм × 1м²');
console.log('─'.repeat(70));

try {
  // Используем первый тип листа и толщину 1мм
  const [sheetKey, sheetMetal] = sheetTypes[0];
  const thickness = sheetMetal.thicknesses.find(t => t === 1) || sheetMetal.thicknesses[0];
  const width = 1000; // 1000мм = 1м ширины

  const result = calculateMetal({
    metalType: sheetKey,
    size: [width, thickness], // Формат для листов: [ширина_мм, толщина_мм]
    length: 1  // 1 погонный метр
  }, metalDatabase);

  if (result.success) {
    console.log(`\n✅ Расчёт выполнен:`);
    console.log(`   Металл: ${result.metalType}`);
    console.log(`   Размер: ${width}мм × ${thickness}мм`);
    console.log(`   Длина: 1м`);
    console.log(`   Вес 1 м²: ${result.weightPerMeter.toFixed(3)} кг`);
    console.log(`   Общий вес: ${(result.weight * 1000).toFixed(2)} кг`);

    // Проверка формулы: 1мм × 1м × 1м × 7.85 = 7.85 кг
    const expected = thickness * 1 * 1 * 7.85;
    const actual = result.weight * 1000;

    console.log(`\n   Ожидается: ${expected.toFixed(2)} кг`);
    console.log(`   Получено: ${actual.toFixed(2)} кг`);
    console.log(`   Расхождение: ${Math.abs(expected - actual).toFixed(3)} кг`);

    // Допуск 1 кг (округление в калькуляторе до 3 знаков в тоннах)
    if (Math.abs(expected - actual) < 1) {
      console.log('\n✅ ТЕСТ 1 ПРОЙДЕН');
      passed++;
    } else {
      console.log('\n❌ ТЕСТ 1 ПРОВАЛЕН: расхождение слишком большое');
      failed++;
    }
  } else {
    console.log(`❌ ОШИБКА: ${result.error}`);
    failed++;
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// Тест 2: Лист оцинкованный 0.5мм × 2м × 3м
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(70));
console.log('📦 Тест 2: Лист оцинкованный 0.5мм × 2м × 3м');
console.log('─'.repeat(70));

try {
  // Ищем оцинкованный лист
  const galvanizedSheet = Object.entries(metalDatabase.metals)
    .find(([key, metal]) =>
      metal.category === 'Лист' &&
      metal.formula === 'sheet' &&
      metal.name.toLowerCase().includes('оцинк')
    );

  if (!galvanizedSheet) {
    console.log('⚠️  Оцинкованный лист не найден, пропускаем тест 2');
  } else {
    const [sheetKey, sheetMetal] = galvanizedSheet;
    const thickness = sheetMetal.thicknesses.find(t => t === 0.5) || sheetMetal.thicknesses[0];
    const width = 2000; // 2000мм = 2м ширины

    const result = calculateMetal({
      metalType: sheetKey,
      size: [width, thickness], // Формат для листов: [ширина_мм, толщина_мм]
      length: 3  // 3 погонных метра
    }, metalDatabase);

    if (result.success) {
      console.log(`\n✅ Расчёт выполнен:`);
      console.log(`   Металл: ${result.metalType}`);
      console.log(`   Размер: ${width}мм × ${thickness}мм`);
      console.log(`   Длина: 3м`);
      console.log(`   Вес 1 м²: ${result.weightPerMeter.toFixed(3)} кг`);
      console.log(`   Общий вес: ${(result.weight * 1000).toFixed(2)} кг`);

      // Проверка формулы: толщина × ширина_м × длина_м × 7.85
      // 0.5мм × 2м × 3м × 7.85 = 23.55 кг
      const expected = thickness * (width / 1000) * 3 * 7.85;
      const actual = result.weight * 1000;

      console.log(`\n   Ожидается: ${expected.toFixed(2)} кг`);
      console.log(`   Получено: ${actual.toFixed(2)} кг`);
      console.log(`   Расхождение: ${Math.abs(expected - actual).toFixed(3)} кг`);

      // Допуск 1 кг (округление в калькуляторе до 3 знаков в тоннах)
      if (Math.abs(expected - actual) < 1) {
        console.log('\n✅ ТЕСТ 2 ПРОЙДЕН');
        passed++;
      } else {
        console.log('\n❌ ТЕСТ 2 ПРОВАЛЕН: расхождение слишком большое');
        failed++;
      }
    } else {
      console.log(`❌ ОШИБКА: ${result.error}`);
      failed++;
    }
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// Тест 3: Проверка разных толщин одного типа листа
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(70));
console.log('📦 Тест 3: Разные толщины (1мм, 2мм, 5мм) × 1м²');
console.log('─'.repeat(70));

try {
  const [sheetKey, sheetMetal] = sheetTypes[0];
  const thicknesses = [1, 2, 5].filter(t => sheetMetal.thicknesses.includes(t));

  if (thicknesses.length === 0) {
    console.log('⚠️  Нужные толщины не найдены, используем первые 3 из БД');
    thicknesses.push(...sheetMetal.thicknesses.slice(0, 3));
  }

  console.log(`\nТестируем толщины: ${thicknesses.join('мм, ')}мм`);
  console.log(`Тип листа: ${sheetMetal.name}\n`);

  let allPassed = true;

  for (const thickness of thicknesses) {
    const width = 1000; // 1000мм = 1м
    const result = calculateMetal({
      metalType: sheetKey,
      size: [width, thickness], // [ширина_мм, толщина_мм]
      length: 1
    }, metalDatabase);

    if (result.success) {
      const expected = thickness * 1 * 1 * 7.85;
      const actual = result.weight * 1000;
      const diff = Math.abs(expected - actual);

      console.log(`  ${thickness}мм: ожидалось ${expected.toFixed(2)} кг, получено ${actual.toFixed(2)} кг (Δ ${diff.toFixed(3)} кг) ${diff < 1 ? '✅' : '❌'}`);

      // Допуск 1 кг
      if (diff >= 1) {
        allPassed = false;
      }
    } else {
      console.log(`  ${thickness}мм: ❌ ОШИБКА: ${result.error}`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n✅ ТЕСТ 3 ПРОЙДЕН');
    passed++;
  } else {
    console.log('\n❌ ТЕСТ 3 ПРОВАЛЕН');
    failed++;
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// ИТОГОВАЯ СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(70));
console.log('\n📊 ИТОГО:\n');
console.log(`  Всего тестов: ${passed + failed}`);
console.log(`  ✅ Пройдено: ${passed}`);
console.log(`  ❌ Провалено: ${failed}`);

if (passed + failed > 0) {
  console.log(`  📈 Процент успеха: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

if (failed === 0) {
  console.log('\n🎉 ВСЕ ИНТЕГРАЦИОННЫЕ ТЕСТЫ ПРОЙДЕНЫ!');
  console.log('   ✅ Листы корректно интегрированы в калькулятор');
  console.log('   ✅ Формула работает для разных типов листов');
  console.log('   ✅ Расчёт соответствует формуле заказчика');
  console.log('\n🎯 СТАТУС: ИНТЕГРАЦИЯ РАБОТАЕТ КОРРЕКТНО!');
  process.exit(0);
} else {
  console.log('\n⚠️  НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОШЛИ!');
  console.log(`   Провалено: ${failed} тест(ов)`);
  process.exit(1);
}
