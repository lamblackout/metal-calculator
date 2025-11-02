// ==========================================
// Metal Calculator Bundle для Browser
// Версия: 1.0.0
// Собрано: 2025-11-02T15:34:53.101Z
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
  calculatePipeWeight,
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
    let weightPerMeter = calculateWeightPerMeter(metal, params.size);

    if (weightPerMeter === null) {
      return {
        success: false,
        error: `Размер '${params.size}' не найден для металла '${metal.name}'`,
        metalType: params.metalType,
        size: params.size
      };
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
      // Дано: вес → найти длину и штуки
      weight = params.weight;
      length = formulas.calculateLengthFromWeight(weight, weightPerMeter);
      pieces = standardLength ? formulas.calculatePiecesFromLength(length, standardLength) : null;
    } else if (params.length) {
      // Дано: длина → найти вес и штуки
      length = params.length;
      weight = weightPerMeter * length;
      pieces = standardLength ? formulas.calculatePiecesFromLength(length, standardLength) : null;
    } else if (params.pieces) {
      // Дано: штуки → найти длину и вес
      pieces = params.pieces;
      if (standardLength) {
        length = pieces * standardLength;
        weight = weightPerMeter * length;
      } else {
        return {
          success: false,
          error: `Для металла '${metal.name}' не указана стандартная длина, невозможно рассчитать по количеству штук`,
          metalType: params.metalType,
          size: params.size
        };
      }
    }

    // Сформировать результат
    const result = {
      success: true,
      metalType: metal.name,
      size: params.size,
      gost: metal.gost || 'Не указан',
      category: metal.category || 'Не указана',
      weightPerMeter: roundTo(weightPerMeter, 3),
      isGalvanized: isGalvanized
    };

    if (weight !== null) {
      result.weight = roundTo(weight, 2);
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

  // Для металлов с предрасчитанными весами (балка, швеллер, уголок и т.д.)
  if (formula === 'beam' || formula === 'channel' || formula === 'angle' ||
      formula === 'pipe' && metal.weights) {
    if (metal.weights && metal.weights[size] !== undefined) {
      return metal.weights[size];
    }
    // Если вес не найден в таблице, вернуть null
    return null;
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

  // Если есть массив стандартных длин, берем максимальную
  if (Array.isArray(metal.standardLengths)) {
    return Math.max(...metal.standardLengths);
  }

  return metal.standardLengths;
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
