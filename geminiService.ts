import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateChatResponse = async (
  history: { role: string; text: string }[],
  currentMessage: string
): Promise<string> => {
  try {
    if (!apiKey) return "API Key is missing. Please check your configuration.";

    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: `You are a helpful, empathetic, and knowledgeable retirement planning assistant named "RetireReady AI". 
        Keep answers concise (under 100 words) unless asked for detail. 
        Use a professional yet encouraging tone. 
        Focus on financial literacy terms like 401(k), Roth, Compound Interest, Vesting, and Asset Allocation.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message: currentMessage });
    return result.text || "I'm having trouble thinking right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, but I'm currently unable to connect to the retirement insights database.";
  }
};

export const getAIRecommendation = async (context: string): Promise<string> => {
   try {
    if (!apiKey) return "Mock AI: Based on your age and income, we recommend a diversified growth strategy.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Context: ${context}. 
      Task: Provide a 1-sentence strategic recommendation for a user's retirement plan selection or contribution rate. 
      Tone: Professional, motivating.`,
    });
    return response.text || "Consider increasing your contribution to max out the employer match.";
   } catch (error) {
     return "Consider reviewing your long-term goals to adjust this setting.";
   }
};
