// Быстрое извлечение данных из ВСЕХ .txt файлов и обновление базы

const fs = require('fs');
const path = require('path');

// Маппинг файлов на ключи в базе
const fileMapping = {
  'Круг оцинк..txt': 'circle_galv',
  'Лента-штрипс.txt': 'strip_tape',
  'Лента-штрипс окраш.txt': 'strip_tape_painted',
  'Лента-штрипс оц..txt': 'strip_tape_galv',
  'Лист-рулон г-к.txt': 'sheet_hot',
  'Лист-рулон окраш.txt': 'sheet_painted',
  'Лист-рулон оцинк.txt': 'sheet_galv',
  'Лист-рулон х-к.txt': 'sheet_cold'
};

// Функция для извлечения JSON из текста консоли
function extractJSON(text, startMarker) {
  const lines = text.split('\n');
  let jsonStr = '';
  let inJSON = false;
  let braceCount = 0;

  for (let line of lines) {
    // Начало JSON
    if (line.includes(startMarker)) {
      inJSON = true;
      continue;
    }

    if (inJSON) {
      // Удалить префикс "VM...: "
      let cleanLine = line.replace(/^VM\d+:\d+\s*/, '');

      // Считаем скобки
      for (let char of cleanLine) {
        if (char === '{' || char === '[') braceCount++;
        if (char === '}' || char === ']') braceCount--;
      }

      jsonStr += cleanLine + '\n';

      // Если скобки закрылись - конец JSON
      if (braceCount === 0 && (cleanLine.includes('}') || cleanLine.includes(']'))) {
        break;
      }
    }
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Ошибка парсинга JSON:', e.message);
    console.log('Текст:', jsonStr.substring(0, 200));
    return null;
  }
}

// Загрузить базу
const dbPath = path.join(__dirname, 'docs', 'database', 'metals.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('📦 База данных загружена. Металлов:', Object.keys(db.metals).length);
console.log('\n🔄 Начинаю обработку файлов...\n');

let updated = 0;
let errors = 0;

// Обработать каждый файл
for (const [filename, dbKey] of Object.entries(fileMapping)) {
  console.log(`\n📄 Обрабатываю: ${filename} → ${dbKey}`);

  try {
    // Проверить существование типа в базе
    if (!db.metals[dbKey]) {
      console.log(`   ⚠️  Тип ${dbKey} не найден в базе. Пропускаю.`);
      errors++;
      continue;
    }

    // Прочитать файл
    const fileContent = fs.readFileSync(filename, 'utf8');

    // Извлечь данные
    const weights = extractJSON(fileContent, '// ===== 2. КОЭФФИЦИЕНТЫ');
    const steelTypes = extractJSON(fileContent, '// ===== 3. МАРКИ СТАЛИ (массив)');
    const steelCoefficients = extractJSON(fileContent, '// ===== 4. КОЭФФИЦИЕНТЫ СТАЛИ (объект)');

    if (!weights || !steelCoefficients) {
      console.log(`   ❌ Не удалось извлечь данные`);
      errors++;
      continue;
    }

    // Обновить базу
    db.metals[dbKey].weights = weights;
    db.metals[dbKey].steelTypes = steelTypes || [];
    db.metals[dbKey].steelCoefficients = steelCoefficients;

    console.log(`   ✅ Добавлено ${Object.keys(weights).length} коэффициентов веса`);
    console.log(`   ✅ Добавлено ${Object.keys(steelCoefficients).length} марок стали`);

    updated++;

  } catch (e) {
    console.log(`   ❌ Ошибка: ${e.message}`);
    errors++;
  }
}

// Добавить zincOptions и zincCoefficients для типов с оцинковкой
console.log('\n\n🔧 Добавляю данные оцинковки...');

const typesWithZinc = [
  'strip_tape_painted',
  'strip_tape_galv',
  'sheet_painted',
  'sheet_galv'
];

const zincOptions = [
  "нет",
  "18 г/м²",
  "36 г/м² ЭЦ 50/50",
  "60 г/м²",
  "100 г/м²",
  "140 г/м²",
  "180 г/м²",
  "200 г/м²",
  "225 г/м²",
  "250 г/м²",
  "275 г/м²",
  "350 г/м²",
  "600 г/м²"
];

const zincCoefficients = {
  "нет": 0,
  "18 г/м²": 0.018,
  "36 г/м² ЭЦ 50/50": 0.036,
  "60 г/м²": 0.06,
  "100 г/м²": 0.1,
  "140 г/м²": 0.14,
  "180 г/м²": 0.18,
  "200 г/м²": 0.2,
  "225 г/м²": 0.225,
  "250 г/м²": 0.25,
  "275 г/м²": 0.275,
  "350 г/м²": 0.35,
  "600 г/м²": 0.6
};

typesWithZinc.forEach(key => {
  if (db.metals[key]) {
    db.metals[key].zincOptions = zincOptions;
    db.metals[key].zincCoefficients = zincCoefficients;
    console.log(`   ✅ ${key}: добавлено ${zincOptions.length} вариантов оцинковки`);
  }
});

// Сохранить базу
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ ЗАВЕРШЕНО!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`   Обновлено типов: ${updated}`);
console.log(`   Ошибок: ${errors}`);
console.log(`   База сохранена: ${dbPath}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
