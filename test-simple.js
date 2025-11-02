const { calculateMetal } = require('./src/calculator');
const metalDatabase = require('./database/metals.json');

console.log('=== ТЕСТ 1: Арматура А3, d12, 100кг ===');
try {
  const result1 = calculateMetal({
    metalType: 'armature_a3',
    size: 12,
    weight: 100
  }, metalDatabase);
  console.log(JSON.stringify(result1, null, 2));
} catch (error) {
  console.error('ОШИБКА:', error.message);
}

console.log('\n=== ТЕСТ 2: Балка 20К1, 50м ===');
try {
  const result2 = calculateMetal({
    metalType: 'beam',
    size: '20К1',
    length: 50
  }, metalDatabase);
  console.log(JSON.stringify(result2, null, 2));
} catch (error) {
  console.error('ОШИБКА:', error.message);
}

console.log('\n=== ТЕСТ 3: Арматура А1 оц., d10, 5 штук по 12м ===');
try {
  const result3 = calculateMetal({
    metalType: 'armature_a1_galv',
    size: 10,
    pieces: 5,
    isGalvanized: true,
    galvCoef: 0.03
  }, metalDatabase);
  console.log(JSON.stringify(result3, null, 2));
} catch (error) {
  console.error('ОШИБКА:', error.message);
}
