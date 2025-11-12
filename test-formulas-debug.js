// test-formulas-debug.js
const { calculateMetal } = require('./src/calculator');
const database = require('./docs/database/metals.json');

const result = calculateMetal({
  metalType: 'circle',
  size: '5',
  steelType: 'ст3',
  length: 10000
}, database);

console.log('Результат расчёта:');
console.log(JSON.stringify(result, null, 2));
