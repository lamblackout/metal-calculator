const calc = require('./dist/calculator.bundle.js');

console.log('Bundle exports:', Object.keys(calc));

const r = calc.calculateMetal({metalType: 'rope', size: 10, length: 100});
console.log('Результат:', JSON.stringify(r, null, 2));
