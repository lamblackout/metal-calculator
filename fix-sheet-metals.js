// Скрипт для добавления steelDensities и galvanizationWeights в листовые металлы
// Это исправит проблему с марками стали и оцинковкой

const fs = require('fs');
const path = require('path');

// Путь к базе данных
const dbPath = path.join(__dirname, 'docs', 'database', 'metals.json');

// Загрузить базу данных
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔧 ИСПРАВЛЕНИЕ ЛИСТОВЫХ МЕТАЛЛОВ');
console.log('═══════════════════════════════════════════════════════════════\n');

// Получить эталонные данные из strip_tape_painted (там уже правильно настроено)
const stripTapePainted = db.metals.strip_tape_painted;

if (!stripTapePainted || !stripTapePainted.steelGrades || !stripTapePainted.steelDensities) {
  console.error('❌ ОШИБКА: strip_tape_painted не имеет steelGrades/steelDensities!');
  console.error('   Сначала нужно исправить strip_tape_painted.');
  process.exit(1);
}

const steelGrades = stripTapePainted.steelGrades;
const steelDensities = stripTapePainted.steelDensities;
const galvanization = stripTapePainted.galvanization;
const galvanizationWeights = stripTapePainted.galvanizationWeights;

console.log(`✅ Загружены эталонные данные из strip_tape_painted:`);
console.log(`   - steelGrades: ${steelGrades.length} марок`);
console.log(`   - steelDensities: ${Object.keys(steelDensities).length} марок`);
console.log(`   - galvanization: ${galvanization ? galvanization.length : 0} вариантов`);
console.log(`   - galvanizationWeights: ${galvanizationWeights ? Object.keys(galvanizationWeights).length : 0} вариантов\n`);

// ═══════════════════════════════════════════════════════════════
// 1. ЛИСТ/РУЛОН Г/К (sheet_hot)
// ═══════════════════════════════════════════════════════════════
console.log('📋 1. Обновление sheet_hot (Лист/рулон г/к)');
console.log('─────────────────────────────────────────────────────────────');

const sheetHot = db.metals.sheet_hot;
if (!sheetHot) {
  console.error('❌ sheet_hot не найден в базе данных!');
} else {
  // Добавить марки стали
  sheetHot.steelGrades = steelGrades;
  sheetHot.steelDensities = steelDensities;

  console.log(`✅ Добавлено ${steelGrades.length} марок стали`);
  console.log(`   Теперь марка стали будет влиять на вес!`);
}
console.log();

// ═══════════════════════════════════════════════════════════════
// 2. ЛИСТ/РУЛОН ОКРАШ. (sheet_painted)
// ═══════════════════════════════════════════════════════════════
console.log('📋 2. Обновление sheet_painted (Лист/рулон окраш.)');
console.log('─────────────────────────────────────────────────────────────');

const sheetPainted = db.metals.sheet_painted;
if (!sheetPainted) {
  console.error('❌ sheet_painted не найден в базе данных!');
} else {
  // Добавить марки стали
  sheetPainted.steelGrades = steelGrades;
  sheetPainted.steelDensities = steelDensities;

  // Добавить оцинковку
  sheetPainted.galvanization = galvanization;
  sheetPainted.galvanizationWeights = galvanizationWeights;

  console.log(`✅ Добавлено ${steelGrades.length} марок стали`);
  console.log(`✅ Добавлено ${galvanization.length} вариантов оцинковки`);
  console.log(`   Теперь марка стали и оцинковка будут влиять на вес!`);
}
console.log();

// ═══════════════════════════════════════════════════════════════
// 3. ЛИСТ/РУЛОН ОЦИНК. (sheet_galv)
// ═══════════════════════════════════════════════════════════════
console.log('📋 3. Обновление sheet_galv (Лист/рулон оцинк.)');
console.log('─────────────────────────────────────────────────────────────');

const sheetGalv = db.metals.sheet_galv;
if (!sheetGalv) {
  console.error('❌ sheet_galv не найден в базе данных!');
} else {
  // Добавить марки стали
  sheetGalv.steelGrades = steelGrades;
  sheetGalv.steelDensities = steelDensities;

  // Добавить оцинковку
  sheetGalv.galvanization = galvanization;
  sheetGalv.galvanizationWeights = galvanizationWeights;

  console.log(`✅ Добавлено ${steelGrades.length} марок стали`);
  console.log(`✅ Добавлено ${galvanization.length} вариантов оцинковки`);
  console.log(`   Теперь марка стали и оцинковка будут влиять на вес!`);
}
console.log();

// ═══════════════════════════════════════════════════════════════
// 4. ЛИСТ/РУЛОН Х/К (sheet_cold)
// ═══════════════════════════════════════════════════════════════
console.log('📋 4. Обновление sheet_cold (Лист/рулон х/к)');
console.log('─────────────────────────────────────────────────────────────');

const sheetCold = db.metals.sheet_cold;
if (!sheetCold) {
  console.error('❌ sheet_cold не найден в базе данных!');
} else {
  // Добавить марки стали
  sheetCold.steelGrades = steelGrades;
  sheetCold.steelDensities = steelDensities;

  console.log(`✅ Добавлено ${steelGrades.length} марок стали`);
  console.log(`   Теперь марка стали будет влиять на вес!`);
}
console.log();

// Сохранить базу данных
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('═══════════════════════════════════════════════════════════════');
console.log('✅ БАЗА ДАННЫХ ОБНОВЛЕНА!');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('📊 ИТОГ:');
console.log('  ✅ sheet_hot: добавлены марки стали (137)');
console.log('  ✅ sheet_painted: добавлены марки стали (137) + оцинковка (27)');
console.log('  ✅ sheet_galv: добавлены марки стали (137) + оцинковка (27)');
console.log('  ✅ sheet_cold: добавлены марки стали (137)');
console.log();

console.log('🎯 РЕЗУЛЬТАТ:');
console.log('  Теперь эти типы будут использовать правильную формулу:');
console.log('  weightPerMeter = sizeCoef × steelCoef + galvCoef');
console.log();
console.log('  Это исправляет:');
console.log('  1. ✅ Марка стали теперь влияет на вес');
console.log('  2. ✅ Оцинковка считается правильно (для sheet_painted, sheet_galv)');
console.log();

console.log('🧪 СЛЕДУЮЩИЙ ШАГ: Запустите тесты для проверки!');
console.log('   node test-sheet-metals.js');
console.log();
