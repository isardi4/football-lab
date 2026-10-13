"""Human-readable match summaries from cached sources; no raw event publication."""
import csv
import json
from datetime import datetime

from build_dashboard_data import ALIASES, CACHE, OUT, position_minutes

CRESTS = {'Arsenal':3,'Aston Villa':7,'Bournemouth':91,'Brentford':94,'Brighton':36,
          'Chelsea':8,'Crystal Palace':31,'Everton':11,'Fulham':54,'Ipswich':40,
          'Leeds':2,'Leicester':13,'Liverpool':14,'Man City':43,'Man United':1,
          'Newcastle':4,'Nott\'m Forest':17,'Southampton':20,'Sunderland':56,
          'Tottenham':6,'Wolves':39,'West Ham':21,'Burnley':90,
          'Manchester City':43,'Manchester United':1,'Tottenham Hotspur':6,
          'Wolverhampton Wanderers':39,'Leicester City':13,'Charlton Athletic':33,
          'Middlesbrough':25,'Leeds United':2,'Blackburn Rovers':5,
          'Newcastle United':4,'Birmingham City':41,'Bolton Wanderers':30,
          'Portsmouth':47}


def crest(team):
    return 'crests/t'+str(CRESTS[team])+'.png'


def name(player):
    return ALIASES.get(player.get('id'), player.get('name', 'Jugador sin identificar'))


def historical_details(match):
    mid=match['match_id']
    events=json.loads((CACHE/f'events/{mid}.json').read_text())
    lineups=json.loads((CACHE/f'lineups/{mid}.json').read_text())
    home=match['home_team']['home_team_name'];away=match['away_team']['away_team_name']
    stats={team:dict.fromkeys(['shots','shots_on_target','xg','passes','completed_passes',
                              'recoveries','tackles','corners','fouls','yellow_cards','red_cards'],0)
           for team in [home,away]}
    timeline=[]
    for e in events:
        team=e.get('team',{}).get('name')
        if team not in stats:continue
        st=stats[team];kind=e['type']['name'];description=None;tag=None;credit=team
        if kind=='Shot':
            shot=e['shot'];st['shots']+=1;st['xg']+=shot.get('statsbomb_xg',0)
            if shot['outcome']['name'] in ['Goal','Saved','Saved to Post']:st['shots_on_target']+=1
            if shot['outcome']['name']=='Goal':
                description='Gol (penal)' if shot.get('type',{}).get('name')=='Penalty' else 'Gol'
                tag='goal'
        if kind=='Own Goal Against':
            description='Gol en contra';tag='goal';credit=away if team==home else home
        if kind=='Pass':
            st['passes']+=1;st['completed_passes']+=int('outcome' not in e['pass'])
            st['corners']+=int(e['pass'].get('type',{}).get('name')=='Corner')
        if kind=='Ball Recovery':st['recoveries']+=int(not e.get('ball_recovery',{}).get('recovery_failure',False))
        if kind=='Duel' and e.get('duel',{}).get('type',{}).get('name')=='Tackle':st['tackles']+=1
        if kind=='Foul Committed':st['fouls']+=1
        card=e.get('foul_committed',{}).get('card',e.get('bad_behaviour',{}).get('card',{})).get('name')
        if card:
            st['yellow_cards']+=int(card in ['Yellow Card','Second Yellow'])
            st['red_cards']+=int(card in ['Red Card','Second Yellow'])
            description={'Yellow Card':'Tarjeta amarilla','Second Yellow':'Segunda amarilla y expulsión','Red Card':'Tarjeta roja'}.get(card,card)
            tag='red' if card in ['Red Card','Second Yellow'] else 'yellow'
        if kind=='Substitution':
            description='Cambio · entra '+name(e['substitution']['replacement']);tag='substitution'
        if description:
            timeline.append({'period':e['period'],'minute':e['minute'],'second':e['second'],
                             'team':team,'credited_team':credit,'player':name(e.get('player',{})),
                             'description':description,'kind':tag,'index':e['index']})
    for st in stats.values():st['xg']=round(st['xg'],2)
    teams=[]
    for team in [home,away]:
        source=next(x for x in lineups if x['team_name']==team)
        xi=next(e for e in events if e['type']['name']=='Starting XI' and e['team']['name']==team)
        manager_key='home_team' if team==home else 'away_team'
        managers=match[manager_key].get('managers') or []
        players=[]
        for p in source['lineup']:
            intervals=p.get('positions',[])
            minutes=sum(length for _,length in position_minutes(p))
            starts=any(q['start_reason']=='Starting XI' for q in intervals)
            players.append({'name':ALIASES.get(p['player_id'],p['player_name']),
                            'started':starts,'played':bool(intervals),'minutes':round(minutes,1),
                            'position':intervals[0]['position'] if intervals else None})
        teams.append({'name':team,'crest':crest(team),'formation':str(xi['tactics']['formation']),
                      'manager':managers[0]['name'] if managers else None,
                      'players':sorted(players,key=lambda p:(not p['started'],not p['played'],-p['minutes'])),
                      'stats':stats[team]})
    halftime={team:sum(t['kind']=='goal' and t['credited_team']==team and t['period']==1 for t in timeline) for team in [home,away]}
    return {'id':f'sb-{mid}','season':'2003/04','date':match['match_date'],
            'home':teams[0],'away':teams[1],'home_score':match['home_score'],'away_score':match['away_score'],
            'half_home':halftime[home],'half_away':halftime[away],
            'stadium':(match.get('stadium') or {}).get('name'),
            'referee':(match.get('referee') or {}).get('name'),
            'timeline':timeline,'source':'StatsBomb · eventos y alineaciones',
            'source_url':'https://github.com/hudl/open-data', 'event_count':len(events),
            'lineups_available':True,'timeline_available':True}


