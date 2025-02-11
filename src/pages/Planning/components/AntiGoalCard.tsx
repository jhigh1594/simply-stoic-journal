import React from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Shield } from 'lucide-react';
import type { AntiGoal } from '../../../types/planning';

interface AntiGoalCardProps {
  goal: AntiGoal;
}

function AntiGoalCard({ goal }: AntiGoalCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getImpactColor = (level: AntiGoal['impact_level']) => {
    switch (level) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'low':
        return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-gray-400" />
              <h3 className="font-medium">{goal.title}</h3>
            </div>
            {goal.description && (
              <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-2 py-0.5 rounded-full ${getImpactColor(goal.impact_level)}`}>
                {goal.impact_level.charAt(0).toUpperCase() + goal.impact_level.slice(1)} Impact
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 capitalize">{goal.category}</span>
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

      {isExpanded && goal.mitigation_strategy && (
        <div className="px-4 pb-4 border-t pt-4">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Shield className="h-4 w-4" />
            <h4 className="font-medium">Mitigation Strategy</h4>
          </div>
          <p className="text-sm text-gray-600">{goal.mitigation_strategy}</p>
        </div>
      )}
    </div>
  );
}

export default AntiGoalCard;