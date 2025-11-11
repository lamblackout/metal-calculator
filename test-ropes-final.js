// ✅ ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ КАНАТОВ
// Проверяет корректность расчётов для всех 3 типов канатов

const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');
const db = metalDatabase.metals;

console.log('🧪 ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ КАНАТОВ\n');
console.log('═'.repeat(70));

// Тестовые случаи для каждого типа каната
const ropeTests = [
    // Канат двойной свивки
    {
        name: 'Канат 10мм × 100м',
        type: 'rope',
        size: 10,
        length: 100,
        expectedWeight: 52, // ~0.52 кг/м × 100м
        tolerance: 1
    },
    {
        name: 'Канат 6мм × 50м',
        type: 'rope',
        size: 6,
        length: 50,
        expectedWeight: 9, // 0.176 кг/м × 50м
        tolerance: 1
    },
    {
        name: 'Канат 20мм × 100м',
        type: 'rope',
        size: 20,
        length: 100,
        expectedWeight: 196, // примерно
        tolerance: 5
    },

    // Канат арматурный
    {
        name: 'Канат арматурный 12мм × 100м',
        type: 'rope_armature',
        size: 12,
        length: 100,
        expectedWeight: 73.6, // 0.736 кг/м × 100м
        tolerance: 1
    },
    {
        name: 'Канат арматурный 15мм × 50м',
        type: 'rope_armature',
        size: 15,
        length: 50,
        expectedWeight: 55, // 1.1 кг/м × 50м
        tolerance: 1
    },
    {
        name: 'Канат арматурный 18мм × 100м',
        type: 'rope_armature',
        size: 18,
        length: 100,
        expectedWeight: 156.2, // 1.562 кг/м × 100м
        tolerance: 1
    },

    // Канат оцинкованный
    {
        name: 'Канат оцинк. 10мм × 100м',
        type: 'rope_galv',
        size: 10,
        length: 100,
        expectedWeight: 52, // ~0.52 кг/м × 100м (такой же как обычный)
        tolerance: 1
    },
    {
        name: 'Канат оцинк. 8мм × 50м',
        type: 'rope_galv',
        size: 8,
        length: 50,
        expectedWeight: 15, // 0.309 кг/м × 50м = 15.45 кг
        tolerance: 1
    },
    {
        name: 'Канат оцинк. 15мм × 100м',
        type: 'rope_galv',
        size: 15,
        length: 100,
        expectedWeight: 84, // 0.844 кг/м × 100м = 84.4 кг
        tolerance: 5
    }
];

let passed = 0;
let failed = 0;
const failures = [];

// Выполнить все тесты
ropeTests.forEach((test, i) => {
    console.log(`\nТест ${i + 1}: ${test.name}`);
    console.log(`  Тип: ${db[test.type].name}`);
    console.log(`  Параметры: размер ${test.size}мм, длина ${test.length}м`);

    try {
        const result = calculateMetal({
            metalType: test.type,
            size: test.size,
            length: test.length
        }, metalDatabase);

        if (!result.success) {
            console.log(`  ❌ FAIL: ${result.error}`);
            failed++;
            failures.push({test: test.name, reason: result.error});
            return;
        }

        // weight в тоннах, переводим в кг
        const actualWeightKg = result.weight * 1000;
        const diff = Math.abs(actualWeightKg - test.expectedWeight);
        const success = diff <= test.tolerance;

        console.log(`  Результат: ${actualWeightKg.toFixed(2)} кг (${result.weight.toFixed(3)} т)`);
        console.log(`  Ожидалось: ~${test.expectedWeight} кг (допуск ±${test.tolerance} кг)`);
        console.log(`  Разница: ${diff.toFixed(2)} кг`);

        if (success) {
            console.log(`  ✅ PASS`);
            passed++;
        } else {
            console.log(`  ❌ FAIL (разница слишком большая)`);
            failed++;
            failures.push({
                test: test.name,
                expected: test.expectedWeight,
                actual: actualWeightKg.toFixed(2),
                diff: diff.toFixed(2)
            });
        }

        // Проверка дополнительных параметров
        if (result.weightPerMeter) {
            console.log(`  ℹ️  Вес 1м: ${result.weightPerMeter.toFixed(3)} кг/м`);
        }
        if (result.gost) {
            console.log(`  ℹ️  ГОСТ: ${result.gost.split(',')[0]}...`);
        }

    } catch (error) {
        console.log(`  ❌ FAIL: ${error.message}`);
        failed++;
        failures.push({test: test.name, reason: error.message});
    }
});

// Итоговая статистика
console.log('\n' + '═'.repeat(70));
console.log('\n📊 ИТОГО:\n');
console.log(`  Всего тестов: ${ropeTests.length}`);
console.log(`  ✅ Пройдено: ${passed}`);
console.log(`  ❌ Провалено: ${failed}`);
console.log(`  📈 Процент успеха: ${((passed / ropeTests.length) * 100).toFixed(1)}%`);

if (failed > 0) {
    console.log('\n  Провалившиеся тесты:');
    failures.forEach((f, i) => {
        console.log(`\n  ${i + 1}. ${f.test}`);
        if (f.reason) {
            console.log(`     Причина: ${f.reason}`);
        } else {
            console.log(`     Ожидалось: ${f.expected} кг`);
            console.log(`     Получено: ${f.actual} кг`);
            console.log(`     Разница: ${f.diff} кг`);
        }
    });
}

console.log('\n' + '═'.repeat(70));

if (failed === 0) {
    console.log('\n🎉 ВСЕ ТЕСТЫ КАНАТОВ ПРОЙДЕНЫ УСПЕШНО!\n');
    console.log('  ✅ Все 3 типа канатов работают корректно');
    console.log('  ✅ Расчёты весов точные');
    console.log('  ✅ Формулы применяются правильно\n');
    console.log('🎯 СТАТУС: КАНАТЫ ГОТОВЫ К ДЕМО!');
    process.exit(0);
} else {
    console.log('\n⚠️  НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОЙДЕНЫ!\n');
    console.log('⚠️  СТАТУС: ТРЕБУЕТСЯ ПРОВЕРКА!');
    process.exit(1);
}
