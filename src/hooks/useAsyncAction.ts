import { useState, useCallback } from 'react';
import { toErrorWithMessage } from '../types/error';

interface AsyncActionState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useAsyncAction<T>() {
  const [state, setState] = useState<AsyncActionState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await asyncFunction();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      setState({ data: null, error: errorWithMessage.message, isLoading: false });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return { ...state, execute, reset };
}