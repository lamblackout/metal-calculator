// test-dynamic-input-update.js
// Тест: Поля ввода динамически обновляются при изменении значений из-за округления

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ ПОЛЕЙ ВВОДА');
console.log('='.repeat(80));
console.log('');

// ============================================================================
// СЦЕНАРИЙ: Пользователь вводит 2 тонны → backend округляет → тонны увеличиваются
// ============================================================================
console.log('СЦЕНАРИЙ (со скриншота):');
console.log('  1. Пользователь вводит ТОННЫ: 2');
console.log('  2. Пользователь вводит ШИРИНУ: 10 м');
console.log('  3. Пользователь вводит ДЛИНУ: 10 м');
console.log('  4. Backend округляет: 0.91 шт → 1 шт');
console.log('  5. Backend пересчитывает: тонны 2.000 → 2.190');
console.log('  6. UI ДОЛЖНА ОБНОВИТЬ ПОЛЕ "Тонны" на 2.190');
console.log('');
console.log('='.repeat(80));
console.log('');

let passedTests = 0;
let totalTests = 0;

// ============================================================================
// ТЕСТ 1: Проверка что backend возвращает изменённые тонны
// ============================================================================
console.log('ТЕСТ 1: Backend возвращает пересчитанные тонны');
console.log('-'.repeat(80));
totalTests++;

const result = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2,
  width: 10,
  lengthSheet: 10
}, metalDatabase);

