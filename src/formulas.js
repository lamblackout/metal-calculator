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

module.exports = {
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
