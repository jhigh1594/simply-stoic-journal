import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Create instance with experimental model
export const genAI = new GoogleGenerativeAI(API_KEY);
export const MODEL_NAME = "gemini-2.0-pro-exp-02-05";