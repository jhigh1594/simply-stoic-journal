import type { Goal, GoalTemplate, SubTask } from '../types/planning';

let goals: Goal[] = [];
let templates: GoalTemplate[] = [
  {
    id: 'daily-routine',
    title: 'Daily Stoic Practice',
    description: 'A structured daily routine for practicing Stoic principles',
    timeframe: 'daily',
    priority: 'high',
    subTasks: [
      { title: 'Morning meditation (5-10 minutes)', status: 'pending' },
      { title: 'Journal reflection on yesterday\'s actions', status: 'pending' },
      { title: 'Review daily virtues and intentions', status: 'pending' },
      { title: 'Evening review of today\'s challenges', status: 'pending' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'weekly-growth',
    title: 'Weekly Personal Growth',
    description: 'Weekly goals focused on self-improvement and learning',
    timeframe: 'weekly',
    priority: 'medium',
    subTasks: [
      { title: 'Read one chapter of a philosophical text', status: 'pending' },
      { title: 'Practice one challenging conversation', status: 'pending' },
      { title: 'Reflect on areas of resistance or difficulty', status: 'pending' },
      { title: 'Document lessons learned this week', status: 'pending' }
    ],
    createdAt: new Date().toISOString()
  }
];

export const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
  const newGoal: Goal = {
    ...goal,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    timeframe: goal.timeframe.toLowerCase() as Goal['timeframe'],
    subTasks: goal.subTasks || [],
  };
  goals.push(newGoal);
  notifyListeners();
  return newGoal;
};

export const addSubTask = (goalId: string, title: string) => {
  const goal = goals.find(g => g.id === goalId);
  if (goal) {
    const subTask: SubTask = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    goal.subTasks.push(subTask);
    updateGoalProgress(goalId);
    notifyListeners();
    return subTask;
  }
  return null;
};

export const updateSubTask = (goalId: string, subTaskId: string, status: SubTask['status']) => {
  const goal = goals.find(g => g.id === goalId);
  if (goal) {
    const subTask = goal.subTasks.find(st => st.id === subTaskId);
    if (subTask) {
      subTask.status = status;
      updateGoalProgress(goalId);
      notifyListeners();
      return subTask;
    }
  }
  return null;
};

export const updateGoalProgress = (goalId: string) => {
  const goal = goals.find(g => g.id === goalId);
  if (goal && goal.subTasks.length > 0) {
    const completedTasks = goal.subTasks.filter(st => st.status === 'completed').length;
    goal.progress = Math.round((completedTasks / goal.subTasks.length) * 100);
    goal.status = goal.progress === 100 ? 'completed' : goal.progress > 0 ? 'in_progress' : 'not_started';
    notifyListeners();
  }
};

// Template management
export const addTemplate = (template: Omit<GoalTemplate, 'id' | 'createdAt'>) => {
  const newTemplate: GoalTemplate = {
    ...template,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  templates.push(newTemplate);
  notifyListeners();
  return newTemplate;
};

export const getTemplates = () => templates;

export const createGoalFromTemplate = (templateId: string, dueDate?: string) => {
  const template = templates.find(t => t.id === templateId);
  if (template) {
    return addGoal({
      title: template.title,
      description: template.description,
      timeframe: template.timeframe,
      priority: template.priority,
      status: 'not_started',
      progress: 0,
      dueDate,
      subTasks: template.subTasks.map(st => ({
        ...st,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      })),
    });
  }
  return null;
};

const listeners = new Set<() => void>();

export const subscribeToGoals = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const notifyListeners = () => {
  listeners.forEach(callback => callback());
};

export const updateGoal = (id: string, updates: Partial<Goal>) => {
  const index = goals.findIndex(goal => goal.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates };
    notifyListeners();
    return goals[index];
  }
  return null;
};

export const getGoalsByTimeframe = (timeframe: Goal['timeframe']) => {
  return goals.filter(goal => goal.timeframe.toLowerCase() === timeframe.toLowerCase());
};

export const getDailyTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  return goals.filter(goal => 
    goal.timeframe === 'daily' && 
    goal.dueDate === today
  );
};