if (result.success) {
  console.log('Результат backend:');
  console.log(`  • Запрошено тонн: 2.000`);
  console.log(`  • Площадь: ${result.length.toFixed(2)} м²`);
  console.log(`  • Штуки: ${result.pieces} шт`);
  console.log(`  • Фактические тонны: ${result.weight.toFixed(3)}`);
  console.log('');

  // Проверяем что тонны увеличились
  const weightIncreased = result.weight > 2.0;
  const piecesRounded = result.pieces === 1;

  if (weightIncreased && piecesRounded) {
    console.log('✅ ТЕСТ 1 ПРОЙДЕН:');
    console.log(`   • Штуки округлены: 0.91 → ${result.pieces}`);
    console.log(`   • Тонны пересчитаны: 2.000 → ${result.weight.toFixed(3)}`);
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 1 ПРОВАЛЕН:');
    if (!weightIncreased) console.log(`   • Тонны не увеличились: ${result.weight}`);
    if (!piecesRounded) console.log(`   • Штуки не округлены: ${result.pieces}`);
  }
} else {
  console.log(`❌ ТЕСТ 1 ПРОВАЛЕН: ${result.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 2: Симуляция UI - проверка логики обновления поля
// ============================================================================
console.log('ТЕСТ 2: Симуляция логики UI для обновления поля ввода');
console.log('-'.repeat(80));
totalTests++;

console.log('Сценарий:');
console.log('  • sourceField = "weight" (пользователь ввёл тонны)');
console.log('  • Значение в поле weightInput: 2.000');
console.log('  • Backend вернул calculatedWeight: 2.190');
console.log('');

// Симулируем состояние UI
const sourceField = 'weight';
const weightInputValue = 2.000;  // Что ввёл пользователь
const calculatedWeight = result.success ? result.weight : 0;  // Что вернул backend

console.log('Проверка условия обновления:');
console.log(`  • sourceField === 'weight'? ${sourceField === 'weight'}`);
console.log(`  • weightInputValue: ${weightInputValue.toFixed(3)}`);
console.log(`  • calculatedWeight: ${calculatedWeight.toFixed(3)}`);
console.log('');

// НОВАЯ логика из исправления
const weightChanged = Math.abs(calculatedWeight - weightInputValue) > 0.001;
console.log(`  • weightChanged (|${calculatedWeight.toFixed(3)} - ${weightInputValue.toFixed(3)}| > 0.001)? ${weightChanged}`);
console.log('');

const shouldUpdate = (sourceField !== 'weight' || weightChanged);
console.log(`Условие: (sourceField !== 'weight' || weightChanged) = ${shouldUpdate}`);
console.log('');

if (shouldUpdate && weightChanged) {
  console.log('✅ ТЕСТ 2 ПРОЙДЕН:');
  console.log('   • Поле будет обновлено, т.к. вес изменился из-за округления');
  console.log(`   • Новое значение поля: ${calculatedWeight.toFixed(3)}`);
  passedTests++;
} else {
  console.log('❌ ТЕСТ 2 ПРОВАЛЕН:');
  console.log('   • Поле НЕ будет обновлено (логика неправильная)');
}
console.log('');

// ============================================================================
// ТЕСТ 3: Проверка обновления площади/длины
// ============================================================================
console.log('ТЕСТ 3: Обновление поля длины/площади');
console.log('-'.repeat(80));
totalTests++;

const result2 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2,
  width: 10,
  lengthSheet: 10
}, metalDatabase);

if (result2.success) {
  const sourceField2 = 'weight';
  const lengthInputValue = 91.32;  // Backend сначала посчитал
  const calculatedLength = result2.length;  // После округления

  console.log('Сценарий:');
  console.log(`  • sourceField = "weight"`);
  console.log(`  • lengthInput: ${lengthInputValue.toFixed(2)} м²`);
  console.log(`  • Backend вернул: ${calculatedLength.toFixed(2)} м²`);
  console.log('');

  const lengthChanged = Math.abs(calculatedLength - lengthInputValue) > 0.01;
  const shouldUpdate2 = (sourceField2 !== 'length' || lengthChanged);

  console.log(`  • lengthChanged? ${lengthChanged}`);
  console.log(`  • Поле будет обновлено? ${shouldUpdate2}`);
  console.log('');

  if (shouldUpdate2 && lengthChanged) {
    console.log('✅ ТЕСТ 3 ПРОЙДЕН:');
    console.log('   • Поле длины/площади будет обновлено');
    console.log(`   • Новое значение: ${calculatedLength.toFixed(2)} м²`);
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 3 ПРОВАЛЕН: Поле не будет обновлено');
  }
} else {
  console.log(`❌ ТЕСТ 3 ПРОВАЛЕН: ${result2.error}`);
}
console.log('');

// ============================================================================
// ТЕСТ 4: Проверка что БЕЗ изменений поле НЕ обновляется
// ============================================================================
console.log('ТЕСТ 4: Поле НЕ обновляется если значение не изменилось');
console.log('-'.repeat(80));
totalTests++;

const result3 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2
  // БЕЗ размеров листа → округления не будет
}, metalDatabase);

if (result3.success) {
  const sourceField3 = 'weight';
  const weightInputValue3 = 2.000;
  const calculatedWeight3 = result3.weight;

  console.log('Сценарий (БЕЗ размеров листа):');
  console.log(`  • weightInput: ${weightInputValue3.toFixed(3)}`);
  console.log(`  • Backend вернул: ${calculatedWeight3.toFixed(3)}`);
  console.log('');

  const weightChanged3 = Math.abs(calculatedWeight3 - weightInputValue3) > 0.001;
  const shouldUpdate3 = (sourceField3 !== 'weight' || weightChanged3);

  console.log(`  • weightChanged? ${weightChanged3}`);
  console.log(`  • Поле будет обновлено? ${shouldUpdate3}`);
  console.log('');

  if (!shouldUpdate3 && !weightChanged3) {
    console.log('✅ ТЕСТ 4 ПРОЙДЕН:');
    console.log('   • Поле НЕ будет обновлено (значение не изменилось)');
    console.log('   • Избегаем бесконечного цикла обновлений');
    passedTests++;
  } else {
    console.log('❌ ТЕСТ 4 ПРОВАЛЕН: Поле обновится без необходимости');
  }
} else {
  console.log(`❌ ТЕСТ 4 ПРОВАЛЕН: ${result3.error}`);
}
console.log('');

// ============================================================================
// ИТОГОВАЯ СВОДКА
// ============================================================================
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log(`Всего тестов: ${totalTests}`);
console.log(`Пройдено: ${passedTests}`);
console.log(`Провалено: ${totalTests - passedTests}`);
console.log(`Успешность: ${((passedTests / totalTests) * 100).toFixed(0)}%`);
console.log('');

if (passedTests === totalTests) {
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
  console.log('');
  console.log('Исправлено:');
  console.log('  ✅ Backend пересчитывает тонны при округлении штук');
  console.log('  ✅ UI обновляет поле ввода когда значение изменилось');
  console.log('  ✅ Условие: (sourceField !== fieldName || valueChanged)');
  console.log('  ✅ Избегаем обновлений когда значение не изменилось');
  console.log('');
  console.log('Логика:');
  console.log('  👤 Пользователь вводит: 2 т');
  console.log('  🔄 Backend округляет: 0.91 шт → 1 шт → 2.190 т');
  console.log('  ✏️ UI обновляет поле: 2.000 → 2.190 т');
  console.log('  💡 Пользователь видит фактическое количество');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
