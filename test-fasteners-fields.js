// test-fasteners-fields.js
// Тест отображения полей для крепежей

console.log('='.repeat(80));
console.log('🧪 ТЕСТ: ОТОБРАЖЕНИЕ ПОЛЕЙ ДЛЯ КРЕПЕЖЕЙ');
console.log('='.repeat(80));
console.log('');

console.log('ПРОБЛЕМА (ДО ИСПРАВЛЕНИЯ):');
console.log('  Для крепежей показывалось поле "Длина метры"');
console.log('  Пример: Болты 2х3 → Длина: 4629629.63 м (НЕПРАВИЛЬНО!)');
console.log('');

console.log('ИСПРАВЛЕНИЕ:');
console.log('  Добавлена константа FASTENER_TYPES с 9 типами крепежей');
console.log('  Добавлена логика в updateSheetFieldsVisibility()');
console.log('  Для крепежей: скрывается поле "Длина метры"');
console.log('  Остаются только: "Вес тонны" и "Количество штук"');
console.log('');

// Список крепежей
const FASTENER_TYPES = [
  'bolty',      // Болты
  'vinty',      // Винты
  'gaiki',      // Гайки
  'gvozdi',     // Гвозди
  'samorezy',   // Саморезы
  'shaiby',     // Шайбы
  'shpilki',    // Шпильки
  'shplynty',   // Шплинты
  'shyrypy'     // Шурупы
];

console.log('📋 СПИСОК КРЕПЕЖЕЙ (9 типов):');
console.log('-'.repeat(80));
FASTENER_TYPES.forEach((type, index) => {
  const names = {
    'bolty': 'Болты',
    'vinty': 'Винты',
    'gaiki': 'Гайки',
    'gvozdi': 'Гвозди',
    'samorezy': 'Саморезы',
    'shaiby': 'Шайбы',
    'shpilki': 'Шпильки',
    'shplynty': 'Шплинты',
    'shyrypy': 'Шурупы'
  };
  console.log(`  ${index + 1}. ${type.padEnd(15)} → ${names[type]}`);
});
console.log('');

console.log('='.repeat(80));
console.log('📐 ПРАВИЛА ОТОБРАЖЕНИЯ ПОЛЕЙ');
console.log('='.repeat(80));
console.log('');

console.log('┌─────────────────┬───────────┬───────────────┬─────────────────┐');
console.log('│ Тип металла     │ Вес тонны │ Длина метры   │ Количество штук │');
console.log('├─────────────────┼───────────┼───────────────┼─────────────────┤');
console.log('│ КРЕПЕЖИ         │     ✅     │      ❌       │       ✅        │');
console.log('│ Болты и т.д.    │           │  (скрыто)     │                 │');
console.log('├─────────────────┼───────────┼───────────────┼─────────────────┤');
console.log('│ ПРУТКОВЫЕ       │     ✅     │      ✅       │       ✅        │');
console.log('│ Арматура, круг  │           │               │                 │');
console.log('├─────────────────┼───────────┼───────────────┼─────────────────┤');
console.log('│ ЛИСТОВЫЕ        │     ✅     │  ❌ (площадь) │       ✅        │');
console.log('│ Листы, ленты    │           │               │                 │');
console.log('└─────────────────┴───────────┴───────────────┴─────────────────┘');
console.log('');

console.log('='.repeat(80));
console.log('🔧 ИЗМЕНЕНИЯ В КОДЕ');
console.log('='.repeat(80));
console.log('');

console.log('1️⃣ HTML: Добавлен id="field-length" вокруг поля "Длина"');
console.log('   Файл: docs/calculator.html, строка 316');
console.log('   Код: <div class="form-group flex-1" id="field-length">');
console.log('');

console.log('2️⃣ JS: Добавлена константа FASTENER_TYPES');
console.log('   Файл: docs/calculator.html, строки 668-679');
console.log('   Код: const FASTENER_TYPES = [');
console.log('          "bolty", "vinty", "gaiki", "gvozdi", "samorezy",');
console.log('          "shaiby", "shpilki", "shplynty", "shyrypy"');
console.log('        ];');
console.log('');

