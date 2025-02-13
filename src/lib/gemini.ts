import { genAI } from './gemini-config.ts';  // Add .ts extension
import type { EveningReviewContent, AIInsights } from '../types/journal';
import { createJournalPrompt } from './prompts/journalPrompt';
import { MODEL_NAME } from './gemini-config';

// Update each function to use the new model
export async function generateJournalInsights(content: string | EveningReviewContent, type: 'morning' | 'evening' = 'morning'): Promise<AIInsights> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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

// Export the helper function
export const createStructuredPrompt = (type: 'journal' | 'decision', content: string) => {
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
    `,
    decision: `
      Analyze this decision from a Stoic perspective and provide insights in the following format:
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
    `,
  };

  return prompts[type] + "\n\nContent to analyze:\n" + content;
};

export async function generateDecisionAnalysis(content: string): Promise<DecisionAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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

export async function enhanceGoalDescription(description: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `
    Enhance this goal description using best practices for effective goal definition. 
    Focus on making it:
    1. Specific and measurable
    2. Action-oriented
    3. Realistic yet challenging
    4. Time-bound where appropriate
    5. Aligned with Stoic principles

    Original description:
    ${description}

    Provide only the enhanced description without any additional commentary.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Failed to enhance goal description:', error);
    throw error;
  }
}

export async function generateReflectionPrompt(content: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    const prompt = createJournalPrompt(content);
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Failed to generate reflection prompt:', error);
    throw error;
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