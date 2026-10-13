'use strict';
// Versioned exploratory production score; intentionally excludes incompatible stats.
(function (root) {
  function offensiveSimilarity(historical, modern) {
    const empty = reason => ({score:null, reason, components:[], version:'offensive_v1'});
    if (!historical || !modern) return empty('Falta el perfil de una de las temporadas.');
    if (![historical.group,modern.group].every(g => ['MID','FWD'].includes(g)))
      return empty('Para arqueros y defensores necesitamos métricas de su función. Goles y xG no alcanzan.');
    if (![historical,modern].every(p => Number.isFinite(p.stats.minutes) && p.stats.minutes >= 900))
      return empty('Se requieren al menos 900 minutos en cada temporada para mostrar este porcentaje.');
    const components=[];
    for (const [key,label] of [['goals','Goles/90'],['xg','xG/90']]) {
      const a=historical.stats[key],b=modern.stats[key];
      if (![a,b].every(v=>Number.isFinite(v)&&v>=0))
        return empty('Falta una de las dos métricas necesarias: goles y xG.');
      const left=a*90/historical.stats.minutes,right=b*90/modern.stats.minutes;
      const max=Math.max(left,right);
      components.push({key,label,left,right,score:max===0?null:100*Math.min(left,right)/max});
    }
    // Shared zeroes carry no evidence of similar attacking production.
    const informative=components.filter(c=>c.score!==null);
    if (!informative.length) return empty('Ambos perfiles tienen producción ofensiva cero; no permite medir parecido.');
    return {score:Math.round(informative.reduce((sum,c)=>sum+c.score,0)/informative.length),
            components,version:'offensive_v1',reason:null};
  }
  root.offensiveSimilarity=offensiveSimilarity;
  if (typeof module!=='undefined' && module.exports) module.exports={offensiveSimilarity};
})(typeof window==='undefined'?globalThis:window);
