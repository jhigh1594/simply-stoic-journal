import type { Quote } from './quotes';
import type { Practice } from './practices';

export interface MentalModel {
  id: string;
  title: string;
  description: string;
  category: 'decision-making' | 'perspective' | 'behavior' | 'systems' | 'reasoning';
  key_principles: string[];
  examples: {
    situation: string;
    application: string;
  }[];
  stoic_alignment: string;
  likes: number;
  liked_by?: string[];
}

export type { Quote, Practice };