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


if __name__ == '__main__': unittest.main()
