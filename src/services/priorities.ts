import { supabase } from '../lib/supabase';
import type { DailyPriorities } from '../types/priorities';
import type { Database } from '../types/supabase';

type DBPriorities = Database['public']['Tables']['daily_priorities']['Row'];

// Convert database priorities to application type
const toDailyPriorities = (dbPriorities: DBPriorities): DailyPriorities => ({
  id: dbPriorities.id,
  date: dbPriorities.date,
  priorities: dbPriorities.priorities,
  completedPriorities: dbPriorities.completed_priorities,
  createdAt: dbPriorities.created_at,
  updatedAt: dbPriorities.updated_at
});

export const prioritiesService = {
  async getDailyPriorities(date: string) {
    const { data, error } = await supabase
      .from('daily_priorities')
      .select('*')
      .eq('date', date)
      .maybeSingle();

    if (error) throw error;
    return data ? toDailyPriorities(data) : null;
  },

  async setDailyPriorities(priorities: string[], date: string, userId: string) {
    // First try to get existing priorities for this date
    const { data: existing } = await supabase
      .from('daily_priorities')
      .select('id')
      .eq('date', date)
      .eq('user_id', userId)
      .maybeSingle();

    let result;
    
    if (existing) {
      // If exists, update
      const { data, error } = await supabase
        .from('daily_priorities')
        .update({
          priorities,
          completed_priorities: [], // Reset completed priorities when updating the list
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // If doesn't exist, insert
      const { data, error } = await supabase
        .from('daily_priorities')
        .insert({
          user_id: userId,
          date,
          priorities,
          completed_priorities: []
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return toDailyPriorities(result);
  },

  async togglePriority(id: string, priority: string, completed: boolean) {
    const { data: current } = await supabase
      .from('daily_priorities')
      .select('completed_priorities')
      .eq('id', id)
      .single();

    const completedPriorities = current?.completed_priorities || [];
    const newCompletedPriorities = completed
      ? [...completedPriorities, priority]
      : completedPriorities.filter(p => p !== priority);

    const { data, error } = await supabase
      .from('daily_priorities')
      .update({ 
        completed_priorities: newCompletedPriorities,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toDailyPriorities(data);
  }
};