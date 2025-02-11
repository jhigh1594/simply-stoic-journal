import { useState, useCallback } from 'react';
import { goalsService } from '../services/goals';
import type { Goal, GoalTemplate, SubTask } from '../types/planning';
import { useAsyncAction } from './useAsyncAction';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [templates, setTemplates] = useState<GoalTemplate[]>([]);
  const { isLoading, error, execute } = useAsyncAction();

  const loadGoals = useCallback(async () => {
    const data = await execute(() => goalsService.getGoals());
    if (data) setGoals(data);
  }, [execute]);

  const loadTemplates = useCallback(async () => {
    const data = await execute(() => goalsService.getTemplates());
    if (data) setTemplates(data);
  }, [execute]);

  const createGoal = useCallback(async (goal: Omit<Goal, 'id' | 'createdAt' | 'subTasks'>) => {
    const data = await execute(() => goalsService.createGoal(goal));
    if (data) {
      setGoals(prev => [data, ...prev]);
      return data;
    }
  }, [execute]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'subTasks'>>) => {
    const data = await execute(() => goalsService.updateGoal(id, updates));
    if (data) {
      setGoals(prev => prev.map(goal => 
        goal.id === id ? { ...goal, ...data } : goal
      ));
      return data;
    }
  }, [execute]);

  const deleteGoal = useCallback(async (id: string) => {
    await execute(() => goalsService.deleteGoal(id));
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, [execute]);

  const addSubTask = useCallback(async (goalId: string, title: string) => {
    const data = await execute(() => goalsService.addSubTask(goalId, title));
    if (data) {
      setGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subTasks: [...goal.subTasks, data]
          };
        }
        return goal;
      }));
      return data;
    }
  }, [execute]);

  const updateSubTask = useCallback(async (goalId: string, taskId: string, updates: Partial<Omit<SubTask, 'id' | 'createdAt'>>) => {
    const data = await execute(() => goalsService.updateSubTask(taskId, updates));
    if (data) {
      setGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subTasks: goal.subTasks.map(task =>
              task.id === taskId ? { ...task, ...data } : task
            )
          };
        }
        return goal;
      }));
      return data;
    }
  }, [execute]);

  const createTemplate = useCallback(async (template: Omit<GoalTemplate, 'id' | 'createdAt'>) => {
    const data = await execute(() => goalsService.createTemplate(template));
    if (data) {
      setTemplates(prev => [data, ...prev]);
      return data;
    }
  }, [execute]);

  const createGoalFromTemplate = useCallback(async (templateId: string, dueDate?: string) => {
    const data = await execute(() => goalsService.createGoalFromTemplate(templateId, dueDate));
    if (data) {
      setGoals(prev => [data, ...prev]);
      return data;
    }
  }, [execute]);

  return {
    goals,
    templates,
    isLoading,
    error,
    loadGoals,
    loadTemplates,
    createGoal,
    updateGoal,
    deleteGoal,
    addSubTask,
    updateSubTask,
    createTemplate,
    createGoalFromTemplate
  };
}