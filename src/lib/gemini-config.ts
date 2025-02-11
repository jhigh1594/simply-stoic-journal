import { GoogleGenerativeAI } from '@google/generative-ai';

// Use Vite's import.meta.env instead of process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const genAI = new GoogleGenerativeAI(API_KEY);