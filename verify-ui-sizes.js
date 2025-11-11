// ВЕРИФИКАЦИЯ РАЗМЕРОВ В UI
// Проверяет количество sizes для канатов и катанки

const metalDatabase = require('./database/metals.json');
const db = metalDatabase.metals;

console.log('🔍 ВЕРИФИКАЦИЯ РАЗМЕРОВ В UI\n');
console.log('═'.repeat(80));

// Типы металлов для проверки
const typesToCheck = [
    {
        key: 'rope',
        name: 'Канат',
        expectedSizes: 214,
        expectedWeights: 214,
        checkSteelTypes: false
    },
    {
        key: 'rope_armature',
        name: 'Канат арматурный',
        expectedSizes: 14,
        expectedWeights: 14,
        checkSteelTypes: false
    },
    {
        key: 'rope_galv',
        name: 'Канат оцинк.',
        expectedSizes: 214,
        expectedWeights: 214,
        checkSteelTypes: false
    },
    {
        key: 'wire_rod',
        name: 'Катанка',
        expectedSizes: 27,
        expectedWeights: null, // использует coefficients
        checkSteelTypes: true,
        expectedSteelTypes: 37
    }
];

let allPerfect = true;
let totalIssues = 0;
const results = [];

// Проверка каждого типа
typesToCheck.forEach((type, index) => {
    console.log(`\n${index + 1}. ${type.name} (${type.key}):\n`);

    const metal = db[type.key];
    const result = {
        key: type.key,
        name: type.name,
        perfect: true,
        issues: []
    };

    if (!metal) {
        console.log(`  ❌ ОТСУТСТВУЕТ В БД!`);
        result.perfect = false;
        result.issues.push('Металл отсутствует в БД');
        allPerfect = false;
        totalIssues++;
        results.push(result);
        return;
    }

    // ═══════════════════════════════════════════════════════════════
    // ПРОВЕРКА SIZES
    // ═══════════════════════════════════════════════════════════════

    console.log(`  📊 ПРОВЕРКА SIZES:`);
    const actualSizes = metal.sizes ? metal.sizes.length : 0;

    console.log(`    Ожидается: ${type.expectedSizes} размеров`);
    console.log(`    В БД: ${actualSizes} размеров`);

    if (actualSizes !== type.expectedSizes) {
        console.log(`    ❌ НЕСООТВЕТСТВИЕ! Разница: ${type.expectedSizes - actualSizes}`);
        result.perfect = false;
        result.issues.push(`Sizes: ${actualSizes} вместо ${type.expectedSizes}`);
        allPerfect = false;
        totalIssues++;
    } else {
        console.log(`    ✅ Количество совпадает!`);
    }

    result.actualSizes = actualSizes;
    result.expectedSizes = type.expectedSizes;

    // Показать примеры размеров
    if (metal.sizes && metal.sizes.length > 0) {
        const samples = metal.sizes.slice(0, 5);
        const lastSample = metal.sizes[metal.sizes.length - 1];
        console.log(`    Примеры: ${samples.join(', ')}, ... ${lastSample}`);
    }

    // ═══════════════════════════════════════════════════════════════
    // ПРОВЕРКА WEIGHTS/COEFFICIENTS
    // ═══════════════════════════════════════════════════════════════

    console.log(`\n  📊 ПРОВЕРКА WEIGHTS:`);

    if (type.key === 'wire_rod') {
        // Для катанки проверяем coefficients
        const actualCoeffs = metal.coefficients ? Object.keys(metal.coefficients).length : 0;
        console.log(`    Coefficients в БД: ${actualCoeffs}`);

        if (actualCoeffs === 0) {
            console.log(`    ❌ COEFFICIENTS ОТСУТСТВУЮТ!`);
            result.perfect = false;
            result.issues.push('Coefficients отсутствуют');
            allPerfect = false;
            totalIssues++;
        } else if (actualCoeffs !== actualSizes) {
            console.log(`    ⚠️  Несоответствие: sizes=${actualSizes}, coeffs=${actualCoeffs}`);
            result.perfect = false;
            result.issues.push(`Несоответствие: sizes=${actualSizes}, coeffs=${actualCoeffs}`);
            allPerfect = false;
            totalIssues++;
        } else {
            console.log(`    ✅ Coefficients присутствуют для всех размеров`);
        }

        result.actualWeights = actualCoeffs;
    } else {
        // Для канатов проверяем weights
        const actualWeights = metal.weights ? Object.keys(metal.weights).length : 0;
        console.log(`    В БД: ${actualWeights} weights`);

        if (type.expectedWeights !== null) {
            if (actualWeights !== type.expectedWeights) {
                console.log(`    ❌ НЕСООТВЕТСТВИЕ! Ожидается: ${type.expectedWeights}`);
                result.perfect = false;
                result.issues.push(`Weights: ${actualWeights} вместо ${type.expectedWeights}`);
                allPerfect = false;
                totalIssues++;
            } else {
                console.log(`    ✅ Количество weights совпадает!`);
            }
        }

        result.actualWeights = actualWeights;
        result.expectedWeights = type.expectedWeights;
    }

    // ═══════════════════════════════════════════════════════════════
    // ПРОВЕРКА STEELTYPES (только для катанки)
    // ═══════════════════════════════════════════════════════════════

    if (type.checkSteelTypes) {
        console.log(`\n  📊 ПРОВЕРКА МАРОК СТАЛИ:`);
        const actualSteelTypes = metal.steelTypes ? metal.steelTypes.length : 0;

        console.log(`    Ожидается: ${type.expectedSteelTypes} марок`);
        console.log(`    В БД: ${actualSteelTypes} марок`);

        if (actualSteelTypes !== type.expectedSteelTypes) {
            console.log(`    ❌ НЕСООТВЕТСТВИЕ! Разница: ${type.expectedSteelTypes - actualSteelTypes}`);
            result.perfect = false;
            result.issues.push(`SteelTypes: ${actualSteelTypes} вместо ${type.expectedSteelTypes}`);
            allPerfect = false;
            totalIssues++;
        } else {
            console.log(`    ✅ Количество марок стали совпадает!`);
        }

        result.actualSteelTypes = actualSteelTypes;
        result.expectedSteelTypes = type.expectedSteelTypes;

        // Показать примеры марок стали
        if (metal.steelTypes && metal.steelTypes.length > 0) {
            const samples = metal.steelTypes.slice(0, 10);
            console.log(`    Примеры: ${samples.join(', ')}, ...`);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ПРОВЕРКА ДРУГИХ ПАРАМЕТРОВ
    // ═══════════════════════════════════════════════════════════════

    console.log(`\n  📊 ПРОВЕРКА ПАРАМЕТРОВ:`);

    // Formula
    if (!metal.formula) {
        console.log(`    ⚠️  Formula отсутствует`);
        result.issues.push('Formula отсутствует');
    } else {
        console.log(`    ✅ Formula: ${metal.formula}`);
    }

    // GOST
    if (!metal.gost) {
        console.log(`    ⚠️  GOST отсутствует`);
        result.issues.push('GOST отсутствует');
    } else {
        const gostCount = metal.gost.split(',').length;
        console.log(`    ✅ GOST: ${gostCount} ГОСТов`);
    }

    // Category
    console.log(`    ✅ Category: ${metal.category}`);

    results.push(result);
});

// ═══════════════════════════════════════════════════════════════════
// ИТОГОВАЯ СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(80));
console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');

const perfectCount = results.filter(r => r.perfect).length;

console.log(`  Проверено типов: ${typesToCheck.length}`);
console.log(`  Идеальных типов: ${perfectCount}/${typesToCheck.length}`);
console.log(`  Найдено проблем: ${totalIssues}`);

console.log('\n  Детализация:');
results.forEach(r => {
    const status = r.perfect ? '✅' : '❌';
    const sizesText = `sizes: ${r.actualSizes}/${r.expectedSizes}`;
    const weightsText = r.expectedWeights !== undefined
        ? `, weights: ${r.actualWeights}/${r.expectedWeights}`
        : `, coeffs: ${r.actualWeights}`;
    const steelTypesText = r.expectedSteelTypes !== undefined
        ? `, steelTypes: ${r.actualSteelTypes}/${r.expectedSteelTypes}`
        : '';

    console.log(`    ${status} ${r.name}: ${sizesText}${weightsText}${steelTypesText}`);

    if (r.issues.length > 0) {
        r.issues.forEach(issue => console.log(`         └─ ${issue}`));
    }
});

console.log('\n' + '═'.repeat(80));

if (allPerfect) {
    console.log('\n🎉 ВСЕ РАЗМЕРЫ В ПОРЯДКЕ!\n');
    console.log('  ✅ Канат: 214 sizes + 214 weights');
    console.log('  ✅ Канат арматурный: 14 sizes + 14 weights');
    console.log('  ✅ Канат оцинк.: 214 sizes + 214 weights');
    console.log('  ✅ Катанка: 27 sizes + 27 coefficients + 37 steelTypes\n');
    console.log('🎯 СТАТУС: ГОТОВО К ОТОБРАЖЕНИЮ В UI!');
    process.exit(0);
} else {
    console.log('\n⚠️  НАЙДЕНЫ НЕСООТВЕТСТВИЯ!\n');
    console.log('  Детали проблем:');
    results.forEach(r => {
        if (!r.perfect) {
            console.log(`\n  ${r.name}:`);
            r.issues.forEach(issue => console.log(`    - ${issue}`));
        }
    });
    console.log('\n⚠️  СТАТУС: ТРЕБУЮТСЯ ИСПРАВЛЕНИЯ!');
    process.exit(1);
}
