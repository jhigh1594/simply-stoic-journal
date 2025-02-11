import { useState, useCallback } from 'react';
import { planningService } from '../services/planning';
import type {
  BigGoal,
  CheckpointGoal,
  DailySystem,
  AntiGoal,
  ABCTracking,
  MonthlyReview
} from '../types/planning';
import { useAsyncAction } from './useAsyncAction';
import { useAuth } from './useAuth';

export function usePlanning() {
  const [bigGoals, setBigGoals] = useState<BigGoal[]>([]);
  const [checkpointGoals, setCheckpointGoals] = useState<CheckpointGoal[]>([]);
  const [dailySystems, setDailySystems] = useState<DailySystem[]>([]);
  const [antiGoals, setAntiGoals] = useState<AntiGoal[]>([]);
  const [abcTracking, setAbcTracking] = useState<ABCTracking[]>([]);
  const [monthlyReview, setMonthlyReview] = useState<MonthlyReview | null>(null);
  
  const { isLoading, error, execute } = useAsyncAction();
  const { userId } = useAuth();

  const loadBigGoals = useCallback(async () => {
    const data = await execute(() => planningService.getBigGoals());
    if (data) setBigGoals(data);
  }, [execute]);

  const loadCheckpointGoals = useCallback(async (bigGoalId?: string) => {
    const data = await execute(() => planningService.getCheckpointGoals(bigGoalId));
    if (data) setCheckpointGoals(data);
  }, [execute]);

  const loadDailySystems = useCallback(async (checkpointGoalId?: string) => {
    const data = await execute(() => planningService.getDailySystems(checkpointGoalId));
    if (data) setDailySystems(data);
  }, [execute]);

  const loadABCTracking = useCallback(async (date: string) => {
    const data = await execute(() => planningService.getABCTracking(date));
    if (data) setAbcTracking(data);
  }, [execute]);

  const loadMonthlyReview = useCallback(async (month: string) => {
    const data = await execute(() => planningService.getMonthlyReview(month));
    if (data) setMonthlyReview(data);
  }, [execute]);

  const createBigGoal = useCallback(async (goal: Omit<BigGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createBigGoal({
      ...goal,
      user_id: userId
    }));
    if (data) {
      setBigGoals(prev => [data, ...prev]);
      return data;
    }
  }, [execute, userId]);

  const createCheckpointGoal = useCallback(async (goal: Omit<CheckpointGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createCheckpointGoal({
      ...goal,
      user_id: userId
    }));
    if (data) {
      setCheckpointGoals(prev => [data, ...prev]);
      return data;
    }
  }, [execute, userId]);

  const createDailySystem = useCallback(async (system: Omit<DailySystem, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createDailySystem({
      ...system,
      user_id: userId
    }));
    if (data) {
      setDailySystems(prev => [data, ...prev]);
      return data;
    }
  }, [execute, userId]);

  const trackABC = useCallback(async (tracking: Omit<ABCTracking, 'id' | 'created_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createABCTracking({
      ...tracking,
      user_id: userId
    }));
    if (data) {
      setAbcTracking(prev => [data, ...prev]);
      return data;
    }
  }, [execute, userId]);

  const createMonthlyReview = useCallback(async (review: Omit<MonthlyReview, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createMonthlyReview({
      ...review,
      user_id: userId
    }));
    if (data) {
      setMonthlyReview(data);
      return data;
    }
  }, [execute, userId]);

  return {
    bigGoals,
    checkpointGoals,
    dailySystems,
    antiGoals,
    abcTracking,
    monthlyReview,
    isLoading,
    error,
    loadBigGoals,
    loadCheckpointGoals,
    loadDailySystems,
    loadABCTracking,
    loadMonthlyReview,
    createBigGoal,
    createCheckpointGoal,
    createDailySystem,
    trackABC,
    createMonthlyReview
  };
}