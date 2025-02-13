import React from 'react';
import { ChevronDown, ChevronUp, Scale, Target, Calendar } from 'lucide-react';
import { BigGoal, CheckpointGoal } from '../../../types/planning';
import { planningService } from '../../../services/planning';
import { CheckpointGoalCard } from './CheckpointGoalCard';  // Change to named import
import LoadingSpinner from '../../../components/LoadingSpinner';
import { usePlanning } from '../../../hooks/usePlanning';

interface BigGoalCardProps {
  goal: BigGoal;
  onUpdate: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  checkpoints?: CheckpointGoal[];
  onCheckpointUpdate?: () => Promise<void>;
}

const BigGoalCard: React.FC<BigGoalCardProps> = ({
  goal,
  onUpdate,
  isExpanded: controlledExpanded,
  onToggle,
  checkpoints = [],
  onCheckpointUpdate,
}) => {
  const [internalExpanded, setInternalExpanded] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isLoadingCheckpoints, setIsLoadingCheckpoints] = React.useState(false);
  const { checkpointGoals, loadCheckpointGoals } = usePlanning();

  // Use controlled or uncontrolled expanded state
  const isExpanded = controlledExpanded ?? internalExpanded;
  const handleToggle = onToggle ?? setInternalExpanded;

  React.useEffect(() => {
    const loadGoalCheckpoints = async () => {
      if (!isExpanded) return;
      try {
        setIsLoadingCheckpoints(true);
        await loadCheckpointGoals(goal.id);
      } catch (error) {
        console.error('Error loading checkpoint goals:', error);
      } finally {
        setIsLoadingCheckpoints(false);
      }
    };

    loadGoalCheckpoints();
  }, [goal.id, isExpanded, loadCheckpointGoals]);

  const handleStatusChange = async (status: BigGoal['status']) => {
    try {
      setIsUpdating(true);
      await planningService.updateBigGoal(goal.id, { status });
      onUpdate();
    } catch (error) {
      console.error('Failed to update goal status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: BigGoal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'abandoned':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-gray-400" />
              <h3 className="font-medium">{goal.title}</h3>
            </div>
            {goal.description && (
              <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-2 py-0.5 rounded-full capitalize ${getStatusColor(goal.status)}`}>
                {goal.status.replace('_', ' ')}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 capitalize">{goal.category}</span>
              {goal.target_date && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(goal.target_date).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUpdating ? (
              <LoadingSpinner size="sm" />
            ) : (
              <select
                value={goal.status}
                onChange={(e) => handleStatusChange(e.target.value as BigGoal['status'])}
                className="text-sm border rounded-lg px-2 py-1"
              >
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            )}
            <button
              onClick={() => handleToggle(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t pt-4">
          {/* Stoic Analysis section */}
          {goal.stoic_analysis && (
            <>
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <Scale className="h-4 w-4" />
                <h4 className="font-medium">Stoic Analysis</h4>
              </div>
              {goal.stoic_analysis.control && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium mb-2">Dichotomy of Control</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h6 className="text-xs text-gray-500 mb-1">Within Control</h6>
                      <ul className="text-sm space-y-1">
                        {goal.stoic_analysis.control.within_control.map((item, i) => (
                          <li key={i} className="text-gray-600">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-xs text-gray-500 mb-1">Partial Control</h6>
                      <ul className="text-sm space-y-1">
                        {goal.stoic_analysis.control.partial_control.map((item, i) => (
                          <li key={i} className="text-gray-600">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-xs text-gray-500 mb-1">Outside Control</h6>
                      <ul className="text-sm space-y-1">
                        {goal.stoic_analysis.control.outside_control.map((item, i) => (
                          <li key={i} className="text-gray-600">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {goal.stoic_analysis.control.reflections && (
                    <div className="mt-3">
                      <h6 className="text-xs text-gray-500 mb-1">Reflections</h6>
                      <p className="text-sm text-gray-600">
                        {goal.stoic_analysis.control.reflections}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {goal.stoic_analysis.virtues && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium mb-2">Virtue Alignment</h5>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(goal.stoic_analysis.virtues).map(([virtue, value]) => (
                      virtue !== 'notes' && (
                        <div key={virtue}>
                          <h6 className="text-xs text-gray-500 mb-1 capitalize">{virtue}</h6>
                          <div className="h-1 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(value / 10) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{value}/10</div>
                        </div>
                      )
                    ))}
                  </div>
                  {goal.stoic_analysis.virtues.notes && (
                    <div className="mt-3">
                      <h6 className="text-xs text-gray-500 mb-1">Notes</h6>
                      <p className="text-sm text-gray-600">
                        {goal.stoic_analysis.virtues.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(goal.stoic_analysis.obstacles?.length || goal.stoic_analysis.strategies?.length) && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Obstacles & Strategies</h5>
                  <div className="grid grid-cols-2 gap-4">
                    {goal.stoic_analysis.obstacles?.length && (
                      <div>
                        <h6 className="text-xs text-gray-500 mb-1">Potential Obstacles</h6>
                        <ul className="text-sm space-y-1">
                          {goal.stoic_analysis.obstacles.map((item, i) => (
                            <li key={i} className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {goal.stoic_analysis.strategies?.length && (
                      <div>
                        <h6 className="text-xs text-gray-500 mb-1">Mitigation Strategies</h6>
                        <ul className="text-sm space-y-1">
                          {goal.stoic_analysis.strategies.map((item, i) => (
                            <li key={i} className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-6">
            <h5 className="text-sm font-medium mb-3">Checkpoint Goals</h5>
            <div className="space-y-3">
              {isLoadingCheckpoints ? (
                <div className="text-center py-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : checkpoints?.length > 0 ? (
                checkpoints.map((checkpoint: CheckpointGoal) => (
                  <CheckpointGoalCard 
                    key={checkpoint.id} 
                    goal={checkpoint}
                    onUpdate={() => {
                      onCheckpointUpdate?.();
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No checkpoint goals yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BigGoalCard;