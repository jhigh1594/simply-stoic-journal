// Base types for common fields
interface BaseEntity {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type GoalCategory = 'professional' | 'personal';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'abandoned';
export type Frequency = 'daily' | 'weekday' | 'weekend' | 'weekly';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';
export type ImpactLevel = 'low' | 'medium' | 'high';
export type ABCCategory = 'A' | 'B' | 'C';
export type ReflectionType = 'big_goal' | 'checkpoint' | 'system';

// Stoic analysis interfaces
export interface ControlAnalysis {
  within_control: string[];
  partial_control: string[];
  outside_control: string[];
  reflections: string;
}

export interface VirtueAlignment {
  wisdom: number;
  justice: number;
  courage: number;
  temperance: number;
  notes: string;
}

// Main interfaces
export interface BigGoal extends BaseEntity {
  title: string;
  description?: string;
  category: GoalCategory;
  target_date?: string;
  status: Exclude<GoalStatus, 'blocked'>;
  stoic_analysis: {
    control?: ControlAnalysis;
    virtues?: VirtueAlignment;
    obstacles?: string[];
    strategies?: string[];
  };
}

export interface CheckpointGoal extends BaseEntity {
  big_goal_id: string;
  title: string;
  description?: string;
  target_date: string;
  progress: number;
  status: GoalStatus;
  blockers: string[];
}

export interface DailySystem extends BaseEntity {
  title: string;
  description?: string;
  checkpoint_goal_id?: string;
  frequency: Frequency;
  time_of_day?: TimeOfDay;
  active: boolean;
}

export interface AntiGoal extends BaseEntity {
  title: string;
  description?: string;
  category: GoalCategory | 'habit';
  impact_level: ImpactLevel;
  mitigation_strategy?: string;
}

export interface ABCTracking extends BaseEntity {
  date: string;
  category: ABCCategory;
  description: string;
  system_id?: string;
  energy_level?: number;
  notes?: string;
}

export interface MonthlyReview extends BaseEntity {
  month: string;
  wins: string[];
  learnings: string[];
  improvements: string[];
  next_month_focus: string[];
  stoic_reflection?: string;
}

export interface GoalReflection extends BaseEntity {
  goal_id: string;
  reflection_type: ReflectionType;
  control_analysis: ControlAnalysis;
  virtue_alignment: VirtueAlignment;
  obstacles: string[];
  strategies: string[];
}