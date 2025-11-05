// ИНТЕГРАЦИЯ ШПИЛЕК В БАЗУ ДАННЫХ
// Добавляет последний тип крепежа

const fs = require('fs');
const path = require('path');

console.log('\n🚀 ИНТЕГРАЦИЯ ШПИЛЕК');
console.log('═'.repeat(60));

// Загружаем данные
const dbPath = path.join(__dirname, 'database', 'metals.json');
const extractedPath = path.join(__dirname, 'extracted-fasteners.json');

console.log('\n📂 Загрузка данных...');

const metalDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const extractedData = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

console.log('   ✅ База данных загружена');
console.log('   ✅ Извлечённые данные загружены');

// Проверяем наличие данных шпилек
const studsData = extractedData['shpilki'];

if (!studsData) {
    console.error('\n❌ Данные шпилек не найдены в extracted-fasteners.json');
    console.error('   Доступные ключи:', Object.keys(extractedData));
    process.exit(1);
}

console.log(`\n📦 Данные шпилек:`);
console.log(`   Размеров: ${studsData.sizes.length}`);
console.log(`   Weights: ${Object.keys(studsData.weights).length}`);
console.log(`   Gosts: ${Object.keys(studsData.gosts).length}`);

// Примеры размеров
console.log(`\n📊 Примеры размеров (первые 5):`);
studsData.sizes.slice(0, 5).forEach(size => {
    const weight = studsData.weights[size];
    const gost = studsData.gosts[size];
    console.log(`   ${size}: ${weight} кг/1000шт | ${gost}`);
});

// Ключ для шпилек в БД
const key = 'stud';

// Проверка существования в БД
if (metalDatabase.metals[key]) {
    console.warn(`\n⚠️  ${key} уже существует в БД`);
    console.warn(`   Старые размеры: ${metalDatabase.metals[key].sizes.length}`);
    console.warn(`   Новые размеры: ${studsData.sizes.length}`);
    console.warn(`   ОБНОВЛЯЕМ...`);
} else {
    console.log(`\n✅ Ключ ${key} свободен, добавляем новый тип`);
}

// Создаём структуру
metalDatabase.metals[key] = {
    name: 'Шпильки',
    gost: 'См. таблицу по размерам',
    category: 'Крепеж',
    formula: 'metiz',
    standardLengths: null,
    sizes: studsData.sizes,
    weights: studsData.weights,
    gosts: studsData.gosts,
    perThousand: true,
    useKilograms: true
};

console.log('\n💾 Сохранение в БД...');

// Сохраняем
fs.writeFileSync(
    dbPath,
    JSON.stringify(metalDatabase, null, 2),
    'utf8'
);

const newSize = fs.statSync(dbPath).size;

console.log('   ✅ База данных обновлена');
console.log(`   ✅ Размер файла: ${(newSize / 1024).toFixed(2)} KB`);

// Проверка
const updatedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const addedStud = updatedDb.metals[key];

if (addedStud && addedStud.sizes.length === studsData.sizes.length) {
    console.log('\n✅ ШПИЛЬКИ УСПЕШНО ДОБАВЛЕНЫ!');
    console.log(`   Ключ: ${key}`);
    console.log(`   Название: ${addedStud.name}`);
    console.log(`   Размеров: ${addedStud.sizes.length}`);
    console.log(`   Category: ${addedStud.category}`);
    console.log(`   Formula: ${addedStud.formula}`);
    console.log(`   perThousand: ${addedStud.perThousand}`);
    console.log(`   useKilograms: ${addedStud.useKilograms}`);

    // Подсчёт всех типов крепежа
    const fastenerTypes = Object.keys(updatedDb.metals).filter(k =>
        updatedDb.metals[k].category === 'Крепеж'
    );

    console.log(`\n📊 СТАТИСТИКА КРЕПЕЖА:`);
    console.log(`   Всего типов: ${fastenerTypes.length}`);

    let totalFastenerSizes = 0;
    fastenerTypes.forEach(type => {
        const metal = updatedDb.metals[type];
        const sizesCount = metal.sizes ? metal.sizes.length : 0;
        totalFastenerSizes += sizesCount;
        console.log(`   - ${metal.name}: ${sizesCount} размеров`);
    });

    console.log(`   ИТОГО размеров крепежа: ${totalFastenerSizes}`);

    console.log('\n═'.repeat(60));
    console.log('🎉 ИНТЕГРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!');
    process.exit(0);
} else {
    console.error('\n❌ ОШИБКА ПРИ ПРОВЕРКЕ ДОБАВЛЕННЫХ ДАННЫХ!');
    process.exit(1);
}
