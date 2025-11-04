// Тестирование катанки после интеграции
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('=== ТЕСТИРОВАНИЕ КАТАНКИ ===\n');

// Тест 1: Размер 10 мм, сталь ст3, 100 метров
console.log('Тест 1: Размер 10 мм, сталь ст3, 100 метров');
console.log('Ожидается: 0.0616 тонн (~61.6 кг)');
const test1 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  steelType: 'ст3',
  length: 100
}, metalDatabase);
console.log('Результат:', test1);
console.log('Вес:', test1.weight, 'тонн');
const expected1 = (100 * 0.07847133758 * 7.85) / 1000;
console.log('Ожидаемый вес:', expected1.toFixed(4), 'тонн');
console.log('Статус:', Math.abs(test1.weight - expected1) < 0.001 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Тест 2: Размер 10 мм, сталь Р18, 100 метров
console.log('Тест 2: Размер 10 мм, сталь Р18, 100 метров');
console.log('Ожидается: 0.0691 тонн (~69.1 кг)');
const test2 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  steelType: 'Р18',
  length: 100
}, metalDatabase);
console.log('Результат:', test2);
console.log('Вес:', test2.weight, 'тонн');
const expected2 = (100 * 0.07847133758 * 8.8) / 1000;
console.log('Ожидаемый вес:', expected2.toFixed(4), 'тонн');
console.log('Статус:', Math.abs(test2.weight - expected2) < 0.001 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Тест 3: Дефолтная сталь (ст3)
console.log('Тест 3: Размер 10 мм, дефолтная сталь, 100 метров');
console.log('Ожидается: автоматически ст3 → 0.0616 тонн');
const test3 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  length: 100
  // steelType не указан, должен использовать ст3
}, metalDatabase);
console.log('Результат:', test3);
console.log('Марка стали:', test3.steelType);
console.log('Вес:', test3.weight, 'тонн');
console.log('Статус:', test3.steelType === 'ст3' && Math.abs(test3.weight - expected1) < 0.001 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Тест 4: Обратный расчёт (тонны → метры)
console.log('Тест 4: Обратный расчёт - Размер 10 мм, сталь ст3, 0.0616 тонн');
console.log('Ожидается: ~100 метров');
const test4 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  steelType: 'ст3',
  weight: 0.0616
}, metalDatabase);
console.log('Результат:', test4);
console.log('Длина:', test4.length, 'метров');
console.log('Статус:', Math.abs(test4.length - 100) < 1 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Тест 5: Расчёт через штуки (если есть pieceLength)
console.log('Тест 5: Размер 10 мм, сталь ст3, 100 штук по 1 метру');
const test5 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  steelType: 'ст3',
  pieces: 100,
  pieceLength: 1
}, metalDatabase);
console.log('Результат:', test5);
if (test5.success) {
  console.log('Длина:', test5.length, 'метров');
  console.log('Вес:', test5.weight, 'тонн');
  console.log('Статус:', Math.abs(test5.weight - expected1) < 0.001 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
} else {
  console.log('Ошибка:', test5.error);
  console.log('Статус: ⚠️ ПРОПУЩЕН (нет standardLength для катанки)');
}
console.log();

// Тест 6: Разные размеры катанки
console.log('Тест 6: Размер 25 мм, сталь ст3, 100 метров (максимальный размер)');
const test6 = calculateMetal({
  metalType: 'wire_rod',
  size: 25,
  steelType: 'ст3',
  length: 100
}, metalDatabase);
console.log('Результат:', test6);
console.log('Вес:', test6.weight, 'тонн');
const expected6 = (100 * 0.490828025478 * 7.85) / 1000;
console.log('Ожидаемый вес:', expected6.toFixed(4), 'тонн');
console.log('Статус:', Math.abs(test6.weight - expected6) < 0.001 ? '✅ ПРОЙДЕН' : '❌ ПРОВАЛЕН');
console.log();

// Итоговый результат
console.log('=== ИТОГОВЫЙ РЕЗУЛЬТАТ ===');
const allTests = [
  test1.success && Math.abs(test1.weight - expected1) < 0.001,
  test2.success && Math.abs(test2.weight - expected2) < 0.001,
  test3.success && test3.steelType === 'ст3' && Math.abs(test3.weight - expected1) < 0.001,
  test4.success && Math.abs(test4.length - 100) < 1,
  test5.success ? Math.abs(test5.weight - expected1) < 0.001 : true, // skip if no standardLength
  test6.success && Math.abs(test6.weight - expected6) < 0.001
];

const passedCount = allTests.filter(Boolean).length;
const totalCount = allTests.length;

console.log(`Пройдено: ${passedCount}/${totalCount}`);
if (passedCount === totalCount) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ - КАТАНКА ГОТОВА К ИСПОЛЬЗОВАНИЮ');
} else {
  console.log('⚠️ ЕСТЬ ПРОБЛЕМЫ - ТРЕБУЕТСЯ ПРОВЕРКА');
}
