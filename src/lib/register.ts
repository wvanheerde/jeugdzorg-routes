/** Het register van gemeenten (scripts/data/gemeenten-register.json, uit het Register van Overheidsorganisaties), op CBS-code. */
import data from '../../scripts/data/gemeenten-register.json';

export type RegisterGemeente = {
  naam: string;
  cbsCode: string;
  provincie?: string;
  website?: string;
  telefoon?: string;
  inwoners?: number;
  postadres?: string;
};

const opCode = new Map((data.gemeenten as RegisterGemeente[]).map((g) => [g.cbsCode, g]));

/** De gegevens uit het register bij een CBS-code (GM0014), of undefined. */
export const registerVan = (cbsCode: string): RegisterGemeente | undefined => opCode.get(cbsCode);
/** Wanneer de postadressen in het register zijn opgehaald (voor de bronvermelding). */
export const postadresGeraadpleegd: string = data.postadresGeraadpleegd;
