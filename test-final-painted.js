// test-final-painted.js
// Тесты для "Лента/штрипс окраш." согласно промпту

const fs = require('fs');

console.log('='.repeat(80));
console.log('🧪 ТЕСТЫ: ЛЕНТА/ШТРИПС ОКРАШ.');
console.log('='.repeat(80));
console.log('');

const db = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));
const metal = db.metals.strip_tape_painted;

// Формула: Вес (т) = (calc_koef1 + calc_ocink_koef) × кв.метры × stal_koef / 1000
function calculateWeight(thickness, area, steelDensity, galvWeight) {
  const weightKg = (thickness + galvWeight) * area * steelDensity;
  const weightTons = weightKg / 1000;
  return { kg: weightKg, tons: weightTons };
}

// ТЕСТ 1
console.log('ТЕСТ 1: 0.3 мм, 10 м², ст3, 100 г/м²');
const test1 = calculateWeight(0.3, 10, metal.steelDensities['ст3'], metal.galvanizationWeights['100 г/м²']);
console.log('Расчёт: (0.3 + 0.1) × 10 × 7.85 / 1000 = ' + test1.tons.toFixed(5) + ' т');
console.log('Ожидаемо: 0.03185 т');
console.log('Получено: ' + test1.tons.toFixed(5) + ' т');
const test1Pass = Math.abs(test1.tons - 0.03185) < 0.0001;
console.log(test1Pass ? '✅ ТЕСТ 1 ПРОЙДЕН' : '❌ ТЕСТ 1 ПРОВАЛЕН');
console.log('');

// ТЕСТ 2
console.log('ТЕСТ 2: 0.5 мм, 20 м², ст08, 60 г/м²');
const test2 = calculateWeight(0.5, 20, metal.steelDensities['ст08'], metal.galvanizationWeights['60 г/м²']);
console.log('Расчёт: (0.5 + 0.06) × 20 × 7.871 / 1000 = ' + test2.tons.toFixed(5) + ' т');
console.log('Ожидаемо: 0.08816 т');
console.log('Получено: ' + test2.tons.toFixed(5) + ' т');
const test2Pass = Math.abs(test2.tons - 0.08816) < 0.0001;
console.log(test2Pass ? '✅ ТЕСТ 2 ПРОЙДЕН' : '❌ ТЕСТ 2 ПРОВАЛЕН');
console.log('');

// ТЕСТ 3
console.log('ТЕСТ 3: 1 мм, 5 м², 09Г2С, нет');
const test3 = calculateWeight(1, 5, metal.steelDensities['09Г2С'], metal.galvanizationWeights['нет']);
console.log('Расчёт: (1 + 0) × 5 × 7.85 / 1000 = ' + test3.tons.toFixed(5) + ' т');
console.log('Ожидаемо: 0.03925 т');
console.log('Получено: ' + test3.tons.toFixed(5) + ' т');
const test3Pass = Math.abs(test3.tons - 0.03925) < 0.0001;
console.log(test3Pass ? '✅ ТЕСТ 3 ПРОЙДЕН' : '❌ ТЕСТ 3 ПРОВАЛЕН');
console.log('');

// ИТОГ
console.log('='.repeat(80));
console.log('ИТОГ:');
const allPassed = test1Pass && test2Pass && test3Pass;
if (allPassed) {
  console.log('✅✅✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ (3/3)');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ');
  console.log('  Тест 1:', test1Pass ? '✅' : '❌');
  console.log('  Тест 2:', test2Pass ? '✅' : '❌');
  console.log('  Тест 3:', test3Pass ? '✅' : '❌');
}
console.log('='.repeat(80));
console.log('');
