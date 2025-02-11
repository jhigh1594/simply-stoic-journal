import { supabase } from '../lib/supabase';
import type { JournalEntry } from '../types/journal';
import type { Database } from '../types/supabase';

type DBJournalEntry = Database['public']['Tables']['journal_entries']['Row'];

// Convert database entry to application type
const toJournalEntry = (dbEntry: DBJournalEntry): JournalEntry => ({
  id: dbEntry.id,
  user_id: dbEntry.user_id,
  date: dbEntry.created_at,
  type: dbEntry.type,
  mood: dbEntry.mood || undefined,
  content: dbEntry.content || '',
  intention: dbEntry.intention || '',
  gratitudeList: dbEntry.gratitudeList || [], // Changed from gratitude_list
  priorities: dbEntry.priorities || [],
  tags: dbEntry.tags || [],
  ai_insights: dbEntry.ai_insights as JournalEntry['ai_insights'],
  decision_analysis: dbEntry.decision_analysis as JournalEntry['decision_analysis']
});

export const journalService = {
  async getEntries() {
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return entries.map(toJournalEntry);
  },

  async getEntry(id: string) {
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return entry ? toJournalEntry(entry) : null;
  },

  async createEntry(entry: Omit<JournalEntry, 'id'>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: entry.user_id,
        type: entry.type,
        mood: entry.mood,
        content: entry.content,
        intention: entry.intention,
        gratitudeList: entry.gratitudeList, // Changed from gratitude_list
        priorities: entry.priorities,
        tags: entry.tags,
        ai_insights: entry.ai_insights,
        decision_analysis: entry.decision_analysis,
        created_at: entry.date
      })
      .select()
      .single();

    if (error) throw error;
    return toJournalEntry(data);
  },

  async updateEntry(id: string, updates: Partial<Omit<JournalEntry, 'id'>>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toJournalEntry(data);
  },

  async deleteEntry(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async searchEntries(query: string) {
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .or(`content.ilike.%${query}%, intention.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return entries.map(toJournalEntry);
  },

  async getEntriesByDateRange(startDate: string, endDate: string) {
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return entries.map(toJournalEntry);
  },

  async getEntriesByTags(tags: string[]) {
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .contains('tags', tags)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return entries.map(toJournalEntry);
  }
};