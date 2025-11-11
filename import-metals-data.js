// Скрипт импорта данных металлопроката из .txt файлов в database/metals.json
// Обновляет существующие типы металла полными данными

const fs = require('fs');
const path = require('path');

console.log('\n🔄 ИМПОРТ ДАННЫХ МЕТАЛЛОПРОКАТА\n');
console.log('='.repeat(70));

// Маппинг файлов к ключам в database
const METAL_FILES = {
  'circle': {
    file: 'Круг.txt',
    name: 'Круг',
    hasSteel: true,
    hasZinc: false,
    unitType: 'meters'  // метры
  },
  'circle_galv': {
    file: 'Круг оцинк..txt',
    name: 'Круг оцинк.',
    hasSteel: true,
    hasZinc: true,
    unitType: 'meters'
  },
  'strip_tape': {
    file: 'Лента-штрипс.txt',
    name: 'Лента/штрипс',
    hasSteel: true,
    hasZinc: false,
    unitType: 'sqmeters'  // кв.метры
  },
  'strip_tape_painted': {
    file: 'Лента-штрипс окраш.txt',
    name: 'Лента/штрипс окраш.',
    hasSteel: true,
    hasZinc: true,  // окраска тоже как оцинковка
    unitType: 'sqmeters'
  },
  'strip_tape_galv': {
    file: 'Лента-штрипс оц..txt',
    name: 'Лента/штрипс оц.',
    hasSteel: true,
    hasZinc: true,
    unitType: 'sqmeters'
  },
  'sheet_hot': {
    file: 'Лист-рулон г-к.txt',
    name: 'Лист/рулон г/к',
    hasSteel: true,
    hasZinc: false,
    unitType: 'sqmeters'
  },
  'sheet_painted': {
    file: 'Лист-рулон окраш.txt',
    name: 'Лист/рулон окраш.',
    hasSteel: true,
    hasZinc: true,
    unitType: 'sqmeters'
  },
  'sheet_galv': {
    file: 'Лист-рулон оцинк.txt',
    name: 'Лист/рулон оцинк.',
    hasSteel: true,
    hasZinc: true,
    unitType: 'sqmeters'
  },
  'sheet_cold': {
    file: 'Лист-рулон х-к.txt',
    name: 'Лист/рулон х/к',
    hasSteel: true,
    hasZinc: false,
    unitType: 'sqmeters'
  },
  'sheet_pv': {
    file: 'Лист ПВ.txt',
    name: 'Лист ПВ',
    hasSteel: false,  // ⚠️ ОСОБЫЙ ТИП: нет марок стали, есть стандарты
    hasZinc: false,
    hasStandards: true,
    unitType: 'meters'
  },
  'sheet_pv_galv': {
    file: 'Лист ПВ оцинк.txt',
    name: 'Лист ПВ оцинк.',
    hasSteel: false,  // ⚠️ ОСОБЫЙ ТИП
    hasZinc: true,    // но оцинковка в процентах!
    hasStandards: true,
    unitType: 'meters'
  },
  'sheet_checkered': {
    file: 'Лист рифленый.txt',
    name: 'Лист рифленый',
    hasSteel: false,  // ⚠️ ОСОБЫЙ ТИП: нет марок стали, есть рифление
    hasZinc: false,
    hasRiffle: true,
    unitType: 'sqmeters'
  }
};

/**
 * Парсит .txt файл и извлекает JSON блоки
 */
