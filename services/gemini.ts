import { GoogleGenAI } from "@google/genai";
import { PillarTopic, LessonVariation, CourseStructure } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// Helper to extract JSON from code blocks if necessary
const extractJson = (text: string): any => {
  try {
    // Attempt to parse directly first
    return JSON.parse(text);
  } catch (e) {
    // Match markdown code blocks
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {
        console.error("Failed to parse extracted JSON", e2);
        throw new Error("No se pudo analizar la respuesta de la IA. Inténtalo de nuevo.");
      }
    }
    // Try matching without "json" identifier
    const match2 = text.match(/```\s*([\s\S]*?)\s*```/);
    if (match2 && match2[1]) {
      try {
        return JSON.parse(match2[1]);
      } catch (e3) {
        throw new Error("Formato de respuesta inválido.");
      }
    }
    throw new Error("No se encontró JSON válido en la respuesta.");
  }
};

export const generatePillars = async (topic: string): Promise<PillarTopic[]> => {
  const prompt = `
    Actúa como un mentor experto en diseño instruccional y estrategia de contenido.
    El usuario quiere crear un curso sobre el tema: "${topic}".
    Genera 10 "Temas Pilar" amplios que podrían servir como base para una estrategia de contenido o un curso completo.
    
    Usa la herramienta de búsqueda de Google para asegurar que los temas sean relevantes y actuales si es necesario, pero prioriza la estructura pedagógica.
    
    IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON (sin texto adicional fuera del JSON) que contenga un array llamado "pillars".
    Cada pilar debe tener: "id" (string único), "title" (string), "description" (breve explicación en español).
    
    Ejemplo de formato esperado:
    {
      "pillars": [
        { "id": "1", "title": "Fundamentos de...", "description": "..." }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Search grounding as requested
      }
    });

    const data = extractJson(response.text || "{}");
    return data.pillars || [];
  } catch (error) {
    console.error("Error generating pillars:", error);
    throw error;
  }
};

export const generateVariations = async (pillarTitle: string): Promise<LessonVariation[]> => {
  const prompt = `
    El usuario ha seleccionado el pilar temático: "${pillarTitle}".
    Genera 10 "Variaciones de Lección" específicas o ángulos de enfoque para crear un curso sobre este pilar.
    Deben ser títulos atractivos y específicos.

    IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON que contenga un array llamado "variations".
    Cada variación debe tener: "id", "title", "description" (en español).
    
    Ejemplo de formato:
    {
      "variations": [
        { "id": "1", "title": "Domina el arte de...", "description": "Un enfoque práctico para..." }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const data = extractJson(response.text || "{}");
    return data.variations || [];
  } catch (error) {
    console.error("Error generating variations:", error);
    throw error;
  }
};

export const generateCourse = async (variationTitle: string): Promise<CourseStructure> => {
  const prompt = `
    Crea una estructura de curso completa y detallada para el título: "${variationTitle}".
    Actúa como un diseñador instruccional de clase mundial.
    
    El curso debe ser MUY visual y estar bien estructurado.
    
    Debes generar un JSON con la siguiente estructura exacta:
    {
      "title": "Título del Curso",
      "subtitle": "Un subtítulo persuasivo",
      "primaryColor": "#hexcode",
      "secondaryColor": "#hexcode",
      "accentColor": "#hexcode",
      "modules": [
        {
          "id": "m1",
          "title": "Nombre del Módulo",
          "content": "Contenido educativo detallado en formato Markdown (sin bloques de código, solo texto, negritas, listas). Mínimo 200 palabras. Explica conceptos clave.",
          "imageKeyword": "palabra clave en inglés para buscar una imagen en unsplash/picsum",
          "chartData": {
            "title": "Título del gráfico explicativo",
            "type": "bar",
            "data": [
              { "name": "Etiqueta A", "value": 40 },
              { "name": "Etiqueta B", "value": 60 }
            ]
          },
          "quiz": [
             {
               "question": "¿Pregunta sobre el módulo?",
               "options": ["Opción A", "Opción B", "Opción C"],
               "correctAnswer": 0
             }
          ]
        }
      ]
    }
    
    Genera entre 4 y 5 módulos.
    Asegúrate de que el contenido sea educativo, de alta calidad y en ESPAÑOL.
    Usa Google Search para validar datos si es un tema técnico o de actualidad.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Grounding used here
        thinkingConfig: { thinkingBudget: 1024 } // Give it some thought for structure
      }
    });

    const data = extractJson(response.text || "{}");
    // Validate/Sanitize basic structure if needed, but for now trust the schema
    return data;
  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};
