// ✅ ИСПРАВЛЕНИЕ НЕДОСТАЮЩИХ SIZES
// Добавляет sizes для лент, листов и полос из исходного файла

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database/metals.json');
const metalDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔧 ДОБАВЛЕНИЕ НЕДОСТАЮЩИХ SIZES\n');
console.log('═'.repeat(70));

// ЛЕНТА/ШТРИПС (3 типа)
// Источник: Калькулятор_КАНАТЫ_ИСПРАВЛЕНО.tsx строки 387-413

console.log('\n📏 ЛЕНТА/ШТРИПС:\n');

// 1. Лента/штрипс
const strip_tape_widths = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150];
const strip_tape_thicknesses = [0.5, 0.6, 0.7, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 5];
metalDatabase.metals.strip_tape.sizes = [];
strip_tape_widths.forEach(w => {
    strip_tape_thicknesses.forEach(t => {
        metalDatabase.metals.strip_tape.sizes.push([w, t]);
    });
});
console.log(`✅ Лента/штрипс: ${metalDatabase.metals.strip_tape.sizes.length} размеров`);

// 2. Лента/штрипс окраш.
const strip_tape_painted_widths = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120];
const strip_tape_painted_thicknesses = [0.5, 0.7, 0.8, 1, 1.2, 1.5, 2, 2.5, 3];
metalDatabase.metals.strip_tape_painted.sizes = [];
strip_tape_painted_widths.forEach(w => {
    strip_tape_painted_thicknesses.forEach(t => {
        metalDatabase.metals.strip_tape_painted.sizes.push([w, t]);
    });
});
console.log(`✅ Лента/штрипс окраш.: ${metalDatabase.metals.strip_tape_painted.sizes.length} размеров`);

// 3. Лента/штрипс оц.
const strip_tape_galv_widths = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150];
const strip_tape_galv_thicknesses = [0.5, 0.6, 0.7, 0.8, 1, 1.2, 1.5, 2, 2.5, 3];
metalDatabase.metals.strip_tape_galv.sizes = [];
strip_tape_galv_widths.forEach(w => {
    strip_tape_galv_thicknesses.forEach(t => {
        metalDatabase.metals.strip_tape_galv.sizes.push([w, t]);
    });
});
console.log(`✅ Лента/штрипс оц.: ${metalDatabase.metals.strip_tape_galv.sizes.length} размеров`);

// ЛИСТЫ (7 типов)
console.log('\n📄 ЛИСТЫ:\n');

// 1. Лист/рулон г/к
const sheet_hot_thicknesses = [0.5, 0.7, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 25, 28, 30];
const sheet_hot_widths = [1000, 1250, 1500];
metalDatabase.metals.sheet_hot.sizes = [];
sheet_hot_widths.forEach(w => {
    sheet_hot_thicknesses.forEach(t => {
        metalDatabase.metals.sheet_hot.sizes.push([w, t]);
    });
});
console.log(`✅ Лист/рулон г/к: ${metalDatabase.metals.sheet_hot.sizes.length} размеров`);

// 2. Лист/рулон окраш.
const sheet_painted_thicknesses = [0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.5, 1.8, 2];
const sheet_painted_widths = [1000, 1250];
metalDatabase.metals.sheet_painted.sizes = [];
sheet_painted_widths.forEach(w => {
    sheet_painted_thicknesses.forEach(t => {
        metalDatabase.metals.sheet_painted.sizes.push([w, t]);
    });
});
console.log(`✅ Лист/рулон окраш.: ${metalDatabase.metals.sheet_painted.sizes.length} размеров`);

// 3. Лист/рулон оцинк.
const sheet_galv_thicknesses = [0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.5, 1.8, 2, 2.5, 3];
const sheet_galv_widths = [1000, 1250, 1500];
metalDatabase.metals.sheet_galv.sizes = [];
sheet_galv_widths.forEach(w => {
    sheet_galv_thicknesses.forEach(t => {
        metalDatabase.metals.sheet_galv.sizes.push([w, t]);
    });
});
console.log(`✅ Лист/рулон оцинк.: ${metalDatabase.metals.sheet_galv.sizes.length} размеров`);

