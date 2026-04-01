'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
}

export function Timer({ initialMinutes, onTimeUp }: TimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Spec Section 7: Timer stored in sessionStorage — survives accidental refresh
    const storedEndTime = sessionStorage.getItem('examEndTime');

    if (storedEndTime) {
      // Resume from stored end time
      const remaining = Math.floor((parseInt(storedEndTime) - Date.now()) / 1000);
      setSecondsRemaining(remaining > 0 ? remaining : 0);
    } else {
      // First load: set end time
      const examEndTime = Date.now() + initialMinutes * 60 * 1000;
      sessionStorage.setItem('examEndTime', examEndTime.toString());
      setSecondsRemaining(initialMinutes * 60);
    }
  }, [initialMinutes]);

  const handleTimeUp = useCallback(() => {
    if (onTimeUp) onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (secondsRemaining === null) return;
    if (secondsRemaining <= 0) {
      handleTimeUp();
      return;
    }

    const interval = setInterval(() => {
      // Spec: remaining = parseInt(sessionStorage.examEndTime) - Date.now()
      const storedEndTime = sessionStorage.getItem('examEndTime');
      if (!storedEndTime) return;

      const remaining = Math.floor((parseInt(storedEndTime) - Date.now()) / 1000);
      if (remaining <= 0) {
        setSecondsRemaining(0);
        handleTimeUp();
        clearInterval(interval);
      } else {
        setSecondsRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, handleTimeUp]);

  if (secondsRemaining === null) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  // Spec: red + subtle pulse when ≤ 5 minutes
  const isWarning = secondsRemaining <= 300;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg transition-all duration-300
      ${isWarning ? 'text-red-accent animate-pulse-warning' : 'text-text-dark'}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
