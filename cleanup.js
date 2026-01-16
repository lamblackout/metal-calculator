/**
 * Скрипт очистки проекта от временных и ненужных файлов
 * БЕЗОПАСНО удаляет только мусор, сохраняя важные файлы
 */

const fs = require('fs');
const path = require('path');

// Список файлов и директорий для СОХРАНЕНИЯ
const KEEP = [
  // Исходники и сборка
  'src', 'dist', 'docs', 'database',
  'build.js', 'test.js', 'test-simple.js',

  // Конфигурация
  'package.json', 'package-lock.json', '.gitignore',

  // Документация
  'README.md', 'CLAUDE.md',

  // Git и Claude
  '.git', '.claude',

  // Этот скрипт
  'cleanup.js',

  // Node modules (если есть)
  'node_modules'
];

// Паттерны файлов для удаления
const DELETE_PATTERNS = [
  // Временные директории Claude
  /^tmpclaude-.*-cwd$/,

  // Тестовые файлы (кроме основных)
  /^test-(?!simple\.js$|\.js$).+\.js$/,

  // Скрипты сбора/обработки данных
  /^(analyze|collect|extract|update|verify|add|fix|import|integrate|check)-.*\.js$/,

  // Собранные данные
  /^.*-data\.json$/,
  /^швеллер_гнутый.*\.json$/,
  /^channel-bent.*\.json$/,
  /^extracted-.*\.json$/,
  /^fasteners-.*\.json$/,

  // Скрипты для браузера
  /^Скрипт_.*\.txt$/,
  /^[А-Яа-я].*\.txt$/,

  // Отчёты и концепты (кроме основных)
  /^.*_REPORT\.md$/,
  /^.*_COMPLETE\.md$/,
  /^.*_PROGRESS\.md$/,
  /^.*_SUMMARY\.md$/,
  /^.*_STATUS\.md$/,
  /^.*_FIX.*\.md$/,
  /^.*CONCEPT.*\.md$/,
  /^metal-calculator-concept.*\.md$/,
  /^metal_validation.*\.md$/,
  /^metal_fields.*\.md$/,
  /^technical_specification\.md$/,
  /^part\.md$/,
  /^length-field-types\.md$/,
  /^PROMPT_.*\.md$/,
  /^[А-Яа-я].*\.md$/,

  // SQL/CSV/Excel файлы
  /.*\.sql$/,
  /.*\.csv$/,
  /.*\.xlsx$/,

  // Архивы
  /.*\.7z$/,
  /^sql_parts$/,

  // n8n workflows
  /^.*\.json$/,  // JSON файлы (кроме package.json и data)

  // Другое
  /^nul$/,
  /^web-calculator$/,
  /^tests$/
];

// Функция проверки - нужно ли сохранить файл
function shouldKeep(name) {
  // Если в списке сохранения - точно сохранить
  if (KEEP.includes(name)) return true;

  // Если package.json или в KEEP - сохранить
  if (name === 'package.json' || name === 'package-lock.json') return true;

  // Проверяем паттерны удаления
  for (const pattern of DELETE_PATTERNS) {
    if (pattern.test(name)) {
      // Дополнительная проверка для JSON - сохраняем package.json
      if (name.endsWith('.json') && (name === 'package.json' || name === 'package-lock.json')) {
        return true;
      }
      return false;
    }
  }

  return true;
}

// Основная функция очистки
function cleanup() {
  console.log('🧹 Начинаю очистку проекта...\n');

  const rootDir = __dirname;
  const items = fs.readdirSync(rootDir);

  let toDelete = [];
  let toKeep = [];

  // Анализируем файлы
  for (const item of items) {
    if (shouldKeep(item)) {
      toKeep.push(item);
    } else {
      toDelete.push(item);
    }
  }

  // Выводим что будет удалено
  console.log('📋 БУДЕТ УДАЛЕНО (' + toDelete.length + ' файлов/папок):\n');

  // Группируем по типу
  const groups = {
    'Временные директории Claude': toDelete.filter(f => f.startsWith('tmpclaude-')),
    'Тестовые файлы': toDelete.filter(f => f.startsWith('test-') && f.endsWith('.js')),
    'Скрипты обработки': toDelete.filter(f => /^(analyze|collect|extract|update|verify|add|fix|import|integrate|check)-/.test(f)),
    'Отчёты и концепты (.md)': toDelete.filter(f => f.endsWith('.md') && !['README.md', 'CLAUDE.md'].includes(f)),
    'Данные (.json)': toDelete.filter(f => f.endsWith('.json') && f !== 'package.json' && f !== 'package-lock.json'),
    'Скрипты браузера (.txt)': toDelete.filter(f => f.endsWith('.txt')),
    'SQL/CSV/Excel': toDelete.filter(f => /\.(sql|csv|xlsx)$/.test(f)),
    'Архивы и папки': toDelete.filter(f => /\.(7z)$/.test(f) || f === 'sql_parts' || f === 'web-calculator' || f === 'tests'),
    'Прочее': toDelete.filter(f => f === 'nul')
  };

  for (const [group, files] of Object.entries(groups)) {
    if (files.length > 0) {
      console.log(`  ${group} (${files.length}):`);
      files.slice(0, 5).forEach(f => console.log(`    - ${f}`));
      if (files.length > 5) {
        console.log(`    ... ещё ${files.length - 5} файлов`);
      }
      console.log();
    }
  }

  console.log('✅ БУДЕТ СОХРАНЕНО (' + toKeep.length + ' файлов/папок):');
  toKeep.forEach(f => console.log(`  ✓ ${f}`));
  console.log();

  console.log('⚠️  ВНИМАНИЕ! Удаление начнётся через 5 секунд...');
  console.log('   Нажмите Ctrl+C для отмены\n');

  setTimeout(() => {
    console.log('🗑️  Начинаю удаление...\n');

    let deletedCount = 0;
    let errorCount = 0;

    for (const item of toDelete) {
      const fullPath = path.join(rootDir, item);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`  🗂️  Удалена директория: ${item}`);
        } else {
          fs.unlinkSync(fullPath);
          console.log(`  📄 Удалён файл: ${item}`);
        }
        deletedCount++;
      } catch (err) {
        console.error(`  ❌ Ошибка при удалении ${item}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n✅ Готово!');
    console.log(`   Удалено: ${deletedCount}`);
    if (errorCount > 0) {
      console.log(`   Ошибок: ${errorCount}`);
    }
    console.log('\n📁 Структура проекта после очистки:');
    console.log('   src/          - исходный код');
    console.log('   dist/         - собранные бандлы');
    console.log('   docs/         - production deployment');
    console.log('   database/     - база данных металлов');
    console.log('   build.js      - скрипт сборки');
    console.log('   test.js       - основные тесты');
    console.log('   test-simple.js - быстрые тесты');
    console.log('   package.json  - конфигурация\n');

  }, 5000);
}

// Запуск
cleanup();
