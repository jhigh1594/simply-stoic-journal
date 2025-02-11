import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, Star } from 'lucide-react';

interface ABCLevelBadgeProps {
  level: 'A' | 'B' | 'C';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

function ABCLevelBadge({ level, size = 'md', showLabel = true, animate = true }: ABCLevelBadgeProps) {
  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  }[size];

  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32
  }[size];

  const config = {
    A: {
      icon: Star,
      color: 'bg-green-500 text-white',
      label: 'Perfect Execution'
    },
    B: {
      icon: Award,
      color: 'bg-blue-500 text-white',
      label: 'Base Case'
    },
    C: {
      icon: Target,
      color: 'bg-yellow-500 text-white',
      label: 'Minimum Viable'
    }
  }[level];

  const Icon = config.icon;

  return (
    <div className="inline-flex flex-col items-center">
      <motion.div
        className={`${sizeClass} ${config.color} rounded-full flex items-center justify-center`}
        initial={animate ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <Icon size={iconSize} />
      </motion.div>
      {showLabel && (
        <motion.div
          className="mt-1 text-center"
          initial={animate ? { opacity: 0, y: 5 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="font-medium">Level {level}</div>
          <div className="text-xs text-gray-500">{config.label}</div>
        </motion.div>
      )}
    </div>
  );
}

export default ABCLevelBadge;