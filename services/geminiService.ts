import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { AiResponse } from "../types";

// Initialize Gemini AI
// Note: process.env.API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";
const ttsModelName = "gemini-2.5-flash-preview-tts";

const moveSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    from: { type: Type.STRING, description: "The starting square of the move (e.g., 'e2')" },
    to: { type: Type.STRING, description: "The destination square of the move (e.g., 'e4')" },
    message: { type: Type.STRING, description: "A short, very cute and encouraging message in Turkish explaining the move to a 5-year-old girl." }
  },
  required: ["from", "to", "message"]
};

export const getAiMove = async (fen: string, validMoves: string[]): Promise<AiResponse> => {
  try {
    const systemInstruction = `
      Sen "Sihirli Unicorn" adında sevimli bir satranç öğretmenisin. 
      5 yaşındaki bir kız çocuğuyla satranç oynuyorsun. 
      Sen Siyah taşlarla oynuyorsun.
      
      Görevin:
      1. Mevcut FEN (Forsyth-Edwards Notation) durumuna göre GEÇERLİ ve ÇOK ZOR OLMAYAN bir hamle yap.
      2. Hamleni yaparken çocuğa cesaret verici, tatlı ve eğlenceli bir şeyler söyle (Türkçe).
      3. Asla kaba olma. Eğer çocuk iyi bir hamle yaptıysa onu öv.
      4. Sadece yasal (legal) hamleler yapabilirsin.
    `;

    const prompt = `
      Şu anki satranç tahtası durumu (FEN): ${fen}
      
      Lütfen Siyah (Black) için bir hamle seç.
      Hamlenin yasal olması zorunludur.
      
      İşte mevcut yasal hamlelerin listesi (UCI formatında, örn: e7e5, g8f6):
      ${validMoves.join(', ')}
      
      Lütfen bu listeden birini seç.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: moveSchema,
        temperature: 0.5, // Keep it relatively logical but friendly
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI response was empty");

    const result = JSON.parse(text) as AiResponse;
    return result;

  } catch (error) {
    console.error("Error getting AI move:", error);
    // Fallback safe move if AI fails (conceptually, though in this code we handle errors in UI)
    throw error;
  }
};

export const getWelcomeMessage = async (): Promise<string> => {
  try {
     const response = await ai.models.generateContent({
      model: modelName,
      contents: "5 yaşındaki bir kıza satranç oynamaya başlamadan önce 'Merhaba' diyen ve kendini 'Sihirli Unicorn' olarak tanıtan çok kısa, tatlı bir mesaj yaz.",
      config: {
        responseMimeType: "text/plain",
      }
    });
    return response.text || "Merhaba Prenses! Satranç oynamaya hazır mısın?";
  } catch (e) {
    return "Merhaba Prenses! Satranç oynamaya hazır mısın?";
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: ttsModelName,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Friendly female voice
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};