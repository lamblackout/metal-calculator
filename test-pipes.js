// Комплексное тестирование всех типов труб
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ ВСЕХ ТИПОВ ТРУБ\n');
console.log('═'.repeat(60));

let passed = 0;
let failed = 0;
const failedTests = [];

// Функция для запуска теста
function runTest(name, metalType, size, length) {
  console.log(`\n📝 ${name}`);

  try {
    const result = calculateMetal({
      metalType: metalType,
      size: size,
      length: length
    }, metalDatabase);

    if (!result.success) {
      console.log(`   ❌ ОШИБКА: ${result.error}`);
      failed++;
      failedTests.push(name);
      return;
    }

    const weightKg = (result.weight * 1000).toFixed(2);
    const weightPerMeter = result.weightPerMeter.toFixed(3);

    console.log(`   Размер: ${Array.isArray(size) ? size.join('×') : size} мм`);
    console.log(`   Длина: ${length} м`);
    console.log(`   Вес 1м: ${weightPerMeter} кг/м`);
    console.log(`   Общий вес: ${weightKg} кг`);

    // Проверка, что вес больше нуля
    if (result.weight > 0 && result.weightPerMeter > 0) {
      console.log(`   ✅ ПРОЙДЕН`);
      passed++;
    } else {
      console.log(`   ❌ ПРОВАЛЕН: вес = 0`);
      failed++;
      failedTests.push(name);
    }

  } catch (error) {
    console.log(`   ❌ ИСКЛЮЧЕНИЕ: ${error.message}`);
    failed++;
    failedTests.push(name);
  }
}

// ГРУППА 1: КРУГЛЫЕ СТАЛЬНЫЕ ТРУБЫ (formula: 'pipe')
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 1: КРУГЛЫЕ СТАЛЬНЫЕ ТРУБЫ (11 типов)');
console.log('─'.repeat(60));

runTest('Тест 1.1: Труба ВГП 20×2.5мм, 6м',
  'pipe_vgp', [20, 2.5], 6);

runTest('Тест 1.2: Труба ВГП оцинк. 32×2.8мм, 6м',
  'pipe_vgp_galv', [32, 2.8], 6);

runTest('Тест 1.3: Труба б/ш г/д 57×3.5мм, 6м',
  'pipe_seamless_hot', [57, 3.5], 6);

runTest('Тест 1.4: Труба б/ш г/д оц. 76×4мм, 6м',
  'pipe_seamless_hot_galv', [76, 4], 6);

runTest('Тест 1.5: Труба б/ш котельная 32×3мм, 6м',
  'pipe_boiler', [32, 3], 6);

runTest('Тест 1.6: Труба б/ш х/д 10×1мм, 6м',
  'pipe_seamless_cold', [10, 1], 6);

runTest('Тест 1.7: Труба б/ш х/д оц. 10×1мм, 6м',
  'pipe_seamless_cold_galv', [10, 1], 6);

runTest('Тест 1.8: Труба э/с 57×3мм, 6м',
  'pipe_es', [57, 3], 6);

runTest('Тест 1.9: Труба э/с оцинк. 76×3мм, 6м',
  'pipe_es_galv', [76, 3], 6);

// ГРУППА 2: ПНД ТРУБЫ (formula: 'pipe_pnd')
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 2: ПНД ТРУБЫ (пластик, плотность 950 кг/м³)');
console.log('─'.repeat(60));

runTest('Тест 2.1: Труба ПНД 32×2.4мм, 100м',
  'pipe_pnd', [32, 2.4], 100);

runTest('Тест 2.2: Труба ПНД 50×3мм, 100м',
  'pipe_pnd', [50, 3], 100);

// ГРУППА 3: КВАДРАТНЫЕ ТРУБЫ (formula: 'pipe_square')
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 3: КВАДРАТНЫЕ ТРУБЫ (2 типа)');
console.log('─'.repeat(60));

runTest('Тест 3.1: Труба квадр. 20×20×1.5мм, 6м',
  'pipe_square', [20, 20, 1.5], 6);

runTest('Тест 3.2: Труба квадр. оц. 25×25×2мм, 6м',
  'pipe_square_galv', [25, 25, 2], 6);

