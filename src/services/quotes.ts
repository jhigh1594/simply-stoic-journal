import { supabase } from '../lib/supabase';
import type { Quote } from '../types/library';
import type { Database } from '../types/supabase';
import { quotes as staticQuotes } from '../data/quotes';

type DBQuote = Database['public']['Tables']['quotes']['Row'];

// Convert database quote to application type
const toQuote = (dbQuote: DBQuote): Quote => ({
  id: dbQuote.id,
  text: dbQuote.text,
  author: dbQuote.author,
  source: dbQuote.source || '',
  tags: dbQuote.tags || [],
  user_id: dbQuote.user_id || undefined,
  is_community: dbQuote.is_community,
  likes: dbQuote.likes,
  liked_by: dbQuote.liked_by || []
});

export const quotesService = {
  async getQuotes() {
    try {
      // For development, return static quotes with proper structure
      return staticQuotes.map(quote => ({
        ...quote,
        likes: quote.likes || 0,
        liked_by: quote.liked_by || [],
        is_community: false
      }));
    } catch (error) {
      console.error('Failed to load quotes:', error);
      throw error;
    }
  },

  async getDailyQuote() {
    try {
      // Get a random quote from static data
      const randomIndex = Math.floor(Math.random() * staticQuotes.length);
      return {
        ...staticQuotes[randomIndex],
        likes: 0,
        liked_by: [],
        is_community: false
      };
    } catch (error) {
      console.error('Failed to get daily quote:', error);
      throw error;
    }
  },

  async toggleLike(quoteId: string, userId: string) {
    try {
      // Find the quote in static data
      const quote = staticQuotes.find(q => q.id === quoteId);
      if (!quote) throw new Error('Quote not found');

      // Initialize liked_by if it doesn't exist
      const likedBy = quote.liked_by || [];
      const isLiked = likedBy.includes(userId);
      
      // Update the quote
      const updatedQuote = {
        ...quote,
        likes: (quote.likes || 0) + (isLiked ? -1 : 1),
        liked_by: isLiked 
          ? likedBy.filter(id => id !== userId)
          : [...likedBy, userId]
      };

      // Update the quote in the static array
      const quoteIndex = staticQuotes.findIndex(q => q.id === quoteId);
      if (quoteIndex !== -1) {
        staticQuotes[quoteIndex] = updatedQuote;
      }

      return updatedQuote;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  }
};