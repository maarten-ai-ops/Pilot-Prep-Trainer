
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, Difficulty } from "../types";

// COST OPTIMIZATION:
// Use Pro for complex reasoning (Math, Logic, Question Generation).
const REASONING_MODEL = "gemini-3-pro-preview";
// Use Flash for simple text tasks (Definitions, Extraction, Summaries) to save costs/latency.
const FAST_MODEL = "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean Markdown JSON blocks (```json ... ```) which LLMs often add
const cleanJson = (text: string): string => {
  let clean = text.trim();
  // Remove markdown code blocks
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
};

const cleanSvg = (text: string): string => {
    let clean = text.trim();
    if (clean.includes('```xml')) {
        clean = clean.replace(/```xml/g, '').replace(/```/g, '');
    } else if (clean.includes('```svg')) {
        clean = clean.replace(/```svg/g, '').replace(/```/g, '');
    } else if (clean.includes('```')) {
        clean = clean.replace(/```/g, '');
    }
    // Find the SVG tag start and end to ensure cleanliness
    const start = clean.indexOf('<svg');
    const end = clean.lastIndexOf('</svg>');
    if (start !== -1 && end !== -1) {
        return clean.substring(start, end + 6);
    }
    return clean;
}

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    question: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lijst van antwoordopties, bv 'A) 10 graden'",
    },
    correct_answer: { 
      type: Type.STRING, 
      description: "De letter van het juiste antwoord, bv 'A' of 'B'" 
    },
    difficulty: { 
      type: Type.STRING, 
      enum: ["Easy", "Medium", "Hard"] 
    },
    explanation: { type: Type.STRING },
  },
  required: ["topic", "question", "options", "correct_answer", "difficulty", "explanation"],
};

const batchSchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema,
};

export const generateQuestionBatch = async (
  topic: string,
  difficulty: Difficulty,
  isMathMode: boolean
): Promise<Question[]> => {
  const modeInstruction = isMathMode
      ? "Focus op Rekenvaardigheid, Redactiesommen en Cijferreeksen. Vereist hoofdrekenen."
      : "Focus op Capaciteiten: Syllogismen, Analogieën, Verbaal.";

  const vennInstruction = topic.toLowerCase().includes("syllogism") 
    ? "Bij Syllogismen: beschrijf in de uitleg het Venn-diagram." 
    : "";

  const prompt = `
    Genereer 10 unieke meerkeuzevragen voor pilotenselectie.
    Onderwerp: ${topic}
    Niveau: ${difficulty}
    ${modeInstruction}
    ${vennInstruction}
    
    Format: JSON Array.
    Eisen: 4-6 opties (A-F), 1 goed antwoord, educatieve uitleg.
  `;

  try {
    // Expensive Call: Needs high intelligence
    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: batchSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Leeg antwoord van AI");
    
    try {
      return JSON.parse(cleanJson(text)) as Question[];
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", text);
      throw new Error("Fout bij verwerken van AI antwoord. Probeer het opnieuw.");
    }
  } catch (error) {
    console.error("API Error generateQuestionBatch:", error);
    throw error;
  }
};

export const getTermDefinitions = async (questionText: string): Promise<string | null> => {
  // Optimization: Use Flash (Cheaper/Faster)
  const prompt = `
    Definieer kort (max 1 zin) moeilijke luchtvaart/wis/natuurkunde termen uit: "${questionText}".
    Geen termen? Antwoord "NULL".
  `;

  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL, 
      contents: prompt,
      config: { temperature: 0.1 }
    });

    const text = response.text?.trim();
    if (!text || text === "NULL" || text.toLowerCase().includes("geen")) return null;
    return text;
  } catch (error) {
    console.warn("Term definitie mislukt (niet kritiek):", error);
    return null; 
  }
};

export const explainMore = async (question: Question): Promise<string> => {
  // Optimization: Use Pro for accuracy in teaching, but prompt strictly
  const prompt = `
    Geef een stap-voor-stap uitleg voor deze vraag.
    Vraag: "${question.question}"
    Antwoord: ${question.correct_answer}
    Context: ${question.explanation}
  `;

  try {
    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt,
    });
    return response.text || "Geen extra uitleg beschikbaar.";
  } catch (error) {
    console.error("Error explainMore:", error);
    return "Kon geen verbinding maken voor extra uitleg.";
  }
};

export const getStepBreakdown = async (question: Question): Promise<{step: string, hint: string}[]> => {
  // Logic intensive: Keep on Pro
  const prompt = `
    Breek de oplossing op in 3-4 stappen. JSON: [{step: string, hint: string}]
    Vraag: "${question.question}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { step: { type: Type.STRING }, hint: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
  } catch (e) {
    console.error("Error getStepBreakdown:", e);
    return [{ step: "Splits de vraag op in delen.", hint: "Kijk goed naar de getallen." }];
  }
};

export const verifyQuestionAnswer = async (question: Question): Promise<string> => {
  // Logic intensive: Keep on Pro
  const prompt = `
    Check deze vraag en antwoord op fouten. Is ${question.correct_answer} correct?
    Vraag: "${question.question}"
    Opties: ${JSON.stringify(question.options)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt
    });
    return response.text || "Verificatie mislukt.";
  } catch (e) {
    return "Kan verificatie server niet bereiken.";
  }
};

export const extractTopics = async (rawText: string): Promise<string[]> => {
  // Optimization: Use Flash (Cheaper)
  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL, 
      contents: `Haal max 10 educatieve onderwerpen uit deze tekst. JSON Array string. Tekst: ${rawText.substring(0, 5000)}`, 
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return JSON.parse(cleanJson(response.text || "[]"));
  } catch (e) {
    console.error("Error extractTopics:", e);
    throw new Error("Kon onderwerpen niet analyseren.");
  }
};

export const generateVennDiagram = async (description: string): Promise<string | null> => {
    // Generate SVG code instead of pixel image. Faster and cleaner.
    const prompt = `
      Create an SVG XML code string for a Venn Diagram representing this logic:
      "${description}"
      
      Requirements:
      - Use <svg> tag with viewBox="0 0 300 200".
      - Circles should have thin strokes (stroke="black") and semi-transparent fills (e.g., fill="rgba(255,0,0,0.3)").
      - Add <text> labels for sets (A, B, C) inside or near circles.
      - Return ONLY the raw SVG string. No markdown code blocks.
    `;

    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL, // Flash is excellent for coding/SVG
            contents: prompt,
        });

        const svgCode = response.text;
        if (!svgCode) return null;
        
        return cleanSvg(svgCode);
    } catch (e) {
        console.error("Error generating Venn diagram:", e);
        return null;
    }
};
