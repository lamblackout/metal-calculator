// ТЕСТ: Симуляция UI сценария с катанкой
const { calculateMetal } = require('./dist/calculator.bundle.js');
const db = require('./database/metals.json');

console.log('\n🧪 СИМУЛЯЦИЯ UI СЦЕНАРИЯ: Катанка\n');
console.log('='.repeat(70));
console.log('\n📝 Действия пользователя:');
console.log('   1. Выбрал: Катанка 10мм, ст3');
console.log('   2. Ввёл в поле "Длина": 1000');
console.log('   3. Ожидает: Поле "Штуки" заполнится автоматически\n');
console.log('='.repeat(70));

// Симулируем параметры из UI
const params = {
  metalType: 'wire_rod',
  size: 10,
  steelType: 'ст3',
  length: 1000
};

console.log('\n🔧 ПАРАМЕТРЫ ЗАПРОСА:');
console.log(JSON.stringify(params, null, 2));

// Вызываем расчёт (так же как в UI)
const result = calculateMetal(params, db);

console.log('\n' + '='.repeat(70));
console.log('\n📊 РЕЗУЛЬТАТ РАСЧЁТА:\n');

console.log('result.success:', result.success);
console.log('result.standardLength:', result.standardLength);

if (result.success) {
  console.log('\nresult.actual:');
  console.log('  weight:', result.actual.weight, 'т');
  console.log('  length:', result.actual.length, 'м');
  console.log('  pieces:', result.actual.pieces, 'шт');

  console.log('\n' + '='.repeat(70));
  console.log('\n🔍 АНАЛИЗ ДЛЯ UI:\n');

  // Симулируем условие из UI (строка 656)
  const sourceField = 'length'; // Пользователь вводил длину
  const shouldFillPieces = sourceField !== 'pieces' && result.actual.pieces !== null;

  console.log('sourceField:', sourceField);
  console.log('sourceField !== "pieces":', sourceField !== 'pieces');
  console.log('result.actual.pieces !== null:', result.actual.pieces !== null);
  console.log('\nУсловие (sourceField !== "pieces" && pieces !== null):', shouldFillPieces);

  console.log('\n' + '='.repeat(70));

  if (shouldFillPieces) {
    console.log('\n✅ ВЫВОД: Поле "Штуки" ДОЛЖНО заполниться значением:', result.actual.pieces);
  } else {
    console.log('\n❌ ВЫВОД: Поле "Штуки" НЕ ДОЛЖНО заполниться!');
    if (result.actual.pieces === null) {
      console.log('   ⚠️  ПРИЧИНА: result.actual.pieces = null');
    }
    if (sourceField === 'pieces') {
      console.log('   ⚠️  ПРИЧИНА: sourceField = "pieces" (пользователь вводил штуки)');
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n📋 ПОЛНЫЙ ОБЪЕКТ result.actual:\n');
  console.log(JSON.stringify(result.actual, null, 2));

} else {
  console.log('\n❌ РАСЧЁТ ПРОВАЛИЛСЯ:', result.error);
}

console.log('\n' + '='.repeat(70));
console.log('\n🎯 СЛЕДУЮЩИЙ ШАГ:');
console.log('   Если в консоли всё OK → Проблема в HTML/JS взаимодействии');
console.log('   Если pieces = null → Проблема в src/calculator.js\n');
