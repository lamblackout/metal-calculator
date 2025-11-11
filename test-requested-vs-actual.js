// ТЕСТ: Запрошенные vs Фактические значения
// Проверяет что результат содержит requested/actual/difference

const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('\n🧪 ТЕСТ: Запрошенные vs Фактические значения\n');
console.log('='.repeat(70));

let passed = 0;
let failed = 0;

// Тест 1: Арматура 1000м (должна округлиться до 86 штук × 11.7м)
console.log('\n📦 ТЕСТ 1: Арматура А3 12мм × 1000 метров\n');

const test1 = calculateMetal({
  metalType: 'armature_a3',
  size: 12,
  length: 1000
}, metalDatabase);

if (!test1.success) {
  console.log(`❌ ОШИБКА: ${test1.error}`);
  failed++;
} else {
  console.log('ЗАПРОШЕНО:');
  console.log(`  ${test1.requested.label}`);

  console.log('\nФАКТИЧЕСКИ (кратно штукам):');
  console.log(`  Штуки: ${test1.actual.pieces} шт × ${test1.standardLength}м`);
  console.log(`  Длина: ${test1.actual.length} м`);
  console.log(`  Вес: ${test1.actual.weight} т (${(test1.actual.weight * 1000).toFixed(1)} кг)`);

  if (test1.difference) {
    console.log('\nРАЗНИЦА:');
    if (test1.difference.length) console.log(`  Длина: ${test1.difference.length}`);
    if (test1.difference.weight) console.log(`  Вес: ${test1.difference.weight}`);
  }

  console.log('\n✅ ОЖИДАЕТСЯ:');
  console.log(`  Стандартная длина: 11.7м (не 12м!)`);
  console.log(`  Штуки: 86 шт (1000 / 11.7 = 85.47 → округлено)`);
  console.log(`  Длина: 1006.2 м (86 × 11.7)`);
  console.log(`  Разница: +6.2м`);

  const expectedPieces = Math.ceil(1000 / 11.7);
  const expectedLength = expectedPieces * 11.7;

  const pass1 = test1.standardLength === 11.7 &&
                test1.actual.pieces === expectedPieces &&
                Math.abs(test1.actual.length - expectedLength) < 0.1 &&
                test1.difference !== null &&
                test1.difference.length !== undefined;

  if (pass1) {
    console.log('\n✅ ТЕСТ 1 ПРОЙДЕН');
    passed++;
  } else {
    console.log('\n❌ ТЕСТ 1 ПРОВАЛЕН');
    console.log(`   standardLength: ${test1.standardLength} (ожидается 11.7)`);
    console.log(`   pieces: ${test1.actual.pieces} (ожидается ${expectedPieces})`);
    console.log(`   length: ${test1.actual.length} (ожидается ${expectedLength})`);
    console.log(`   difference: ${test1.difference ? 'есть' : 'отсутствует'}`);
    failed++;
  }
}

console.log('\n' + '='.repeat(70));

// Тест 2: Балка 1000кг
console.log('\n📦 ТЕСТ 2: Балка 30Б1 × 1000 кг\n');

const test2 = calculateMetal({
  metalType: 'beam',
  size: '30Б1',
  weight: 1
}, metalDatabase);

if (!test2.success) {
  console.log(`❌ ОШИБКА: ${test2.error}`);
  failed++;
} else {
  console.log('ЗАПРОШЕНО:');
  console.log(`  ${test2.requested.label}`);

  console.log('\nФАКТИЧЕСКИ (кратно штукам):');
  console.log(`  Штуки: ${test2.actual.pieces} шт × ${test2.standardLength}м`);
  console.log(`  Длина: ${test2.actual.length} м`);
  console.log(`  Вес: ${test2.actual.weight} т (${(test2.actual.weight * 1000).toFixed(0)} кг)`);

  if (test2.difference) {
    console.log('\nРАЗНИЦА:');
    if (test2.difference.weight) console.log(`  Вес: ${test2.difference.weight}`);
  }

  console.log('\n✅ ОЖИДАЕТСЯ:');
  console.log(`  Штуки: 3 шт`);
  console.log(`  Вес: 1.152 т (1152 кг)`);
  console.log(`  Разница: +152 кг`);

  const pass2 = test2.actual.pieces === 3 &&
                test2.actual.length === 36 &&
                Math.abs(test2.actual.weight - 1.152) < 0.01 &&
                test2.difference !== null &&
                test2.difference.weight !== undefined;

  if (pass2) {
    console.log('\n✅ ТЕСТ 2 ПРОЙДЕН');
    passed++;
  } else {
    console.log('\n❌ ТЕСТ 2 ПРОВАЛЕН');
    console.log(`   pieces: ${test2.actual.pieces} (ожидается 3)`);
    console.log(`   length: ${test2.actual.length} (ожидается 36)`);
    console.log(`   weight: ${test2.actual.weight} (ожидается 1.152)`);
    console.log(`   difference: ${test2.difference ? JSON.stringify(test2.difference) : 'отсутствует'}`);
    failed++;
  }
}

