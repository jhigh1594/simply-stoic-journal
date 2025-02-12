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
  const [checkpointGoals, setCheckpointGoals] = useState<{ [key: string]: CheckpointGoal[] }>({});
  const [dailySystems, setDailySystems] = useState<DailySystem[]>([]);
  const [antiGoals, setAntiGoals] = useState<AntiGoal[]>([]);
  const [abcTracking, setAbcTracking] = useState<ABCTracking[]>([]);
  const [monthlyReview, setMonthlyReview] = useState<MonthlyReview | null>(null);
  
  const { isLoading, error, execute } = useAsyncAction();
  const { userId } = useAuth();

  const loadBigGoals = useCallback(async () => {
    const data = await execute(() => planningService.getBigGoals());
    if (data) setBigGoals(data as BigGoal[]);
  }, [execute]);

  const loadCheckpointGoals = useCallback(async (big_goal_id: string) => {
    const data = await execute(() => planningService.getCheckpointGoals(big_goal_id));
    if (data) {
      setCheckpointGoals(prev => ({
        ...prev,
        [big_goal_id]: data as CheckpointGoal[]
      }));
    }
  }, [execute]);

  const loadDailySystems = useCallback(async (checkpointGoalId?: string) => {
    const data = await execute(() => planningService.getDailySystems(checkpointGoalId));
    if (data) setDailySystems(data as DailySystem[]);
  }, [execute]);

  const loadABCTracking = useCallback(async (date: string) => {
    const data = await execute(() => planningService.getABCTracking(date));
    if (data) setAbcTracking(data as ABCTracking[]);
  }, [execute]);

  const loadMonthlyReview = useCallback(async (month: string) => {
    const data = await execute(() => planningService.getMonthlyReview(month));
    if (data) setMonthlyReview(data as MonthlyReview);
  }, [execute]);

  const createBigGoal = useCallback(async (goal: Omit<BigGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createBigGoal({
      ...goal,
      user_id: userId
    }));
    if (data) {
      setBigGoals(prev => [data as BigGoal, ...prev]);
      return data as BigGoal;
    }
  }, [execute, userId]);

  const createCheckpointGoal = useCallback(async (goal: Omit<CheckpointGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createCheckpointGoal({
      ...goal,
      user_id: userId,
      big_goal_id: goal.big_goal_id
    }));
    if (data) {
      setCheckpointGoals(prev => ({
        ...prev,
        [goal.big_goal_id]: [...(prev[goal.big_goal_id] || []), data as CheckpointGoal]
      }));
      return data as CheckpointGoal;
    }
  }, [execute, userId]);

  const createDailySystem = useCallback(async (system: Omit<DailySystem, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createDailySystem({
      ...system,
      user_id: userId
    }));
    if (data) {
      setDailySystems(prev => [data as DailySystem, ...prev]);
      return data as DailySystem;
    }
  }, [execute, userId]);

  const trackABC = useCallback(async (tracking: Omit<ABCTracking, 'id' | 'created_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createABCTracking({
      ...tracking,
      user_id: userId
    }));
    if (data) {
      setAbcTracking(prev => [data as ABCTracking, ...prev]);
      return data as ABCTracking;
    }
  }, [execute, userId]);

  const createMonthlyReview = useCallback(async (review: Omit<MonthlyReview, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;
    const data = await execute(() => planningService.createMonthlyReview({
      ...review,
      user_id: userId
    }));
    if (data) {
      setMonthlyReview(data as MonthlyReview);
      return data as MonthlyReview;
    }
  }, [execute, userId]);

  // Remove antiGoals from state and return value since it's unused
  return {
    bigGoals,
    checkpointGoals,
    dailySystems,
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