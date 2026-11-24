/* Opus Meum self-check engine.
   Each check's content is in assets/checks/<id>.js and sets window.OM_CHECK before this file runs:
     id, storageKey?, areaWeight[], areaOf[] (area index per question), critical[[question, answers]],
     text: { en, lt, de } with name, h1, lede, facts, areas[], bands{fix,low,mid,high,top}, nothing, note, q[].
   Each question: [question, [answer worth 2, worth 1, worth 0], fix title, fix text]. "Not sure" is worth 0.
   Answers stay in this browser (localStorage) and in the results link (#r=...). */
(() => {
  'use strict';

  const EMAIL = 'vitalijus@opusmeum.net';

  // Shared interface text. A check's own text can override any of these.
  const UI = {
    en: {
      start: 'Start the check', resume: 'Continue the check', restart: 'Start again',
      count: (n, t) => `Question ${n} of ${t}`,
      back: 'Back', notSure: 'Not sure', outOf: 'out of 100',
      fixesTitle: 'What to fix first',
      sendText: 'Email these results to Opus Meum and we will reply with what we would do first in your tenant.',
      email: 'Email the results', copy: 'Copy the results', copied: 'Copied',
      otherTitle: 'Other checks',
      subject: (name, s) => `${name}: ${s}/100`,
      body: (name, s, band, areas, fixes, link) =>
        `Hello,\n\nHere are our ${name} results.\n\nOverall: ${s} out of 100. ${band}\n\n${areas}\n\nFix first:\n${fixes}\n\nFull results: ${link}\n\nCompany:\nName:\n`
    },
    lt: {
      start: 'Pradėti patikrinimą', resume: 'Tęsti patikrinimą', restart: 'Pradėti iš naujo',
      count: (n, t) => `${n} klausimas iš ${t}`,
      back: 'Atgal', notSure: 'Nežinau', outOf: 'iš 100',
      fixesTitle: 'Ką taisyti pirmiausia',
      sendText: 'Atsiųskite šiuos rezultatus Opus Meum, ir mes atsakysime, ką jūsų aplinkoje darytume pirmiausia.',
      email: 'Siųsti rezultatus el. paštu', copy: 'Kopijuoti rezultatus', copied: 'Nukopijuota',
      otherTitle: 'Kiti patikrinimai',
      subject: (name, s) => `${name}: ${s}/100`,
      body: (name, s, band, areas, fixes, link) =>
        `Sveiki,\n\nsiunčiame savo rezultatus: ${name}.\n\nBendras rezultatas: ${s} iš 100. ${band}\n\n${areas}\n\nKą taisyti pirmiausia:\n${fixes}\n\nVisi rezultatai: ${link}\n\nĮmonė:\nVardas:\n`
    },
    de: {
      start: 'Check starten', resume: 'Check fortsetzen', restart: 'Neu beginnen',
      count: (n, t) => `Frage ${n} von ${t}`,
      back: 'Zurück', notSure: 'Weiß nicht', outOf: 'von 100',
      fixesTitle: 'Was Sie zuerst angehen sollten',
      sendText: 'Senden Sie diese Ergebnisse an Opus Meum. Wir antworten Ihnen, was wir in Ihrem Tenant zuerst tun würden.',
      email: 'Ergebnisse per E-Mail senden', copy: 'Ergebnisse kopieren', copied: 'Kopiert',
      otherTitle: 'Weitere Checks',
      subject: (name, s) => `${name}: ${s}/100`,
      body: (name, s, band, areas, fixes, link) =>
        `Hallo,\n\nhier sind unsere Ergebnisse: ${name}.\n\nGesamt: ${s} von 100. ${band}\n\n${areas}\n\nZuerst angehen:\n${fixes}\n\nAlle Ergebnisse: ${link}\n\nUnternehmen:\nName:\n`
    }
  };

  // All checks, for the "Other checks" links. Paths are relative to the site root.
  const CHECKS = [
    { id: 'copilot', path: 'copilot-readiness/', name: { en: 'Copilot readiness check', lt: 'Copilot pasirengimo patikrinimas', de: 'Copilot-Readiness-Check' } },
    { id: 'sharepoint', path: 'sharepoint-governance/', name: { en: 'SharePoint governance check', lt: 'SharePoint valdymo patikrinimas', de: 'SharePoint-Governance-Check' } },
    { id: 'power-platform', path: 'power-platform-governance/', name: { en: 'Power Platform governance check', lt: 'Power Platform valdymo patikrinimas', de: 'Power-Platform-Governance-Check' } }
  ];

  const C = window.OM_CHECK;
  if (!C) return;
  const lang = (document.documentElement.lang || 'en').slice(0, 2);
  const T = Object.assign({}, UI[lang] || UI.en, C.text[lang] || C.text.en);
  const NAME = T.name || (CHECKS.find(c => c.id === C.id) || { name: {} }).name[lang] || C.id;
  const N = T.q.length;
  const AREAS = T.areas.length;
  const KEY = C.storageKey || `om-check-${C.id}`;
  const ROOT = document.documentElement.dataset.root || '../';
  const LANGDIR = lang === 'en' ? '' : `${lang}/`;
  const $ = s => document.querySelector(s);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
    }
    for (const k of kids) if (k != null) n.append(k);
    return n;
  };

  // answers: '0' | '1' | '2' (index into the three answers) | 'n' (not sure) | null
  let answers = new Array(N).fill(null);
  let current = 0;

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ a: answers, c: current })); } catch (e) {} };
  const load = () => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && Array.isArray(d.a) && d.a.length === N) { answers = d.a; current = Math.min(d.c || 0, N - 1); return true; }
    } catch (e) {}
    return false;
  };
  const code = () => answers.map(a => (a == null ? 'n' : a)).join('');
  const CODE_RE = new RegExp(`^#r=([012n]{${N}})$`);

  const points = a => (a === '0' ? 2 : a === '1' ? 1 : 0);
  const isCritical = (i, a) => C.critical.some(([q, bad]) => q === i && bad.includes(a));

  function score() {
    const pts = new Array(AREAS).fill(0), max = new Array(AREAS).fill(0);
    answers.forEach((a, i) => { pts[C.areaOf[i]] += points(a); max[C.areaOf[i]] += 2; });
    const areaPct = pts.map((p, i) => Math.round((p / max[i]) * 100));
    let w = 0, ws = 0;
    areaPct.forEach((p, i) => { ws += p * C.areaWeight[i]; w += C.areaWeight[i]; });
    const total = Math.round(ws / w);
    const critical = answers.some((a, i) => isCritical(i, a));
    const band = critical ? 'fix' : total < 40 ? 'low' : total < 70 ? 'mid' : total < 90 ? 'high' : 'top';
    const fixes = answers
      .map((a, i) => ({ i, rank: (2 - points(a)) * C.areaWeight[C.areaOf[i]] + (isCritical(i, a) ? 10 : 0) - i * 0.001 }))
      .filter(f => f.rank > 0)
      .sort((x, y) => y.rank - x.rank)
      .slice(0, 5)
      .map(f => f.i);
    return { total, areaPct, band, fixes };
  }

  /* ---------- screens ---------- */
  const scrIntro = $('#intro'), scrAsk = $('#ask'), scrResult = $('#result');
  function show(s) {
    for (const x of [scrIntro, scrAsk, scrResult]) x.hidden = x !== s;
    window.scrollTo(0, 0);
  }

  function renderIntro() {
    const hasProgress = answers.some(a => a != null);
    const bars = el('ul', { class: 'bars', 'aria-label': T.areas.join(', ') });
    T.areas.forEach(a => bars.append(el('li', {}, el('span', { class: 'name' }, el('span', { text: a })), el('span', { class: 'track' }))));
    const actions = el('div', { class: 'actions' });
    const startBtn = el('button', { class: 'btn btn-solid', type: 'button', text: hasProgress ? T.resume : T.start });
    startBtn.addEventListener('click', () => { if (!hasProgress) current = 0; renderAsk(); });
    actions.append(startBtn);
    if (hasProgress) {
      const again = el('button', { class: 'btn btn-line', type: 'button', text: T.restart });
      again.addEventListener('click', reset);
      actions.append(again);
    }
    scrIntro.replaceChildren(el('div', { class: 'wrap' },
      el('div', {},
        el('h1', { text: T.h1 }),
        el('p', { class: 'lede', text: T.lede }),
        el('p', { class: 'facts', text: T.facts }),
        actions),
      bars));
    show(scrIntro);
  }

  function renderAsk(focus = true) {
    const [q, opts] = T.q[current];
    const area = C.areaOf[current];
    const prog = el('div', { class: 'progress', 'aria-hidden': 'true' });
    prog.style.gridTemplateColumns = `repeat(${AREAS}, 1fr)`;
    for (let a = 0; a < AREAS; a++) {
      const qs = C.areaOf.map((x, i) => (x === a ? i : -1)).filter(i => i >= 0);
      const done = qs.filter(i => answers[i] != null).length;
      const seg = el('span', {}, el('i'));
      seg.firstChild.style.width = `${(done / qs.length) * 100}%`;
      prog.append(seg);
    }
    const h = el('h2', { id: 'q', tabindex: '-1', text: q });
    const list = el('ul', { class: 'opts', 'aria-labelledby': 'q' });
    opts.forEach((o, k) => {
      const b = el('button', { class: 'opt', type: 'button', 'aria-pressed': String(answers[current] === String(k)) },
        el('span', { class: 'key', 'aria-hidden': 'true', text: String(k + 1) }), el('span', { text: o }));
      b.addEventListener('click', () => choose(String(k)));
      list.append(el('li', {}, b));
    });
    const back = el('button', { class: 'btn btn-text', type: 'button', text: T.back });
    back.addEventListener('click', () => { if (current === 0) renderIntro(); else { current--; save(); renderAsk(); } });
    const unsure = el('button', { class: 'btn btn-line', type: 'button', 'aria-pressed': String(answers[current] === 'n'), text: T.notSure });
    unsure.addEventListener('click', () => choose('n'));
    scrAsk.replaceChildren(el('div', { class: 'wrap' },
      prog,
      el('p', { class: 'where' }, el('b', { text: T.areas[area] }), el('span', { text: T.count(current + 1, N) })),
      h, list,
      el('div', { class: 'nav' }, back, unsure)));
    show(scrAsk);
    if (focus) h.focus({ preventScroll: true });
  }

  let advancing = false;
  function choose(v) {
    if (advancing) return;
    answers[current] = v;
    save();
    scrAsk.querySelectorAll('.opt').forEach((b, k) => b.setAttribute('aria-pressed', String(v === String(k))));
    advancing = true;
    setTimeout(() => {
      advancing = false;
      if (current < N - 1) { current++; save(); renderAsk(); }
      else renderResult();
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 60 : 240);
  }

  const resultsLink = () => `${location.origin}${location.pathname}#r=${code()}`;

  function renderResult() {
    const r = score();
    const [head, why] = T.bands[r.band];
    try { history.replaceState(null, '', `#r=${code()}`); } catch (e) {}

    const bars = el('ul', { class: 'bars' });
    T.areas.forEach((a, i) => {
      const fill = el('span', { class: 'fill' });
      bars.append(el('li', {},
        el('span', { class: 'name' }, el('span', { text: a }), el('span', { class: 'val', text: String(r.areaPct[i]) })),
        el('span', { class: 'track', role: 'img', 'aria-label': `${a}: ${r.areaPct[i]} / 100` }, fill)));
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = `${r.areaPct[i]}%`; }));
    });

    const fixes = el('ol', { class: 'fixes' });
    if (r.fixes.length) {
      r.fixes.forEach(i => fixes.append(el('li', {}, el('div', {}, el('strong', { text: T.q[i][2] })), el('p', { text: T.q[i][3] }))));
    } else {
      fixes.append(el('li', { class: 'none' }, el('p', { text: T.nothing })));
    }

    const areaLines = T.areas.map((a, i) => `${a}: ${r.areaPct[i]}`).join('\n');
    const fixLines = r.fixes.length ? r.fixes.map((i, n) => `${n + 1}. ${T.q[i][2]}`).join('\n') : T.nothing;
    const body = T.body(NAME, r.total, head, areaLines, fixLines, resultsLink());
    const mail = el('a', { class: 'btn btn-solid', href: `mailto:${EMAIL}?subject=${encodeURIComponent(T.subject(NAME, r.total))}&body=${encodeURIComponent(body)}`, text: T.email });
    const copy = el('button', { class: 'btn btn-line', type: 'button', text: T.copy });
    if (navigator.clipboard) {
      copy.addEventListener('click', () => navigator.clipboard.writeText(body).then(() => {
        copy.textContent = T.copied;
        setTimeout(() => { copy.textContent = T.copy; }, 2500);
      }));
    } else copy.hidden = true;
    const again = el('button', { class: 'btn btn-text again', type: 'button', text: T.restart });
    again.addEventListener('click', reset);

    const others = CHECKS.filter(c => c.id !== C.id);
    const otherList = el('ul', { class: 'others' });
    others.forEach(c => otherList.append(el('li', {}, el('a', { href: `${ROOT}${LANGDIR}${c.path}`, text: c.name[lang] || c.name.en }))));

    const h = el('h2', { tabindex: '-1', text: head });
    scrResult.replaceChildren(el('div', { class: 'wrap' },
      el('div', {},
        el('p', { class: 'score' }, el('b', { text: String(r.total) }), T.outOf),
        h,
        el('p', { class: 'why', text: why }),
        bars),
      el('div', {},
        el('h3', { text: T.fixesTitle }),
        fixes,
        el('div', { class: 'send' }, el('p', { text: T.sendText }), el('div', { class: 'actions' }, mail, copy, again)),
        el('p', { class: 'note', text: T.note }),
        others.length ? el('nav', { class: 'other', 'aria-label': T.otherTitle }, el('h3', { text: T.otherTitle }), otherList) : null)));
    show(scrResult);
    h.focus({ preventScroll: true });
  }

  function reset() {
    answers = new Array(N).fill(null);
    current = 0;
    save();
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    renderAsk();
  }

  // Keyboard: 1-3 answer, 0 or N for not sure, Backspace goes back.
  document.addEventListener('keydown', e => {
    if (scrAsk.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (['1', '2', '3'].includes(e.key)) { e.preventDefault(); choose(String(Number(e.key) - 1)); }
    else if (e.key === '0' || e.key.toLowerCase() === 'n') { e.preventDefault(); choose('n'); }
    else if (e.key === 'Backspace' && current > 0) { e.preventDefault(); current--; save(); renderAsk(); }
  });

  // Start: a results link (#r=...) shows those results; otherwise the intro.
  const m = location.hash.match(CODE_RE);
  if (m) { answers = m[1].split(''); renderResult(); }
  else { load(); renderIntro(); }
})();
