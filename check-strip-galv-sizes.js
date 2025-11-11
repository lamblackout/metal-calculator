const db = require('./docs/database/metals.json');
const m = db.metals.strip_tape_galv;

const required = [
  "0.1", "0.2", "0.25", "0.28", "0.3", "0.35", "0.38", "0.4", "0.45", "0.5",
  "0.55", "0.6", "0.65", "0.68", "0.7", "0.75", "0.78", "0.8", "0.87", "0.9",
  "0.95", "0.97", "0.98", "1", "1.1", "1.15", "1.17", "1.2", "1.3", "1.4",
  "1.45", "1.47", "1.5", "1.6", "1.7", "1.78", "1.8", "1.96", "1.98", "2",
  "2.46", "2.5", "2.95", "3", "3.45", "3.5", "4", "5.5", "6"
];

console.log('ПРОВЕРКА РАЗМЕРОВ strip_tape_galv:');
console.log('Требуется по промпту:', required.length);
console.log('Есть в базе:', m.sizes.length);
console.log('');

let match = true;
for (let i = 0; i < required.length; i++) {
  if (m.sizes[i] !== required[i]) {
    console.log('НЕСОВПАДЕНИЕ на позиции', i, ':', 'требуется', required[i], ', есть', m.sizes[i]);
    match = false;
  }
}

if (match && m.sizes.length === required.length) {
  console.log('✅ ВСЕ 49 РАЗМЕРОВ ПОЛНОСТЬЮ СОВПАДАЮТ С ПРОМПТОМ!');
} else {
  console.log('❌ ЕСТЬ НЕСОВПАДЕНИЯ!');
}

console.log('');
console.log('ПРОВЕРКА ОТСУТСТВУЮЩИХ ПОЛЕЙ:');
console.log('steelGrades:', m.steelGrades ? 'ЕСТЬ (' + m.steelGrades.length + ')' : '❌ НЕТ (требуется 137)');
console.log('steelDensities:', m.steelDensities ? 'ЕСТЬ' : '❌ НЕТ (требуется 137 коэффициентов)');
console.log('galvanization:', m.galvanization ? 'ЕСТЬ (' + m.galvanization.length + ')' : '❌ НЕТ (требуется 27)');
console.log('galvanizationWeights:', m.galvanizationWeights ? 'ЕСТЬ' : '❌ НЕТ (требуется 27 коэффициентов)');
console.log('gost:', m.gost, '→ должен быть "/"');
