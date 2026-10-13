import type { APIRoute } from 'astro';

/**
 * robots.txt: zoekmachines en live AI-zoekfuncties (die citeren met een link) zijn welkom;
 * crawlers die inhoud verzamelen om AI-modellen te trainen niet.
 * Let op: robots.txt is een verzoek. De grote partijen houden zich eraan, niet iedere scraper.
 * Werkt alleen als de site in de hoofdmap van het domein staat (eigen domein, BASE_PATH '/').
 */

/** Trainings- en verzamelcrawlers die we weigeren. */
const geweigerd = [
  'GPTBot', // OpenAI, training
  'ClaudeBot', // Anthropic, training
  'anthropic-ai',
  'CCBot', // Common Crawl, basis voor veel trainingssets
  'Google-Extended', // Gemini-training; staat los van Googlebot en Google Zoeken
  'Applebot-Extended', // Apple-training; staat los van Applebot
  'Bytespider', // ByteDance/TikTok
  'meta-externalagent', // Meta, training
  'FacebookBot',
  'Amazonbot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Diffbot',
  'AI2Bot',
  'Ai2Bot-Dolma',
  'omgili',
  'omgilibot',
  'Webzio-Extended',
  'ImagesiftBot',
  'Timpibot',
  'PanguBot',
  'Kangaroo Bot',
];

export const GET: APIRoute = ({ site }) => {
  const basis = new URL(import.meta.env.BASE_URL, site);
  const regels = [
    '# Zoekmachines en live AI-zoekfuncties die citeren met een link zijn welkom',
    '# (o.a. Googlebot, Bingbot, Applebot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot,',
    '# Claude-User, PerplexityBot, Perplexity-User).',
    '# Het verzamelen van inhoud om AI-modellen te trainen is niet toegestaan;',
    '# zie ook /.well-known/tdmrep.json (voorbehoud tekst- en datamining, art. 15o Auteurswet).',
    '',
    ...geweigerd.flatMap((bot) => [`User-agent: ${bot}`, 'Disallow: /', '']),
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('sitemap.xml', basis)}`,
    '',
  ];
  return new Response(regels.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
