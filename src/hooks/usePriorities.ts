import { useState, useCallback } from 'react';
import { prioritiesService } from '../services/priorities';
import type { DailyPriorities } from '../types/priorities';
import { useAsyncAction } from './useAsyncAction';
import { useAuth } from './useAuth';

export function usePriorities() {
  const [priorities, setPriorities] = useState<DailyPriorities | null>(null);
  const { isLoading, error, execute } = useAsyncAction();
  const { userId } = useAuth();

  const loadPriorities = useCallback(async (date: string) => {
    const data = await execute(() => prioritiesService.getDailyPriorities(date));
    if (data) setPriorities(data);
  }, [execute]);

  const setPriorityList = useCallback(async (priorityList: string[], date: string) => {
    if (!userId) return;
    const data = await execute(() => prioritiesService.setDailyPriorities(priorityList, date, userId));
    if (data) setPriorities(data);
  }, [execute, userId]);

  const togglePriority = useCallback(async (priority: string, completed: boolean) => {
    if (!priorities?.id) return;
    const data = await execute(() => prioritiesService.togglePriority(priorities.id, priority, completed));
    if (data) setPriorities(data);
  }, [execute, priorities?.id]);

  return {
    priorities,
    isLoading,
    error,
    loadPriorities,
    setPriorityList,
    togglePriority
  };
}