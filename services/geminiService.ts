import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (topic: string): Promise<Question[]> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `Generate a quiz with exactly 10 multiple-choice questions about "${topic}". 
  Each question must have 4 distinct options. 
  Ensure the questions vary in difficulty. 
  Provide a clear explanation for the correct answer.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { 
                type: Type.STRING,
                description: "The question text"
              },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "An array of exactly 4 possible answers"
              },
              correctAnswer: { 
                type: Type.STRING,
                description: "The exact string of the correct option from the options array"
              },
              explanation: { 
                type: Type.STRING,
                description: "A short explanation of why the answer is correct"
              }
            },
            required: ["text", "options", "correctAnswer", "explanation"],
            propertyOrdering: ["text", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const rawData = JSON.parse(response.text);
    
    // Map and validate to ensure robust ID assignment
    return rawData.map((q: any, index: number) => ({
      id: index,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));

  } catch (error) {
    console.error("Failed to generate quiz:", error);
    throw error;
  }
};