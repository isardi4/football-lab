"""Small API-Sports probe. Save raw replies locally; never print credentials."""

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data/source_checks/api_football"
BASE = "https://v3.football.api-sports.io/"


def read_key() -> str:
    key = os.environ.get("API_FOOTBALL_KEY", "").strip()
    if key:
        return key
    env_file = ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            name, separator, value = line.strip().partition("=")
            if separator and name == "API_FOOTBALL_KEY":
                return value.strip().strip("\"'")
    return ""


def fetch(endpoint: str, params: dict, key: str) -> dict:
    url = BASE + endpoint + "?" + urlencode(params)
    headers = {"x-apisports-key": key} if key else {}
    request = Request(url, headers=headers)
    try:
        with urlopen(request, timeout=25) as response:
            status, data = response.status, response.read()
    except HTTPError as error:
        status, data = error.code, error.read()
    text = data.decode("utf-8")
    if key:
        text = text.replace(key, "[REDACTED]")
    body = json.loads(text)
    record = {
        "checked_at_utc": datetime.now(timezone.utc).isoformat(),
        "endpoint": endpoint, "parameters": params,
        "authenticated": bool(key), "http_status": status, "body": body,
    }
    CACHE.mkdir(parents=True, exist_ok=True)
    filename = endpoint.replace("/", "_") + "_" + str(len(list(CACHE.glob('*.json'))))
    (CACHE / f"{filename}.json").write_text(json.dumps(record, indent=2) + "\n")
    print(json.dumps({"endpoint": endpoint, "http_status": status,
                      "results": body.get("results"), "errors": body.get("errors")}, ensure_ascii=False))
    if status >= 400 or body.get("errors"):
        raise SystemExit("Provider returned an error; reply saved locally. No further calls made.")
    return body


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--season", type=int, help="Check access and fixtures for this year")
    parser.add_argument("--fixture", type=int, help="Inspect a chosen fixture: players, lineups, team statistics")
    args = parser.parse_args()
    key = read_key()
    if not key:
        raise SystemExit("Set API_FOOTBALL_KEY in .env or the environment. No request made.")
    if args.fixture:
        for endpoint in ["fixtures/players", "fixtures/lineups", "fixtures/statistics"]:
            fetch(endpoint, {"fixture": args.fixture}, key)
        return
    params = {"country": "Argentina", "name": "Primera Nacional"}
    if args.season:
        params["season"] = args.season
    leagues = fetch("leagues", params, key)
    for entry in leagues.get("response", []):
        print(json.dumps({"league": entry["league"], "seasons": entry["seasons"]}, ensure_ascii=False))
    if args.season and len(leagues.get("response", [])) == 1:
        league_id = leagues["response"][0]["league"]["id"]
        fixtures = fetch("fixtures", {"league": league_id, "season": args.season}, key)
        matches = [m for m in fixtures.get("response", [])
                   if any("chacarita" in t["name"].lower() for t in m["teams"].values())]
        print(json.dumps({"chacarita_fixtures": [
            {"id": m["fixture"]["id"], "date": m["fixture"]["date"],
             "status": m["fixture"]["status"]["short"], "teams": m["teams"]}
            for m in matches
        ]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
