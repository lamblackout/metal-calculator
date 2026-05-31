const fs = require('fs');
const path = require('path');

console.log('🔨 Начинаю сборку bundle...\n');

// Читаем исходники
const formulasCode = fs.readFileSync(path.join(__dirname, 'src/formulas.js'), 'utf8');
const calculatorCode = fs.readFileSync(path.join(__dirname, 'src/calculator.js'), 'utf8');

// Обработка formulas.js
// Убираем module.exports в конце
const formulasClean = formulasCode
  .replace(/module\.exports\s*=\s*\{[^}]+\};?\s*$/m, '');

// Обработка calculator.js
// Убираем require в начале и module.exports в конце
const calculatorClean = calculatorCode
  .replace(/const\s+formulas\s*=\s*require\([^)]+\);?\s*/m, '')
  .replace(/module\.exports\s*=\s*\{[^}]+\};?\s*$/m, '');

// Общая часть кода (используется в обеих версиях)
const coreCode = `${formulasClean}

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

${calculatorClean}`;

// ============ NODE.JS VERSION ============
const nodeBundle = `// ==========================================
// Metal Calculator Bundle для Node.js
// Версия: 1.0.0
// Собрано: ${new Date().toISOString()}
// ==========================================

${coreCode}

// ============ ЭКСПОРТ ============
module.exports = {
  calculateMetal
};
`;

// ============ BROWSER VERSION (IIFE) ============
const browserBundle = `// ==========================================
// Metal Calculator Bundle для Browser
// Версия: 1.0.0
// Собрано: ${new Date().toISOString()}
// ==========================================

(function(window) {
  'use strict';

${coreCode}

  // ============ ЭКСПОРТ В WINDOW ============
  window.calculateMetal = calculateMetal;

})(window);
`;

// Создаем директории
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('docs/dist', { recursive: true });

// Сохраняем Node.js версию
fs.writeFileSync(path.join(__dirname, 'dist/calculator.bundle.js'), nodeBundle);
console.log('✅ Node.js bundle создан: dist/calculator.bundle.js');
console.log(`   📦 Размер: ${(nodeBundle.length / 1024).toFixed(2)} KB`);

// Сохраняем Browser версию
fs.writeFileSync(path.join(__dirname, 'dist/calculator.browser.js'), browserBundle);
console.log('✅ Browser bundle создан: dist/calculator.browser.js');
console.log(`   📦 Размер: ${(browserBundle.length / 1024).toFixed(2)} KB`);

// Копируем browser версию в docs/dist/
fs.writeFileSync(path.join(__dirname, 'docs/dist/calculator.browser.js'), browserBundle);
console.log('✅ Browser bundle скопирован: docs/dist/calculator.browser.js');
console.log('');

// Быстрый тест Node.js версии
try {
  const { calculateMetal } = require('./dist/calculator.bundle');
  console.log('✅ Node.js bundle валиден, экспорт работает');
  console.log(`   Тип calculateMetal: ${typeof calculateMetal}`);
} catch (error) {
  console.error('❌ Ошибка в Node.js bundle:', error.message);
  process.exit(1);
}
