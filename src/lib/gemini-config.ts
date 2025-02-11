import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
export const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');