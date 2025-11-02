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

module.exports = {
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
