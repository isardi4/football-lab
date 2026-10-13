"""Inspect small public samples; raw data stays in an ignored local directory."""

import argparse
import csv
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data/source_checks"
SOURCES = {
    "competitions.json": "https://raw.githubusercontent.com/hudl/open-data/master/data/competitions.json",
    "statsbomb-matches.json": "https://raw.githubusercontent.com/hudl/open-data/master/data/matches/9/281.json",
    "statsbomb-events.json": "https://raw.githubusercontent.com/hudl/open-data/master/data/events/3895292.json",
    "statsbomb-lineups.json": "https://raw.githubusercontent.com/hudl/open-data/master/data/lineups/3895292.json",
    "wyscout-sample.json": "https://raw.githubusercontent.com/koenvo/wyscout-soccer-match-event-dataset/main/processed-v2/files/1694390.json",
    "skillcorner-physical.csv": "https://raw.githubusercontent.com/SkillCorner/opendata/master/data/aggregates/aus1league_physicalaggregates_20242025.csv",
    "skillcorner-passing.csv": "https://raw.githubusercontent.com/SkillCorner/opendata/master/data/aggregates/aus1league_passingaggregates_20242025.csv",
    "skillcorner-obr.csv": "https://raw.githubusercontent.com/SkillCorner/opendata/master/data/aggregates/aus1league_obraggregates_20242025.csv",
    "results.csv": "https://www.football-data.co.uk/mmz4281/2324/E0.csv",
    "metrica-events.csv": "https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawEventsData.csv",
    "openfootball-results.csv": "https://raw.githubusercontent.com/footballcsv/england/master/2010s/2013-14/eng.1.csv",
}


def inspect_file(path: Path) -> dict:
    """Report observed structure without interpreting provider metrics."""
    data = path.read_bytes()
    result = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    if path.suffix == ".csv":
        rows = list(csv.DictReader(data.decode("utf-8-sig").splitlines()))
        result.update(rows=len(rows), columns=list(rows[0]) if rows else [])
        result["empty_cells"] = sum(v == "" for row in rows for v in row.values())
        if rows and "player_id" in rows[0]:
            result["unique_players"] = len({r["player_id"] for r in rows})
            result["unique_teams"] = len({r["team_id"] for r in rows})
            result["unique_player_team_position"] = len({
                (r["player_id"], r["team_id"], r["position_group"]) for r in rows
            })
    else:
        obj = json.loads(data)
        if isinstance(obj, list):
            result["rows"] = len(obj)
            if obj:
                result["first_row_keys"] = sorted(obj[0])
            if path.name == "competitions.json":
                result["argentina"] = [
                    [r["competition_name"], r["season_name"]]
                    for r in obj if r["country_name"] == "Argentina"
                ]
            if path.name == "statsbomb-events.json":
                result["event_types"] = sorted({r["type"]["name"] for r in obj})
                result["players_with_events"] = len({
                    r["player"]["id"] for r in obj if "player" in r
                })
            if path.name == "statsbomb-matches.json":
                counts = {}
                for match in obj:
                    for side in ["home", "away"]:
                        team = match[f"{side}_team"][f"{side}_team_name"]
                        counts[team] = counts.get(team, 0) + 1
                result["matches_by_team"] = counts
            if path.name == "statsbomb-lineups.json":
                result["listed_players"] = sum(len(r["lineup"]) for r in obj)
        else:
            result["keys"] = sorted(obj)
            events = obj.get("events", [])
            result["events"] = len(events)
            result["event_types"] = sorted({r["eventName"] for r in events})
            result["first_event_keys"] = sorted(events[0]) if events else []
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true", help="Refresh public samples over HTTPS")
    args = parser.parse_args()
    CACHE.mkdir(parents=True, exist_ok=True)
    report = {"checked_at_utc": datetime.now(timezone.utc).isoformat(), "samples": {}}
    for filename, url in SOURCES.items():
        path = CACHE / filename
        try:
            if args.download:
                with urlopen(url, timeout=30) as response:
                    data = response.read()
                path.write_bytes(data)
            report["samples"][filename] = {"url": url, **inspect_file(path)}
        except (OSError, ValueError) as error:
            report["samples"][filename] = {"url": url, "error": str(error)}
    output = ROOT / "docs/research/free_source_checks.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    errors = [name for name, sample in report["samples"].items() if "error" in sample]
    print(f"Report: {output}; samples: {len(SOURCES)}; failures: {len(errors)}")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
