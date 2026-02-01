
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSessionIdeas = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest a compelling cybersecurity meetup title and short description for the topic: ${topic}. Format it as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "description", "tags"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getCyberAdvice = async (query: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a cybersecurity expert assistant in a live meetup. Provide a concise technical answer to: ${query}`,
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text;
};
