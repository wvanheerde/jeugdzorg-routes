# Jeugdzorg Routes

Statische informatiesite die ouders per gemeente laat zien hoe zij jeugdhulp krijgen, waar ze recht op hebben en welke organisaties hen kunnen helpen.

- **Stack:** [Astro](https://astro.build) 5, content collections met Zod-schema, geen client-side JavaScript.
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml`.
- **Inhoud bijwerken:** zie [CONTENT.md](CONTENT.md).

```bash
npm install
npm run dev        # http://localhost:4321
npm run validate   # snelle contentcheck
npm run build      # volledige build + schemavalidatie -> dist/
```

## Structuur

```
src/content.config.ts        schema (bron van waarheid)
src/content/gemeenten/       één JSON per gemeente
src/content/organisaties/    landelijke organisaties
src/content/landelijk/       landelijke rechten (markdown)
src/pages/                   routes: /, /gemeenten/, /gemeenten/<slug>/, /landelijk/, /organisaties/, /over/
src/layouts, src/components  opmaak
```

## Uitbreiden met interactie

Astro rendert statisch, maar ondersteunt "islands": voeg bijvoorbeeld `@astrojs/react` of `@astrojs/svelte` toe en plaats een component met `client:load` op een pagina. Zo kan later een stappenplan (wizard) of chatbot worden toegevoegd zonder de rest van de site te veranderen. De JSON-data per gemeente is daarbij direct bruikbaar als input.

## Publiceren op GitHub Pages

1. Zet in `astro.config.mjs` `site` op `https://<gebruiker>.github.io`.
2. Activeer in de repository-instellingen *Pages → Source: GitHub Actions*.
3. Push naar `main`.
