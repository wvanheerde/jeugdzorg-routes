/**
 * Gedragstests voor Jeugdzorg Routes: Gherkin in het Nederlands (features/), uitgevoerd met Playwright via playwright-bdd.
 * Deterministisch: vaste datum en tijdzone, geen verkeer naar buiten, elke test een schone browser (zie steps/fixtures.ts).
 * Draait tegen de gebouwde site (dist/) via server.mjs. Zie TECHNIEK.md, "Tests".
 */
import fs from 'node:fs';
import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const PORT = 4400;
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const CI = !!process.env.CI;

// In de devcontainer staan de systeembibliotheken van Chromium in een eigen map (tests/persona/tools/setup.sh).
const LIBS = `${os.homedir()}/.cache/jr-browser-libs`;
const launchOptions = fs.existsSync(LIBS)
  ? {
      env: {
        ...process.env,
        LD_LIBRARY_PATH: [
          `${LIBS}/root/usr/lib/aarch64-linux-gnu`,
          `${LIBS}/root/lib/aarch64-linux-gnu`,
          `${LIBS}/root/usr/lib/x86_64-linux-gnu`,
          `${LIBS}/root/lib/x86_64-linux-gnu`,
        ].join(':'),
        ...(fs.existsSync(`${LIBS}/fonts.conf`) ? { FONTCONFIG_FILE: `${LIBS}/fonts.conf` } : {}),
      },
    }
  : {};

const testDir = defineBddConfig({ features: 'features/**/*.feature', steps: 'steps/**/*.ts', language: 'nl' });

export default defineConfig({
  testDir,
  // Dekkingsmeting (DEKKING=1): opruimen vooraf, rapport achteraf. Zonder DEKKING doen deze niets.
  globalSetup: './dekking/voor.ts',
  globalTeardown: './dekking/na.ts',
  fullyParallel: true,
  forbidOnly: CI,
  retries: 0, // deterministisch: een test die soms faalt is een fout, geen pech
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}${BASE}`,
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
    trace: 'retain-on-failure',
    launchOptions,
  },
  webServer: {
    command: 'node server.mjs',
    url: `http://127.0.0.1:${PORT}${BASE}`,
    reuseExistingServer: !CI,
    env: { PORT: String(PORT), BASE_PATH: BASE },
  },
  projects: [
    // Losse functies uit src/lib, zonder browser.
    { name: 'unit', testDir: './unit' },
    // Elk scenario op laptop en telefoon; @desktop of @mobiel beperkt een scenario tot één van beide.
    { name: 'desktop', grepInvert: /@mobiel/, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobiel', grepInvert: /@desktop/, use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
});
