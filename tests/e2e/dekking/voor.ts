/** Vóór de testrun: oude meting weg. */
import fs from 'node:fs';
import { CoverageReport } from 'monocart-coverage-reports';
import { AAN, RAPPORT, codeOpties } from './opties';

export default async function () {
  if (!AAN) return;
  fs.rmSync(RAPPORT, { recursive: true, force: true });
  new CoverageReport(codeOpties).cleanCache();
}
