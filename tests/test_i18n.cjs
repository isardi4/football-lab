'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function page(savedLanguage, blockedStorage = false) {
  const selector = {value: 'en', addEventListener() {}};
  const nodes = [];
  const elements = [];
  const stored = new Map(savedLanguage ? [['football-lab-language', savedLanguage]] : []);
  const document = {
    documentElement: {},
    getElementById: () => selector,
    addEventListener() {}, dispatchEvent() {},
    querySelectorAll: () => elements,
    createTreeWalker: (root, type, filter) => {
      const accepted = nodes.filter(node => filter.acceptNode(node) === 1);
      let index = 0;
      return {nextNode: () => accepted[index++] || null};
    }
  };
  const context = vm.createContext({
    window: {}, document, Event: class {},
    NodeFilter: {SHOW_TEXT: 4, FILTER_REJECT: 2, FILTER_ACCEPT: 1},
    localStorage: {
      getItem: key => {if (blockedStorage) throw Error('blocked'); return stored.get(key);},
      setItem: (key, value) => {if (blockedStorage) throw Error('blocked'); stored.set(key, value);}
    }
  });
  for (const name of ['translations.js', 'i18n.js'])
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../docs', name), 'utf8'), context);
  const i18n = context.window.FootballI18n;
  function text(value, skip = false) {
    const node = {nodeValue: value, parentElement: {closest: () => skip ? {} : null}};
    nodes.push(node);
    return node;
  }
  function attribute(name, value) {
    const values = new Map([[name, value]]);
    const element = {hasAttribute: key => values.has(key), getAttribute: key => values.get(key), setAttribute: (key, value) => values.set(key, value)};
    elements.push(element);
    return element;
  }
  return {i18n, text, attribute, document, selector, stored};
}

const p = page();
assert.equal(p.i18n.language, 'en');
assert.equal(p.document.documentElement.lang, 'en');
const title = p.text('The DNA of the'); // Static HTML is English before scripts load.
const name = p.text('Thierry Henry');
const indicators = p.text(' 2 / 3 indicadores ');
const position = p.text(p.i18n.position('Left Back'));
const skip = p.text('Español', true);
const placeholder = p.attribute('placeholder', 'Nombre del jugador');
const aria = p.attribute('aria-label', 'Comparar Thierry Henry con Gyökeres');
const source = p.text(' · 3,221 eventos revisados. Los escudos identifican a los clubes y no representan necesariamente su diseño histórico.');
p.i18n.apply();
assert.equal(title.nodeValue, 'The DNA of the');
assert.equal(name.nodeValue, 'Thierry Henry');
assert.equal(indicators.nodeValue, ' 2 / 3 indicators ');
assert.equal(position.nodeValue, 'Left-back');
assert.equal(skip.nodeValue, 'Español');
assert.equal(placeholder.getAttribute('placeholder'), 'Player name');
assert.equal(aria.getAttribute('aria-label'), 'Compare Thierry Henry with Gyökeres');
assert.ok(source.nodeValue.includes('3,221 events reviewed. Crests identify'));
p.i18n.apply(); // Applying repeatedly must not lose the source language.
p.i18n.setLanguage('es');
assert.equal(title.nodeValue, 'El ADN de los');
assert.equal(indicators.nodeValue, ' 2 / 3 indicadores ');
assert.equal(position.nodeValue, 'Lateral izquierdo');
assert.equal(placeholder.getAttribute('placeholder'), 'Nombre del jugador');
assert.equal(p.i18n.locale, 'es-AR');
assert.equal(p.selector.value, 'es');
assert.equal(p.stored.get('football-lab-language'), 'es');
p.i18n.setLanguage('en');
assert.equal(p.i18n.locale, 'en-GB');
assert.equal(title.nodeValue, 'The DNA of the');
indicators.nodeValue = '3 / 3 indicadores'; // An application render changes an existing node.
p.i18n.apply();
assert.equal(indicators.nodeValue, '3 / 3 indicators');
p.i18n.setLanguage('es');
assert.equal(indicators.nodeValue, '3 / 3 indicadores');
p.i18n.setLanguage('invalid');
assert.equal(p.i18n.language, 'es');
assert.equal(page('es').i18n.language, 'es');
assert.equal(page('invalid').i18n.language, 'en');
const blocked = page(undefined, true);
assert.equal(blocked.i18n.language, 'en');
blocked.i18n.setLanguage('es');
assert.equal(blocked.i18n.language, 'es');
console.log('Languages: English default, saved Spanish, reversible dynamic text, labels, positions, locale, names and unavailable storage passed.');
