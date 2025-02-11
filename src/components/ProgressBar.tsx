import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'info';
}

function ProgressBar({ 
  progress, 
  className = '', 
  showLabel = false,
  size = 'md',
  color = 'default'
}: ProgressBarProps) {
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  const colorClass = {
    default: 'bg-black',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[color];

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${heightClass} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${heightClass} ${colorClass} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-gray-500 mt-1">
          {progress}%
        </div>
      )}
    </div>
  );
}

export default ProgressBar;