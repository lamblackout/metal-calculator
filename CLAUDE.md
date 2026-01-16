# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
# Build bundles (CommonJS + Browser IIFE)
node build.js

# Run full test suite
node test.js

# Quick sanity check
node test-simple.js
```

Build outputs:
- `dist/calculator.bundle.js` — Node.js/n8n (CommonJS)
- `dist/calculator.browser.js` — Browser (IIFE, exposes `window.calculateMetal`)

## Architecture Overview

**Metal Calculator** — modular calculator for metal roll weights/lengths/quantities. Supports 76 metal types with 5,700+ sizes following GOST standards.

### Core Components

```
src/
├── formulas.js     # Pure math: 14 functions for weight/length calculations
└── calculator.js   # Business logic: calculateMetal() main function

database/
└── metals.json     # 76 metals, coefficients (weight per meter), GOST references

docs/               # GitHub Pages production deployment
├── calculator.html # Live UI
├── database/       # Production database (2.6 MB)
└── dist/           # Production bundles
```

### Data Flow

1. `calculateMetal(params, metalDatabase)` receives input (weight OR length OR pieces)
2. Looks up metal in database → gets `weightPerMeter` coefficient
3. Calculates pieces with `Math.ceil()` (always rounds UP)
4. Recalculates actual length/weight from rounded pieces
5. Returns structured result with `requested`, `actual`, and `difference`

### Key Database Schema

```javascript
{
  "armature_a3": {
    "name": "Арматура А3",
    "gost": "ГОСТ 5781-82",
    "formula": "circle",              // determines calc function
    "standardLengths": [6, 11.7, 12], // shipping lengths
    "coefficients": { "12": 0.888 }   // weight per meter by size
  }
}
```

## Critical Patterns

**Rounding Rule:** Always `Math.ceil()` for pieces — customer pays for whole units only.

**Result Structure:**
```javascript
{
  success: true,
  weightPerMeter: 0.888,
  weight: 0.893,      // actual (rounded to pieces)
  length: 1006.2,
  pieces: 86,
  requested: { value: 1000, unit: "length" },
  actual: { weight: 0.893, length: 1006.2, pieces: 86 },
  difference: { length: "+6.2 м" }
}
```

## Production Deployment

Files in `docs/` are served via GitHub Pages. After changes:
1. Run `node build.js`
2. Build script auto-copies to `docs/dist/`
3. Commit and push — GitHub Pages updates automatically

## n8n Integration

```javascript
// In n8n Code Node:
const db = await fetch('https://YOUR.github.io/metal-calculator/database/metals.json').then(r => r.json());
const result = calculateMetal({ metalType: 'armature_a3', size: 12, weight: 1 }, { metals: db });
```

## Related Project

`c:\Users\Skylake\msgnn-calculator\` — MSG Закупки frontend that uses this calculator library. Changes here may need syncing there.
