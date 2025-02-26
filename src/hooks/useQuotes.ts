import { useState, useCallback, useEffect } from 'react';
import { quotesService } from '../services/quotes';
import type { Quote } from '../types/library';
import { useAsyncAction } from './useAsyncAction';

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  
  const { isLoading, error, execute } = useAsyncAction();

  const loadQuotes = useCallback(async () => {
    const data = await execute(() => quotesService.getQuotes());
    if (data && Array.isArray(data)) setQuotes(data);
  }, [execute]);

  // Add useEffect to load quotes on mount
  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const getDailyQuote = useCallback(async () => {
    return await execute(() => quotesService.getDailyQuote());
  }, [execute]);

  const toggleLike = useCallback(async (quoteId: string, userId: string) => {
    const data = await execute(() => quotesService.toggleLike(quoteId, userId));
    if (data) {
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, ...data } as Quote 
          : quote
      ));
      return data;
    }
  }, [execute]);

  // Remove unused updateQuotes function

  return {
    quotes,
    isLoading,
    error,
    loadQuotes,
    getDailyQuote,
    toggleLike
  };
}