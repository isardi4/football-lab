'use strict';
(()=>{
  const $=id=>document.getElementById(id);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=(n,d=0)=>n===null||n===undefined?'—':new Intl.NumberFormat('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
  const id=new URLSearchParams(location.search).get('id');
  const m=window.MATCH_DATA.matches[id];
  if(!m){
    $('match-hero').innerHTML='<h1 class="match-title">Partido no encontrado.</h1><p>Volvé al listado y elegí un partido para ver sus detalles.</p>';
    ['match-stat-section','match-timeline-section','match-lineup-section'].forEach(key=>{const el=$(key)||document.querySelector('.'+key);if(el)el.hidden=true;});
    return;
  }
  const homeArsenal=m.home.name==='Arsenal';
  const gf=homeArsenal?m.home_score:m.away_score,ga=homeArsenal?m.away_score:m.home_score;
  const result=gf>ga?'win':gf<ga?'loss':'draw';
  const resultLabel={win:'Victoria del Arsenal',loss:'Derrota del Arsenal',draw:'Empate'}[result];
  const badge=t=>`<img class="team-crest" src="${esc(t.crest)}" alt="" width="28" height="28">`;
  $('match-back').href=`index.html?season=${encodeURIComponent(m.season)}#matches`;
  document.title=`${m.home.name} ${m.home_score}–${m.away_score} ${m.away.name} · Football Lab`;
  $('match-hero').classList.add('match-'+result);
  $('match-hero').innerHTML=`<p class="eyebrow">PREMIER LEAGUE · ${esc(m.season)} · ${esc(m.date)}</p><h1 class="match-title">${badge(m.home)}<span>${esc(m.home.name)}</span><span class="match-title-separator">—</span><span>${esc(m.away.name)}</span>${badge(m.away)}</h1><div class="match-scoreline"><strong>${m.home_score} <span>—</span> ${m.away_score}</strong><span class="match-result-label ${result}">${resultLabel}</span></div><div class="match-meta"><span>Local: ${esc(m.home.name)}</span><span>Descanso: ${fmt(m.half_home)}–${fmt(m.half_away)}</span>${m.stadium?`<span>Estadio: ${esc(m.stadium)}</span>`:''}${m.referee?`<span>Árbitro: ${esc(m.referee)}</span>`:''}</div>`;
  $('match-stat-caption').textContent=m.timeline_available?'Conteos desde eventos StatsBomb; tiros al arco y otras acciones son reconstrucciones.':'Datos por equipo del archivo de resultados; no incluye eventos individuales ni xG.';
  const rows=[['shots','Tiros',0],['shots_on_target','Tiros al arco',0],['xg','xG',2],['passes','Pases',0],['completed_passes','Pases completados',0],['recoveries','Recuperaciones',0],['tackles','Tackles',0],['corners','Córners',0],['fouls','Faltas',0],['yellow_cards','Amarillas',0],['red_cards','Rojas',0]];
  $('match-stats').innerHTML=`<div class="match-stat-head"><span>${badge(m.home)} ${esc(m.home.name)}</span><span>${esc(m.away.name)} ${badge(m.away)}</span></div>`+rows.filter(([key])=>m.home.stats[key]!==undefined||m.away.stats[key]!==undefined).map(([key,label,d])=>{
    const a=m.home.stats[key],b=m.away.stats[key],max=Math.max(a||0,b||0,1);
    return `<div class="match-stat"><div><strong>${fmt(a,d)}</strong><div class="bar-track"><div class="bar" style="width:${a===null?0:a/max*100}%"></div></div></div><span>${label}</span><div><div class="bar-track"><div class="bar" style="width:${b===null?0:b/max*100}%"></div></div><strong>${fmt(b,d)}</strong></div></div>`;
  }).join('');
  function timeline(){
    if(!m.timeline_available){
      $('timeline-filter-label').hidden=true;
      $('match-timeline').innerHTML='<p class="detail-empty">Esta fuente contiene el resultado y estadísticas por equipo, pero no los nombres de los goleadores, tarjetas por jugador ni cambios. Esos eventos no están disponibles para esta temporada.</p>';
      return;
    }
    const filter=$('timeline-filter').value;
    const events=m.timeline.filter(e=>filter==='all'||(filter==='cards'?['yellow','red'].includes(e.kind):e.kind===filter));
    $('match-timeline').innerHTML=events.length?'<ol class="event-list">'+events.map(e=>{
      const t=e.minute+':'+String(e.second).padStart(2,'0');
      const team=e.kind==='goal'?e.credited_team:e.team;
      const crest=window.MATCH_DATA.crests[team];
      return `<li class="event-row event-${e.kind}"><time>${t}</time><span class="event-marker" aria-hidden="true"></span><div><strong>${esc(e.description)}</strong><p>${esc(e.player)}${e.kind==='goal'&&e.team!==e.credited_team?' · '+esc(e.team):''}</p></div><span class="event-team">${esc(team)}<img class="team-crest" src="${esc(crest)}" alt="" width="18" height="18"></span></li>`;
    }).join('')+'</ol>':'<p class="detail-empty">No hay eventos de este tipo en el registro.</p>';
  }
  $('timeline-filter').addEventListener('change',timeline);timeline();
  if(m.lineups_available){
    $('match-lineups').innerHTML=[m.home,m.away].map(t=>`<article class="lineup-card"><h3>${badge(t)} ${esc(t.name)}</h3><p class="small-note">${t.formation?'Formación inicial: '+t.formation.split('').join('–'):''}${t.manager?' · '+esc(t.manager):''}</p><div class="table-wrap"><table><thead><tr><th>Jugador</th><th>Participación</th><th>Min</th></tr></thead><tbody>${t.players.map(p=>`<tr><td><strong>${esc(p.name)}</strong><small>${esc(p.position||'Sin posición en cancha')}</small></td><td>${p.started?'Titular':p.played?'Entró':'No jugó'}</td><td>${p.played?fmt(p.minutes,1):'—'}</td></tr>`).join('')}</tbody></table></div></article>`).join('');
  }else $('match-lineups').innerHTML='<p class="detail-empty">El archivo usado para 2025/26 no contiene alineaciones ni minutos por jugador de este partido. Los agregados de temporada no permiten reconstruirlos.</p>';
  $('match-source').innerHTML=`Fuente: <a href="${esc(m.source_url)}" target="_blank" rel="noopener">${esc(m.source)} ↗</a>${m.event_count?' · '+fmt(m.event_count)+' eventos revisados':''}. Los escudos identifican a los clubes y no representan necesariamente su diseño histórico.`;
})();
