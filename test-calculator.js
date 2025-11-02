// Тест калькулятора
const calculator = require('./src/calculator');
const fs = require('fs');

// Загрузить базу данных
const metalDatabase = JSON.parse(fs.readFileSync('./database/metals.json', 'utf8'));

console.log('=== Тест калькулятора металлопроката ===\n');

// Тест 1: Арматура А1, диаметр 12мм, длина 10м
console.log('Тест 1: Арматура А1, d=12мм, L=10м');
const test1 = calculator.calculateMetal({
  metalType: 'armature_a1',
  size: 12,
  length: 10,
  isGalvanized: false
}, metalDatabase);
console.log(test1);
console.log('');

// Тест 2: Арматура А1 оцинкованная, диаметр 12мм, вес 100кг
console.log('Тест 2: Арматура А1 оц., d=12мм, вес=100кг');
const test2 = calculator.calculateMetal({
  metalType: 'armature_a1_galv',
  size: 12,
  weight: 100,
  isGalvanized: true,
  galvCoef: 0.03
}, metalDatabase);
console.log(test2);
console.log('');

// Тест 3: Балка 20К1, 5 штук
console.log('Тест 3: Балка 20К1, 5 штук');
const test3 = calculator.calculateMetal({
  metalType: 'beam',
  size: '20К1',
  pieces: 5,
  isGalvanized: false
}, metalDatabase);
console.log(test3);
console.log('');

// Тест 4: Ошибка - металл не найден
console.log('Тест 4: Ошибка - металл не найден');
const test4 = calculator.calculateMetal({
  metalType: 'unknown_metal',
  size: 12,
  length: 10
}, metalDatabase);
console.log(test4);
console.log('');

// Тест 5: Ошибка - размер не найден
console.log('Тест 5: Ошибка - размер не найден для арматуры');
const test5 = calculator.calculateMetal({
  metalType: 'armature_a1',
  size: 999,
  length: 10
}, metalDatabase);
console.log(test5);
console.log('');

console.log('=== Все тесты завершены ===');
