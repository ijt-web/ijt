'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setError('');
    const token = localStorage.getItem('student_token');
    if (!token) {
      router.push('/register');
      return;
    }

    const startTime = Date.now();

    try {
      // Fetch config for logo and branding
      const configRes = await fetch('/api/config');
      const config = await configRes.json();
      if (config.logoUrl) setLogoUrl(config.logoUrl);

      // Fetch questions for student's class
      const res = await fetch('/api/exam/questions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to load questions');
      
      const data = await res.json();
      const questions = Array.isArray(data) ? data : data.questions;
      const startTimeToken = data.startTimeToken;

      // Store questions in sessionStorage for exam page
      sessionStorage.setItem('exam_questions', JSON.stringify(questions));
      if (startTimeToken) sessionStorage.setItem('exam_start_token', startTimeToken);
      sessionStorage.setItem('exam_duration', String(config.durationMinutes || 55));

      // Spec: Minimum display time of 1.5 seconds
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1500 - elapsed, 0);

      setTimeout(() => {
        router.push('/exam');
      }, remaining);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-navy via-blue-dark to-blue-primary bg-[length:200%_200%] animate-gradient-shift flex flex-col items-center justify-center overflow-hidden">
      <div className="relative flex items-center justify-center">
        {/* Spec: Red spinning ring (160px, border-top red, rest transparent) */}
        <div 
          className="absolute w-40 h-40 rounded-full animate-spin-ring"
          style={{
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderTopColor: '#E53935',
          }}
        />
        
        {/* Glowing Study Aid logo (120px) with breathing pulse animation & glowing shadow */}
        <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.25)] animate-breathe relative z-10">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
          ) : (
            <span className="text-blue-primary text-4xl font-black text-center">Study Aid</span>
          )}
        </div>
      </div>

      {/* Spec: Org name below — Poppins 600, white, letter-spacing 0.05em */}
      <h1 className="mt-10 text-white text-xl font-semibold tracking-[0.05em] drop-shadow-md">
        Study Aid project
      </h1>

      {/* Spec: "Preparing your examination..." — Poppins 400, white 70% opacity */}
      {!error && (
        <p className="mt-3 text-white/70 text-sm">
          Preparing your examination...
        </p>
      )}

      {error && (
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchQuestions}
            className="px-8 py-3 bg-red-accent text-white rounded-lg font-semibold hover:bg-red-hover transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
