// ✅ ТЕСТ ЦЕЛОСТНОСТИ ДАННЫХ
// Проверяет что ВСЕ данные присутствуют в БД после восстановления

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database/metals.json');
const metalDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔍 ПРОВЕРКА ЦЕЛОСТНОСТИ ДАННЫХ МЕТАЛЛОКАЛЬКУЛЯТОРА\n');
console.log('═'.repeat(70));

let passed = 0;
let failed = 0;
const errors = [];

function test(name, condition, details = '') {
    if (condition) {
        console.log(`✅ ${name}`);
        passed++;
    } else {
        console.log(`❌ ${name}`);
        if (details) console.log(`   ${details}`);
        failed++;
        errors.push(name);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// КРИТИЧЕСКИЕ ПРОВЕРКИ (КАНАТЫ И КАТАНКА)
// ═══════════════════════════════════════════════════════════════════════

console.log('\n📍 КРИТИЧЕСКИЕ ДАННЫЕ (Канаты и Катанка):\n');

const { rope, rope_armature, rope_galv, wire_rod } = metalDatabase.metals;

// КАНАТЫ ДВОЙНОЙ СВИВКИ
test(
    'Канат двойной свивки: 214 размеров',
    rope && rope.sizes && rope.sizes.length === 214,
    `Найдено: ${rope?.sizes?.length || 0}`
);

test(
    'Канат двойной свивки: Таблица весов (214 записей)',
    rope && rope.weights && Object.keys(rope.weights).length === 214,
    `Найдено: ${rope?.weights ? Object.keys(rope.weights).length : 0}`
);

test(
    'Канат двойной свивки: ГОСТ 3241-91',
    rope && rope.gost === '3241-91'
);

// КАНАТЫ АРМАТУРНЫЕ
test(
    'Канат арматурный: 14 размеров',
    rope_armature && rope_armature.sizes && rope_armature.sizes.length === 14,
    `Найдено: ${rope_armature?.sizes?.length || 0}`
);

test(
    'Канат арматурный: Таблица весов (14 записей)',
    rope_armature && rope_armature.weights && Object.keys(rope_armature.weights).length === 14,
    `Найдено: ${rope_armature?.weights ? Object.keys(rope_armature.weights).length : 0}`
);

test(
    'Канат арматурный: ГОСТ 13840-68',
    rope_armature && rope_armature.gost === '13840-68'
);

// КАНАТЫ ОЦИНКОВАННЫЕ
test(
    'Канат оцинкованный: 214 размеров',
    rope_galv && rope_galv.sizes && rope_galv.sizes.length === 214,
    `Найдено: ${rope_galv?.sizes?.length || 0}`
);

test(
    'Канат оцинкованный: Таблица весов (214 записей)',
    rope_galv && rope_galv.weights && Object.keys(rope_galv.weights).length === 214,
    `Найдено: ${rope_galv?.weights ? Object.keys(rope_galv.weights).length : 0}`
);

test(
    'Канат оцинкованный: ГОСТ 7372-79',
    rope_galv && rope_galv.gost === '7372-79'
);

// КАТАНКА (ГЛАВНАЯ ФИЧА!)
test(
    'Катанка: 27 размеров',
    wire_rod && wire_rod.sizes && wire_rod.sizes.length === 27,
    `Найдено: ${wire_rod?.sizes?.length || 0}`
);

test(
    '⭐ Катанка: 37 марок стали (КРИТИЧНО!)',
    wire_rod && wire_rod.steelGrades && Object.keys(wire_rod.steelGrades).length === 37,
    `Найдено: ${wire_rod?.steelGrades ? Object.keys(wire_rod.steelGrades).length : 0}`
);

// Проверить конкретные марки стали
const requiredSteelGrades = ['ст08', 'ст3', 'ст10', 'Р18', 'У12', '09Г2С', '65Г'];
requiredSteelGrades.forEach(grade => {
    test(
        `Катанка: Марка ${grade} присутствует`,
        wire_rod && wire_rod.steelGrades && wire_rod.steelGrades[grade],
        `Структура: ${wire_rod?.steelGrades?.[grade] ? JSON.stringify(wire_rod.steelGrades[grade]) : 'не найдена'}`
    );
});

// Проверить структуру марки стали
if (wire_rod && wire_rod.steelGrades && wire_rod.steelGrades['ст3']) {
    const st3 = wire_rod.steelGrades['ст3'];
    test(
        'Катанка: Марка стали имеет density',
        st3.density && typeof st3.density === 'number'
    );
    test(
        'Катанка: Марка стали имеет coefficient',
        st3.coefficient && typeof st3.coefficient === 'number'
    );
    test(
        'Катанка: Марка стали имеет name',
        st3.name === 'ст3'
    );
}

// ═══════════════════════════════════════════════════════════════════════
// ОБЩИЕ ПРОВЕРКИ БАЗЫ ДАННЫХ
// ═══════════════════════════════════════════════════════════════════════

console.log('\n📊 ОБЩИЕ ПРОВЕРКИ БД:\n');

test(
    'БД содержит объект metals',
    metalDatabase && metalDatabase.metals
);

const metalCount = metalDatabase.metals ? Object.keys(metalDatabase.metals).length : 0;
test(
    'БД содержит 70 типов металлов',
    metalCount === 70,
    `Найдено: ${metalCount}`
);

// Проверить наличие основных категорий
const requiredCategories = [
    'rebar', 'beam', 'rope', 'wire_rod', 'bolt', 'circle', 'square',
    'sheet_hot', 'plate', 'strip', 'wire', 'rail', 'channel', 'angle'
];

requiredCategories.forEach(cat => {
    test(
        `Категория ${cat} присутствует`,
        metalDatabase.metals[cat] !== undefined
    );
});

// ═══════════════════════════════════════════════════════════════════════
// ПРОВЕРКИ ДРУГИХ МЕТАЛЛОВ (выборочно)
// ═══════════════════════════════════════════════════════════════════════

console.log('\n📦 ВЫБОРОЧНЫЕ ПРОВЕРКИ:\n');

// Арматура
const rebar = metalDatabase.metals.rebar;
test(
    'Арматура: Имеет размеры',
    rebar && rebar.sizes && rebar.sizes.length > 0,
    `Размеров: ${rebar?.sizes?.length || 0}`
);

// Трубы ВГП
const pipe_vgp = metalDatabase.metals.pipe_vgp;
test(
    'Труба ВГП: Имеет размеры',
    pipe_vgp && pipe_vgp.sizes && pipe_vgp.sizes.length > 0,
    `Размеров: ${pipe_vgp?.sizes?.length || 0}`
);

// Крепёж (болты)
const bolt = metalDatabase.metals.bolt;
test(
    'Болты: Имеет размеры',
    bolt && bolt.sizes && bolt.sizes.length > 0,
    `Размеров: ${bolt?.sizes?.length || 0}`
);

test(
    'Болты: Имеет таблицу весов',
    bolt && bolt.weights && Object.keys(bolt.weights).length > 0
);

// Шпунты Ларсена
const sheet_pile_larsen = metalDatabase.metals.sheet_pile_larsen;
test(
    'Шпунт Ларсена: Имеет размеры',
    sheet_pile_larsen && sheet_pile_larsen.sizes && sheet_pile_larsen.sizes.length > 0,
    `Размеров: ${sheet_pile_larsen?.sizes?.length || 0}`
);

// Рельсы
const rail = metalDatabase.metals.rail;
test(
    'Рельсы: Имеет размеры',
    rail && rail.sizes && rail.sizes.length > 0,
    `Размеров: ${rail?.sizes?.length || 0}`
);

// ═══════════════════════════════════════════════════════════════════════
// СТАТИСТИКА ПО ВСЕМ МЕТАЛЛАМ
// ═══════════════════════════════════════════════════════════════════════

console.log('\n📈 СТАТИСТИКА ПО ВСЕМ МЕТАЛЛАМ:\n');

let totalSizes = 0;
let metalsWithSizes = 0;
let metalsWithWeights = 0;
let metalsWithFormulas = 0;

Object.keys(metalDatabase.metals).forEach(key => {
    const metal = metalDatabase.metals[key];

    if (metal.sizes && metal.sizes.length > 0) {
        totalSizes += metal.sizes.length;
        metalsWithSizes++;
    }

    if (metal.weights && Object.keys(metal.weights).length > 0) {
        metalsWithWeights++;
    }

    if (metal.formula) {
        metalsWithFormulas++;
    }
});

console.log(`  Всего металлов: ${metalCount}`);
console.log(`  Металлов с размерами: ${metalsWithSizes}`);
console.log(`  Металлов с таблицами весов: ${metalsWithWeights}`);
console.log(`  Металлов с формулами: ${metalsWithFormulas}`);
console.log(`  Всего размеров: ${totalSizes}`);

// ═══════════════════════════════════════════════════════════════════════
// ИТОГИ
// ═══════════════════════════════════════════════════════════════════════

console.log('\n═'.repeat(70));
console.log('\n📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ:\n');
console.log(`  ✅ Пройдено: ${passed}`);
console.log(`  ❌ Провалено: ${failed}`);
console.log(`  📈 Успешность: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed > 0) {
    console.log('\n❌ ПРОВАЛЕНО:');
    errors.forEach(err => console.log(`  - ${err}`));
}

console.log('\n═'.repeat(70));

if (failed === 0) {
    console.log('\n🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!');
    console.log('✅ База данных восстановлена на 100%\n');
    process.exit(0);
} else {
    console.log('\n⚠️  ЕСТЬ ПРОБЛЕМЫ С ДАННЫМИ!');
    console.log('❌ Требуется дополнительная работа\n');
    process.exit(1);
}
