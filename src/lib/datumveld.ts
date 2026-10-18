/**
 * Datumveld als dd-mm-jjjj: een gewoon tekstveld om in te typen (de streepjes komen vanzelf), met een kalenderknop. De knop opent
 * de datumkiezer van het toestel via een onzichtbaar type="date"-veld: op de computer met showPicker(), op een aanraakscherm ligt
 * dat datumveld onzichtbaar óp de knop (showPicker() werkt daar niet overal). Een klik in het tekstveld opent géén kalender:
 * dan kan de ouder gewoon typen.
 * Een datum uit de kalender staat meteen in het tekstveld, maar het input-event (waarop de pagina rekent) komt pas als de ouder
 * even stilstaat of de kalender sluit. Sommige kalenders geven elke datum door waar de ouder langs gaat; dan rekende de pagina
 * bij elke stap opnieuw. Gebruikt door de rekenhulp (TermijnenHulp.astro) en de verdiepingen in overzicht.astro.
 * Markup: <span class="th-veld"><input data-th-invoer> <button data-th-kalender> <input type="date" data-th-datum></span>.
 * Grenzen voor de kalender: data-min-jaren / data-max-jaren op .th-veld, in jaren vanaf vandaag (negatief = terug), bijvoorbeeld
 * data-min-jaren="-23" data-max-jaren="0" voor een geboortedatum. Typen buiten de grenzen kan nog; de pagina beslist wat dat betekent.
 * data-start-jaren: waar de kalender opent zolang het veld leeg is (anders opent hij op vandaag), bijvoorbeeld "-16" bij een
 * geboortedatum: dan staat de kalender meteen bij kinderen van 16, de leeftijd om over 18 na te denken.
 */
import { leesDatum } from './termijnen';

export const koppelDatumvelden = () => document.querySelectorAll<HTMLElement>('.th-veld:not([data-gekoppeld])').forEach((veld) => {
  veld.setAttribute('data-gekoppeld', '');
  const tekst = veld.querySelector<HTMLInputElement>('[data-th-invoer]')!;
  const datum = veld.querySelector<HTMLInputElement>('[data-th-datum]')!;
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const grens = (jaren?: string) => { if (!jaren) return ''; const d = new Date(); d.setFullYear(d.getFullYear() + +jaren); return iso(d); };
  datum.min = grens(veld.dataset.minJaren);
  datum.max = grens(veld.dataset.maxJaren);
  const neemOver = () => {
    const d = leesDatum(tekst.value);
    datum.value = d ? iso(d) : grens(veld.dataset.startJaren);
  };
  // Typen: na de dag en de maand komt vanzelf een streepje (1402 → 14-02-). Alleen bij typen, niet bij wissen of plakken.
  // Typt de ouder zelf ook een streepje (of punt, schuine streep, spatie), dan telt dat niet dubbel: 01-10-2026 blijft 01-10-2026.
  tekst.addEventListener('input', (e) => {
    if ((e as InputEvent).inputType !== 'insertText') return;
    if (/^(\d{2}-|\d{2}-\d{2}-)[-./ ]$/.test(tekst.value)) tekst.value = tekst.value.slice(0, -1);
    else if (/^\d{2}$|^\d{2}-\d{2}$/.test(tekst.value)) tekst.value += '-';
  });
  if (matchMedia('(pointer: coarse)').matches) {
    veld.classList.add('th-aanraak');
    datum.addEventListener('pointerdown', neemOver);
  } else {
    veld.querySelector('[data-th-kalender]')?.addEventListener('click', () => {
      neemOver();
      try { (datum as any).showPicker(); } catch { datum.focus(); /* geen showPicker: dan typt de ouder de datum */ }
    });
  }
  // Uit de kalender: meteen in het tekstveld, doorgeven na even stilstaan of bij het sluiten van de kalender.
  let wacht: ReturnType<typeof setTimeout> | undefined;
  const geefDoor = () => {
    clearTimeout(wacht);
    wacht = undefined;
    tekst.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const uitKalender = () => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum.value);
    // Leeg: gewist in de kalender van het toestel (iOS "Wis").
    if (!m && (datum.value || !tekst.value)) return;
    const nieuw = m ? `${m[3]}-${m[2]}-${m[1]}` : '';
    if (nieuw === tekst.value) return;
    tekst.value = nieuw;
    clearTimeout(wacht);
    wacht = setTimeout(geefDoor, 800);
  };
  datum.addEventListener('input', uitKalender);
  datum.addEventListener('change', uitKalender);
  datum.addEventListener('blur', () => { if (wacht !== undefined) geefDoor(); });
});
