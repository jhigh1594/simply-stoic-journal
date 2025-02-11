import React from 'react';
import { Plus, X } from 'lucide-react';
import type { SubTask } from '../../../types/planning';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface SubTaskListProps {
  subTasks: SubTask[];
  onAddSubTask: (title: string) => void;
  onUpdateSubTask: (id: string, status: SubTask['status']) => void;
  isUpdating?: boolean;
  updatingTaskId?: string;
}

function SubTaskList({ 
  subTasks, 
  onAddSubTask, 
  onUpdateSubTask,
  isUpdating,
  updatingTaskId 
}: SubTaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddSubTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="pl-8 mt-2 space-y-2">
      {subTasks.map(task => (
        <div
          key={task.id}
          className="flex items-center gap-2 text-sm"
        >
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => {
              onUpdateSubTask(
                task.id,
                task.status === 'completed' ? 'pending' : 'completed'
              );
            }}
            className="rounded border-gray-300"
          />
          <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>
            {task.title}
          </span>
          {isUpdating && updatingTaskId === task.id && (
            <LoadingSpinner size="sm" />
          )}
        </div>
      ))}

      {isAdding ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter sub-task..."
            className="flex-1 text-sm px-2 py-1 border rounded"
            autoFocus
          />
          <button
            type="submit"
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add sub-task
        </button>
      )}
    </div>
  );
}

export default SubTaskList;