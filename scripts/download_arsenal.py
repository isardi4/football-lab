"""Download the bounded public dataset used by the Arsenal dashboard."""
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'data/source_checks/arsenal_dashboard'
SB = 'https://raw.githubusercontent.com/hudl/open-data/4b73468fc5b0f1950f9f66fada70ad3a4f9327cb/data/'
ARCHIVE = 'https://raw.githubusercontent.com/vaastav/Fantasy-Premier-League/9779cdbc0c07f6c900c2d0c181ddf6bb9c800f88/data/2025-26/'


def fetch(item):
    name, url = item
    path = CACHE / name
    if path.exists():
        return name
    path.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(['curl', '-sS', '-L', '--fail', '--retry', '2',
                             '--max-time', '45', url], check=True, capture_output=True)
    path.write_bytes(result.stdout)
    return name


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    initial = [('matches.json', SB + 'matches/2/44.json'),
               ('current.json', 'https://fantasy.premierleague.com/api/bootstrap-static/'),
               ('results-2526.csv', 'https://www.football-data.co.uk/mmz4281/2526/E0.csv'),
               ('players-2526.csv', ARCHIVE + 'players_raw.csv'),
               ('teams-2526.csv', ARCHIVE + 'teams.csv')]
    with ThreadPoolExecutor(max_workers=5) as pool:
        for name in pool.map(fetch, initial):
            print('Downloaded:', name, flush=True)
    matches = json.loads((CACHE / 'matches.json').read_text())
    requests = [(f'{kind}/{m["match_id"]}.json', SB + f'{kind}/{m["match_id"]}.json')
                for m in matches for kind in ['events', 'lineups']]
    with ThreadPoolExecutor(max_workers=6) as pool:
        for index, name in enumerate(pool.map(fetch, requests), 1):
            if index % 10 == 0:
                print(f'Historical files: {index}/{len(requests)}', flush=True)
    print('Public dataset ready.', flush=True)


if __name__ == '__main__':
    main()
