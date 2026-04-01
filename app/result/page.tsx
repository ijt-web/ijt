'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [passingPercentage, setPassingPercentage] = useState<number>(50);

  useEffect(() => {
    const stored = localStorage.getItem('exam_result');
    if (!stored) {
      router.push('/register');
      return;
    }
    setResult(JSON.parse(stored));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => { 
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.passingPercentage) setPassingPercentage(data.passingPercentage);
      })
      .catch(() => {});
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-text-muted">Loading result...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-navy via-blue-dark to-blue-primary bg-[length:200%_200%] animate-gradient-shift flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative floating blur spheres */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-blue-primary/40 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Spec: centered card, max-width 480px, with conditional glow outline on pass/fail */}
      <Card className={`w-full max-w-[480px] text-center !bg-white/95 backdrop-blur-xl animate-scale-in relative z-10 transition-all duration-700
        ${result.passed ? 'shadow-[0_0_80px_rgba(46,125,50,0.3)] border border-green-pass/20' : 'shadow-[0_0_80px_rgba(229,57,53,0.3)] border border-red-accent/20'}
      `}>
        {/* Spec: Study Aid logo (64px, centered) */}
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-16 w-auto mx-auto mb-6 object-contain" />
        ) : (
          <div className="w-16 h-16 bg-blue-primary rounded-full mx-auto mb-6 flex items-center justify-center text-white text-xs font-bold text-center px-1">
            Study Aid
          </div>
        )}

        {/* Spec: Student name — Poppins 700, large */}
        <h1 className="text-2xl font-bold text-text-dark mb-2">{result.name}</h1>

        {/* Spec: Roll No · Student ID · Class — Poppins 400, muted, small */}
        <p className="text-text-muted text-sm mb-6 uppercase tracking-wider">
          Roll No: {result.rollNumber} · Class {result.class} · {result.stream || 'All'}
        </p>

        <div className="w-full h-px bg-grey-border mb-6" />

        {/* Spec: Score — large percentage, Poppins 700, conditional color */}
        <p className={`text-6xl font-black mb-2 animate-slide-up ${result.passed ? 'text-green-pass' : 'text-red-accent'}`}>
          {Math.round(result.percentage)}%
        </p>

        {/* Spec: "X out of Y correct" — Poppins 400, muted */}
        <p className="text-text-muted mb-4">
          {result.marks} out of {result.total} correct
        </p>

        {/* Spec: Pass/Fail badge */}
        <div className="mb-2">
          <Badge status={result.passed ? 'pass' : 'fail'}>
            {result.passed ? 'PASSED' : 'FAILED'}
          </Badge>
        </div>

        {/* Spec: Passing mark % — muted, small */}
        <p className="text-text-muted text-xs mb-6">
          Passing mark: {passingPercentage}%
        </p>

        <div className="w-full h-px bg-grey-border mb-6" />

        {/* Spec: "Review Answers" button — outlined blue */}
        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.push('/review')}
        >
          Review Answers
        </Button>

        {/* Spec: Note — italic, muted */}
        <p className="text-text-muted text-xs italic mt-6">
          Please show this screen to the invigilator.
        </p>
      </Card>
    </div>
  );
}
