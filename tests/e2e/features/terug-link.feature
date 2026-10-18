# language: nl
Functionaliteit: Terug-link op detailpagina's
  Op de pagina van een therapievorm of hulpsoort brengt de terug-link de ouder naar de pagina waar die vandaan kwam,
  met de keuzes nog erin. Zie src/lib/terug.ts.

  Scenario: Van Mijn overzicht naar een therapievorm en terug
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Als ik de eerste therapievorm open
    Dan is de terug-link "← Terug naar Mijn overzicht" naar "overzicht/?k=beginnen&gemeente=utrecht&s=adhd#tips"

  Scenario: Van een situatie naar een hulpsoort en terug
    Gegeven ik open de pagina "situaties/adhd/"
    Als ik de hulpsoort "Ambulante begeleiding" open
    Dan is de terug-link "← Terug naar ADHD en ADD" naar "situaties/adhd/#hulp"

  Scenario: Van een andere pagina terug naar de vorige pagina
    Gegeven ik open de pagina "situaties/"
    Als ik de hulpsoort "Behandeling" open
    Dan is de terug-link "← Terug naar de vorige pagina" naar "situaties/"
