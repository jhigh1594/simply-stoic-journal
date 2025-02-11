import React from 'react';
import { format, addDays, startOfWeek, parseISO, isSameDay } from 'date-fns';
import { useDroppable } from '@dnd-kit/core';
import type { Task } from '../../../types/calendar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { updateGoal } from '../../../data/goals';

const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours

interface CalendarGridProps {
  currentDate: Date;
  view: '5-day' | 'week' | 'month';
  tasks: Task[];
}

function CalendarGrid({ currentDate, view, tasks }: CalendarGridProps) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const daysToShow = view === '5-day' ? 5 : 7;
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);

  const days = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i));

  const getTasksForSlot = (date: Date, hour: number) => {
    return tasks.filter(task => {
      if (!task.date || !task.time) return false;
      const taskDate = parseISO(task.date);
      const [taskHour] = task.time.split(':').map(Number);
      return isSameDay(taskDate, date) && taskHour === hour;
    });
  };
  return (
    <div className="flex-1 overflow-auto">
      <div className="flex">
        <div className="w-16 lg:w-20 flex-shrink-0" />
        {days.map((date) => (
          <div key={date.toISOString()} className="flex-1 min-w-[100px] lg:min-w-[120px] border-l">
            <div className="px-4 py-2 text-center border-b">
              <div className="text-sm text-gray-500">{format(date, 'EEE')}</div>
              <div className="text-xl font-medium">{format(date, 'dd')}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="flex">
          <div className="w-16 lg:w-20 flex-shrink-0">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-16 lg:h-20 border-b relative">
                <span className="absolute -top-3 left-2 lg:left-4 text-xs lg:text-sm text-gray-500">
                  {format(new Date().setHours(hour, 0), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {days.map((date) => (
            <div key={date.toISOString()} className="flex-1 min-w-[100px] lg:min-w-[120px] border-l">
              {timeSlots.map((hour) => {
                const { setNodeRef } = useDroppable({
                  id: `${date.toISOString()}-${hour}`,
                });

                return (
                  <div
                    key={hour}
                    ref={setNodeRef}
                    className="h-16 lg:h-20 border-b hover:bg-gray-50 relative"
                  >
                    {getTasksForSlot(date, hour).map(task => (
                      <div
                        key={task.id}
                        className={`absolute inset-x-0 m-1 p-2 text-sm rounded cursor-pointer ${
                          task.goalId ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } flex items-center justify-between text-xs lg:text-sm truncate`}
                        onClick={async () => {
                          if (task.goalId) {
                            setUpdatingTaskId(task.goalId);
                            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
                            await updateGoal(task.goalId, {
                              status: 'completed',
                              progress: 100
                            });
                            setUpdatingTaskId(null);
                          }
                        }}
                      >
                        <span>{task.title}</span>
                        {updatingTaskId === task.goalId && (
                          <LoadingSpinner size="sm" className="text-white" />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarGrid;