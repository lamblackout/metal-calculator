// ТЕСТИРОВАНИЕ ШПИЛЕК
// Проверяет корректность данных и расчётов для шпилек

const metalDatabase = require('./database/metals.json');
const db = metalDatabase.metals;

console.log('🧪 ТЕСТИРОВАНИЕ ШПИЛЕК\n');
console.log('═'.repeat(80));

const metal = db['stud'];

if (!metal) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Шпильки не найдены в БД!');
    process.exit(1);
}

console.log(`\n✅ Шпильки найдены в БД`);
console.log(`   Название: ${metal.name}`);
console.log(`   Category: ${metal.category}`);
console.log(`   Formula: ${metal.formula}`);
console.log(`   perThousand: ${metal.perThousand}`);
console.log(`   useKilograms: ${metal.useKilograms}`);

const sizesCount = metal.sizes ? metal.sizes.length : 0;
const weightsCount = metal.weights ? Object.keys(metal.weights).length : 0;
const gostsCount = metal.gosts ? Object.keys(metal.gosts).length : 0;

console.log(`\n📊 Данные:`);
console.log(`   Sizes: ${sizesCount}`);
console.log(`   Weights: ${weightsCount}`);
console.log(`   Gosts: ${gostsCount}`);

// Валидация согласованности данных
let validationPassed = true;

if (sizesCount !== weightsCount) {
    console.log(`   ❌ Несоответствие: sizes=${sizesCount}, weights=${weightsCount}`);
    validationPassed = false;
}

if (sizesCount !== gostsCount) {
    console.log(`   ❌ Несоответствие: sizes=${sizesCount}, gosts=${gostsCount}`);
    validationPassed = false;
}

if (sizesCount === weightsCount && sizesCount === gostsCount) {
    console.log(`   ✅ Все данные согласованы (${sizesCount} элементов)`);
}

// Проверка примеров
console.log(`\n🔍 Тестовые размеры:`);

const testSizes = [
    { size: metal.sizes[0], label: 'Первый размер' },
    { size: metal.sizes[Math.floor(sizesCount / 4)], label: '25% позиции' },
    { size: metal.sizes[Math.floor(sizesCount / 2)], label: 'Средний размер' },
    { size: metal.sizes[Math.floor(sizesCount * 3 / 4)], label: '75% позиции' },
    { size: metal.sizes[sizesCount - 1], label: 'Последний размер' }
];

let testsPassed = 0;
let testsFailed = 0;

testSizes.forEach((test, i) => {
    const size = test.size;
    const weight = metal.weights[size];
    const gost = metal.gosts[size];

    console.log(`\n   ${i + 1}. ${test.label}: ${size}`);

    if (!weight) {
        console.log(`      ❌ Вес не найден`);
        testsFailed++;
        validationPassed = false;
    } else if (weight <= 0) {
        console.log(`      ❌ Некорректный вес: ${weight}`);
        testsFailed++;
        validationPassed = false;
    } else {
        console.log(`      ✅ Вес: ${weight} кг/1000шт`);
    }

    if (!gost || gost.trim() === '') {
        console.log(`      ❌ ГОСТ не найден или пустой`);
        testsFailed++;
        validationPassed = false;
    } else {
        console.log(`      ✅ ГОСТ: ${gost}`);
    }

    if (weight && weight > 0 && gost && gost.trim() !== '') {
        testsPassed++;
    }
});

// Проверка всех весов > 0
console.log(`\n🔍 Валидация всех весов:`);
const invalidWeights = Object.entries(metal.weights).filter(([k, v]) => v <= 0);
if (invalidWeights.length > 0) {
    console.log(`   ❌ Найдены некорректные веса: ${invalidWeights.length}`);
    console.log(`      Примеры: ${invalidWeights.slice(0, 3).map(([k, v]) => `${k}=${v}`).join(', ')}`);
    validationPassed = false;
} else {
    console.log(`   ✅ Все веса корректны (> 0)`);
}

// Проверка всех ГОСТов
console.log(`\n🔍 Валидация всех ГОСТов:`);
const invalidGosts = Object.entries(metal.gosts).filter(([k, v]) => !v || v.trim() === '');
if (invalidGosts.length > 0) {
    console.log(`   ❌ Найдены пустые ГОСТы: ${invalidGosts.length}`);
    console.log(`      Примеры: ${invalidGosts.slice(0, 3).map(([k]) => k).join(', ')}`);
    validationPassed = false;
} else {
    console.log(`   ✅ Все ГОСТы заполнены`);
}

// Уникальные ГОСТы
const uniqueGosts = [...new Set(Object.values(metal.gosts))];
console.log(`\n📖 Уникальные ГОСТы: ${uniqueGosts.length}`);
uniqueGosts.slice(0, 5).forEach(gost => {
    const count = Object.values(metal.gosts).filter(g => g === gost).length;
    console.log(`   - ${gost} (${count} размеров)`);
});

// Статистика весов
console.log(`\n📊 Статистика весов (кг/1000шт):`);
const weights = Object.values(metal.weights).filter(w => w > 0);
const minWeight = Math.min(...weights);
const maxWeight = Math.max(...weights);
const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;

console.log(`   Минимум: ${minWeight.toFixed(3)} кг`);
console.log(`   Максимум: ${maxWeight.toFixed(3)} кг`);
console.log(`   Среднее: ${avgWeight.toFixed(3)} кг`);

// Итоговая статистика
console.log('\n' + '═'.repeat(80));
console.log('\n📊 ИТОГО:\n');
console.log(`  Размеров: ${sizesCount}`);
console.log(`  Тестов пройдено: ${testsPassed}/${testSizes.length}`);
console.log(`  Валидация данных: ${validationPassed ? '✅ PASSED' : '❌ FAILED'}`);

if (validationPassed && testsPassed === testSizes.length) {
    console.log('\n🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!');
    console.log('   ✅ Данные шпилек корректны');
    console.log('   ✅ Все размеры имеют веса и ГОСТы');
    console.log('   ✅ Шпильки готовы к использованию\n');
    console.log('🎯 СТАТУС: ШПИЛЬКИ ПОЛНОСТЬЮ ГОТОВЫ!');
    process.exit(0);
} else {
    console.log('\n⚠️  НЕКОТОРЫЕ ПРОВЕРКИ НЕ ПРОШЛИ!');
    console.log(`   Провалено тестов: ${testsFailed}`);
    process.exit(1);
}
