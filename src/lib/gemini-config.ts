import { GoogleGenerativeAI } from '@google/generative-ai';

export const MODEL_NAME = 'models/gemini-1.5-flash';

export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const model = genAI.getGenerativeModel({
  model: MODEL_NAME
});