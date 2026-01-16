/**
 * Скрипт генерации SQL для импорта metal_sizes в Supabase
 */

const https = require('https');
const fs = require('fs');

const METALS_JSON_URL = 'https://lamblackout.github.io/metal-calculator/database/metals.json';

// Категории металла по префиксу metal_key
const CATEGORY_MAP = {
  'armature': 'armature',
  'tryba': 'pipe',
  'sheet': 'sheet',
  'plate': 'sheet',
  'rope': 'rope',
  'wire': 'wire',
  'katanka': 'wire',
  'beam': 'profile',
  'shveller': 'profile',
  'ygolok': 'profile',
  'circle': 'profile',
  'square': 'profile',
  'strip': 'profile',
  'bulb': 'profile',
  'shestigrannik': 'profile',
  'rels': 'profile',
  'sytynka': 'profile',
  'shpynt': 'profile',
  'profnastil': 'sheet',
  'bolt': 'fastener',
  'screw': 'fastener',
  'nail': 'fastener',
  'nut': 'fastener',
  'washer': 'fastener',
  'selftapping': 'fastener',
  'cotter': 'fastener',
  'woodscrew': 'fastener',
  'stud': 'fastener',
  'metiz': 'fastener',
};

/**
 * Нормализует размер для единообразного поиска.
 * КРИТИЧНО: Идентична JavaScript версии в n8n!
 */
function normalizeSize(size) {
  return String(size)
    .trim()
    .toLowerCase()
    .replace(/[×xX*]/g, 'х')  // кириллическая х
    .replace(/,/g, '.')
    .replace(/\s+/g, '');
}

/**
 * Извлекает до 3 числовых компонентов из размера.
 */
function extractDimensions(size) {
  const numbers = String(size).match(/\d+(?:[.,]\d+)?/g) || [];
  const floats = numbers.slice(0, 3).map(n => parseFloat(n.replace(',', '.')));

  while (floats.length < 3) {
    floats.push(null);
  }

  return floats;
}

/**
 * Определяет категорию металла по ключу.
 */
function getCategory(metalKey) {
  for (const [prefix, category] of Object.entries(CATEGORY_MAP)) {
    if (metalKey.startsWith(prefix)) {
      return category;
    }
  }
  return 'other';
}

/**
 * Экранирует строку для SQL.
 */
