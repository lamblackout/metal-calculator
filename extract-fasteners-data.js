// ИЗВЛЕЧЕНИЕ ДАННЫХ КРЕПЕЖА ИЗ .TXT ФАЙЛОВ
// Читает файлы с логами консоли и извлекает JSON данные

const fs = require('fs');
const path = require('path');

console.log('🔧 ИЗВЛЕЧЕНИЕ ДАННЫХ КРЕПЕЖА\n');
console.log('═'.repeat(80));

// Файлы для обработки
const files = [
    { filename: 'Винты.txt', key: 'vinty', name: 'Винты' },
    { filename: 'Гвозди.txt', key: 'gvozdi', name: 'Гвозди' },
    { filename: 'Саморезы.txt', key: 'samorezy', name: 'Саморезы' },
    { filename: 'Шпильки.txt', key: 'shpilki', name: 'Шпильки' },
    { filename: 'Шплинты.txt', key: 'shplynty', name: 'Шплинты' },
    { filename: 'Шурупы.txt', key: 'shyrypy', name: 'Шурупы' }
];

const extractedData = {};
let totalIssues = 0;
const report = [];

// Функция для извлечения JSON из секции
function extractJSONSection(content, sectionNumber, sectionType) {
    // Ищем секцию с заголовком типа: VM75:198 // ===== 1. РАЗМЕРЫ ВИНТОВ =====
    // sectionNumber: 1, 2, или 3
    // sectionType: 'sizes', 'weights', 'gosts'

    const sectionRegex = new RegExp(`VM\\d+:\\d+\\s+// ===== ${sectionNumber}\\..*?=====\\s*\\n(VM\\d+:\\d+\\s+)?([\\[\\{][\\s\\S]*?)(?=VM\\d+:\\d+\\s+// ===== |$)`, 'i');
    const match = content.match(sectionRegex);

    if (!match) {
        return null;
    }

    // Извлекаем JSON (группа 2)
    let jsonText = match[2];

    // Очищаем от префиксов VM:
    jsonText = jsonText.replace(/VM\d+:\d+\s+/g, '');

    // Находим правильный JSON
    if (sectionType === 'sizes') {
        // Для sizes ищем массив
        const arrayMatch = jsonText.match(/\[[\s\S]*?\]/);
        if (arrayMatch) {
            try {
                return JSON.parse(arrayMatch[0]);
            } catch (e) {
                console.error(`Ошибка парсинга sizes:`, e.message);
                return null;
            }
        }
    } else {
        // Для weights и gosts ищем объект
        const objectMatch = jsonText.match(/\{[\s\S]*?\n\}/);
        if (objectMatch) {
            try {
                return JSON.parse(objectMatch[0]);
            } catch (e) {
                console.error(`Ошибка парсинга ${sectionType}:`, e.message);
                return null;
            }
        }
    }

    return null;
}

