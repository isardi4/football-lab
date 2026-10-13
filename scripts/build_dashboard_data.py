"""Build a small, source-labelled public dashboard from cached Arsenal data."""
import csv
import hashlib
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'data/source_checks/arsenal_dashboard'
OUT = ROOT / 'docs'
METRICS = ['minutes', 'starts', 'goals', 'assists', 'xg', 'xa', 'shots', 'passes',
           'pass_completed', 'progressive_passes', 'carries', 'dribbles',
           'pressures', 'recoveries', 'tackles', 'interceptions', 'saves',
           'clearances', 'blocks', 'cbi', 'goals_conceded', 'clean_sheets']
ALIASES = {20015: 'Jens Lehmann', 40222: 'Lauren', 38412: 'Kolo Touré',
           15637: 'Sol Campbell', 12529: 'Ashley Cole', 15515: 'Patrick Vieira',
           40221: 'Gilberto Silva', 15754: 'Freddie Ljungberg', 19312: 'Robert Pirès',
           15516: 'Thierry Henry', 15650: 'Dennis Bergkamp'}
# Eligibility is explicit, rather than inferred from stale FPL team assignments.
ROLE_IDS = {1:'GK',2:'GK',3:'GK',4:'CB',5:'RB',6:'CB',7:'LB',8:'LB',9:'LB',
            10:'RB',11:'CB',12:'RW',13:'CM',14:'AM',15:'AM',16:'RW',17:'CM',
            19:'DM',20:'AM',25:'ST',26:'ST',31:'CB',452:'CM',557:'LW'}


def number(value):
    if value in (None, ''):
        return None
    return float(value)


def minute_clock(clock, period):
    if clock is None:
        return 90.0
    bits = [float(x) for x in clock.split(':')]
    minutes = bits[0] + bits[1] / 60
    # Lineup clocks are global, unlike event timestamps. Cap first-half stoppage.
    return min(minutes, 45 if period == 1 else 90)


def position_group(name):
    if name == 'Goalkeeper': return 'GK'
    if 'Back' in name: return 'DEF'
    if 'Forward' in name or 'Wing' in name: return 'FWD'
    return 'MID'


def position_minutes(person):
    """Clip source position intervals at a dismissal, even if they remain open."""
    dismissal=min((minute_clock(c['time'],c['period']) for c in person.get('cards',[])
                   if c['card_type'] in ['Red Card','Second Yellow']),default=90.0)
    for position in person.get('positions',[]):
        end=min(minute_clock(position['to'],position['to_period']),dismissal)
        start=minute_clock(position['from'],position['from_period'])
        yield position['position'],max(0,end-start)


