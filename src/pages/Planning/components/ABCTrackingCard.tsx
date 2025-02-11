import React from 'react';
import { ChevronDown, ChevronUp, Battery, Clock } from 'lucide-react';
import type { ABCTracking } from '../../../types/planning';
import { usePlanning } from '../../../hooks/usePlanning';
import { useAuth } from '../../../hooks/useAuth';
import ABCLevelBadge from '../../../components/ABCLevelBadge';
import ProgressBar from '../../../components/ProgressBar';

interface ABCTrackingCardProps {
  tracking: ABCTracking;
  onUpdate: () => void;
}

function ABCTrackingCard({ tracking, onUpdate }: ABCTrackingCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { dailySystems, loadDailySystems } = usePlanning();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (!userId) return;
    loadDailySystems();
  }, [loadDailySystems, userId]);

  const system = tracking.system_id ? dailySystems.find(s => s.id === tracking.system_id) : null;

  const getEnergyLevelColor = (level: number) => {
    if (level >= 8) return 'success';
    if (level >= 5) return 'info';
    return 'warning';
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <ABCLevelBadge level={tracking.category} size="sm" showLabel={false} />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {new Date(tracking.date).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-800 mb-3">{tracking.description}</p>
            <div className="flex items-center gap-4">
              {tracking.energy_level && (
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Battery className="h-4 w-4" />
                      Energy Level
                    </div>
                    <span className="text-sm font-medium">{tracking.energy_level}/10</span>
                  </div>
                  <ProgressBar
                    progress={(tracking.energy_level / 10) * 100}
                    size="sm"
                    color={getEnergyLevelColor(tracking.energy_level)}
                  />
                </div>
              )}
              {system && (
                <div className="text-sm text-gray-600">
                  System: {system.title}
                </div>
              )}
            </div>
          </div>

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
        </div>
      </div>

      {isExpanded && tracking.notes && (
        <div className="px-4 pb-4 border-t pt-4">
          <h4 className="font-medium text-sm mb-2">Notes & Reflections</h4>
          <p className="text-sm text-gray-600">{tracking.notes}</p>
        </div>
      )}
    </div>
  );
}

export default ABCTrackingCard;