# Metal Calculator для n8n

Модульный калькулятор металлопроката для использования в n8n workflows на Railway.

## Описание

Metal Calculator - это библиотека для расчета веса, длины и количества металлопроката различных типов. Поддерживает более 70 видов металлоизделий с актуальными ГОСТами и точными формулами расчета.

**Основные возможности:**
- Расчет по весу → длина + количество штук
- Расчет по длине → вес + количество штук
- Расчет по количеству → вес + длина
- Поддержка оцинкованных изделий
- Работа с 70+ типами металлопроката
- Готов к использованию в n8n Code Node

## Структура проекта

```
metal-calculator/
├── database/
│   └── metals.json           # База данных металлов (296 KB)
├── src/
│   ├── formulas.js           # Модуль формул расчета
│   └── calculator.js         # Главный модуль калькулятора
├── dist/
│   └── calculator.bundle.js  # Собранный bundle для n8n (14 KB)
├── docs/                     # GitHub Pages
│   ├── database/
│   │   └── metals.json       # База данных (публичный доступ)
│   ├── dist/
│   │   └── calculator.bundle.js  # Bundle (публичный доступ)
│   ├── index.html            # Документация API
│   └── test.html             # Страница тестирования
├── build.js                  # Скрипт сборки bundle
├── test.js                   # Полное тестирование (10 тестов)
├── test-simple.js            # Быстрое тестирование
└── package.json
```

## Компоненты

### 1. База данных (database/metals.json)

**Содержимое:**
- 70+ типов металлопроката
- Актуальные ГОСТы для каждого типа
- Стандартные размеры и веса
- Константы (плотность стали, коэффициенты оцинковки)

**Категории металлов:**
- Арматура (А1, А3, Ат800, Ат1000 и оцинкованные)
- Балка (двутавр, широкополочные, европрофили)
- Швеллер (обычный, с уклоном, специальные)
- Уголок (равнополочный, неравнополочный)
- Труба (круглая, профильная, водогазопроводная)
- Лист, круг, квадрат, полоса
- Проволока, канат, катанка
- Шестигранник, профнастил, рельс

**Размер:** ~296 KB

### 2. Модуль формул (src/formulas.js)

**Функции расчета:**
- `calculateCircleWeight()` - круглый прокат (арматура, круг)
- `calculateSquareWeight()` - квадратный прокат
- `calculateRectangleWeight()` - прямоугольный прокат
- `calculateSheetWeight()` - листовой металл
- `calculatePipeWeight()` - трубы
- `addGalvanization()` - добавление веса оцинковки
- `calculateLengthFromWeight()` - обратный расчет (вес → длина)
- `calculatePiecesFromLength()` - расчет количества штук

**Константы:**
- `STEEL_DENSITY = 7850` кг/м³

### 3. Калькулятор (src/calculator.js)

**Главная функция:** `calculateMetal(params, metalDatabase)`

**Параметры:**
```javascript
{
  metalType: string,      // Тип металла ('armature_a1', 'beam', 'channel', и т.д.)
  size: number|string,    // Размер (12 для арматуры, '20К1' для балки)
  weight: number?,        // Вес в кг (опционально)
  length: number?,        // Длина в метрах (опционально)
  pieces: number?,        // Количество штук (опционально)
  isGalvanized: boolean?, // Оцинкован? (опционально)
  galvCoef: number?       // Коэффициент оцинковки: 0.03, 0.05, 0.07 (опционально)
}
```

**Возвращаемое значение:**
```javascript
{
  success: true,
  metalType: "Арматура А3",
  size: 12,
  gost: "ГОСТ 5781-82",
  category: "Арматура",
  weightPerMeter: 0.888,
  weight: 100,
  length: 112.64,
  pieces: 10,
  isGalvanized: false
}
```

**Обработка ошибок:**
- Металл не найден в базе
- Размер не найден для данного металла
- Неизвестная формула расчета
- Отсутствуют входные параметры

### 4. Bundle (два варианта)

**Для Node.js (n8n):**
- Файл: `dist/calculator.bundle.js`
- Размер: ~14 KB
- Формат: CommonJS (module.exports)
- Использование: `const { calculateMetal } = require('./calculator.bundle.js')`
- Применение: n8n Code Node, Node.js скрипты

**Для браузера (test.html):**
- Файл: `dist/calculator.browser.js`
- Размер: ~14 KB
- Формат: IIFE (window.MetalCalculator)
- Использование: `window.MetalCalculator.calculateMetal(...)`
- Применение: HTML страницы, браузерные приложения

**Сборка:**
```bash
node build.js  # Создает обе версии автоматически
```

Скрипт build.js создает оба файла одновременно:
- `dist/calculator.bundle.js` - для Node.js
- `dist/calculator.browser.js` - для браузера
- `docs/dist/calculator.browser.js` - копия для GitHub Pages

