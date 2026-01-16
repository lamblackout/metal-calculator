#!/usr/bin/env python3
"""
!:@8?B 703@C7:8 @07<5@>2 <5B0;;>?@>:0B0 87 metals.json
5=5@8@C5B SQL-D09; 4;O 8<?>@B0 2 Supabase
"""

import requests
import re
import json
from datetime import datetime
from typing import Tuple, Optional, List, Dict, Any

# === $# &/ ===
METALS_JSON_URL = 'https://lamblackout.github.io/metal-calculator/database/metals.json'

# 0B53>@88 <5B0;;0 ?> ?@5D8:AC metal_key
CATEGORY_MAP = {
    'armature': 'armature',
    'tryba': 'pipe',
    'sheet': 'sheet',
    'plate': 'sheet',
    'rope': 'rope',
    'wire': 'wire',
    'katanka': 'wire',
    'beam': 'profile',
    'shveller': 'profile',
    'ygolok': 'profile',
    'circle': 'profile',
    'square': 'profile',
    'strip': 'profile',
    'bulb': 'profile',
    'shestigrannik': 'profile',
    'rels': 'profile',
    'sytynka': 'profile',
    'shpynt': 'profile',
    'profnastil': 'sheet',
    'bolt': 'fastener',
    'screw': 'fastener',
    'nail': 'fastener',
    'nut': 'fastener',
    'washer': 'fastener',
    'selftapping': 'fastener',
    'cotter': 'fastener',
    'woodscrew': 'fastener',
    'stud': 'fastener',
    'metiz': 'fastener',
}


def normalize_size(size: str) -> str:
    """
    >@<0;87C5B @07<5@ 4;O 548=>>1@07=>3> ?>8A:0.
     "': >;6=0 1KBL "' JavaScript 25@A88 2 n8n!
    """
    size = str(size).strip()
    size = size.lower()
    # A5 20@80=BK @0745;8B5;59 -> :8@8;;8G5A:0O E
    size = re.sub(r'[×xX*]', 'E', size)
    # 0?OB0O -> B>G:0
    size = size.replace(',', '.')
    # #1@0BL ?@>15;K
    size = re.sub(r'\s+', '', size)
    return size


def extract_dimensions(size: str) -> Tuple[Optional[float], Optional[float], Optional[float]]:
    """
    72;5:05B 4> 3 G8A;>2KE :><?>=5=B>2 87 @07<5@0.

    @8<5@K:
    - "80×80×3" -> (80.0, 80.0, 3.0)
    - "57×3.5" -> (57.0, 3.5, None)
    - "12" -> (12.0, None, None)
    - "10#" -> (10.0, None, None)
    """
    # I5< 2A5 G8A;0 (F5;K5 8 4@>1=K5)
    numbers = re.findall(r'\d+(?:[.,]\d+)?', str(size))

    # >=25@B8@C5< 2 float
    floats: List[Optional[float]] = []
    for num in numbers[:3]:  # 0:A8<C< 3 G8A;0
        try:
            floats.append(float(num.replace(',', '.')))
        except ValueError:
            continue

    # >?>;=O5< None 4> 3 M;5<5=B>2
    while len(floats) < 3:
        floats.append(None)

    return (floats[0], floats[1], floats[2])


def get_category(metal_key: str) -> str:
    """?@545;O5B :0B53>@8N <5B0;;0 ?> :;NGC."""
    for prefix, category in CATEGORY_MAP.items():
        if metal_key.startswith(prefix):
            return category
    return 'other'


def escape_sql_string(s: str) -> str:
    """-:@0=8@C5B AB@>:C 4;O SQL."""
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"


def format_number(n: Optional[float]) -> str:
    """$>@<0B8@C5B G8A;> 4;O SQL."""
    if n is None:
        return 'NULL'
    return str(n)