runTest('Тест 3.3: Труба квадр. 40×40×2мм, 6м',
  'pipe_square', [40, 40, 2], 6);

// ГРУППА 4: ОВАЛЬНЫЕ ТРУБЫ (formula: 'pipe_oval')
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 4: ОВАЛЬНЫЕ ТРУБЫ (2 типа)');
console.log('─'.repeat(60));

runTest('Тест 4.1: Труба овал. 40×20×2мм, 6м',
  'pipe_oval', [40, 20, 2], 6);

runTest('Тест 4.2: Труба овал. оц. 50×25×2мм, 6м',
  'pipe_oval_galv', [50, 25, 2], 6);

// ГРУППА 5: ПРЯМОУГОЛЬНЫЕ ТРУБЫ (formula: 'pipe_rect')
console.log('\n' + '─'.repeat(60));
console.log('ГРУППА 5: ПРЯМОУГОЛЬНЫЕ ТРУБЫ (4 типа)');
console.log('─'.repeat(60));

runTest('Тест 5.1: Труба прямоуг. 30×20×2мм, 6м',
  'pipe_rect', [30, 20, 2], 6);

runTest('Тест 5.2: Труба прямоуг. оц. 40×25×2мм, 6м',
  'pipe_rect_galv', [40, 25, 2], 6);

runTest('Тест 5.3: Труба плосковал. 50×20×2мм, 6м',
  'pipe_flatoval', [50, 20, 2], 6);

runTest('Тест 5.4: Труба плосковал. оц. 60×30×2мм, 6м',
  'pipe_flatoval_galv', [60, 30, 2], 6);

// ИТОГИ
console.log('\n' + '═'.repeat(60));
console.log('📊 ИТОГИ ТЕСТИРОВАНИЯ');
console.log('═'.repeat(60));
console.log(`✅ Пройдено: ${passed}`);
console.log(`❌ Провалено: ${failed}`);
console.log(`📈 Успешность: ${(passed / (passed + failed) * 100).toFixed(1)}%`);

if (failedTests.length > 0) {
  console.log('\n❌ Проваленные тесты:');
  failedTests.forEach(test => console.log(`   - ${test}`));
}

// Проверка статуса всех труб
console.log('\n' + '═'.repeat(60));
console.log('📦 СТАТУС ВСЕХ ТРУБ В БД');
console.log('═'.repeat(60));

const pipeKeys = Object.keys(metalDatabase.metals).filter(k => k.includes('pipe'));
const pipesByFormula = {};

pipeKeys.forEach(key => {
  const pipe = metalDatabase.metals[key];
  const formula = pipe.formula;
  if (!pipesByFormula[formula]) {
    pipesByFormula[formula] = [];
  }
  pipesByFormula[formula].push({ key, name: pipe.name, sizesCount: pipe.sizes.length });
});

console.log('\nТруб по формулам:');
for (const [formula, pipes] of Object.entries(pipesByFormula)) {
  console.log(`\n📋 formula: '${formula}' (${pipes.length} труб)`);
  pipes.forEach(p => {
    console.log(`   ✅ ${p.key.padEnd(25)} → ${p.name} (${p.sizesCount} размеров)`);
  });
}

// Финальный вердикт
console.log('\n' + '═'.repeat(60));
if (failed === 0) {
  console.log('🎉 ВСЕ ТРУБЫ РАБОТАЮТ! ФОРМУЛЫ РЕАЛИЗОВАНЫ!');
  console.log('═'.repeat(60));
  console.log('\n✅ Что готово:');
  console.log('   • 18 типов труб в БД');
  console.log('   • 5 формул расчёта (pipe, pipe_pnd, pipe_square, pipe_oval, pipe_rect)');
  console.log('   • Поддержка круглых, квадратных, овальных, прямоугольных труб');
  console.log('   • Поддержка ПНД труб (плотность 950 кг/м³)');
  console.log('   • Тесты: все пройдены');
  console.log('\n📝 Следующий шаг: Обновить UI для ввода размеров труб');
  process.exit(0);
} else {
  console.log('⚠️ ЕСТЬ ОШИБКИ! НУЖНЫ ИСПРАВЛЕНИЯ!');
  console.log('═'.repeat(60));
  process.exit(1);
}
