/**
 * Разбивает большой SQL файл на части для загрузки в Supabase
 */

const fs = require('fs');

const BATCH_SIZE = 5000; // записей на файл
const INPUT_FILE = 'insert_metal_sizes.sql';
const OUTPUT_DIR = 'sql_parts';

// Создаём папку для частей
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

console.log('Читаю SQL файл...');
const content = fs.readFileSync(INPUT_FILE, 'utf-8');

// Извлекаем CREATE TABLE и индексы (до VALUES)
const headerMatch = content.match(/^([\s\S]*?VALUES\n)/);
const header = headerMatch ? headerMatch[1] : '';

// Извлекаем все VALUES строки
const valuesSection = content.substring(content.indexOf('VALUES\n') + 7);
const onConflictMatch = valuesSection.match(/\nON CONFLICT[\s\S]*$/);
const onConflict = onConflictMatch ? onConflictMatch[0] : '';

// Парсим VALUES строки
const valuesOnly = valuesSection.replace(/\nON CONFLICT[\s\S]*$/, '');
const valueLines = valuesOnly.split('\n').filter(line => line.trim().startsWith('('));

console.log(`Всего записей: ${valueLines.length}`);

// Часть 0: CREATE TABLE + индексы (без данных)
const createTableOnly = content.match(/^([\s\S]*?-- Vstavka dannyh)/)[1];
fs.writeFileSync(
  `${OUTPUT_DIR}/00_create_table.sql`,
  createTableOnly + '\n-- Таблица и индексы созданы. Теперь загрузите части 01, 02, 03...\n',
  'utf-8'
);
console.log('Создан: 00_create_table.sql');

// Разбиваем на части
const totalParts = Math.ceil(valueLines.length / BATCH_SIZE);

for (let i = 0; i < totalParts; i++) {
  const start = i * BATCH_SIZE;
  const end = Math.min((i + 1) * BATCH_SIZE, valueLines.length);
  const batch = valueLines.slice(start, end);

  // Убираем запятую у последней строки
  let batchContent = batch.join('\n');
  batchContent = batchContent.replace(/,\s*$/, '');

  const partNum = String(i + 1).padStart(2, '0');
  const partFile = `${OUTPUT_DIR}/${partNum}_insert_${start + 1}_to_${end}.sql`;

  const partSql = `-- Часть ${i + 1} из ${totalParts}: записи ${start + 1} - ${end}
-- Выполните ПОСЛЕ 00_create_table.sql

INSERT INTO metal_sizes (metal_key, size_original, size_normalized, weight_per_meter, dimension_1, dimension_2, dimension_3, category)
VALUES
${batchContent}
ON CONFLICT (metal_key, size_original) DO UPDATE SET
  weight_per_meter = EXCLUDED.weight_per_meter,
  size_normalized = EXCLUDED.size_normalized,
  dimension_1 = EXCLUDED.dimension_1,
  dimension_2 = EXCLUDED.dimension_2,
  dimension_3 = EXCLUDED.dimension_3,
  category = EXCLUDED.category,
  updated_at = NOW();

-- Проверка: SELECT COUNT(*) FROM metal_sizes;
`;

  fs.writeFileSync(partFile, partSql, 'utf-8');
  console.log(`Создан: ${partNum}_insert_${start + 1}_to_${end}.sql (${batch.length} записей)`);
}

// Финальный файл с проверкой
fs.writeFileSync(
  `${OUTPUT_DIR}/99_verify.sql`,
  `-- Проверка после загрузки всех частей

SELECT category, COUNT(*) as count
FROM metal_sizes
GROUP BY category
ORDER BY count DESC;

SELECT COUNT(*) as total FROM metal_sizes;

-- Ожидаемый результат: ${valueLines.length} записей
`,
  'utf-8'
);
console.log('Создан: 99_verify.sql');

console.log(`\n✅ Готово! Создано ${totalParts + 2} файлов в папке ${OUTPUT_DIR}/`);
console.log('\nПорядок загрузки в Supabase SQL Editor:');
console.log('1. 00_create_table.sql (создаст таблицу)');
for (let i = 1; i <= totalParts; i++) {
  console.log(`${i + 1}. ${String(i).padStart(2, '0')}_insert_*.sql`);
}
console.log(`${totalParts + 2}. 99_verify.sql (проверка)`);
