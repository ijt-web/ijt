import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-card p-8 md:p-12 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}