## Использование в n8n

**Важно:** Для n8n используйте **calculator.bundle.js** (Node.js версия с module.exports).

### Метод 1: Загрузка из GitHub Pages (рекомендуется)

Этот метод позволяет обновлять базу данных без изменения workflow.

**Создайте Code Node:**

```javascript
// Загрузка базы данных металлов
const metalsResponse = await fetch(
  'https://YOUR-USERNAME.github.io/metal-calculator/database/metals.json'
);
const metalDatabase = await metalsResponse.json();

// Загрузка калькулятора
const calcResponse = await fetch(
  'https://YOUR-USERNAME.github.io/metal-calculator/dist/calculator.bundle.js'
);
const calcCode = await calcResponse.text();

// Выполнение кода калькулятора
const { calculateMetal } = eval(calcCode + '; ({ calculateMetal })');

// Использование
const result = calculateMetal({
  metalType: 'armature_a3',
  size: 12,
  weight: 100
}, metalDatabase);

return result;
```

**Преимущества:**
- ✅ Обновления базы без изменения workflow
- ✅ Централизованное хранение данных
- ✅ Легко тестировать в браузере

### Метод 2: Встроенный bundle

Если нужна работа без интернета, можно встроить bundle прямо в Code Node.

**Шаг 1:** Скопируйте содержимое `dist/calculator.bundle.js`

**Шаг 2:** Вставьте в начало Code Node

**Шаг 3:** Загрузите базу данных отдельно или встройте её тоже

```javascript
// Встроенный код калькулятора
const STEEL_DENSITY = 7850;
function calculateCircleWeight(diameter, length) { ... }
// ... весь код из bundle

// Встроенная база данных
const metalDatabase = { "metals": { ... } };

// Использование
const result = calculateMetal({
  metalType: 'beam',
  size: '20К1',
  length: 50
}, metalDatabase);

return result;
```

## API (GitHub Pages)

После публикации на GitHub Pages доступны следующие endpoints:

- **База данных:** `https://YOUR-USERNAME.github.io/metal-calculator/database/metals.json`
- **Bundle для Node.js (n8n):** `https://YOUR-USERNAME.github.io/metal-calculator/dist/calculator.bundle.js`
- **Bundle для браузера:** `https://YOUR-USERNAME.github.io/metal-calculator/dist/calculator.browser.js`
- **Документация:** `https://YOUR-USERNAME.github.io/metal-calculator/`
- **Тестирование:** `https://YOUR-USERNAME.github.io/metal-calculator/test.html`

## Примеры использования

### Пример 1: Расчет арматуры по весу

```javascript
const result = calculateMetal({
  metalType: 'armature_a3',
  size: 12,
  weight: 100
}, metalDatabase);

// Результат:
// {
//   success: true,
//   metalType: "Арматура А3",
//   weightPerMeter: 0.888,
//   weight: 100,
//   length: 112.64,
//   pieces: 10
// }
```

### Пример 2: Расчет балки по длине

```javascript
const result = calculateMetal({
  metalType: 'beam',
  size: '20К1',
  length: 50
}, metalDatabase);

// Результат:
// {
//   success: true,
//   metalType: "Балка",
//   size: "20К1",
//   weightPerMeter: 41.4,
//   weight: 2070,
//   length: 50,
//   pieces: 5
// }
```

### Пример 3: Расчет швеллера по количеству штук

```javascript
const result = calculateMetal({
  metalType: 'channel',
  size: '10У',
  pieces: 10
}, metalDatabase);

// Результат:
// {
//   success: true,
//   metalType: "Швеллер",
//   size: "10У",
//   weightPerMeter: 10.32,
//   weight: 1238.4,
//   length: 120,
//   pieces: 10
// }
```

### Пример 4: Арматура оцинкованная

```javascript
const result = calculateMetal({
  metalType: 'armature_a1_galv',
  size: 10,
  pieces: 5,
  isGalvanized: true,
  galvCoef: 0.03  // +3% на оцинковку
}, metalDatabase);

// Результат:
// {
//   success: true,
//   metalType: "Арматура А1 оц.",
//   weightPerMeter: 0.635,
//   weight: 38.1,
//   length: 60,
//   pieces: 5,
//   isGalvanized: true
// }
```

### Пример 5: Обработка ошибок

```javascript
const result = calculateMetal({
  metalType: 'unknown_metal',
  size: 12,
  length: 10
}, metalDatabase);

// Результат:
// {
//   success: false,
//   error: "Металл типа 'unknown_metal' не найден в базе данных",
//   metalType: "unknown_metal"
// }
```

### Пример 6: Использование в браузере

Для использования в HTML-страницах используйте **calculator.browser.js** (IIFE версия):

