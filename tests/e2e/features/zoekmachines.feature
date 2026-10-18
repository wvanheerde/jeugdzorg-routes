# language: nl
Functionaliteit: Zoekmachines en AI-crawlers
  Zoekmachines mogen de site lezen; crawlers die teksten verzamelen om AI te trainen niet.
  Pagina's met persoonlijke keuzes (Mijn overzicht) staan niet in de sitemap.

  Scenario: robots.txt weert trainingscrawlers en wijst naar de sitemap
    Gegeven ik open de voorpagina
    Dan bevat "robots.txt" de regel "User-agent: GPTBot"
    En bevat "robots.txt" de regel "User-agent: *"
    En bevat "robots.txt" de tekst "Sitemap:"

  Scenario: De sitemap bevat de gemeenten maar niet Mijn overzicht
    Gegeven ik open de voorpagina
    Dan bevat "sitemap.xml" de tekst "/gemeenten/utrecht/"
    En bevat "sitemap.xml" niet de tekst "/overzicht/"
