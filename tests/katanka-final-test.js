// Комплексное финальное тестирование катанки
const { calculateMetal } = require('../dist/calculator.bundle.js');
const metalDatabase = require('../database/metals.json');

console.log('🧪 КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ КАТАНКИ\n');
console.log('═'.repeat(60));

// Статистика
let passed = 0;
let failed = 0;
const failedTests = [];

function runTest(name, params, expectedChecks) {
  console.log(`\n📝 ${name}`);

  try {
    const result = calculateMetal({
      metalType: 'wire_rod',
      ...params
    }, metalDatabase);

    if (!result.success) {
      console.log(`   ❌ ОШИБКА: ${result.error}`);
      failed++;
      failedTests.push(name);
      return;
    }

    let allPassed = true;

    for (const [key, expected] of Object.entries(expectedChecks)) {
      const actual = result[key];
      let match = false;

      if (typeof expected === 'number') {
        // Для длины используем большую погрешность (0.1м = 10см)
        // Для веса и веса на метр - точную (0.001)
        const tolerance = key === 'length' ? 0.1 : 0.001;
        match = Math.abs(actual - expected) < tolerance;
      } else {
        match = actual === expected;
      }

      const status = match ? '✅' : '❌';
      console.log(`   ${key}: ${actual} (ожидалось ${expected}) ${status}`);

      if (!match) {
        allPassed = false;
      }
    }

    if (allPassed) {
      passed++;
    } else {
      failed++;
      failedTests.push(name);
    }

  } catch (error) {
    console.log(`   ❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
    failed++;
    failedTests.push(name);
  }
}

// ТЕСТ 1: Базовый расчёт (метры → тонны)
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: БАЗОВЫЙ РАСЧЁТ (МЕТРЫ → ТОННЫ)');
console.log('─'.repeat(60));

runTest('Тест 1.1: Размер 10мм, сталь ст3, 100м',
  { size: 10, steelType: 'ст3', length: 100 },
  { steelType: 'ст3', weightPerMeter: 0.616, weight: 0.062, length: 100 }
);

runTest('Тест 1.2: Размер 10мм, сталь Р18, 100м',
  { size: 10, steelType: 'Р18', length: 100 },
  { steelType: 'Р18', weightPerMeter: 0.691, weight: 0.069 }
);

runTest('Тест 1.3: Размер 10мм, сталь 50Г2, 100м',
  { size: 10, steelType: '50Г2', length: 100 },
  { steelType: '50Г2', weightPerMeter: 0.589, weight: 0.059 }
);

// ТЕСТ 2: Обратный расчёт (тонны → метры)
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: ОБРАТНЫЙ РАСЧЁТ (ТОННЫ → МЕТРЫ)');
console.log('─'.repeat(60));

runTest('Тест 2.1: Размер 10мм, сталь ст3, 0.0616 тонны',
  { size: 10, steelType: 'ст3', weight: 0.0616 },
  { length: 100 }
);

runTest('Тест 2.2: Размер 10мм, сталь Р18, 0.0691 тонны',
  { size: 10, steelType: 'Р18', weight: 0.0691 },
  { length: 100 }
);

// ТЕСТ 3: Граничные значения
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 3: ГРАНИЧНЫЕ ЗНАЧЕНИЯ');
console.log('─'.repeat(60));

runTest('Тест 3.1: Минимальный размер 4.5мм, сталь ст3, 100м',
  { size: 4.5, steelType: 'ст3', length: 100 },
  { weightPerMeter: 0.125, weight: 0.013 }
);

runTest('Тест 3.2: Максимальный размер 25мм, сталь ст3, 100м',
  { size: 25, steelType: 'ст3', length: 100 },
  { weightPerMeter: 3.853, weight: 0.385 }
);

// ТЕСТ 4: Дефолтные значения
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 4: ДЕФОЛТНЫЕ ЗНАЧЕНИЯ');
console.log('─'.repeat(60));

runTest('Тест 4.1: БЕЗ указания steelType (дефолт = ст3)',
  { size: 10, length: 100 },
  { steelType: 'ст3', weight: 0.062 }
);

// ТЕСТ 5: Разные размеры
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 5: РАЗЛИЧНЫЕ РАЗМЕРЫ');
console.log('─'.repeat(60));

const sizes = [5, 6, 8, 10, 12, 16, 20];
sizes.forEach(size => {
  const result = calculateMetal({
    metalType: 'wire_rod',
    size: size,
    steelType: 'ст3',
    length: 100
  }, metalDatabase);

  if (result.success && result.weight > 0) {
    console.log(`   ✅ Размер ${size}мм: ${result.weight} тонн (${(result.weight * 1000).toFixed(1)} кг)`);
    passed++;
  } else {
    console.log(`   ❌ Размер ${size}мм: ОШИБКА`);
    failed++;
    failedTests.push(`Размер ${size}мм`);
  }
});

// ТЕСТ 6: Проверка других металлов (не сломались ли)
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 6: ПРОВЕРКА ДРУГИХ МЕТАЛЛОВ');
console.log('─'.repeat(60));

const otherMetals = [
  { type: 'armature_a3', size: 12, length: 11.7, name: 'Арматура А3' },
  { type: 'rope', size: 10, length: 100, name: 'Канат' },
  { type: 'circle', size: 10, length: 6, name: 'Круг' },
  { type: 'square', size: 10, length: 6, name: 'Квадрат' }
];

otherMetals.forEach(metal => {
  try {
    const result = calculateMetal({
      metalType: metal.type,
      size: metal.size,
      length: metal.length
    }, metalDatabase);

    if (result.success && result.weight > 0) {
      console.log(`   ✅ ${metal.name}: ${(result.weight * 1000).toFixed(2)} кг`);
      passed++;
    } else {
      console.log(`   ❌ ${metal.name}: ОШИБКА - ${result.error}`);
      failed++;
      failedTests.push(`Металл: ${metal.name}`);
    }
  } catch (error) {
    console.log(`   ❌ ${metal.name}: ИСКЛЮЧЕНИЕ - ${error.message}`);
    failed++;
    failedTests.push(`Металл: ${metal.name}`);
  }
});

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

// Проверка размеров файлов
console.log('\n' + '═'.repeat(60));
console.log('📦 РАЗМЕРЫ ФАЙЛОВ');
console.log('═'.repeat(60));

const fs = require('fs');
const files = [
  { path: 'dist/calculator.bundle.js', name: 'calculator.bundle.js' },
  { path: 'dist/calculator.browser.js', name: 'calculator.browser.js' },
  { path: 'database/metals.json', name: 'metals.json' },
  { path: 'docs/calculator.html', name: 'calculator.html' }
];

files.forEach(file => {
  try {
    const stats = fs.statSync(file.path);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ${file.name}: ${sizeKB} KB`);
  } catch (error) {
    console.log(`   ${file.name}: Файл не найден`);
  }
});

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! КАТАНКА ГОТОВА К ДЕПЛОЮ!');
  console.log('═'.repeat(60));
  console.log('\n✅ Что готово:');
  console.log('   • База данных: 27 размеров, 37 марок стали');
  console.log('   • Формула расчёта: двухфакторная (размер × марка)');
  console.log('   • UI: dropdown марки стали + input длины 1 шт');
  console.log('   • Тесты: все пройдены');
  console.log('   • Совместимость: другие металлы не затронуты');
  console.log('\n📝 Следующий шаг: Деплой в production');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
