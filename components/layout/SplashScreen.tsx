'use client';

import React from 'react';

interface SplashScreenProps {
  logoUrl?: string | null;
  orgName?: string;
  message?: string;
}

export function SplashScreen({ 
  logoUrl, 
  orgName = 'Study Aid project',
  message = 'Preparing your examination...'
}: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-blue-primary flex flex-col items-center justify-center overflow-hidden">
      <div className="relative flex items-center justify-center">
        {/* Spec: Red spinning ring (160px, border-top red, rest transparent), 1.2s */}
        <div 
          className="absolute w-40 h-40 rounded-full animate-spin-ring"
          style={{
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderTopColor: '#E53935',
          }}
        />
        
        {/* Spec: Study Aid logo (120px) with breathing pulse animation, 2.8s */}
        <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center shadow-2xl animate-breathe relative z-10">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
          ) : (
            <span className="text-blue-primary text-4xl font-black text-center px-2">Study Aid</span>
          )}
        </div>
      </div>

      {/* Spec: Org name — Poppins 600, white, letter-spacing 0.05em */}
      <h1 className="mt-10 text-white text-xl font-semibold tracking-[0.05em]">
        {orgName}
      </h1>

      {/* Spec: Subtext — Poppins 400, white 70% opacity */}
      <p className="mt-3 text-white/70 text-sm">
        {message}
      </p>
    </div>
  );
}
