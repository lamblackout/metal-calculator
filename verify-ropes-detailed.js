// ✅ ДЕТАЛЬНАЯ СВЕРКА КАНАТОВ С ЭТАЛОННЫМ ФАЙЛОМ
// Проверяет КАЖДЫЙ размер и КАЖДЫЙ вес всех 3 типов канатов

const fs = require('fs');
const path = require('path');

console.log('🔍 ДЕТАЛЬНАЯ СВЕРКА КАНАТОВ С ЭТАЛОНОМ\n');
console.log('📁 Эталонный файл: Калькулятор_КАНАТЫ_ИСПРАВЛЕНО.tsx\n');
console.log('═'.repeat(80));

// Загрузить текущую БД
const currentDB = require('./database/metals.json').metals;

// Загрузить эталонный файл
const sourcePath = path.join(__dirname, 'Калькулятор_КАНАТЫ_ИСПРАВЛЕНО.tsx');
const sourceFile = fs.readFileSync(sourcePath, 'utf8');

// Типы канатов для проверки
const ropeTypes = [
    {key: 'rope', name: 'Канат', expectedSizes: 214},
    {key: 'rope_armature', name: 'Канат арматурный', expectedSizes: 14},
    {key: 'rope_galv', name: 'Канат оцинк.', expectedSizes: 214}
];

let allPerfect = true;
let totalIssues = 0;
const detailedReport = [];

// Функция для извлечения sizes из эталонного файла
function extractSizesFromSource(ropeKey) {
    // Ищем блок данных для этого каната
    const regex = new RegExp(`'${ropeKey}':\\s*\\{[^}]*sizes:\\s*\\[([^\\]]+)\\]`, 's');
    const match = sourceFile.match(regex);

    if (match) {
        const sizesString = match[1];
        // Парсим размеры
        const sizes = sizesString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => parseFloat(s));

        return sizes.filter(s => !isNaN(s));
    }

    return null;
}

// Функция для извлечения weights из эталонного файла
function extractWeightsFromSource(ropeKey) {
    // Ищем блок weights
    const regex = new RegExp(`'${ropeKey}':\\s*\\{[^}]*weights:\\s*\\{([^}]+)\\}`, 's');
    const match = sourceFile.match(regex);

    if (match) {
        const weightsString = match[1];
        const weights = {};

        // Парсим пары ключ-значение
        const lines = weightsString.split('\n');
        lines.forEach(line => {
            const matches = line.matchAll(/"([\d.]+)":\s*([\d.]+)/g);
            for (const m of matches) {
                weights[m[1]] = parseFloat(m[2]);
            }
        });

        return weights;
    }

    return null;
}

