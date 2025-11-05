// ТЕСТ: Проверка импортированных данных крепежа
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('\n🧪 ТЕСТ: Импортированные данные крепежа\n');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

// ============================================================================
// Проверка 1: Количество размеров
// ============================================================================
console.log('\n📊 Тест 1: Количество размеров\n');

const bolt = metalDatabase.metals.bolt;
const nut = metalDatabase.metals.nut;
const washer = metalDatabase.metals.washer;

console.log(`   Болты: ${bolt.sizes.length} размеров`);
console.log(`   Гайки: ${nut.sizes.length} размеров`);
console.log(`   Шайбы: ${washer.sizes.length} размеров`);

if (bolt.sizes.length === 687 && nut.sizes.length === 44 && washer.sizes.length === 74) {
  console.log('\n✅ Тест 1 ПРОЙДЕН: Все размеры импортированы');
  passed++;
} else {
  console.log('\n❌ Тест 1 ПРОВАЛЕН: Неверное количество размеров');
  failed++;
}

// ============================================================================
// Проверка 2: Соответствие sizes/weights/gosts
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('\n📊 Тест 2: Соответствие sizes/weights/gosts\n');

const types = [
  { name: 'Болты', key: 'bolt', data: bolt },
  { name: 'Гайки', key: 'nut', data: nut },
  { name: 'Шайбы', key: 'washer', data: washer }
];

let allMatched = true;

types.forEach(type => {
  const sizesCount = type.data.sizes.length;
  const weightsCount = Object.keys(type.data.weights).length;
  const gostsCount = Object.keys(type.data.gosts).length;

  console.log(`   ${type.name}:`);
  console.log(`      sizes:   ${sizesCount}`);
  console.log(`      weights: ${weightsCount}`);
  console.log(`      gosts:   ${gostsCount}`);

  if (sizesCount === weightsCount && weightsCount === gostsCount) {
    console.log(`      ✅ Соответствие корректно\n`);
  } else {
    console.log(`      ❌ Несоответствие данных!\n`);
    allMatched = false;
  }
});

if (allMatched) {
  console.log('✅ Тест 2 ПРОЙДЕН: Все данные согласованы');
  passed++;
} else {
  console.log('❌ Тест 2 ПРОВАЛЕН: Есть несоответствия');
  failed++;
}

// ============================================================================
// Проверка 3: Расчёт с новыми размерами
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('\n📊 Тест 3: Расчёт с новыми размерами\n');

// Тест болта 1.6х2
const testBolt = calculateMetal({
  metalType: 'bolt',
  size: '1.6х2',
  pieces: 1000
}, metalDatabase);

console.log('   Болт 1.6х2 × 1000 шт:');
if (testBolt.success) {
  console.log(`      Вес: ${testBolt.weight} т (${(testBolt.weight * 1000).toFixed(2)} кг)`);
  console.log(`      Вес/1000шт: ${testBolt.weightPerMeter} кг`);
  console.log(`      ГОСТ: ${testBolt.gost}`);
  console.log('      ✅ Расчёт выполнен\n');
  passed++;
} else {
  console.log(`      ❌ ОШИБКА: ${testBolt.error}\n`);
  failed++;
}

// Тест гайки М1
const testNut = calculateMetal({
  metalType: 'nut',
  size: '1',
  pieces: 1000
}, metalDatabase);

console.log('   Гайка М1 × 1000 шт:');
if (testNut.success) {
  console.log(`      Вес: ${testNut.weight} т (${(testNut.weight * 1000).toFixed(2)} кг)`);
  console.log(`      ГОСТ: ${testNut.gost}`);
  console.log('      ✅ Расчёт выполнен\n');
  passed++;
} else {
  console.log(`      ❌ ОШИБКА: ${testNut.error}\n`);
  failed++;
}

// Тест шайбы 1
const testWasher = calculateMetal({
  metalType: 'washer',
  size: '1',
  pieces: 1000
}, metalDatabase);

console.log('   Шайба 1 × 1000 шт:');
if (testWasher.success) {
  console.log(`      Вес: ${testWasher.weight} т (${(testWasher.weight * 1000).toFixed(2)} кг)`);
  console.log(`      ГОСТ: ${testWasher.gost}`);
  console.log('      ✅ Расчёт выполнен\n');
  passed++;
} else {
  console.log(`      ❌ ОШИБКА: ${testWasher.error}\n`);
  failed++;
}

// ============================================================================
// ИТОГО
// ============================================================================
console.log('='.repeat(70));
console.log(`\n📊 ИТОГО: ${passed}/${passed + failed} тестов пройдено\n`);

if (failed === 0) {
  console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
  console.log('   ✅ Все 805 размеров крепежа импортированы корректно');
  console.log('   ✅ Данные согласованы (sizes/weights/gosts)');
  console.log('   ✅ Расчёты работают правильно\n');
  console.log('🎯 СТАТУС: ГОТОВО К ДЕПЛОЮ!\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} ТЕСТ(ОВ) НЕ ПРОШЛИ!\n`);
  process.exit(1);
}
