// Добавить 37 марок стали к катанке
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database/metals.json');
const metalDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔧 ДОБАВЛЕНИЕ 37 МАРОК СТАЛИ К КАТАНКЕ\n');
console.log('═'.repeat(70));

// 37 марок стали из исходного файла Калькулятор_Катанка (2).html
const steelTypes = ["ст08", "ст0", "ст1", "ст2", "ст3", "ст10", "ст15", "ст20", "ст30", "ст35", "ст40", "ст45", "ст50", "ст55", "ст60", "09Г2С", "10Г2", "15Г", "15Х", "20Г", "20Х", "30Г", "30Х", "35Г2", "40Г", "40Х", "45Г2", "45Х", "50Г", "50Г2", "50Х", "65Г", "У7", "У8", "У10", "У12", "Р18"];

const steelCoefficients = {
    "ст08": 7.871, "ст0": 7.85, "ст1": 7.85, "ст2": 7.85, "ст3": 7.85,
    "ст10": 7.856, "ст15": 7.85, "ст20": 7.859, "ст30": 7.85, "ст35": 7.826,
    "ст40": 7.85, "ст45": 7.826, "ст50": 7.81, "ст55": 7.82, "ст60": 7.8,
    "09Г2С": 7.85, "10Г2": 7.79, "15Г": 7.81, "15Х": 7.83, "20Г": 7.82,
    "20Х": 7.83, "30Г": 7.81, "30Х": 7.82, "35Г2": 7.79, "40Г": 7.81,
    "40Х": 7.85, "45Г2": 7.81, "45Х": 7.82, "50Г": 7.81, "50Г2": 7.5,
    "50Х": 7.82, "65Г": 7.85, "У7": 7.83, "У8": 7.839, "У10": 7.81,
    "У12": 7.83, "Р18": 8.8
};

// Проверка wire_rod
if (!metalDatabase.metals.wire_rod) {
    console.log('❌ ОШИБКА: wire_rod не найден в БД!');
    process.exit(1);
}

const wire_rod = metalDatabase.metals.wire_rod;

console.log('Текущее состояние wire_rod:');
console.log(`  Название: ${wire_rod.name}`);
console.log(`  Размеров: ${wire_rod.sizes?.length || 0}`);
console.log(`  steelGrades: ${wire_rod.steelGrades ? Object.keys(wire_rod.steelGrades).length : 0} (должно быть 37!)`);

// Создать steelGrades
wire_rod.steelGrades = {};

const baseDensity = 7.85; // Базовая плотность стали (т/м³)

steelTypes.forEach(steel => {
    const density = steelCoefficients[steel];
    const coefficient = density / baseDensity; // Коэффициент относительно базовой плотности

    wire_rod.steelGrades[steel] = {
        density: density,
        coefficient: coefficient,
        name: steel
    };
});

console.log('\n✅ Добавлено марок стали:', Object.keys(wire_rod.steelGrades).length);
console.log('  Примеры:');
console.log(`    ст3: density=${wire_rod.steelGrades['ст3'].density}, coef=${wire_rod.steelGrades['ст3'].coefficient.toFixed(4)}`);
console.log(`    Р18: density=${wire_rod.steelGrades['Р18'].density}, coef=${wire_rod.steelGrades['Р18'].coefficient.toFixed(4)}`);
console.log(`    У12: density=${wire_rod.steelGrades['У12'].density}, coef=${wire_rod.steelGrades['У12'].coefficient.toFixed(4)}`);

// Сохранить
fs.writeFileSync(dbPath, JSON.stringify(metalDatabase, null, 2), 'utf8');

console.log('\n💾 Файл сохранён: database/metals.json');
console.log('═'.repeat(70));
console.log('✅ МАРКИ СТАЛИ ДОБАВЛЕНЫ!');
console.log(`\nТеперь у катанки:`);
console.log(`  - ${wire_rod.sizes.length} размеров`);
console.log(`  - ${Object.keys(wire_rod.steelGrades).length} марок стали`);
console.log(`\n🎉 ДАННЫЕ КАТАНКИ ВОССТАНОВЛЕНЫ НА 100%!`);
