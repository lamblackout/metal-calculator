// check-fasteners.js
const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./docs/database/metals.json','utf-8'));

const fasteners = [
  'bolts',           // Болты
  'screws',          // Винты
  'nuts',            // Гайки
  'nails',           // Гвозди
  'self_tapping_screws',  // Саморезы
  'washers',         // Шайбы
  'studs',           // Шпильки
  'split_pins',      // Шплинты
  'wood_screws'      // Шурупы
];

console.log('Состояние крепежа в базе данных:');
console.log('='.repeat(80));

fasteners.forEach(f => {
  const m = db.metals[f];
  if (m) {
    console.log(`\n${f}:`);
    console.log(`  • Sizes: ${m.sizes ? m.sizes.length : 0}`);
    console.log(`  • Weights: ${m.weights ? Object.keys(m.weights).length : 0}`);
    console.log(`  • Standards: ${m.standards ? Object.keys(m.standards).length : 0}`);
    console.log(`  • Formula: ${m.formula || 'НЕТ'}`);
    console.log(`  • UnitType: ${m.unitType || 'НЕТ'}`);
  } else {
    console.log(`\n${f}: ❌ НЕ НАЙДЕН В БАЗЕ`);
  }
});

console.log('\n' + '='.repeat(80));
