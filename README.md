# Hikeland Stemwijzer
- De Hikeland Stemwijzer is op 24 november 2024 open-source gemaakt.
- De Hikeland Stemwijzer kan vrij worden aangepast en gedistribueerd.

# Installatie-aanwijzingen
- Installeer Git (indien nodig)
- Voer deze commando uit:
```bash 
git clone https://github.com/CakeWithPineapple/stemwijzer.git
```
- De `public/data.json` en `public/terms.json` zijn gevuld door data uit de productieversie van de Hikeland Stemwijzer. Pas (indien nodig) deze twee bestanden aan. (zie formaat in de volgende hoofdstukken).
- De `img/` map is gevuld door logo's van de partijen die in de productieversie van de Hikeland Stemwijzer gebruikt worden. Zet (indien nodig) eigen plaatjes in die map. Zorg wel voor dat de namen van de plaatjes corresponderen aan de ID's van partijen uit de data.json.

# Formaat data.json
- De formaat van de data.json is als volgt:
```json
{
  "vragen": {
    "nl": [
      "vraag 1",
      "vraag 2",
      // zet andere vragen hier in
    ],
    "en-US": [
      "question 1",
      "question 2",
      // zet andere vragen hier in
    ],
    // zet andere talen hier in
  },
  "partijen": [
    {
      "id": "idpartij1",
      "naam": "tuinpartij",
      "standpunten": [
        "eens", "oneens", // zet andere standpunten hier in. LET OP: Neutraal wordt in de huidige versie niet ondersteund.
      ]
    },
    // zet andere partijen hier in



    // als u een coalitie heeft, plaatst u naast de coalitiestandpunten hier de coalitiepartijen afzonderlijk.
    // voorbeeld:
    {
      "id": "CJ",
      "naam": "CoalitieJustitie",
      "standpunten": ["eens", "oneens"]
    },
    {
      "id": "RattenTeFiets",
      "naam": "RattenTeFiets!",
      "standpunten": []
    },
    {
      "id": "Staartslagers",
      "naam": "Staartslagers",
      "standpunten": []
    },
  ],
  // hier worden vragen geplaatst die worden gebruikt als er een gelijkspel tussen twee partijen plaatsvindt
  "extra_vragen": {
    // deze vragen worden bepaald om de afzonderlijke partij binnen een coalitie te bepalen
    "coalitie_vragen": {
      // voorbeeld:
      "vraag": "Moet Hikeland vluchtelingen opvangen die internationaal bescherming zoeken?",
      // hier is de 
      "vraag_uk": "Чи повинен Хікеланд приймати біженців, які шукають міжнародного захисту?",
      "standpunten": {
        "RattenTeFiets": "oneens",
        "Staartslagers": "eens"
      }
    }
  }
}
```