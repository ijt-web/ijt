import React from 'react';

interface BadgeProps {
  status: 'pass' | 'fail' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ status, children, className = '' }: BadgeProps) {
  const styles = {
    pass: "bg-green-pass-bg text-green-pass border-green-pass/20",
    fail: "bg-red-fail-bg text-red-accent border-red-accent/20",
    neutral: "bg-blue-light text-blue-dark border-blue-dark/20"
  };

  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${styles[status]} ${className}`}>
      {children}
    </span>
  );
}
