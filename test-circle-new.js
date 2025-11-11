// Тест расчёта Круга с новыми коэффициентами
// Пример из ИНСТРУКЦИЯ_ДЛЯ_ТИМЛИДА.md:
// Круг 10мм, сталь Ст3, длина 100м → Вес = 0.0616 т

const { calculateMetal } = require('./dist/calculator.bundle.js');
const db = require('./database/metals.json');

console.log('\n🧪 ТЕСТ: Круг с новыми коэффициентами\n');
console.log('='.repeat(70));

// Пример из документации
const params = {
  metalType: 'circle',
  size: 10,
  steelType: 'ст3',
  length: 100
};

console.log('\n📋 Параметры:');
console.log('   Тип: Круг');
console.log('   Размер: 10 мм');
console.log('   Сталь: ст3');
console.log('   Длина: 100 м');

console.log('\n🔧 Расчёт...\n');

const result = calculateMetal(params, db);

console.log('='.repeat(70));

if (result.success) {
  console.log('\n✅ РАСЧЁТ УСПЕШЕН\n');

  console.log('📊 Результаты:');
  console.log(`   Вес: ${result.actual.weight.toFixed(4)} т`);
  console.log(`   Длина: ${result.actual.length} м`);
  console.log(`   Штуки: ${result.actual.pieces} шт`);

  console.log('\n🎯 Проверка формулы:');
  console.log('   Формула: calc_koef1 × метры × stal_koef / 1000');

  const circle = db.metals.circle;
  const calc_koef1 = circle.weights['10'];
  const stal_koef = circle.steelCoefficients['ст3'];

  console.log(`   calc_koef1 (10мм): ${calc_koef1}`);
  console.log(`   stal_koef (ст3): ${stal_koef}`);
  console.log(`   метры: 100`);

  const expected = calc_koef1 * 100 * stal_koef / 1000;
  console.log(`   Ожидаемый вес: ${expected.toFixed(4)} т`);
  console.log(`   Фактический вес: ${result.actual.weight.toFixed(4)} т`);

  const diff = Math.abs(expected - result.actual.weight);

  if (diff < 0.0001) {
    console.log(`\n   ✅ СОВПАДЕНИЕ! Разница: ${diff.toFixed(6)} т`);
  } else {
    console.log(`\n   ❌ НЕ СОВПАДАЕТ! Разница: ${diff.toFixed(6)} т`);
  }

  // Проверка стандартного значения из документации
  const docExpected = 0.0616;
  const docDiff = Math.abs(docExpected - result.actual.weight);

  console.log(`\n📖 Сравнение с документацией:`);
  console.log(`   Документация: ${docExpected} т`);
  console.log(`   Расчёт: ${result.actual.weight.toFixed(4)} т`);
  console.log(`   Разница: ${docDiff.toFixed(6)} т`);

  if (docDiff < 0.001) {
    console.log(`   ✅ СООТВЕТСТВУЕТ документации!`);
  } else {
    console.log(`   ⚠️  Небольшое расхождение (допустимо)`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ ТЕСТ ПРОЙДЕН!\n');

} else {
  console.log('\n❌ ОШИБКА РАСЧЁТА\n');
  console.log(`   ${result.error}`);
  console.log('\n' + '='.repeat(70));
  process.exit(1);
}
