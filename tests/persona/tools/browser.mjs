#!/usr/bin/env node
// Browser-driver voor persona-tests. Een agent bedient hiermee stap voor stap een echte browser,
// zoals een ouder dat zou doen. Elke stap komt in een log, zodat runs vergelijkbaar zijn.
//
//   node browser.mjs start <sessie> <mobiel|desktop> <logmap>   start een browser op de achtergrond
//   node browser.mjs <sessie> open <url>                       ga naar een adres
//   node browser.mjs <sessie> kijk                             toon wat nu in beeld is als tekst, met [nummers] voor wat je kunt aanklikken
//   node browser.mjs <sessie> klik <nr>                        klik op een link of knop
//   node browser.mjs <sessie> typ <nr> <tekst>                 typ in een invoerveld (vervangt de inhoud)
//   node browser.mjs <sessie> kies <nr> <optie>                kies een optie in een keuzelijst
//   node browser.mjs <sessie> toets <Enter|Tab|Escape>         druk op een toets
//   node browser.mjs <sessie> scroll <omlaag|omhoog|nr>        scroll ongeveer een scherm (en toon het nieuwe beeld), of naar een element
//   node browser.mjs <sessie> terug                            vorige pagina
//   node browser.mjs <sessie> foto                             schermafbeelding van wat nu in beeld is (pad wordt getoond)
//   node browser.mjs <sessie> notitie <tekst>                  zet een gedachte van de persona in het log
//   node browser.mjs <sessie> stop                             sluit de browser
//
// Vereist: npm install in deze map, `npx playwright install chromium`, en de systeembibliotheken
// uit setup.sh (in containers zonder root).

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const STATE = path.join(os.tmpdir(), 'jr-browser');
fs.mkdirSync(STATE, { recursive: true });
const statePath = (s) => path.join(STATE, `${s}.json`);
const LIBS = path.join(os.homedir(), '.cache', 'jr-browser-libs');

const [, , a1, a2, ...rest] = process.argv;

if (a1 === 'start') {
  const [device = 'mobiel', logDir] = rest;
  if (!a2 || !logDir) fail('Gebruik: start <sessie> <mobiel|desktop> <logmap>');
  if (fs.existsSync(statePath(a2))) fail(`Sessie ${a2} draait al. Stop hem eerst.`);
  fs.mkdirSync(path.join(logDir, 'screens'), { recursive: true });
  const child = spawn(process.execPath, [new URL(import.meta.url).pathname, '__serve', a2, device, path.resolve(logDir)], {
    detached: true, stdio: 'ignore',
  });
  child.unref();
  for (let i = 0; i < 300; i++) {
    await sleep(200);
    if (fs.existsSync(statePath(a2))) { console.log(`Sessie ${a2} gestart (${device}). Log: ${logDir}`); process.exit(0); }
  }
  fail('Browser startte niet. Draai setup.sh en probeer opnieuw.');
} else if (a1 === '__serve') {
  await serve(a2, rest[0], rest[1]);
} else {
  if (!a1 || !a2) fail('Gebruik: <sessie> <commando> [argumenten]. Zie de kop van dit bestand.');
  const st = readState(a1);
  const res = await post(st.port, { cmd: a2, args: rest });
  process.stdout.write(res.endsWith('\n') ? res : res + '\n');
}

function readState(s) {
  if (!fs.existsSync(statePath(s))) fail(`Sessie ${s} bestaat niet. Start hem met: start ${s} mobiel <logmap>`);
  return JSON.parse(fs.readFileSync(statePath(s), 'utf8'));
}

function post(port, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method: 'POST', path: '/' }, (r) => {
      let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.end(JSON.stringify(body));
  });
}

