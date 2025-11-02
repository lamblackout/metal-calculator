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

// Создаем bundle
const bundle = `// ==========================================
// Metal Calculator Bundle для n8n
// Версия: 1.0.0
// Собрано: ${new Date().toISOString()}
// ==========================================

${formulasClean}

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

${calculatorClean}

// ============ ЭКСПОРТ ============
module.exports = {
  calculateMetal
};
`;

// Сохраняем
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist/calculator.bundle.js'), bundle);

console.log('✅ Bundle создан: dist/calculator.bundle.js');
console.log(`📦 Размер: ${(bundle.length / 1024).toFixed(2)} KB`);
console.log('');

// Быстрый тест
try {
  const { calculateMetal } = require('./dist/calculator.bundle');
  console.log('✅ Bundle валиден, экспорт работает');
  console.log(`   Тип calculateMetal: ${typeof calculateMetal}`);
} catch (error) {
  console.error('❌ Ошибка в bundle:', error.message);
  process.exit(1);
}
