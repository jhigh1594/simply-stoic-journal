export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          type: 'morning' | 'evening' | 'decision';
          mood: string | null;
          content: string | null;
          intention: string | null;
          gratitudeList: string[] | null; // Changed from gratitude_list
          priorities: string[] | null;
          tags: string[] | null;
          ai_insights: Json;
          created_at: string;
          daily_priorities_id: string | null;
          decision_analysis: Json | null;
        }
        Insert: {
          id?: string
          user_id: string
          type: 'morning' | 'evening' | 'decision'
          mood?: string | null
          content?: string | null
          intention?: string | null
          gratitudeList?: string[] | null; // Changed from gratitude_list
          priorities?: string[] | null
          tags?: string[] | null
          ai_insights?: Json | null
          created_at?: string
          daily_priorities_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'morning' | 'evening' | 'decision'
          mood?: string | null
          content?: string | null
          intention?: string | null
          gratitudeList?: string[] | null; // Changed from gratitude_list
          priorities?: string[] | null
          tags?: string[] | null
          ai_insights?: Json | null
          created_at?: string
          daily_priorities_id?: string | null
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          timeframe: 'daily' | 'weekly' | 'quarterly'
          priority: 'low' | 'medium' | 'high'
          status: 'not_started' | 'in_progress' | 'completed'
          progress: number
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          timeframe: 'daily' | 'weekly' | 'quarterly'
          priority: 'low' | 'medium' | 'high'
          status?: 'not_started' | 'in_progress' | 'completed'
          progress?: number
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          timeframe?: 'daily' | 'weekly' | 'quarterly'
          priority?: 'low' | 'medium' | 'high'
          status?: 'not_started' | 'in_progress' | 'completed'
          progress?: number
          due_date?: string | null
          created_at?: string
        }
      }
      sub_tasks: {
        Row: {
          id: string
          goal_id: string
          title: string
          status: 'pending' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          title: string
          status?: 'pending' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          title?: string
          status?: 'pending' | 'completed'
          created_at?: string
        }
      }
      goal_templates: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          timeframe: 'daily' | 'weekly' | 'quarterly'
          priority: 'low' | 'medium' | 'high'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          timeframe: 'daily' | 'weekly' | 'quarterly'
          priority: 'low' | 'medium' | 'high'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          timeframe?: 'daily' | 'weekly' | 'quarterly'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          text: string
          author: string
          source: string | null
          tags: string[] | null
          user_id: string | null
          is_community: boolean
          likes: number
          liked_by: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          author: string
          source?: string | null
          tags?: string[] | null
          user_id?: string | null
          is_community?: boolean
          likes?: number
          liked_by?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          author?: string
          source?: string | null
          tags?: string[] | null
          user_id?: string | null
          is_community?: boolean
          likes?: number
          liked_by?: string[] | null
          created_at?: string
        }
      }
      practices: {
        Row: {
          id: string
          title: string
          description: string | null
          instructions: string | null
          tips: string[] | null
          category: 'morning' | 'evening' | 'general'
          user_id: string | null
          is_community: boolean
          likes: number
          liked_by: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          instructions?: string | null
          tips?: string[] | null
          category: 'morning' | 'evening' | 'general'
          user_id?: string | null
          is_community?: boolean
          likes?: number
          liked_by?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          instructions?: string | null
          tips?: string[] | null
          category?: 'morning' | 'evening' | 'general'
          user_id?: string | null
          is_community?: boolean
          likes?: number
          liked_by?: string[] | null
          created_at?: string
        }
      }
      practice_completions: {
        Row: {
          id: string
          practice_id: string
          user_id: string
          notes: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          user_id: string
          notes?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          user_id?: string
          notes?: string | null
          completed_at?: string
        }
      }
    }
  }
}