// Add new types for evening review
export interface EveningReviewContent {
  mainContent: string;
  virtues: {
    wisdom: string;
    courage: string;
    justice: string;
    temperance: string;
  };
  shortcomings: string;
  learning: {
    challenge: string;
    lesson: string;
  };
  preparation: {
    challenges: string;
    approach: string;
  };
}

export interface DecisionAnalysis {
  question: string;
  factors: Array<{
    text: string;
    type: 'controllable' | 'uncontrollable';
    impact: 'high' | 'medium' | 'low';
  }>;
  analysis: string;
  conclusion: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  type: 'morning' | 'evening' | 'decision';
  mood?: string;
  content: string;
  intention: string;
  gratitudeList: string[]; // Changed from gratitude_list to gratitudeList
  priorities: string[];
  tags: string[];
  ai_insights: Record<string, any>;
  decision_analysis?: {
    question: string;
    factors: {
      text: string;
      type: 'controllable' | 'uncontrollable';
      impact: 'high' | 'medium' | 'low';
    }[];
    analysis: string;
    conclusion: string;
  };
}