def main():
    print("Nachalo generacii SQL dlya metal_sizes...")

    # 1. 03@C78BL metals.json
    print(f"Zagruzka metals.json s {METALS_JSON_URL}...")
    try:
        response = requests.get(METALS_JSON_URL, timeout=30)
        response.raise_for_status()
        metals_data = response.json()
    except Exception as e:
        print(f"Oshibka zagruzki: {e}")
        return

    metals = metals_data.get('metals', {})
    print(f"Zagruzheno tipov metallov: {len(metals)}")

    # 2. 1@01>B:0 40==KE
    print("Obrabotka razmerov...")

    records: List[Dict[str, Any]] = []
    stats = {
        'total': 0,
        'skipped': 0,
        'by_category': {}
    }

    for metal_key, metal_data in metals.items():
        weights = metal_data.get('weights', {})

        if not weights:
            continue

        category = get_category(metal_key)

        for size_original, weight in weights.items():
            stats['total'] += 1

            # @>25@:0 20;84=>AB8 25A0
            try:
                weight_float = float(weight)
                if weight_float <= 0:
                    stats['skipped'] += 1
                    continue
            except (ValueError, TypeError):
                stats['skipped'] += 1
                continue

            # >@<0;870F8O
            size_normalized = normalize_size(size_original)

            # 72;5G5=85 :><?>=5=B>2
            dim1, dim2, dim3 = extract_dimensions(size_original)

            records.append({
                'metal_key': metal_key,
                'size_original': size_original,
                'size_normalized': size_normalized,
                'weight_per_meter': weight_float,
                'dimension_1': dim1,
                'dimension_2': dim2,
                'dimension_3': dim3,
                'category': category
            })

            # !B0B8AB8:0 ?> :0B53>@8O<
            stats['by_category'][category] = stats['by_category'].get(category, 0) + 1

    print(f"Obrabotano zapisey: {len(records)}")
    print(f"Propushcheno (nevalidniy ves): {stats['skipped']}")

    # 3. 5=5@0F8O SQL
    print("Generaciya SQL...")

    timestamp = datetime.now().isoformat()

    sql_lines = [
        "-- ============================================================",
        f"-- SQL INSERT: Zagruzka razmerov metalloprokata",
        f"-- Sgeneriovano: {timestamp}",
        f"-- Kolichestvo zapisey: {len(records)}",
        "-- ============================================================",
        "",
        "-- Sozdanie tablicy (esli ne sushchestvuet)",
        "CREATE TABLE IF NOT EXISTS metal_sizes (",
        "  id SERIAL PRIMARY KEY,",
        "  metal_key TEXT NOT NULL,",
        "  size_original TEXT NOT NULL,",
        "  size_normalized TEXT NOT NULL,",
        "  weight_per_meter NUMERIC NOT NULL,",
        "  dimension_1 NUMERIC,",
        "  dimension_2 NUMERIC,",
        "  dimension_3 NUMERIC,",
        "  category TEXT,",
        "  created_at TIMESTAMPTZ DEFAULT NOW(),",
        "  updated_at TIMESTAMPTZ DEFAULT NOW(),",
        "  UNIQUE (metal_key, size_original)",
        ");",
        "",
        "-- Indexy",
        "CREATE INDEX IF NOT EXISTS idx_metal_sizes_key ON metal_sizes(metal_key);",
        "CREATE INDEX IF NOT EXISTS idx_metal_sizes_normalized ON metal_sizes(size_normalized);",
        "CREATE INDEX IF NOT EXISTS idx_metal_sizes_category ON metal_sizes(category);",
        "",
        "-- Vstavka dannyh",
        "INSERT INTO metal_sizes (metal_key, size_original, size_normalized, weight_per_meter, dimension_1, dimension_2, dimension_3, category)",
        "VALUES"
    ]

    # 5=5@0F8O VALUES
    value_lines = []
    for i, rec in enumerate(records):
        line = "  ({}, {}, {}, {}, {}, {}, {}, {})".format(
            escape_sql_string(rec['metal_key']),
            escape_sql_string(rec['size_original']),
            escape_sql_string(rec['size_normalized']),
            format_number(rec['weight_per_meter']),
            format_number(rec['dimension_1']),
            format_number(rec['dimension_2']),
            format_number(rec['dimension_3']),
            escape_sql_string(rec['category'])
        )
        value_lines.append(line)

    # 1J548=O5< A 70?OBK<8
    sql_lines.append(",\n".join(value_lines))

    # ON CONFLICT
    sql_lines.extend([
        "ON CONFLICT (metal_key, size_original) DO UPDATE SET",
        "  weight_per_meter = EXCLUDED.weight_per_meter,",
        "  size_normalized = EXCLUDED.size_normalized,",
        "  dimension_1 = EXCLUDED.dimension_1,",
        "  dimension_2 = EXCLUDED.dimension_2,",
        "  dimension_3 = EXCLUDED.dimension_3,",
        "  category = EXCLUDED.category,",
        "  updated_at = NOW();",
        "",
        "-- Proverka rezultata",
        "SELECT category, COUNT(*) as count FROM metal_sizes GROUP BY category ORDER BY count DESC;",
        "SELECT COUNT(*) as total FROM metal_sizes;"
    ])

    sql_content = "\n".join(sql_lines)

    # 4. !>E@0=5=85 D09;>2
    sql_file = 'insert_metal_sizes.sql'
    json_file = 'metal_sizes_data.json'

    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print(f"SQL file saved: {sql_file}")

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"JSON file saved: {json_file}")

    # 5. !B0B8AB8:0
    print("\n" + "="*50)
    print("STATISTIKA:")
    print(f"   Vsego zapisey: {len(records)}")
    print()
    print("   Po kategoriyam:")
    for cat, count in sorted(stats['by_category'].items(), key=lambda x: -x[1]):
        print(f"     {cat}: {count}")
    print("="*50)

    # 6. @8<5@K 70?8A59
    print("\nPRIMERY ZAPISEY:")
    for rec in records[:5]:
        print(f"   {rec['metal_key']}: {rec['size_original']} -> {rec['size_normalized']} ({rec['weight_per_meter']} kg/m)")
    print("   ...")

    print("\nGotovo! Ispolzuyte fayl insert_metal_sizes.sql dlya importa v Supabase.")


if __name__ == '__main__':
    main()
