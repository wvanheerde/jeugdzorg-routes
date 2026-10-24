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
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/* ---------- Herbruikbare bouwstenen ---------- */

const bron = z.object({
  titel: z.string(),
  url: z.url(),
  geraadpleegd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Gebruik JJJJ-MM-DD'),
});

/** Een therapievorm in de rangorde van een situatie. */
const therapieItem = z.object({ id: z.string(), wanneer: z.string().optional() });

const contact = z.object({
  naam: z.string(),
  omschrijving: z.string().optional(),
  telefoon: z.string().optional(),
  email: z.email().optional(),
  url: z.url().optional(),
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
  /** Eén blok of een lijst: elke instantie die de stappen noemen, krijgt een eigen blok. */
  contact: z.union([contact, z.array(contact).min(1)]).optional(),
  doorlooptijd: z.string().optional(),
});

/**
 * Soorten geldregelingen van een gemeente (veld geldregelingen):
 * meerkosten = tegemoetkoming in extra kosten bij chronische ziekte of beperking (ook als het via de bijzondere bijstand loopt, maar dan als eigen regeling genoemd);
 * zorgkosten = andere regelingen voor kosten van zorg die ook voor een kind of het gezin gelden: vervoer naar zorg of ziekenhuisbezoek, hulpmiddelen,
 *   medische kosten via de bijzondere bijstand als eigen onderdeel, dieet, een tegemoetkoming in het eigen risico (ook dat van de ouder zelf),
 *   kosten of leges van een gehandicaptenparkeerkaart (besluit gebruiker 21-10-2026);
 * kinderopvang = tegemoetkoming in kinderopvang om medische of sociale redenen (sociaal-medische indicatie);
 * zorgverzekering = collectieve zorgverzekering voor inwoners met een laag inkomen;
 * bijzondere-bijstand = bijzondere bijstand voor noodzakelijke kosten die niets anders vergoedt;
 * meedoen = kindpakket, meedoenregeling of kindregeling (sport, school, cultuur), ook Stichting Leergeld of Jeugdfonds als de gemeente daarheen verwijst;
 * leerlingenvervoer = vervoer of vergoeding naar school (speciaal onderwijs, ver weg, beperking);
 * mantelzorg = de jaarlijkse mantelzorgwaardering.
 */
