const { calculateMetal } = require('./dist/calculator.bundle.js');
const db = require('./database/metals.json');

console.log('\n🔍 ПРОВЕРКА: Работа штук ПЕРЕД исправлением\n');
console.log('='.repeat(70));

// Тест 1: Арматура (ДОЛЖНО РАБОТАТЬ)
console.log('\n✅ ТЕСТ 1: Арматура А3 12мм × 1000м (ЭТАЛОН - должно работать)\n');
const test1 = calculateMetal({
  metalType: 'armature_a3',
  size: 12,
  length: 1000
}, db);

console.log(`Длина: ${test1.actual.length} м`);
console.log(`Вес: ${(test1.actual.weight * 1000).toFixed(1)} кг`);
console.log(`Штуки: ${test1.actual.pieces} шт`);
console.log(`StandardLength: ${test1.standardLength} м`);

if (test1.actual.pieces === 86) {
  console.log('✅ АРМАТУРА: Штуки работают!');
} else {
  console.log('❌ АРМАТУРА: ОШИБКА! Ожидалось 86 штук, получено:', test1.actual.pieces);
}

// Тест 2: Катанка (НЕ РАБОТАЕТ)
console.log('\n' + '='.repeat(70));
console.log('\n❌ ТЕСТ 2: Катанка 10мм × 1000м (ПРОБЛЕМА - штуки не работают)\n');

const test2 = calculateMetal({
  metalType: 'wire_rod',
  size: 10,
  steelType: 'ст08',
  length: 1000
}, db);

if (!test2.success) {
  console.log(`❌ РАСЧЁТ ПРОВАЛИЛСЯ: ${test2.error}`);
  console.log('❌ КАТАНКА: ОШИБКА! Расчёт не выполнен');
} else {
  console.log(`Длина: ${test2.actual.length} м`);
  console.log(`Вес: ${(test2.actual.weight * 1000).toFixed(1)} кг`);
  console.log(`Штуки: ${test2.actual.pieces} шт`);
  console.log(`StandardLength: ${test2.standardLength || 'null'}`);

  if (test2.actual.pieces && test2.actual.pieces > 0) {
    console.log('✅ КАТАНКА: Штуки работают!');
  } else {
    console.log('❌ КАТАНКА: ОШИБКА! Штуки не рассчитываются или null');
  }
}

// Тест 3: Болты (НЕ РАБОТАЕТ)
console.log('\n' + '='.repeat(70));
console.log('\n❌ ТЕСТ 3: Болты 1.6х2 × 1000 штук (ПРОБЛЕМА - штуки не показываются)\n');

const test3 = calculateMetal({
  metalType: 'bolt',
  size: '1.6х2',
  pieces: 1000
}, db);

if (!test3.success) {
  console.log(`❌ РАСЧЁТ ПРОВАЛИЛСЯ: ${test3.error}`);
  console.log('❌ БОЛТЫ: ОШИБКА! Расчёт не выполнен');
} else {
  console.log(`Длина: ${test3.actual.length || 'null'} м`);
  console.log(`Вес: ${(test3.actual.weight * 1000).toFixed(1)} кг`);
  console.log(`Штуки: ${test3.actual.pieces} шт`);
  console.log(`StandardLength: ${test3.standardLength || 'null'}`);

  if (test3.actual.pieces === 1000) {
    console.log('✅ БОЛТЫ: Штуки работают!');
  } else {
    console.log('❌ БОЛТЫ: ОШИБКА! Штуки должны быть 1000, получено:', test3.actual.pieces);
  }
}

console.log('\n' + '='.repeat(70));
console.log('\n📋 ВЫВОДЫ:\n');

console.log('1. Арматура (standardLength = 11.7м):');
console.log('   - Штуки рассчитываются: ', test1.actual.pieces ? '✅' : '❌');

console.log('\n2. Катанка (standardLength = ?):');
console.log('   - Штуки рассчитываются: ', test2.success && test2.actual && test2.actual.pieces ? '✅' : '❌');
console.log('   - Причина: standardLength = ', test2.success ? (test2.standardLength || 'null') : 'расчёт провалился', ' → не может посчитать штуки?');

console.log('\n3. Болты (standardLength = ?):');
console.log('   - Штуки показываются: ', test3.success && test3.actual && test3.actual.pieces ? '✅' : '❌');
console.log('   - Причина: standardLength = ', test3.success ? (test3.standardLength || 'null') : 'расчёт провалился', ' → штуки есть но возможно не отображаются?');

console.log('\n' + '='.repeat(70));