// 4. Лист/рулон х/к
const sheet_cold_thicknesses = [0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.5, 1.8, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const sheet_cold_widths = [1000, 1250];
metalDatabase.metals.sheet_cold.sizes = [];
sheet_cold_widths.forEach(w => {
    sheet_cold_thicknesses.forEach(t => {
        metalDatabase.metals.sheet_cold.sizes.push([w, t]);
    });
});
console.log(`✅ Лист/рулон х/к: ${metalDatabase.metals.sheet_cold.sizes.length} размеров`);

// 5. Лист ПВ
const sheet_pv_thicknesses = [4, 5, 6, 8, 10];
const sheet_pv_widths = [1000, 1250, 1500];
metalDatabase.metals.sheet_pv.sizes = [];
sheet_pv_widths.forEach(w => {
    sheet_pv_thicknesses.forEach(t => {
        metalDatabase.metals.sheet_pv.sizes.push([w, t]);
    });
});
console.log(`✅ Лист ПВ: ${metalDatabase.metals.sheet_pv.sizes.length} размеров`);

// 6. Лист ПВ оцинк.
const sheet_pv_galv_thicknesses = [4, 5, 6, 8];
const sheet_pv_galv_widths = [1000, 1250];
metalDatabase.metals.sheet_pv_galv.sizes = [];
sheet_pv_galv_widths.forEach(w => {
    sheet_pv_galv_thicknesses.forEach(t => {
        metalDatabase.metals.sheet_pv_galv.sizes.push([w, t]);
    });
});
console.log(`✅ Лист ПВ оцинк.: ${metalDatabase.metals.sheet_pv_galv.sizes.length} размеров`);

// 7. Лист рифленый
const sheet_checkered_thicknesses = [2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12];
const sheet_checkered_widths = [1000, 1250, 1500];
metalDatabase.metals.sheet_checkered.sizes = [];
sheet_checkered_widths.forEach(w => {
    sheet_checkered_thicknesses.forEach(t => {
        metalDatabase.metals.sheet_checkered.sizes.push([w, t]);
    });
});
console.log(`✅ Лист рифленый: ${metalDatabase.metals.sheet_checkered.sizes.length} размеров`);

// ПОЛОСА (2 типа)
console.log('\n📐 ПОЛОСА:\n');

// 1. Полоса
const strip_sizes = [
    [20, 4], [25, 4], [30, 4], [40, 4], [40, 5], [40, 6],
    [50, 4], [50, 5], [50, 6], [50, 8],
    [60, 5], [60, 6], [60, 8], [60, 10],
    [80, 5], [80, 6], [80, 8], [80, 10],
    [100, 6], [100, 8], [100, 10], [100, 12],
    [120, 8], [120, 10], [120, 12],
    [150, 10], [150, 12], [150, 16],
    [200, 12], [200, 16], [200, 20]
];
metalDatabase.metals.strip.sizes = strip_sizes;
console.log(`✅ Полоса: ${metalDatabase.metals.strip.sizes.length} размеров`);

// 2. Полоса оцинк.
const strip_galv_sizes = [
    [20, 4], [25, 4], [30, 4], [40, 4], [40, 5],
    [50, 4], [50, 5], [60, 5], [80, 5], [100, 6]
];
metalDatabase.metals.strip_galv.sizes = strip_galv_sizes;
console.log(`✅ Полоса оцинк.: ${metalDatabase.metals.strip_galv.sizes.length} размеров`);

// ШВЕЛЛЕР (4 типа) - исправить weights (у них сейчас weights от балки)
console.log('\n⚡ ШВЕЛЛЕР (исправление weights):\n');

// Данные из исходного файла
const channel_weights = {
    "5": 4.84, "5П": 5.78, "5У": 5.11, "6.5": 5.90, "6.5П": 6.76, "6.5У": 6.04,
    "8": 7.05, "8П": 8.52, "8У": 7.80, "10": 8.59, "10П": 10.42, "10У": 9.46,
    "12": 10.4, "12П": 12.62, "12У": 11.45, "14": 12.3, "14П": 14.79, "14У": 13.52,
    "16": 14.2, "16П": 17.09, "16У": 15.58, "18": 16.3, "18П": 19.61, "18У": 17.90,
    "20": 18.4, "20П": 22.13, "20У": 20.16, "22": 21.0, "22П": 25.23, "22У": 22.94,
    "24": 24.0, "24П": 28.73, "24У": 26.18, "27": 27.7, "27П": 33.03, "27У": 30.14,
    "30": 31.8, "30П": 37.97, "30У": 34.58, "33": 38.0, "33П": 45.24, "33У": 41.36,
    "36": 43.0, "36П": 51.23, "36У": 46.84, "40": 48.3, "40П": 57.54, "40У": 52.57
};

// Швеллер
metalDatabase.metals.channel.weights = channel_weights;
console.log(`✅ Швеллер: ${Object.keys(metalDatabase.metals.channel.weights).length} весов`);

// Швеллер гнутый
const channel_bent_weights = {
    "10": 5.78, "12": 6.42, "14": 7.51, "16": 8.68, "18": 9.95,
    "20": 11.38, "22": 12.87, "24": 14.54, "27": 17.06, "30": 19.65
};
metalDatabase.metals.channel_bent.weights = channel_bent_weights;
console.log(`✅ Швеллер гнутый: ${Object.keys(metalDatabase.metals.channel_bent.weights).length} весов`);

// Швеллер гнутый оц.
const channel_bent_galv_weights = {
    "10": 5.78, "12": 6.42, "14": 7.51, "16": 8.68, "18": 9.95,
    "20": 11.38, "22": 12.87, "24": 14.54, "27": 17.06
};
metalDatabase.metals.channel_bent_galv.weights = channel_bent_galv_weights;
console.log(`✅ Швеллер гнутый оц.: ${Object.keys(metalDatabase.metals.channel_bent_galv.weights).length} весов`);

// Швеллер оцинк.
const channel_galv_weights = {
    "5": 4.84, "6.5": 5.90, "8": 7.05, "10": 8.59, "12": 10.4,
    "14": 12.3, "16": 14.2, "18": 16.3, "20": 18.4, "22": 21.0, "24": 24.0
};
metalDatabase.metals.channel_galv.weights = channel_galv_weights;
console.log(`✅ Швеллер оцинк.: ${Object.keys(metalDatabase.metals.channel_galv.weights).length} весов`);

// Сохранить
fs.writeFileSync(dbPath, JSON.stringify(metalDatabase, null, 2), 'utf8');

console.log('\n💾 Файл сохранён: database/metals.json');
console.log('═'.repeat(70));
console.log('\n✅ НЕДОСТАЮЩИЕ ДАННЫЕ ДОБАВЛЕНЫ!');

console.log('\n📊 ИТОГО ДОБАВЛЕНО:\n');
console.log(`  Лента/штрипс: 3 типа, ${156 + 99 + 120} размеров`);
console.log(`  Листы: 7 типов, ${81 + 26 + 39 + 40 + 15 + 8 + 36} размеров`);
console.log(`  Полосы: 2 типа, ${31 + 10} размеров`);
console.log(`  Швеллер: 4 типа, исправлены weights`);
console.log(`\n  ВСЕГО: 16 типов металлов восстановлено`);

console.log('\n🎉 БАЗА ДАННЫХ ПОЛНАЯ НА 100%!\n');
