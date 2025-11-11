const db = require('./database/metals.json');

console.log('Текущие канаты в БД:\n');

['rope', 'rope_armature', 'rope_galv'].forEach(k => {
    const m = db.metals[k];
    if (m) {
        const sizesCount = m.sizes ? m.sizes.length : 0;
        const weightsCount = m.weights ? Object.keys(m.weights).length : 0;
        console.log(`${k}:`);
        console.log(`  Название: ${m.name}`);
        console.log(`  Sizes: ${sizesCount}`);
        console.log(`  Weights: ${weightsCount}`);
        console.log(`  Formula: ${m.formula || 'НЕТ'}`);
        console.log(`  useKilograms: ${m.useKilograms || false}`);
        console.log(``);
    } else {
        console.log(`${k}: НЕ НАЙДЕН В БД!\n`);
    }
});

const totalSizes = ['rope', 'rope_armature', 'rope_galv'].reduce((sum, k) => {
    return sum + (db.metals[k]?.sizes?.length || 0);
}, 0);

console.log(`ИТОГО размеров канатов: ${totalSizes} (ожидается 442)`);
