import React from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { getGoalsByTimeframe, subscribeToGoals, updateGoal, addSubTask, updateSubTask } from '../../../data/goals';
import type { Goal, GoalTimeframe } from '../../../types/planning';
import LoadingSpinner from '../../../components/LoadingSpinner';
import SubTaskList from './SubTaskList';

interface TaskListProps {
  type: GoalTimeframe;
  onAddGoal: () => void;
}

function TaskList({ type, onAddGoal }: TaskListProps) {
  const [tasks, setTasks] = React.useState<Goal[]>([]);
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const updateTasks = () => {
      setTasks(getGoalsByTimeframe(type));
    };
    
    updateTasks();
    return subscribeToGoals(updateTasks);
  }, [type]);

  const getPlaceholder = () => {
    switch (type) {
      case 'weekly':
        return 'Add a new weekly goal...';
      case 'quarterly':
        return 'Add a new quarterly goal...';
      default:
        return 'Add a new task...';
    }
  };

  const getEmptyMessage = () => {
    switch (type) {
      case 'weekly':
        return 'No weekly goals yet. Add one to get started.';
      case 'quarterly':
        return 'No quarterly goals yet. Add one to get started.';
      default:
        return 'No tasks yet. Add one to get started.';
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onAddGoal}
            className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg text-gray-500 hover:border-gray-400"
          >
            {getPlaceholder()}
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {getEmptyMessage()}
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className="border rounded-lg group hover:border-gray-400"
              >
                <div className="flex items-center gap-3 p-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={async () => {
                      setUpdatingTaskId(task.id);
                      const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
                      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
                      await updateGoal(task.id, {
                        status: newStatus,
                        progress: newStatus === 'completed' ? 100 : 50
                      });
                      setUpdatingTaskId(null);
                    }}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500">{task.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">
                      {updatingTaskId === task.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        `${task.progress}%`
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedTaskId(
                        expandedTaskId === task.id ? null : task.id
                      )}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedTaskId === task.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {expandedTaskId === task.id && (
                  <SubTaskList
                    subTasks={task.subTasks || []}
                    onAddSubTask={async (title) => {
                      setUpdatingTaskId(task.id);
                      await addSubTask(task.id, title);
                      setUpdatingTaskId(null);
                    }}
                    onUpdateSubTask={async (subTaskId, status) => {
                      setUpdatingTaskId(task.id);
                      await updateSubTask(task.id, subTaskId, status);
                      setUpdatingTaskId(null);
                    }}
                    isUpdating={updatingTaskId === task.id}
                    updatingTaskId={updatingTaskId || undefined}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default TaskList;