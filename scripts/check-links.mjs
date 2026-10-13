// Controleert alle URL's in de content op bereikbaarheid. Gebruik: npm run links
// 403 wordt apart gemeld: veel overheidssites weren geautomatiseerde verzoeken; dan handmatig nakijken.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['src/content'];
const files = [];
async function walk(dir) { for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name); e.isDirectory() ? await walk(p) : /\.(json|md)$/.test(e.name) && files.push(p); } }
for (const r of roots) await walk(r);

const urls = new Map();
for (const f of files) {
  const txt = await readFile(f, 'utf8');
  // Haakjes horen soms bij het adres ("…(4029738).pdf"); alleen een sluithaakje zonder openingshaakje is leesteken.
  for (const m of txt.matchAll(/https?:\/\/[^\s"'<>\]]+/g)) { let u = m[0].replace(/[.,;:]+$/, ''); while (u.endsWith(')') && (u.match(/\(/g) ?? []).length < (u.match(/\)/g) ?? []).length) u = u.slice(0, -1).replace(/[.,;:]+$/, ''); if (!urls.has(u)) urls.set(u, new Set()); urls.get(u).add(f); }
}
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const check = async (u) => { try { const r = await fetch(u, { method: 'GET', redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(30000) }); return r.status; } catch { return 0; } };

const bad = [], blocked = []; let ok = 0;
const list = Array.from(urls.keys());
for (let i = 0; i < list.length; i += 8) {
  await Promise.all(list.slice(i, i + 8).map(async (u) => { const s = await check(u); if (s >= 200 && s < 400) ok++; else if (s === 403 || s === 429) blocked.push([s, u]); else bad.push([s, u]); }));
}
console.log(`✓ ${ok} bereikbaar`);
if (blocked.length) { console.log(`! ${blocked.length} geblokkeerd voor automatische controle (handmatig nakijken):`); for (const [s, u] of blocked) console.log(`  ${s} ${u}`); }
if (bad.length) { console.log(`✗ ${bad.length} niet bereikbaar:`); for (const [s, u] of bad) console.log(`  ${s || 'timeout'} ${u}\n      in: ${[...urls.get(u)].join(', ')}`); }
process.exit(bad.length ? 1 : 0);
