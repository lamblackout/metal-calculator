// Тестирование всех категорий металлов
const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');

console.log('🧪 ТЕСТИРОВАНИЕ ВСЕХ КАТЕГОРИЙ МЕТАЛЛОВ\n');
console.log('═'.repeat(60));

// Группируем по категориям
const categories = {};
for (const [key, metal] of Object.entries(metalDatabase.metals)) {
  const cat = metal.category || 'Другое';
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push({ key, metal });
}

console.log(`\n📊 Всего категорий: ${Object.keys(categories).length}`);
console.log(`📦 Всего металлов: ${Object.keys(metalDatabase.metals).length}\n`);

let passed = 0;
let failed = 0;

// Тестируем по одному металлу из каждой категории
for (const [category, metals] of Object.entries(categories).sort()) {
  console.log('\n📁', category, `(${metals.length} металлов)`);

  const sample = metals[0];
  const metal = sample.metal;

  // Определяем размер для теста (берем средний элемент для более реалистичного теста)
  let testSize = null;
  let testLength = 100; // Увеличена длина для лучшей точности

  if (metal.sizes && metal.sizes.length > 0) {
    // Берем средний элемент или 10, если он есть
    const midIndex = Math.floor(metal.sizes.length / 2);
    testSize = metal.sizes.find(s => s === 10) || metal.sizes[midIndex] || metal.sizes[0];
  } else if (metal.weights) {
    const weightKeys = Object.keys(metal.weights);
    const midIndex = Math.floor(weightKeys.length / 2);
    testSize = weightKeys.find(s => s === '10') || weightKeys[midIndex] || weightKeys[0];
  }

  if (!testSize) {
    console.log('   ⚠️  ' + metal.name + ': нет размеров');
    continue;
  }

  try {
    const params = {
      metalType: sample.key,
      size: testSize,
      length: testLength
    };

    // Для катанки добавляем сталь
    if (sample.key === 'wire_rod') {
      params.steelType = 'ст3';
    }

    const result = calculateMetal(params, metalDatabase);

    if (result.success && result.weight !== undefined && result.weight >= 0) {
      const weightKg = (result.weight * 1000).toFixed(2);
      console.log(`   ✅ ${metal.name} → Размер: ${testSize} → Вес: ${weightKg} кг`);
      passed++;
    } else {
      console.log(`   ❌ ${metal.name} → ОШИБКА: ${result.error || 'Неизвестная ошибка'}`);
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ ${metal.name} → EXCEPTION: ${error.message}`);
    failed++;
  }
}

console.log('\n' + '═'.repeat(60));
console.log('📊 ИТОГИ:');
console.log('✅ Успешно:', passed);
console.log('❌ Ошибок:', failed);
console.log('📈 Успешность:', ((passed / (passed + failed)) * 100).toFixed(1) + '%');
console.log('═'.repeat(60));

if (failed === 0) {
  console.log('\n🎉 ВСЕ КАТЕГОРИИ РАБОТАЮТ!');
  console.log('✅ Готов к демонстрации заказчику\n');
  process.exit(0);
} else {
  console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ - ТРЕБУЕТСЯ ПРОВЕРКА\n');
  process.exit(1);
}
