// extract-all-fasteners.js
// Универсальный скрипт извлечения данных из всех файлов крепежа

const fs = require('fs');

// Конфигурация типов крепежа
const fastenerTypes = [
  { file: 'Винты.txt', key: 'screws', name: 'Винты', nameEn: 'ВИНТОВ' },
  { file: 'Гайки.txt', key: 'nuts', name: 'Гайки', nameEn: 'ГАЕК' },
  { file: 'Гвозди.txt', key: 'nails', name: 'Гвозди', nameEn: 'ГВОЗДЕЙ' },
  { file: 'Саморезы.txt', key: 'self_tapping_screws', name: 'Саморезы', nameEn: 'САМОРЕЗОВ' },
  { file: 'Шайбы.txt', key: 'washers', name: 'Шайбы', nameEn: 'ШАЙБ' },
  { file: 'Шплинты.txt', key: 'split_pins', name: 'Шплинты', nameEn: 'ШПЛИНТОВ' },
  { file: 'Шурупы.txt', key: 'wood_screws', name: 'Шурупы', nameEn: 'ШУРУПОВ' }
  // Шпильки пропускаем пока - другая структура
];

console.log('='.repeat(80));
console.log('🔧 ИЗВЛЕЧЕНИЕ ДАННЫХ ИЗ ВСЕХ ФАЙЛОВ КРЕПЕЖА');
console.log('='.repeat(80));
console.log('');

const results = [];
let totalSuccess = 0;
let totalFailed = 0;

for (const type of fastenerTypes) {
  console.log(`📦 Обработка: ${type.name} (${type.file})...`);

  try {
    // Прочитать файл
    const content = fs.readFileSync(type.file, 'utf-8');

    // Найти секции с данными
    const sizesPattern = new RegExp(`\/\/ ===== 1\\. РАЗМЕРЫ ${type.nameEn} =====\\s*\\n[^\\[]*\\[([\\s\\S]*?)\\]`);
    const weightsPattern = new RegExp(`\/\/ ===== 2\\. ВЕС[АЫ]? ${type.nameEn}[\\s\\S]*?\\{([\\s\\S]*?)\\n\\s*\\}`, 'm');
    const standardsPattern = new RegExp(`\/\/ ===== 3\\. ГОСТ[ыЫ]? ${type.nameEn}[\\s\\S]*?\\{([\\s\\S]*?)\\n\\s*\\}`, 'm');

    const sizesMatch = content.match(sizesPattern);
    const weightsMatch = content.match(weightsPattern);
    const standardsMatch = content.match(standardsPattern);

    if (!sizesMatch || !weightsMatch || !standardsMatch) {
      console.log(`  ❌ Не удалось найти все секции!`);
      console.log(`     sizesMatch: ${!!sizesMatch}`);
      console.log(`     weightsMatch: ${!!weightsMatch}`);
      console.log(`     standardsMatch: ${!!standardsMatch}`);
      totalFailed++;
      continue;
    }

    // Парсим данные
    const sizesStr = '[' + sizesMatch[1].trim() + ']';
    const sizes = JSON.parse(sizesStr);

    const weightsStr = '{' + weightsMatch[1].trim() + '}';
    const weights = JSON.parse(weightsStr);

    const standardsStr = '{' + standardsMatch[1].trim() + '}';
    const standards = JSON.parse(standardsStr);

    // Проверка целостности
    const sizesCount = sizes.length;
    const weightsCount = Object.keys(weights).length;
    const standardsCount = Object.keys(standards).length;

    console.log(`  ✅ Извлечено:`);
    console.log(`     • Sizes: ${sizesCount}`);
    console.log(`     • Weights: ${weightsCount}`);
    console.log(`     • Standards: ${standardsCount}`);

    if (sizesCount !== weightsCount || sizesCount !== standardsCount) {
      console.log(`  ⚠️ ВНИМАНИЕ: Количество записей не совпадает!`);
    }

    // Найти уникальные стандарты
    const uniqueStandards = [...new Set(Object.values(standards))];
    console.log(`     • Уникальных стандартов: ${uniqueStandards.length}`);
    console.log('');

    // Создать объект для базы данных
    const fastenerData = {
      name: type.name,
      gost: uniqueStandards.length > 3
        ? `${uniqueStandards.slice(0, 3).join(', ')} и др.`
        : uniqueStandards.join(', '),
      category: 'Крепёж',
      formula: 'fasteners',
      unitType: 'pieces',
      sizes: sizes,
      weights: weights,
      standards: standards
    };

    // Сохранить в отдельный файл
    const outputFile = `${type.key}-data.json`;
    fs.writeFileSync(outputFile, JSON.stringify(fastenerData, null, 2), 'utf-8');
    console.log(`  💾 Сохранено в ${outputFile}`);
    console.log('');

    results.push({
      type: type.name,
      key: type.key,
      file: outputFile,
      sizes: sizesCount,
      standards: uniqueStandards.length,
      success: true
    });

    totalSuccess++;

  } catch (error) {
    console.log(`  ❌ ОШИБКА: ${error.message}`);
    console.log('');
    totalFailed++;

    results.push({
      type: type.name,
      key: type.key,
      error: error.message,
      success: false
    });
  }
}

// Итоговая сводка
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log(`Обработано файлов: ${fastenerTypes.length}`);
console.log(`Успешно: ${totalSuccess}`);
console.log(`Ошибок: ${totalFailed}`);
console.log('');

if (totalSuccess > 0) {
  console.log('✅ Успешно обработано:');
  results.filter(r => r.success).forEach(r => {
    console.log(`  • ${r.type}: ${r.sizes} размеров, ${r.standards} стандартов → ${r.file}`);
  });
  console.log('');
}

if (totalFailed > 0) {
  console.log('❌ Ошибки:');
  results.filter(r => !r.success).forEach(r => {
    console.log(`  • ${r.type}: ${r.error}`);
  });
  console.log('');
}

// Сохранить результаты
fs.writeFileSync('fasteners-extraction-results.json', JSON.stringify(results, null, 2), 'utf-8');
console.log('📋 Результаты сохранены в fasteners-extraction-results.json');
console.log('');
