# 📊 АНАЛИЗ ЛИСТОВЫХ МЕТАЛЛОВ — ПРОБЛЕМЫ С ФОРМУЛАМИ

## 🎯 ЦЕЛЬ АНАЛИЗА

Проверить все листовые металлы со скриншота с учётом исправленных формул:
1. Правильная формула оцинковки: `(толщина × плотность + оцинковка)`
2. Марка стали должна влиять на вес

---

## ✅ ТИПЫ С ПРАВИЛЬНОЙ РЕАЛИЗАЦИЕЙ

### Лента/штрипс окраш. (strip_tape_painted)
**Статус:** ✅ **РАБОТАЕТ ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:210-255`
- Formula: `strip`
- **Есть steelDensities:** ДА (137 марок стали)
- **Есть galvanizationWeights:** ДА (27 вариантов оцинковки)

**Формула:**
```javascript
weightPerMeter = sizeCoef * steelCoef + galvCoef;
// Где:
// - sizeCoef = толщина в мм (из metal.weights)
// - steelCoef = плотность стали (из metal.steelDensities)
// - galvCoef = вес оцинковки в кг/м² (из metal.galvanizationWeights)
```

**Тесты:**
- ✅ Марка стали влияет: ст3 (2.355т) → ст45 (2.348т) = -0.007т
- ✅ Оцинковка влияет: нет (2.355т) → 190г/м² (2.412т) = +0.057т

---

## ❌ ПРОБЛЕМНЫЕ ТИПЫ

---

### 1. Лист ПВ (sheet_pv)

**Статус:** ⚠️ **ЧАСТИЧНО ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:108-140`
- Formula: `sheet_pv`
- **Есть steelDensities:** НЕТ
- **Есть galvanizationWeights:** НЕТ

**Текущая формула:**
```javascript
const steelDensity = 7.85; // фиксированная плотность
weightPerMeter = coefficient * steelDensity;
```

**Проблемы:**
1. ❌ Марка стали НЕ влияет на вес (используется константа 7.85)
2. ℹ️ Оцинковки нет (это нормально для этого типа)

**Что нужно исправить:**
- [ ] Добавить поддержку марок стали в базу данных
- [ ] Изменить формулу для использования переменной плотности

**Рекомендация:**
```javascript
// Получить плотность стали из параметров
const steelType = params.steelType || 'ст3';
const steelDensity = getSteel Density(steelType) || 7.85;
weightPerMeter = coefficient * steelDensity;
```

---

### 2. Лист ПВ оцинк. (sheet_pv_galv)

**Статус:** ⚠️ **ЧАСТИЧНО ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:141-179`
- Formula: `sheet_pv_galv`
- **Есть steelDensities:** НЕТ
- **Есть galvanizationWeights:** ДА (27 вариантов)

**Текущая формула:**
```javascript
const steelDensity = 7.85;
const zincCoef = zincCoefs?.[zincOption] || 0;
weightPerMeter = coefficient * (1 + zincCoef) * steelDensity;
```

**Проблемы:**
1. ❌ Марка стали НЕ влияет на вес (константа 7.85)
2. ✅ Оцинковка влияет (но формула НЕ ПРАВИЛЬНАЯ!)

**⚠️ КРИТИЧЕСКАЯ ПРОБЛЕМА:**
Формула оцинковки использует **доли** вместо **абсолютных значений в кг/м²**:
```javascript
// ТЕКУЩАЯ (НЕПРАВИЛЬНАЯ):
weightPerMeter = coefficient * (1 + zincCoef) * steelDensity;
// При zincCoef = 0.021 это означает +2.1% к весу

// ПРАВИЛЬНАЯ:
weightPerMeter = coefficient * steelDensity + zincCoef;
// Где zincCoef = вес оцинковки в кг/м² (например, 0.19 кг/м²)
```

**Что нужно исправить:**
- [ ] Добавить steelDensities в базу данных
- [ ] Изменить значения galvanizationWeights с долей на абсолютные кг/м²
- [ ] Исправить формулу на правильную

---

### 3. Лист рифленый (sheet_checkered)

**Статус:** ⚠️ **ЧАСТИЧНО ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:180-209`
- Formula: `sheet_checkered`
- **Есть steelDensities:** НЕТ
- **Есть galvanizationWeights:** НЕТ
- **Есть riffleTypes:** ДА (типы рифления)

