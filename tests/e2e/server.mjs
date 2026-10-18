// Statische server voor de gebouwde site (dist/), zonder afhankelijkheden. Ondersteunt het subpad van GitHub Pages:
// met BASE_PATH=/jeugdzorg-routes staat de site op http://127.0.0.1:PORT/jeugdzorg-routes/.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist');
const PORT = Number(process.env.PORT ?? 4400);
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };

if (!fs.existsSync(ROOT)) { console.error(`Geen dist/ gevonden (${ROOT}). Draai eerst npm run build in de hoofdmap.`); process.exit(1); }

http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (!url.pathname.startsWith(BASE)) { res.writeHead(404).end(); return; }
  let rel = decodeURIComponent(url.pathname.slice(BASE.length));
  let file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    const fout = path.join(ROOT, '404.html');
    res.writeHead(404, { 'content-type': TYPES['.html'] }).end(fs.existsSync(fout) ? fs.readFileSync(fout) : 'Niet gevonden');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`dist op http://127.0.0.1:${PORT}${BASE}`));
