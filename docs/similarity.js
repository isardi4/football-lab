'use strict';
// Exploratory cross-provider metric affinity, version profile_v2.
(function(root){
  const attack=[['goals','Goles/90'],['xg','xG/90'],['xa','xA/90']];
  const defence=[['recoveries','Recuperaciones/90'],['tackles','Tackles/90'],['cbi','Despejes + bloqueos + intercepciones/90']];
  const goalkeeping=[['saves','Atajadas/90'],['goals_conceded','Goles recibidos/90'],['clean_sheets','Vallas invictas/90']];
  const ROLE_WEIGHTS={FWD:{offensive:.7,defensive:.3},MID:{offensive:.5,defensive:.5},DEF:{offensive:.3,defensive:.7},GK:{offensive:0,defensive:1}};
  const noScore=reason=>({score:null,value:null,used:0,total:0,components:[],reason});
  function component(a,b,key,label){
    const left=a.stats?.[key],right=b.stats?.[key];
    const available=[left,right].every(n=>Number.isFinite(n)&&n>=0);
    if(!available)return{key,label,available:false,score:null,value:null,left:null,right:null,reason:'Falta un indicador compatible en alguna fuente.'};
    const x=left*90/a.stats.minutes,y=right*90/b.stats.minutes,max=Math.max(x,y);
    const value=max===0?null:100*Math.min(x,y)/max;
    return{key,label,available:true,left:x,right:y,value,score:value===null?null:Math.round(value),reason:value===null?'Ambos valores son cero: no aportan señal.':null};
  }
  function category(a,b,specs){
    const components=specs.map(([key,label])=>component(a,b,key,label));
    const available=components.filter(c=>c.available),used=components.filter(c=>c.value!==null);
    const reason=available.length<2?'Se necesitan al menos dos indicadores presentes en ambas fuentes.':!used.length?'Todos los indicadores compartidos son cero: no aportan señal.':null;
    const value=reason?null:used.reduce((sum,c)=>sum+c.value,0)/used.length;
    return{components,used:used.length,total:specs.length,score:value===null?null:Math.round(value),value,reason};
  }
  // Only a documented second-striker / attacking-midfield hypothesis crosses groups.
  function compatiblePosition(original,candidate){
    if(!original||!candidate)return false;
    return original.group===candidate.group ||
      (original.name==='Dennis Bergkamp' && candidate.role==='AM');
  }
  function profileSimilarity(historical,modern){
    const weights=ROLE_WEIGHTS[historical?.group]||ROLE_WEIGHTS.MID;
    let reason=null;
    if(!historical||!modern)reason='Falta el perfil de una de las temporadas.';
    else if(!compatiblePosition(historical,modern))reason='Los jugadores no comparten un grupo de posición compatible.';
    else if(![historical,modern].every(p=>Number.isFinite(p.stats?.minutes)&&p.stats.minutes>=900))reason='Se requieren al menos 900 minutos en cada temporada.';
    if(reason)return{overall:noScore(reason),offensive:noScore(reason),defensive:noScore(reason),weights,version:'profile_v2'};
    const offensive=historical.group==='GK'?noScore('La fuente moderna no aporta distribución ofensiva comparable del arquero.'):category(historical,modern,attack);
    const defensive=category(historical,modern,historical.group==='GK'?goalkeeping:defence);
    const unavailable=(weights.offensive>0&&offensive.value===null)||(weights.defensive>0&&defensive.value===null);
    const value=unavailable?null:(offensive.value||0)*weights.offensive+(defensive.value||0)*weights.defensive;
    const overall={score:value===null?null:Math.round(value),value,used:offensive.used+defensive.used,total:offensive.total+defensive.total,reason:unavailable?'Falta un bloque requerido por la función original; no se reemplaza por cero ni se altera su peso.':null};
    return{overall,offensive,defensive,weights,version:'profile_v2'};
  }
  function rankCandidates(original,candidates,dimension='overall'){
    if(!['overall','offensive','defensive'].includes(dimension))throw new Error('Unknown similarity dimension');
    return candidates.filter(player=>compatiblePosition(original,player)).map(player=>({player,similarity:profileSimilarity(original,player)}))
      .sort((a,b)=>(b.similarity[dimension].value??-1)-(a.similarity[dimension].value??-1)||b.player.stats.minutes-a.player.stats.minutes||a.player.name.localeCompare(b.player.name))
      .slice(0,7);
  }
  root.compatiblePosition=compatiblePosition;
  root.profileSimilarity=profileSimilarity;
  root.rankCandidates=rankCandidates;
  if(typeof module!=='undefined'&&module.exports)module.exports={profileSimilarity,rankCandidates,compatiblePosition};
})(typeof window==='undefined'?globalThis:window);
