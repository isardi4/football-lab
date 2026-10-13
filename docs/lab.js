'use strict';
(() => {
  const D = window.ARSENAL_DATA;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (n, digits = 0) => n === null || n === undefined || !Number.isFinite(n) ? '—' : new Intl.NumberFormat('es-AR', {maximumFractionDigits: digits, minimumFractionDigits: digits}).format(n);
  const rate = (p, key, per90) => {
    const n = p?.stats?.[key];
    if (n === null || n === undefined || (per90 && !p.stats.minutes)) return null;
    return per90 ? n * 90 / p.stats.minutes : n;
  };
  const modernById = new Map(D.modern.map(p => [p.id, p]));
  const short = p => p.name.replace('Jens ', '').replace('Thierry ', '').replace('Patrick ', '').replace('Robert ', '').replace('Freddie ', '').replace('Dennis ', '').replace('Ashley ', '').replace('Sol ', '').replace('Kolo ', '');
  const pairs = [
    ['Jens Lehmann',1,'1',50,89,'Arquero','Contrastar atajadas y distribución. Las acciones con pelota del arquero moderno no están completas.'],
    ['Lauren',10,'12',86,68,'Lateral derecho','White es una hipótesis por sector. Falta validar defensa lateral, centros y progresión moderna.'],
    ['Kolo Touré',6,'28',62,70,'Central derecho','Saliba es una hipótesis por puesto; no inferimos la misma conducción o velocidad a partir de su posición.'],
    ['Sol Campbell',4,'23',38,70,'Central izquierdo','Gabriel cubre el sector. Para confirmar parecido necesitamos duelos y juego aéreo comparables.'],
    ['Ashley Cole',8,'3',14,68,'Lateral izquierdo','Calafiori es una alternativa del sector. Su función actual no reproduce automáticamente la de Cole.'],
    ['Patrick Vieira',13,'4',62,48,'Mediocampista de recorrido','Rice es una hipótesis inicial. Recuperaciones y tackles describen parte del perfil; falta conducción y progresión.'],
    ['Gilberto Silva',19,'19',38,48,'Pivote de equilibrio','Zubimendi es una hipótesis por función. Falta medir cobertura, intercepciones y circulación con definiciones comunes.'],
    ['Freddie Ljungberg',12,'8',86,40,'Banda derecha y llegada','Saka ocupa el sector, pero crear desde banda y llegar al área son funciones distintas. Hay que revisar esa diferencia.'],
    ['Robert Pirès',557,'7',14,40,'Banda izquierda creativa','Tzolis permite investigar la producción desde izquierda. Su temporada medida fue en otro club; no equivale a la de Pirès.'],
    ['Dennis Bergkamp',15,'10',64,17,'Segundo atacante creador','Ødegaard es una hipótesis de creación; la posición y la relación con el delantero difieren. No es un reemplazo demostrado.'],
    ['Thierry Henry',25,'14',36,17,'Atacante con gol y progresión','Gyökeres es una hipótesis como finalizador. Para acercarlo a Henry faltan creación, regate y progresión comparables.']
  ];
  const findOld = name => D.historical.find(p => p.name === name);
  const findCurrent = id => D.current.find(p => p.id === 'current-' + id);
  const option = p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`;
  function tab(name) {
    document.querySelectorAll('.view').forEach(v => {v.hidden = v.id !== name; v.classList.toggle('active', v.id === name);});
    document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
  }
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => tab(b.dataset.tab)));
  $('team-summary').innerHTML = Object.entries(D.teams).map(([season,t]) => `<div class="season-summary"><div class="season-name">${season}<small>${season === '2003/04' ? 'INVENCIBLES' : 'CAMPEONES'}</small></div>${[['points','Puntos'],['gf','Goles'],['ga','Recibidos'],['losses','Derrotas']].map(([k,l])=>`<div class="stat"><strong>${t[k]}</strong><small>${l}</small></div>`).join('')}</div>`).join('');
  $('historical-select').innerHTML = D.historical.map(option).join('');
  $('current-select').innerHTML = D.current.map(option).join('');
  $('recruit-reference').innerHTML = pairs.map(p => option(findOld(p[0]))).join('');
  $('pitch').innerHTML = '<div class="pitch-center"></div>' + pairs.map((p,i) => `<button class="pitch-player" data-pair="${i}" style="left:${p[3]}%;top:${p[4]}%" aria-pressed="false" aria-label="Comparar ${esc(p[0])} con ${esc(findCurrent(p[1]).name)}"><span class="shirt">${p[2]}</span><strong>${esc(short(findOld(p[0])))}</strong><small>${esc(findCurrent(p[1]).name)}</small></button>`).join('');
  document.querySelectorAll('[data-pair]').forEach(b => b.addEventListener('click', () => selectPair(Number(b.dataset.pair))));
  function selectPair(i) {
    const p = pairs[i];
    $('historical-select').value = findOld(p[0]).id;
    $('current-select').value = findCurrent(p[1]).id;
    renderCompare();
  }
  function renderCompare() {
    const old = D.historical.find(p=>p.id === $('historical-select').value);
    const current = D.current.find(p=>p.id === $('current-select').value);
    const modern = modernById.get(current.past_id);
    const pairIndex = pairs.findIndex(p => p[0] === old.name);
    const pair = pairs[pairIndex];
    document.querySelectorAll('[data-pair]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.pair) === pairIndex)));
    $('role-note').innerHTML = `<strong>${esc(pair?.[5] || old.position)} · hipótesis por función</strong><br>${esc(pair?.[6] || 'Comparación exploratoria de un participante de la campaña histórica.')}${pair && findCurrent(pair[1]).id !== current.id ? '<br><strong>Seleccionaste otro candidato: la hipótesis anterior corresponde al propuesto en el once.</strong>' : ''}`;
    $('comparison-head').innerHTML = `<div class="comparison-names"><div class="old"><h3>${esc(old.name)}</h3><small>Arsenal · 2003/04 · ${fmt(old.stats.minutes)} min</small></div><div class="new"><h3>${esc(current.name)}</h3><small>${esc(modern?.team || 'Sin datos de esa ventana')} · 2025/26 · ${fmt(modern?.stats.minutes)} min</small><br><small>Actual: Arsenal · ${fmt(current.current_minutes)} min en 2026/27</small></div></div>`;
    const similarity=window.profileSimilarity(old,modern);
    const percent=n=>n===null?'—':n+'%';
    document.querySelectorAll('[data-pair]').forEach(button=>{
      const candidatePair=pairs[Number(button.dataset.pair)];
      const candidateCurrent=findCurrent(candidatePair[1]);
      const value=window.profileSimilarity(findOld(candidatePair[0]),modernById.get(candidateCurrent.past_id));
      let badge=button.querySelector('.pitch-score');
      if(!badge){badge=document.createElement('span');badge.className='pitch-score';button.appendChild(badge);}
      badge.textContent=value.overall.score===null?'Sin %':value.overall.score+'%';
      badge.title=value.overall.reason||'Overall: afinidad exploratoria de los indicadores disponibles, con pesos por función original.';
    });
    const scoreCards=[['overall','Overall'],['offensive','Ofensivo'],['defensive','Defensivo']];
    $('similarity').innerHTML='<div class="score-grid">'+scoreCards.map(([key,label])=>{
      const block=similarity[key];
      return `<div class="score-compact" data-dimension="${key}" title="${esc(block.reason||block.used+' indicadores con señal')}"><span>${label}</span><output aria-label="Similitud ${label}">${percent(block.score)}</output><small>${block.score===null?'No evaluable':block.used+' / '+block.total+' indicadores'}</small></div>`;
    }).join('')+'</div><details class="score-method"><summary>Indicadores y pesos de esta comparación</summary><p>Overall: '+fmt(similarity.weights.offensive*100)+'% ofensivo + '+fmt(similarity.weights.defensive*100)+'% defensivo, según la función original. Ofensivo: goles, xG y xA por 90. Defensivo: recuperaciones, tackles y despejes + bloqueos + intercepciones por 90; para arqueros, atajadas, goles recibidos y vallas invictas.</p><p>Cada indicador compara menor ÷ mayor × 100. El bloque promedia sus indicadores con señal. Ceros compartidos se excluyen; hacen falta dos indicadores presentes y 900 minutos en ambas ventanas. Un bloque requerido faltante deja Overall sin porcentaje.</p><p>Es afinidad estadística exploratoria, no calidad ni probabilidad de encaje. xG/xA y acciones defensivas tienen modelos o criterios distintos entre proveedores; el agregado defensivo histórico es una aproximación. Asistencias fantasy, FM y acciones sin datos modernos quedan fuera.</p>'+scoreCards.slice(1).map(([key,label])=>{
      const block=similarity[key];
      return '<div class="score-breakdown"><strong>'+label+'</strong>'+(block.reason?'<p>'+esc(block.reason)+'</p>':'')+(block.components||[]).map(c=>'<div><span>'+esc(c.label)+'</span><b>'+percent(c.score)+'</b><small>'+esc(c.reason||'Comparación entre fuentes')+'</small></div>').join('')+'</div>';
    }).join('')+'</details>';
    const per90 = $('per90').checked;
    const keeper=old.group==='GK'||current.group==='GK';
    const rows = [['goals','Goles','Ofensivo'],['xg','xG','Ofensivo · modelos distintos'],['xa','xA','Ofensivo · modelos distintos'],['recoveries','Recuperaciones','Defensivo · aproximación'],['tackles','Tackles','Defensivo · aproximación'],['cbi','Despejes + bloqueos + intercepciones','Defensivo · aproximación'],['assists','Asistencias','Sólo referencia · históricas vs fantasy']];
    if(keeper) rows.push(['saves','Atajadas','Defensivo · arquero'],['goals_conceded','Goles recibidos','Defensivo · arquero'],['clean_sheets','Vallas invictas','Defensivo · arquero']);
    const components=[...similarity.offensive.components,...similarity.defensive.components];
    $('metrics').innerHTML = rows.filter(r=>!keeper||['saves','goals_conceded','clean_sheets','assists'].includes(r[0])).map(([key,label,note])=>{
      const a=rate(old,key,per90), b=rate(modern,key,per90), max=Math.max(a||0,b||0,0.01);
      const component=components.find(c=>c.key===key);
      const score=component?.score;
      return `<div class="metric-row"><div class="metric-value"><span>${fmt(a,per90||['xg','xa'].includes(key)?2:0)}</span><div class="bar-track"><div class="bar" style="width:${a===null?0:a/max*100}%"></div></div></div><div class="metric-center">${label}${per90?'/90':''}<small>${note}</small></div><div class="metric-value"><div class="bar-track"><div class="bar" style="width:${b===null?0:b/max*100}%"></div></div><span>${fmt(b,per90||['xg','xa'].includes(key)?2:0)}</span></div><small class="metric-affinity" title="${esc(component?.reason||(!component?'Fuera del índice': 'Afinidad en este indicador por 90'))}">${percent(score??null)}</small></div>`;
    }).join('');
    $('historical-details').innerHTML = '<p class="small-note">Tenemos estas acciones en los videos reconstruidos de 2003/04. Nuestra fuente moderna no las ofrece por separado: falta información, no significa que el jugador actual no las haga. Por eso quedan fuera del porcentaje.</p><div class="extra-stats">'+[['passes','Pases'],['progressive_passes','Pases con avance ≥12'],['dribbles','Regates completos'],['carries','Conducciones'],['pressures','Presiones'],['interceptions','Intercepciones']].map(([k,l])=>`<div>${l}${per90?'/90':''}<strong>${fmt(rate(old,k,per90),per90?2:0)}</strong></div>`).join('')+'</div><p class="small-note">Sólo histórico; faltantes modernos, no ceros. La progresión usa una definición propia. No permite confirmar el parecido de roles.</p>';
    const a=rate(old,'goals',true),b=rate(modern,'goals',true);
    $('comparison-takeaway').innerHTML = b===null ? 'No hay una temporada 2025/26 con minutos suficientes en el archivo para este jugador. Se conserva su lugar en el plantel actual sin inventar un perfil.' : `<strong>Diferencia de producción:</strong> ${esc(current.name)} registra ${fmt(b-a,2)} goles/90 respecto de ${esc(old.name)}. Esto no mide calidad ni similitud táctica.${modern.stats.minutes<900?' <strong>Muestra menor a 900 minutos: interpretar con cautela.</strong>':''}${modern.team!=='Arsenal'?' La producción moderna corresponde a '+esc(modern.team)+', no al Arsenal.':''}`;
  }
  $('historical-select').addEventListener('change', renderCompare);
  $('current-select').addEventListener('change', renderCompare);
  $('per90').addEventListener('change', renderCompare);
  function renderSquads() {
    const kind=$('squad-season').value, search=$('squad-search').value.trim().toLocaleLowerCase(),group=$('squad-group').value;
    const list=D[kind].filter(p=>(group==='all'||p.group===group)&&((p.name+' '+(p.full_name||'')).toLocaleLowerCase().includes(search)));
    $('squad-caption').textContent=`${list.length} registros visibles · ${kind==='current'?'Plantel 2026/27; producción 2025/26 separada del club actual.':kind==='champions'?'Entradas asociadas a Arsenal en el snapshot de fin de temporada; incluye registros sin participación.':'Jugadores con intervalos de posiciones en los 38 partidos; un ingreso en descuento puede quedar en cero minutos de tiempo regular.'}`;
    const labels=kind==='current'?['Jugador','Rol editorial','Club 2025/26','Min 2025/26','Goles','xG','Min 2026/27']:['Jugador','Posición / grupo','Minutos','Titularidades','Goles','xG','Asistencias'];
    $('squad-head').innerHTML='<tr>'+labels.map(l=>`<th>${l}</th>`).join('')+'</tr>';
    $('squad-body').innerHTML=list.map(p=>{
      if(kind==='current'){
        const past=modernById.get(p.past_id);
        return `<tr><td><button class="table-link" data-current="${esc(p.id)}">${esc(p.name)}</button><small>${esc(p.full_name)}</small></td><td>${esc(p.role)}</td><td>${esc(past?.team || 'Sin muestra')}</td><td>${fmt(past?.stats.minutes)}</td><td>${fmt(past?.stats.goals)}</td><td>${fmt(past?.stats.xg,2)}</td><td>${fmt(p.current_minutes)}</td></tr>`;
      }
      return `<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.position)}</td><td>${fmt(p.stats.minutes)}</td><td>${fmt(p.stats.starts)}</td><td>${fmt(p.stats.goals)}</td><td>${fmt(p.stats.xg,2)}</td><td>${fmt(p.stats.assists)}${kind==='champions'?' <small>fantasy</small>':''}</td></tr>`;
    }).join('')||'<tr><td colspan="7">No hay jugadores para estos filtros.</td></tr>';
    document.querySelectorAll('[data-current]').forEach(b=>b.addEventListener('click',()=>{$('current-select').value=b.dataset.current;renderCompare();tab('compare');}));
  }
  ['squad-season','squad-group'].forEach(id=>$(id).addEventListener('change',renderSquads));
  $('squad-search').addEventListener('input',renderSquads);
  function renderRecruit() {
    const old=D.historical.find(p=>p.id===$('recruit-reference').value),sort=$('recruit-sort').value;
    const candidates=D.external.filter(p=>p.group===$('recruit-group').value&&p.stats.minutes>=Number($('min-minutes').value));
    let rows;
    if(['overall','offensive','defensive'].includes(sort)) rows=window.rankCandidates(old,candidates,sort);
    else rows=candidates.map(player=>({player,similarity:window.profileSimilarity(old,player)})).sort((a,b)=>sort==='minutes'?b.player.stats.minutes-a.player.stats.minutes:(rate(b.player,sort,true)??-Infinity)-(rate(a.player,sort,true)??-Infinity)).slice(0,7);
    const weights=window.profileSimilarity(old,candidates[0]).weights;
    $('recruit-note').innerHTML=`<strong>Siete candidatos como máximo respecto de ${esc(old.name)}.</strong> Overall: ${fmt(weights.offensive*100)}% ofensivo + ${fmt(weights.defensive*100)}% defensivo. Orden: ${esc({overall:'mayor Overall',offensive:'mayor afinidad ofensiva',defensive:'mayor afinidad defensiva',minutes:'más minutos',xg:'mayor xG/90',xa:'mayor xA/90',tackles:'más tackles/90'}[sort])}. Índices exploratorios sobre indicadores disponibles; no miden calidad ni viabilidad de fichaje.${old.group!==$('recruit-group').value?' La categoría elegida difiere de la histórica: revisá la función.':''}`;
    const cell=(similarity,key)=>{
      const block=similarity[key];
      return `<td class="${key==='overall'?'score-cell':''}"><strong class="score-pill ${block.score===null?'unavailable':''}" title="${esc(block.reason||block.used+' de '+block.total+' indicadores con señal')}">${block.score===null?'—':block.score+'%'}</strong><small>${block.score===null?'No evaluable':block.used+'/'+block.total+' indicadores'}</small></td>`;
    };
    $('recruit-body').innerHTML=rows.map(({player:p,similarity:s})=>`<tr data-candidate="${esc(p.id)}" data-score="${s.overall.score??''}"><td><strong>${esc(p.name)}</strong><small>${esc(p.position)}</small></td>${['overall','offensive','defensive'].map(k=>cell(s,k)).join('')}<td>${esc(p.team)}</td><td>${esc(p.current_team_fpl||'Sin confirmar')}</td><td>${fmt(p.stats.minutes)}</td>${['goals','xg','xa','recoveries','tackles','cbi','saves','goals_conceded','clean_sheets'].map(k=>`<td>${fmt(rate(p,k,true),2)}</td>`).join('')}</tr>`).join('')||'<tr><td colspan="16">Sin candidatos para estos filtros.</td></tr>';
  }
  $('recruit-reference').addEventListener('change',()=>{
    const old=D.historical.find(p=>p.id===$('recruit-reference').value);
    $('recruit-group').value=old.group;
    renderRecruit();
  });
  ['recruit-group','min-minutes','recruit-sort'].forEach(id=>$(id).addEventListener('change',renderRecruit));
  function renderMatches() {
    const filter=$('match-result').value;
    $('match-grid').innerHTML=D.fixtures[$('match-season').value].filter(m=>filter==='all'||(m.gf>m.ga?'win':m.gf<m.ga?'loss':'draw')===filter).map(m=>{
      const result=m.gf>m.ga?'win':m.gf<m.ga?'loss':'draw';
      return `<article class="match-card"><header><span>${esc(m.date)}</span><span>${m.home?'LOCAL':'VISITANTE'}</span></header><h3>Arsenal · ${esc(m.opponent)}</h3><div class="score ${result}">${m.gf} <span aria-hidden="true">—</span> ${m.ga}</div><small>${result==='win'?'Victoria':result==='loss'?'Derrota':'Empate'}${m.id?` · <a target="_blank" rel="noopener" href="https://github.com/hudl/open-data/blob/master/data/events/${m.id}.json">Eventos ↗</a>`:''}</small></article>`;
    }).join('')||'<p>No hay partidos con este resultado.</p>';
  }
  ['match-season','match-result'].forEach(id=>$(id).addEventListener('change',renderMatches));
  $('fm-attributes').innerHTML=Object.entries(D.fm.attributes).map(([name,n])=>`<div class="fm-attr"><span>${esc(name)}</span><div class="bar-track"><div class="bar" style="width:${n/99*100}%"></div></div><strong>${n}</strong></div>`).join('')+'<p class="small-note">Rice · muestra FM26. No participa en un score de similitud ni reemplaza métricas faltantes.</p>';
  selectPair(10);renderSquads();$('recruit-reference').value=findOld('Thierry Henry').id;renderRecruit();renderMatches();
})();
