import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-grey-light h-1 relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full bg-blue-primary transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute top-4 right-6 text-xs font-bold text-blue-primary uppercase tracking-widest">
        Page {current} of {total}
      </div>
    </div>
  );
}
