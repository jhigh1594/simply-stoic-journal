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