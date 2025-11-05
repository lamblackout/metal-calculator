// СКРИПТ: Импорт полных данных крепежа из .txt файлов
// Извлекает sizes, weights, gosts из Болты.txt, Гайки.txt, Шайбы.txt

const fs = require('fs');

console.log('\n🔧 ИМПОРТ ДАННЫХ КРЕПЕЖА\n');
console.log('='.repeat(70));

/**
 * Извлечь JSON блок из файла
 * @param {string} content - Содержимое файла
 * @param {string} marker - Маркер начала блока (например, "===== 1. РАЗМЕРЫ")
 * @returns {Array|Object} Извлечённый JSON
 */
function extractJSON(content, marker) {
  const lines = content.split('\n');

  // Найти строку с маркером
  const startIndex = lines.findIndex(line => line.includes(marker));
  if (startIndex === -1) {
    throw new Error(`Маркер "${marker}" не найден`);
  }

  // Собрать JSON начиная со следующей строки
  let jsonStr = '';
  let depth = 0;
  let started = false;

  for (let i = startIndex + 1; i < lines.length; i++) {
    let line = lines[i];

    // Убрать префикс "VM...:номер " из строки
    line = line.replace(/^VM\d+:\d+\s+/, '');

    const trimmed = line.trim();

    // Начало JSON ([ или {)
    if (!started && (trimmed.startsWith('[') || trimmed.startsWith('{'))) {
      started = true;
    }

    if (started) {
      jsonStr += line + '\n';

      // Отслеживаем вложенность
      for (const char of trimmed) {
        if (char === '[' || char === '{') depth++;
        if (char === ']' || char === '}') depth--;
      }

      // Конец JSON (depth вернулся к 0)
      if (depth === 0) {
        break;
      }
    }
  }

  // Парсим JSON
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error(`Ошибка парсинга JSON для маркера "${marker}": ${error.message}`);
  }
}

/**
 * Импортировать данные из файла крепежа
 * @param {string} filename - Путь к файлу
 * @param {string} type - Тип крепежа (для логов)
 * @returns {Object} {sizes, weights, gosts}
 */
function importFastener(filename, type) {
  console.log(`\n📦 Импорт: ${type}`);
  console.log(`   Файл: ${filename}`);

  const content = fs.readFileSync(filename, 'utf-8');

  // Извлечь блоки
  const sizes = extractJSON(content, '===== 1. РАЗМЕРЫ');
  const weights = extractJSON(content, '===== 2. ВЕСА');
  const gosts = extractJSON(content, '===== 3. ГОСТ');

  console.log(`   ✅ Sizes: ${sizes.length}`);
  console.log(`   ✅ Weights: ${Object.keys(weights).length}`);
  console.log(`   ✅ Gosts: ${Object.keys(gosts).length}`);

  // Валидация
  if (sizes.length !== Object.keys(weights).length) {
    throw new Error(`Несоответствие: sizes (${sizes.length}) !== weights (${Object.keys(weights).length})`);
  }
  if (sizes.length !== Object.keys(gosts).length) {
    throw new Error(`Несоответствие: sizes (${sizes.length}) !== gosts (${Object.keys(gosts).length})`);
  }

  return { sizes, weights, gosts };
}

// ============================================================================
// ОСНОВНОЙ ПРОЦЕСС ИМПОРТА
// ============================================================================

try {
  // Загрузить текущую БД
  const db = require('./database/metals.json');
  console.log('\n✅ БД загружена');
  console.log(`   Всего металлов: ${Object.keys(db.metals).length}`);

  // Импорт болтов
  const bolts = importFastener('./Болты.txt', 'Болты');

  // Импорт гаек
  const nuts = importFastener('./Гайки.txt', 'Гайки');

  // Импорт шайб
  const washers = importFastener('./Шайбы.txt', 'Шайбы');

  console.log('\n' + '='.repeat(70));
  console.log('📊 СТАТИСТИКА ИМПОРТА:\n');

  console.log(`   Болты:  ${db.metals.bolt.sizes.length} → ${bolts.sizes.length} (+${bolts.sizes.length - db.metals.bolt.sizes.length})`);
  console.log(`   Гайки:  ${db.metals.nut.sizes.length} → ${nuts.sizes.length} (+${nuts.sizes.length - db.metals.nut.sizes.length})`);
  console.log(`   Шайбы:  ${db.metals.washer.sizes.length} → ${washers.sizes.length} (+${washers.sizes.length - db.metals.washer.sizes.length})`);

  const totalBefore = db.metals.bolt.sizes.length + db.metals.nut.sizes.length + db.metals.washer.sizes.length;
  const totalAfter = bolts.sizes.length + nuts.sizes.length + washers.sizes.length;
  console.log(`\n   ИТОГО: ${totalBefore} → ${totalAfter} (+${totalAfter - totalBefore} размеров)`);

  // Обновить БД
  console.log('\n' + '='.repeat(70));
  console.log('💾 ОБНОВЛЕНИЕ БД...\n');

  db.metals.bolt.sizes = bolts.sizes;
  db.metals.bolt.weights = bolts.weights;
  db.metals.bolt.gosts = bolts.gosts;
  console.log('   ✅ Болты обновлены');

  db.metals.nut.sizes = nuts.sizes;
  db.metals.nut.weights = nuts.weights;
  db.metals.nut.gosts = nuts.gosts;
  console.log('   ✅ Гайки обновлены');

  db.metals.washer.sizes = washers.sizes;
  db.metals.washer.weights = washers.weights;
  db.metals.washer.gosts = washers.gosts;
  console.log('   ✅ Шайбы обновлены');

  // Сохранить БД
  fs.writeFileSync(
    './database/metals.json',
    JSON.stringify(db, null, 2),
    'utf-8'
  );

  console.log('\n✅ БД сохранена: database/metals.json');

  // Финальная проверка
  console.log('\n' + '='.repeat(70));
  console.log('🎉 ИМПОРТ ЗАВЕРШЁН УСПЕШНО!\n');

  console.log('📦 ИТОГОВЫЕ РАЗМЕРЫ:');
  console.log(`   Болты:  ${bolts.sizes.length} размеров`);
  console.log(`   Гайки:  ${nuts.sizes.length} размеров`);
  console.log(`   Шайбы:  ${washers.sizes.length} размеров`);
  console.log(`   ВСЕГО:  ${totalAfter} размеров (+${totalAfter - totalBefore})`);

  console.log('\n📝 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('   1. node build.js               # Пересобрать bundle');
  console.log('   2. Проверить в калькуляторе    # Тестировать UI');
  console.log('   3. git commit + push           # Деплой\n');

  process.exit(0);

} catch (error) {
  console.error('\n❌ ОШИБКА ИМПОРТА:', error.message);
  console.error(error.stack);
  process.exit(1);
}