def historical():
    players, fixtures = {}, []
    matches = json.loads((CACHE / 'matches.json').read_text())
    for match in matches:
        mid = match['match_id']
        teams = json.loads((CACHE / f'lineups/{mid}.json').read_text())
        lineup = next(t for t in teams if t['team_name'] == 'Arsenal')
        active = set()
        for person in lineup['lineup']:
            pid = person['player_id']
            positions = person.get('positions', [])
            if not positions: continue
            active.add(pid)
            if pid not in players:
                players[pid] = {'id': f'sb-{pid}', 'name': ALIASES.get(pid, person['player_name']),
                                'original_name': person['player_name'], 'season': '2003/04',
                                'team': 'Arsenal', 'source': 'StatsBomb', 'appearances': 0,
                                'stats': dict.fromkeys(METRICS, 0), 'positions': Counter(),
                                'matches': []}
                players[pid]['stats']['goals_conceded'] = None
                players[pid]['stats']['clean_sheets'] = None
            p = players[pid]
            minutes = 0
            for position, length in position_minutes(person):
                p['positions'][position] += length
                minutes += length
            p['stats']['minutes'] += minutes
            p['stats']['starts'] += int(any(q['start_reason'] == 'Starting XI' for q in positions))
            p['appearances'] += 1
            p['matches'].append({'id': mid, 'minutes': round(minutes, 2)})
        events = json.loads((CACHE / f'events/{mid}.json').read_text())
        by_event = {e['id']: e for e in events}
        for e in events:
            pid = e.get('player', {}).get('id')
            if e.get('team', {}).get('name') != 'Arsenal' or pid not in players: continue
            st = players[pid]['stats']
            kind = e['type']['name']
            if kind == 'Shot':
                shot = e['shot']
                st['shots'] += 1
                st['xg'] += shot.get('statsbomb_xg', 0)
                st['goals'] += int(shot['outcome']['name'] == 'Goal')
            if kind == 'Pass':
                p = e['pass']; st['passes'] += 1
                complete = 'outcome' not in p
                st['pass_completed'] += int(complete)
                st['assists'] += int(p.get('goal_assist', False))
                end = p.get('end_location', [])
                start = e.get('location', [])
                if complete and len(end) >= 2 and len(start) >= 2 and end[0] - start[0] >= 12:
                    st['progressive_passes'] += 1
                shot = by_event.get(p.get('assisted_shot_id'), {}).get('shot', {})
                st['xa'] += shot.get('statsbomb_xg', 0)
            if kind == 'Carry': st['carries'] += 1
            if kind == 'Dribble': st['dribbles'] += int(e['dribble']['outcome']['name'] == 'Complete')
            if kind == 'Pressure': st['pressures'] += 1
            if kind == 'Ball Recovery': st['recoveries'] += int(not e.get('ball_recovery', {}).get('recovery_failure', False))
            if kind == 'Duel' and e.get('duel', {}).get('type', {}).get('name') == 'Tackle': st['tackles'] += 1
            if kind == 'Interception': st['interceptions'] += 1
            if kind in ['Clearance', 'Block', 'Interception']:
                st['cbi'] += 1
            if kind == 'Clearance': st['clearances'] += 1
            if kind == 'Block': st['blocks'] += 1
            if kind == 'Goal Keeper' and e.get('goalkeeper', {}).get('type', {}).get('name') in ['Shot Saved', 'Penalty Saved', 'Shot Saved to Post']:
                st['saves'] += 1
        home = match['home_team']['home_team_name'] == 'Arsenal'
        gf, ga = (match['home_score'], match['away_score']) if home else (match['away_score'], match['home_score'])
        for pid in active:
            p = players[pid]
            # Full-match goalkeeper exposure can be reconciled with the scoreboard.
            # Do not attribute a team's goals conceded to substitutes or outfield players.
            if p['matches'][-1]['minutes'] == 90 and all(q == 'Goalkeeper' for q in p['positions']):
                p['stats']['goals_conceded'] = (p['stats']['goals_conceded'] or 0) + ga
                p['stats']['clean_sheets'] = (p['stats']['clean_sheets'] or 0) + int(ga == 0)
        fixtures.append({'date': match['match_date'], 'opponent': match['away_team']['away_team_name'] if home else match['home_team']['home_team_name'], 'home': home, 'gf': gf, 'ga': ga, 'id': mid})
    for p in players.values():
        p['positions'] = dict(p['positions'])
        p['position'] = max(p['positions'], key=p['positions'].get)
        p['group'] = position_group(p['position'])
        p['stats'] = {k: round(v, 3) if v is not None else None for k, v in p['stats'].items()}
    return sorted(players.values(), key=lambda p: -p['stats']['minutes']), sorted(fixtures, key=lambda f: f['date'])


def modern_row(row, teams):
    mapping = {'minutes': 'minutes', 'starts': 'starts', 'goals': 'goals_scored',
               'assists': 'assists', 'xg': 'expected_goals', 'xa': 'expected_assists',
               'recoveries': 'recoveries', 'tackles': 'tackles', 'saves': 'saves',
               'goals_conceded': 'goals_conceded', 'clean_sheets': 'clean_sheets'}
    stats = dict.fromkeys(METRICS, None)
    for target, source in mapping.items(): stats[target] = number(row.get(source))
    stats['cbi'] = number(row.get('clearances_blocks_interceptions'))
    return {'id': f'fpl25-{row["id"]}', 'code': int(row['code']),
            'name': row['web_name'], 'full_name': row['first_name'] + ' ' + row['second_name'],
            'group': {'1':'GK','2':'DEF','3':'MID','4':'FWD'}[row['element_type']],
            'position': {'1':'Arquero','2':'Defensor','3':'Mediocampista','4':'Delantero'}[row['element_type']],
            'team': teams[row['team']], 'season': '2025/26', 'source': 'FPL · archivo vaastav',
            'birth_date': row.get('birth_date'), 'stats': stats}


