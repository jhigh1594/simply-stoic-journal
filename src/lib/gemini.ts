import { genAI } from './gemini-config.ts';  // Add .ts extension
import type { EveningReviewContent, AIInsights } from '../types/journal';

// Helper to ensure consistent prompt structure
const createStructuredPrompt = (type: 'journal' | 'decision', content: string) => {
  const prompts = {
    journal: `
      Analyze this journal entry from a Stoic perspective and provide insights in the following format:
      {
        "summary": "A brief, focused summary of the key points",
        "themes": ["3-5 main themes, focusing on Stoic principles"],
        "recommendations": [
          "3 actionable Stoic recommendations",
          "Each should be specific and tied to the content",
          "Focus on practical application"
        ],
        "stoic_analysis": "A deeper analysis connecting the entry to Stoic principles, focusing on wisdom, justice, courage, and temperance"
      }

      Important guidelines:
      - Keep responses concise and actionable
      - Focus on Stoic principles and practical application
      - Maintain a supportive, growth-oriented tone
      - Avoid generic advice
      - Connect insights to specific content

      Journal entry:
      ${content}
    `,
    decision: `
      Analyze this decision through a Stoic lens and provide structured guidance:
      {
        "dichotomy_of_control": {
          "within_control": ["List factors fully within control"],
          "partial_control": ["List factors with limited influence"],
          "outside_control": ["List factors beyond control"],
          "reflection": "Brief analysis of control aspects"
        },
        "virtue_analysis": {
          "wisdom": "How this decision tests/builds wisdom",
          "justice": "How this decision affects others",
          "courage": "What courage means in this context",
          "temperance": "How moderation applies here"
        },
        "recommendations": [
          "3 specific, actionable recommendations",
          "Based on Stoic principles",
          "Focused on what's within control"
        ]
      }

      Decision context:
      ${content}
    `
  };

  return prompts[type];
};

// Remove this interface since we're now using AIInsights from types/journal
interface JournalInsights {
  analysis: string;
  timestamp: string;
}

export async function generateJournalInsights(content: string | EveningReviewContent, type: 'morning' | 'evening' = 'morning'): Promise<AIInsights> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = '';
    let contentToAnalyze = '';

    if (type === 'morning') {
      prompt = `Analyze this morning reflection and provide insights about:
      1. Emotional state and mindset
      2. Key themes or patterns
      3. Areas of focus or growth
      4. Suggested stoic principles that could be relevant
      
      Reflection:`;
      contentToAnalyze = content as string;
    } else {
      const eveningContent = content as EveningReviewContent;
      prompt = `Analyze this evening review and provide insights about:
      1. Character development through virtues practiced
      2. Learning opportunities from challenges
      3. Areas for improvement
      4. Preparation quality for tomorrow
      5. Relevant stoic principles
      
      Review:
      - Virtues Practiced: ${JSON.stringify(eveningContent.virtues)}
      - Shortcomings: ${eveningContent.shortcomings}
      - Learning: ${JSON.stringify(eveningContent.learning)}
      - Tomorrow's Preparation: ${JSON.stringify(eveningContent.preparation)}`;
      contentToAnalyze = eveningContent.mainContent;
    }

    const result = await model.generateContent(prompt + '\n' + contentToAnalyze);
    const response = result.response;
    const text = response.text();

    return {
      analysis: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to generate insights:', error);
    throw error;
  }
}

export interface DecisionAnalysisResult {
  dichotomy_of_control: {
    within_control: string[];
    partial_control: string[];
    outside_control: string[];
    reflection: string;
  };
  virtue_analysis: {
    wisdom: string;
    justice: string;
    courage: string;
    temperance: string;
  };
  recommendations: string[];
}

export async function generateDecisionAnalysis(content: string): Promise<DecisionAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    const prompt = createStructuredPrompt('decision', content);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to generate decision analysis:', error);
    throw new Error('Failed to analyze decision. Please try again.');
  }
}

// Retry mechanism for API calls
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
}