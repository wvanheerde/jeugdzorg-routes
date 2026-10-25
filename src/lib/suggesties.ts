/**
 * Suggestielijst onder een tekstveld, in plaats van een <datalist>. Een datalist met alle woonplaatsen (ruim 2000) maakte
 * de telefoon traag: het leek alsof de browser vastliep. Deze lijst toont hooguit een paar treffers voor wat er getypt is.
 * Kiezen zet de tekst in het veld en geeft een input- en change-event, zodat de pagina dezelfde code houdt als bij typen.
 * Gebruikt door de gemeentekeuze (zoeken op woonplaats) en de verdieping bij de verhuizing (src/scripts/overzicht/verhuizing.ts).
 */
const MAX = 8;
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
let teller = 0;

/** `labels` geeft de keuzes; die mag later aanvullen (de woonplaatsen laden pas bij het eerste gebruik). */
export const koppelSuggesties = (invoer: HTMLInputElement, labels: () => string[]) => {
  const id = `sug-${++teller}`;
  const lijst = Object.assign(document.createElement('ul'), { id, className: 'suggesties', hidden: true });
  lijst.setAttribute('role', 'listbox');
  // Buiten het label, anders horen de opties bij de naam van het veld.
  const anker = invoer.closest('label') ?? invoer;
  anker.after(lijst);
  if (getComputedStyle(anker.parentElement!).position === 'static') anker.parentElement!.style.position = 'relative';
  invoer.removeAttribute('list');
  invoer.setAttribute('role', 'combobox');
  invoer.setAttribute('aria-autocomplete', 'list');
  invoer.setAttribute('aria-controls', id);
  invoer.setAttribute('aria-expanded', 'false');

  let bron: string[] = [],
    index: { label: string; n: string; woorden: string[] }[] = [];
  let treffers: string[] = [],
    actief = -1,
    zelf = false;
  const sluit = () => {
    lijst.hidden = true;
    actief = -1;
    invoer.setAttribute('aria-expanded', 'false');
    invoer.removeAttribute('aria-activedescendant');
  };
  const markeer = () =>
    lijst.querySelectorAll('li').forEach((li, i) => {
      li.setAttribute('aria-selected', String(i === actief));
      if (i === actief) {
        invoer.setAttribute('aria-activedescendant', li.id);
        li.scrollIntoView({ block: 'nearest' });
      }
    });
  const kies = (label: string) => {
    zelf = true;
    invoer.value = label;
    invoer.dispatchEvent(new Event('input', { bubbles: true }));
    invoer.dispatchEvent(new Event('change', { bubbles: true }));
    zelf = false;
    sluit();
  };
  const toon = () => {
    const nu = labels();
    if (nu !== bron || nu.length !== index.length) {
      bron = nu;
      // Zoeken in de plaatsnaam, niet in "(gemeente …)": anders komen bij "alm" alle dorpen van Almelo mee.
      index = nu.map((label) => {
        const n = norm(label.replace(/\s*\(.*\)$/, ''));
        return { label, n, woorden: n.split(/[\s'-]+/) };
      });
    }
    const q = norm(invoer.value);
    if (!q) return sluit();
    // Eerst wat met de getypte letters begint, dan een woord dat ermee begint, dan de rest waar het in staat.
    const begin: string[] = [],
      woord: string[] = [],
      ergens: string[] = [];
    for (const e of index) {
      if (e.n.startsWith(q)) begin.push(e.label);
      else if (e.woorden.some((w) => w.startsWith(q))) woord.push(e.label);
      else if (q.length > 3 && e.n.includes(q)) ergens.push(e.label);
    }
    // Blijft de gemarkeerde keuze in de lijst (bijvoorbeeld als de woonplaatsen later binnenkomen), dan blijft die gemarkeerd.
    const gemarkeerd = actief >= 0 ? treffers[actief] : null;
    treffers = [...begin, ...woord, ...ergens].slice(0, MAX);
    if (!treffers.length || (treffers.length === 1 && norm(treffers[0]) === q)) return sluit();
    actief = gemarkeerd ? treffers.indexOf(gemarkeerd) : -1;
    lijst.replaceChildren(
      ...treffers.map((t, i) => {
        const li = Object.assign(document.createElement('li'), { id: `${id}-${i}`, textContent: t });
        li.setAttribute('role', 'option');
        return li;
      }),
    );
    if (actief >= 0) markeer();
    const r = invoer.getBoundingClientRect(),
      p = (lijst.offsetParent ?? anker.parentElement!).getBoundingClientRect();
    Object.assign(lijst.style, { left: `${r.left - p.left}px`, top: `${r.bottom - p.top + 2}px`, width: `${r.width}px` });
    lijst.hidden = false;
    invoer.setAttribute('aria-expanded', 'true');
  };

  invoer.addEventListener('input', () => {
    if (!zelf) toon();
  });
  invoer.addEventListener('blur', sluit);
  // Op de telefoon het veld naar boven halen, anders valt de lijst achter het toetsenbord. De vaste kop is ±5rem hoog.
  if (matchMedia('(pointer: coarse)').matches)
    invoer.addEventListener('focus', () =>
      setTimeout(() => {
        const boven = invoer.getBoundingClientRect().top,
          kop = 5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        if (boven > window.innerHeight * 0.35 || boven < kop) window.scrollBy({ top: boven - kop, behavior: 'smooth' });
      }, 300),
    );
  invoer.addEventListener('keydown', (e) => {
    if (lijst.hidden) {
      if (e.key === 'ArrowDown' && invoer.value) toon();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      actief = (actief + (e.key === 'ArrowDown' ? 1 : -1) + treffers.length + 1) % (treffers.length + 1);
      if (actief === treffers.length) actief = -1;
      markeer();
    } else if (e.key === 'Enter' && actief >= 0) {
      e.preventDefault();
      kies(treffers[actief]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      sluit();
    }
  });
  // pointerdown houdt de focus in het veld (anders sluit blur de lijst vóór de klik).
  lijst.addEventListener('pointerdown', (e) => e.preventDefault());
  lijst.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest('li');
    if (li) kies(li.textContent!);
  });
  return {
    ververs: () => {
      if (document.activeElement === invoer) toon();
    },
  };
};
