import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { addMonths, subMonths } from 'date-fns';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import Inbox from './components/Inbox';
import TaskModal from './components/TaskModal';
import { addGoal, getGoalsByTimeframe, subscribeToGoals } from '../../data/goals';
import type { Task } from '../../types/calendar';
import { taskFromGoal } from '../../types/calendar';

function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'5-day' | 'week' | 'month'>('5-day');
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>();

  React.useEffect(() => {
    const updateTasks = () => {
      // Get all daily and weekly tasks that have due dates
      const dailyTasks = getGoalsByTimeframe('daily')
        .filter(goal => goal.dueDate)
        .map(taskFromGoal);
      
      const weeklyTasks = getGoalsByTimeframe('weekly')
        .filter(goal => goal.dueDate)
        .map(taskFromGoal);
      
      setTasks([...dailyTasks, ...weeklyTasks]);
    };
    
    updateTasks();
    return subscribeToGoals(updateTasks);
  }, []);

  const handlePrevious = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNext = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id !== 'inbox') {
      const taskId = active.id;
      const [date, hour] = over.id.toString().split('-');
      
      const task = tasks.find(t => t.id === taskId.toString());
      if (task) {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const formattedTime = `${hour.padStart(2, '0')}:00`;
        
        setSelectedTask({
          ...task,
          date: formattedDate,
          time: formattedTime
        });
        setIsTaskModalOpen(true);
      }
    }
  };

  const handleSaveTask = (task: Task) => {
    // Add task to goals system
    addGoal({
      title: task.title,
      description: task.description,
      timeframe: task.duration === '60' ? 'weekly' : 'daily', // Longer tasks are weekly goals
      priority: 'medium',
      status: 'not_started',
      progress: 0,
      dueDate: task.date
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col">
        <div className="lg:mb-6">
          <CalendarHeader
            currentDate={currentDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
            view={view}
            onViewChange={setView}
          />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <Inbox
            tasks={tasks}
            onAddTask={() => {
              setSelectedTask(undefined);
              setIsTaskModalOpen(true);
            }}
            onEditTask={(task) => {
              setSelectedTask(task);
              setIsTaskModalOpen(true);
            }}
          />
          <CalendarGrid currentDate={currentDate} view={view} tasks={tasks} />
        </div>
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(undefined);
          }}
          onSave={handleSaveTask}
          task={selectedTask}
        />
      </div>
    </DndContext>
  );
}

export default Calendar;