// ВЕРИФИКАЦИЯ КРЕПЕЖА
// Проверяет наличие всех 9 подкатегорий крепежа

const metalDatabase = require('./database/metals.json');
const db = metalDatabase.metals;

console.log('🔍 ВЕРИФИКАЦИЯ КРЕПЕЖА\n');
console.log('═'.repeat(80));

// Требуемые подкатегории крепежа
const requiredFasteners = [
    { key: 'bolt', name: 'Болты', alternativeKeys: ['fastener_bolt'] },
    { key: 'screw', name: 'Винты', alternativeKeys: ['fastener_screw'] },
    { key: 'nut', name: 'Гайки', alternativeKeys: ['fastener_nut'] },
    { key: 'nail', name: 'Гвозди', alternativeKeys: ['fastener_nail'] },
    { key: 'selftapping', name: 'Саморезы', alternativeKeys: ['fastener_selftapping', 'self_tapping'] },
    { key: 'washer', name: 'Шайбы', alternativeKeys: ['fastener_washer'] },
    { key: 'stud', name: 'Шпильки', alternativeKeys: ['fastener_stud'] },
    { key: 'cotter', name: 'Шплинты', alternativeKeys: ['fastener_cotter'] },
    { key: 'woodscrew', name: 'Шурупы', alternativeKeys: ['fastener_woodscrew', 'wood_screw'] }
];

// Найти все металлы с категорией "Крепеж" или "Крепёж"
const fasteners = {};
Object.keys(db).forEach(key => {
    const metal = db[key];
    if (metal.category === 'Крепеж' || metal.category === 'Крепёж') {
        fasteners[key] = metal;
    }
});

console.log(`\n📊 НАЙДЕНО В БД:`);
console.log(`  Всего металлов с категорией "Крепеж": ${Object.keys(fasteners).length}\n`);

if (Object.keys(fasteners).length > 0) {
    console.log(`  Список найденных:`);
    Object.keys(fasteners).forEach(key => {
        const metal = fasteners[key];
        const sizesCount = metal.sizes ? metal.sizes.length : 0;
        const weightsCount = metal.weights ? Object.keys(metal.weights).length : 0;
        console.log(`    - ${key}: ${metal.name} (${sizesCount} sizes, ${weightsCount} weights)`);
    });
}

console.log('\n' + '═'.repeat(80));
console.log('\n📋 ПРОВЕРКА ТРЕБУЕМЫХ ПОДКАТЕГОРИЙ:\n');

let foundCount = 0;
let missingCount = 0;
const results = [];

requiredFasteners.forEach((required, index) => {
    console.log(`${index + 1}. ${required.name}:`);

    // Попробовать найти по основному ключу или альтернативным
    const allKeys = [required.key, ...required.alternativeKeys];
    let foundKey = null;
    let metal = null;

    for (const key of allKeys) {
        if (db[key]) {
            foundKey = key;
            metal = db[key];
            break;
        }
    }

    const result = {
        name: required.name,
        expectedKey: required.key,
        found: !!metal,
        foundKey: foundKey,
        sizes: 0,
        weights: 0,
        hasWeights: false,
        gost: null,
        formula: null,
        issues: []
    };

    if (metal) {
        console.log(`   ✅ НАЙДЕН (ключ: ${foundKey})`);
        foundCount++;

        // Проверить sizes
        const sizesCount = metal.sizes ? metal.sizes.length : 0;
        result.sizes = sizesCount;

        if (sizesCount === 0) {
            console.log(`      ⚠️  Sizes: 0 (отсутствуют)`);
            result.issues.push('Sizes отсутствуют');
        } else {
            console.log(`      ✅ Sizes: ${sizesCount}`);
            // Показать примеры
            if (metal.sizes && metal.sizes.length > 0) {
                const samples = metal.sizes.slice(0, 5);
                console.log(`         Примеры: ${samples.join(', ')}${sizesCount > 5 ? ', ...' : ''}`);
            }
        }

        // Проверить weights
        const weightsCount = metal.weights ? Object.keys(metal.weights).length : 0;
        result.weights = weightsCount;
        result.hasWeights = weightsCount > 0;

        if (weightsCount === 0) {
            console.log(`      ❌ Weights: 0 (ОТСУТСТВУЮТ - невозможен расчёт!)`);
            result.issues.push('Weights отсутствуют - невозможен расчёт');
        } else {
            console.log(`      ✅ Weights: ${weightsCount}`);

            // Проверить соответствие sizes и weights
            if (weightsCount !== sizesCount) {
                console.log(`      ⚠️  Несоответствие: sizes=${sizesCount}, weights=${weightsCount}`);
                result.issues.push(`Несоответствие: sizes=${sizesCount}, weights=${weightsCount}`);
            }
        }

        // ГОСТ
        result.gost = metal.gost || null;
        if (metal.gost) {
            console.log(`      ✅ ГОСТ: ${metal.gost.substring(0, 50)}${metal.gost.length > 50 ? '...' : ''}`);
        } else {
            console.log(`      ⚠️  ГОСТ: отсутствует`);
            result.issues.push('ГОСТ отсутствует');
        }

        // Formula
        result.formula = metal.formula || null;
        if (metal.formula) {
            console.log(`      ✅ Formula: ${metal.formula}`);
        } else {
            console.log(`      ⚠️  Formula: отсутствует`);
            result.issues.push('Formula отсутствует');
        }

        // perThousand
        if (metal.perThousand) {
            console.log(`      ℹ️  perThousand: true (вес указан за 1000 шт)`);
        }

        // useKilograms
        if (metal.useKilograms) {
            console.log(`      ℹ️  useKilograms: true`);
        }

    } else {
        console.log(`   ❌ ОТСУТСТВУЕТ В БД`);
        console.log(`      Искалось по ключам: ${allKeys.join(', ')}`);
        missingCount++;
        result.issues.push('Подкатегория отсутствует в БД');
    }

    console.log('');
    results.push(result);
});

