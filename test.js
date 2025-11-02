// test.js - Полное тестирование Metal Calculator Bundle
const { calculateMetal } = require('./dist/calculator.bundle');
const metalDatabase = require('./database/metals.json');

// Счетчики тестов
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Функция для вывода результата теста
function runTest(testNumber, description, params, expectSuccess = true) {
  totalTests++;
  console.log(`\n${'='.repeat(70)}`);
  console.log(`=== ТЕСТ ${testNumber}: ${description} ===`);
  console.log(`${'='.repeat(70)}`);

  console.log('\n📥 Входные данные:');
  console.log(JSON.stringify(params, null, 2));

  try {
    const result = calculateMetal(params, metalDatabase);

    console.log('\n📤 Результат:');
    console.log(JSON.stringify(result, null, 2));

    if (expectSuccess && result.success) {
      console.log('\n✅ ТЕСТ ПРОЙДЕН');
      passedTests++;
    } else if (!expectSuccess && !result.success) {
      console.log('\n✅ ТЕСТ ПРОЙДЕН (ожидалась ошибка)');
      passedTests++;
    } else if (expectSuccess && !result.success) {
      console.log('\n❌ ТЕСТ ПРОВАЛЕН (ожидался успех, получена ошибка)');
      failedTests++;
    } else {
      console.log('\n❌ ТЕСТ ПРОВАЛЕН (ожидалась ошибка, получен успех)');
      failedTests++;
    }

  } catch (error) {
    console.log('\n💥 ИСКЛЮЧЕНИЕ:');
    console.log(error.message);
    console.log('\n❌ ТЕСТ ПРОВАЛЕН');
    failedTests++;
  }
}

// Заголовок
console.log('\n' + '='.repeat(70));
console.log('   🧪 ПОЛНОЕ ТЕСТИРОВАНИЕ METAL CALCULATOR BUNDLE');
console.log('='.repeat(70));

// ТЕСТ 1: Арматура А3, d12, 100кг → length, pieces
runTest(1, 'Арматура А3, d12, 100кг → length, pieces', {
  metalType: 'armature_a3',
  size: 12,
  weight: 100
});

// ТЕСТ 2: Арматура А1, d16, 50м → weight, pieces
runTest(2, 'Арматура А1, d16, 50м → weight, pieces', {
  metalType: 'armature_a1',
  size: 16,
  length: 50
});

// ТЕСТ 3: Балка 20К1, 100кг → length
runTest(3, 'Балка 20К1, 100кг → length', {
  metalType: 'beam',
  size: '20К1',
  weight: 100
});

// ТЕСТ 4: Балка 30К5, 10 штук по 12м → weight, length
runTest(4, 'Балка 30К5, 10 штук → weight, length', {
  metalType: 'beam',
  size: '30К5',
  pieces: 10
});

// ТЕСТ 5: Швеллер 10У, 200кг → length, pieces
runTest(5, 'Швеллер 10У, 200кг → length, pieces', {
  metalType: 'channel',
  size: '10У',
  weight: 200
});

// ТЕСТ 6: Арматура А1 оц., d10, 5 штук, оцинковка 3% → weight, length
runTest(6, 'Арматура А1 оц., d10, 5 штук, оцинковка 3%', {
  metalType: 'armature_a1_galv',
  size: 10,
  pieces: 5,
  isGalvanized: true,
  galvCoef: 0.03
});

// ТЕСТ 7: Арматура А3 оц., d14, 150кг, оцинковка 5% → length
runTest(7, 'Арматура А3 оц., d14, 150кг, оцинковка 5%', {
  metalType: 'armature_a3_galv',
  size: 14,
  weight: 150,
  isGalvanized: true,
  galvCoef: 0.05
});

// ТЕСТ 8: Проволока d=5мм, 100кг → length
runTest(8, 'Проволока d=5мм, 100кг → length', {
  metalType: 'wire',
  size: 5,
  weight: 100
});

// ТЕСТ 9: Несуществующий металл (должна быть ошибка)
runTest(9, 'Несуществующий металл → ОШИБКА', {
  metalType: 'unknown_metal_xyz',
  size: 12,
  length: 10
}, false);

// ТЕСТ 10: Балка с несуществующим размером (должна быть ошибка)
runTest(10, 'Балка с несуществующим размером → ОШИБКА', {
  metalType: 'beam',
  size: '999XYZ',
  length: 10
}, false);

// Итоги
console.log('\n\n' + '='.repeat(70));
console.log('   📊 ИТОГИ ТЕСТИРОВАНИЯ');
console.log('='.repeat(70));
console.log(`\n✅ Пройдено тестов: ${passedTests}/${totalTests}`);
console.log(`❌ Провалено тестов: ${failedTests}/${totalTests}`);
console.log(`📈 Процент успеха: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО! 🎉');
} else {
  console.log(`\n⚠️  ВНИМАНИЕ: ${failedTests} тест(ов) провалено`);
}

console.log('\n' + '='.repeat(70) + '\n');

// Возвращаем код выхода
process.exit(failedTests > 0 ? 1 : 0);
