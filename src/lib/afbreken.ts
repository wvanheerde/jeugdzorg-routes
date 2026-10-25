/**
 * Nette afbreekplek in lange samenstellingen in koppen: een zachte afbreekstreep vóór het laatste deel
 * ("Zindelijkheids-training", "Taalontwikkelings-stoornis"). De browser breekt koppen zelf niet meer af (zie styles/basis.css,
 * hyphens: manual); met automatisch afbreken brak hij ook korte woorden en lange woorden op rare plekken.
 */
const DELEN = [
  'training',
  'therapie',
  'behandeling',
  'begeleiding',
  'ondersteuning',
  'verwerking',
  'preventie',
  'gebruik',
  'stoornis',
  'stoornissen',
  'problemen',
  'zorg',
  'onderzoek',
  'interventie',
  'bemiddeling',
  'beperking',
  'begaafdheid',
];
const MIN_WOORD = 13;
const MIN_BEGIN = 5;
export const afbreken = (tekst: string) =>
  tekst.replace(/[\p{L}]+/gu, (w) => {
    if (w.length < MIN_WOORD) return w;
    const klein = w.toLowerCase();
    const deel = DELEN.filter((d) => klein.endsWith(d) && w.length - d.length >= MIN_BEGIN).sort((a, b) => b.length - a.length)[0];
    return deel ? `${w.slice(0, -deel.length)}­${w.slice(-deel.length)}` : w;
  });
