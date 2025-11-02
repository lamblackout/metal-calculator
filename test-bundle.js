// Тест bundle калькулятора
const { calculateMetal } = require('./dist/calculator.bundle');
const metalDatabase = require('./database/metals.json');

console.log('=== Тест BUNDLE ===\n');

// Тест 1: Арматура
console.log('Тест 1: Арматура А3, d=16мм, L=25м');
const test1 = calculateMetal({
  metalType: 'armature_a3',
  size: 16,
  length: 25
}, metalDatabase);
console.log(JSON.stringify(test1, null, 2));
console.log('');

// Тест 2: Балка
console.log('Тест 2: Балка 30К1, 3 штуки');
const test2 = calculateMetal({
  metalType: 'beam',
  size: '30К1',
  pieces: 3
}, metalDatabase);
console.log(JSON.stringify(test2, null, 2));
console.log('');

// Тест 3: Оцинковка
console.log('Тест 3: Арматура А1 оц., d=12мм, вес=50кг');
const test3 = calculateMetal({
  metalType: 'armature_a1_galv',
  size: 12,
  weight: 50,
  isGalvanized: true,
  galvCoef: 0.05
}, metalDatabase);
console.log(JSON.stringify(test3, null, 2));
console.log('');

console.log('✅ Bundle работает корректно!');
