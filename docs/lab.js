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
    const similarity=window.offensiveSimilarity(old,modern);
    $('similarity-preview').innerHTML=`<a href="#compare" class="score-preview" id="score-preview-link"><span><strong>${esc(old.name)} → ${esc(current.name)}</strong><small>Similitud de producción ofensiva · ver comparación ↓</small></span><b>${similarity.score===null?'Sin %':similarity.score+'%'}</b></a>`;
    $('score-preview-link').addEventListener('click',()=>tab('compare'));
    document.querySelectorAll('[data-pair]').forEach(button=>{
      const candidatePair=pairs[Number(button.dataset.pair)];
      const candidateCurrent=findCurrent(candidatePair[1]);
      const value=window.offensiveSimilarity(findOld(candidatePair[0]),modernById.get(candidateCurrent.past_id));
      let badge=button.querySelector('.pitch-score');
      if(!badge){badge=document.createElement('span');badge.className='pitch-score';button.appendChild(badge);}
      badge.textContent=value.score===null?'Sin %':value.score+'%';
      badge.title=value.reason||'Similitud ofensiva: goles y xG por 90; no parecido de estilo.';
    });
    $('similarity').innerHTML=similarity.score===null ? `<div class="similarity-empty"><strong>Similitud de producción ofensiva · sin porcentaje</strong><p>${esc(similarity.reason)}</p></div>` : `<div class="similarity-summary"><div class="similarity-number"><output aria-label="Similitud de producción ofensiva">${similarity.score}<span>%</span></output></div><div><p class="eyebrow">SIMILITUD DE PRODUCCIÓN OFENSIVA</p><p>Goles y xG por 90 minutos · índice exploratorio</p><small>100% significa producción igual en estas métricas; no mismo estilo, calidad ni probabilidad de encaje.</small></div></div><div class="similarity-components">${similarity.components.map(c=>`<div><span>${esc(c.label)}</span><strong>${c.score===null?'Sin señal':fmt(c.score,0)+'%'}</strong></div>`).join('')}</div><details class="score-method"><summary>Cómo se obtiene este porcentaje</summary><p>Para cada métrica: menor valor por 90 ÷ mayor valor por 90 × 100. El índice promedia los dos resultados con igual peso. Una producción doble da 50% en esa dimensión; valores iguales dan 100%. Un cero compartido no aporta señal y se excluye del promedio.</p><p>Se requieren 900 minutos por jugador y ambas métricas presentes. El xG proviene de modelos diferentes; el resultado es orientativo. No incluye asistencias fantasy, defensa, pases, conducción ni atributos FM. Versión: offensive_v1.</p></details>`;
    const per90 = $('per90').checked;
    const rows = [['goals','Goles','Producción comparable'],['xg','xG','Modelos diferentes'],['xa','xA','Modelos / cálculo diferentes'],['assists','Asistencias','Históricas vs fantasy'],['recoveries','Recuperaciones','Definiciones sin armonizar'],['tackles','Tackles','Definiciones sin armonizar'],['saves','Atajadas','Definiciones sin armonizar']];
    $('metrics').innerHTML = rows.filter(r=>r[0]!=='saves'||old.group==='GK'||current.group==='GK').map(([key,label,note])=>{
      const a=rate(old,key,per90), b=rate(modern,key,per90), max=Math.max(a||0,b||0,0.01);
      return `<div class="metric-row"><div class="metric-value"><span>${fmt(a,per90||['xg','xa'].includes(key)?2:0)}</span><div class="bar-track"><div class="bar" style="width:${a===null?0:a/max*100}%"></div></div></div><div class="metric-center">${label}${per90?'/90':''}<small>${note}</small></div><div class="metric-value"><div class="bar-track"><div class="bar" style="width:${b===null?0:b/max*100}%"></div></div><span>${fmt(b,per90||['xg','xa'].includes(key)?2:0)}</span></div></div>`;
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
    const old=D.historical.find(p=>p.id===$('recruit-reference').value),target=rate(old,'goals',true),sort=$('recruit-sort').value;
    const candidates=D.external.filter(p=>p.group===$('recruit-group').value&&p.stats.minutes>=Number($('min-minutes').value));
    const scores=new Map(candidates.map(p=>[p.id,window.offensiveSimilarity(old,p)]));
    const bySimilarity=(a,b)=>(scores.get(b.id).score??-1)-(scores.get(a.id).score??-1)||b.stats.minutes-a.stats.minutes||a.name.localeCompare(b.name);
    const best=[...candidates].filter(p=>scores.get(p.id).score!==null).sort(bySimilarity)[0];
    $('recruit-best').innerHTML=best?`<div class="recruit-best-card"><div><p class="eyebrow">MAYOR SIMILITUD OFENSIVA EN ESTOS FILTROS</p><h3>${esc(best.name)} <span>→ ${esc(old.name)}</span></h3><p>${esc(best.team)} · 2025/26 · ${fmt(best.stats.minutes)} minutos</p><small>Goles/90: ${fmt(scores.get(best.id).components[0].score,0)}% · xG/90: ${scores.get(best.id).components[1].score===null?'Sin señal':fmt(scores.get(best.id).components[1].score,0)+'%'}. No incluye estilo ni viabilidad de fichaje.</small></div><strong>${scores.get(best.id).score}<span>%</span></strong></div>`:`<div class="notice"><strong>No hay porcentaje calculable para estos filtros.</strong>${esc(candidates.length?scores.get(candidates[0].id).reason:'No hay candidatos con estos minutos y categoría.')}</div>`;
    candidates.sort((a,b)=>sort==='similarity'?bySimilarity(a,b):sort==='gap'?Math.abs(rate(a,'goals',true)-target)-Math.abs(rate(b,'goals',true)-target)||b.stats.minutes-a.stats.minutes:sort==='minutes'?b.stats.minutes-a.stats.minutes:(rate(b,sort,true)??-Infinity)-(rate(a,sort,true)??-Infinity));
    const historicalGroup=old.group==='FWD'?'FWD':old.group==='MID'?'MID':old.group;
    $('recruit-note').innerHTML=`<strong>Porcentaje respecto de ${esc(old.name)} · ${fmt(target,2)} goles/90 en 2003/04.</strong> Mostramos hasta 20 de ${candidates.length} candidatos del grupo seleccionado.${sort==='similarity'?' Ordenados de mayor a menor similitud ofensiva: promedio de cercanía en goles/90 y xG/90, con igual peso. No mide parecido completo ni probabilidad de encaje.':sort==='gap'?' Ordenados sólo por cercanía en goles/90. La columna de porcentaje sigue usando goles y xG.':' Ordenados por la estadística elegida; el mayor porcentaje puede aparecer en otra fila.'}${historicalGroup!==$('recruit-group').value?' El grupo elegido difiere de la posición histórica: revisá la compatibilidad.':''}`;
    $('recruit-body').innerHTML=candidates.slice(0,20).map(p=>{
      const s=scores.get(p.id);
      const details=s.score===null?s.reason:s.components.map(c=>`${c.label}: ${c.score===null?'Sin señal':fmt(c.score,0)+'%'}`).join(' · ');
      return `<tr data-candidate="${esc(p.id)}" data-score="${s.score===null?'':s.score}"><td class="score-cell"><strong class="score-pill ${s.score===null?'unavailable':''}" title="${esc(details)}">${s.score===null?'—':s.score+'%'}</strong><small>${s.score===null?'No evaluable':'ofensiva'}</small></td><td><strong>${esc(p.name)}</strong><small>${esc(p.position)}</small></td><td>${esc(p.team)}</td><td>${esc(p.current_team_fpl||'Sin confirmar')}</td><td>${fmt(p.stats.minutes)}</td>${['goals','xg','xa','tackles'].map(k=>`<td>${fmt(rate(p,k,true),2)}</td>`).join('')}</tr>`;
    }).join('')||'<tr><td colspan="9">Sin candidatos para estos filtros.</td></tr>';
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
