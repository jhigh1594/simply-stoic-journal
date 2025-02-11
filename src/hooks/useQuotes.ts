import { useState, useCallback } from 'react';
import { quotesService } from '../services/quotes';
import type { Quote } from '../types/library';
import { useAsyncAction } from './useAsyncAction';

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const { isLoading, error, execute } = useAsyncAction();

  const loadQuotes = useCallback(async () => {
    const data = await execute(() => quotesService.getQuotes());
    if (data) setQuotes(data);
  }, [execute]);

  const getDailyQuote = useCallback(async () => {
    return await execute(() => quotesService.getDailyQuote());
  }, [execute]);

  const toggleLike = useCallback(async (quoteId: string, userId: string) => {
    const data = await execute(() => quotesService.toggleLike(quoteId, userId));
    if (data) {
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId ? data : quote
      ));
      return data;
    }
  }, [execute]);

  return {
    quotes,
    isLoading,
    error,
    loadQuotes,
    getDailyQuote,
    toggleLike
  };
}