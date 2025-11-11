// ТЕСТИРОВАНИЕ НОВЫХ ТИПОВ КРЕПЕЖА
// Проверяет расчёты для Винтов и Гвоздей

const { calculateMetal } = require('./dist/calculator.bundle.js');
const metalDatabase = require('./database/metals.json');
const db = metalDatabase.metals;

console.log('🧪 ТЕСТИРОВАНИЕ КРЕПЕЖА\n');
console.log('═'.repeat(80));

// Тестовые случаи для каждого типа
const fastenerTests = [
    // Винты
    {
        name: 'Винт 1х2, 1000 шт',
        type: 'screw',
        size: '1х2',
        quantity: 1000,
        expectedWeightPer1000: 24, // 0.024 кг/шт × 1000 = 24 кг
        tolerance: 1
    },
    {
        name: 'Винт 2х10, 500 шт',
        type: 'screw',
        size: '2х10',
        quantity: 500,
        expectedWeightPer1000: 295, // 0.295 кг/шт × 1000 = 295 кг
        tolerance: 1
    },
    {
        name: 'Винт 3х15, 1000 шт',
        type: 'screw',
        size: '3х15',
        quantity: 1000,
        expectedWeightPer1000: 510, // примерно
        tolerance: 10
    },

    // Гвозди
    {
        name: 'Гвоздь 8х0.8, 1000 шт',
        type: 'nail',
        size: '8х0.8',
        quantity: 1000,
        expectedWeightPer1000: 6.2, // примерно
        tolerance: 1
    },
    {
        name: 'Гвоздь 50х2.8, 1000 шт',
        type: 'nail',
        size: '50х2.8',
        quantity: 1000,
        expectedWeightPer1000: 250, // примерно
        tolerance: 10
    },
    {
        name: 'Гвоздь 100х4, 1000 шт',
        type: 'nail',
        size: '100х4',
        quantity: 1000,
        expectedWeightPer1000: 900, // примерно
        tolerance: 50
    }
];

let passed = 0;
let failed = 0;
const failures = [];

// Выполнить все тесты
fastenerTests.forEach((test, i) => {
    console.log(`\nТест ${i + 1}: ${test.name}`);
    console.log(`  Тип: ${db[test.type].name}`);
    console.log(`  Параметры: размер ${test.size}, количество ${test.quantity} шт`);

    try {
        const result = calculateMetal({
            metalType: test.type,
            size: test.size,
            pieces: test.quantity
        }, metalDatabase);

        if (!result.success) {
            console.log(`  ❌ FAIL: ${result.error}`);
            failed++;
            failures.push({test: test.name, reason: result.error});
            return;
        }

        // Для метизов weight уже в кг (не в тоннах!)
        const actualWeightKg = result.weight;

        // Вычислим вес для 1000 шт для сравнения
        const weightPer1000 = (actualWeightKg / test.quantity) * 1000;

        const diff = Math.abs(weightPer1000 - test.expectedWeightPer1000);
        const success = diff <= test.tolerance;

        console.log(`  Результат: ${actualWeightKg.toFixed(3)} кг (за ${test.quantity} шт)`);
        console.log(`  Вес 1000 шт: ${weightPer1000.toFixed(2)} кг`);
        console.log(`  Ожидалось: ~${test.expectedWeightPer1000} кг/1000шт (допуск ±${test.tolerance} кг)`);
        console.log(`  Разница: ${diff.toFixed(2)} кг`);

        if (success) {
            console.log(`  ✅ PASS`);
            passed++;
        } else {
            console.log(`  ❌ FAIL (разница слишком большая)`);
            failed++;
            failures.push({
                test: test.name,
                expected: test.expectedWeightPer1000,
                actual: weightPer1000.toFixed(2),
                diff: diff.toFixed(2)
            });
        }

        // Проверка дополнительных параметров
        if (result.weightPerPiece) {
            console.log(`  ℹ️  Вес 1 шт: ${result.weightPerPiece.toFixed(6)} кг`);
        }
        if (result.gost) {
            console.log(`  ℹ️  ГОСТ: ${result.gost.substring(0, 50)}...`);
        }

    } catch (error) {
        console.log(`  ❌ FAIL: ${error.message}`);
        failed++;
        failures.push({test: test.name, reason: error.message});
    }
});

// Итоговая статистика
console.log('\n' + '═'.repeat(80));
console.log('\n📊 ИТОГО:\n');
console.log(`  Всего тестов: ${fastenerTests.length}`);
console.log(`  ✅ Пройдено: ${passed}`);
console.log(`  ❌ Провалено: ${failed}`);
console.log(`  📈 Процент успеха: ${((passed / fastenerTests.length) * 100).toFixed(1)}%`);

if (failed > 0) {
    console.log('\n  Провалившиеся тесты:');
    failures.forEach((f, i) => {
        console.log(`\n  ${i + 1}. ${f.test}`);
        if (f.reason) {
            console.log(`     Причина: ${f.reason}`);
        } else {
            console.log(`     Ожидалось: ${f.expected} кг/1000шт`);
            console.log(`     Получено: ${f.actual} кг/1000шт`);
            console.log(`     Разница: ${f.diff} кг`);
        }
    });
}

console.log('\n' + '═'.repeat(80));

if (failed === 0) {
    console.log('\n🎉 ВСЕ ТЕСТЫ КРЕПЕЖА ПРОЙДЕНЫ УСПЕШНО!\n');
    console.log('  ✅ Винты работают корректно');
    console.log('  ✅ Гвозди работают корректно');
    console.log('  ✅ Расчёты весов точные\n');
    console.log('🎯 СТАТУС: КРЕПЁЖ ГОТОВ К ИСПОЛЬЗОВАНИЮ!');
    process.exit(0);
} else {
    console.log('\n⚠️  НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОЙДЕНЫ!\n');
    console.log('⚠️  СТАТУС: ТРЕБУЕТСЯ ПРОВЕРКА!');
    process.exit(1);
}
