/**
 * Datumveld als dd-mm-jjjj: een tekstveld met een kalenderknop. De knop (en op een toestel met kalender ook een klik in het veld)
 * opent de datumkiezer van het toestel via een onzichtbaar type="date"-veld; de keuze komt als dd-mm-jjjj in het tekstveld en
 * geeft een input-event. Op een aanraakscherm ligt dat datumveld bovenop (class th-aanraak), zodat een tik het direct opent:
 * showPicker() werkt daar niet overal, en met het toetsenbord uit kon de ouder dan niets. Gebruikt door de rekenhulp (TermijnenHulp.astro) en de verdieping bij de verhuizing (overzicht.astro).
 * Markup: <span class="th-veld"><input data-th-invoer> <button data-th-kalender> <input type="date" data-th-datum></span>.
 */
import { leesDatum } from './termijnen';

export const koppelDatumvelden = () => document.querySelectorAll<HTMLElement>('.th-veld:not([data-gekoppeld])').forEach((veld) => {
  veld.setAttribute('data-gekoppeld', '');
  const tekst = veld.querySelector<HTMLInputElement>('[data-th-invoer]')!;
  const datum = veld.querySelector<HTMLInputElement>('[data-th-datum]')!;
  const kanKiezen = 'showPicker' in HTMLInputElement.prototype;
  const neemOver = () => {
    const d = leesDatum(tekst.value);
    datum.value = d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
  };
  if (matchMedia('(pointer: coarse)').matches) {
    veld.classList.add('th-aanraak');
    datum.addEventListener('pointerdown', neemOver);
  } else {
    const open = () => {
      neemOver();
      try { (datum as any).showPicker(); } catch { /* geen kalender: dan typt de ouder de datum */ }
    };
    veld.querySelector('[data-th-kalender]')?.addEventListener('click', open);
    // Klik in het veld opent ook de kalender; typen blijft kunnen.
    if (kanKiezen) {
      // Alleen een klik direct op het veld; een klik op het label wordt door de browser doorgegeven aan het veld en telt niet.
      let opVeld = false;
      tekst.addEventListener('pointerdown', () => (opVeld = true));
      tekst.addEventListener('click', () => { if (opVeld) open(); opVeld = false; });
    }
  }
  datum.addEventListener('change', () => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum.value);
    // Leeg: gewist in de kalender van het toestel (iOS "Wis").
    if (!m && (datum.value || !tekst.value)) return;
    tekst.value = m ? `${m[3]}-${m[2]}-${m[1]}` : '';
    tekst.dispatchEvent(new Event('input', { bubbles: true }));
  });
});
