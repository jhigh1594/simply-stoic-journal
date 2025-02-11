import React from 'react';
import { ChevronDown, ChevronUp, Clock, Calendar, BarChart2 } from 'lucide-react';
import type { DailySystem } from '../../../types/planning';
import { planningService } from '../../../services/planning';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { usePlanning } from '../../../hooks/usePlanning';
import { useAuth } from '../../../hooks/useAuth';
import ABCTrackingStats from '../../../components/ABCTrackingStats';

interface DailySystemCardProps {
  system: DailySystem;
  onUpdate: () => void;
}

function DailySystemCard({ system, onUpdate }: DailySystemCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { checkpointGoals, abcTracking, loadCheckpointGoals, loadABCTracking } = usePlanning();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadCheckpointGoals();
    
    // Load last week's tracking data
    const today = new Date();
    const lastWeek = new Date(today.setDate(today.getDate() - 7));
    loadABCTracking(lastWeek.toISOString().split('T')[0]);
  }, [loadCheckpointGoals, loadABCTracking, userId]);

  const checkpoint = checkpointGoals.find(cp => cp.id === system.checkpoint_goal_id);
  const systemTracking = abcTracking.filter(t => t.system_id === system.id);

  const handleActiveChange = async (active: boolean) => {
    try {
      setIsUpdating(true);
      await planningService.updateDailySystem(system.id, { active });
      onUpdate();
    } catch (error) {
      console.error('Failed to update system status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getFrequencyLabel = (frequency: DailySystem['frequency']) => {
    switch (frequency) {
      case 'daily':
        return 'Every day';
      case 'weekday':
        return 'Weekdays only';
      case 'weekend':
        return 'Weekends only';
      case 'weekly':
        return 'Once a week';
    }
  };

  const getTimeOfDayLabel = (timeOfDay?: DailySystem['time_of_day']) => {
    if (!timeOfDay) return 'Any time';
    return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <h3 className="font-medium">{system.title}</h3>
            </div>
            {system.description && (
              <p className="text-sm text-gray-600 mb-3">{system.description}</p>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-2 py-0.5 rounded-full ${
                system.active ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
              }`}>
                {system.active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getFrequencyLabel(system.frequency)}
              </span>
              {system.time_of_day && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeOfDayLabel(system.time_of_day)}
                  </span>
                </>
              )}
              {checkpoint && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Supports: {checkpoint.title}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUpdating ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <button
                  onClick={() => handleActiveChange(!system.active)}
                  className={`text-sm px-3 py-1 rounded-lg ${
                    system.active
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {system.active ? 'Deactivate' : 'Activate'}
                </button>
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
          <ABCTrackingStats tracking={systemTracking} period="week" />
        </div>
      )}
    </div>
  );
}

export default DailySystemCard;