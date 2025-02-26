import { useState, useCallback, useEffect } from 'react';
import { practicesService } from '../services/practices';
import type { Practice } from '../types/library';
import { useAsyncAction } from './useAsyncAction';

export function usePractices() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const { isLoading, error, execute } = useAsyncAction();

  const loadPractices = useCallback(async () => {
    const data = await execute(() => practicesService.getPractices());
    if (data) setPractices(data as Practice[]);
  }, [execute]);

  const createPractice = useCallback(async (practice: Omit<Practice, 'id' | 'likes' | 'liked_by' | 'completions'>) => {
    const data = await execute(() => practicesService.createPractice(practice));
    if (data) {
      setPractices(prev => [...prev, data as Practice]);
      return data;
    }
  }, [execute]);

  const toggleLike = useCallback(async (practiceId: string, userId: string) => {
    const data = await execute(() => practicesService.toggleLike(practiceId, userId));
    if (data) {
      setPractices(prev => prev.map(practice =>
        practice.id === practiceId ? { ...practice, ...data } as Practice : practice
      ));
      return data;
    }
  }, [execute]);

  const completePractice = useCallback(async (practiceId: string, userId: string, notes?: string) => {
    const data = await execute(() => practicesService.completePractice(practiceId, userId, notes));
    if (data) {
      setPractices(prev => prev.map(practice =>
        practice.id === practiceId ? { ...practice, ...data } as Practice : practice
      ));
      return data;
    }
  }, [execute]);

  // Load practices on mount
  useEffect(() => {
    loadPractices();
  }, [loadPractices]);

  return {
    practices,
    isLoading,
    error,
    loadPractices,
    createPractice,
    toggleLike,
    completePractice
  };
}