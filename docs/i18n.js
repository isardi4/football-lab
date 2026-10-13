'use strict';
(() => {
  const translations = window.FOOTBALL_TRANSLATIONS;
  const storageKey = 'football-lab-language';
  let language = 'en';
  try { if (localStorage.getItem(storageKey) === 'es') language = 'es'; } catch (_) { /* Storage can be unavailable for local files. */ }
  const originals = new WeakMap();
  const attributes = new WeakMap();
  const patterns = [
    [/^(.+) · hipótesis por función$/, (_, role) => `${english(role)} · role-based hypothesis`],
    [/^Comparar (.+) con (.+)$/, (_, a, b) => `Compare ${a} with ${b}`],
    [/^Similitud (.+)$/, (_, label) => `${english(label)} affinity`],
    [/^Actual: Arsenal · (.+) min en 2026\/27$/, (_, minutes) => `Current: Arsenal · ${minutes} min in 2026/27`],
    [/^(\d+) registros visibles · (.+)$/, (_, count, caption) => `${count} visible records · ${english(caption)}`],
    [/^(\d+)(\s*\/\s*\d+)? indicadores$/, (_, used, total = '') => `${used}${total} indicators`],
    [/^(\d+) indicadores con señal$/, (_, count) => `${count} informative indicators`],
    [/^(\d+) de (\d+) indicadores con señal$/, (_, used, total) => `${used} of ${total} informative indicators`],
    [/^(.+)\/90$/, (_, label) => `${english(label)}/90`],
    [/^Siete candidatos como máximo respecto de (.+)\.$/, (_, name) => `Up to seven candidates compared with ${name}.`],
    [/^Overall: (.+)% ofensivo \+ (.+)% defensivo, según la función original\. Ofensivo: goles, xG y xA por 90\. Defensivo: recuperaciones, tackles y despejes \+ bloqueos \+ intercepciones por 90; para arqueros, atajadas, goles recibidos y vallas invictas\.$/, (_, attack, defence) => `Overall: ${attack}% offensive + ${defence}% defensive, based on the original role. Offensive: goals, xG and xA per 90. Defensive: recoveries, tackles and clearances + blocks + interceptions per 90; for goalkeepers, saves, goals conceded and clean sheets.`],
    [/^Overall: (.+)% ofensivo \+ (.+)% defensivo\. Orden: (.+)\. Índices exploratorios sobre indicadores disponibles; no miden calidad ni viabilidad de fichaje\. Solo candidatos del mismo grupo de posición: (.+)\.$/, (_, attack, defence, sort, group) => `Overall: ${attack}% offensive + ${defence}% defensive. Sort: ${english(sort)}. Exploratory indices across available indicators; they do not measure quality or signing feasibility. Only candidates from the same position group: ${group}.`],
    [/^(.+) registra (.+) goles\/90 respecto de (.+)\. Esto no mide calidad ni similitud táctica\.$/, (_, name, difference, original) => `${name} records ${difference} goals/90 relative to ${original}. This does not measure quality or tactical similarity.`],
    [/^La producción moderna corresponde a (.+), no al Arsenal\.$/, (_, team) => `Modern output is from ${team}, not Arsenal.`],
    [/^Sin datos de esa ventana(.+)$/, (_, suffix) => `No data for that window${suffix}`],
    [/^Local: (.+)$/, (_, team) => `Home: ${team}`],
    [/^Descanso: (.+)$/, (_, score) => `Half-time: ${score}`],
    [/^Estadio: (.+)$/, (_, stadium) => `Stadium: ${stadium}`],
    [/^Árbitro: (.+)$/, (_, referee) => `Referee: ${referee}`],
    [/^Cambio · entra (.+)$/, (_, name) => `Substitution · on: ${name}`],
    [/^Formación inicial: (.+)$/, (_, formation) => `Starting formation: ${formation}`],
    [/^· (.+) eventos revisados\. Los escudos identifican a los clubes y no representan necesariamente su diseño histórico\.$/, (_, count) => `· ${count} events reviewed. Crests identify the clubs and do not necessarily represent their historical designs.`],
    [/^· (.+) eventos revisados$/, (_, count) => `· ${count} events reviewed`],
  ];
  Object.assign(translations, {
    'StatsBomb · eventos y alineaciones ↗': 'StatsBomb · events and lineups ↗',
    'Football-Data.co.uk · resultados y estadísticas por equipo ↗': 'Football-Data.co.uk · results and team statistics ↗',
    'mayor Overall': 'highest Overall', 'mayor afinidad ofensiva': 'highest offensive affinity',
    'mayor afinidad defensiva': 'highest defensive affinity', 'más minutos': 'most minutes',
    'mayor xG/90': 'highest xG/90', 'mayor xA/90': 'highest xA/90', 'más tackles/90': 'most tackles/90',
  });
  const canonicalText = new Map(Object.entries(translations).map(([es, en]) => [en, es]));
  function canonical(source) {
    const trimmed = source.trim();
    return source.replace(trimmed, canonicalText.get(trimmed) || trimmed);
  }
  function english(source) {
    if (Object.hasOwn(translations, source)) return translations[source];
    for (const [pattern, replace] of patterns) if (pattern.test(source)) return source.replace(pattern, replace);
    return source;
  }
  function translate(source) {
    if (language === 'es') return source;
    const trimmed = source.trim();
    return source.replace(trimmed, english(trimmed));
  }
  function apply(root = document) {
    // Retain canonical text per node so language changes are reversible without
    // replacing controls, event handlers, selected players or filter values.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('script, style, noscript, [data-no-translate]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const prior = originals.get(node);
      const source = prior && node.nodeValue === prior.rendered ? prior.source : canonical(node.nodeValue);
      const rendered = translate(source);
      if (node.nodeValue !== rendered) node.nodeValue = rendered;
      originals.set(node, { source, rendered });
    }
    const elements = root.querySelectorAll('[title], [aria-label], [placeholder], meta[name="description"]');
    for (const element of elements) {
      const prior = attributes.get(element) || {};
      for (const name of ['title', 'aria-label', 'placeholder', 'content']) {
        if (!element.hasAttribute(name)) continue;
        const value = element.getAttribute(name);
        const source = prior[name] && value === prior[name].rendered ? prior[name].source : canonical(value);
        const rendered = translate(source);
        if (value !== rendered) element.setAttribute(name, rendered);
        prior[name] = { source, rendered };
      }
      attributes.set(element, prior);
    }
    document.documentElement.lang = language;
  }
  function setLanguage(value) {
    if (!['en', 'es'].includes(value)) return;
    language = value;
    try { localStorage.setItem(storageKey, value); } catch (_) { /* Keep the in-page choice even without storage. */ }
    document.getElementById('language-select').value = language;
    document.dispatchEvent(new Event('languagechange'));
    apply();
  }
  window.FootballI18n = {
    apply, setLanguage,
    get language() { return language; },
    get locale() { return language === 'es' ? 'es-AR' : 'en-GB'; },
    position(source) { return window.FOOTBALL_POSITIONS[source] || source; }
  };
  const selector = document.getElementById('language-select');
  selector.value = language;
  selector.addEventListener('change', () => setLanguage(selector.value));
  apply();
})();
