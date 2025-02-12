import { supabase } from '../lib/supabase';
import type {
  BigGoal,
  CheckpointGoal,
  DailySystem,
  // Remove unused AntiGoal import
  ABCTracking,
  MonthlyReview,
  GoalReflection,
  Frequency,
  TimeOfDay,
  ABCCategory,
  GoalCategory
} from '../types/planning';
import type { Database } from '../types/supabase';

// Type conversions
const toBigGoal = (row: Database['public']['Tables']['big_goals']['Row']): BigGoal => ({
  ...row,
  description: row.description || undefined,
  category: row.category as GoalCategory,
  stoic_analysis: row.stoic_analysis ? {
    control: (row.stoic_analysis as any).control,
    virtues: (row.stoic_analysis as any).virtues,
    obstacles: (row.stoic_analysis as any).obstacles || [],
    strategies: (row.stoic_analysis as any).strategies || []
  } : {
    control: undefined,
    virtues: undefined,
    obstacles: [],
    strategies: []
  }
});

const toCheckpointGoal = (row: Database['public']['Tables']['checkpoint_goals']['Row']): CheckpointGoal => ({
  ...row,
  description: row.description || undefined,
  blockers: row.blockers || []
});

// Keep only one toDailySystem with all required fields
const toDailySystem = (row: Database['public']['Tables']['daily_systems']['Row']): DailySystem => ({
  ...row,
  description: row.description || undefined,
  checkpoint_goal_id: row.checkpoint_goal_id || undefined,
  time_of_day: (row.time_of_day as TimeOfDay) || undefined,
  frequency: row.frequency as Frequency
});

// Keep only one toABCTracking with all required fields
const toABCTracking = (row: Database['public']['Tables']['abc_tracking']['Row']): ABCTracking => ({
  ...row,
  system_id: row.system_id || undefined,
  energy_level: row.energy_level || undefined,
  notes: row.notes || undefined,
  category: row.category as ABCCategory,
  updated_at: row.created_at
});

// Update toGoalReflection to include missing properties
// Add MonthlyReview conversion function
// Change MonthlyReviewRow to the correct type
const toMonthlyReview = (row: Database['public']['Tables']['monthly_reviews']['Row']): MonthlyReview => ({
  ...row,
  stoic_reflection: row.stoic_reflection || undefined,
  wins: row.wins || [],
  learnings: row.learnings || [],
  improvements: row.improvements || [],
  next_month_focus: row.next_month_focus || []
});

// Update toGoalReflection without the non-existent properties
const toGoalReflection = (row: Database['public']['Tables']['goal_reflections']['Row']): GoalReflection => ({
  ...row,
  obstacles: row.obstacles || [],
  strategies: row.strategies || [],
  virtue_alignment: {
    wisdom: 0,
    justice: 0,
    courage: 0,
    temperance: 0,
    notes: ''
  }
});

// Remove unused type
type Tables = Database['public']['Tables'];
type BigGoalsTable = Tables & { big_goals: any };

// Remove this unused type
// type CheckpointGoalsTable = Tables & { checkpoint_goals: any };

export const planningService = {
  // Big Goals
  async getBigGoals() {
    const { data, error } = await supabase
      .from('big_goals')
      .select('*')
      .order('created_at', { ascending: false }) as { data: BigGoalsTable['big_goals']['Row'][], error: any };

    if (error) throw error;
    return data.map(toBigGoal);
  },

  async createBigGoal(goal: Omit<BigGoal, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('big_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return toBigGoal(data);
  },

  async updateBigGoal(id: string, updates: Partial<Omit<BigGoal, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('big_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toBigGoal(data);
  },

  // Checkpoint Goals
  // Modify the getCheckpointGoals function
  async getCheckpointGoals(big_goal_id?: string) {
    let query = supabase
      .from('checkpoint_goals')
      .select('*')
      .order('target_date', { ascending: true });
  
    if (big_goal_id) {
      query = query.eq('big_goal_id', big_goal_id);
    }
  
    const { data, error } = await query;
    if (error) throw error;
    return data.map(toCheckpointGoal);
  },

  async createCheckpointGoal(goal: Omit<CheckpointGoal, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('checkpoint_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return toCheckpointGoal(data);
  },

  // Add this method
  async updateCheckpointGoal(id: string, updates: Partial<Omit<CheckpointGoal, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('checkpoint_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toCheckpointGoal(data);
  },

  // Daily Systems
  async getDailySystems(checkpointGoalId?: string) {
    let query = supabase
      .from('daily_systems')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (checkpointGoalId) {
      query = query.eq('checkpoint_goal_id', checkpointGoalId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data.map(toDailySystem);
  },

  async createDailySystem(system: Omit<DailySystem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('daily_systems')
      .insert(system)
      .select()
      .single();

    if (error) throw error;
    return toDailySystem(data);
  },

  // ABC Tracking
  async getABCTracking(date: string) {
    const { data, error } = await supabase
      .from('abc_tracking')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(toABCTracking);
  },

  async createABCTracking(tracking: Omit<ABCTracking, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('abc_tracking')
      .insert(tracking)
      .select()
      .single();

    if (error) throw error;
    return toABCTracking(data);
  },

  // Monthly Reviews
  async getMonthlyReview(month: string) {
    // Ensure we have a valid date format by appending a day
    const fullDate = `${month}-01`;
    
    const { data, error } = await supabase
      .from('monthly_reviews')
      .select('*')
      .eq('month', fullDate)
      .maybeSingle();

    if (error) throw error;
    return data ? toMonthlyReview(data) : null;
  },

  async createMonthlyReview(review: Omit<MonthlyReview, 'id' | 'created_at' | 'updated_at'>) {
    // Ensure we have a valid date format by appending a day
    const fullDate = `${review.month}-01`;
    
    const { data, error } = await supabase
      .from('monthly_reviews')
      .insert({ ...review, month: fullDate })
      .select()
      .single();

    if (error) throw error;
    return toMonthlyReview(data);
  },

  // Goal Reflections
  async createGoalReflection(reflection: Omit<GoalReflection, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('goal_reflections')
      .insert(reflection)
      .select()
      .single();

    if (error) throw error;
    return toGoalReflection(data);
  },

  async getGoalReflections(goalId: string) {
    const { data, error } = await supabase
      .from('goal_reflections')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(toGoalReflection);
  }
};