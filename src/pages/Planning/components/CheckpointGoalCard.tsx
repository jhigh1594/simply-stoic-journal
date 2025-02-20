import React from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Calendar, Target, Pencil } from 'lucide-react';
import type { CheckpointGoal } from '../../../types/planning';
import { planningService } from '../../../services/planning';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { usePlanning } from '../../../hooks/usePlanning';
import { useAuth } from '../../../hooks/useAuth';
import _ from 'lodash';

interface CheckpointGoalCardProps {
  goal: CheckpointGoal;
  onUpdate: () => void;
  showBigGoal?: boolean; // Add this prop to control big goal display
}

export const CheckpointGoalCard = ({ goal, onUpdate, showBigGoal = true }: CheckpointGoalCardProps) => {
  // Remove the local isExpanded state
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { bigGoals, loadBigGoals } = usePlanning();
  const { userId } = useAuth();
  const [localProgress, setLocalProgress] = React.useState(goal.progress);
  const [isProgressUpdating, setIsProgressUpdating] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true); // Set default to true

  const getStatusColor = (status: CheckpointGoal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'blocked':
        return 'bg-red-50 text-red-700';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Load big goals only if we need to show the big goal reference
  React.useEffect(() => {
    if (!userId || !showBigGoal) return;
    loadBigGoals();
  }, [loadBigGoals, userId, showBigGoal]);

  const bigGoal = React.useMemo(() => 
    bigGoals.find(bg => bg.id === goal.big_goal_id),
    [bigGoals, goal.big_goal_id]
  );

  const handleStatusChange = async (status: CheckpointGoal['status']) => {
    try {
      setIsUpdating(true);
      await planningService.updateCheckpointGoal(goal.id, { status });
      onUpdate();
    } catch (error) {
      console.error('Failed to update checkpoint status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove these duplicate declarations
  // const [localProgress, setLocalProgress] = React.useState(goal.progress);
  // const [isProgressUpdating, setIsProgressUpdating] = React.useState(false);

  const debouncedUpdate = React.useCallback(
    _.debounce(async (progress: number) => {
      try {
        setIsProgressUpdating(true);
        await planningService.updateCheckpointGoal(goal.id, { progress });
        // Remove the onUpdate call here since we don't need to refresh the entire list
        // for progress updates
      } catch (error) {
        console.error('Failed to update checkpoint progress:', error);
      } finally {
        setIsProgressUpdating(false);
      }
    }, 500),
    [goal.id] // Remove onUpdate from dependencies
  );

  // Add proper error handling for progress updates
  const handleProgressUpdate = async (progress: number) => {
    try {
      setIsProgressUpdating(true);
      await planningService.updateCheckpointGoal(goal.id, { progress });
      setLocalProgress(progress);
      onUpdate();
    } catch (error) {
      console.error('Failed to update checkpoint progress:', error);
      // Revert to previous progress on error
      setLocalProgress(goal.progress);
    } finally {
      setIsProgressUpdating(false);
    }
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedGoal, setEditedGoal] = React.useState<CheckpointGoal>(goal);

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await planningService.updateCheckpointGoal(goal.id, {
        title: editedGoal.title,
        description: editedGoal.description,
        target_date: editedGoal.target_date,
        blockers: editedGoal.blockers,
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update checkpoint:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedGoal.title}
                  onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
                  className="w-full px-2 py-1 border rounded"
                />
                <textarea
                  value={editedGoal.description || ''}
                  onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
                  className="w-full px-2 py-1 border rounded"
                  rows={2}
                />
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={editedGoal.target_date}
                    onChange={(e) => setEditedGoal({ ...editedGoal, target_date: e.target.value })}
                    className="px-2 py-1 border rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <h3 className="font-medium">{goal.title}</h3>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-sm text-gray-500 hover:bg-gray-100 rounded"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                {goal.description && (
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <span className={`px-2 py-0.5 rounded-full capitalize ${getStatusColor(goal.status)}`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(goal.target_date).toLocaleDateString()}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{localProgress}% complete</span>
                  {showBigGoal && bigGoal && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">Related to: {bigGoal.title}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isUpdating ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <select
                  value={goal.status}
                  onChange={(e) => handleStatusChange(e.target.value as CheckpointGoal['status'])}
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t pt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${localProgress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localProgress}
                    onChange={(e) => {
                      const progress = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                      setLocalProgress(progress);
                      debouncedUpdate(progress);
                    }}
                    className="w-16 text-sm border rounded-lg px-2 py-1 text-center"
                  />
                  <span className="text-sm text-gray-500">%</span>
                  {isProgressUpdating && <LoadingSpinner size="sm" />} {/* Change from "xs" to "sm" */}
                </div>
              </div>
            </div>

            {goal.blockers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-600">
                  <AlertTriangle className="h-4 w-4" />
                  <h4 className="font-medium">Potential Blockers</h4>
                </div>
                <ul className="space-y-1">
                  {goal.blockers.map((blocker, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      {blocker}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};