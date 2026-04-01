'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { CSVImport } from '@/components/admin/CSVImport';

export default function QuestionManagementPage() {
  const params = useParams();
  const classId = params.classId as string;

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [bannerType, setBannerType] = useState<'none' | 'registered' | 'live'>('none');
  const [bannerCount, setBannerCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch questions for this class
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/questions?class=${classId}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : data.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  // Check banner status
  const checkBannerStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/results');
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];

      if (results.length > 0) {
        setBannerType('live');
        return;
      }

      // Check if any students have registered
      // We can infer from results being empty but we need student count
      // For now, just show no banner if no results
      setBannerType('none');
    } catch {
      setBannerType('none');
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    checkBannerStatus();
  }, [fetchQuestions, checkBannerStatus]);

  // Delete a question
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchQuestions();
    } catch {
      alert('Error deleting question');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-6">
        Class {classId} Questions
      </h1>

      {/* Spec: Live Banner */}
      {bannerType === 'live' && (
        <div className="mb-6 p-4 bg-red-fail-bg border border-red-accent/20 rounded-lg flex items-center gap-3">
          <span className="text-lg">🔴</span>
          <p className="text-red-accent font-bold text-sm">
            Exam is live. Do not modify questions.
          </p>
        </div>
      )}
      {bannerType === 'registered' && (
        <div className="mb-6 p-4 bg-[#FFF8E1] border border-[#FFC107]/20 rounded-lg flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <p className="text-[#F57F17] font-bold text-sm">
            {bannerCount} students are registered. Avoid editing questions once exam starts.
          </p>
        </div>
      )}

      {/* Manual Add + CSV Import side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <QuestionForm
            classId={classId}
            editingQuestion={editingQuestion}
            onSaved={() => {
              setEditingQuestion(null);
              fetchQuestions();
            }}
            onCancelEdit={() => setEditingQuestion(null)}
          />
        </Card>
        <Card>
          <CSVImport classId={classId} onImported={fetchQuestions} />
        </Card>
      </div>

      {/* Question List */}
      <Card>
        <h3 className="text-lg font-bold text-text-dark mb-4">
          All Questions ({questions.length})
        </h3>

        {loading ? (
          <p className="text-text-muted">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-text-muted text-sm">No questions added yet for Class {classId}.</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-grey-light rounded-lg flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-dark text-sm">
                    <span className="text-blue-primary font-bold">Q{idx + 1}.</span>{' '}
                    {q.questionText}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    A: {q.optionA} · B: {q.optionB} · C: {q.optionC} · D: {q.optionD} · 
                    <span className="text-green-pass font-bold ml-1">Correct: {q.correctOption}</span>
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingQuestion(q)}
                    className="px-3 py-1 text-xs font-bold text-blue-primary bg-blue-light rounded hover:bg-blue-primary hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    disabled={deletingId === q.id}
                    className="px-3 py-1 text-xs font-bold text-red-accent bg-red-fail-bg rounded hover:bg-red-accent hover:text-white transition-colors disabled:opacity-50"
                  >
                    {deletingId === q.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
