
import { SavedQuestion, Difficulty } from "../types";

// A set of pre-generated, high-quality questions to populate the archive immediately.
export const starterQuestions: SavedQuestion[] = [
  // --- REKENVAARDIGHEID ---
  {
    id: "math-1",
    topic: "Rekenvaardigheid",
    question: "Een vliegtuig verbruikt 2400 kg brandstof in 3 uur. Hoeveel brandstof wordt er verbruikt in 40 minuten?",
    options: ["A) 400 kg", "B) 533 kg", "C) 600 kg", "D) 800 kg"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Stap 1: Bereken verbruik per uur. 2400 / 3 = 800 kg/uur.\nStap 2: Bereken verbruik per minuut of gebruik fracties. 40 minuten is 2/3 van een uur.\nStap 3: 2/3 van 800.\n800 / 3 = 266,67.\n266,67 * 2 = 533,33 kg.\nAfgerond 533 kg.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "math-2",
    topic: "Rekenvaardigheid",
    question: "Je vliegt met een snelheid van 120 knopen. Hoe lang doe je over een afstand van 18 Nautical Miles (NM)?",
    options: ["A) 6 minuten", "B) 9 minuten", "C) 12 minuten", "D) 15 minuten"],
    correct_answer: "B",
    difficulty: Difficulty.Easy,
    explanation: "Snelheid is 120 NM per uur = 2 NM per minuut (want 120 / 60 = 2).\nAfstand is 18 NM.\nTijd = Afstand / Snelheid = 18 / 2 = 9 minuten.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "math-3",
    topic: "Rekenvaardigheid",
    question: "0,04 x 0,6 =",
    options: ["A) 0,24", "B) 0,024", "C) 0,0024", "D) 2,4"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Negeer eerst de komma's: 4 x 6 = 24.\nTel nu het totaal aantal cijfers achter de komma's in de opgave: 0,04 (2 cijfers) en 0,6 (1 cijfer) = 3 cijfers totaal.\nZet de komma terug zodat er 3 cijfers achter staan: 0,024.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "math-4",
    topic: "Rekenvaardigheid",
    question: "Wat is 17,5% van 800?",
    options: ["A) 120", "B) 140", "C) 150", "D) 160"],
    correct_answer: "B",
    difficulty: Difficulty.Hard,
    explanation: "Splits het percentage op:\n10% van 800 = 80.\n5% is de helft van 10% = 40.\n2,5% is de helft van 5% = 20.\nTel op: 80 + 40 + 20 = 140.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "math-5",
    topic: "Rekenvaardigheid",
    question: "7/8 - 1/4 =",
    options: ["A) 3/4", "B) 5/8", "C) 1/2", "D) 6/8"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Maak de noemers gelijknamig.\n1/4 is hetzelfde als 2/8.\nDe som wordt: 7/8 - 2/8 = 5/8.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },

  // --- REDACTIESOMMEN ---
  {
    id: "red-1",
    topic: "Redactiesommen",
    question: "Tank A bevat 500 liter en loopt leeg met 10 liter/min. Tank B bevat 300 liter en loopt leeg met 5 liter/min. Na hoeveel minuten bevatten beide tanks evenveel water?",
    options: ["A) 20 min", "B) 30 min", "C) 40 min", "D) 50 min"],
    correct_answer: "C",
    difficulty: Difficulty.Hard,
    explanation: "Stel de tijd in minuten als 't'.\nTank A: 500 - 10t\nTank B: 300 - 5t\nGelijkstelling: 500 - 10t = 300 - 5t\nBreng t naar één kant: 500 - 300 = 10t - 5t\n200 = 5t\nt = 40 minuten.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "red-2",
    topic: "Redactiesommen",
    question: "Een piloot vliegt heen met 300 km/u en terug (tegenwind) met 200 km/u. De totale afstand heen en terug is 600 km (300 heen, 300 terug). Wat is de gemiddelde snelheid?",
    options: ["A) 240 km/u", "B) 250 km/u", "C) 260 km/u", "D) 225 km/u"],
    correct_answer: "A",
    difficulty: Difficulty.Hard,
    explanation: "Pas op: het gemiddelde van snelheden is NIET (300+200)/2.\nBereken totale tijd:\nHeen: 300 km / 300 km/u = 1 uur.\nTerug: 300 km / 200 km/u = 1,5 uur.\nTotale tijd = 2,5 uur.\nTotale afstand = 600 km.\nGemiddelde snelheid = 600 / 2,5 = 240 km/u.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "red-3",
    topic: "Redactiesommen",
    question: "Drie pompen vullen een reservoir in 4 uur. Hoe lang doen 4 pompen erover, aangenomen dat ze even snel werken?",
    options: ["A) 2 uur", "B) 3 uur", "C) 3 uur 20 min", "D) 5 uur"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Dit is omgekeerd evenredig. Meer pompen = minder tijd.\nWerkhoeveelheid = 3 pompen x 4 uur = 12 'pomp-uren'.\nNieuwe tijd = 12 pomp-uren / 4 pompen = 3 uur.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "red-4",
    topic: "Redactiesommen",
    question: "Vader is nu 3 keer zo oud als zoon. Over 10 jaar is vader 2 keer zo oud als zoon. Hoe oud is de zoon nu?",
    options: ["A) 5", "B) 10", "C) 15", "D) 20"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Stel leeftijd zoon = x. Vader = 3x.\nOver 10 jaar: Zoon = x + 10, Vader = 3x + 10.\nVergelijking: 3x + 10 = 2 * (x + 10)\n3x + 10 = 2x + 20\nx = 10.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "red-5",
    topic: "Redactiesommen",
    question: "Een kaart kost €2,50 meer dan een postzegel. Samen kosten ze €3,10. Hoeveel kost de postzegel?",
    options: ["A) €0,30", "B) €0,40", "C) €0,50", "D) €0,60"],
    correct_answer: "A",
    difficulty: Difficulty.Medium,
    explanation: "Stel postzegel = p. Kaart = p + 2,50.\nSamen: p + (p + 2,50) = 3,10\n2p + 2,50 = 3,10\n2p = 0,60\np = 0,30.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },

  // --- CIJFERREEKSEN ---
  {
    id: "seq-1",
    topic: "Cijferreeksen",
    question: "2, 4, 8, 16, 32, ...",
    options: ["A) 48", "B) 60", "C) 64", "D) 128"],
    correct_answer: "C",
    difficulty: Difficulty.Easy,
    explanation: "Elk getal wordt met 2 vermenigvuldigd (verdubbeld). 32 x 2 = 64.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "seq-2",
    topic: "Cijferreeksen",
    question: "3, 7, 13, 21, 31, ...",
    options: ["A) 41", "B) 43", "C) 45", "D) 39"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Kijk naar de verschillen tussen de getallen:\n7-3=4\n13-7=6\n21-13=8\n31-21=10\nHet verschil neemt telkens met 2 toe. Het volgende verschil moet 12 zijn.\n31 + 12 = 43.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "seq-3",
    topic: "Cijferreeksen",
    question: "100, 99, 95, 86, 70, ...",
    options: ["A) 45", "B) 55", "C) 35", "D) 50"],
    correct_answer: "A",
    difficulty: Difficulty.Hard,
    explanation: "Verschillen: -1, -4, -9, -16.\nDit zijn de kwadraten (1², 2², 3², 4²).\nDe volgende stap is min 5² = -25.\n70 - 25 = 45.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "seq-4",
    topic: "Cijferreeksen",
    question: "5, 10, 8, 16, 14, 28, ...",
    options: ["A) 26", "B) 30", "C) 56", "D) 24"],
    correct_answer: "A",
    difficulty: Difficulty.Medium,
    explanation: "Er zijn twee bewerkingen om en om:\nx 2\n- 2\n5x2=10, 10-2=8, 8x2=16, 16-2=14, 14x2=28.\nVolgende stap is -2.\n28 - 2 = 26.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "seq-5",
    topic: "Cijferreeksen",
    question: "0, 1, 1, 2, 3, 5, 8, ...",
    options: ["A) 11", "B) 12", "C) 13", "D) 15"],
    correct_answer: "C",
    difficulty: Difficulty.Medium,
    explanation: "Fibonacci reeks: elk getal is de som van de twee voorgaande getallen.\n5 + 8 = 13.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },

  // --- ANALOGIEËN ---
  {
    id: "ana-1",
    topic: "Analogieën",
    question: "Vinger staat tot Hand als Blad staat tot ...",
    options: ["A) Boom", "B) Tak", "C) Bos", "D) Groen"],
    correct_answer: "B",
    difficulty: Difficulty.Easy,
    explanation: "Relatie: 'is onderdeel van'. Een vinger zit vast aan een hand. Een blad zit direct vast aan een tak (en de tak aan de boom, maar tak is directer).",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "ana-2",
    topic: "Analogieën",
    question: "Thermometer staat tot Temperatuur als Barometer staat tot ...",
    options: ["A) Wind", "B) Vochtigheid", "C) Luchtdruk", "D) Regen"],
    correct_answer: "C",
    difficulty: Difficulty.Medium,
    explanation: "Relatie: 'meetinstrument voor'. Een thermometer meet temperatuur, een barometer meet luchtdruk.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "ana-3",
    topic: "Analogieën",
    question: "Laf staat tot Dapper als Vluchtig staat tot ...",
    options: ["A) Snel", "B) Duurzaam", "C) Gasvormig", "D) Kort"],
    correct_answer: "B",
    difficulty: Difficulty.Hard,
    explanation: "Relatie: Tegenstelling (Antoniem). Vluchtig betekent kortstondig of snel verdwijnend. Het tegenovergestelde is blijvend of duurzaam.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "ana-4",
    topic: "Analogieën",
    question: "Apotheker staat tot Medicijnen als Sommelier staat tot ...",
    options: ["A) Eten", "B) Wijn", "C) Bediening", "D) Restaurant"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Relatie: 'Specialist in'. Een sommelier is gespecialiseerd in wijn.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "ana-5",
    topic: "Analogieën",
    question: "Cirkel staat tot Bol als Vierkant staat tot ...",
    options: ["A) Driehoek", "B) Kubus", "C) Blok", "D) Piramide"],
    correct_answer: "B",
    difficulty: Difficulty.Easy,
    explanation: "Relatie: 2D naar 3D versie. Een bol is de 3D versie van een cirkel. Een kubus is de 3D versie van een vierkant.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },

  // --- SYLLOGISMEN ---
  {
    id: "syl-1",
    topic: "Syllogismen",
    question: "Stelling 1: Alle piloten zijn fit. Stelling 2: Sommige fitte mensen dragen een bril. Conclusie: ...",
    options: ["A) Sommige piloten dragen een bril", "B) Alle piloten dragen een bril", "C) Je kunt hier niets met zekerheid over zeggen", "D) Geen piloot draagt een bril"],
    correct_answer: "C",
    difficulty: Difficulty.Hard,
    explanation: "Teken een Venn-diagram. Cirkel 'Piloten' zit volledig in 'Fit'. Cirkel 'Brildragers' overlapt met 'Fit'. We weten NIET of de cirkel 'Piloten' en 'Brildragers' elkaar raken. Het kan zijn dat de brildragende fitte mensen allemaal GEEN piloot zijn.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "syl-2",
    topic: "Syllogismen",
    question: "Geen enkele A is een B. Alle C zijn A. Conclusie?",
    options: ["A) Sommige C zijn B", "B) Geen enkele C is een B", "C) Alle B zijn C", "D) Geen conclusie mogelijk"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Als C volledig in A zit, en A en B raken elkaar helemaal niet (staan los), dan kan C ook nooit B aanraken.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "syl-3",
    topic: "Syllogismen",
    question: "Alle vogels leggen eieren. De pinguïn is een vogel. Conclusie:",
    options: ["A) De pinguïn legt eieren", "B) Pinguïns kunnen vliegen", "C) Niet alle vogels zijn pinguïns", "D) Eieren worden door pinguïns gelegd"],
    correct_answer: "A",
    difficulty: Difficulty.Easy,
    explanation: "Standaard deductie. A=B, C=A, dus C=B.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "syl-4",
    topic: "Syllogismen",
    question: "Sommige auto's zijn rood. Alles wat rood is, valt op. Conclusie:",
    options: ["A) Alle auto's vallen op", "B) Sommige auto's vallen op", "C) Alles wat opvalt is een auto", "D) Rode auto's zijn snel"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "Er is overlap tussen auto's en rood. Omdat ALLES wat rood is opvalt, moet het gedeelte van de auto's dat rood is (sommige auto's) dus ook opvallen.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "syl-5",
    topic: "Syllogismen",
    question: "Alle X zijn Y. Sommige Y zijn Z. Conclusie:",
    options: ["A) Sommige X zijn Z", "B) Alle X zijn Z", "C) Geen conclusie mogelijk over X en Z", "D) Sommige Z zijn X"],
    correct_answer: "C",
    difficulty: Difficulty.Hard,
    explanation: "X zit in Y. Z overlapt met Y. Maar Z hoeft niet per se met het stukje X te overlappen. Z kan in het deel van Y zitten waar geen X is.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },

  // --- VERBAAL REDENEREN ---
  {
    id: "verb-1",
    topic: "Verbaal Redeneren",
    question: "Welk woord past logischerwijs NIET in het rijtje: Hamer, Zaag, Schroevendraaier, Spijker, Boor.",
    options: ["A) Hamer", "B) Zaag", "C) Spijker", "D) Boor"],
    correct_answer: "C",
    difficulty: Difficulty.Easy,
    explanation: "De hamer, zaag, schroevendraaier en boor zijn allemaal gereedschappen. Een spijker is een verbruiksmateriaal (iets wat je gebruikt *met* gereedschap).",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "verb-2",
    topic: "Verbaal Redeneren",
    question: "Analyseer de stelling: 'Niet iedereen die hard werkt wordt rijk, maar iedereen die rijk is heeft hard gewerkt.' Welke conclusie is op basis van deze tekst zeker waar?",
    options: ["A) Luiheid leidt tot armoede", "B) Er zijn hardwerkende arme mensen", "C) Rijkdom is een keuze", "D) Hard werken garandeert rijkdom"],
    correct_answer: "B",
    difficulty: Difficulty.Medium,
    explanation: "De tekst zegt 'Niet iedereen die hard werkt wordt rijk'. Dat impliceert direct dat er mensen zijn die wel hard werken, maar niet rijk worden (dus arm blijven of modaal). Optie D wordt letterlijk ontkend in de tekst.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "verb-3",
    topic: "Verbaal Redeneren",
    question: "Welke woord heeft de meest vergelijkbare betekenis als 'Authentiek'?",
    options: ["A) Oud", "B) Origineel", "C) Kunstmatig", "D) Waardevol"],
    correct_answer: "B",
    difficulty: Difficulty.Easy,
    explanation: "Authentiek betekent 'echt', 'oorspronkelijk' of 'niet nagemaakt'. Origineel komt hier het dichtst bij in de buurt.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "verb-4",
    topic: "Verbaal Redeneren",
    question: "Vervolledig de zin: Het argument was zo ____ dat niemand het kon weerleggen.",
    options: ["A) Zwak", "B) Overtuigend", "C) Ingewikkeld", "D) Saai"],
    correct_answer: "B",
    difficulty: Difficulty.Easy,
    explanation: "Als niemand iets kan weerleggen, betekent het dat het argument heel sterk of 'overtuigend' is.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  },
  {
    id: "verb-5",
    topic: "Verbaal Redeneren",
    question: "Als 'Maan' gecodeerd is als 'Nbbod', hoe schrijf je dan 'Zon'?",
    options: ["A) Apo", "B) Ynm", "C) Apm", "D) Apn"],
    correct_answer: "A",
    difficulty: Difficulty.Medium,
    explanation: "De code verschuift elke letter 1 stapje verder in het alfabet. M->N, a->b, n->o. Dus 'Zon': Z->A (cyclus start opnieuw of volgende letter), o->p, n->o. Antwoord Apo.",
    userAnswer: null,
    timestamp: new Date().toISOString()
  }
];
