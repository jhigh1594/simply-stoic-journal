export interface AIInsights {
  summary?: string;
  analysis: string;
  timestamp: string;
  themes?: string[];
  keywords?: string[];
  sentiment?: string;
  recommendations?: string[];
  stoic_analysis?: string;
  dichotomy_of_control?: {
    within_control: string[];
    partial_control: string[];
    outside_control: string[];
    reflection?: string;
  };
  virtue_analysis?: {
    [key: string]: string;
  };
}

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
  priorityReview: {
    completedPriorities: string[];
    reflection: string;
  };
}

export interface JournalEntry {
  id?: string;
  date: string;
  user_id: string;
  type: 'morning' | 'evening' | 'decision';
  mood?: string;
  content: string;
  tags: string[];
  intention?: string;
  gratitudeList: string[]; // Remove optional flag
  priorities: string[]; // Remove optional flag
  decision_analysis?: {
    question: string;
    factors: Array<{
      text: string;
      type: 'controllable' | 'uncontrollable';
      impact: 'high' | 'medium' | 'low';
    }>;
    analysis: string;
    conclusion: string;
  };
  ai_insights?: AIInsights;
}