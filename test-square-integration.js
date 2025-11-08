// test-square-integration.js
// Тестирование интеграции данных Квадрата

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

// Загрузка базы данных
const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(70));
console.log('🔧 ТЕСТИРОВАНИЕ ИНТЕГРАЦИИ КВАДРАТА');
console.log('='.repeat(70));
console.log('');

// Получить данные о квадрате
const square = metalDatabase.metals.square;

console.log('📊 Статистика интеграции:');
console.log(`   • Тип: ${square.name}`);
console.log(`   • ГОСТ: ${square.gost}`);
console.log(`   • Категория: ${square.category}`);
console.log(`   • Формула: ${square.formula}`);
console.log(`   • Размеров: ${square.sizes ? square.sizes.length : 0}`);
console.log(`   • Весовых коэффициентов: ${square.weights ? Object.keys(square.weights).length : 0}`);
console.log(`   • Марок стали: ${square.steelTypes ? square.steelTypes.length : 0}`);
console.log(`   • Плотностей стали: ${square.steelCoefficients ? Object.keys(square.steelCoefficients).length : 0}`);
console.log('');

// Проверить, что нет "────" в sizes
const hasSeparator = square.sizes && square.sizes.includes('────');
console.log(`✓ Проверка исключения "────": ${hasSeparator ? '❌ ОШИБКА: есть в списке!' : '✅ OK: нет в списке'}`);
console.log('');

// Тест 1: Прямой расчёт (тонны → метры)
console.log('='.repeat(70));
console.log('Тест 1: Прямой расчёт — Квадрат 10мм, сталь ст3, 1 тонна');
console.log('='.repeat(70));

const test1 = calculator.calculateMetal({
  metalType: 'square',
  size: '10',
  steelType: 'ст3',
  weight: 1
}, metalDatabase);

if (test1.success) {
  console.log('✅ Расчёт успешен!');
  console.log(`   • Вес: ${test1.weight} т`);
  console.log(`   • Длина: ${test1.length} м`);
  console.log(`   • Вес 1м: ${test1.weightPerMeter} кг/м`);

  // Проверить формулу: вес 1м = weights[10] × steelCoefficients[ст3]
  const expectedWeightPerMeter = square.weights['10'] * square.steelCoefficients['ст3'];
  console.log(`   • Ожидаемый вес 1м: ${expectedWeightPerMeter.toFixed(3)} кг/м`);
  console.log(`   • Расхождение: ${Math.abs(test1.weightPerMeter - expectedWeightPerMeter) < 0.001 ? '✅ < 0.001 кг' : '❌ ОШИБКА!'}`);

  // Расчёт: length = weight × 1000 / weightPerMeter
  const expectedLength = (1 * 1000) / expectedWeightPerMeter;
  console.log(`   • Ожидаемая длина: ${expectedLength.toFixed(2)} м`);
  console.log(`   • Расхождение: ${Math.abs(test1.length - expectedLength) < 0.01 ? '✅ < 0.01 м' : '❌ ОШИБКА!'}`);
} else {
  console.log('❌ Ошибка:', test1.error);
}
console.log('');

// Тест 2: Обратный расчёт (метры → тонны)
console.log('='.repeat(70));
console.log('Тест 2: Обратный расчёт — Квадрат 20мм, сталь ст3, 100 метров');
console.log('='.repeat(70));

const test2 = calculator.calculateMetal({
  metalType: 'square',
  size: '20',
  steelType: 'ст3',
  length: 100
}, metalDatabase);

