import { genAI } from './gemini-config';  // Remove .ts extension for production builds
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
  recommendations: string[];  // Add this line
}

export async function generateDecisionAnalysis(content: string): Promise<DecisionAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `As a Stoic philosopher and advisor who prioritizes the practical and actionable aspects of Stoicism, analyze this decision through the Dichotomy of Control:

    Provide a clear, structured response with exactly these sections:

    1. WITHIN OUR CONTROL
    List 3-4 specific aspects we have complete control over, each in a single clear sentence.

    2. PARTIALLY IN OUR CONTROL
    List 2-3 aspects where we can influence but not determine the outcome, each in a single clear sentence.

    3. BEYOND OUR CONTROL
    List 2-3 external factors we must accept, each in a single clear sentence.

    4. STOIC APPROACH
    In 2-3 sentences, explain how to move forward focusing on what we can control while accepting what we cannot.

    Decision details:
    ${content}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Update the default result to include recommendations
    const defaultResult: DecisionAnalysisResult = {
      dichotomy_of_control: {
        within_control: [],
        partial_control: [],
        outside_control: [],
        reflection: 'Unable to parse control analysis.'
      },
      recommendations: []  // Add this line
    };

    try {
      // Parse the response into structured sections
      const sections = text.split(/\d\./);
      
      if (sections.length >= 4) {
        return {
          dichotomy_of_control: {
            within_control: extractList(sections[1], '') || defaultResult.dichotomy_of_control.within_control,
            partial_control: extractList(sections[2], '') || defaultResult.dichotomy_of_control.partial_control,
            outside_control: extractList(sections[3], '') || defaultResult.dichotomy_of_control.outside_control,
            reflection: sections[4]?.trim() || defaultResult.dichotomy_of_control.reflection
          },
          recommendations: extractList(sections[4], '') || defaultResult.recommendations  // Add this line
        };
      }
      
      return defaultResult;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return defaultResult;
    }
  } catch (error) {
    console.error('Failed to generate decision analysis:', error);
    throw error;
  }
}

// Update extractList to handle the new format
function extractList(text: string, marker: string): string[] {
  const lines = text?.split('\n') || [];
  return lines
    .filter(line => line.trim() && !line.match(/^[A-Z\s]+$/))
    .map(line => line.replace(/^[•\-\d]+\.?\s*/, '').trim())
    .filter(Boolean);
}

function extractSection(text: string, marker: string): string {
  const lines = text?.split('\n') || [];
  const startIndex = lines.findIndex(line => line.includes(marker));
  if (startIndex === -1) return '';
  
  let content = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].match(/[A-Z][a-z]+:/)) break;
    if (lines[i].trim()) content.push(lines[i].trim());
  }
  return content.join('\n');
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
export interface ActionPlanResult {
  recommendations: string[];
}

export async function generateActionPlan(question: string, analysis: string): Promise<ActionPlanResult> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `As a Stoic philosopher and advisor who prioritizes the practical and actionable aspects of Stoicism, create a concrete action plan for this decision:

    Question: ${question}
    Previous Analysis: ${analysis}

    Provide 3-5 specific, actionable steps that:
    1. Focus exclusively on what is within our control
    2. Are clear and measurable
    3. Align with Stoic principles
    4. Can be implemented immediately

    Format each step as a clear, direct instruction starting with an action verb.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      console.error('Empty response from AI');
      return { recommendations: [] };
    }

    const recommendations = text
      .split('\n')
      .filter(line => line && line.trim()) // Remove empty lines first
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line && !line.match(/^[A-Z\s]+$/));

    return { recommendations: recommendations.length ? recommendations : [] };
  } catch (error) {
    console.error('Failed to generate action plan:', error);
    return { recommendations: [] }; // Return empty array instead of throwing
  }
}