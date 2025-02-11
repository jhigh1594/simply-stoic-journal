import { supabase } from '../lib/supabase';
import type {
  BigGoal,
  CheckpointGoal,
  DailySystem,
  AntiGoal,
  ABCTracking,
  MonthlyReview,
  GoalReflection
} from '../types/planning';
import type { Database } from '../types/supabase';

// Type conversions
const toBigGoal = (row: Database['public']['Tables']['big_goals']['Row']): BigGoal => ({
  ...row,
  stoic_analysis: row.stoic_analysis || {}
});

const toCheckpointGoal = (row: Database['public']['Tables']['checkpoint_goals']['Row']): CheckpointGoal => ({
  ...row,
  blockers: row.blockers || []
});

const toDailySystem = (row: Database['public']['Tables']['daily_systems']['Row']): DailySystem => ({
  ...row
});

const toAntiGoal = (row: Database['public']['Tables']['anti_goals']['Row']): AntiGoal => ({
  ...row
});

const toABCTracking = (row: Database['public']['Tables']['abc_tracking']['Row']): ABCTracking => ({
  ...row
});

const toMonthlyReview = (row: Database['public']['Tables']['monthly_reviews']['Row']): MonthlyReview => ({
  ...row,
  wins: row.wins || [],
  learnings: row.learnings || [],
  improvements: row.improvements || [],
  next_month_focus: row.next_month_focus || []
});

const toGoalReflection = (row: Database['public']['Tables']['goal_reflections']['Row']): GoalReflection => ({
  ...row,
  obstacles: row.obstacles || [],
  strategies: row.strategies || []
});

export const planningService = {
  // Big Goals
  async getBigGoals() {
    const { data, error } = await supabase
      .from('big_goals')
      .select('*')
      .order('created_at', { ascending: false });

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
  async getCheckpointGoals(bigGoalId?: string) {
    let query = supabase
      .from('checkpoint_goals')
      .select('*')
      .order('target_date', { ascending: true });

    if (bigGoalId) {
      query = query.eq('big_goal_id', bigGoalId);
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