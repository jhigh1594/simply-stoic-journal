import type { Goal } from './planning';

export interface Task {
  id: string;
  title: string;
  description?: string;
  duration?: '15' | '30' | '60';
  scheduled?: boolean;
  date?: string;
  time?: string;
  goalId?: string;
}

export const taskFromGoal = (goal: Goal): Task => ({
  id: goal.id,
  title: goal.title,
  description: goal.description,
  scheduled: Boolean(goal.dueDate),
  date: goal.dueDate,
  goalId: goal.id
});