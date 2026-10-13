"""Reconcile detail routes, scoreboards and event timelines with source fixtures."""
import json
import unittest
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]


class MatchDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.details=json.loads((ROOT/'docs/match-data.json').read_text())
        cls.dashboard=json.loads((ROOT/'docs/arsenal-data.json').read_text())

    def test_every_fixture_has_a_matching_detail_page(self):
        self.assertEqual(len(self.details['matches']),76)
        for season,fixtures in self.dashboard['fixtures'].items():
            for f in fixtures:
                mid='sb-'+str(f['id']) if f.get('id') else 'pl-'+f['date']
                m=self.details['matches'][mid]
                self.assertEqual(m['season'],season)
                self.assertEqual(m['date'],f['date'])
                home=m['home']['name']=='Arsenal'
                self.assertEqual(home,f['home'])
                self.assertEqual((m['home_score'],m['away_score']) if home else (m['away_score'],m['home_score']),(f['gf'],f['ga']))

    def test_own_goals_are_counted_once_and_for_the_correct_team(self):
        for m in self.details['matches'].values():
            if not m['timeline_available']:continue
            goals=Counter(e['credited_team'] for e in m['timeline'] if e['kind']=='goal')
            self.assertEqual(goals[m['home']['name']],m['home_score'],m['id'])
            self.assertEqual(goals[m['away']['name']],m['away_score'],m['id'])
            self.assertEqual(sum(p['started'] for p in m['home']['players']),11)
            self.assertEqual(sum(p['started'] for p in m['away']['players']),11)

    def test_modern_missing_lineups_are_explicit(self):
        for m in self.details['matches'].values():
            if m['season']=='2025/26':
                self.assertFalse(m['timeline_available'])
                self.assertFalse(m['lineups_available'])
                self.assertEqual(m['timeline'],[])
                self.assertEqual(m['home']['players'],[])
                self.assertNotIn('xg',m['home']['stats'])

    def test_dismissal_limits_match_participation(self):
        m=self.details['matches']['sb-3749493']
        campbell=next(p for p in m['home']['players'] if p['name']=='Sol Campbell')
        li=next(p for p in m['away']['players'] if p['name']=='Tie Li')
        self.assertEqual(campbell['minutes'],24.4)
        self.assertLess(li['minutes'],20)
        historic=next(p for p in self.dashboard['historical'] if p['name']=='Sol Campbell')
        row=next(x for x in historic['matches'] if x['id']==3749493)
        self.assertEqual(round(row['minutes'],1),campbell['minutes'])

    def test_every_badge_is_a_local_png(self):
        for m in self.details['matches'].values():
            for side in ['home','away']:
                p=ROOT/'docs'/m[side]['crest']
                self.assertTrue(p.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'),str(p))


if __name__=='__main__':unittest.main()
