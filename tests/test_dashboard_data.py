"""Checks for metric semantics and source reconciliation, not UI implementation."""
import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('builder', ROOT / 'scripts/build_dashboard_data.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class MetricTests(unittest.TestCase):
    def test_lineup_clock_is_global_and_caps_stoppage(self):
        self.assertEqual(builder.minute_clock('46:17', 2), 46 + 17/60)
        self.assertEqual(builder.minute_clock('47:10', 1), 45)
        self.assertEqual(builder.minute_clock(None, None), 90)
        self.assertEqual(builder.minute_clock('94:10', 2), 90)

    def test_missing_modern_measure_is_not_zero(self):
        self.assertIsNone(builder.number(''))
        self.assertEqual(builder.number('0'), 0)

    def test_open_position_intervals_stop_at_dismissal(self):
        person={'cards':[{'time':'24:23','period':1,'card_type':'Red Card'}],
                'positions':[{'position':'Center Back','from':'00:00','from_period':1,'to':'30:00','to_period':1},
                             {'position':'Center Forward','from':'30:00','from_period':1,'to':None,'to_period':None}]}
        values=list(builder.position_minutes(person))
        self.assertAlmostEqual(values[0][1],24+23/60)
        self.assertEqual(values[1][1],0)

    def test_complete_season_and_known_historical_results(self):
        d = json.loads((ROOT / 'docs/arsenal-data.json').read_text())
        old = d['teams']['2003/04']
        self.assertEqual(old, {'played':38,'wins':26,'draws':12,'losses':0,'gf':73,'ga':26,'points':90})
        henry = next(p for p in d['historical'] if p['name']=='Thierry Henry')
        self.assertEqual(henry['stats']['goals'], 30)
        self.assertEqual(sum(p['stats']['goals'] for p in d['historical']) + 4, old['gf'])
        self.assertTrue(all(0 <= p['stats']['minutes'] <= 3420 for p in d['historical']))
        self.assertEqual(next(p for p in d['historical'] if p['name']=='Jens Lehmann')['stats']['minutes'],3420)

    def test_historical_archive_matches_official_fpl_samples(self):
        d = json.loads((ROOT / 'docs/arsenal-data.json').read_text())
        evidence = json.loads((ROOT / 'docs/research/arsenal_2526_access_check.json').read_text())
        fields = {'minutes':'minutes','starts':'starts','goals':'goals_scored',
                  'xg':'expected_goals','xa':'expected_assists','tackles':'tackles','recoveries':'recoveries'}
        for item in evidence['player_samples']:
            past=item['season_aggregate']
            player=next(p for p in d['modern'] if p['code']==past['element_code'])
            for key,official in fields.items():
                self.assertAlmostEqual(player['stats'][key],float(past[official]),places=3)

    def test_current_roster_excludes_stale_and_loan_entries(self):
        d = json.loads((ROOT / 'docs/arsenal-data.json').read_text())
        self.assertEqual(len(d['current']),24)
        self.assertEqual(len({p['code'] for p in d['current']}),24)
        for invalid in ['Martinelli','Gabriel Jesus','Nwaneri','Nelson','Fábio Vieira']:
            self.assertFalse(any(invalid in p['name'] for p in d['current']))
        codes={p['code'] for p in d['current']}
        self.assertTrue(all(p['code'] not in codes for p in d['external']))

    def test_defensive_aggregate_and_goalkeeper_exposure(self):
        d = json.loads((ROOT / 'docs/arsenal-data.json').read_text())
        for player in d['historical']:
            st=player['stats']
            self.assertEqual(st['cbi'],st['clearances']+st['blocks']+st['interceptions'])
            if player['group']!='GK':
                self.assertIsNone(st['goals_conceded'])
        keeper=next(p for p in d['historical'] if p['name']=='Jens Lehmann')
        self.assertEqual(len(keeper['matches']),38)
        self.assertTrue(all(m['minutes']==90 for m in keeper['matches']))
        self.assertEqual(keeper['stats']['goals_conceded'],d['teams']['2003/04']['ga'])
        self.assertEqual(keeper['stats']['clean_sheets'],sum(m['ga']==0 for m in d['fixtures']['2003/04']))
        evidence=json.loads((ROOT/'docs/research/arsenal_2526_access_check.json').read_text())
        for item in evidence['player_samples']:
            original=item['season_aggregate']
            p=next(p for p in d['modern'] if p['code']==original['element_code'])
            self.assertEqual(p['stats']['cbi'],float(original['clearances_blocks_interceptions']))
            self.assertEqual(p['stats']['goals_conceded'],float(original['goals_conceded']))
            self.assertEqual(p['stats']['clean_sheets'],float(original['clean_sheets']))


if __name__ == '__main__': unittest.main()
