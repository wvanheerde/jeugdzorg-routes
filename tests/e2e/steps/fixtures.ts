/**
 * Vaste testomgeving voor elk scenario:
 * - de klok staat op 18 oktober 2026, 10.00 uur (de site rekent met "vandaag"); "Gegeven het is …" zet een andere datum;
 *   timers lopen gewoon door, alleen de datum staat stil;
 * - geen verkeer naar buiten (alleen de lokale testserver), zodat externe diensten de uitkomst niet beïnvloeden;
 * - elke test een nieuwe browsercontext, dus lege localStorage (dat doet Playwright zelf);
 * - showPicker() (de kalender van het toestel) wordt geteld in window.__kalender, zodat een scenario kan zien of die opende.
 */
import { test as base, createBdd } from 'playwright-bdd';
import { CoverageReport } from 'monocart-coverage-reports';
import { AAN, codeOpties, noteerBezoek } from '../dekking/opties';

export const STANDAARD_DATUM = new Date('2026-10-18T10:00:00+02:00');

export const test = base.extend<{ vasteOmgeving: void; dekking: void }>({
  // Dekkingsmeting (alleen met DEKKING=1, alleen Chromium): uitgevoerde code en bezochte of opgehaalde pagina's.
  dekking: [async ({ page, browserName }, use, testInfo) => {
    if (!AAN) return use();
    const meten = browserName === 'chromium';
    if (meten) await page.coverage.startJSCoverage({ resetOnNavigation: false });
    const paden = new Set<string>();
    page.on('response', (r) => {
      const t = r.request().resourceType();
      if ((t === 'document' || t === 'fetch') && (r.headers()['content-type'] ?? '').includes('text/html')) paden.add(new URL(r.url()).pathname);
    });
    await use();
    if (meten) await new CoverageReport(codeOpties).add(await page.coverage.stopJSCoverage());
    noteerBezoek(`${testInfo.project.name} › ${testInfo.titlePath.slice(1).join(' › ')}`, [...paden]);
  }, { auto: true }],

  vasteOmgeving: [async ({ page, context, baseURL }, use) => {
    const eigen = new URL(baseURL!).origin;
    await context.route((url) => url.origin !== eigen, (route) => route.abort());
    await page.clock.setFixedTime(STANDAARD_DATUM);
    await page.addInitScript(() => {
      (window as any).__kalender = 0;
      HTMLInputElement.prototype.showPicker = function () { (window as any).__kalender++; };
    });
    await use();
  }, { auto: true }],
});

export const { Given, When, Then } = createBdd(test);
