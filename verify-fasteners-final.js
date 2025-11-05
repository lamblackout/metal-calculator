// ФИНАЛЬНАЯ ВЕРИФИКАЦИЯ ВСЕХ 9 ТИПОВ КРЕПЕЖА
// Проверяет полноту данных для всех подкатегорий

const metalDatabase = require('./database/metals.json');
const db = metalDatabase.metals;

console.log('\n🎯 ФИНАЛЬНАЯ ПРОВЕРКА КРЕПЕЖА');
console.log('═'.repeat(80));

const fastenerTypes = [
    { key: 'bolt', name: 'Болты', minExpected: 15 },
    { key: 'screw', name: 'Винты', minExpected: 600 },
    { key: 'nut', name: 'Гайки', minExpected: 15 },
    { key: 'nail', name: 'Гвозди', minExpected: 500 },
    { key: 'selftapping', name: 'Саморезы', minExpected: 60 },
    { key: 'washer', name: 'Шайбы', minExpected: 15 },
    { key: 'stud', name: 'Шпильки', minExpected: 1500 },
    { key: 'cotter', name: 'Шплинты', minExpected: 180 },
    { key: 'woodscrew', name: 'Шурупы', minExpected: 170 }
];

console.log('\n| № | Тип         | Ключ         | Sizes | Weights | Gosts | Ожид. | Статус |');
console.log('|---|-------------|--------------|-------|---------|-------|-------|--------|');

let totalTypes = 0;
let readyTypes = 0;
let totalSizes = 0;
const missingTypes = [];
const issues = [];

fastenerTypes.forEach((type, index) => {
    const metal = db[type.key];
    const exists = metal !== undefined;

    if (exists) {
        const sizesCount = metal.sizes ? metal.sizes.length : 0;
        const weightsCount = metal.weights ? Object.keys(metal.weights).length : 0;

        // Поддержка двух форматов ГОСТов:
        // 1. Старый формат: один общий ГОСТ в поле gost (строка)
        // 2. Новый формат: индивидуальные ГОСТы в поле gosts (объект)
        const hasGeneralGost = metal.gost && typeof metal.gost === 'string' && metal.gost.trim() !== '';
        const gostsCount = metal.gosts ? Object.keys(metal.gosts).length : 0;
        const hasGosts = hasGeneralGost || gostsCount > 0;
        const gostsDisplay = hasGeneralGost ? 'общий' : gostsCount.toString();

        const isComplete = sizesCount === weightsCount && sizesCount > 0 && hasGosts;
        const meetsMinimum = sizesCount >= type.minExpected;
        const status = isComplete && meetsMinimum ? '✅' : '⚠️';

        console.log(`| ${(index + 1).toString().padStart(2)} | ${type.name.padEnd(11)} | ${type.key.padEnd(12)} | ${sizesCount.toString().padStart(5)} | ${weightsCount.toString().padStart(7)} | ${gostsDisplay.toString().padStart(5)} | ${type.minExpected.toString().padStart(5)} | ${status}      |`);

        totalSizes += sizesCount;

        if (isComplete && meetsMinimum) {
            readyTypes++;
        } else {
            if (!isComplete) {
                if (sizesCount !== weightsCount) {
                    issues.push(`${type.name}: Несоответствие данных (sizes=${sizesCount}, weights=${weightsCount})`);
                }
                if (!hasGosts) {
                    issues.push(`${type.name}: Отсутствуют ГОСТы`);
                }
            }
            if (!meetsMinimum) {
                issues.push(`${type.name}: Недостаточно размеров (${sizesCount} < ${type.minExpected})`);
            }
        }
    } else {
        console.log(`| ${(index + 1).toString().padStart(2)} | ${type.name.padEnd(11)} | ${type.key.padEnd(12)} | -     | -       | -     | ${type.minExpected.toString().padStart(5)} | ❌     |`);
        missingTypes.push(type.name);
    }

    totalTypes++;
});

console.log('|---|-------------|--------------|-------|---------|-------|-------|--------|');
console.log(`| ИТОГО: ${readyTypes}/${totalTypes} типов готовы | Размеров: ${totalSizes} |`);

const completeness = (readyTypes / totalTypes * 100).toFixed(1);

console.log('\n' + '═'.repeat(80));
console.log(`\n📊 ГОТОВНОСТЬ КРЕПЕЖА: ${readyTypes}/${totalTypes} = ${completeness}%`);
console.log(`📊 ВСЕГО РАЗМЕРОВ КРЕПЕЖА: ${totalSizes}\n`);

if (readyTypes === totalTypes) {
    console.log('🎉 ВСЕ 9 ТИПОВ КРЕПЕЖА ГОТОВЫ! 100% ЗАВЕРШЕНО!\n');

    // Детализация по типам
    console.log('📋 Детализация:');
    fastenerTypes.forEach((type, index) => {
        const metal = db[type.key];
        if (metal) {
            const sizesCount = metal.sizes.length;
            console.log(`   ${index + 1}. ✅ ${type.name.padEnd(12)} - ${sizesCount.toString().padStart(4)} размеров`);
        }
    });

    console.log('\n' + '═'.repeat(80));
    console.log('✅ СТАТУС: КРЕПЁЖ ПОЛНОСТЬЮ ГОТОВ К ИСПОЛЬЗОВАНИЮ!');
    process.exit(0);
} else {
    console.log(`⚠️  Не хватает: ${totalTypes - readyTypes} типов\n`);

    if (missingTypes.length > 0) {
        console.log('❌ Отсутствующие типы:');
        missingTypes.forEach(name => console.log(`   - ${name}`));
    }

    if (issues.length > 0) {
        console.log('\n⚠️  Проблемы:');
        issues.forEach(issue => console.log(`   - ${issue}`));
    }

    process.exit(1);
}
