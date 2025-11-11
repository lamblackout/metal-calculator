const calc = require('./dist/calculator.bundle.js');
const db = require('./database/metals.json');

calc.loadDatabase(db);

const r = calc.calculateMetal({metalType: 'rope', size: 10, length: 100});
console.log('Канат 10мм × 100м:', r.success ? `${r.weight} кг` : r.error);
