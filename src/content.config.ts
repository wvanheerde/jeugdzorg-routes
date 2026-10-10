/**
 * CONTENT SCHEMA — enige bron van waarheid voor de informatiestructuur.
 *
 * Elke gemeente volgt exact dezelfde structuur, zodat:
 *  1. ouders op elke gemeentepagina dezelfde indeling zien;
 *  2. een agent de data per gemeente geautomatiseerd kan bijwerken
 *     (zie CONTENT.md voor de werkwijze).
 *
 * `npm run build` faalt als een bestand niet aan dit schema voldoet.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ---------- Herbruikbare bouwstenen ---------- */

const bron = z.object({
  titel: z.string(),
  url: z.string().url(),
  geraadpleegd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Gebruik JJJJ-MM-DD'),
});

const contact = z.object({
  naam: z.string(),
  omschrijving: z.string().optional(),
  telefoon: z.string().optional(),
  email: z.string().email().optional(),
  url: z.string().url().optional(),
  adres: z.string().optional(),
  openingstijden: z.string().optional(),
});

/** Een route = één manier om bij jeugdhulp terecht te komen. */
const route = z.object({
  /** Vaste sleutel, zodat routes tussen gemeenten vergelijkbaar zijn. */
  type: z.enum([
    'wijkteam',          // gemeentelijk toegangsteam (wijkteam, CJG, jeugdteam, ...)
    'huisarts',          // verwijzing via huisarts / jeugdarts / medisch specialist
    'school',            // via school / samenwerkingsverband passend onderwijs
    'gecertificeerde-instelling', // jeugdbescherming / jeugdreclassering
    'spoed',             // crisis / spoedzorg
    'overig',
  ]),
  naam: z.string(),
  omschrijving: z.string(),
  stappen: z.array(z.string()).min(1),
  contact: contact.optional(),
  doorlooptijd: z.string().optional(),
});

/* ---------- Collecties ---------- */

const gemeenten = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gemeenten' }),
  schema: z.object({
    naam: z.string(),
    /** CBS-gemeentecode, bv. "GM0363". Stabiele sleutel voor automatisering. */
    cbsCode: z.string().regex(/^GM\d{4}$/),
    provincie: z.string(),
    /** Jeugdzorgregio waarin de gemeente inkoopt. */
    jeugdzorgregio: z.string().optional(),
    websiteJeugd: z.string().url(),

    /** 1. Hoe kom ik aan hulp? */
    toegang: z.object({
      samenvatting: z.string(),
      routes: z.array(route).min(1),
    }),

    /** 2. Waar heb ik recht op (gemeentelijke invulling)? */
    rechten: z.object({
      onafhankelijkeClientondersteuning: contact.extend({
        toelichting: z.string().optional(),
      }),
      pgb: z.object({
        mogelijk: z.boolean(),
        toelichting: z.string().optional(),
        url: z.string().url().optional(),
      }),
      bezwaarEnKlacht: z.object({
        toelichting: z.string(),
        url: z.string().url().optional(),
      }),
      vertrouwenspersoon: contact.optional(),
    }),

    /** 3. Welke hulp is er lokaal? */
    aanbod: z.object({
      samenvatting: z.string().optional(),
      gecontracteerdeAanbiedersUrl: z.string().url().optional(),
      categorieen: z.array(
        z.object({
          naam: z.string(),
          omschrijving: z.string().optional(),
        }),
      ).default([]),
    }),

    /** 4. Lokale steun buiten de formele zorg. */
    lokaleInitiatieven: z.array(
      z.object({
        naam: z.string(),
        soort: z.enum(['belangenorganisatie', 'oudergroep', 'vrijwilligers', 'informatiepunt', 'overig']),
        omschrijving: z.string(),
        url: z.string().url().optional(),
        contact: contact.optional(),
      }),
    ).default([]),

    /** 5. Metadata voor onderhoud. */
    meta: z.object({
      laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      /** 'voorbeeld' = nog niet geverifieerd met officiële bronnen. */
      status: z.enum(['voorbeeld', 'concept', 'gecontroleerd']),
      bronnen: z.array(bron).default([]),
      opmerkingen: z.string().optional(),
    }),
  }),
});

const organisaties = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/organisaties' }),
  schema: z.object({
    naam: z.string(),
    soort: z.enum([
      'belangenorganisatie',
      'patientenorganisatie',
      'oudervereniging',
      'vrijwilligers',
      'kennisinstituut',
      'overheid',
      'hulplijn',
    ]),
    /** Welke doelgroep of thema's; vrije tags, gebruikt voor filtering. */
    themas: z.array(z.string()).default([]),
    omschrijving: z.string(),
    watBiedenZij: z.array(z.string()).default([]),
    url: z.string().url(),
    telefoon: z.string().optional(),
    email: z.string().email().optional(),
    landelijk: z.boolean().default(true),
    meta: z.object({
      laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      status: z.enum(['voorbeeld', 'concept', 'gecontroleerd']),
    }),
  }),
});

const landelijk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/landelijk' }),
  schema: z.object({
    titel: z.string(),
    samenvatting: z.string(),
    volgorde: z.number(),
    bronnen: z.array(bron).default([]),
    laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

export const collections = { gemeenten, organisaties, landelijk };