**Текущая формула:**
```javascript
const sizeCoef = metal.weights?.[sizeStr];
const riffleCoef = metal.riffleCoefficients?.[riffleType];
weightPerMeter = sizeCoef * riffleCoef;
```

**Проблемы:**
1. ❌ Марка стали НЕ влияет на вес
2. ℹ️ Оцинковки нет (нормально для этого типа)
3. ✅ Рифление влияет через riffleCoef

**Вопрос:**
- Нужно ли добавлять марки стали для рифленого листа?
- Или рифление уже учитывает плотность?

---

### 4. Лист/рулон г/к (sheet_hot)

**Статус:** ❌ **НЕ РАБОТАЕТ ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:253-263` → `calculateWeightPerMeter()` → `formulas.calculateSheetWeight()`
- Formula: `sheet`
- **Есть weights:** ДА (таблица весов)
- **Есть steelDensities:** НЕТ

**Текущая формула:**
```javascript
// В calculateWeightPerMeter (строка 679):
return formulas.calculateSheetWeight(width / 1000, 1, thickness);

// В formulas.js:
const STEEL_DENSITY = 7850; // КОНСТАНТА!
return volumeInM3 * STEEL_DENSITY;
```

**Проблемы:**
1. ❌ Марка стали НЕ влияет на вес (константа 7850)
2. ℹ️ Оцинковки нет (нормально для г/к)

**Что нужно исправить:**
- [ ] Добавить steelGrades и steelDensities в базу данных
- [ ] Изменить логику чтобы использовалась ветка с weights + steelDensities (строка 210-255)

**Рекомендация:**
Добавить в базу данных:
```json
{
  "steelGrades": ["ст3", "ст45", ...],
  "steelDensities": {
    "ст3": 7.85,
    "ст45": 7.826,
    ...
  }
}
```

---

### 5. Лист/рулон окраш. (sheet_painted)

**Статус:** ❌ **НЕ РАБОТАЕТ ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:253-263` → `calculateWeightPerMeter()` → `formulas.calculateSheetWeight()`
- Formula: `sheet`
- **Есть weights:** ДА
- **Есть steelDensities:** НЕТ
- **Есть galvanizationWeights:** НЕТ

**Проблемы:**
1. ❌ Марка стали НЕ влияет на вес (константа 7850)
2. ❌ Оцинковка НЕ влияет на вес (отсутствует galvanizationWeights)

**Что нужно исправить:**
- [ ] Добавить steelGrades и steelDensities в базу данных
- [ ] Добавить galvanization и galvanizationWeights в базу данных
- [ ] Изменить логику чтобы использовалась ветка с weights + steelDensities (строка 210-255)

---

### 6. Лист/рулон оцинк. (sheet_galv)

