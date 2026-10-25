/**
 * Haalt de blokken van één gemeente op (src/pages/gemeente-blokken/[slug].astro) en zet ze in de pagina, in plaats van
 * alle 342 gemeenten in elke pagina mee te sturen. Elk element met data-gemeente-slot="naam" krijgt de inhoud van
 * <template data-slot="naam">; wat er van een eerder gekozen gemeente stond, gaat eruit.
 */
import { base } from '../site';

const cache = new Map<string, Promise<Document | null>>();
const haal = (slug: string) => {
  if (!cache.has(slug)) {
    cache.set(
      slug,
      fetch(`${base}/gemeente-blokken/${slug}/`)
        .then((r) => (r.ok ? r.text() : null))
        .then((t) => (t ? new DOMParser().parseFromString(t, 'text/html') : null))
        // Geen verbinding: niet onthouden, zodat een volgende keuze het opnieuw probeert.
        .catch(() => {
          cache.delete(slug);
          return null;
        }),
    );
  }
  return cache.get(slug)!;
};

/** Zet de templates uit doc in de elementen met dit attribuut (de waarde is de naam van de template). */
const vul = (doc: Document | null, attr: string) => {
  document.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((plek) => {
    plek.querySelectorAll(':scope > [data-geladen]').forEach((e) => e.remove());
    const tpl = doc?.querySelector<HTMLTemplateElement>(`template[data-slot="${plek.getAttribute(attr)}"]`);
    if (!tpl) return;
    Array.from(document.importNode(tpl.content, true).children).forEach((e) => {
      e.setAttribute('data-geladen', '');
      plek.append(e);
    });
  });
};
const haalVeilig = (slug: string) => (/^[a-z0-9-]+$/.test(slug) ? haal(slug) : Promise.resolve(null));

let laatste: string | undefined;
/** Zet de blokken van deze gemeente in de pagina. Geeft false als er intussen een andere gemeente gekozen is. */
export const laadGemeente = async (slug: string) => {
  laatste = slug;
  const doc = await haalVeilig(slug);
  if (slug !== laatste) return false;
  vul(doc, 'data-gemeente-slot');
  return true;
};

let laatsteNieuw: string | undefined;
/**
 * De gemeente waar het gezin naartoe verhuist (verdieping bij "Wij verhuizen"): dezelfde templates, maar in de elementen
 * met data-nieuwe-gemeente-slot, zodat de blokken van de huidige gemeente blijven staan.
 */
export const laadNieuweGemeente = async (slug: string) => {
  laatsteNieuw = slug;
  const doc = await haalVeilig(slug);
  if (slug !== laatsteNieuw) return false;
  vul(doc, 'data-nieuwe-gemeente-slot');
  return true;
};