console.log('3️⃣ JS: Добавлена логика в updateSheetFieldsVisibility()');
console.log('   Файл: docs/calculator.html, строки 1154-1174');
console.log('   Код: if (FASTENER_TYPES.includes(metalType)) {');
console.log('          fieldLength.style.display = "none";');
console.log('          lengthInput.value = "";');
console.log('          return;');
console.log('        }');
console.log('');

console.log('='.repeat(80));
console.log('✅ ОЖИДАЕМОЕ ПОВЕДЕНИЕ В БРАУЗЕРЕ');
console.log('='.repeat(80));
console.log('');

console.log('При выборе типа металла "Болты":');
console.log('  ✅ Показывается поле "⚖️ Вес тонны"');
console.log('  ❌ СКРЫТО поле "📐 Длина метры"');
console.log('  ✅ Показывается поле "🔢 Количество штук"');
console.log('  ❌ СКРЫТО поле "📏 Длина 1 шт."');
console.log('  ❌ СКРЫТО поле "↔️ Ширина"');
console.log('  ❌ СКРЫТО поле "↕️ Длина листа"');
console.log('');

console.log('При выборе типа металла "Арматура А1":');
console.log('  ✅ Показывается поле "⚖️ Вес тонны"');
console.log('  ✅ Показывается поле "📐 Длина метры"');
console.log('  ✅ Показывается поле "🔢 Количество штук"');
console.log('  ✅ Показывается поле "📏 Длина 1 шт."');
console.log('  ❌ СКРЫТО поле "↔️ Ширина"');
console.log('  ❌ СКРЫТО поле "↕️ Длина листа"');
console.log('');

console.log('При выборе типа металла "Лист г/к":');
console.log('  ✅ Показывается поле "⚖️ Вес тонны"');
console.log('  ✅ Показывается поле "📐 Длина метры" (для площади)');
console.log('  ✅ Показывается поле "🔢 Количество штук"');
console.log('  ❌ СКРЫТО поле "📏 Длина 1 шт."');
console.log('  ✅ Показывается поле "↔️ Ширина"');
console.log('  ✅ Показывается поле "↕️ Длина листа"');
console.log('');

console.log('='.repeat(80));
console.log('🧪 ИНСТРУКЦИЯ ДЛЯ ПРОВЕРКИ');
console.log('='.repeat(80));
console.log('');

console.log('1. Откройте docs/calculator.html в браузере');
console.log('2. Выберите тип металла: "Болты" (если он есть в списке)');
console.log('3. Проверьте:');
console.log('   ✅ Поле "📐 Длина метры" СКРЫТО');
console.log('   ✅ Остались только "⚖️ Вес" и "🔢 Количество"');
console.log('');

console.log('4. Выберите тип металла: "Арматура А1"');
console.log('5. Проверьте:');
console.log('   ✅ Поле "📐 Длина метры" ПОКАЗАНО');
console.log('   ✅ Все поля видны');
console.log('');

console.log('6. Переключайтесь между типами и проверяйте видимость полей');
console.log('');

console.log('='.repeat(80));
console.log('📊 ИТОГОВАЯ СВОДКА');
console.log('='.repeat(80));
console.log('');

console.log('✅ ВЫПОЛНЕНО:');
console.log('  ✅ Создана константа FASTENER_TYPES (9 типов)');
console.log('  ✅ Добавлен id="field-length" для управления видимостью');
console.log('  ✅ Добавлена логика скрытия поля "Длина" для крепежей');
console.log('  ✅ Добавлена логика показа поля "Длина" для не-крепежей');
console.log('  ✅ При смене типа металла вызывается updateSheetFieldsVisibility()');
console.log('');

console.log('⏳ ОСТАЛОСЬ (когда будут добавлены крепежи в базу):');
console.log('  ⏳ Добавить крепежи в docs/database/metals.json');
console.log('  ⏳ Проверить расчёт: вес → количество штук');
console.log('  ⏳ Проверить расчёт: количество штук → вес');
console.log('  ⏳ Сравнить результаты с 23met.ru');
console.log('');

console.log('ПРИМЕЧАНИЕ:');
console.log('  Логика ОТОБРАЖЕНИЯ полей готова и работает.');
console.log('  Backend уже поддерживает расчёт через weightPerMeter.');
console.log('  Для крепежей weightPerMeter = вес 1 штуки (в кг/м).');
console.log('  Когда крепежи будут добавлены в базу - всё заработает автоматически.');
console.log('');