// Обработка каждого файла
files.forEach((file, index) => {
    console.log(`\n${index + 1}. ${file.name} (${file.filename}):\n`);

    const filePath = path.join(__dirname, file.filename);

    // Проверка существования файла
    if (!fs.existsSync(filePath)) {
        console.log(`   ❌ ФАЙЛ НЕ НАЙДЕН`);
        totalIssues++;
        report.push({
            key: file.key,
            name: file.name,
            success: false,
            error: 'Файл не найден'
        });
        return;
    }

    // Читаем файл
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`   ✅ Файл прочитан (${content.length} символов)`);

    // Извлекаем секции
    const sizes = extractJSONSection(content, 1, 'sizes');
    const weights = extractJSONSection(content, 2, 'weights');
    const gosts = extractJSONSection(content, 3, 'gosts');

    // Валидация
    const fileReport = {
        key: file.key,
        name: file.name,
        success: true,
        issues: []
    };

    if (!sizes || sizes.length === 0) {
        console.log(`   ❌ SIZES не извлечены`);
        fileReport.success = false;
        fileReport.issues.push('Sizes отсутствуют');
        totalIssues++;
    } else {
        console.log(`   ✅ Sizes: ${sizes.length}`);
        fileReport.sizesCount = sizes.length;
    }

    if (!weights || Object.keys(weights).length === 0) {
        console.log(`   ❌ WEIGHTS не извлечены`);
        fileReport.success = false;
        fileReport.issues.push('Weights отсутствуют');
        totalIssues++;
    } else {
        console.log(`   ✅ Weights: ${Object.keys(weights).length}`);
        fileReport.weightsCount = Object.keys(weights).length;
    }

    if (!gosts || Object.keys(gosts).length === 0) {
        console.log(`   ❌ GOSTS не извлечены`);
        fileReport.success = false;
        fileReport.issues.push('Gosts отсутствуют');
        totalIssues++;
    } else {
        console.log(`   ✅ Gosts: ${Object.keys(gosts).length}`);
        fileReport.gostsCount = Object.keys(gosts).length;
    }

    // Проверка соответствия
    if (sizes && weights && gosts) {
        const sizesLen = sizes.length;
        const weightsLen = Object.keys(weights).length;
        const gostsLen = Object.keys(gosts).length;

        if (sizesLen !== weightsLen) {
            console.log(`   ⚠️  Несоответствие: sizes=${sizesLen}, weights=${weightsLen}`);
            fileReport.issues.push(`Несоответствие sizes/weights: ${sizesLen}/${weightsLen}`);
            totalIssues++;
        }

        if (sizesLen !== gostsLen) {
            console.log(`   ⚠️  Несоответствие: sizes=${sizesLen}, gosts=${gostsLen}`);
            fileReport.issues.push(`Несоответствие sizes/gosts: ${sizesLen}/${gostsLen}`);
            totalIssues++;
        }

        if (sizesLen === weightsLen && sizesLen === gostsLen) {
            console.log(`   ✅ Все данные согласованы (${sizesLen} элементов)`);
        }

        // Проверка что все weights > 0
        const invalidWeights = Object.entries(weights).filter(([k, v]) => v <= 0);
        if (invalidWeights.length > 0) {
            console.log(`   ⚠️  Некорректные веса: ${invalidWeights.length}`);
            fileReport.issues.push(`Некорректные веса: ${invalidWeights.length}`);
            totalIssues++;
        }

        // Проверка что все gosts - непустые строки
        const invalidGosts = Object.entries(gosts).filter(([k, v]) => !v || v.trim() === '');
        if (invalidGosts.length > 0) {
            console.log(`   ⚠️  Пустые ГОСТы: ${invalidGosts.length}`);
            fileReport.issues.push(`Пустые ГОСТы: ${invalidGosts.length}`);
            totalIssues++;
        }
    }

    // Сохраняем данные
    if (fileReport.success) {
        extractedData[file.key] = {
            name: file.name,
            sizes: sizes,
            weights: weights,
            gosts: gosts
        };
        console.log(`   ✅ Данные сохранены`);
    } else {
        console.log(`   ❌ Данные НЕ сохранены из-за ошибок`);
    }

    report.push(fileReport);
});

// ═══════════════════════════════════════════════════════════════════
// ИТОГОВАЯ СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(80));
console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');

const successCount = report.filter(r => r.success).length;
const totalSizes = report.reduce((sum, r) => sum + (r.sizesCount || 0), 0);

console.log(`  Обработано файлов: ${files.length}`);
console.log(`  Успешно извлечено: ${successCount}`);
console.log(`  Ошибок: ${totalIssues}`);
console.log(`  Всего размеров: ${totalSizes}`);

console.log('\n  Детализация:');
report.forEach(r => {
    const status = r.success ? '✅' : '❌';
    const details = r.success
        ? `(${r.sizesCount} sizes, ${r.weightsCount} weights, ${r.gostsCount} gosts)`
        : `(${r.error || r.issues.join(', ')})`;

    console.log(`    ${status} ${r.name}: ${details}`);
});

console.log('\n' + '═'.repeat(80));

// Сохранение в JSON
if (Object.keys(extractedData).length > 0) {
    const outputPath = path.join(__dirname, 'extracted-fasteners.json');
    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2), 'utf8');

    console.log('\n✅ ДАННЫЕ СОХРАНЕНЫ В ФАЙЛ:\n');
    console.log(`   ${outputPath}`);
    console.log(`   Размер: ${fs.statSync(outputPath).size} байт`);
    console.log(`   Типов крепежа: ${Object.keys(extractedData).length}`);

    console.log('\n🎯 СТАТУС: ИЗВЛЕЧЕНИЕ ЗАВЕРШЕНО УСПЕШНО!');
    process.exit(0);
} else {
    console.log('\n❌ НЕ УДАЛОСЬ ИЗВЛЕЧЬ ДАННЫЕ!');
    console.log('\n⚠️  СТАТУС: ОШИБКА ИЗВЛЕЧЕНИЯ!');
    process.exit(1);
}