function escapeSql(s) {
  if (s === null || s === undefined) return 'NULL';
  return "'" + String(s).replace(/'/g, "''") + "'";
}

/**
 * Форматирует число для SQL.
 */
function formatNumber(n) {
  if (n === null || n === undefined || isNaN(n)) return 'NULL';
  return String(n);
}

/**
 * Загружает JSON по URL.
 */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Nachalo generacii SQL dlya metal_sizes...');

  // 1. Загрузить metals.json
  console.log(`Zagruzka metals.json...`);
  let metalsData;
  try {
    metalsData = await fetchJson(METALS_JSON_URL);
  } catch (e) {
    console.error('Oshibka zagruzki:', e.message);
    process.exit(1);
  }

  const metals = metalsData.metals || {};
  console.log(`Zagruzheno tipov metallov: ${Object.keys(metals).length}`);

  // 2. Обработка данных
  console.log('Obrabotka razmerov...');

  const records = [];
  const stats = {
    total: 0,
    skipped: 0,
    byCategory: {}
  };

  for (const [metalKey, metalData] of Object.entries(metals)) {
    const weights = metalData.weights || {};

    if (Object.keys(weights).length === 0) continue;

    const category = getCategory(metalKey);

    for (const [sizeOriginal, weight] of Object.entries(weights)) {
      stats.total++;

      const weightFloat = parseFloat(weight);
      if (isNaN(weightFloat) || weightFloat <= 0) {
        stats.skipped++;
        continue;
      }

      // Пропускаем невалидные размеры (разделители типа '────')
      if (!/\d/.test(sizeOriginal)) {
        stats.skipped++;
        continue;
      }

      const sizeNormalized = normalizeSize(sizeOriginal);
      const [dim1, dim2, dim3] = extractDimensions(sizeOriginal);

      records.push({
        metal_key: metalKey,
        size_original: sizeOriginal,
        size_normalized: sizeNormalized,
        weight_per_meter: weightFloat,
        dimension_1: dim1,
        dimension_2: dim2,
        dimension_3: dim3,
        category: category
      });

      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    }
  }

  console.log(`Obrabotano zapisey: ${records.length}`);
  console.log(`Propushcheno: ${stats.skipped}`);

  // 3. Генерация SQL
  console.log('Generaciya SQL...');

  const timestamp = new Date().toISOString();

  let sql = `-- ============================================================
-- SQL INSERT: Zagruzka razmerov metalloprokata
-- Sgeneriovano: ${timestamp}
-- Kolichestvo zapisey: ${records.length}
-- ============================================================

-- Sozdanie tablicy (esli ne sushchestvuet)
CREATE TABLE IF NOT EXISTS metal_sizes (
  id SERIAL PRIMARY KEY,
  metal_key TEXT NOT NULL,
  size_original TEXT NOT NULL,
  size_normalized TEXT NOT NULL,
  weight_per_meter NUMERIC NOT NULL,
  dimension_1 NUMERIC,
  dimension_2 NUMERIC,
  dimension_3 NUMERIC,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (metal_key, size_original)
);

-- Indexy
CREATE INDEX IF NOT EXISTS idx_metal_sizes_key ON metal_sizes(metal_key);
CREATE INDEX IF NOT EXISTS idx_metal_sizes_normalized ON metal_sizes(size_normalized);
CREATE INDEX IF NOT EXISTS idx_metal_sizes_category ON metal_sizes(category);

-- Vstavka dannyh
INSERT INTO metal_sizes (metal_key, size_original, size_normalized, weight_per_meter, dimension_1, dimension_2, dimension_3, category)
VALUES
`;

  // Генерация VALUES
  const valueLines = records.map(rec =>
    `  (${escapeSql(rec.metal_key)}, ${escapeSql(rec.size_original)}, ${escapeSql(rec.size_normalized)}, ${formatNumber(rec.weight_per_meter)}, ${formatNumber(rec.dimension_1)}, ${formatNumber(rec.dimension_2)}, ${formatNumber(rec.dimension_3)}, ${escapeSql(rec.category)})`
  );

  sql += valueLines.join(',\n');

  sql += `
ON CONFLICT (metal_key, size_original) DO UPDATE SET
  weight_per_meter = EXCLUDED.weight_per_meter,
  size_normalized = EXCLUDED.size_normalized,
  dimension_1 = EXCLUDED.dimension_1,
  dimension_2 = EXCLUDED.dimension_2,
  dimension_3 = EXCLUDED.dimension_3,
  category = EXCLUDED.category,
  updated_at = NOW();

-- Proverka rezultata
SELECT category, COUNT(*) as count FROM metal_sizes GROUP BY category ORDER BY count DESC;
SELECT COUNT(*) as total FROM metal_sizes;
`;

  // 4. Сохранение файлов
  fs.writeFileSync('insert_metal_sizes.sql', sql, 'utf-8');
  console.log('SQL file saved: insert_metal_sizes.sql');

  fs.writeFileSync('metal_sizes_data.json', JSON.stringify(records, null, 2), 'utf-8');
  console.log('JSON file saved: metal_sizes_data.json');

  // 5. Статистика
  console.log('\n==================================================');
  console.log('STATISTIKA:');
  console.log(`   Vsego zapisey: ${records.length}`);
  console.log('');
  console.log('   Po kategoriyam:');
  const sortedCategories = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sortedCategories) {
    console.log(`     ${cat}: ${count}`);
  }
  console.log('==================================================');

  // 6. Примеры записей
  console.log('\nPRIMERY ZAPISEY:');
  for (const rec of records.slice(0, 5)) {
    console.log(`   ${rec.metal_key}: ${rec.size_original} -> ${rec.size_normalized} (${rec.weight_per_meter} kg/m)`);
  }
  console.log('   ...');

  console.log('\nGotovo! Ispolzuyte fayl insert_metal_sizes.sql dlya importa v Supabase.');
}

main().catch(console.error);
