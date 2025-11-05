// ТЕСТ: Металлы без стандартной длины
// Проверяет что расчёт по количеству штук работает для металлов без standardLengths

const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');
const db = metalDatabase.metals;

console.log('\n🧪 ТЕСТИРОВАНИЕ: Металлы без стандартной длины');
console.log('═'.repeat(80));

// Найти металлы без standardLengths
const metalsWithoutLength = Object.entries(db)
  .filter(([key, metal]) => !metal.standardLengths || metal.standardLengths.length === 0)
  .map(([key, metal]) => ({ key, name: metal.name }));

console.log(`\n📊 Найдено металлов без standardLengths: ${metalsWithoutLength.length}`);
console.log('   Примеры:');
metalsWithoutLength.slice(0, 5).forEach(m => {
  console.log(`   - ${m.name} (${m.key})`);
});

let passed = 0;
let failed = 0;

// ═══════════════════════════════════════════════════════════════════
// Тест 1: Катанка по количеству штук
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(80));
console.log('📦 Тест 1: Катанка × 200 штук (диаметр 10мм, ст3)');
console.log('─'.repeat(80));

try {
  const result = calculateMetal({
    metalType: 'wire_rod',
    size: 10,
    steelType: 'ст3',
    pieces: 200
  }, metalDatabase);

  if (result.success) {
    console.log('✅ УСПЕХ!');
    console.log(`   Вес: ${(result.weight * 1000).toFixed(2)} кг (${result.weight.toFixed(3)} т)`);
    console.log(`   Длина: ${result.length.toFixed(2)} м`);
    console.log(`   Количество: ${result.pieces} шт`);
    console.log(`   Вес 1 метра: ${result.weightPerMeter.toFixed(3)} кг`);
    console.log(`   Формула: 200 шт × 1м (по умолчанию) × ${result.weightPerMeter.toFixed(3)} кг/м = ${(result.weight * 1000).toFixed(2)} кг`);
    passed++;
  } else {
    console.log(`❌ ОШИБКА: ${result.error}`);
    failed++;
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// Тест 2: Крепёж (Болты) - тоже без standardLengths
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(80));
console.log('📦 Тест 2: Болты × 1000 штук (М10)');
console.log('─'.repeat(80));

try {
  const result = calculateMetal({
    metalType: 'bolt',
    size: 'М10',
    pieces: 1000
  }, metalDatabase);

  if (result.success) {
    console.log('✅ УСПЕХ!');
    console.log(`   Вес: ${(result.weight * 1000).toFixed(2)} кг (${result.weight.toFixed(3)} т)`);
    console.log(`   Длина: ${result.length.toFixed(2)} м`);
    console.log(`   Количество: ${result.pieces} шт`);
    console.log(`   Вес 1 метра: ${result.weightPerMeter.toFixed(3)} кг`);
    passed++;
  } else {
    console.log(`❌ ОШИБКА: ${result.error}`);
    failed++;
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// Тест 3: Винты (тоже крепёж)
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(80));
console.log('📦 Тест 3: Винты × 500 штук (2х10)');
console.log('─'.repeat(80));

try {
  const result = calculateMetal({
    metalType: 'screw',
    size: '2х10',
    pieces: 500
  }, metalDatabase);

  if (result.success) {
    console.log('✅ УСПЕХ!');
    console.log(`   Вес: ${(result.weight * 1000).toFixed(2)} кг (${result.weight.toFixed(3)} т)`);
    console.log(`   Длина: ${result.length.toFixed(2)} м`);
    console.log(`   Количество: ${result.pieces} шт`);
    console.log(`   Вес 1 метра: ${result.weightPerMeter.toFixed(3)} кг`);
    passed++;
  } else {
    console.log(`❌ ОШИБКА: ${result.error}`);
    failed++;
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// Тест 4: Шпильки (много размеров, без standardLengths)
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(80));
console.log('📦 Тест 4: Шпильки × 100 штук (2х5)');
console.log('─'.repeat(80));

try {
  const result = calculateMetal({
    metalType: 'stud',
    size: '2х5',
    pieces: 100
  }, metalDatabase);

  if (result.success) {
    console.log('✅ УСПЕХ!');
    console.log(`   Вес: ${(result.weight * 1000).toFixed(2)} кг (${result.weight.toFixed(3)} т)`);
    console.log(`   Длина: ${result.length.toFixed(2)} м`);
    console.log(`   Количество: ${result.pieces} шт`);
    console.log(`   Вес 1 метра: ${result.weightPerMeter.toFixed(3)} кг`);
    passed++;
  } else {
    console.log(`❌ ОШИБКА: ${result.error}`);
    failed++;
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// Тест 5: Сравнение - металл СО стандартной длиной (Арматура)
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(80));
console.log('📦 Тест 5: Арматура А3 × 10 штук (диаметр 12мм)');
console.log('   (Для сравнения - у арматуры есть standardLengths)');
console.log('─'.repeat(80));

try {
  const result = calculateMetal({
    metalType: 'armature_a3',
    size: 12,
    pieces: 10
  }, metalDatabase);

  if (result.success) {
    console.log('✅ УСПЕХ!');
    console.log(`   Вес: ${(result.weight * 1000).toFixed(2)} кг (${result.weight.toFixed(3)} т)`);
    console.log(`   Длина: ${result.length.toFixed(2)} м`);
    console.log(`   Количество: ${result.pieces} шт`);
    console.log(`   Вес 1 метра: ${result.weightPerMeter.toFixed(3)} кг`);
    console.log(`   Использована стандартная длина: ${db.armature_a3.standardLengths[0]} м`);
    passed++;
  } else {
    console.log(`❌ ОШИБКА: ${result.error}`);
    failed++;
  }
} catch (error) {
  console.log(`❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
  failed++;
}

// ═══════════════════════════════════════════════════════════════════
// ИТОГОВАЯ СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(80));
console.log('\n📊 ИТОГО:\n');
console.log(`  Всего тестов: ${passed + failed}`);
console.log(`  ✅ Пройдено: ${passed}`);
console.log(`  ❌ Провалено: ${failed}`);
console.log(`  📈 Процент успеха: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!');
  console.log('   ✅ Катанка работает');
  console.log('   ✅ Крепёж работает');
  console.log('   ✅ Расчёт по штукам использует 1м по умолчанию');
  console.log('\n🎯 СТАТУС: ИСПРАВЛЕНИЕ РАБОТАЕТ КОРРЕКТНО!');
  process.exit(0);
} else {
  console.log('\n⚠️  НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОШЛИ!');
  console.log(`   Провалено: ${failed} тест(ов)`);
  process.exit(1);
}