console.log('\n' + '='.repeat(70));

// Тест 3: Штуки (разницы быть не должно)
console.log('\n📦 ТЕСТ 3: Арматура А3 12мм × 86 штук\n');

const test3 = calculateMetal({
  metalType: 'armature_a3',
  size: 12,
  pieces: 86
}, metalDatabase);

if (!test3.success) {
  console.log(`❌ ОШИБКА: ${test3.error}`);
  failed++;
} else {
  console.log('ЗАПРОШЕНО:');
  console.log(`  ${test3.requested.label}`);

  console.log('\nФАКТИЧЕСКИ:');
  console.log(`  Штуки: ${test3.actual.pieces} шт`);
  console.log(`  Длина: ${test3.actual.length} м`);
  console.log(`  Вес: ${(test3.actual.weight * 1000).toFixed(1)} кг`);

  console.log('\nРАЗНИЦА:');
  console.log(`  ${test3.difference ? JSON.stringify(test3.difference) : 'Нет (правильно!)'}`);

  const expectedLength = 86 * 11.7;
  const pass3 = test3.actual.pieces === 86 &&
                Math.abs(test3.actual.length - expectedLength) < 0.1 &&
                test3.difference === null;

  if (pass3) {
    console.log('\n✅ ТЕСТ 3 ПРОЙДЕН (разницы нет, как и ожидалось)');
    passed++;
  } else {
    console.log('\n❌ ТЕСТ 3 ПРОВАЛЕН');
    console.log(`   pieces: ${test3.actual.pieces} (ожидается 86)`);
    console.log(`   length: ${test3.actual.length} (ожидается ${expectedLength})`);
    console.log(`   difference: ${test3.difference} (ожидается null)`);
    failed++;
  }
}

console.log('\n' + '='.repeat(70));

// Тест 4: Проверка обратной совместимости
console.log('\n📦 ТЕСТ 4: Обратная совместимость (result.weight напрямую)\n');

const test4 = calculateMetal({
  metalType: 'armature_a3',
  size: 12,
  length: 1000
}, metalDatabase);

if (!test4.success) {
  console.log(`❌ ОШИБКА: ${test4.error}`);
  failed++;
} else {
  console.log('Проверка старого API:');
  console.log(`  result.weight: ${test4.weight} т`);
  console.log(`  result.length: ${test4.length} м`);
  console.log(`  result.pieces: ${test4.pieces} шт`);

  console.log('\nПроверка нового API:');
  console.log(`  result.actual.weight: ${test4.actual.weight} т`);
  console.log(`  result.actual.length: ${test4.actual.length} м`);
  console.log(`  result.actual.pieces: ${test4.actual.pieces} шт`);

  const pass4 = test4.weight === test4.actual.weight &&
                test4.length === test4.actual.length &&
                test4.pieces === test4.actual.pieces;

  if (pass4) {
    console.log('\n✅ ТЕСТ 4 ПРОЙДЕН (обратная совместимость сохранена)');
    passed++;
  } else {
    console.log('\n❌ ТЕСТ 4 ПРОВАЛЕН (обратная совместимость нарушена)');
    failed++;
  }
}

console.log('\n' + '='.repeat(70));

const total = passed + failed;
console.log(`\n📊 ИТОГО: ${passed}/${total} тестов пройдено\n`);

if (failed === 0) {
  console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
  console.log('   ✅ standardLength = 11.7м для арматуры');
  console.log('   ✅ Структура requested/actual/difference работает');
  console.log('   ✅ Разница показывается корректно');
  console.log('   ✅ Обратная совместимость сохранена\n');
  console.log('🎯 СТАТУС: ФУНКЦИОНАЛ РАБОТАЕТ КОРРЕКТНО!');
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} ТЕСТ(ОВ) НЕ ПРОШЛИ!`);
  process.exit(1);
}