```html
<!DOCTYPE html>
<html>
<head>
  <title>Metal Calculator Test</title>
  <script src="https://YOUR-USERNAME.github.io/metal-calculator/dist/calculator.browser.js"></script>
</head>
<body>
  <h1>Metal Calculator</h1>

  <script>
    // Загрузка базы данных
    fetch('https://YOUR-USERNAME.github.io/metal-calculator/database/metals.json')
      .then(response => response.json())
      .then(metalDatabase => {

        // Использование window.MetalCalculator.calculateMetal
        const result = window.MetalCalculator.calculateMetal({
          metalType: 'armature_a3',
          size: 12,
          weight: 100
        }, metalDatabase);

        console.log(result);
        // {
        //   success: true,
        //   metalType: "Арматура А3",
        //   weightPerMeter: 0.888,
        //   weight: 100,
        //   length: 112.64,
        //   pieces: 10
        // }
      });
  </script>
</body>
</html>
```

**Важно:** В браузере используйте `window.MetalCalculator.calculateMetal()`, а не просто `calculateMetal()`.

## Разработка

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR-USERNAME/metal-calculator.git
cd metal-calculator

# Структура уже создана, зависимостей нет
```

### Сборка bundle

```bash
node build.js
```

Результат:
- Создается `dist/calculator.bundle.js`
- Автоматически копируется в `docs/dist/`
- Выводится размер файла
- Выполняется проверка валидности

### Тестирование

**Полное тестирование (10 тестов):**
```bash
node test.js
```

**Быстрое тестирование (3 теста):**
```bash
node test-simple.js
```

**Тест bundle:**
```bash
node test-bundle.js
```

### Добавление нового типа металла

1. Отредактируйте `database/metals.json`
2. Добавьте новый объект в секцию `metals`
3. Укажите все необходимые поля:
   - `name` - название
   - `gost` - ГОСТ
   - `category` - категория
   - `formula` - формула расчета
   - `sizes` - доступные размеры
   - `weights` - таблица весов (если нужна)
   - `standardLengths` - стандартные длины
4. Пересоберите bundle: `node build.js`
5. Протестируйте: `node test.js`

## Обновление базы данных

### Локальное обновление

1. Отредактируйте `database/metals.json`
2. Запустите сборку: `node build.js`
3. Протестируйте изменения: `node test.js`

### Публикация на GitHub Pages

1. Закоммитьте изменения:
```bash
git add .
git commit -m "Update metals database"
git push
```

2. GitHub Pages обновится автоматически (~1-2 минуты)

3. Проверьте обновление:
```bash
curl https://YOUR-USERNAME.github.io/metal-calculator/database/metals.json
```

4. Ваши n8n workflows автоматически получат обновленную базу при следующем запуске

## Типы металлов

Полный список доступных типов металлов:

| Категория | Ключи в базе |
|-----------|--------------|
| **Арматура** | `armature_a1`, `armature_a1_galv`, `armature_a3`, `armature_a3_galv`, `armature_at800`, `armature_at1000` |
| **Балка** | `beam` (более 500 размеров от 10 до 200БС) |
| **Швеллер** | `channel` (более 100 размеров) |
| **Уголок** | `angle` (равнополочный и неравнополочный) |
| **Труба** | `pipe`, `pipe_profile`, `pipe_vgp` |
| **Круг** | `circle`, `circle_calibrated` |
| **Квадрат** | `square`, `square_calibrated` |
| **Лист** | `sheet`, `sheet_corrugated` |
| **Проволока** | `wire`, `wire_galv` |
| **Канат** | `rope` |
| **Полоса** | `strip` |
| **Катанка** | `wire_rod` |

## Скрипты

| Команда | Описание |
|---------|----------|
| `node build.js` | Собрать bundle из исходников |
| `node test.js` | Запустить полное тестирование (10 тестов) |
| `node test-simple.js` | Быстрое тестирование (3 теста) |
| `node test-bundle.js` | Тест собранного bundle |

## Технические детали

**Плотность стали:** 7850 кг/м³

**Коэффициенты оцинковки:**
- Легкая: 0.03 (+3%)
- Средняя: 0.05 (+5%)
- Тяжелая: 0.07 (+7%)

**Формулы расчета:**
- Круг: π × (d/2)² × L × ρ
- Квадрат: a² × L × ρ
- Прямоугольник: a × b × L × ρ
- Труба: π × ((D/2)² - ((D-2t)/2)²) × L × ρ
- Лист: W × L × t × ρ

где:
- d, D - диаметр (мм)
- a, b - стороны (мм)
- t - толщина стенки/листа (мм)
- L - длина (м)
- W - ширина (м)
- ρ - плотность стали (кг/м³)

## Лицензия

**UNLICENSED** - Private

Проект создан для внутреннего использования 23met.
Все права защищены.

## Автор

**23met**
Версия: 1.0.0
Дата создания: 2025

## Поддержка

Для вопросов и предложений создавайте Issues в репозитории.
