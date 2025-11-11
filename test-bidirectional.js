// Тест двунаправленных расчётов для всех типов металла

const { calculateMetal } = require('./src/calculator');
const fs = require('fs');
const path = require('path');

// Загрузить базу
const dbPath = path.join(__dirname, 'docs', 'database', 'metals.json');
const metalDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🧪 ТЕСТ ДВУНАПРАВЛЕННЫХ РАСЧЁТОВ\n');
console.log('======================================================================\n');

let passedTests = 0;
let failedTests = 0;

// ===== ТЕСТ 1: КРУГ (линейный тип) =====
console.log('1️⃣  КРУГ (линейный тип)\n');

// ➡️ Прямой расчёт: Тонны → Метры → Кол-во штук
console.log('➡️  ПРЯМОЙ РАСЧЁТ: 1 тонна → ? метров → ? штук');
const circleForward = calculateMetal({
  metalType: 'circle',
  size: '10',
  steelType: 'ст3',
  weight: 1  // 1 тонна
}, metalDatabase);

if (circleForward.success) {
  console.log(`   Метры: ${circleForward.length} м`);
  console.log(`   ✅ ПРОЙДЕН`);
  passedTests++;
} else {
  console.log(`   ❌ ПРОВАЛЕН: ${circleForward.error}`);
  failedTests++;
}

// ⬅️ Обратный расчёт: Кол-во штук + Длина → Метры → Тонны
console.log('\n⬅️  ОБРАТНЫЙ РАСЧЁТ: 100 шт × 6м → ? метров → ? тонн');
const circleReverse = calculateMetal({
  metalType: 'circle',
  size: '10',
  steelType: 'ст3',
  pieces: 100,  // 100 штук по 6м
  length: 600   // 100 × 6 = 600 метров
}, metalDatabase);

if (circleReverse.success) {
  console.log(`   Метры: ${circleReverse.length} м`);
  console.log(`   Тонны: ${circleReverse.weight} т`);
  console.log(`   ✅ ПРОЙДЕН`);
  passedTests++;
} else {
  console.log(`   ❌ ПРОВАЛЕН: ${circleReverse.error}`);
  failedTests++;
}

// ===== ТЕСТ 2: ЛЕНТА/ШТРИПС (площадной тип) =====
console.log('\n\n2️⃣  ЛЕНТА/ШТРИПС (площадной тип)\n');

// ➡️ Прямой расчёт: Тонны → Кв.м → Кол-во штук
console.log('➡️  ПРЯМОЙ РАСЧЁТ: 1 тонна → ? кв.м');
const stripForward = calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  weight: 1  // 1 тонна
}, metalDatabase);

if (stripForward.success) {
  console.log(`   Кв.метры: ${stripForward.length} м² (для площадных length = area)`);
  console.log(`   ✅ ПРОЙДЕН`);
  passedTests++;
} else {
  console.log(`   ❌ ПРОВАЛЕН: ${stripForward.error}`);
  failedTests++;
}

// ===== ТЕСТ 3: ЛИСТ ПВ (особый тип с стандартами) =====
console.log('\n\n3️⃣  ЛИСТ ПВ (особый тип с динамическими стандартами)\n');

// ➡️ Прямой расчёт: Тонны → Метры
console.log('➡️  ПРЯМОЙ РАСЧЁТ: 1 тонна → ? метров');
const sheetPVForward = calculateMetal({
  metalType: 'sheet_pv',
  size: '404',
  standard: 'ТУ 0971-001-44028369-2011 т.2',
  weight: 1  // 1 тонна
}, metalDatabase);

if (sheetPVForward.success) {
  console.log(`   Метры: ${sheetPVForward.length} м`);
  console.log(`   ✅ ПРОЙДЕН`);
  passedTests++;
} else {
  console.log(`   ❌ ПРОВАЛЕН: ${sheetPVForward.error}`);
  failedTests++;
}

// ===== ТЕСТ 4: ЛИСТ РИФЛЕНЫЙ (особый тип с рифлением) =====
console.log('\n\n4️⃣  ЛИСТ РИФЛЕНЫЙ (особый тип с рифлением вместо стали)\n');

// ➡️ Прямой расчёт: Тонны → Кв.м
console.log('➡️  ПРЯМОЙ РАСЧЁТ: 1 тонна → ? кв.м');
const sheetCheckeredForward = calculateMetal({
  metalType: 'sheet_checkered',
  size: '2.5',
  riffleType: 'чечевица',
  weight: 1  // 1 тонна
}, metalDatabase);

if (sheetCheckeredForward.success) {
  console.log(`   Кв.метры: ${sheetCheckeredForward.length} м²`);
  console.log(`   ✅ ПРОЙДЕН`);
  passedTests++;
} else {
  console.log(`   ❌ ПРОВАЛЕН: ${sheetCheckeredForward.error}`);
  failedTests++;
}

// ===== ТЕСТ 5: ЛЕНТА С ОЦИНКОВКОЙ =====
console.log('\n\n5️⃣  ЛЕНТА/ШТРИПС ОЦИНК. (с оцинковкой)\n');

// ➡️ Прямой расчёт с оцинковкой: Тонны → Кв.м
console.log('➡️  ПРЯМОЙ РАСЧЁТ: 1 тонна (с оцинковкой 100 г/м²) → ? кв.м');
const stripGalvForward = calculateMetal({
  metalType: 'strip_tape_galv',
  size: '0.5',
  steelType: 'ст3',
  zincOption: '100 г/м²',
  weight: 1  // 1 тонна
}, metalDatabase);

if (stripGalvForward.success) {
  console.log(`   Кв.метры: ${stripGalvForward.length} м²`);
  console.log(`   ✅ ПРОЙДЕН`);
  passedTests++;
} else {
  console.log(`   ❌ ПРОВАЛЕН: ${stripGalvForward.error}`);
  failedTests++;
}

// ===== ИТОГИ =====
console.log('\n\n======================================================================');
console.log('📊 ИТОГОВАЯ СТАТИСТИКА:\n');
console.log(`   Всего тестов: ${passedTests + failedTests}`);
console.log(`   Пройдено: ${passedTests} ✅`);
console.log(`   Провалено: ${failedTests} ❌`);
console.log(`   Успешность: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);
console.log('======================================================================\n');

if (failedTests === 0) {
  console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!\n');
  process.exit(0);
} else {
  console.log('⚠️  ЕСТЬ ПРОВАЛЕННЫЕ ТЕСТЫ!\n');
  process.exit(1);
}
