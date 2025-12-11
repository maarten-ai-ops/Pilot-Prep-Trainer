
import { StudyCategory } from "../types";

export const studyGuideData: StudyCategory[] = [
  {
    id: "math_basics",
    title: "Rekenvaardigheid & Strategie",
    icon: "Calculator",
    description: "Uitgebreide strategieën voor hoofdrekenen, breuken, procenten en schatten.",
    sections: [
      {
        title: "Hoofdrekenen: De 'Split' Methode",
        content: `
**Optellen en Aftrekken**
Breek getallen op in honderdtallen, tientallen en eenheden.
*Som:* 468 + 325
1. 400 + 300 = 700
2. 60 + 20 = 80
3. 8 + 5 = 13
4. Totaal: 700 + 80 + 13 = 793.

**Vermenigvuldigen met grote getallen**
Gebruik de distributieve eigenschap: A x (B + C)
*Som:* 8 x 43
1. 8 x 40 = 320
2. 8 x 3 = 24
3. Totaal = 344

**Delen**
Vereenvoudig eerst. Deel beide kanten door hetzelfde getal.
*Som:* 2400 / 40
1. Streep nullen weg: 240 / 4
2. Reken uit: 60.
        `
      },
      {
        title: "Breuken, Procenten & Decimale Conversie",
        content: `
Leer deze conversies uit je hoofd. Dit scheelt minuten per sessie!
* 1/2 = 0.5 = 50%
* 1/3 ≈ 0.333 = 33.3%
* 1/4 = 0.25 = 25%
* 1/5 = 0.2 = 20%
* 1/6 ≈ 0.166 = 16.6%
* 1/8 = 0.125 = 12.5%
* 1/10 = 0.1 = 10%
* 1/20 = 0.05 = 5%

**De 1% regel**
Om snel een percentage te vinden:
1. Vind 10% (komma 1 plek naar links).
2. Vind 1% (komma 2 plekken naar links).
3. Vermenigvuldig.
*Vraag:* 12% van 500.
1% van 500 = 5.
12 x 5 = 60.
        `
      },
      {
        title: "Schatten & Logica Check",
        content: `
Bij multiple choice vragen hoef je vaak niet het exacte antwoord te berekenen.
*Vraag:* 3,98 x 4,02
*Opties:* A) 12,01  B) 15,99  C) 20,5  D) 10,2
*Logica:* Dit is bijna 4 x 4 = 16.
Antwoord B (15,99) ligt het dichtst bij 16. Je hoeft niet te cijferen.
        `
      }
    ]
  },
  {
    id: "seq_logic",
    title: "Reeksen & Abstract Redeneren",
    icon: "Brain",
    description: "Cijferreeksen, Figurenreeksen en patroonherkenning.",
    sections: [
      {
        title: "Cijferreeksen: Geavanceerde Patronen",
        content: `
**Tweetraps Reeksen**
Soms is het patroon niet in de getallen zelf, maar in de *verschillen*.
Reeks: 2, 5, 11, 23, 47
Verschillen: +3, +6, +12, +24 (de verschillen verdubbelen!)
Volgende verschil: 48.
Antwoord: 47 + 48 = 95.

**Gecombineerde Operaties**
Patronen als "x2 + 1" of "x3 - 2".
Reeks: 4, 9, 19, 39
4 x 2 + 1 = 9
9 x 2 + 1 = 19
19 x 2 + 1 = 39
Volgende: 39 x 2 + 1 = 79.
        `
      },
      {
        title: "Figurenreeksen (Abstract)",
        content: `
Kijk naar eigenschappen apart (feature analysis):
1. **Aantal:** Tellen er lijnen/stippen bij op of af?
2. **Rotatie:** Draait het figuur met de klok mee (90°, 45°)?
3. **Kleur:** Verspringt de vulling (zwart/wit/grijs)?
4. **Positie:** Beweegt een stipje één stapje per keer?

**De 'Rule of Elimination'**
Kijk eerst ALLEEN naar de kleur. Streep antwoorden weg die niet kloppen.
Kijk dan naar rotatie. Streep verder weg.
Zo houd je vaak maar 1 optie over zonder het hele plaatje te snappen.
        `
      }
    ]
  },
  {
    id: "word_problems",
    title: "Redactiesommen",
    icon: "BookOpen",
    description: "Strategieën voor verhaalsommen over leeftijd, snelheid en verhoudingen.",
    sections: [
      {
        title: "Het Vertaalproces",
        content: `
De grootste fout is direct beginnen met rekenen. Vertaal eerst tekst naar wiskunde.
* "is" -> =
* "van" -> x (vermenigvuldigen)
* "per" -> / (delen)
* "neemt toe met" -> +
* "verhouding x staat tot y" -> x/y

*Voorbeeld:* "De helft van A is 10 meer dan B."
Vertaald: 0.5 * A = B + 10.
        `
      },
      {
        title: "Werkhoeveelheid (Job problems)",
        content: `
Formule: **(Tijd Samen)⁻¹ = (Tijd A)⁻¹ + (Tijd B)⁻¹**
*Vraag:* Pomp A doet het in 3 uur. Pomp B in 6 uur. Hoe snel samen?
1/3 + 1/6 = ?
Maak gelijknamig: 2/6 + 1/6 = 3/6 = 1/2.
Draai om: 2/1 = 2 uur.
        `
      }
    ]
  },
  {
    id: "logic_verbal",
    title: "Logica & Verbaal",
    icon: "Brain",
    description: "Syllogismen, Venn-diagrammen en Analogieën.",
    sections: [
      {
        title: "Syllogismen & Venn Diagrammen",
        content: `
**Basisrelaties visualiseren**
Syllogismen los je het beste op door cirkels te tekenen (Venn-diagrammen). Er zijn 4 basisrelaties:
1. **Alle A zijn B:** Teken een kleine cirkel A binnen in een grote cirkel B.
2. **Geen A is B:** Teken cirkel A en cirkel B los van elkaar.
3. **Sommige A zijn B:** Teken twee cirkels die elkaar deels overlappen.
4. **Sommige A zijn niet B:** A overlapt B misschien wel, maar er is een deel van A dat 'buiten' hangt. Of ze staan helemaal los.

**Knop voor Voorbeeld**
Hieronder kun je een AI een voorbeeld laten tekenen van zo'n situatie.
        `
      },
      {
        title: "Analogieën Strategie",
        content: `
**Maak een 'Brug-zin'**
Probeer de relatie in een zin te gieten.
*Vraag:* Bos : Bomen :: ? : ?
Zin: "Een Bos bestaat uit veel Bomen."
Zoek nu het antwoord dat in die zin past.
Optie: "Kudde : Schapen". Zin: "Een Kudde bestaat uit veel Schapen." -> Match!

**Pas op voor volgorde**
A : B is niet hetzelfde als B : A.
Als de relatie "Oorzaak -> Gevolg" is, moet het antwoord ook die volgorde hebben.
        `
      }
    ]
  }
];
