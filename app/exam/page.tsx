'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Timer } from '@/components/exam/Timer';
import { ProgressBar } from '@/components/exam/ProgressBar';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { OptionRow } from '@/components/exam/OptionRow';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

const QUESTIONS_PER_PAGE = 10;

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export default function ExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [duration, setDuration] = useState(55);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [unansweredPages, setUnansweredPages] = useState<number[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Load questions from sessionStorage (put there by splash page)
  useEffect(() => {
    const stored = sessionStorage.getItem('exam_questions');
    const storedDuration = sessionStorage.getItem('exam_duration');
    
    if (!stored) {
      // No questions — redirect back to splash
      router.push('/splash');
      return;
    }

    setQuestions(JSON.parse(stored));
    if (storedDuration) setDuration(parseInt(storedDuration));

    // Fetch logo
    fetch('/api/config')
      .then(res => res.json())
      .then(data => { if (data.logoUrl) setLogoUrl(data.logoUrl); })
      .catch(() => {});
  }, [router]);

  // Spec: Tab-switching detection & Prevent Back/Reload
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('⚠️ Warning: Do not switch tabs during the examination. Your activity is being monitored.');
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Standard way to trigger browser leave confirmation
      return '';
    };

    // Strong block against back navigation (mobile swipe or browser back button)
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      alert("⚠️ Warning: You cannot go back or navigate away during an active exam.");
      window.history.pushState(null, '', window.location.href);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Pagination
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);

  // Select an option
  const handleSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  // Find unanswered questions info
  const getUnansweredInfo = useCallback(() => {
    const unanswered = questions.filter(q => !answers[q.id]);
    const pages = new Set<number>();
    unanswered.forEach(q => {
      const idx = questions.indexOf(q);
      pages.add(Math.floor(idx / QUESTIONS_PER_PAGE) + 1);
    });
    return { count: unanswered.length, pages: Array.from(pages).sort((a, b) => a - b) };
  }, [questions, answers]);

  // Submit exam
  const submitExam = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const token = localStorage.getItem('student_token');
    if (!token) {
      router.push('/register');
      return;
    }

    // Build answers array from state
    const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption
    }));

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answersArray })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      // Store result for result page
      localStorage.setItem('exam_result', JSON.stringify(data));

      // Clear exam session data
      sessionStorage.removeItem('exam_questions');
      sessionStorage.removeItem('exam_duration');
      sessionStorage.removeItem('examEndTime');

      router.push('/result');
    } catch (err: any) {
      alert(err.message);
      setSubmitting(false);
    }
  }, [answers, submitting, router]);

  // Handle submit button click
  const handleSubmitClick = () => {
    const { count, pages } = getUnansweredInfo();

    if (count > 0) {
      // Spec: Block submission, show unanswered warning
      setUnansweredCount(count);
      setUnansweredPages(pages);
      setShowUnansweredModal(true);
      return;
    }

    // All answered — show confirmation modal
    setShowConfirmModal(true);
  };

  // Spec: Timer hits 00:00 → auto-submit (bypasses unanswered check)
  const handleTimeUp = useCallback(() => {
    submitExam();
  }, [submitExam]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-grey-light flex items-center justify-center">
        <p className="text-text-muted">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Spec Section 5.4: Navbar — logo left, title center, timer right */}
      <Navbar logoUrl={logoUrl || undefined}>
        <Timer initialMinutes={duration} onTimeUp={handleTimeUp} />
      </Navbar>

      {/* Spec: Progress bar below navbar */}
      <div className="pt-20">
        <ProgressBar current={currentPage} total={totalPages} />
      </div>

      {/* Question cards */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {currentQuestions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            questionNumber={startIdx + idx + 1}
            questionText={q.questionText}
          >
            {(['A', 'B', 'C', 'D'] as const).map(opt => (
              <OptionRow
                key={opt}
                label={opt}
                text={q[`option${opt}` as keyof Question] as string}
                selected={answers[q.id] === opt}
                onClick={() => handleSelect(q.id, opt)}
              />
            ))}
          </QuestionCard>
        ))}

        {/* Spec: Navigation buttons */}
        <div className="flex justify-between items-center mt-8 gap-4">
          {/* Spec: Back — hidden on page 1 */}
          {currentPage > 1 ? (
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(p => p - 1)}
              className="flex-1 md:flex-none"
            >
              ← Back
            </Button>
          ) : <div />}

          {/* Spec: Next — hidden on last page. Submit — only on last page */}
          {currentPage < totalPages ? (
            <Button
              onClick={() => setCurrentPage(p => p + 1)}
              className="flex-1 md:flex-none"
            >
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleSubmitClick}
              loading={submitting}
              className="flex-1 md:flex-none"
            >
              Submit Exam
            </Button>
          )}
        </div>
      </div>

      {/* Spec: Unanswered questions modal */}
      <Modal
        isOpen={showUnansweredModal}
        onClose={() => setShowUnansweredModal(false)}
        title="Unanswered Questions"
      >
        <div className="space-y-4">
          <p className="text-text-dark font-medium">
            Are you sure? You still have <span className="text-red-accent font-bold">{unansweredCount}</span> unanswered question{unansweredCount > 1 ? 's' : ''}.
          </p>
          <p className="text-text-muted text-sm">
            Please answer all questions before submitting. Unanswered questions are on page{unansweredPages.length > 1 ? 's' : ''}: <span className="font-bold text-blue-primary">{unansweredPages.join(', ')}</span>
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowUnansweredModal(false);
                // Go to first page with unanswered questions
                if (unansweredPages.length > 0) {
                  setCurrentPage(unansweredPages[0]);
                }
              }}
              fullWidth
            >
              Go to Unanswered
            </Button>
          </div>
        </div>
      </Modal>

      {/* Spec: Confirmation modal — all questions answered */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Submission"
      >
        <div className="space-y-4">
          <p className="text-text-dark font-medium">
            Are you sure you want to submit? This cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              fullWidth
            >
              Go Back
            </Button>
            <Button
              onClick={() => {
                setShowConfirmModal(false);
                submitExam();
              }}
              loading={submitting}
              fullWidth
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
