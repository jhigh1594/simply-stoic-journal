// Remove this import since we're defining Practice here
// import type { Practice } from './practices';

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  theme?: string;
  tags?: string[];
  likes?: number;
  liked_by?: string[];
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  instructions: string;
  tips: string[];
  category: 'morning' | 'evening' | 'general';
  is_community?: boolean;
  likes?: number;
  completions?: Array<{
    userId: string;
    timestamp: string;
  }>;
}

export interface MentalModel {
  id: string;
  title: string;
  description: string;
  category: 'decision-making' | 'perspective' | 'behavior' | 'systems' | 'reasoning';
  key_principles: string[];
  examples: Array<{
    situation: string;
    application: string;
  }>;
  stoic_alignment: string;
  likes: number;
  liked_by?: string[];
}

export interface Principle {
  id: string;
  title: string;
  description: string;
  key_points: string[];
  application: string;
  historical_context: string;
}