// ==========================================
// Metal Calculator Bundle для Node.js
// Версия: 1.0.0
// Собрано: 2025-11-12T16:51:01.638Z
// ==========================================

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

    // ✅ ОБРАБОТКА ШИРИНЫ × ДЛИНЫ ДЛЯ ЛИСТОВЫХ МЕТАЛЛОВ
    // Если заданы width и lengthSheet - рассчитать area ПЕРЕД валидацией
    if (params.width && params.lengthSheet && !params.area) {
      params.area = params.width * params.lengthSheet;
      console.log(`📏 Рассчитана площадь из ширины × длины: ${params.width} × ${params.lengthSheet} = ${params.area} м²`);
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
      // Поддержка обоих вариантов названий полей
      const steelCoefs = metal.steelDensities || metal.steelCoefficients;
      const steelCoef = steelCoefs ? steelCoefs[steelType] : null;

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
      // Поддержка обоих вариантов названий полей
      const zincCoefs = metal.galvanizationWeights || metal.zincCoefficients;
      const zincCoef = zincCoefs?.[zincOption] || 0;

      const coefficient = standardData.coefficient;
      const steelDensity = 7.85;

      // Вес 1 метра (кг) = coefficient × (1 + zincCoef) × steelDensity
      weightPerMeter = coefficient * (1 + zincCoef) * steelDensity;
    } else if (metal.formula === 'sheet_checkered') {
      // ✅ ЛИСТ РИФЛЕНЫЙ - используем таблицу весов в зависимости от толщины и типа рифления
      // Формула: Вес (т) = вес_1м² × площадь_м² / 1000
      const sizeStr = String(params.size);
      const riffleType = params.riffleType || 'чечевица';

      // Получаем вес 1 м² из таблицы
      const weightPerM2 = metal.riffleWeightsPerM2?.[sizeStr]?.[riffleType];

      if (!weightPerM2) {
        return {
          success: false,
          error: `Не найден вес для размера ${sizeStr} мм и рифления "${riffleType}"`,
          metalType: params.metalType,
          size: params.size,
          riffleType: riffleType
        };
      }

      // Вес 1 кв.метра (кг) напрямую из таблицы
      weightPerMeter = weightPerM2;
    } else if (metal.weights && (metal.steelDensities || metal.steelCoefficients)) {
      // ✅ НОВАЯ ЛОГИКА ДЛЯ ТИПОВ С WEIGHTS И STEELCOEFFICIENTS (Круг, Лента, Лист и т.д.)
      // Формула для площадных с оцинковкой: Вес (т) = (calc_koef1 + calc_ocink_koef1) × м² × stal_koef / 1000
      // Формула для линейных: Вес (т) = calc_koef1 × метры × stal_koef / 1000

      steelType = params.steelType || 'ст3'; // Дефолтная сталь - ст3

      const sizeCoef = metal.weights[String(params.size)];
      // Поддержка обоих вариантов названий полей
      const steelCoefs = metal.steelDensities || metal.steelCoefficients;
      const steelCoef = steelCoefs[steelType];

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

      // Получить коэффициент оцинковки (если есть)
      let galvCoef = 0;
      if (params.zincOption && metal.galvanizationWeights) {
        const galvWeights = metal.galvanizationWeights;
        galvCoef = galvWeights[params.zincOption] || 0;
        console.log(`  🔧 Оцинковка "${params.zincOption}": ${galvCoef} кг/м²`);
      }

      // ✅ ПРАВИЛЬНАЯ ФОРМУЛА: (sizeCoef × steelCoef + galvCoef)
      // sizeCoef = толщина в мм (например, 1)
      // steelCoef = плотность стали в г/см³ (например, 7.85)
      // galvCoef = вес оцинковки в кг/м² (например, 0.19)
      // Результат: вес 1 м² в кг = (1 × 7.85 + 0.19) = 8.04 кг/м²
      // Для площади: вес = (толщина × плотность + оцинковка) × площадь / 1000
      weightPerMeter = sizeCoef * steelCoef + galvCoef;
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

    // ПРИМЕЧАНИЕ: Оцинковка для типов с weights и steelDensities учитывается
    // в формуле выше (строка 251). Для остальных типов используется старая
    // логика через params.galvCoef (если будет нужна).
    const isGalvanized = params.zincOption && params.zincOption !== 'нет' ? true : false;

    // Получить стандартную длину
    const standardLength = getStandardLength(metal);

    // ✅ ОПРЕДЕЛИТЬ ТИП: КРЕПЕЖ, ЛИНЕЙНЫЙ ИЛИ ПЛОЩАДНОЙ

    // Крепежи: вес ↔ количество штук (БЕЗ длины)
    const fastenerTypes = [
      'bolt', 'screw', 'nut', 'nail', 'selftapping',
      'washer', 'stud', 'cotter', 'woodscrew'
    ];
    const isFastener = fastenerTypes.includes(params.metalType);

    // Площадные типы: только листы и ленты (имеют ширину × длину)
    const areaTypes = [
      'strip_tape', 'strip_tape_painted', 'strip_tape_galv',
      'sheet_hot', 'sheet_painted', 'sheet_galv', 'sheet_cold',
      'sheet_pv', 'sheet_pv_galv', 'sheet_checkered'
    ];

    // Все остальные - линейные (прутки, трубы, уголки, арматура и т.д.)
    const isLinearType = !areaTypes.includes(params.metalType) && !isFastener;

    // Выполнить расчет в зависимости от входных параметров
    let weight = null;
    let length = null;  // Для линейных: метры, для площадных: кв.метры
    let pieces = null;

    if (params.weight) {
      // Дано: вес (в тоннах) → найти длину/площадь и штуки
      const requestedWeight = params.weight;
      const weightInKg = requestedWeight * 1000;

      if (isFastener) {
        // ✅ КРЕПЕЖ: вес → количество штук (БЕЗ длины)
        // Для крепежей weightPerMeter = вес 1 штуки (в кг)
        const weightPerPiece = weightPerMeter;  // кг
        const calculatedPieces = weightInKg / weightPerPiece;

        // Округляем до целого (математическое округление)
        pieces = Math.round(calculatedPieces);

        // Пересчитываем вес под округлённое количество
        const actualWeightKg = pieces * weightPerPiece;
        weight = actualWeightKg / 1000;  // в тоннах

        // Для крепежей length остаётся null
        length = null;

        console.log(`🔩 Крепёж: ${weightInKg.toFixed(2)} кг → ${pieces} шт (вес 1шт: ${weightPerPiece.toFixed(6)} кг)`);

      } else {
        // Для линейных и площадных типов
        const calculated = formulas.calculateLengthFromWeight(weightInKg, weightPerMeter);

        if (isLinearType) {
        // ✅ ЛИНЕЙНЫЙ ТИП: метры / длина_1_шт
        length = calculated;  // Это метры (ДО округления)

        // Рассчитать количество штук ТОЛЬКО если есть lengthSheet
        if (params.lengthSheet && params.lengthSheet > 0) {
          pieces = Math.ceil(length / params.lengthSheet);
          // ⚠️ ОКРУГЛИЛИ ШТУКИ → пересчитать метры и тонны под округлённые штуки
          length = pieces * params.lengthSheet;
          console.log(`📐 Округление (линейный): ${calculated.toFixed(2)} м → ${pieces} шт × ${params.lengthSheet} м = ${length.toFixed(2)} м`);
        } else if (standardLength) {
          // Используем стандартную длину если нет lengthSheet
          pieces = Math.ceil(length / standardLength);
          // ⚠️ ОКРУГЛИЛИ ШТУКИ → пересчитать метры и тонны
          length = pieces * standardLength;
          console.log(`📐 Округление (линейный, станд.): ${calculated.toFixed(2)} м → ${pieces} шт × ${standardLength} м = ${length.toFixed(2)} м`);
        }
        // Если нет ни lengthSheet ни standardLength - pieces остается null
      } else {
        // ✅ ПЛОЩАДНОЙ ТИП: кв.метры / (ширина × длина)
        length = calculated;  // Это кв.метры (ДО округления)

        // Рассчитать количество штук ТОЛЬКО если есть width И lengthSheet
        if (params.width && params.width > 0 &&
            params.lengthSheet && params.lengthSheet > 0) {
          const areaPerPiece = params.width * params.lengthSheet;
          pieces = Math.ceil(length / areaPerPiece);
          // ⚠️ ОКРУГЛИЛИ ШТУКИ → пересчитать площадь и тонны под округлённые штуки
          length = pieces * areaPerPiece;
          console.log(`📐 Округление (площадной): ${calculated.toFixed(2)} м² → ${pieces} шт × ${areaPerPiece.toFixed(2)} м² = ${length.toFixed(2)} м²`);
        }
        // Если нет width или lengthSheet - pieces остается null
      }

      // Пересчитываем вес ИЗ ОКРУГЛЁННОЙ длины/площади
      const actualWeightKg = weightPerMeter * length;
      weight = actualWeightKg / 1000;
      }

    } else if (params.length) {
      // Дано: длина/площадь → найти вес и штуки
      const requestedLength = params.length;
      length = requestedLength;  // ДО округления

      if (isLinearType) {
        // ✅ ЛИНЕЙНЫЙ ТИП
        if (params.lengthSheet && params.lengthSheet > 0) {
          pieces = Math.ceil(length / params.lengthSheet);
          // ⚠️ ОКРУГЛИЛИ ШТУКИ → пересчитать метры и тонны
          length = pieces * params.lengthSheet;
          console.log(`📐 Округление (линейный, from length): ${requestedLength.toFixed(2)} м → ${pieces} шт × ${params.lengthSheet} м = ${length.toFixed(2)} м`);
        } else if (standardLength) {
          pieces = Math.ceil(length / standardLength);
          // ⚠️ ОКРУГЛИЛИ ШТУКИ → пересчитать метры и тонны
          length = pieces * standardLength;
          console.log(`📐 Округление (линейный, станд., from length): ${requestedLength.toFixed(2)} м → ${pieces} шт × ${standardLength} м = ${length.toFixed(2)} м`);
        }
      } else {
        // ✅ ПЛОЩАДНОЙ ТИП
        if (params.width && params.width > 0 &&
            params.lengthSheet && params.lengthSheet > 0) {
          const areaPerPiece = params.width * params.lengthSheet;
          pieces = Math.ceil(length / areaPerPiece);
          // ⚠️ ОКРУГЛИЛИ ШТУКИ → пересчитать площадь и тонны
          length = pieces * areaPerPiece;
          console.log(`📐 Округление (площадной, from length): ${requestedLength.toFixed(2)} м² → ${pieces} шт × ${areaPerPiece.toFixed(2)} м² = ${length.toFixed(2)} м²`);
        }
      }

      // Пересчитываем вес ИЗ ОКРУГЛЁННОЙ длины/площади
      const actualWeightKg = weightPerMeter * length;
      weight = actualWeightKg / 1000;

    } else if (params.pieces) {
      // Дано: штуки → найти длину/площадь и вес
      pieces = params.pieces;

      if (isFastener) {
        // ✅ КРЕПЕЖ: количество штук → вес (БЕЗ длины)
        const weightPerPiece = weightPerMeter;  // кг
        const weightInKg = pieces * weightPerPiece;
        weight = weightInKg / 1000;  // в тоннах
        length = null;  // Для крепежей length остаётся null

        console.log(`🔩 Крепёж: ${pieces} шт → ${weightInKg.toFixed(2)} кг (вес 1шт: ${weightPerPiece.toFixed(6)} кг)`);

      } else if (isLinearType) {
        // ✅ ЛИНЕЙНЫЙ ТИП: метры = штуки × длина_1_шт
        const pieceLength = params.lengthSheet || standardLength || 1;
        length = pieces * pieceLength;

        const weightInKg = weightPerMeter * length;
        weight = weightInKg / 1000;
      } else {
        // ✅ ПЛОЩАДНОЙ ТИП: кв.метры = штуки × (ширина × длина)
        if (params.width && params.width > 0 &&
            params.lengthSheet && params.lengthSheet > 0) {
          const areaPerPiece = params.width * params.lengthSheet;
          length = pieces * areaPerPiece;
        } else {
          // Если нет размеров 1 штуки - используем 1 кв.м по умолчанию
          length = pieces;
        }

        const weightInKg = weightPerMeter * length;
        weight = weightInKg / 1000;
      }

    } else if (params.area) {
      // Дано: площадь (специальный случай) → найти вес
      // weightPerMeter здесь = вес 1 кв.метра в кг
      const requestedArea = params.area;
      length = requestedArea;  // ДО округления

      // Рассчитать pieces для площадного типа
      if (!isLinearType && params.width && params.width > 0 &&
          params.lengthSheet && params.lengthSheet > 0) {
        const areaPerPiece = params.width * params.lengthSheet;
        pieces = Math.ceil(length / areaPerPiece);
        // ⚠️ ОКРУГЛИЛИ ШТУКИ → пересчитать площадь и тонны
        length = pieces * areaPerPiece;
        console.log(`📐 Округление (площадной, from area): ${requestedArea.toFixed(2)} м² → ${pieces} шт × ${areaPerPiece.toFixed(2)} м² = ${length.toFixed(2)} м²`);
      } else {
        pieces = null;
      }

      // Пересчитываем вес ИЗ ОКРУГЛЁННОЙ площади
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
      gost: metal.gosts?.all || metal.gost || 'Не указан',
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



// ============ ЭКСПОРТ ============
module.exports = {
  calculateMetal
};
