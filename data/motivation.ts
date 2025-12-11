
export const pilotQuotes = [
  "Attitude determines Altitude. Blijf positief en gefocust.",
  "A good pilot is always learning. Elke fout is een les.",
  "Visualiseer de cockpit. Jij hoort daar thuis.",
  "Vliegen is de kunst van het vooruitdenken. Blijf de situatie voor.",
  "In thrust we trust. Geloof in je eigen kunnen.",
  "Keep the blue side up. Blijf kalm onder druk.",
  "Geen paniek, blijf vliegen. Eerst 'Aviate', dan 'Navigate', dan 'Communicate'.",
  "De beste piloten hebben het meeste geoefend.",
  "Je wordt niet geboren als piloot, je wordt er een door training.",
  "De lucht is niet de limiet, het is jouw speelveld."
];

export const loadingMessages = [
  "Pre-flight checks uitvoeren...",
  "Toestemming vragen aan de toren...",
  "Instrumenten kalibreren...",
  "Weerbericht ophalen...",
  "Motor opwarmen...",
  "Route plannen naar succes...",
  "Vluchtplan indienen...",
  "Wings level houden...",
  "Scannen van het luchtruim...",
  "Vragen ophalen uit de black box..."
];

export const successMessages = [
  "Strakke landing!",
  "Good Airmanship!",
  "Right on target!",
  "Cleared for takeoff!",
  "Altitude maintained!",
  "Perfecte navigatie!",
  "Roger that!",
  "Captain material!"
];

export interface Rank {
  title: string;
  minCorrect: number;
  bars: number;
  description: string;
}

export const pilotRanks: Rank[] = [
  { title: "Flight Cadet", minCorrect: 0, bars: 1, description: "Je reis is begonnen. Blijf studeren!" },
  { title: "Second Officer", minCorrect: 25, bars: 2, description: "Je krijgt de basis onder de knie." },
  { title: "First Officer", minCorrect: 75, bars: 3, description: "Je bent klaar voor de rechterstoel." },
  { title: "Senior First Officer", minCorrect: 150, bars: 3, description: "Ervaren en betrouwbaar." }, // 3 bars but maybe visually distinct in future
  { title: "Captain", minCorrect: 250, bars: 4, description: "Jij hebt de leiding. De cockpit is jouw domein." }
];
