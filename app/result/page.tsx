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

  useEffect(() => {
    const stored = localStorage.getItem('exam_result');
    if (!stored) {
      router.push('/register');
      return;
    }
    setResult(JSON.parse(stored));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => { if (data.logoUrl) setLogoUrl(data.logoUrl); })
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      {/* Spec: centered card, max-width 480px */}
      <Card className="w-full max-w-[480px] text-center">
        {/* Spec: IJT logo (64px, centered) */}
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-16 w-auto mx-auto mb-6 object-contain" />
        ) : (
          <div className="w-16 h-16 bg-blue-primary rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
            IJT
          </div>
        )}

        {/* Spec: Student name — Poppins 700, large */}
        <h1 className="text-2xl font-bold text-text-dark mb-2">{result.name}</h1>

        {/* Spec: Roll No · Student ID · Class — Poppins 400, muted, small */}
        <p className="text-text-muted text-sm mb-6">
          Roll No: {result.rollNumber} · Class {result.class}
        </p>

        <div className="w-full h-px bg-grey-border mb-6" />

        {/* Spec: Score — large percentage, Poppins 700, blue */}
        <p className="text-5xl font-bold text-blue-primary mb-2">
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
          Passing mark: 50%
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