function parseMetalFile(filePath) {
  console.log(`\n📄 Читаю файл: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let jsonBlocks = {
    sizes: null,
    weights: null,
    steelTypes: null,
    steelCoefficients: null,
    zincOptions: null,
    zincCoefficients: null,
    sizeStandards: null,  // для Лист ПВ
    riffleTypes: null,     // для Лист рифленый
    riffleCoefficients: null
  };

  let currentBlock = '';
  let bracketCount = 0;
  let inJSONBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Убрать префикс "VM...:номер " если есть
    line = line.replace(/^VM\d+:\d+\s+/, '');

    // Определить начало блока
    if (line.includes('// ===== 1. РАЗМЕРЫ')) {
      inJSONBlock = true;
      currentBlock = '';
      continue;
    } else if (line.includes('// ===== 2. КОЭФФИЦИЕНТЫ') || line.includes('// ===== 2. ВЕСÁ')) {
      if (currentBlock) {
        try {
          jsonBlocks.sizes = JSON.parse(currentBlock);
        } catch (e) {
          console.warn('⚠️  Ошибка парсинга sizes:', e.message);
        }
      }
      inJSONBlock = true;
      currentBlock = '';
      continue;
    } else if (line.includes('// ===== 3. МАРКИ СТАЛИ')) {
      if (currentBlock) {
        try {
          jsonBlocks.weights = JSON.parse(currentBlock);
        } catch (e) {
          console.warn('⚠️  Ошибка парсинга weights:', e.message);
        }
      }
      inJSONBlock = true;
      currentBlock = '';
      continue;
    } else if (line.includes('// ===== 4. КОЭФФИЦИЕНТЫ СТАЛИ')) {
      if (currentBlock) {
        try {
          jsonBlocks.steelTypes = JSON.parse(currentBlock);
        } catch (e) {
          console.warn('⚠️  Ошибка парсинга steelTypes:', e.message);
        }
      }
      inJSONBlock = true;
      currentBlock = '';
      continue;
    } else if (line.includes('// ===== 5. ГОСТ')) {
      if (currentBlock) {
        try {
          jsonBlocks.steelCoefficients = JSON.parse(currentBlock);
        } catch (e) {
          console.warn('⚠️  Ошибка парсинга steelCoefficients:', e.message);
        }
      }
      inJSONBlock = false;
      break;
    }

    // Накапливать JSON
    if (inJSONBlock && line.trim() && !line.startsWith('//')) {
      currentBlock += line.trim() + '\n';
    }
  }

  return jsonBlocks;
}

/**
 * Обновить данные металла в базе
 */
function updateMetalData(db, metalKey, metalConfig, parsedData) {
  if (!db.metals[metalKey]) {
    console.warn(`⚠️  Металл '${metalKey}' не найден в базе, пропускаю`);
    return;
  }

  const metal = db.metals[metalKey];

  console.log(`\n✏️  Обновляю '${metal.name}':`);

  // Обновить sizes
  if (parsedData.sizes && parsedData.sizes.length > 0) {
    const oldCount = metal.sizes ? metal.sizes.length : 0;
    metal.sizes = parsedData.sizes.filter(s => s !== '────'); // убрать разделители
    console.log(`   ✅ Sizes: ${oldCount} → ${metal.sizes.length}`);
  }

  // Обновить weights (коэффициенты)
  if (parsedData.weights) {
    const oldCount = metal.weights ? Object.keys(metal.weights).length : 0;
    metal.weights = parsedData.weights;
    // Убрать "────" если есть
    if (metal.weights['────']) {
      delete metal.weights['────'];
    }
    console.log(`   ✅ Weights: ${oldCount} → ${Object.keys(metal.weights).length}`);
  }

  // Обновить steelTypes и steelCoefficients
  if (metalConfig.hasSteel) {
    if (parsedData.steelTypes && parsedData.steelTypes.length > 0) {
      const oldCount = metal.steelTypes ? metal.steelTypes.length : 0;
      metal.steelTypes = parsedData.steelTypes;
      console.log(`   ✅ SteelTypes: ${oldCount} → ${metal.steelTypes.length}`);
    }

    if (parsedData.steelCoefficients) {
      const oldCount = metal.steelCoefficients ? Object.keys(metal.steelCoefficients).length : 0;
      metal.steelCoefficients = parsedData.steelCoefficients;
      console.log(`   ✅ SteelCoefficients: ${oldCount} → ${Object.keys(metal.steelCoefficients).length}`);
    }
  }

  // Добавить unitType
  metal.unitType = metalConfig.unitType;
  console.log(`   ✅ UnitType: ${metal.unitType}`);
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

try {
  // Загрузить базу данных
  const dbPath = path.join(__dirname, 'database', 'metals.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  console.log(`\n📊 База данных загружена: ${Object.keys(db.metals).length} типов металла\n`);

  // Импортировать все стандартные типы (без особых)
  const standardTypes = [
    'circle',
    'circle_galv',
    'strip_tape',
    'strip_tape_painted',
    'strip_tape_galv',
    'sheet_hot',
    'sheet_painted',
    'sheet_galv',
    'sheet_cold'
  ];

  console.log(`\n🔄 Импорт ${standardTypes.length} стандартных типов...\n`);

  for (const metalKey of standardTypes) {
    const metalConfig = METAL_FILES[metalKey];

    if (!metalConfig) {
      console.warn(`⚠️  Конфигурация для '${metalKey}' не найдена, пропускаю`);
      continue;
    }

    const filePath = path.join(__dirname, metalConfig.file);

    if (fs.existsSync(filePath)) {
      const parsedData = parseMetalFile(filePath);
      updateMetalData(db, metalKey, metalConfig, parsedData);
    } else {
      console.warn(`⚠️  Файл не найден: ${filePath}`);
    }
  }

  console.log(`\n✅ Импорт стандартных типов завершён`);


  // Сохранить обновлённую базу
  console.log(`\n💾 Сохраняю обновлённую базу...`);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

  console.log(`\n✅ ГОТОВО! База данных обновлена.`);
  console.log('='.repeat(70));

} catch (error) {
  console.error('\n❌ ОШИБКА:', error.message);
  console.error(error.stack);
  process.exit(1);
}
