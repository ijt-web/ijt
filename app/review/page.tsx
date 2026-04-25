'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const QUESTIONS_PER_PAGE = 10;

export default function ReviewPage() {
  const router = useRouter();
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('student_token');
    if (!token) {
      router.push('/register');
      return;
    }

    // Fetch the student's answers with correct options
    fetch('/api/exam/review', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setReviewData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-text-muted">Loading review...</p>
      </div>
    );
  }

  if (!reviewData || !reviewData.answers) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-text-muted">No review data available.</p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(reviewData.answers.length / QUESTIONS_PER_PAGE);
  const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentAnswers = reviewData.answers.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Spec: Back button at top to return to Result Page */}
      <div className="sticky top-0 bg-white border-b border-grey-border px-4 py-4 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Button variant="secondary" onClick={() => router.push('/result')}>
            ← Back to Result
          </Button>
          <h1 className="text-lg font-bold text-text-dark">Answer Review</h1>
        </div>
      </div>

      {/* Page indicator */}
      <div className="max-w-3xl mx-auto px-4 py-2">
        <p className="text-center text-text-muted text-sm">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {currentAnswers.map((item: any, idx: number) => {
          const isCorrect = item.selectedOption === item.correctOption;
          const options = [
            { key: 'A', text: item.optionA },
            { key: 'B', text: item.optionB },
            { key: 'C', text: item.optionC },
            { key: 'D', text: item.optionD },
          ];

          return (
            <div key={item.questionId} className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-blue-primary font-bold mb-2">Q{startIdx + idx + 1}.</p>
              <p className="text-text-dark font-medium mb-4 leading-relaxed">{item.questionText}</p>

              <div className="space-y-2">
                {options.map(opt => {
                  const isStudentAnswer = opt.key === item.selectedOption;
                  const isCorrectAnswer = opt.key === item.correctOption;

                  let bgClass = 'bg-white border-grey-border';
                  let textClass = 'text-text-dark';
                  let icon = null;

                  if (isStudentAnswer && isCorrect) {
                    // Spec: correct → highlighted green (bg + border + checkmark)
                    bgClass = 'bg-green-pass-bg border-green-pass';
                    textClass = 'text-green-pass';
                    icon = '✓';
                  } else if (isStudentAnswer && !isCorrect) {
                    // Spec: wrong → highlighted red (bg + border + X icon)
                    bgClass = 'bg-red-fail-bg border-red-accent';
                    textClass = 'text-red-accent';
                    icon = '✗';
                  } else if (isCorrectAnswer && !isCorrect) {
                    // Spec: If wrong → correct option also highlighted green
                    bgClass = 'bg-green-pass-bg border-green-pass';
                    textClass = 'text-green-pass';
                    icon = '✓';
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`px-4 py-3 rounded-lg border-2 flex items-center gap-3 ${bgClass}`}
                    >
                      {icon && (
                        <span className={`font-bold text-lg ${textClass}`}>{icon}</span>
                      )}
                      <span className={`font-medium ${textClass}`}>
                        <span className="font-bold mr-2">{opt.key}.</span>
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center gap-4">
          {/* Back button - hidden on page 1 */}
          {currentPage > 1 ? (
            <Button
              variant="secondary"
              onClick={() => {
                setCurrentPage(p => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 md:flex-none"
            >
              ← Back
            </Button>
          ) : <div />}

          {/* Next button - hidden on last page */}
          {currentPage < totalPages ? (
            <Button
              onClick={() => {
                setCurrentPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 md:flex-none"
            >
              Next →
            </Button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
