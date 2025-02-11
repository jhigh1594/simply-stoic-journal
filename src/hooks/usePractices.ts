import { useState, useCallback } from 'react';
import { practicesService } from '../services/practices';
import type { Practice } from '../types/library';
import { useAsyncAction } from './useAsyncAction';

export function usePractices() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const { isLoading, error, execute } = useAsyncAction();

  const loadPractices = useCallback(async () => {
    const data = await execute(() => practicesService.getPractices());
    if (data) setPractices(data);
  }, [execute]);

  const createPractice = useCallback(async (practice: Omit<Practice, 'id' | 'likes' | 'liked_by' | 'completions'>) => {
    const data = await execute(() => practicesService.createPractice(practice));
    if (data) {
      setPractices(prev => [data, ...prev]);
      return data;
    }
  }, [execute]);

  const toggleLike = useCallback(async (practiceId: string, userId: string) => {
    const data = await execute(() => practicesService.toggleLike(practiceId, userId));
    if (data) {
      setPractices(prev => prev.map(practice =>
        practice.id === practiceId ? data : practice
      ));
      return data;
    }
  }, [execute]);

  const completePractice = useCallback(async (practiceId: string, userId: string, notes?: string) => {
    const data = await execute(() => practicesService.completePractice(practiceId, userId, notes));
    if (data) {
      setPractices(prev => prev.map(practice =>
        practice.id === practiceId ? data : practice
      ));
      return data;
    }
  }, [execute]);

  const searchPractices = useCallback(async (query: string) => {
    const data = await execute(() => practicesService.searchPractices(query));
    if (data) setPractices(data);
  }, [execute]);

  const getPracticesByCategory = useCallback(async (category: Practice['category']) => {
    const data = await execute(() => practicesService.getPracticesByCategory(category));
    if (data) setPractices(data);
  }, [execute]);

  const getLikedPractices = useCallback(async (userId: string) => {
    const data = await execute(() => practicesService.getLikedPractices(userId));
    if (data) setPractices(data);
  }, [execute]);

  return {
    practices,
    isLoading,
    error,
    loadPractices,
    createPractice,
    toggleLike,
    completePractice,
    searchPractices,
    getPracticesByCategory,
    getLikedPractices
  };
}