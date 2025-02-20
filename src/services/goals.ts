import { supabase } from '../lib/supabase';
import type { Goal, GoalTemplate, SubTask, CheckpointGoal } from '../types/planning';
import type { Database } from '../types/supabase';

type DBGoal = Database['public']['Tables']['goals']['Row'];
type DBSubTask = Database['public']['Tables']['sub_tasks']['Row'];
type DBTemplate = Database['public']['Tables']['goal_templates']['Row'];

// Convert database goal to application type
const toGoal = async (dbGoal: DBGoal): Promise<Goal> => {
  // Fetch subtasks for this goal
  const { data: subTasks, error } = await supabase
    .from('sub_tasks')
    .select('*')
    .eq('goal_id', dbGoal.id)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return {
    id: dbGoal.id,
    title: dbGoal.title,
    description: dbGoal.description || undefined,
    timeframe: dbGoal.timeframe,
    priority: dbGoal.priority,
    status: dbGoal.status,
    progress: dbGoal.progress,
    dueDate: dbGoal.due_date || undefined,
    createdAt: dbGoal.created_at,
    subTasks: subTasks.map(toSubTask),
    user_id: dbGoal.user_id
  };
};

// Convert database subtask to application type
const toSubTask = (dbSubTask: DBSubTask): SubTask => ({
  id: dbSubTask.id,
  title: dbSubTask.title,
  status: dbSubTask.status,
  createdAt: dbSubTask.created_at
});

// Convert database template to application type
const toTemplate = (dbTemplate: DBTemplate): GoalTemplate => ({
  id: dbTemplate.id,
  title: dbTemplate.title,
  description: dbTemplate.description || undefined,
  timeframe: dbTemplate.timeframe,
  priority: dbTemplate.priority,
  createdAt: dbTemplate.created_at,
  subTasks: [] // Fetch subtasks if needed
});

export const goalsService = {
  async getGoals() {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Promise.all(goals.map(toGoal));
  },

  async getGoal(id: string) {
    const { data: goal, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return goal ? toGoal(goal) : null;
  },

  async createGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'subTasks'>) {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        title: goal.title,
        description: goal.description,
        timeframe: goal.timeframe,
        priority: goal.priority,
        status: goal.status || 'not_started',
        progress: goal.progress || 0,
        due_date: goal.dueDate,
        user_id: goal.user_id
      })
      .select()
      .single();

    if (error) throw error;
    return toGoal(data);
  },

  async updateGoal(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'subTasks'>>) {
    // Convert camelCase to snake_case for database
    const dbUpdates = {
      ...updates,
      due_date: updates.dueDate,
    };
    delete dbUpdates.dueDate;

    const { data, error } = await supabase
      .from('goals')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toGoal(data);
  },

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Subtask operations
  async addSubTask(goalId: string, title: string) {
    const { data, error } = await supabase
      .from('sub_tasks')
      .insert({
        goal_id: goalId,
        title,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return toSubTask(data);
  },

  async updateSubTask(id: string, updates: Partial<Omit<SubTask, 'id' | 'createdAt'>>) {
    const { data, error } = await supabase
      .from('sub_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toSubTask(data);
  },

  async deleteSubTask(id: string) {
    const { error } = await supabase
      .from('sub_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Template operations
  async getTemplates() {
    const { data: templates, error } = await supabase
      .from('goal_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return templates.map(toTemplate);
  },

  async createTemplate(template: Omit<GoalTemplate, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('goal_templates')
      .insert({
        ...template,
        user_id: '' // Will be set by getCurrentUserId()
      })
      .select()
      .single();

    if (error) throw error;
    return toTemplate(data);
  },

  async createGoalFromTemplate(templateId: string, dueDate?: string) {
    const template = await this.getTemplate(templateId);
    if (!template) throw new Error('Template not found');

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;
    if (!user_id) throw new Error('User not authenticated');

    const goal = await this.createGoal({
      title: template.title,
      description: template.description,
      timeframe: template.timeframe,
      priority: template.priority,
      status: 'not_started',
      progress: 0,
      dueDate,
      user_id
    });

    // Create subtasks if template has them
    if (template.subTasks?.length) {
      await Promise.all(
        template.subTasks.map(st => this.addSubTask(goal.id, st.title))
      );
    }

    return this.getGoal(goal.id);
  },

  async getTemplate(id: string) {
    const { data: template, error } = await supabase
      .from('goal_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return template ? toTemplate(template) : null;
  },  // Add missing comma here

  // Add these methods to goalsService
  async getCheckpointGoals(bigGoalId: string) {
    const { data: checkpoints, error } = await supabase
      .from('checkpoint_goals')
      .select('*')
      .eq('big_goal_id', bigGoalId)
      .order('created_at', { ascending: true });
  
    if (error) throw error;
    return checkpoints;
  },  // Add comma here
  
  async createCheckpointGoal(checkpoint: Omit<CheckpointGoal, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('checkpoint_goals')
      .insert({
        title: checkpoint.title,
        description: checkpoint.description,
        big_goal_id: checkpoint.big_goal_id,
        status: checkpoint.status || 'not_started',
        progress: checkpoint.progress || 0,
        target_date: checkpoint.target_date,
        blockers: checkpoint.blockers || []
      })
      .select()
      .single();
  
    if (error) throw error;
    return data;
  }
};