// ТЕСТ: Проверка импортированных данных крепежа
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('\n🧪 ПРОВЕРКА: Работа штук ПОСЛЕ исправления\n');
console.log('='.repeat(70));

let passed = 0;
let total = 0;

// ============================================================================
// Тест 1: Арматура (НЕ ДОЛЖНО СЛОМАТЬСЯ!)
// ============================================================================
console.log('\n✅ ТЕСТ 1: Арматура А3 12мм × 1000м (НЕ должна сломаться!)\n');
total++;

const test1 = calculateMetal({
  metalType: 'armature_a3',
  size: 12,
  length: 1000
}, metalDatabase);

console.log(`Штуки: ${test1.actual.pieces} (ожидается 86)`);
console.log(`Длина: ${test1.actual.length} м (ожидается 1006.2)`);
console.log(`StandardLength: ${test1.standardLength} м`);

if (test1.actual.pieces === 86 && Math.abs(test1.actual.length - 1006.2) < 0.1) {
  console.log('✅ ПРОЙДЕН');
  passed++;
} else {
  console.log('❌ ПРОВАЛЕН! ФУНКЦИОНАЛ СЛОМАН!');
}

// ============================================================================
// Тест 2: Катанка × длина
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('\n🔧 ТЕСТ 2: Катанка 10мм × 1000м (ДОЛЖНО ЗАРАБОТАТЬ)\n');
total++;

const test2 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  steelType: 'ст08',
  length: 1000
}, metalDatabase);

console.log(`Штуки: ${test2.actual.pieces} (ожидается 1000)`);
console.log(`Длина: ${test2.actual.length} м (ожидается 1000)`);
console.log(`StandardLength: ${test2.standardLength || 'null (используется 1м)'}`);

if (test2.actual.pieces === 1000 && test2.actual.length === 1000) {
  console.log('✅ ПРОЙДЕН');
  passed++;
} else {
  console.log('❌ ПРОВАЛЕН');
}

// ============================================================================
// Тест 3: Катанка × вес
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('\n🔧 ТЕСТ 3: Катанка 10мм × 0.1т (ДОЛЖНО ЗАРАБОТАТЬ)\n');
total++;

const test3 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  steelType: 'ст08',
  weight: 0.1  // 100 кг
}, metalDatabase);

console.log(`Штуки: ${test3.actual.pieces} (должны быть > 0)`);
console.log(`Длина: ${test3.actual.length.toFixed(1)} м`);
console.log(`Вес: ${(test3.actual.weight * 1000).toFixed(1)} кг`);
console.log(`StandardLength: ${test3.standardLength || 'null (используется 1м)'}`);

if (test3.actual.pieces && test3.actual.pieces > 0) {
  console.log('✅ ПРОЙДЕН');
  passed++;
} else {
  console.log('❌ ПРОВАЛЕН');
}

// ============================================================================
// Тест 4: Болты × штуки
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('\n🔧 ТЕСТ 4: Болты 1.6х2 × 1000 штук (ДОЛЖНО ЗАРАБОТАТЬ)\n');
total++;

const test4 = calculateMetal({
  metalType: 'bolt',
  size: '1.6х2',
  pieces: 1000
}, metalDatabase);

console.log(`Штуки: ${test4.actual.pieces} (ожидается 1000)`);
console.log(`Вес: ${(test4.actual.weight * 1000).toFixed(2)} кг`);
console.log(`StandardLength: ${test4.standardLength || 'null (используется 1м)'}`);

if (test4.actual.pieces === 1000) {
  console.log('✅ ПРОЙДЕН');
  passed++;
} else {
  console.log('❌ ПРОВАЛЕН');
}

// ============================================================================
// Тест 5: Болты × вес
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('\n🔧 ТЕСТ 5: Болты 2х3 × 0.0002т (ДОЛЖНО ЗАРАБОТАТЬ)\n');
total++;

const test5 = calculateMetal({
  metalType: 'bolt',
  size: '2х3',
  weight: 0.0002  // 0.2 кг (около 1000 болтов 2х3)
}, metalDatabase);

if (!test5.success) {
  console.log(`❌ РАСЧЁТ ПРОВАЛИЛСЯ: ${test5.error}`);
  console.log('❌ ПРОВАЛЕН');
} else {
  console.log(`Штуки: ${test5.actual.pieces} (должны быть > 0)`);
  console.log(`Вес: ${(test5.actual.weight * 1000).toFixed(2)} кг`);
  console.log(`StandardLength: ${test5.standardLength || 'null (используется 1м)'}`);

  if (test5.actual.pieces && test5.actual.pieces > 0) {
    console.log('✅ ПРОЙДЕН');
    passed++;
  } else {
    console.log('❌ ПРОВАЛЕН');
  }
}

// ============================================================================
// ИТОГО
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log(`\n📊 ИТОГО: ${passed}/${total} тестов пройдено (${((passed/total)*100).toFixed(0)}%)\n`);

if (passed === total) {
  console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! Можно деплоить!\n');
  process.exit(0);
} else {
  console.log(`⚠️  ЕСТЬ ПРОБЛЕМЫ! НЕ деплой пока не исправишь!\n`);
  console.log(`❌ Провалено: ${total - passed} тест(ов)\n`);
  process.exit(1);
}
