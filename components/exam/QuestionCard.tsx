import React from 'react';

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  children: React.ReactNode;
}

export function QuestionCard({ questionNumber, questionText, children }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 md:p-8 mb-6">
      {/* Spec: Question number — Poppins 700, blue */}
      <p className="text-blue-primary font-bold text-lg mb-2">
        Q{questionNumber}.
      </p>
      {/* Spec: Question text — Poppins 500, dark, line-height 1.7 */}
      <p className="text-text-dark font-medium leading-[1.7] mb-6">
        {questionText}
      </p>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
