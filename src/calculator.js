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
    if (!params.weight && !params.length && !params.pieces && !params.area) {
      return {
        success: false,
        error: 'Укажите хотя бы один параметр: weight, length, pieces или area',
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
    } else if (metal.formula === 'sheet_pv') {
      // ✅ ЛИСТ ПВ - стандарты (ТУ) вместо марок стали
      // Формула: Вес (т) = coefficient × метры × 7.85 / 1000
      const sizeStr = String(params.size);
      const standards = metal.sizeStandards?.[sizeStr];

      if (!standards || standards.length === 0) {
        return {
          success: false,
          error: `Для размера ${sizeStr} листа ПВ нет доступных стандартов`,
          metalType: params.metalType,
          size: params.size
        };
      }

      // Берём первый стандарт или выбранный пользователем
      const selectedStandard = params.standard || standards[0].name;
      const standardData = standards.find(s => s.name === selectedStandard);

      if (!standardData) {
        return {
          success: false,
          error: `Стандарт ${selectedStandard} не найден для размера ${sizeStr}`,
          metalType: params.metalType,
          size: params.size
        };
      }

      const coefficient = standardData.coefficient;
      const steelDensity = 7.85; // фиксированная плотность

      // Вес 1 метра (кг) = coefficient × steelDensity
      weightPerMeter = coefficient * steelDensity;
    } else if (metal.formula === 'sheet_pv_galv') {
      // ✅ ЛИСТ ПВ ОЦИНК. - стандарты + оцинковка в долях
      // Формула: Вес (т) = coefficient × (1 + zincCoef) × метры × 7.85 / 1000
      const sizeStr = String(params.size);
      const standards = metal.sizeStandards?.[sizeStr];

      if (!standards || standards.length === 0) {
        return {
          success: false,
          error: `Для размера ${sizeStr} листа ПВ оцинк. нет доступных стандартов`,
          metalType: params.metalType,
          size: params.size
        };
      }

      // Берём первый стандарт или выбранный пользователем
      const selectedStandard = params.standard || standards[0].name;
      const standardData = standards.find(s => s.name === selectedStandard);

      if (!standardData) {
        return {
          success: false,
          error: `Стандарт ${selectedStandard} не найден`,
          metalType: params.metalType,
          size: params.size
        };
      }

      // Оцинковка в долях (0.021, 0.036 и т.д.)
      const zincOption = params.zincOption || 'нет';
      const zincCoef = metal.zincCoefficients?.[zincOption] || 0;

      const coefficient = standardData.coefficient;
      const steelDensity = 7.85;

      // Вес 1 метра (кг) = coefficient × (1 + zincCoef) × steelDensity
      weightPerMeter = coefficient * (1 + zincCoef) * steelDensity;
    } else if (metal.formula === 'sheet_checkered') {
      // ✅ ЛИСТ РИФЛЕНЫЙ - рифление вместо марок стали
      // Формула: Вес (т) = coefficient × кв.метры × riffleCoef / 1000
      const sizeStr = String(params.size);
      const sizeCoef = metal.weights?.[sizeStr];

      if (!sizeCoef) {
        return {
          success: false,
          error: `Размер ${sizeStr} не найден для листа рифленого`,
          metalType: params.metalType,
          size: params.size
        };
      }

      // Тип рифления
      const riffleType = params.riffleType || 'чечевица';
      const riffleCoef = metal.riffleCoefficients?.[riffleType];

      if (!riffleCoef) {
        return {
          success: false,
          error: `Тип рифления ${riffleType} не найден`,
          metalType: params.metalType,
          size: params.size
        };
      }

      // Вес 1 кв.метра (кг) = sizeCoef × riffleCoef
      weightPerMeter = sizeCoef * riffleCoef;
    } else if (metal.weights && metal.steelCoefficients) {
      // ✅ НОВАЯ ЛОГИКА ДЛЯ ТИПОВ С WEIGHTS И STEELCOEFFICIENTS (Круг, Лента, Лист и т.д.)
      // Формула: Вес (т) = calc_koef1 × метры × stal_koef / 1000
      // Вес 1 метра (кг) = calc_koef1 × stal_koef

      steelType = params.steelType || 'ст3'; // Дефолтная сталь - ст3

      const sizeCoef = metal.weights[String(params.size)];
      const steelCoef = metal.steelCoefficients[steelType];

      if (!sizeCoef) {
        return {
          success: false,
          error: `Размер '${params.size}' не найден для металла '${metal.name}'`,
          metalType: params.metalType,
          size: params.size
        };
      }

      if (!steelCoef) {
        return {
          success: false,
          error: `Марка стали '${steelType}' не найдена в базе данных для '${metal.name}'`,
          metalType: params.metalType,
          size: params.size,
          steelType: steelType
        };
      }

      // Вес 1 метра/кв.метра (в кг) = коэф_размера × коэф_стали
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

      // ✅ Округляем штуки (используем 1м по умолчанию если нет standardLength)
      const pieceLength = standardLength || 1;
      pieces = formulas.calculatePiecesFromLength(calculatedLength, pieceLength);

      // ✅ ПЕРЕСЧИТЫВАЕМ от округлённых штук
      length = pieces * pieceLength;  // Фактическая длина
      const actualWeightKg = weightPerMeter * length;
      weight = actualWeightKg / 1000;  // Фактический вес
    } else if (params.length) {
      // Дано: длина → найти вес и штуки
      const requestedLength = params.length;  // Сохраняем запрошенную длину

      // ✅ Округляем штуки (используем 1м по умолчанию если нет standardLength)
      const pieceLength = standardLength || 1;
      pieces = formulas.calculatePiecesFromLength(requestedLength, pieceLength);

      // ✅ ПЕРЕСЧИТЫВАЕМ от округлённых штук
      length = pieces * pieceLength;  // Фактическая длина
      const actualWeightKg = weightPerMeter * length;
      weight = actualWeightKg / 1000;  // Фактический вес
    } else if (params.pieces) {
      // Дано: штуки → найти длину и вес
      pieces = params.pieces;
      // ✅ ИСПРАВЛЕНИЕ: Если нет standardLength, используем 1 метр по умолчанию
      const pieceLength = standardLength || 1; // По умолчанию 1 метр
      length = pieces * pieceLength;
      // Рассчитываем вес в кг, затем конвертируем в тонны
      const weightInKg = weightPerMeter * length;
      weight = weightInKg / 1000;
    } else if (params.area) {
      // Дано: площадь (для листов рифленых) → найти вес
      // weightPerMeter здесь = вес 1 кв.метра в кг
      const area = params.area;
      const weightInKg = weightPerMeter * area;
      weight = weightInKg / 1000;
      // Для листов длина = площадь, штуки не применимы
      length = area;
      pieces = null;
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
    } else if (params.area) {
      requested.value = params.area;
      requested.unit = 'area';
      requested.label = `${params.area} м²`;
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

module.exports = {
  calculateMetal
};