const geldSoort = z.enum(['meerkosten', 'zorgkosten', 'kinderopvang', 'zorgverzekering', 'bijzondere-bijstand', 'meedoen', 'leerlingenvervoer', 'mantelzorg']);

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
    websiteJeugd: z.url(),

    /** 1. Hoe kom ik aan hulp? */
    toegang: z.object({
      samenvatting: z.string(),
      routes: z.array(route).min(1),
    }),

    /** 2. Waar heb ik recht op (gemeentelijke invulling)? */
    rechten: z.object({
      onafhankelijkeClientondersteuning: contact.extend({
        toelichting: z.string().optional(),
        /** Noemt de gemeente meer organisaties, dan staan de andere hier, elk met een eigen contactblok. */
        andere: z.array(contact).optional(),
      }),
      pgb: z.object({
        mogelijk: z.boolean(),
        toelichting: z.string().optional(),
        url: z.url().optional(),
      }),
      /** Klacht: laagdrempelig, over werkwijze en bejegening van het toegangsteam. Geen termijn. */
      klacht: z.object({
        naam: z.string(),
        toelichting: z.string(),
        url: z.url().optional(),
        email: z.email().optional(),
        telefoon: z.string().optional(),
        /** Postadres voor een klacht per brief, als dat in de tekst genoemd wordt. */
        adres: z.string().optional(),
        /** Onafhankelijke klachtencommissie of ombudsman als het intern niet lukt. Contactgegevens horen in de velden, niet in de naam. */
        extern: contact.pick({ naam: true, url: true, telefoon: true, email: true, adres: true }).partial({ url: true, telefoon: true, email: true, adres: true }).optional(),
      }),
      /** Bezwaar: formeel, alleen tegen een beschikking, binnen 6 weken. */
      bezwaar: z.object({
        toelichting: z.string(),
        url: z.url().optional(),
        /** Alleen als bezwaar naar een ander adres moet dan het postadres van de gemeente in het register (bijv. een regionale commissie). */
        adres: z.string().optional(),
        /** true als de gemeente zegt dat het adres voor bezwaar in het besluit staat: dan geen postadres uit het register tonen. */
        adresInBesluit: z.boolean().optional(),
      }),
      vertrouwenspersoon: contact.optional(),
    }),

    /** 3. Welke hulp is er lokaal? */
    aanbod: z.object({
      samenvatting: z.string().optional(),
      gecontracteerdeAanbiedersUrl: z.url().optional(),
      categorieen: z.array(
        z.object({
          naam: z.string(),
          omschrijving: z.string().optional(),
          /** Verwijzingen naar hulpsoorten (id's uit src/content/hulpsoorten). */
          hulpsoorten: z.array(z.string()).default([]),
        }),
      ).default([]),
    }),

    /**
     * Waar ouders zonder aanvraag terechtkunnen voor informatie en advies over opvoeden (zoals bij een scheiding).
     * cjg = een Centrum voor Jeugd en Gezin of vergelijkbaar inlooppunt naast het wijkteam;
     * wijkteam = het CJG is het wijkteam zelf (geen apart contact);
     * jgz = geen CJG, wel de jeugdgezondheidszorg (consultatiebureau, jeugdarts en jeugdverpleegkundige).
     */
    cjg: z.discriminatedUnion('soort', [
      z.object({ soort: z.literal('wijkteam') }),
      z.object({ soort: z.enum(['cjg', 'jgz']), naam: z.string(), omschrijving: z.string(), contact: contact, bron: bron }),
    ]).optional(),

    /** 4. Lokale steun buiten de formele zorg. */
    lokaleInitiatieven: z.array(
      z.object({
        naam: z.string(),
        soort: z.enum(['belangenorganisatie', 'oudergroep', 'vrijwilligers', 'informatiepunt', 'overig']),
        omschrijving: z.string(),
        /** Thema-tags, zelfde woordenlijst als bij situaties en organisaties. */
        themas: z.array(z.string()).default([]),
        url: z.url().optional(),
        contact: contact.optional(),
        /**
         * Toon in Mijn overzicht (eenmalig gelabeld, 2026-10): bij welke situaties dit initiatief past (id's uit situaties);
         * voorIedereen = bruikbaar voor elk gezin (bv. Home-Start, opvoedcafé), als aanvulling als er weinig specifieks is;
         * verbergen = niet in Mijn overzicht (geen hulp voor ouders, of al elders getoond). Zonder deze velden: koppeling via themas.
         */
        situaties: z.array(z.string()).optional(),
        voorIedereen: z.boolean().optional(),
        verbergen: z.boolean().optional(),
      }),
    ).default([]),

    /** 5. Direct regelen: rechtstreekse links naar formulieren en aanvraagpagina's. */
    directRegelen: z.array(
      z.object({
        naam: z.string(),
        omschrijving: z.string().optional(),
        url: z.url(),
        /** Wat de ouder nodig heeft, bv. "DigiD" of "beschikking bij de hand". */
        nodig: z.string().optional(),
      }),
    ).default([]),

    /**
     * 5b. Geld: regelingen van de gemeente voor gezinnen met een kind dat extra zorg nodig heeft, of met een laag inkomen.
     * Gebruikt door de regelingencheck in Mijn overzicht (vraag "Extra kosten of kinderbijslag"). Verplicht: alle gemeenten zijn onderzocht.
     * Zie CONTENT.md, "Gemeenten: geldregelingen".
     */
    geldregelingen: z.object({
      /** De pagina van de gemeente met alle regelingen bij een laag inkomen of extra kosten (minimaregelingen). */
      overzicht: z.object({ naam: z.string(), url: z.url() }).optional(),
      regelingen: z.array(z.object({
        soort: geldSoort,
        /** Zoals de gemeente hem noemt, bv. "Tegemoetkoming meerkosten" of "Kindpakket". */
        naam: z.string(),
        /** Eén of twee zinnen voor ouders: wat u krijgt en voor wie. Geen telefoonnummers. */
        omschrijving: z.string(),
        /** Tot welk inkomen, in procent (bv. 120). 'geen' = zonder inkomensgrens. Weglaten als de bron het niet zegt, of als het geen harde grens is
         *  (zoals bij bijzondere bijstand: boven een grens betaalt u een deel zelf). Geldt voor gezinnen met kinderen een andere grens, dan die. */
        inkomensgrens: z.union([z.number().int().min(100).max(250), z.literal('geen')]).optional(),
        /** Waarvan de inkomensgrens een percentage is: de bijstandsnorm (sociaal minimum, standaard) of het wettelijk minimumloon (zoals in Amsterdam). */
        grondslag: z.enum(['bijstandsnorm', 'minimumloon']).optional(),
        /** Alleen bij zorgkosten: de regeling is alleen voor de ouder zelf (18+, bv. eigen risico), niet voor kosten van het kind. Op de
         *  gemeentepagina staat hij dan bij de regelingen voor een laag inkomen (besluit gebruiker 23-10-2026). */
        alleenOuder: z.literal(true).optional(),
        /** Alleen bij mantelzorg: kan een ouder van een minderjarig kind met extra zorg de waardering krijgen? Weglaten als de bron het niet zegt. */
        ouders: z.enum(['ja', 'nee']).optional(),
        /** Hoe en wanneer aanvragen, kort ("Online met DigiD", "Vóór 1 juni voor het nieuwe schooljaar"). Een termijn alleen als de bron hem noemt. */
        aanvragen: z.string().optional(),
        /** Info- of aanvraagpagina. */
        url: z.url(),
        /** Waar het gelezen is; meer dan één als feiten uit verschillende pagina's komen (bv. de grens uit de verordening, de aanvraag van de gemeentepagina). */
        bronnen: z.array(bron).min(1),
      })).default([]),
      /** Soorten die nagezocht zijn en die de gemeente niet heeft (anders lijkt "niet gevonden" op "nog niet gezocht"). */
      nietGevonden: z.array(geldSoort).default([]),
      laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),

    /** 6. Hoe gaat het in deze gemeente? Alleen op basis van herleidbare, gedateerde bronnen. */
    ervaringen: z.object({
      samenvatting: z.string(),
      signalen: z.array(
        z.object({
          soort: z.enum(['inspectie', 'clientervaringsonderzoek', 'rekenkamer', 'ombudsman', 'rechtspraak', 'gemeenteraad', 'nieuws']),
          titel: z.string(),
          samenvatting: z.string(),
          datum: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'JJJJ-MM of JJJJ-MM-DD'),
          bron: z.object({ titel: z.string(), url: z.url() }),
        }),
      ).default([]),
      /** Wat de gemeente zelf openbaar maakt over de toegang. 'onbekend' = nog niet nagezocht. */
      transparantie: z.object({
        clientervaringsonderzoek: z.object({ status: z.enum(['ja', 'nee', 'onbekend']), jaar: z.string().optional(), url: z.url().optional(), samenvatting: z.string().optional() }),
        doorlooptijden: z.object({ status: z.enum(['ja', 'nee', 'onbekend']), url: z.url().optional(), samenvatting: z.string().optional() }),
        /** Aandeel jeugdhulptrajecten dat via de huisarts/medisch specialist start (CBS). */
        aandeelHuisarts: z.object({ percentage: z.number(), jaar: z.string(), url: z.url(), /** Zelfde berekening voor heel Nederland, zelfde jaar. */ landelijk: z.number().optional() }).optional(),
      }).optional(),
      laatstBijgewerkt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).optional(),

    /** 7. Metadata voor onderhoud. */
    meta: z.object({
      laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
      'overig',
      'stichting', // goede doelen die activiteiten, dagen uit of praktische verlichting bieden
    ]),
    /** Welke doelgroep of thema's; vrije tags, gebruikt voor filtering. */
    themas: z.array(z.string()).default([]),
    omschrijving: z.string(),
    watBiedenZij: z.array(z.string()).default([]),
    url: z.url(),
    /** Tekst van de link als "Website" niet zegt wat je daar doet (gezagsregister: "Uittreksel aanvragen"). */
    linktekst: z.string().optional(),
    telefoon: z.string().optional(),
    email: z.email().optional(),
    landelijk: z.boolean().default(true),
    /** Andere woorden waarmee stappen deze organisatie noemen (bv. "kantonrechter"); de naam zelf telt altijd. */
    genoemdAls: z.array(z.string()).default([]),
    meta: z.object({
      laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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

/**
 * Hulpsoorten: de soorten jeugdhulp die gemeenten kunnen inzetten.
 * Landelijke kennis, één keer beschreven; gemeenten en situaties verwijzen via het id.
 */
const hulpsoorten = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/hulpsoorten' }),
  schema: z.object({
    naam: z.string(),
    omschrijving: z.string(),
    voorWie: z.string(),
    voorbeelden: z.array(z.string()).default([]),
    /** Is een beschikking (besluit) van de gemeente nodig? */
    beschikkingNodig: z.enum(['ja', 'nee', 'soms', 'spoed', 'rechter']),
    toegangVia: z.array(z.enum(['wijkteam', 'huisarts', 'school', 'gecertificeerde-instelling', 'spoed'])).default([]),
    volgorde: z.number(),
    /** Leeftijdsgrenzen in jaren (tot = exclusief), zoals bij therapievormen. Weglaten als het voor alle leeftijden geldt. */
    leeftijd: z.object({ van: z.number().optional(), tot: z.number().optional() }).optional(),
    /**
     * Uitwerking op een eigen pagina (/hulpsoorten/<id>/); alleen hulpsoorten met `inDePraktijk` krijgen er een.
     * Elk veld twee tot vier zinnen, met bronnen. Zie CONTENT.md, "Hulpsoorten".
     */
    /** Hoe de hulp er in de praktijk uitziet: wie, waar, hoe vaak. */
    inDePraktijk: z.string().optional(),
    /** Wanneer het juist niet past, of wanneer iets anders eerst komt. */
    nietVoor: z.string().optional(),
    /** Duur, evaluatie, wat er gebeurt als de beschikking afloopt. */
    verwachting: z.string().optional(),
    /** Vragen voor het wijkteam of de verwijzer, hooguit vijf. */
    vragen: z.array(z.string()).default([]),
    bronnen: z.array(bron).default([]),
    laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

/**
 * Situaties: de ingang voor ouders ("wat speelt er?").
 * Verbindt hulpsoorten, routes, landelijke rechten en organisaties via tags.
 */
const situaties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/situaties' }),
  schema: z.object({
    titel: z.string(),
    /** Korte zin in de taal van de ouder, bv. "Mijn kind heeft autisme of ik vermoed dat". */
    herkenning: z.string(),
    /** Woorden zoals ouders ze gebruiken ("slaat", "plast in bed"): als regel "Ook bij: …" op de pagina en zwaar in de zoekindex (zoeken.feature). */
    zoekwoorden: z.array(z.string()).default([]),
    /** Vervoegingen ("slaat", "gamet") die de zoekfunctie anders niet vindt: alleen in de zoekindex, niet zichtbaar ("slaan, slaat" las vreemd). */
    zoekvormen: z.array(z.string()).default([]),
    samenvatting: z.string(),
    /** Thema-tags; koppelen aan organisaties.themas en gemeenten.lokaleInitiatieven.themas. */
    themas: z.array(z.string()).min(1),
    /** Id's uit de collectie hulpsoorten, in volgorde van relevantie. */
    hulpsoorten: z.array(z.string()).default([]),
    /** Welke toegangsroute(s) logisch zijn, met korte uitleg waarom. */
    routes: z.array(z.object({
      type: z.enum(['wijkteam', 'huisarts', 'school', 'gecertificeerde-instelling', 'spoed']),
      waarom: z.string(),
      /** Eigen tekst na "Begin bij …" voor de eerste route, als die breder is dan het type (bv. meerdere gelijkwaardige ingangen). */
      beginBij: z.string().optional(),
    })).min(1),
    /** Id's van landelijke hoofdstukken (bestandsnaam zonder .md) die hier relevant zijn. */
    landelijk: z.array(z.string()).default([]),
    /** Landelijke regelingen die specifiek voor deze situatie gelden. */
    regelingen: z.array(z.object({ naam: z.string(), toelichting: z.string(), url: z.url().optional() })).default([]),
    /**
     * Volgorde van de gekoppelde therapievormen (therapievormen.situaties) voor deze situatie, op basis van de richtlijn:
     * eerst de vormen die vaak de eerste stap zijn, dan die ook kunnen helpen, dan die alleen passen bij een bijkomend
     * probleem of die de richtlijn niet als standaard noemt. De site toont één lijst in die volgorde, zonder groepen of
     * labels; groepen, `wanneer` en `toelichting` leggen de keuze vast. Zonder richtlijn: bronnen leeg en uitleg in `toelichting`.
     * De build faalt als een gekoppelde vorm ontbreekt of dubbel staat.
     */
    therapievormen: z.object({
      eerst: z.array(therapieItem).min(1),
      ook: z.array(therapieItem).default([]),
      bijkomend: z.array(therapieItem).default([]),
      toelichting: z.string().optional(),
      bronnen: z.array(bron).default([]),
    }).optional(),
    /** Op zich geen reden voor jeugdhulp (zoals scheiding): het overzicht begint dan met de uitleg en het CJG, en vouwt de aanvraagstappen in. */
    lichteStart: z.boolean().default(false),
    /**
     * Bij een lichte start: de jeugdgezondheidszorg (consultatiebureau, jeugdarts) is de eerste plek (zoals slaap). Heeft de gemeente
     * geen eigen CJG- of JGZ-blok (cjg.soort wijkteam), dan toont het overzicht de JGZ-contacten uit de huisartsroute boven het wijkteam.
     */
    jgzVoorop: z.boolean().default(false),
    /** Wel het wijkteam voorop, maar de aanvraagstappen ingeklapt en de eigen samenvatting als inleiding (zoals onveilig thuis). */
    aanvraagIngeklapt: z.boolean().default(false),
    /**
     * Eigen stappen bij "Ik wil hulp aanvragen", na stap 1 (Begin bij …), voor een situatie die niet met een aanvraag bij de gemeente
     * begint (zoals school loopt vast). Dan staan de aanvraagstappen ingeklapt en is de samenvatting de inleiding, zoals bij
     * aanvraagIngeklapt. Een stap is tekst, of tekst met een voorbeeldbrief (id uit src/content/brieven) als link achter de stap.
     */
    stappen: z.array(z.union([z.string(), z.object({ stap: z.string(), brief: z.string() })])).optional(),
    /**
     * Voorpagina (startvragen, src/lib/startvragen.ts): bij welke leeftijden de situatie bovenaan staat onder "Vaak bij deze
     * leeftijd"; de rest staat op alfabet onder "Andere situaties". Dat is een volgorde om sneller te vinden, geen grens: de
     * situatie staat er bij elke leeftijd. Per leeftijd 3 tot 7 situaties (controle bij het bouwen).
     */
    vaakBij: z.array(z.enum(['0-4', '4-12', '12-18', '18-99'])).default([]),
    volgorde: z.number(),
    bronnen: z.array(bron).default([]),
    laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

/**
 * Therapievormen: neutraal overzicht van gangbare behandel- en begeleidingsvormen, per situatie.
 * Doel: ouders laten begrijpen wat er bestaat, zodat zij een onderbouwde wens kunnen formuleren.
 * Geen individuele behandelaars of praktijken. Alleen vormen die in richtlijnen, zorgstandaarden
 * of de NJi-databank beschreven staan, of breed gangbaar zijn (dan gelabeld als 'gangbaar').
 */
const therapievormen = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/therapievormen' }),
  schema: z.object({
    naam: z.string(),
    soort: z.enum(['gesprekstherapie', 'gedragstherapie', 'traumabehandeling', 'oudertraining', 'gezinsbehandeling', 'vaktherapie', 'training', 'groep', 'paramedisch', 'medicatie']),
    /** Eén zin: wat is het. */
    kort: z.string(),
    watIsHet: z.string(),
    hoeWerktHet: z.string(),
    voorWie: z.string(),
    /** Wat kan een ouder verwachten: duur, frequentie, wie doet mee. */
    verwachting: z.string(),
    onderbouwing: z.object({
      /** richtlijn = aanbevolen in richtlijn/zorgstandaard; erkend = NJi-databank effectieve interventies; onderbouwd = in de NJi-databank als 'goed onderbouwd', effect nog niet onderzocht; gangbaar = breed toegepast, beperkter onderzocht. */
      label: z.enum(['richtlijn', 'erkend', 'onderbouwd', 'gangbaar']),
      toelichting: z.string(),
    }),
    /** Jeugdwet (gemeente), zorgverzekering, onderwijs, zelf. */
    vergoeding: z.string(),
    /** Hoe formuleert de ouder de wens richting gemeente of verwijzer. */
    aanvragen: z.string(),
    /** Wanneer past het wel / minder; helpt de afweging. */
    overwegingen: z.array(z.string()).default([]),
    /*
     * Verdieping (optioneel, alleen op de eigen pagina; de kaarten in het overzicht blijven kort).
     * Alleen wat een richtlijn, het NJi, een beroepsvereniging of gepubliceerd onderzoek zegt, met de bron in `bronnen`.
     */
    /** Hoe een sessie eruitziet: wat er in de kamer gebeurt. */
    sessie: z.string().optional(),
    /** Varianten of bekende programma's, bv. per leeftijd. Geen aanbieders. */
    programmas: z.array(z.object({ naam: z.string(), omschrijving: z.string(), url: z.url().optional() })).default([]),
    /** Wat het van het kind en het gezin vraagt, inclusief wat er tussen de sessies kan gebeuren. */
    vraagt: z.string().optional(),
    /** Wanneer u verschil kunt merken, en wat u doet als dat uitblijft. */
    voortgang: z.string().optional(),
    /** Wat onderzoek laat zien, in gewone woorden: hoeveel kinderen vooruitgaan, hoe snel, hoe blijvend, en wat minder onderzocht is. */
    effect: z.string().optional(),
    /** Vragen die de ouder aan de behandelaar kan stellen. */
    vragen: z.array(z.string()).default([]),
    situaties: z.array(z.string()).min(1),
    /** Onder welke hulpsoort(en) dit valt (id's uit hulpsoorten): wat de ouder bij gemeente of verwijzer aanvraagt. */
    hulpsoorten: z.array(z.string()).default([]),
    /** Loopt (ook) via de zorgverzekering in plaats van de gemeente. */
    zorgverzekering: z.boolean().default(false),
    /** Leeftijdsgrenzen in jaren (tot = exclusief). Weglaten als het voor alle leeftijden geldt. */
    leeftijd: z.object({ van: z.number().optional(), tot: z.number().optional() }).optional(),
    bronnen: z.array(bron).min(1),
    meta: z.object({
      laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
  }),
});

/**
 * Voorbeeldbrieven: korte, kant-en-klare teksten in gewone taal die ouders kunnen kopiëren.
 * Invulvelden tussen vierkante haken: [naam kind]. De body is de brief zelf (markdown).
 */
const brieven = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/brieven' }),
  schema: z.object({
    titel: z.string(),
    /** Wanneer gebruikt u deze brief? Eén of twee zinnen. */
    wanneer: z.string(),
    /** Aan wie: school, gemeente, wijkteam, huisarts (of jeugdarts), aanbieder. */
    aan: z.enum(['school', 'gemeente', 'wijkteam', 'huisarts', 'aanbieder', 'overig']),
    /** Korte tips vóór het versturen. */
    tips: z.array(z.string()).default([]),
    /** Externe voorbeelden of achtergrond, met officiële bron. */
    bronnen: z.array(bron).default([]),
    situaties: z.array(z.string()).default([]),
    /**
     * Klachtbrieven: waarover de klacht kan gaan. De ouder kiest er een of meer; dan komt `gebeurd` als regel onder
     * "**Wat er is gebeurd.**" en `vraag` onder "**Wat ik vraag.**" (na het eerste verzoek), in plaats van de voorbeeldregels.
     * De brief moet die twee tussenkoppen hebben, met direct daaronder een lijst (controle bij het bouwen, brieven/[slug].astro).
     */
    klachten: z.array(z.object({ id: z.string().regex(/^[a-z-]+$/), label: z.string(), gebeurd: z.string(), vraag: z.string() })).default([]),
    volgorde: z.number(),
    laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

/**
 * Knelpunten: waar staat de ouder in het proces met de gemeente?
 * Tweede as naast situaties. Bepaalt welke stappen, brieven en gemeentelijke contactgegevens vooraan komen.
 */
const knelpunten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/knelpunten' }),
  schema: z.object({
    titel: z.string(),
    herkenning: z.string(),
    samenvatting: z.string(),
    /**
     * Concrete stappen, in volgorde. Kort. Een stap mag vervolgstappen hebben die er direct onder horen (A, B),
     * bijvoorbeeld de ingebrekestelling na "wacht u op een besluit": `{ stap: "…", daarna: ["…", "…"] }`.
     */
    stappen: z.array(z.union([z.string(), z.object({ stap: z.string(), daarna: z.array(z.string()).min(1) })])).min(1),
    /** Welke onderdelen van de gemeentepagina relevant zijn, in volgorde van belang. */
    gemeenteOnderdelen: z.array(z.enum(['toegang', 'clientondersteuning', 'klacht', 'bezwaar', 'spoed', 'aanbieders', 'vertrouwenspersoon', 'pgb', 'postadres'])).default([]),
    brieven: z.array(z.string()).default([]),
    landelijk: z.array(z.string()).default([]),
    /** Landelijke vraag (zoals kinderbijslag): het overzicht toont dan geen gegevens van de gemeente. */
    zonderGemeente: z.boolean().default(false),
    /**
     * Het wijkteam als groot contactblok bovenaan Mijn overzicht. Uit (false) als de ouder het wijkteam al kent of er niet als eerste
     * heen hoeft (zoals bij wachten): dan staat het contact als regel onder de eerste stap die het wijkteam noemt.
     */
    wijkteamBovenaan: z.boolean().default(true),
    /**
     * Hoe het in de gemeente gaat, direct onder stap 1, bij vragen waar dat de ouder raakt (persona-tests ronde 23).
     * 'doorlooptijd': "Hoe lang duurt het in …?" (uitklapper) en "Hoe gaat het met de jeugdhulp in …?"; 'ervaringen': alleen die link.
     */
    standInGemeente: z.enum(['doorlooptijd', 'ervaringen']).optional(),
    /**
     * Voorpagina (startvragen, src/lib/startvragen.ts): onder welk vlak of welke vlakken de vraag staat. Een vraag mag onder meer
     * vlakken staan (zoals "Wij zijn uit elkaar" onder "Ik zoek hulp" en "Er verandert iets"). Heeft een vlak één vraag, dan is
     * het vlak die vraag ('ander'); 'spoed' staat apart bovenaan ("Kan het niet wachten?").
     */
    startgroepen: z.array(z.enum(['hulp', 'al', 'verandert', 'geld', 'ander', 'spoed'])).min(1),
    /**
     * Vraagt de voorpagina na deze vraag wat er speelt (en daarvoor de leeftijd)? Alleen waar dat het overzicht verandert: bij
     * vragen over de hulp zelf (welke hulp, welke therapie, gefilterd op leeftijd). Niet bij vragen over de gang van zaken,
     * regels of geld; daar toont het overzicht ook niet de algemene leeftijdstip, zodat een bewaarde leeftijd niets verandert.
     */
    startSituaties: z.boolean().default(true),
    /**
     * Een stap die zich aan de leeftijd aanpast, zoals bij kinderbijslag (dubbele kinderbijslag 3 tot 18 jaar): `begin` is het begin
     * van de stap (koppeling, zoals bij de verdiepingen), per leeftijdsband de tekst die de stap dan vervangt. Zonder tekst voor een
     * band blijft de stap zoals hij is. Met zo'n stap vraagt de voorpagina ook de leeftijd. Alleen met een bron in `bronnen`;
     * de build faalt als het begin niet bij precies één stap past.
     */
    leeftijdsstappen: z.array(z.object({ begin: z.string(), '0-4': z.string().optional(), '4-12': z.string().optional(), '12-18': z.string().optional(), '18-99': z.string().optional() })).default([]),
    volgorde: z.number(),
    bronnen: z.array(bron).default([]),
    laatstGecontroleerd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

export const collections = { gemeenten, organisaties, landelijk, hulpsoorten, situaties, therapievormen, brieven, knelpunten };
