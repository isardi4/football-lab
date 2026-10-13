"""Audit cached SkillCorner aggregates and export an outer-joined local table."""

import csv
import hashlib
import json
import math
import statistics
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data/source_checks"
KEY = ("competition_id", "season_id", "player_id", "team_id", "position_group")
IDENTITY = ("player_name", "player_birthdate", "team_name", "competition_name", "season_name")


def number(value: str):
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (ValueError, TypeError):
        return None


def main() -> None:
    tables = {}
    report = {"key": KEY, "minimum_performances_hypothesis": 5, "tables": {}}
    for name in ("physical", "passing", "obr"):
        path = CACHE / f"skillcorner-{name}.csv"
        with path.open() as source:
            rows = list(csv.DictReader(source))
        indexed = {tuple(row[k] for k in KEY): row for row in rows}
        if len(indexed) != len(rows):
            raise ValueError(f"Duplicate grain in {name}; cannot safely join")
        if any(not all(key) for key in indexed):
            raise ValueError(f"Missing join key in {name}")
        tables[name] = indexed
        fields = {}
        for field in rows[0]:
            values = [row[field] for row in rows]
            numeric = [number(v) for v in values if number(v) is not None]
            fields[field] = {"missing": sum(v.strip().lower() in ("", "nan", "null") for v in values)}
            if numeric:
                fields[field].update(min=min(numeric), median=statistics.median(numeric), max=max(numeric))
        count_column = "count_match" if name == "physical" else "performance_included_count"
        reliable = [row for row in rows if (number(row[count_column]) or 0) >= 5]
        report["tables"][name] = {
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "rows": len(rows), "players": len({r['player_id'] for r in rows}),
            "teams": dict(Counter(r['team_name'] for r in rows)),
            "positions": dict(Counter(r['position_group'] for r in rows)),
            "rows_with_at_least_5_performances": len(reliable),
            "positions_with_at_least_5_performances": dict(Counter(r['position_group'] for r in reliable)),
            "fields": fields,
        }
    universe = set().union(*(set(t) for t in tables.values()))
    join = {"union_rows": len(universe), "all_three_rows": len(set.intersection(*(set(t) for t in tables.values())))}
    join["passing_obr_symmetric_difference"] = len(set(tables['passing']) ^ set(tables['obr']))
    conflicts = []
    joined = []
    reliable_positions = Counter()
    for key in sorted(universe):
        row = dict(zip(KEY, key))
        available = {name: table[key] for name, table in tables.items() if key in table}
        for field in IDENTITY:
            values = {source[field] for source in available.values() if source[field]}
            if len(values) > 1:
                conflicts.append({"key": key, "field": field, "values": sorted(values)})
            row[field] = next(iter(values)) if len(values) == 1 else ""
        for name in tables:
            row[f"has_{name}"] = name in available
            for field in next(iter(tables[name].values())):
                if field not in KEY + IDENTITY:
                    row[f"{name}__{field}"] = available.get(name, {}).get(field, "")
        physical = available.get("physical", {})
        denominator = number(physical.get("minutes_full_all"))
        # Official normalization tutorial: ratio of average count to average minutes.
        for metric in ("hi_count_full_all", "sprint_count_full_all"):
            numerator = number(physical.get(metric))
            row[f"physical__{metric}_p90"] = (
                round(numerator * 90 / denominator, 4)
                if numerator is not None and denominator is not None and denominator > 0 else ""
            )
        reliable = (len(available) == 3 and
                    (number(physical.get('count_match')) or 0) >= 5 and
                    all((number(available[n].get('performance_included_count')) or 0) >= 5
                        for n in ('passing', 'obr')))
        row['exploratory_minimum_5_each_block'] = reliable
        if reliable:
            reliable_positions[key[-1]] += 1
        joined.append(row)
    join["identity_conflicts"] = conflicts
    join["reliable_rows_by_position"] = dict(reliable_positions)
    join["passing_only_rows"] = len(set(tables['passing']) - set(tables['physical']))
    join["physical_only_rows"] = len(set(tables['physical']) - set(tables['passing']))
    join["shared_physical_passing_rows"] = len(set(tables['physical']) & set(tables['passing']))
    report['join'] = join
    with (CACHE / 'skillcorner-joined.csv').open('w') as target:
        writer = csv.DictWriter(target, fieldnames=list(joined[0]))
        writer.writeheader()
        writer.writerows(joined)
    output = ROOT / 'docs/research/skillcorner_profile.json'
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(join, ensure_ascii=False))


if __name__ == '__main__':
    main()
