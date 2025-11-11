// Тест для проверки ГОСТ у Лист ПВ
const { calculateMetal } = require('./dist/calculator.bundle.js');
const db = require('./database/metals.json');

console.log('\n🧪 ПРОВЕРКА ГОСТ ДЛЯ ЛИСТ ПВ\n');
console.log('='.repeat(70));

// Проверяем что в базе данных есть gosts.all
const sheetPV = db.metals.sheet_pv;
console.log('\n📦 Лист ПВ в базе данных:');
console.log('   name:', sheetPV.name);
console.log('   gosts:', JSON.stringify(sheetPV.gosts, null, 2));

// Проверяем что калькулятор возвращает правильный ГОСТ
const result = calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  length: 10
}, db);

console.log('\n📊 Результат расчёта:');
console.log('   success:', result.success);
console.log('   gost:', result.gost);

if (result.gost === 'лист просечно-вытяжной (ПВЛ)') {
  console.log('\n✅ ГОСТ отображается правильно!');
  process.exit(0);
} else {
  console.log('\n❌ ГОСТ неправильный! Ожидалось: "лист просечно-вытяжной (ПВЛ)"');
  process.exit(1);
}