async function serve(sessie, device, logDir) {
  const { chromium, devices } = await import('playwright');
  const env = { ...process.env };
  if (fs.existsSync(LIBS)) {
    const lib = [`${LIBS}/root/usr/lib/aarch64-linux-gnu`, `${LIBS}/root/lib/aarch64-linux-gnu`,
      `${LIBS}/root/usr/lib/x86_64-linux-gnu`, `${LIBS}/root/lib/x86_64-linux-gnu`].join(':');
    env.LD_LIBRARY_PATH = [lib, env.LD_LIBRARY_PATH].filter(Boolean).join(':');
    if (fs.existsSync(`${LIBS}/fonts.conf`)) env.FONTCONFIG_FILE = `${LIBS}/fonts.conf`;
  }
  const browser = await chromium.launch({ env });
  const ctxOpts = device === 'desktop'
    ? { viewport: { width: 1366, height: 800 }, locale: 'nl-NL' }
    : { ...devices['iPhone 13'], locale: 'nl-NL' };
  const context = await browser.newContext(ctxOpts);
  const page = await context.newPage();
  const logFile = path.join(logDir, 'log.jsonl');
  let stap = 0;
  let fotoNr = 0;
  const log = (o) => fs.appendFileSync(logFile, JSON.stringify({ stap: ++stap, tijd: new Date().toISOString(), url: page.url(), ...o }) + '\n');
  log({ cmd: 'start', device });

  const handlers = {
    async open([url]) { await page.goto(url, { waitUntil: 'domcontentloaded' }); await settle(); return `Geopend: ${page.url()}\nTitel: ${await page.title()}`; },
    async kijk() { return await snapshot(page); },
    async klik([nr]) {
      const el = page.locator(`[data-jr-ref="${nr}"]`);
      if (!(await el.count())) return `Element ${nr} niet gevonden. Doe eerst 'kijk' (nummers veranderen na elke pagina).`;
      const voor = page.url();
      const popup = context.waitForEvent('page', { timeout: 1500 }).catch(() => null);
      await el.first().click({ timeout: 5000 });
      const nieuw = await popup;
      if (nieuw) { const u = nieuw.url(); await nieuw.close(); return `Link opent een nieuw tabblad naar een andere site: ${u}\n(Tabblad gesloten; je bent nog op ${page.url()}.)`; }
      await settle();
      return page.url() !== voor ? `Nieuwe pagina: ${page.url()}\nTitel: ${await page.title()}` : `Geklikt. Nog op ${page.url()}. Doe 'kijk' om te zien wat er veranderde.`;
    },
    async typ([nr, ...t]) { await page.locator(`[data-jr-ref="${nr}"]`).first().fill(t.join(' ')); await settle(); return `Getypt in ${nr}: ${t.join(' ')}`; },
    async kies([nr, ...t]) {
      const el = page.locator(`[data-jr-ref="${nr}"]`).first();
      const want = t.join(' ');
      try { await el.selectOption({ label: want }); } catch { await el.selectOption(want); }
      await settle(); return `Gekozen in ${nr}: ${want}`;
    },
    async toets([k]) { await page.keyboard.press(k); await settle(); return `Toets ${k} ingedrukt. Nu op ${page.url()}`; },
    async scroll([w = 'omlaag']) {
      if (/^\d+$/.test(w)) await page.locator(`[data-jr-ref="${w}"]`).first().scrollIntoViewIfNeeded();
      else await page.evaluate((d) => window.scrollBy(0, d * window.innerHeight * 0.9), w === 'omhoog' ? -1 : 1);
      return await snapshot(page);
    },
    async terug() { await page.goBack(); await settle(); return `Terug naar ${page.url()}`; },
    async foto() {
      const f = path.join(logDir, 'screens', `${String(++fotoNr).padStart(2, '0')}.png`);
      await page.screenshot({ path: f });
      return `Schermafbeelding: ${f}`;
    },
    async notitie() { return 'Notitie opgeslagen.'; },
  };

  async function settle() { await page.waitForLoadState('domcontentloaded').catch(() => {}); await page.waitForTimeout(300); }

  const server = http.createServer((req, res) => {
    let d = ''; req.on('data', (c) => (d += c));
    req.on('end', async () => {
      const { cmd, args } = JSON.parse(d || '{}');
      let out;
      try {
        if (cmd === 'stop') { log({ cmd: 'stop' }); res.end('Browser gesloten.'); await browser.close(); fs.rmSync(statePath(sessie), { force: true }); server.close(); process.exit(0); }
        const h = handlers[cmd];
        out = h ? await h(args) : `Onbekend commando: ${cmd}`;
        const entry = { cmd, args };
        if (cmd === 'kijk') entry.lengte = out.length;
        if (cmd === 'notitie') entry.tekst = args.join(' ');
        log(entry);
      } catch (e) { out = `Fout: ${e.message.split('\n')[0]}`; log({ cmd, args, fout: out }); }
      res.end(out);
    });
  });
  server.listen(0, '127.0.0.1', () => {
    fs.writeFileSync(statePath(sessie), JSON.stringify({ port: server.address().port, logDir }));
  });
}

