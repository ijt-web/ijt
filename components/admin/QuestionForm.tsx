'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface QuestionFormProps {
  classId: string;
  editingQuestion?: any;
  onSaved: () => void;
  onCancelEdit?: () => void;
}

export function QuestionForm({ classId, editingQuestion, onSaved, onCancelEdit }: QuestionFormProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    stream: 'all'
  });

  // Populate form when editing
  useEffect(() => {
    if (editingQuestion) {
      setForm({
        questionText: editingQuestion.questionText,
        optionA: editingQuestion.optionA,
        optionB: editingQuestion.optionB,
        optionC: editingQuestion.optionC,
        optionD: editingQuestion.optionD,
        correctOption: editingQuestion.correctOption,
        stream: editingQuestion.stream || 'all'
      });
    }
  }, [editingQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingQuestion
        ? `/api/admin/questions/${editingQuestion.id}`
        : '/api/admin/questions';
      const method = editingQuestion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, class: classId })
      });

      if (!res.ok) throw new Error('Failed to save');

      // Reset form
      setForm({ 
        questionText: '', 
        optionA: '', 
        optionB: '', 
        optionC: '', 
        optionD: '', 
        correctOption: 'A',
        stream: 'all'
      });
      onSaved();
    } catch (err) {
      alert('Error saving question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-text-dark">
        {editingQuestion ? 'Edit Question' : 'Add Question Manually'}
      </h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Question Text</label>
        <textarea
          className="px-4 py-3 bg-white border-2 border-grey-border rounded-lg focus:border-blue-primary transition-all resize-y min-h-[80px]"
          required
          value={form.questionText}
          onChange={(e) => setForm(prev => ({ ...prev, questionText: e.target.value }))}
          placeholder="Enter the question..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
          <div key={opt} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Option {opt}</label>
            <input
              className="px-4 py-3 bg-white border-2 border-grey-border rounded-lg focus:border-blue-primary transition-all"
              required
              value={form[`option${opt}` as keyof typeof form]}
              onChange={(e) => setForm(prev => ({ ...prev, [`option${opt}`]: e.target.value }))}
              placeholder={`Option ${opt}`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Correct Answer</label>
          <select
            className="px-4 py-3 bg-white border-2 border-grey-border rounded-lg focus:border-blue-primary transition-all cursor-pointer w-full"
            value={form.correctOption}
            onChange={(e) => setForm(prev => ({ ...prev, correctOption: e.target.value }))}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Stream (Target Students)</label>
          <select
            className="px-4 py-3 bg-white border-2 border-grey-border rounded-lg focus:border-blue-primary transition-all cursor-pointer w-full"
            value={form.stream}
            onChange={(e) => setForm(prev => ({ ...prev, stream: e.target.value }))}
          >
            <option value="all">All (Both Streams)</option>
            <option value="biology">Biology Only</option>
            <option value="computer">Computer Only</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving}>
          {editingQuestion ? 'Update Question' : 'Save Question'}
        </Button>
        {editingQuestion && onCancelEdit && (
          <Button type="button" variant="secondary" onClick={() => {
            setForm({ 
              questionText: '', 
              optionA: '', 
              optionB: '', 
              optionC: '', 
              optionD: '', 
              correctOption: 'A',
              stream: 'all'
            });
            onCancelEdit();
          }}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