// ═══════════════════════════════════════════════════════════════════
// ИТОГОВАЯ СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════════

console.log('═'.repeat(80));
console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА КРЕПЕЖА:\n');

const totalRequired = requiredFasteners.length;
const completenessPercent = ((foundCount / totalRequired) * 100).toFixed(1);

console.log(`  Требуется подкатегорий: ${totalRequired}`);
console.log(`  Найдено в БД: ${foundCount}`);
console.log(`  Отсутствует: ${missingCount}`);
console.log(`  Процент полноты: ${completenessPercent}%`);

console.log('\n  Детализация:');
results.forEach(r => {
    const status = r.found ? '✅' : '❌';
    const details = r.found
        ? `(${r.sizes} sizes, ${r.weights} weights${r.hasWeights ? '' : ' ⚠️'})`
        : '(отсутствует)';
    console.log(`    ${status} ${r.name}: ${details}`);

    if (r.issues.length > 0) {
        r.issues.forEach(issue => console.log(`         └─ ${issue}`));
    }
});

console.log('\n' + '═'.repeat(80));

if (missingCount === 0 && results.every(r => r.hasWeights)) {
    console.log('\n🎉 ВСЕ ПОДКАТЕГОРИИ КРЕПЕЖА ПРИСУТСТВУЮТ!\n');
    console.log('  ✅ Все 9 подкатегорий найдены');
    console.log('  ✅ Все имеют weights для расчёта');
    console.log('  ✅ Все имеют sizes\n');
    console.log('🎯 СТАТУС: КРЕПЁЖ ГОТОВ К ИСПОЛЬЗОВАНИЮ!');
    process.exit(0);
} else {
    console.log('\n⚠️  КРЕПЁЖ НЕПОЛНЫЙ!\n');

    if (missingCount > 0) {
        console.log(`  ❌ Отсутствует подкатегорий: ${missingCount}`);
        console.log(`  Список отсутствующих:`);
        results.filter(r => !r.found).forEach(r => {
            console.log(`    - ${r.name} (ожидаемый ключ: ${r.expectedKey})`);
        });
    }

    const withoutWeights = results.filter(r => r.found && !r.hasWeights);
    if (withoutWeights.length > 0) {
        console.log(`\n  ⚠️  Без weights (${withoutWeights.length}):  `);
        withoutWeights.forEach(r => {
            console.log(`    - ${r.name}: невозможен расчёт веса`);
        });
    }

    console.log('\n⚠️  СТАТУС: ТРЕБУЕТСЯ ДОБАВЛЕНИЕ НЕДОСТАЮЩИХ ТИПОВ!');
    process.exit(1);
}
