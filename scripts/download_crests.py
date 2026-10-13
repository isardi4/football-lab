"""Fetch a bounded set of club badges from the Premier League asset service."""
import hashlib
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from build_match_data import CRESTS

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/crests'


def fetch(code):
    url=f'https://resources.premierleague.com/premierleague/badges/t{code}.png'
    target=OUT/f't{code}.png'
    if not target.exists():
        result=subprocess.run(['curl','-sS','-L','--fail','--max-time','25',url],check=True,capture_output=True)
        if not result.stdout.startswith(b'\x89PNG\r\n\x1a\n'):
            raise ValueError(f'Invalid PNG for crest {code}')
        target.write_bytes(result.stdout)
    return {'file':target.name,'url':url,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}


if __name__=='__main__':
    OUT.mkdir(exist_ok=True)
    with ThreadPoolExecutor(max_workers=5) as pool:
        sources=list(pool.map(fetch,sorted(set(CRESTS.values()))))
    (OUT/'sources.json').write_text(json.dumps(sources,indent=2)+'\n')
    print(f'Downloaded and validated {len(sources)} PNG club crests.')