**Статус:** ❌ **НЕ РАБОТАЕТ ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:253-263` → `calculateWeightPerMeter()` → `formulas.calculateSheetWeight()`
- Formula: `sheet`
- **Есть weights:** ДА
- **Есть steelDensities:** НЕТ
- **Есть galvanizationWeights:** НЕТ

**Проблемы:**
1. ❌ Марка стали НЕ влияет на вес (константа 7850)
2. ❌ Оцинковка НЕ влияет на вес (отсутствует galvanizationWeights)

**Что нужно исправить:**
- [ ] Добавить steelGrades и steelDensities в базу данных
- [ ] Добавить galvanization и galvanizationWeights в базу данных
- [ ] Изменить логику чтобы использовалась ветка с weights + steelDensities (строка 210-255)

---

### 7. Лист/рулон х/к (sheet_cold)

**Статус:** ❌ **НЕ РАБОТАЕТ ПРАВИЛЬНО**

**Реализация:**
- Файл: `src/calculator.js:253-263` → `calculateWeightPerMeter()` → `formulas.calculateSheetWeight()`
- Formula: `sheet`
- **Есть weights:** ДА
- **Есть steelDensities:** НЕТ

**Проблемы:**
1. ❌ Марка стали НЕ влияет на вес (константа 7850)
2. ℹ️ Оцинковки нет (нормально для х/к)

**Что нужно исправить:**
- [ ] Добавить steelGrades и steelDensities в базу данных
- [ ] Изменить логику чтобы использовалась ветка с weights + steelDensities (строка 210-255)

---

## 📊 ИТОГОВАЯ СТАТИСТИКА

| Тип металла | Марка стали работает? | Оцинковка работает? | Статус |
|-------------|----------------------|---------------------|--------|
| Лента/штрипс окраш. | ✅ ДА | ✅ ДА | ✅ Правильно |
| Лист ПВ | ❌ НЕТ | - | ⚠️ Частично |
| Лист ПВ оцинк. | ❌ НЕТ | ⚠️ Неправильная формула | ⚠️ Частично |
| Лист рифленый | ❌ НЕТ | - | ⚠️ Частично |
| Лист/рулон г/к | ❌ НЕТ | - | ❌ Неправильно |
| Лист/рулон окраш. | ❌ НЕТ | ❌ НЕТ | ❌ Неправильно |
| Лист/рулон оцинк. | ❌ НЕТ | ❌ НЕТ | ❌ Неправильно |
| Лист/рулон х/к | ❌ НЕТ | - | ❌ Неправильно |

---

## 🔧 ПЛАН ИСПРАВЛЕНИЯ

### Приоритет 1: Критические (4 типа)

**Типы:** sheet_hot, sheet_painted, sheet_galv, sheet_cold

**Действия:**
1. Добавить в базу данных 137 марок стали:
   ```json
   {
     "steelGrades": ["ст08", "ст0", "ст1", ..., "У12А"],
     "steelDensities": {
       "ст08": 7.871,
       "ст0": 7.85,
       "ст3": 7.85,
       ...
     }
   }
   ```

2. Для sheet_painted и sheet_galv добавить 27 вариантов оцинковки:
   ```json
   {
     "galvanization": ["нет", "21 г/м² ЭЦ 30/30", ...],
     "galvanizationWeights": {
       "нет": 0,
       "21 г/м² ЭЦ 30/30": 0.021,
       ...
     }
   }
   ```

3. После этого они автоматически начнут использовать правильную формулу (строка 210-255)

---

### Приоритет 2: Частичные (3 типа)

**Типы:** sheet_pv, sheet_pv_galv, sheet_checkered

**Для sheet_pv:**
- Добавить steelDensities
- Изменить формулу для использования переменной плотности

**Для sheet_pv_galv:**
- Добавить steelDensities
- Исправить формулу оцинковки: `coefficient * (1 + zincCoef)` → `coefficient * steelDensity + galvCoef`
- Изменить значения galvanizationWeights с долей на абсолютные

**Для sheet_checkered:**
- Уточнить нужна ли поддержка марок стали
- Если да — добавить steelDensities и изменить формулу

---

## 🧪 ТЕСТЫ ДЛЯ ПРОВЕРКИ

### Тест 1: Марка стали влияет на вес
```javascript
// Лист/рулон г/к, толщина 1мм, площадь 300м²
ст3 (7.85) → 2.355 т
ст45 (7.826) → 2.348 т
Разница: -0.007 т ✅
```

### Тест 2: Оцинковка влияет на вес
```javascript
// Лист/рулон оцинк., толщина 1мм, площадь 300м², сталь ст3
нет → 2.355 т
190 г/м² → 2.412 т
Разница: +0.057 т ✅
```

### Тест 3: Правильная формула оцинковки
```javascript
// Формула: (толщина × плотность + оцинковка) × площадь / 1000
(1 × 7.85 + 0.19) × 300 / 1000 = 2.412 т ✅

// НЕ: (толщина + оцинковка) × плотность × площадь / 1000
(1 + 0.19) × 7.85 × 300 / 1000 = 2.802 т ❌
```

---

## 📝 ВЫВОД

**Проблема:** Из 7 проверенных листовых типов:
- ✅ **1 работает правильно** (strip_tape_painted — уже исправлен)
- ⚠️ **3 работают частично** (sheet_pv, sheet_pv_galv, sheet_checkered)
- ❌ **4 НЕ работают** (sheet_hot, sheet_painted, sheet_galv, sheet_cold)

**Корневая причина:**
- Отсутствие steelDensities в базе данных
- Отсутствие galvanizationWeights для оцинкованных типов
- Использование константы STEEL_DENSITY = 7850 в formulas.js

**Решение:**
Добавить steelDensities и galvanizationWeights в базу данных для всех типов → они автоматически начнут использовать правильную формулу из строки 210-255!
