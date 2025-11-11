// test-length-per-piece-field.js
// Тест поля "Длина 1 шт." для 42 типов металлов

const fs = require('fs');

const metalDatabase = JSON.parse(fs.readFileSync('./docs/database/metals.json', 'utf-8'));

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ПОЛЕ "ДЛИНА 1 ШТ." ДЛЯ 42 ТИПОВ');
console.log('='.repeat(80));
console.log('');

// Список из константы TYPES_WITH_LENGTH_FIELD
const TYPES_WITH_LENGTH_FIELD = [
  // Арматура (6)
  'armature_a1', 'armature_a1_galv', 'armature_a3', 'armature_a3_galv',
  'armature_at800', 'armature_at1000',
  // Балка, Катанка, Квадрат (3)
  'beam', 'wire_rod', 'square',
  // Круг (2)
  'circle', 'circle_galv',
  // Полоса (3)
  'strip', 'strip_galv', 'bulb_flat',
  // Рельс (1)
  'rail',
  // Трубы (18)
  'pipe_vgp', 'pipe_vgp_galv', 'pipe_pnd',
  'pipe_seamless_hot', 'pipe_seamless_hot_galv', 'pipe_boiler',
  'pipe_seamless_cold', 'pipe_seamless_cold_galv',
  'pipe_square', 'pipe_square_galv',
  'pipe_oval', 'pipe_oval_galv',
  'pipe_flatoval', 'pipe_flatoval_galv',
  'pipe_rect', 'pipe_rect_galv',
  'pipe_es', 'pipe_es_galv',
  // Уголок (4)
  'angle', 'angle_bent', 'angle_bent_galv', 'angle_galv',
  // Швеллер (4)
  'channel', 'channel_bent', 'channel_bent_galv', 'channel_galv',
  // Шестигранник (1)
  'hexagon'
];

// Проверяем что все типы есть в базе
console.log('📋 ПРОВЕРКА НАЛИЧИЯ ТИПОВ В БАЗЕ:');
console.log('');

let found = 0;
let notFound = [];

for (const type of TYPES_WITH_LENGTH_FIELD) {
  if (metalDatabase.metals[type]) {
    found++;
    console.log(`  ✅ ${type.padEnd(30)} → ${metalDatabase.metals[type].name}`);
  } else {
    notFound.push(type);
    console.log(`  ❌ ${type.padEnd(30)} → НЕ НАЙДЕН В БАЗЕ!`);
  }
}

console.log('');
console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СТАТИСТИКА');
console.log('='.repeat(80));
console.log(`Типов в константе: ${TYPES_WITH_LENGTH_FIELD.length}`);
console.log(`Найдено в базе: ${found}`);
console.log(`Не найдено: ${notFound.length}`);
console.log('');

if (notFound.length > 0) {
  console.log('❌ ТИПЫ НЕ НАЙДЕННЫЕ В БАЗЕ:');
  notFound.forEach(type => console.log(`  • ${type}`));
  console.log('');
}

if (found === TYPES_WITH_LENGTH_FIELD.length) {
  console.log('✅ ВСЕ 42 ТИПА НАЙДЕНЫ В БАЗЕ ДАННЫХ!');
  console.log('');
  console.log('Группировка по категориям:');
  console.log('  • Арматура: 6 типов');
  console.log('  • Балка, Катанка, Квадрат: 3 типа');
  console.log('  • Круг: 2 типа');
  console.log('  • Полоса: 3 типа');
  console.log('  • Рельс: 1 тип');
  console.log('  • Трубы: 18 типов');
  console.log('  • Уголок: 4 типа');
  console.log('  • Швеллер: 4 типа');
  console.log('  • Шестигранник: 1 тип');
  console.log('');
  console.log('ИТОГО: 42 типа');
} else {
  console.log('❌ ОШИБКА: Не все типы найдены в базе!');
}
console.log('');

// Проверяем типы БЕЗ поля (должны быть скрыты)
console.log('='.repeat(80));
console.log('📋 ТИПЫ БЕЗ ПОЛЯ "ДЛИНА 1 ШТ."');
console.log('='.repeat(80));
console.log('');

const allTypes = Object.keys(metalDatabase.metals);
const typesWithoutField = allTypes.filter(type => !TYPES_WITH_LENGTH_FIELD.includes(type));

console.log(`Типов без поля: ${typesWithoutField.length}`);
console.log('');
console.log('Первые 10:');
typesWithoutField.slice(0, 10).forEach(type => {
  console.log(`  • ${type.padEnd(30)} → ${metalDatabase.metals[type].name}`);
});
console.log('');

console.log('Эти типы НЕ должны показывать поле "Длина 1 шт.":');
console.log('  ✅ Канаты');
console.log('  ✅ Ленты/штрипсы');
console.log('  ✅ Листы (все варианты)');
console.log('  ✅ Плита');
console.log('  ✅ Проволока');
console.log('  ✅ Профнастил');
console.log('  ✅ Сутунка');
console.log('  ✅ Шпунты');
console.log('  ✅ Крепёж (все варианты)');
console.log('');
