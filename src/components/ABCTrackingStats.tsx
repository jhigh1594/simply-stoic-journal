import React from 'react';
import { motion } from 'framer-motion';
import ProgressRing from './ProgressRing';
import ABCLevelBadge from './ABCLevelBadge';
import type { ABCTracking } from '../types/planning';

interface ABCTrackingStatsProps {
  tracking: ABCTracking[];
  period?: 'day' | 'week' | 'month';
}

function ABCTrackingStats({ tracking, period = 'week' }: ABCTrackingStatsProps) {
  const stats = React.useMemo(() => {
    const total = tracking.length;
    if (total === 0) return { A: 0, B: 0, C: 0 };

    const counts = tracking.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      A: (counts.A || 0) / total * 100,
      B: (counts.B || 0) / total * 100,
      C: (counts.C || 0) / total * 100
    };
  }, [tracking]);

  const periodLabel = {
    day: "Today's",
    week: "This Week's",
    month: "This Month's"
  }[period];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="font-medium mb-6">{periodLabel} Execution Levels</h3>
      
      <div className="grid grid-cols-3 gap-6">
        {(['A', 'B', 'C'] as const).map((level, index) => (
          <motion.div
            key={level}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ABCLevelBadge level={level} size="sm" showLabel={false} />
            <ProgressRing progress={stats[level]} size={80} strokeWidth={6} className="my-4">
              <div className="text-center">
                <div className="text-2xl font-semibold">{Math.round(stats[level])}%</div>
              </div>
            </ProgressRing>
            <div className="text-sm text-gray-500">
              {tracking.filter(t => t.category === level).length} entries
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="text-sm text-gray-600">
          <strong>Remember:</strong> The goal is progress, not perfection. Level C execution
          still moves you forward, and any forward movement compounds over time.
        </div>
      </div>
    </div>
  );
}

export default ABCTrackingStats;