// Проверка каждого типа каната
ropeTypes.forEach((ropeType, index) => {
    console.log(`\n${index + 1}. ${ropeType.name} (${ropeType.key}):\n`);

    const currentMetal = currentDB[ropeType.key];
    const sourceSizes = extractSizesFromSource(ropeType.key);
    const sourceWeights = extractWeightsFromSource(ropeType.key);

    const ropeReport = {
        key: ropeType.key,
        name: ropeType.name,
        issues: [],
        perfect: true
    };

    if (!currentMetal) {
        console.log(`  ❌ ОТСУТСТВУЕТ В БД!`);
        ropeReport.issues.push('Металл отсутствует в БД');
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
        detailedReport.push(ropeReport);
        return;
    }

    // ═══════════════════════════════════════════════════════════════
    // ПРОВЕРКА SIZES
    // ═══════════════════════════════════════════════════════════════

    console.log(`  📊 ПРОВЕРКА SIZES:`);
    const currentSizes = currentMetal.sizes || [];
    const expectedSizes = ropeType.expectedSizes;

    console.log(`    Ожидается: ${expectedSizes} размеров`);
    console.log(`    В БД: ${currentSizes.length} размеров`);

    if (currentSizes.length !== expectedSizes) {
        console.log(`    ❌ НЕСООТВЕТСТВИЕ! Разница: ${expectedSizes - currentSizes.length}`);
        ropeReport.issues.push(`Несоответствие количества sizes: ${currentSizes.length} вместо ${expectedSizes}`);
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
    } else {
        console.log(`    ✅ Количество совпадает!`);
    }

    // Детальная сверка sizes с эталоном
    if (sourceSizes && sourceSizes.length > 0) {
        console.log(`    Размеров в эталоне: ${sourceSizes.length}`);

        // Найти отсутствующие размеры
        const missingSizes = sourceSizes.filter(size => !currentSizes.includes(size));
        if (missingSizes.length > 0) {
            console.log(`    ❌ ОТСУТСТВУЮТ В БД (${missingSizes.length}):`);
            console.log(`       ${missingSizes.slice(0, 10).join(', ')}${missingSizes.length > 10 ? '...' : ''}`);
            ropeReport.issues.push(`Отсутствуют ${missingSizes.length} sizes из эталона`);
            ropeReport.perfect = false;
            allPerfect = false;
            totalIssues++;
        } else {
            console.log(`    ✅ Все размеры из эталона присутствуют`);
        }

        // Найти лишние размеры
        const extraSizes = currentSizes.filter(size => !sourceSizes.includes(size));
        if (extraSizes.length > 0) {
            console.log(`    ⚠️  ЛИШНИЕ В БД (${extraSizes.length}):`);
            console.log(`       ${extraSizes.slice(0, 10).join(', ')}${extraSizes.length > 10 ? '...' : ''}`);
            ropeReport.issues.push(`Лишние ${extraSizes.length} sizes в БД`);
        }

        // Проверка порядка sizes
        const sizesInOrder = currentSizes.every((size, i, arr) => i === 0 || size >= arr[i - 1]);
        if (!sizesInOrder) {
            console.log(`    ⚠️  Sizes не отсортированы`);
        } else {
            console.log(`    ✅ Sizes отсортированы по возрастанию`);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ПРОВЕРКА WEIGHTS
    // ═══════════════════════════════════════════════════════════════

    console.log(`\n  📊 ПРОВЕРКА WEIGHTS:`);
    const currentWeights = currentMetal.weights || {};
    const currentWeightsCount = Object.keys(currentWeights).length;

    console.log(`    В БД: ${currentWeightsCount} весов`);

    if (currentWeightsCount === 0) {
        console.log(`    ❌ WEIGHTS ОТСУТСТВУЮТ!`);
        ropeReport.issues.push('Weights отсутствуют');
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
    } else if (currentWeightsCount !== currentSizes.length) {
        console.log(`    ⚠️  Несоответствие: sizes=${currentSizes.length}, weights=${currentWeightsCount}`);
        ropeReport.issues.push(`Несоответствие: sizes=${currentSizes.length}, weights=${currentWeightsCount}`);
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
    } else {
        console.log(`    ✅ Weights присутствуют для всех размеров`);
    }

    // Проверка что все sizes имеют weights
    const sizesWithoutWeights = currentSizes.filter(size => !currentWeights[String(size)]);
    if (sizesWithoutWeights.length > 0) {
        console.log(`    ❌ SIZES БЕЗ WEIGHTS (${sizesWithoutWeights.length}):`);
        console.log(`       ${sizesWithoutWeights.slice(0, 10).join(', ')}${sizesWithoutWeights.length > 10 ? '...' : ''}`);
        ropeReport.issues.push(`${sizesWithoutWeights.length} sizes без weights`);
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
    } else {
        console.log(`    ✅ Все sizes имеют соответствующие weights`);
    }

    // Детальная сверка weights с эталоном
    if (sourceWeights && Object.keys(sourceWeights).length > 0) {
        console.log(`    Весов в эталоне: ${Object.keys(sourceWeights).length}`);

        let weightsMismatchCount = 0;
        const weightsMismatches = [];

        Object.keys(sourceWeights).forEach(size => {
            const sourceWeight = sourceWeights[size];
            const currentWeight = currentWeights[size];

            if (currentWeight === undefined) {
                weightsMismatchCount++;
                weightsMismatches.push(`${size}: отсутствует (эталон: ${sourceWeight})`);
            } else if (Math.abs(currentWeight - sourceWeight) > 0.0001) {
                weightsMismatchCount++;
                weightsMismatches.push(`${size}: ${currentWeight} (эталон: ${sourceWeight})`);
            }
        });

        if (weightsMismatchCount > 0) {
            console.log(`    ❌ ВЕСА НЕ СОВПАДАЮТ: ${weightsMismatchCount} несоответствий`);
            console.log(`       Примеры:`);
            weightsMismatches.slice(0, 5).forEach(m => console.log(`         ${m}`));
            if (weightsMismatches.length > 5) {
                console.log(`         ... и ещё ${weightsMismatches.length - 5}`);
            }
            ropeReport.issues.push(`${weightsMismatchCount} несоответствий weights с эталоном`);
            ropeReport.perfect = false;
            allPerfect = false;
            totalIssues++;
        } else {
            console.log(`    ✅ Все веса совпадают с эталоном (точность 0.0001)`);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ПРОВЕРКА ДРУГИХ ПАРАМЕТРОВ
    // ═══════════════════════════════════════════════════════════════

    console.log(`\n  📊 ПРОВЕРКА ПАРАМЕТРОВ:`);

    // Formula
    if (!currentMetal.formula) {
        console.log(`    ❌ FORMULA отсутствует!`);
        ropeReport.issues.push('Formula отсутствует');
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
    } else if (currentMetal.formula !== 'rope') {
        console.log(`    ⚠️  Formula: ${currentMetal.formula} (ожидается: rope)`);
        ropeReport.issues.push(`Formula: ${currentMetal.formula} (ожидается: rope)`);
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
    } else {
        console.log(`    ✅ Formula: ${currentMetal.formula}`);
    }

    // useKilograms
    if (currentMetal.useKilograms !== true) {
        console.log(`    ⚠️  useKilograms: ${currentMetal.useKilograms} (должен быть: true)`);
        ropeReport.issues.push('useKilograms не true');
        ropeReport.perfect = false;
        allPerfect = false;
        totalIssues++;
    } else {
        console.log(`    ✅ useKilograms: true`);
    }

    // GOST
    if (!currentMetal.gost) {
        console.log(`    ⚠️  GOST отсутствует`);
        ropeReport.issues.push('GOST отсутствует');
    } else {
        const gostCount = currentMetal.gost.split(',').length;
        console.log(`    ✅ GOST: ${gostCount} ГОСТов`);
    }

    // Category
    if (currentMetal.category !== 'Канат') {
        console.log(`    ⚠️  Category: ${currentMetal.category} (ожидается: Канат)`);
    } else {
        console.log(`    ✅ Category: ${currentMetal.category}`);
    }

    detailedReport.push(ropeReport);
});

// ═══════════════════════════════════════════════════════════════════
// ИТОГОВАЯ СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(80));
console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА КАНАТОВ:\n');

const totalSizes = ropeTypes.reduce((sum, type) => {
    const metal = currentDB[type.key];
    return sum + (metal?.sizes?.length || 0);
}, 0);

const totalWeights = ropeTypes.reduce((sum, type) => {
    const metal = currentDB[type.key];
    return sum + (metal?.weights ? Object.keys(metal.weights).length : 0);
}, 0);

const perfectRopes = detailedReport.filter(r => r.perfect).length;

console.log(`  Типов канатов: ${ropeTypes.length}`);
console.log(`  Всего размеров канатов: ${totalSizes} (ожидается: 442)`);
console.log(`  Всего weights канатов: ${totalWeights} (ожидается: 442)`);
console.log(`  Идеальных типов: ${perfectRopes}/${ropeTypes.length}`);
console.log(`  Найдено проблем: ${totalIssues}`);

console.log('\n  По каждому типу:');
detailedReport.forEach(r => {
    const status = r.perfect ? '✅' : '❌';
    const issuesText = r.issues.length > 0 ? ` (${r.issues.length} проблем)` : '';
    console.log(`    ${status} ${r.name}${issuesText}`);
});

console.log('\n' + '═'.repeat(80));

if (allPerfect && totalSizes === 442 && totalWeights === 442) {
    console.log('\n🎉 ВСЕ КАНАТЫ ИДЕАЛЬНО СОВПАДАЮТ С ЭТАЛОНОМ!\n');
    console.log('  ✅ Все 442 размера присутствуют');
    console.log('  ✅ Все 442 weights присутствуют');
    console.log('  ✅ Все параметры корректны');
    console.log('  ✅ Все веса совпадают с эталоном\n');
    console.log('🎯 СТАТУС: ГОТОВЫ К ДЕМО!');
} else {
    console.log('\n⚠️  НАЙДЕНЫ НЕСООТВЕТСТВИЯ С ЭТАЛОНОМ!\n');
    console.log('  Детали проблем:');
    detailedReport.forEach(r => {
        if (!r.perfect) {
            console.log(`\n  ${r.name}:`);
            r.issues.forEach(issue => console.log(`    - ${issue}`));
        }
    });
    console.log('\n⚠️  СТАТУС: ТРЕБУЮТСЯ ИСПРАВЛЕНИЯ!');
}

// Экспорт результатов
const report = {
    timestamp: new Date().toISOString(),
    perfect: allPerfect && totalSizes === 442 && totalWeights === 442,
    totalSizes,
    expectedSizes: 442,
    totalWeights,
    expectedWeights: 442,
    issues: totalIssues,
    ropes: detailedReport
};

const reportPath = path.join(__dirname, 'ROPES_VERIFICATION_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Детальный отчёт сохранён: ROPES_VERIFICATION_REPORT.json\n`);

// Завершить с правильным кодом
process.exit(allPerfect && totalSizes === 442 && totalWeights === 442 ? 0 : 1);
