// src/calculator.js
// Главный модуль калькулятора металлопроката

const formulas = require('./formulas');

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
      // Дано: вес (в тоннах) → найти длину и штуки
      weight = params.weight;
      // Конвертируем тонны в кг для расчета длины
      const weightInKg = weight * 1000;
      length = formulas.calculateLengthFromWeight(weightInKg, weightPerMeter);
      pieces = standardLength ? formulas.calculatePiecesFromLength(length, standardLength) : null;
    } else if (params.length) {
      // Дано: длина → найти вес и штуки
      length = params.length;
      // Рассчитываем вес в кг, затем конвертируем в тонны
      const weightInKg = weightPerMeter * length;
      weight = weightInKg / 1000;
      pieces = standardLength ? formulas.calculatePiecesFromLength(length, standardLength) : null;
    } else if (params.pieces) {
      // Дано: штуки → найти длину и вес
      pieces = params.pieces;
      if (standardLength) {
        length = pieces * standardLength;
        // Рассчитываем вес в кг, затем конвертируем в тонны
        const weightInKg = weightPerMeter * length;
        weight = weightInKg / 1000;
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
      result.weight = roundTo(weight, 3);
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
  if (metal.useKilograms && metal.weights) {
    const weightValue = metal.weights[String(size)];
    if (weightValue !== undefined && weightValue !== null) {
      return weightValue;
    }
    // Если вес не найден в таблице
    return null;
  }

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

module.exports = {
  calculateMetal
};
