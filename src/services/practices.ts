import { supabase } from '../lib/supabase';
import type { Practice } from '../types/library';
import type { Database } from '../types/supabase';

type DBPractice = Database['public']['Tables']['practices']['Row'];
type DBCompletion = Database['public']['Tables']['practice_completions']['Row'];

// Convert database practice to application type
const toPractice = async (dbPractice: DBPractice): Promise<Practice> => {
  // Fetch completions for this practice
  const { data: completions, error } = await supabase
    .from('practice_completions')
    .select('*')
    .eq('practice_id', dbPractice.id)
    .order('completed_at', { ascending: false });

  if (error) throw error;

  return {
    id: dbPractice.id,
    title: dbPractice.title,
    description: dbPractice.description || '',
    instructions: dbPractice.instructions || '',
    tips: dbPractice.tips || [],
    category: dbPractice.category,
    user_id: dbPractice.user_id || undefined,
    is_community: dbPractice.is_community,
    likes: dbPractice.likes,
    liked_by: dbPractice.liked_by || [],
    completions: completions.map(c => ({
      date: c.completed_at,
      notes: c.notes || undefined
    }))
  };
};

export const practicesService = {
  async getPractices() {
    const { data: practices, error } = await supabase
      .from('practices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Promise.all(practices.map(toPractice));
  },

  async getPractice(id: string) {
    const { data: practice, error } = await supabase
      .from('practices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return practice ? toPractice(practice) : null;
  },

  async toggleLike(practiceId: string, userId: string) {
    const { data: practice } = await supabase
      .from('practices')
      .select('likes, liked_by')
      .eq('id', practiceId)
      .single();

    if (!practice) throw new Error('Practice not found');

    const likedBy = practice.liked_by || [];
    const isLiked = likedBy.includes(userId);
    const newLikedBy = isLiked
      ? likedBy.filter(id => id !== userId)
      : [...likedBy, userId];
    const newLikes = isLiked ? practice.likes - 1 : practice.likes + 1;

    const { data, error } = await supabase
      .from('practices')
      .update({
        likes: newLikes,
        liked_by: newLikedBy
      })
      .eq('id', practiceId)
      .select()
      .single();

    if (error) throw error;
    return toPractice(data);
  },

  async completePractice(practiceId: string, userId: string, notes?: string) {
    const { data, error } = await supabase
      .from('practice_completions')
      .insert({
        practice_id: practiceId,
        user_id: userId,
        notes,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return this.getPractice(practiceId);
  }
};