if (test2.success) {
  console.log('✅ Расчёт успешен!');
  console.log(`   • Длина: ${test2.length} м`);
  console.log(`   • Вес: ${test2.weight} т`);
  console.log(`   • Вес 1м: ${test2.weightPerMeter} кг/м`);

  // Проверить формулу
  const expectedWeightPerMeter = square.weights['20'] * square.steelCoefficients['ст3'];
  console.log(`   • Ожидаемый вес 1м: ${expectedWeightPerMeter.toFixed(3)} кг/м`);
  console.log(`   • Расхождение: ${Math.abs(test2.weightPerMeter - expectedWeightPerMeter) < 0.001 ? '✅ < 0.001 кг' : '❌ ОШИБКА!'}`);

  // Расчёт: weight = weightPerMeter × length / 1000
  const expectedWeight = (expectedWeightPerMeter * 100) / 1000;
  console.log(`   • Ожидаемый вес: ${expectedWeight.toFixed(3)} т`);
  console.log(`   • Расхождение: ${Math.abs(test2.weight - expectedWeight) < 0.001 ? '✅ < 0.001 т' : '❌ ОШИБКА!'}`);
} else {
  console.log('❌ Ошибка:', test2.error);
}
console.log('');

// Тест 3: Разные марки стали
console.log('='.repeat(70));
console.log('Тест 3: Влияние марки стали — Квадрат 50мм, 1 тонна');
console.log('='.repeat(70));

const steelsToTest = ['ст3', 'ст45', 'У10', 'Р18'];
steelsToTest.forEach(steel => {
  const test = calculator.calculateMetal({
    metalType: 'square',
    size: '50',
    steelType: steel,
    weight: 1
  }, metalDatabase);

  if (test.success) {
    const expectedWPM = square.weights['50'] * square.steelCoefficients[steel];
    console.log(`   • ${steel}: вес 1м = ${test.weightPerMeter} кг/м (ожид: ${expectedWPM.toFixed(3)}), длина = ${test.length} м`);
  } else {
    console.log(`   • ${steel}: ❌ ${test.error}`);
  }
});
console.log('');

// Тест 4: Граничные размеры
console.log('='.repeat(70));
console.log('Тест 4: Граничные размеры — минимум и максимум');
console.log('='.repeat(70));

// Минимальный размер: 4 мм
const testMin = calculator.calculateMetal({
  metalType: 'square',
  size: '4',
  steelType: 'ст3',
  weight: 0.1
}, metalDatabase);

if (testMin.success) {
  console.log(`✅ Минимальный размер (4мм): вес 1м = ${testMin.weightPerMeter} кг/м, длина = ${testMin.length} м`);
} else {
  console.log(`❌ Минимальный размер (4мм): ${testMin.error}`);
}

// Максимальный размер: 650 мм
const testMax = calculator.calculateMetal({
  metalType: 'square',
  size: '650',
  steelType: 'ст3',
  weight: 10
}, metalDatabase);

if (testMax.success) {
  console.log(`✅ Максимальный размер (650мм): вес 1м = ${testMax.weightPerMeter} кг/м, длина = ${testMax.length} м`);
} else {
  console.log(`❌ Максимальный размер (650мм): ${testMax.error}`);
}
console.log('');

// Тест 5: Несуществующий размер (должен вернуть ошибку)
console.log('='.repeat(70));
console.log('Тест 5: Несуществующий размер — 999 мм (должна быть ошибка)');
console.log('='.repeat(70));

const testInvalid = calculator.calculateMetal({
  metalType: 'square',
  size: '999',
  steelType: 'ст3',
  weight: 1
}, metalDatabase);

if (!testInvalid.success) {
  console.log(`✅ Корректно обработан: ${testInvalid.error}`);
} else {
  console.log(`❌ ОШИБКА: несуществующий размер не вызвал ошибку!`);
}
console.log('');

// Итоговая сводка
console.log('='.repeat(70));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(70));

const totalTests = 5;
const passedTests = [test1, test2].filter(t => t.success).length +
                    (testMin.success ? 1 : 0) +
                    (testMax.success ? 1 : 0) +
                    (!testInvalid.success ? 1 : 0);

console.log(`Всего тестов: ${totalTests}`);
console.log(`Пройдено: ${passedTests}`);
console.log(`Провалено: ${totalTests - passedTests}`);
console.log(`Успешность: ${((passedTests / totalTests) * 100).toFixed(0)}%`);
console.log('');

if (passedTests === totalTests) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ! КВАДРАТ ПОЛНОСТЬЮ ИНТЕГРИРОВАН.');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
