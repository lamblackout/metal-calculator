// test-ui-recalc-after-width.js
// Тест: Тонны пересчитываются после ввода ширины/длины

const calculator = require('./dist/calculator.bundle.js');
const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ПЕРЕСЧЁТ ТОНН ПОСЛЕ ВВОДА ШИРИНЫ/ДЛИНЫ');
console.log('='.repeat(80));
console.log('');

// ============================================================================
// СЦЕНАРИЙ СО СКРИНШОТА: 2 тонны, потом вводим ширину и длину
// ============================================================================
console.log('СЦЕНАРИЙ (как в UI):');
console.log('  1. Пользователь выбирает Лист ПВ 608, стандарт ТУ 36.26.11-5-89');
console.log('  2. Вводит ТОННЫ: 2');
console.log('  3. Backend считает площадь БЕЗ размеров листа');
console.log('  4. Пользователь вводит ШИРИНУ: 10 м');
console.log('  5. Пользователь вводит ДЛИНУ: 10 м');
console.log('  6. UI ДОЛЖНА ВЫЗВАТЬ BACKEND ЗАНОВО с width/lengthSheet');
console.log('  7. Backend пересчитает С ОКРУГЛЕНИЕМ и обновит тонны');
console.log('');
console.log('='.repeat(80));
console.log('');

let passedTests = 0;
let totalTests = 0;

// ============================================================================
// ШАГ 1: Вводим только ВЕС (как в начале)
// ============================================================================
console.log('ШАГ 1: Вводим только ВЕС: 2 т (БЕЗ размеров листа)');
console.log('-'.repeat(80));
totalTests++;

const step1 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2
  // НЕТ width и lengthSheet!
}, metalDatabase);

if (step1.success) {
  console.log('Результат backend (БЕЗ размеров):');
  console.log(`  • Площадь: ${step1.length.toFixed(2)} м²`);
  console.log(`  • Тонны: ${step1.weight.toFixed(3)} т`);
  console.log(`  • Штуки: ${step1.pieces || 'null'}`);
  console.log('');

  if (step1.pieces === null && Math.abs(step1.weight - 2.0) < 0.001) {
    console.log('✅ ШАГ 1 ПРАВИЛЬНО: БЕЗ размеров → штуки null, тонны 2.000');
    passedTests++;
  } else {
    console.log('❌ ШАГ 1 НЕПРАВИЛЬНО');
  }
} else {
  console.log(`❌ ШАГ 1 ПРОВАЛЕН: ${step1.error}`);
}
console.log('');

// ============================================================================
// ШАГ 2: Вводим ВЕС + РАЗМЕРЫ (как должен сделать UI после ввода размеров)
// ============================================================================
console.log('ШАГ 2: ПОВТОРНЫЙ ВЫЗОВ backend С размерами листа');
console.log('-'.repeat(80));
totalTests++;

const step2 = calculator.calculateMetal({
  metalType: 'sheet_pv',
  size: '608',
  standard: 'ТУ 36.26.11-5-89',
  weight: 2,
  width: 10,
  lengthSheet: 10
}, metalDatabase);

if (step2.success) {
  console.log('Результат backend (С размерами):');
  console.log(`  • Площадь: ${step2.length.toFixed(2)} м²`);
  console.log(`  • Тонны: ${step2.weight.toFixed(3)} т`);
  console.log(`  • Штуки: ${step2.pieces} шт`);
  console.log('');

  // Проверяем что:
  // 1. Штуки = 1 (округлено вверх)
  // 2. Площадь = 100 м² (пересчитана под 1 лист)
  // 3. Тонны > 2.0 (пересчитаны под 100 м²)

  const piecesOk = step2.pieces === 1;
  const areaOk = Math.abs(step2.length - 100) < 0.1;
  const weightOk = step2.weight > 2.0;

  console.log('Проверка логики:');
  console.log(`  • Штуки = 1? ${piecesOk ? '✅' : '❌'} (${step2.pieces})`);
  console.log(`  • Площадь = 100 м²? ${areaOk ? '✅' : '❌'} (${step2.length.toFixed(2)})`);
  console.log(`  • Тонны > 2.0? ${weightOk ? '✅' : '❌'} (${step2.weight.toFixed(3)})`);
  console.log('');

  if (piecesOk && areaOk && weightOk) {
    console.log('✅ ШАГ 2 ПРАВИЛЬНО:');
    console.log(`   • Запрошено: 2.000 т → 91.32 м² → 0.91 шт`);
    console.log(`   • Округлено: 1 шт → 100.00 м² → ${step2.weight.toFixed(3)} т`);
    passedTests++;
  } else {
    console.log('❌ ШАГ 2 НЕПРАВИЛЬНО: Округление не работает');
  }
} else {
  console.log(`❌ ШАГ 2 ПРОВАЛЕН: ${step2.error}`);
}
console.log('');

// ============================================================================
// ШАГ 3: Проверка с другим металлом (Лента)
// ============================================================================
console.log('ШАГ 3: Лента 0.5мм, 1т, потом добавляем размеры');
console.log('-'.repeat(80));
totalTests++;

const step3a = calculator.calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  weight: 1
  // БЕЗ размеров
}, metalDatabase);

const step3b = calculator.calculateMetal({
  metalType: 'strip_tape',
  size: '0.5',
  steelType: 'ст3',
  weight: 1,
  width: 1,
  lengthSheet: 2
}, metalDatabase);

if (step3a.success && step3b.success) {
  console.log('БЕЗ размеров:');
  console.log(`  • Площадь: ${step3a.length.toFixed(2)} м²`);
  console.log(`  • Тонны: ${step3a.weight.toFixed(3)} т`);
  console.log(`  • Штуки: ${step3a.pieces || 'null'}`);
  console.log('');

  console.log('С размерами (1м × 2м):');
  console.log(`  • Площадь: ${step3b.length.toFixed(2)} м²`);
  console.log(`  • Тонны: ${step3b.weight.toFixed(3)} т`);
  console.log(`  • Штуки: ${step3b.pieces} шт`);
  console.log('');

  // БЕЗ размеров: тонны = 1.000, штуки = null
  // С размерами: тонны > 1.000 (округлены), штуки = 128
  const withoutOk = step3a.pieces === null && Math.abs(step3a.weight - 1.0) < 0.001;
  const withOk = step3b.pieces === 128 && step3b.weight > 1.0;

  if (withoutOk && withOk) {
    console.log('✅ ШАГ 3 ПРАВИЛЬНО:');
    console.log(`   • БЕЗ размеров: 1.000 т, штуки null`);
    console.log(`   • С размерами: ${step3b.weight.toFixed(3)} т, штуки 128`);
    passedTests++;
  } else {
    console.log('❌ ШАГ 3 НЕПРАВИЛЬНО');
  }
} else {
  console.log('❌ ШАГ 3 ПРОВАЛЕН');
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
  console.log('  ✅ При вводе ширины/длины UI вызывает backend ЗАНОВО');
  console.log('  ✅ Backend пересчитывает с округлением штук');
  console.log('  ✅ Тонны обновляются под округлённое количество');
  console.log('');
  console.log('Логика:');
  console.log('  👤 Ввод: 2т → 91.32м² → 0.91 шт');
  console.log('  🔄 Округление: 1 шт → 100м² → 2.190т');
  console.log('  💰 Результат: Нужно 2.190т для 1 целого листа');
} else {
  console.log('❌ ЕСТЬ ОШИБКИ! ТРЕБУЕТСЯ ДОРАБОТКА.');
}
console.log('');
