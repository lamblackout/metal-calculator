// ==========================================
// Metal Calculator Bundle для Browser
// Версия: 1.0.0
// Собрано: 2025-11-05T13:13:51.962Z
// ==========================================

(function(window) {
  'use strict';

// src/formulas.js
// Формулы расчета металлопроката

const STEEL_DENSITY = 7850; // кг/м³

/**
 * Расчет веса круглого проката (арматура, круг)
 * @param {number} diameter - Диаметр в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateCircleWeight(diameter, length) {
  const radiusInMeters = (diameter / 2) / 1000;
  const areaInM2 = Math.PI * Math.pow(radiusInMeters, 2);
  return areaInM2 * length * STEEL_DENSITY;
}

/**
 * Расчет веса квадратного проката
 * @param {number} side - Сторона квадрата в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateSquareWeight(side, length) {
  const sideInMeters = side / 1000;
  const areaInM2 = Math.pow(sideInMeters, 2);
  return areaInM2 * length * STEEL_DENSITY;
}

/**
 * Расчет веса прямоугольного проката
 * @param {number} width - Ширина в мм
 * @param {number} height - Высота в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateRectangleWeight(width, height, length) {
  const widthInMeters = width / 1000;
  const heightInMeters = height / 1000;
  const areaInM2 = widthInMeters * heightInMeters;
  return areaInM2 * length * STEEL_DENSITY;
}

/**
 * Расчет веса листового металла
 * @param {number} width - Ширина в метрах
 * @param {number} length - Длина в метрах
 * @param {number} thickness - Толщина в мм
 * @returns {number} Вес в кг
 */
function calculateSheetWeight(width, length, thickness) {
  const thicknessInMeters = thickness / 1000;
  const volumeInM3 = width * length * thicknessInMeters;
  return volumeInM3 * STEEL_DENSITY;
}

/**
 * Расчет веса полосы
 * Формула: ширина × толщина × ρ × длина / 1000000
 * @param {number} width - Ширина в мм
 * @param {number} thickness - Толщина в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateStripWeight(width, thickness, length) {
  // Вес 1м = ширина × толщина × плотность / 1000000
  const weightPerMeter = width * thickness * STEEL_DENSITY / 1000000;
  return weightPerMeter * length;
}

/**
 * Расчет веса трубы
 * @param {number} outerDiameter - Наружный диаметр в мм
 * @param {number} wallThickness - Толщина стенки в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculatePipeWeight(outerDiameter, wallThickness, length) {
  const outerRadiusInMeters = (outerDiameter / 2) / 1000;
  const innerDiameter = outerDiameter - (2 * wallThickness);
  const innerRadiusInMeters = (innerDiameter / 2) / 1000;

  const outerArea = Math.PI * Math.pow(outerRadiusInMeters, 2);
  const innerArea = Math.PI * Math.pow(innerRadiusInMeters, 2);
  const crossSectionArea = outerArea - innerArea;

  return crossSectionArea * length * STEEL_DENSITY;
}

/**
 * Расчет веса ПНД трубы (пластик)
 * @param {number} outerDiameter - Наружный диаметр в мм
 * @param {number} wallThickness - Толщина стенки в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculatePNDPipeWeight(outerDiameter, wallThickness, length) {
  const PND_DENSITY = 950; // кг/м³ для ПНД
  const outerRadiusInMeters = (outerDiameter / 2) / 1000;
  const innerDiameter = outerDiameter - (2 * wallThickness);
  const innerRadiusInMeters = (innerDiameter / 2) / 1000;

  const outerArea = Math.PI * Math.pow(outerRadiusInMeters, 2);
  const innerArea = Math.PI * Math.pow(innerRadiusInMeters, 2);
  const crossSectionArea = outerArea - innerArea;

  return crossSectionArea * length * PND_DENSITY;
}

/**
 * Расчет веса квадратной трубы
 * Формула: ρ × 0.0157 × S × (2×A - 2.86×S) × L
 * @param {number} side - Сторона квадрата в мм
 * @param {number} wallThickness - Толщина стенки в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateSquarePipeWeight(side, wallThickness, length) {
  // Формула из ГОСТа для квадратных труб
  const weightPerMeter = STEEL_DENSITY / 1000 * 0.0157 * wallThickness * (2 * side - 2.86 * wallThickness);
  return weightPerMeter * length;
}

/**
 * Расчет веса овальной трубы
 * Используем упрощенную формулу через периметр
 * @param {number} width - Ширина в мм
 * @param {number} height - Высота в мм
 * @param {number} wallThickness - Толщина стенки в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateOvalPipeWeight(width, height, wallThickness, length) {
  // Приближенный периметр овала: π × (3×(a+b) - √((3a+b)×(a+3b)))
  // Упрощенная формула Рамануджана
  const a = width / 2;
  const b = height / 2;
  const perimeter = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

  // Вес = ρ × S × (P - 4×S) × L / 1000000
  const weightPerMeter = STEEL_DENSITY * wallThickness * (perimeter - 4 * wallThickness) / 1000000;
  return weightPerMeter * length;
}

/**
 * Расчет веса прямоугольной трубы
 * Формула: ρ × S × (perimeter - 4×S) × L / 1000000
 * @param {number} width - Ширина в мм
 * @param {number} height - Высота в мм
 * @param {number} wallThickness - Толщина стенки в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateRectangularPipeWeight(width, height, wallThickness, length) {
  const perimeter = 2 * (width + height);
  // Вес = ρ × S × (P - 4×S) × L / 1000000
  const weightPerMeter = STEEL_DENSITY * wallThickness * (perimeter - 4 * wallThickness) / 1000000;
  return weightPerMeter * length;
}

/**
 * Расчет веса уголка (равнополочного и неравнополочного)
 * Формула: ρ × толщина × (ширина1 + ширина2 - толщина) × L / 1000000
 * @param {number} side1 - Ширина первой полки в мм
 * @param {number} side2 - Ширина второй полки в мм
 * @param {number} thickness - Толщина в мм
 * @param {number} length - Длина в метрах
 * @returns {number} Вес в кг
 */
function calculateAngleWeight(side1, side2, thickness, length) {
  // Формула ГОСТ для уголков
  const weightPerMeter = STEEL_DENSITY * thickness * (side1 + side2 - thickness) / 1000000;
  return weightPerMeter * length;
}

/**
 * Добавить вес оцинковки
 * @param {number} baseWeight - Базовый вес в кг
 * @param {number} coefficient - Коэффициент оцинковки (0.03, 0.05, 0.07)
 * @returns {number} Вес с оцинковкой в кг
 */
function addGalvanization(baseWeight, coefficient) {
  return baseWeight * (1 + coefficient);
}

/**
 * Обратный расчет: из веса получить длину
 * @param {number} weight - Вес в кг
 * @param {number} weightPerMeter - Вес погонного метра в кг/м
 * @returns {number} Длина в метрах
 */
function calculateLengthFromWeight(weight, weightPerMeter) {
  if (weightPerMeter === 0) {
    throw new Error('Вес погонного метра не может быть равен нулю');
  }
  return weight / weightPerMeter;
}

/**
 * Расчет количества штук из длины
 * @param {number} length - Общая длина в метрах
 * @param {number} standardLength - Стандартная длина одной штуки в метрах
 * @returns {number} Количество штук (округлено вверх)
 */
function calculatePiecesFromLength(length, standardLength) {
  if (standardLength === 0) {
    throw new Error('Стандартная длина не может быть равна нулю');
  }
  return Math.ceil(length / standardLength);
}



// ============ СОЗДАЕМ ОБЪЕКТ FORMULAS ============
const formulas = {
  calculateCircleWeight,
  calculateSquareWeight,
  calculateRectangleWeight,
  calculateSheetWeight,
  calculateStripWeight,
  calculatePipeWeight,
  calculatePNDPipeWeight,
  calculateSquarePipeWeight,
  calculateOvalPipeWeight,
  calculateRectangularPipeWeight,
  calculateAngleWeight,
  addGalvanization,
  calculateLengthFromWeight,
  calculatePiecesFromLength,
  STEEL_DENSITY
};

// src/calculator.js
// Главный модуль калькулятора металлопроката

/**
 * Главная функция расчета металла
 * @param {Object} params - Параметры расчета
 * @param {Object} metalDatabase - База данных металлов
 * @returns {Object} Результат расчета или ошибка
 */
function calculateMetal(params, metalDatabase) {
  try {
    // Валидация входных параметров
    if (!params || typeof params !== 'object') {
      return {
        success: false,
        error: 'Параметры расчета должны быть объектом'
      };
    }

    if (!params.metalType) {
      return {
        success: false,
        error: 'Не указан тип металла (metalType)'
      };
    }

    if (!metalDatabase || !metalDatabase.metals) {
      return {
        success: false,
        error: 'База данных металлов не загружена'
      };
    }

    // Получить металл из базы данных
    const metal = metalDatabase.metals[params.metalType];
    if (!metal) {
      return {
        success: false,
        error: `Металл типа '${params.metalType}' не найден в базе данных`,
        metalType: params.metalType
      };
    }

    // Проверить размер
    if (params.size === undefined || params.size === null) {
      return {
        success: false,
        error: 'Не указан размер металла (size)',
        metalType: params.metalType
      };
    }

    // Проверить наличие хотя бы одного параметра для расчета
    if (!params.weight && !params.length && !params.pieces) {
      return {
        success: false,
        error: 'Укажите хотя бы один параметр: weight, length или pieces',
        metalType: params.metalType,
        size: params.size
      };
    }

    // Рассчитать вес 1 метра (базовый)
    let weightPerMeter = null;
    let steelType = null;

    // ✅ СПЕЦИАЛЬНАЯ ЛОГИКА ДЛЯ КАТАНКИ (formula === 'katanka')
    if (metal.formula === 'katanka') {
      // Для катанки вес зависит от размера И марки стали
      steelType = params.steelType || 'ст3'; // Дефолтная сталь - ст3

      const sizeCoef = metal.coefficients ? metal.coefficients[String(params.size)] : null;
      const steelCoef = metal.steelCoefficients ? metal.steelCoefficients[steelType] : null;

      if (!sizeCoef) {
        return {
          success: false,
          error: `Размер '${params.size}' не найден для катанки`,
          metalType: params.metalType,
          size: params.size
        };
      }

      if (!steelCoef) {
        return {
          success: false,
          error: `Марка стали '${steelType}' не найдена в базе данных`,
          metalType: params.metalType,
          size: params.size,
          steelType: steelType
        };
      }

      // Вес 1 метра (в кг) = коэф_размера × коэф_стали
      // Коэффициенты уже в т/м³, поэтому результат будет в кг/м
      weightPerMeter = sizeCoef * steelCoef;
    } else {
      // Для всех остальных металлов используем стандартную логику
      weightPerMeter = calculateWeightPerMeter(metal, params.size);

      if (weightPerMeter === null) {
        return {
          success: false,
          error: `Размер '${params.size}' не найден для металла '${metal.name}'`,
          metalType: params.metalType,
          size: params.size
        };
      }
    }

    // Применить оцинковку если указано
    const isGalvanized = params.isGalvanized || false;
    if (isGalvanized && params.galvCoef) {
      weightPerMeter = formulas.addGalvanization(weightPerMeter, params.galvCoef);
    }

    // Получить стандартную длину
    const standardLength = getStandardLength(metal);

    // Выполнить расчет в зависимости от входных параметров
    let weight = null;
    let length = null;
    let pieces = null;

    if (params.weight) {
      // Дано: вес (в тоннах) → найти длину и штуки
      const requestedWeight = params.weight;  // Сохраняем запрошенный вес
      const weightInKg = requestedWeight * 1000;
      const calculatedLength = formulas.calculateLengthFromWeight(weightInKg, weightPerMeter);

      // Округляем штуки
      pieces = standardLength ? formulas.calculatePiecesFromLength(calculatedLength, standardLength) : null;

      // ✅ ПЕРЕСЧИТЫВАЕМ от округлённых штук
      if (pieces !== null && standardLength) {
        length = pieces * standardLength;  // Фактическая длина
        const actualWeightKg = weightPerMeter * length;
        weight = actualWeightKg / 1000;  // Фактический вес
      } else {
        // Если нет стандартной длины - оставляем как было
        length = calculatedLength;
        weight = requestedWeight;
      }
    } else if (params.length) {
      // Дано: длина → найти вес и штуки
      const requestedLength = params.length;  // Сохраняем запрошенную длину

      // Округляем штуки
      pieces = standardLength ? formulas.calculatePiecesFromLength(requestedLength, standardLength) : null;

      // ✅ ПЕРЕСЧИТЫВАЕМ от округлённых штук
      if (pieces !== null && standardLength) {
        length = pieces * standardLength;  // Фактическая длина
        const actualWeightKg = weightPerMeter * length;
        weight = actualWeightKg / 1000;  // Фактический вес
      } else {
        // Если нет стандартной длины - оставляем как было
        length = requestedLength;
        const weightInKg = weightPerMeter * length;
        weight = weightInKg / 1000;
      }
    } else if (params.pieces) {
      // Дано: штуки → найти длину и вес
      pieces = params.pieces;
      // ✅ ИСПРАВЛЕНИЕ: Если нет standardLength, используем 1 метр по умолчанию
      const pieceLength = standardLength || 1; // По умолчанию 1 метр
      length = pieces * pieceLength;
      // Рассчитываем вес в кг, затем конвертируем в тонны
      const weightInKg = weightPerMeter * length;
      weight = weightInKg / 1000;
    }

    // ✅ ОПРЕДЕЛИТЬ ЧТО БЫЛО ЗАПРОШЕНО
    const requested = {};
    if (params.weight) {
      requested.value = params.weight;
      requested.unit = 'weight';
      requested.label = `${params.weight} т`;
    } else if (params.length) {
      requested.value = params.length;
      requested.unit = 'length';
      requested.label = `${params.length} м`;
    } else if (params.pieces) {
      requested.value = params.pieces;
      requested.unit = 'pieces';
      requested.label = `${params.pieces} шт`;
    }

    // ✅ РАССЧИТАТЬ РАЗНИЦУ (только если было округление)
    const difference = {};
    if (params.weight && weight !== null) {
      const diff = (weight - params.weight) * 1000; // в кг
      if (diff > 0.01) { // Если разница больше 10 грамм
        difference.weight = `+${diff.toFixed(1)} кг`;
      }
    }
    if (params.length && length !== null) {
      const diff = length - params.length;
      if (diff > 0.01) { // Если разница больше 1см
        difference.length = `+${diff.toFixed(1)} м`;
      }
    }

    // Сформировать результат
    const result = {
      success: true,
      metalType: metal.name,
      size: params.size,
      gost: metal.gost || 'Не указан',
      category: metal.category || 'Не указана',

      // ✅ Запрошенные значения
      requested: requested,

      // ✅ Фактические значения (кратно штукам)
      actual: {
        weight: weight !== null ? roundTo(weight, metal.category === 'Крепеж' ? 6 : 3) : null,
        length: length !== null ? roundTo(length, 2) : null,
        pieces: pieces
      },

      // ✅ Разница
      difference: Object.keys(difference).length > 0 ? difference : null,

      // Дополнительная информация
      weightPerMeter: roundTo(weightPerMeter, metal.category === 'Крепеж' ? 6 : 3),
      standardLength: standardLength,
      isGalvanized: isGalvanized
    };

    // Для катанки добавить информацию о марке стали
    if (metal.formula === 'katanka' && steelType) {
      result.steelType = steelType;
    }

    // ⚠️ ОБРАТНАЯ СОВМЕСТИМОСТЬ: Дублируем weight/length/pieces в корень
    // (для старого кода который ожидает result.weight напрямую)
    if (weight !== null) {
      result.weight = roundTo(weight, metal.category === 'Крепеж' ? 6 : 3);
    }
    if (length !== null) {
      result.length = roundTo(length, 2);
    }
    if (pieces !== null) {
      result.pieces = pieces;
    }

    return result;

  } catch (error) {
    return {
      success: false,
      error: `Ошибка при расчете: ${error.message}`,
      metalType: params.metalType,
      size: params.size
    };
  }
}

/**
 * Рассчитать вес 1 метра металла
 * @param {Object} metal - Объект металла из базы данных
 * @param {number|string} size - Размер
 * @returns {number|null} Вес 1 метра в кг или null если размер не найден
 */
function calculateWeightPerMeter(metal, size) {
  const formula = metal.formula;

  // ✅ НОВАЯ ЛОГИКА: Для канатов с useKilograms - использовать таблицу весов напрямую
  if (metal.useKilograms && metal.weights && !metal.perThousand) {
    const weightValue = metal.weights[String(size)];
    if (weightValue !== undefined && weightValue !== null) {
      return weightValue;
    }
    // Если вес не найден в таблице
    return null;
  }

  // ✅ КРЕПЁЖ (metiz): Вес на 1000 штук
  if (metal.formula === 'metiz' && metal.perThousand && metal.weights) {
    const weightPer1000 = metal.weights[String(size)];
    if (weightPer1000 !== undefined && weightPer1000 !== null) {
      // Возвращаем вес одной штуки в кг
      return weightPer1000 / 1000;
    }
    return null;
  }

  // Для металлов с предрасчитанными весами (балка, швеллер и т.д.)
  if (formula === 'beam' || formula === 'channel' || (formula === 'pipe' && metal.weights)) {
    if (metal.weights && metal.weights[size] !== undefined) {
      return metal.weights[size];
    }
    // Если вес не найден в таблице, вернуть null
    return null;
  }

  // ✅ ТРУБЫ И УГОЛКИ: Размер - это массив
  if (formula === 'pipe' || formula === 'pipe_pnd' || formula === 'pipe_square' ||
      formula === 'pipe_oval' || formula === 'pipe_rect' || formula === 'angle') {

    // Размер должен быть массивом
    if (!Array.isArray(size)) {
      return null;
    }

    // Проверить, что размер присутствует в списке доступных размеров
    if (metal.sizes) {
      let found = false;
      for (const s of metal.sizes) {
        if (Array.isArray(s) && s.length === size.length &&
            s.every((val, idx) => val === size[idx])) {
          found = true;
          break;
        }
      }
      if (!found) {
        return null;
      }
    }

    // Обработать разные типы труб и уголков
    switch (formula) {
      case 'pipe':
        // Круглая стальная труба: [diameter, thickness]
        if (size.length !== 2) return null;
        return formulas.calculatePipeWeight(size[0], size[1], 1);

      case 'pipe_pnd':
        // ПНД труба (пластик): [diameter, thickness]
        if (size.length !== 2) return null;
        return formulas.calculatePNDPipeWeight(size[0], size[1], 1);

      case 'pipe_square':
        // Квадратная труба: [side, side, thickness] или [side, thickness]
        if (size.length === 3) {
          return formulas.calculateSquarePipeWeight(size[0], size[2], 1);
        } else if (size.length === 2) {
          return formulas.calculateSquarePipeWeight(size[0], size[1], 1);
        }
        return null;

      case 'pipe_oval':
        // Овальная труба: [width, height, thickness]
        if (size.length !== 3) return null;
        return formulas.calculateOvalPipeWeight(size[0], size[1], size[2], 1);

      case 'pipe_rect':
        // Прямоугольная труба: [width, height, thickness]
        if (size.length !== 3) return null;
        return formulas.calculateRectangularPipeWeight(size[0], size[1], size[2], 1);

      case 'angle':
        // Уголок: [ширина1, ширина2, толщина]
        if (size.length !== 3) return null;
        return formulas.calculateAngleWeight(size[0], size[1], size[2], 1);

      default:
        return null;
    }
  }

  // ✅ ЛИСТЫ И ПОЛОСЫ: Размер - это массив [ширина, толщина]
  if (formula === 'sheet' || formula === 'strip') {
    // Размер должен быть массивом
    if (!Array.isArray(size)) {
      return null;
    }

    // Должно быть ровно 2 элемента: [ширина, толщина]
    if (size.length !== 2) {
      return null;
    }

    const width = parseFloat(size[0]);
    const thickness = parseFloat(size[1]);

    if (isNaN(width) || isNaN(thickness)) {
      return null;
    }

    // Обработать разные типы листов и полос
    switch (formula) {
      case 'sheet':
        // Лист: [ширина_мм, толщина_мм]
        // calculateSheetWeight ожидает (ширина_м, длина_м, толщина_мм)
        // Для веса 1м передаём длину = 1
        return formulas.calculateSheetWeight(width / 1000, 1, thickness);

      case 'strip':
        // Полоса: [ширина_мм, толщина_мм]
        // calculateStripWeight ожидает (ширина_мм, толщина_мм, длина_м)
        // Для веса 1м передаём длину = 1
        return formulas.calculateStripWeight(width, thickness, 1);

      default:
        return null;
    }
  }

  // Проверить, что размер является числом для формульных расчетов
  const sizeNum = parseFloat(size);
  if (isNaN(sizeNum)) {
    return null;
  }

  // Проверить, что размер присутствует в списке доступных размеров
  if (metal.sizes && !metal.sizes.includes(size) && !metal.sizes.includes(sizeNum)) {
    return null;
  }

  // Для металлов с формульным расчетом
  switch (formula) {
    case 'circle':
      // Круглый прокат (арматура, круг, катанка)
      return formulas.calculateCircleWeight(sizeNum, 1);

    case 'square':
      // Квадратный прокат
      return formulas.calculateSquareWeight(sizeNum, 1);

    case 'rectangle':
      // Прямоугольный прокат
      // Для прямоугольника размер должен быть в формате "ширина×высота"
      // Но так как в базе это не указано, просто вернем null
      return null;

    case 'sheet':
      // Листовой металл - расчет за 1 м²
      // Возвращаем вес 1м × 1м × толщина
      return formulas.calculateSheetWeight(1, 1, sizeNum);

    case 'hexagon':
      // Шестигранник - используем формулу для шестиугольника
      // Площадь шестиугольника = (3√3/2) × a²
      // где a - сторона (можно приблизить через диаметр)
      const hexArea = (3 * Math.sqrt(3) / 2) * Math.pow(sizeNum / 1000, 2);
      return hexArea * 1 * formulas.STEEL_DENSITY;

    case 'rope':
      // Канат - специальная формула
      // Примерный вес каната в кг/м ≈ d² / 1000 (где d в мм)
      return Math.pow(sizeNum, 2) / 1000;

    default:
      throw new Error(`Неизвестная формула расчета: '${formula}'`);
  }
}

/**
 * Получить стандартную длину металла
 * @param {Object} metal - Объект металла из базы данных
 * @returns {number|null} Стандартная длина в метрах или null
 */
function getStandardLength(metal) {
  if (!metal.standardLengths || metal.standardLengths.length === 0) {
    return null;
  }

  // Если не массив - возвращаем как есть
  if (!Array.isArray(metal.standardLengths)) {
    return metal.standardLengths;
  }

  // ✅ СПЕЦИАЛЬНАЯ ЛОГИКА: Приоритет 11.7м (стандарт для арматуры с завода)
  // Заказчик сказал: "11.7 - разу с производства выходят"
  if (metal.standardLengths.includes(11.7)) {
    return 11.7;
  }

  // Для остальных металлов берём максимальную длину
  return Math.max(...metal.standardLengths);
}

/**
 * Округлить число до указанного количества знаков после запятой
 * @param {number} value - Значение
 * @param {number} decimals - Количество знаков после запятой
 * @returns {number} Округленное значение
 */
function roundTo(value, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}



  // ============ ЭКСПОРТ В WINDOW ============
  window.MetalCalculator = {
    calculateMetal: calculateMetal
  };

})(window);