async function snapshot(page) {
  const r = await page.evaluate(() => {
    const vh = window.innerHeight;
    const INTER = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab]';
    document.querySelectorAll('[data-jr-ref]').forEach((e) => e.removeAttribute('data-jr-ref'));
    let ref = 0;
    const vis = (el) => el.checkVisibility ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : !!el.offsetParent;
    const isBlock = (el) => {
      const d = getComputedStyle(el).display;
      return !(d.startsWith('inline') || d === 'contents') || /^(LI|P|H[1-6]|TD|TH|DT|DD|LABEL|SUMMARY|FIGCAPTION|BLOCKQUOTE|PRE|LEGEND|CAPTION|TR)$/.test(el.tagName);
    };
    const labelOf = (el) => {
      const l = el.labels?.[0];
      if (!l) return (el.getAttribute('aria-label') || el.placeholder || '').trim();
      const c = l.cloneNode(true); c.querySelectorAll('select,input,textarea,option').forEach((x) => x.remove());
      return c.textContent.replace(/\s+/g, ' ').trim();
    };
    const describe = (el) => {
      if (el.hasAttribute('data-jr-ref')) return '';
      const n = ++ref; el.setAttribute('data-jr-ref', String(n));
      const t = (el.getAttribute('aria-label') || (el.tagName === 'SELECT' ? '' : el.innerText) || el.value || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 120);
      const tag = el.tagName;
      if (tag === 'A') {
        const href = el.getAttribute('href') || '';
        const extern = el.target === '_blank' || (/^https?:/.test(href) && !href.startsWith(location.origin));
        const tel = href.startsWith('tel:'); const mail = href.startsWith('mailto:');
        return `[${n} ${tel ? 'telefoonlink' : mail ? 'maillink' : extern ? 'link naar andere site' : 'link'}: ${t || href}]`;
      }
      if (tag === 'SELECT') {
        const opts = [...el.options].map((o) => o.text.trim()).filter(Boolean);
        const sel = el.options[el.selectedIndex]?.text.trim() || '';
        const lab = labelOf(el);
        return `[${n} keuzelijst${lab ? ' "' + lab + '"' : ''}: gekozen "${sel}"; opties: ${opts.slice(0, 25).join(' | ')}${opts.length > 25 ? ` | … (${opts.length} totaal)` : ''}]`;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        const type = el.type;
        const label = labelOf(el);
        if (type === 'checkbox' || type === 'radio') return `[${n} ${type === 'radio' ? 'keuzerondje' : 'vinkje'} "${label}" ${el.checked ? 'AAN' : 'uit'}]`;
        return `[${n} invoerveld "${label}"${el.value ? ` waarde="${el.value}"` : ''}]`;
      }
      if (tag === 'SUMMARY') return `[${n} uitklapper: ${t}${el.parentElement?.open ? ' (open)' : ' (dicht)'}]`;
      return `[${n} knop: ${t}]`;
    };
    // Loop de DOM in documentvolgorde door. Tekst en klikbare elementen komen in een regelbuffer;
    // bij elke blokgrens (kop, alinea, lijstitem, div …) wordt de buffer een regel. Zo klopt de volgorde altijd.
    const out = [];
    let buf = [];
    let bufInBeeld = false;
    const flush = (tag) => {
      const line = buf.join('').replace(/\s+/g, ' ').trim();
      if (line) {
        const m = (tag || '').match(/^H([1-6])$/);
        out.push({ inBeeld: bufInBeeld, line: m ? `${'#'.repeat(+m[1])} ${line}` : tag === 'LI' ? `- ${line}` : line });
      }
      buf = []; bufInBeeld = false;
    };
    const inView = (el) => { const rc = el.getBoundingClientRect(); return rc.bottom > 0 && rc.top < vh && rc.height >= 0; };
    const trav = (el, tag) => {
      for (const c of el.childNodes) {
        if (c.nodeType === 3) {
          if (c.textContent.trim()) { buf.push(c.textContent); if (c.parentElement && inView(c.parentElement)) bufInBeeld = true; }
          continue;
        }
        if (c.nodeType === 1 && c.tagName === 'BR') { buf.push(' / '); continue; } // regelovergang zichtbaar houden (bv. postadres in een brief)
        if (c.nodeType !== 1 || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG)$/i.test(c.tagName) || !vis(c)) continue;
        if (c.matches(INTER)) { const d = describe(c); if (d) { buf.push(' ' + d + ' '); if (inView(c)) bufInBeeld = true; } continue; }
        if (c.tagName === 'IMG') { if (c.alt) buf.push(` (afbeelding: ${c.alt}) `); continue; }
        if (isBlock(c)) { flush(tag); trav(c, c.tagName); flush(c.tagName); }
        else trav(c, tag);
      }
    };
    trav(document.body, 'BODY');
    flush('BODY');
    const lines = out.filter((o) => o.inBeeld).map((o) => o.line);
    const nu = Math.round(window.scrollY / vh) + 1;
    return { title: document.title, url: location.href, nu, totaal: Math.ceil(document.documentElement.scrollHeight / vh), lines };
  });
  return `Titel: ${r.title}\nAdres: ${r.url}\nScherm ${r.nu} van ${r.totaal}. Hieronder staat alleen wat nu in beeld is; scroll om meer te zien.\n\n${r.lines.join('\n')}`;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function fail(m) { console.error(m); process.exit(1); }
