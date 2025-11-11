// Прямая проверка формулы без округления
const db = require('./database/metals.json');

const circle = db.metals.circle;

console.log('\n🔍 ПРЯМАЯ ПРОВЕРКА ФОРМУЛЫ ДЛЯ КРУГА\n');
console.log('='.repeat(70));

const size = '10';
const steelType = 'ст3';
const length = 100;

const calc_koef1 = circle.weights[size];
const stal_koef = circle.steelCoefficients[steelType];

console.log('\n📊 Данные из базы:');
console.log(`   calc_koef1 (размер ${size}мм): ${calc_koef1}`);
console.log(`   stal_koef (${steelType}): ${stal_koef}`);

console.log('\n🧮 Формула: Вес (т) = calc_koef1 × метры × stal_koef / 1000');
console.log(`   Вес = ${calc_koef1} × ${length} × ${stal_koef} / 1000`);

const weight = calc_koef1 * length * stal_koef / 1000;
console.log(`   Вес = ${weight.toFixed(6)} т`);

console.log('\n📖 Ожидаемое значение из документации: 0.0616 т');
console.log(`   Расчётное значение: ${weight.toFixed(4)} т`);
console.log(`   Разница: ${Math.abs(weight - 0.0616).toFixed(6)} т`);

if (Math.abs(weight - 0.0616) < 0.0001) {
  console.log('\n✅ ФОРМУЛА ВЕРНА!\n');
} else {
  console.log('\n❌ РАСХОЖДЕНИЕ!\n');
}

console.log('='.repeat(70));

// Также проверим вес 1 метра
console.log('\n🔍 Проверка веса 1 метра:');
const weightPerMeter = calc_koef1 * stal_koef;
console.log(`   weightPerMeter = ${calc_koef1} × ${stal_koef}`);
console.log(`   weightPerMeter = ${weightPerMeter.toFixed(6)} кг/м`);
console.log(`   Вес 100м = ${(weightPerMeter * 100 / 1000).toFixed(6)} т`);

console.log('\n='.repeat(70));

// Проверим что происходит с округлением
console.log('\n📏 С учётом округления кратно штукам:');
const standardLength = 12; // для круга
const pieces = Math.ceil(length / standardLength);
const actualLength = pieces * standardLength;
const actualWeight = calc_koef1 * actualLength * stal_koef / 1000;

console.log(`   Запрошено: ${length} м`);
console.log(`   Стандартная длина: ${standardLength} м`);
console.log(`   Штук: ceil(${length}/${standardLength}) = ${pieces}`);
console.log(`   Фактическая длина: ${pieces} × ${standardLength} = ${actualLength} м`);
console.log(`   Фактический вес: ${actualWeight.toFixed(6)} т`);

console.log('\n='.repeat(70));
console.log();
