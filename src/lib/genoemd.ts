/**
 * Landelijke organisaties die in een tekst bij naam worden genoemd. Hun nummer en website staan dan in een regeltje onder
 * die tekst (component OrgRegel), niet in de zin zelf (persona-tests ronde 21).
 * `gehad`: organisaties die al eerder een regeltje kregen (per lijst van stappen maar één keer).
 */
export const korteNaam = (naam: string) => naam.replace(/^Het /, '').replace(/ \(.*\)$/, '');

export const genoemdIn = <O extends { id: string; data: { naam: string; genoemdAls: string[] } }>(tekst: string, organisaties: O[], gehad?: Set<string>) =>
  organisaties.filter((o) => {
    if (gehad?.has(o.id)) return false;
    if (![korteNaam(o.data.naam), ...o.data.genoemdAls].some((n) => tekst.includes(n))) return false;
    gehad?.add(o.id);
    return true;
  });