def modern_details(row):
    date=datetime.strptime(row['Date'],'%d/%m/%Y').date().isoformat()
    teams=[]
    for side in ['H','A']:
        team=row['HomeTeam' if side=='H' else 'AwayTeam']
        fields={'shots':'S','shots_on_target':'ST','corners':'C','fouls':'F','yellow_cards':'Y','red_cards':'R'}
        stats={name:int(row.get(side+suffix)) if row.get(side+suffix) not in (None,'') else None for name,suffix in fields.items()}
        teams.append({'name':team,'crest':crest(team),'stats':stats,'players':[], 'formation':None,'manager':None})
    return {'id':'pl-'+date,'season':'2025/26','date':date,'home':teams[0],'away':teams[1],
            'home_score':int(row['FTHG']),'away_score':int(row['FTAG']),
            'half_home':int(row['HTHG']) if row.get('HTHG') else None,
            'half_away':int(row['HTAG']) if row.get('HTAG') else None,
            'stadium':None,'referee':row.get('Referee') or None,'timeline':[],
            'source':'Football-Data.co.uk · resultados y estadísticas por equipo',
            'source_url':'https://www.football-data.co.uk/englandm.php','event_count':None,
            'lineups_available':False,'timeline_available':False}


def main():
    data={}
    for match in json.loads((CACHE/'matches.json').read_text()):
        details=historical_details(match);data[details['id']]=details
    for row in csv.DictReader((CACHE/'results-2526.csv').open(encoding='utf-8-sig')):
        if 'Arsenal' in [row['HomeTeam'],row['AwayTeam']]:
            details=modern_details(row);data[details['id']]=details
    payload={'matches':data,'crests':{team:crest(team) for team in CRESTS}}
    (OUT/'match-data.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    (OUT/'match-data.js').write_text('window.MATCH_DATA = '+json.dumps(payload,ensure_ascii=False)+';\n')
    print(f'Built {len(data)} match summaries; {len(set(CRESTS.values()))} crest assets required.')


if __name__=='__main__':main()
