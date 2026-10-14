/**
 * Haalt de blokken van één gemeente op (src/pages/gemeente-blokken/[slug].astro) en zet ze in de pagina, in plaats van
 * alle 342 gemeenten in elke pagina mee te sturen. Elk element met data-gemeente-slot="naam" krijgt de inhoud van
 * <template data-slot="naam">; wat er van een eerder gekozen gemeente stond, gaat eruit.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const cache = new Map<string, Promise<Document | null>>();
const haal = (slug: string) => {
  if (!cache.has(slug)) {
    cache.set(slug, fetch(`${base}/gemeente-blokken/${slug}/`)
      .then((r) => (r.ok ? r.text() : null))
      .then((t) => (t ? new DOMParser().parseFromString(t, 'text/html') : null))
      // Geen verbinding: niet onthouden, zodat een volgende keuze het opnieuw probeert.
      .catch(() => { cache.delete(slug); return null; }));
  }
  return cache.get(slug)!;
};

let laatste: string | undefined;
/** Zet de blokken van deze gemeente in de pagina. Geeft false als er intussen een andere gemeente gekozen is. */
export const laadGemeente = async (slug: string) => {
  laatste = slug;
  const doc = /^[a-z0-9-]+$/.test(slug) ? await haal(slug) : null;
  if (slug !== laatste) return false;
  document.querySelectorAll<HTMLElement>('[data-gemeente-slot]').forEach((plek) => {
    plek.querySelectorAll(':scope > [data-geladen]').forEach((e) => e.remove());
    const tpl = doc?.querySelector<HTMLTemplateElement>(`template[data-slot="${plek.dataset.gemeenteSlot}"]`);
    if (!tpl) return;
    Array.from(document.importNode(tpl.content, true).children).forEach((e) => { e.setAttribute('data-geladen', ''); plek.append(e); });
  });
  return true;
};