def summary(fixtures):
    return {'played': len(fixtures), 'wins': sum(f['gf'] > f['ga'] for f in fixtures),
            'draws': sum(f['gf'] == f['ga'] for f in fixtures), 'losses': sum(f['gf'] < f['ga'] for f in fixtures),
            'gf': sum(f['gf'] for f in fixtures), 'ga': sum(f['ga'] for f in fixtures),
            'points': sum(3 if f['gf'] > f['ga'] else 1 if f['gf'] == f['ga'] else 0 for f in fixtures)}


def main():
    old, old_matches = historical()
    teams = {r['id']: r['name'] for r in csv.DictReader((CACHE / 'teams-2526.csv').open())}
    modern = [modern_row(r, teams) for r in csv.DictReader((CACHE / 'players-2526.csv').open())]
    current = json.loads((CACHE / 'current.json').read_text())
    modern_by_code = {p['code']: p for p in modern}
    current_roster = []
    current_codes = set()
    for r in current['elements']:
        if r['team'] != 1: continue
        if r['id'] not in ROLE_IDS: continue
        current_codes.add(r['code'])
        past = modern_by_code.get(r['code'])
        current_roster.append({'id': f'current-{r["id"]}', 'code': r['code'], 'name': r['web_name'],
                               'full_name': r['first_name']+' '+r['second_name'], 'role': ROLE_IDS[r['id']],
                               'group': {1:'GK',2:'DEF',3:'MID',4:'FWD'}[r['element_type']],
                               'birth_date': r.get('birth_date'), 'past_id': past['id'] if past else None,
                               'past_team': past['team'] if past else None,
                               'current_minutes': r['minutes']})
    new_matches = []
    for r in csv.DictReader((CACHE / 'results-2526.csv').open(encoding='utf-8-sig')):
        if 'Arsenal' not in (r['HomeTeam'], r['AwayTeam']): continue
        home = r['HomeTeam'] == 'Arsenal'
        new_matches.append({'date': datetime.strptime(r['Date'], '%d/%m/%Y').date().isoformat(),
                            'opponent': r['AwayTeam'] if home else r['HomeTeam'], 'home': home,
                            'gf': int(r['FTHG' if home else 'FTAG']), 'ga': int(r['FTAG' if home else 'FTHG'])})
    current_by_code = {p['code']:p for p in current['elements']}
    current_teams = {t['id']:t['name'] for t in current['teams']}
    for p in modern:
        now = current_by_code.get(p['code'])
        p['current_team_fpl'] = current_teams[now['team']] if now else None
        p['current_arsenal'] = p['code'] in current_codes
    dataset = {'updated': datetime.now(timezone.utc).isoformat(), 'cutoff': '2026-10-13',
               'historical': old, 'champions': [p for p in modern if p['team']=='Arsenal'],
               'current': current_roster, 'external': [p for p in modern if p['code'] not in current_codes and p['team']!='Arsenal' and (p['stats']['minutes'] or 0)>=900],
               'modern': modern, 'fixtures': {'2003/04': old_matches, '2025/26': new_matches},
               'teams': {'2003/04': summary(old_matches), '2025/26': summary(new_matches)},
               'provenance': [{'file':str(p.relative_to(CACHE)), 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(CACHE.rglob('*')) if p.is_file()]}
    OUT.mkdir(exist_ok=True)
    (OUT/'arsenal-data.json').write_text(json.dumps(dataset, ensure_ascii=False, indent=2)+'\n')
    (OUT/'arsenal-data.js').write_text('window.ARSENAL_DATA = '+json.dumps(dataset, ensure_ascii=False)+';\n')
    print(json.dumps({'historical_players':len(old),'champion_entries':len(dataset['champions']), 'current_players':len(current_roster),'external_candidates':len(dataset['external']),'teams':dataset['teams']},ensure_ascii=False))


if __name__ == '__main__': main()
