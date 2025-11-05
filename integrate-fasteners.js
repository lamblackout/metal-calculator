// ИНТЕГРАЦИЯ КРЕПЕЖА В БАЗУ ДАННЫХ
// Добавляет новые типы крепежа в database/metals.json

const fs = require('fs');
const path = require('path');

console.log('🔧 ИНТЕГРАЦИЯ КРЕПЕЖА В БАЗУ ДАННЫХ\n');
console.log('═'.repeat(80));

// Загрузить extracted data
const extractedPath = path.join(__dirname, 'extracted-fasteners.json');
if (!fs.existsSync(extractedPath)) {
    console.log('❌ Файл extracted-fasteners.json не найден!');
    console.log('   Запустите сначала: node extract-fasteners-data.js');
    process.exit(1);
}

const extractedData = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
console.log(`✅ Загружено извлечённых данных: ${Object.keys(extractedData).length} типов\n`);

// Загрузить текущую БД
const dbPath = path.join(__dirname, 'database', 'metals.json');
const metalDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const db = metalDatabase.metals;

console.log(`✅ Загружена база данных: ${Object.keys(db).length} металлов\n`);

console.log('═'.repeat(80));

// Маппинг внутренних ключей на ключи БД
const categoryMap = {
    'vinty': {
        dbKey: 'screw',  // Использовать короткий ключ как у bolt/nut/washer
        name: 'Винты',
        gost: 'См. таблицу по размерам'
    },
    'gvozdi': {
        dbKey: 'nail',
        name: 'Гвозди',
        gost: 'См. таблицу по размерам'
    },
    'samorezy': {
        dbKey: 'selftapping',
        name: 'Саморезы',
        gost: 'См. таблицу по размерам'
    },
    'shpilki': {
        dbKey: 'stud',
        name: 'Шпильки',
        gost: 'См. таблицу по размерам'
    },
    'shplynty': {
        dbKey: 'cotter',
        name: 'Шплинты',
        gost: 'См. таблицу по размерам'
    },
    'shyrypy': {
        dbKey: 'woodscrew',
        name: 'Шурупы',
        gost: 'См. таблицу по размерам'
    }
};

let addedCount = 0;
let skippedCount = 0;
let totalSizes = 0;
const report = [];

// Интеграция каждого типа
Object.keys(extractedData).forEach((extractedKey, index) => {
    const fastener = extractedData[extractedKey];
    const mapping = categoryMap[extractedKey];

    if (!mapping) {
        console.log(`\n${index + 1}. ${fastener.name}:`);
        console.log(`   ⚠️  Маппинг не найден, пропускаем`);
        skippedCount++;
        return;
    }

    console.log(`\n${index + 1}. ${fastener.name} (${extractedKey} → ${mapping.dbKey}):\n`);

    // Проверить наличие в БД
    if (db[mapping.dbKey]) {
        console.log(`   ⚠️  ${mapping.dbKey} уже существует в БД`);
        console.log(`   Текущие данные:`);
        console.log(`     - Sizes: ${db[mapping.dbKey].sizes ? db[mapping.dbKey].sizes.length : 0}`);
        console.log(`     - Weights: ${db[mapping.dbKey].weights ? Object.keys(db[mapping.dbKey].weights).length : 0}`);
        console.log(`   ❌ ПРОПУСКАЕМ (не перезаписываем)`);
        skippedCount++;

        report.push({
            name: fastener.name,
            dbKey: mapping.dbKey,
            added: false,
            reason: 'Уже существует в БД',
            sizesCount: fastener.sizes.length
        });
        return;
    }

    // Создать структуру для БД
    const newEntry = {
        name: mapping.name,
        gost: mapping.gost,  // Общий ГОСТ
        category: 'Крепеж',
        formula: 'metiz',
        standardLengths: null,
        sizes: fastener.sizes,
        weights: fastener.weights,
        gosts: fastener.gosts,  // ГОСТы по размерам
        perThousand: true,
        useKilograms: true
    };

    // Добавить в БД
    db[mapping.dbKey] = newEntry;

    console.log(`   ✅ ДОБАВЛЕНО В БД`);
    console.log(`     - Ключ: ${mapping.dbKey}`);
    console.log(`     - Название: ${mapping.name}`);
    console.log(`     - Category: Крепеж`);
    console.log(`     - Formula: metiz`);
    console.log(`     - Sizes: ${fastener.sizes.length}`);
    console.log(`     - Weights: ${Object.keys(fastener.weights).length}`);
    console.log(`     - Gosts: ${Object.keys(fastener.gosts).length}`);
    console.log(`     - perThousand: true`);
    console.log(`     - useKilograms: true`);

    addedCount++;
    totalSizes += fastener.sizes.length;

    report.push({
        name: fastener.name,
        dbKey: mapping.dbKey,
        added: true,
        sizesCount: fastener.sizes.length,
        weightsCount: Object.keys(fastener.weights).length,
        gostsCount: Object.keys(fastener.gosts).length
    });
});

// ═══════════════════════════════════════════════════════════════════
// ИТОГОВАЯ СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(80));
console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА ИНТЕГРАЦИИ:\n');

console.log(`  Обработано типов: ${Object.keys(extractedData).length}`);
console.log(`  Добавлено в БД: ${addedCount}`);
console.log(`  Пропущено: ${skippedCount}`);
console.log(`  Всего размеров добавлено: ${totalSizes}`);
console.log(`  Металлов в БД после интеграции: ${Object.keys(db).length}`);

console.log('\n  Детализация:');
report.forEach(r => {
    const status = r.added ? '✅ ДОБАВЛЕНО' : '⚠️  ПРОПУЩЕНО';
    const details = r.added
        ? `(${r.sizesCount} sizes, ${r.weightsCount} weights, ${r.gostsCount} gosts)`
        : `(${r.reason})`;

    console.log(`    ${status} ${r.name} (${r.dbKey}): ${details}`);
});

console.log('\n' + '═'.repeat(80));

// Сохранить обновлённую БД
if (addedCount > 0) {
    metalDatabase.metals = db;

    fs.writeFileSync(
        dbPath,
        JSON.stringify(metalDatabase, null, 2),
        'utf8'
    );

    console.log('\n✅ БАЗА ДАННЫХ ОБНОВЛЕНА:\n');
    console.log(`   ${dbPath}`);
    console.log(`   Добавлено типов крепежа: ${addedCount}`);
    console.log(`   Добавлено размеров: ${totalSizes}`);
    console.log(`   Размер файла: ${fs.statSync(dbPath).size} байт`);

    console.log('\n🎯 СТАТУС: ИНТЕГРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!');
    process.exit(0);
} else {
    console.log('\n⚠️  НЕ ДОБАВЛЕНО НОВЫХ ТИПОВ!');
    console.log('\n   Возможные причины:');
    console.log('   - Все типы уже существуют в БД');
    console.log('   - Нет извлечённых данных для добавления');
    console.log('\n⚠️  СТАТУС: БД НЕ ИЗМЕНЕНА!');
    process.exit(1);
}
