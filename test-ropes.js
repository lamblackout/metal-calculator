// Тестирование канатов после интеграции
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('=== ТЕСТИРОВАНИЕ КАНАТОВ ===\n');

// Тест 1: Канат 10mm, 100 метров
console.log('Тест 1: Канат 10mm, 100 метров');
console.log('Ожидается: 0.052 тонны (~52 кг)');
const test1 = calculateMetal({
  metalType: 'rope',
  size: 10,
  length: 100
}, metalDatabase);
console.log('Результат:', test1);
console.log('Вес:', test1.weight, 'тонн');
console.log('Статус:', test1.weight === 0.052 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Тест 2: Канат арматурный 15mm, 100 метров (КРИТИЧЕСКИЙ!)
console.log('Тест 2: Канат арматурный 15mm, 100 метров (КРИТИЧЕСКИЙ!)');
console.log('Ожидается: 0.110 тонны (110 кг)');
const test2 = calculateMetal({
  metalType: 'rope_armature',
  size: 15,
  length: 100
}, metalDatabase);
console.log('Результат:', test2);
console.log('Вес:', test2.weight, 'тонн');
console.log('Статус:', test2.weight === 0.11 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Тест 3: Канат 50mm, 100 метров
console.log('Тест 3: Канат 50mm, 100 метров');
console.log('Ожидается: 0.911 тонны (911 кг)');
const test3 = calculateMetal({
  metalType: 'rope',
  size: 50,
  length: 100
}, metalDatabase);
console.log('Результат:', test3);
console.log('Вес:', test3.weight, 'тонн');
console.log('Статус:', test3.weight === 0.911 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Тест 4: Обратный расчет - Канат 10mm, 1 тонна
console.log('Тест 4: Обратный расчет - Канат 10mm, 1 тонна');
console.log('Ожидается: ~1927 метров');
const test4 = calculateMetal({
  metalType: 'rope',
  size: 10,
  weight: 1
}, metalDatabase);
console.log('Результат:', test4);
console.log('Длина:', test4.length, 'метров');
const expected = 1000 / 0.519; // 1 тонна = 1000 кг, вес 1м = 0.519 кг
console.log('Ожидаемая длина:', expected.toFixed(2), 'метров');
const diff = Math.abs(test4.length - expected);
console.log('Статус:', diff < 1 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

console.log('=== ИТОГОВЫЙ РЕЗУЛЬТАТ ===');
const allPassed =
  test1.success && test1.weight === 0.052 &&
  test2.success && test2.weight === 0.11 &&
  test3.success && test3.weight === 0.911 &&
  test4.success && diff < 1;

if (allPassed) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ - ГОТОВ К ДЕПЛОЮ');
} else {
  console.log('⚠️ ЕСТЬ ПРОБЛЕМЫ - ТРЕБУЕТСЯ ПРОВЕРКА');
  console.log('\nДетали:');
  console.log('Test 1:', test1.success && test1.weight === 0.052 ? '✅' : '❌');
  console.log('Test 2:', test2.success && test2.weight === 0.11 ? '✅' : '❌');
  console.log('Test 3:', test3.success && test3.weight === 0.911 ? '✅' : '❌');
  console.log('Test 4:', test4.success && diff < 1 ? '✅' : '❌');
}
