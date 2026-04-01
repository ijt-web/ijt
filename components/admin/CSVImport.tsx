'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/Button';

interface CSVImportProps {
  classId: string;
  onImported: () => void;
}

interface CSVRow {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  error?: string;
}

export function CSVImport({ classId, onImported }: CSVImportProps) {
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Download CSV Template
  const downloadTemplate = () => {
    const template = 'question,option_a,option_b,option_c,option_d,correct\nWho wrote the law of gravity?,Newton,Tesla,Einstein,Merlin,A\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class_${classId}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse uploaded CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed: CSVRow[] = result.data.map((row: any) => {
          const q: CSVRow = {
            questionText: row.question || row.questionText || '',
            optionA: row.option_a || row.optionA || '',
            optionB: row.option_b || row.optionB || '',
            optionC: row.option_c || row.optionC || '',
            optionD: row.option_d || row.optionD || '',
            correctOption: (row.correct || row.correctOption || '').toUpperCase()
          };

          // Validate
          if (!q.questionText || !q.optionA || !q.optionB || !q.optionC || !q.optionD) {
            q.error = 'Missing required fields';
          } else if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) {
            q.error = 'Correct answer must be A, B, C, or D';
          }

          return q;
        });

        setRows(parsed);
      }
    });
  };

  // Edit a row inline
  const updateRow = (idx: number, field: keyof CSVRow, value: string) => {
    setRows(prev => {
      const updated = [...prev];
      (updated[idx] as any)[field] = value;
      // Re-validate
      const r = updated[idx];
      if (!r.questionText || !r.optionA || !r.optionB || !r.optionC || !r.optionD) {
        r.error = 'Missing required fields';
      } else if (!['A', 'B', 'C', 'D'].includes(r.correctOption.toUpperCase())) {
        r.error = 'Correct answer must be A, B, C, or D';
      } else {
        r.error = undefined;
      }
      return updated;
    });
  };

  // Remove a row
  const removeRow = (idx: number) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  // Confirm import
  const handleImport = async () => {
    const hasErrors = rows.some(r => r.error);
    if (hasErrors) {
      setMessage('Please fix all errors before importing.');
      return;
    }

    setImporting(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class: classId,
          questions: rows.map(r => ({
            questionText: r.questionText,
            optionA: r.optionA,
            optionB: r.optionB,
            optionC: r.optionC,
            optionD: r.optionD,
            correctOption: r.correctOption.toUpperCase()
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setMessage(`Successfully imported ${data.inserted || rows.length} questions!`);
      setRows([]);
      if (fileRef.current) fileRef.current.value = '';
      onImported();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-dark">CSV Bulk Import</h3>

      <div className="flex flex-wrap gap-3">
        <label className="cursor-pointer px-4 py-2 bg-blue-primary text-white rounded-lg text-sm font-medium hover:bg-blue-dark transition-colors">
          Import from CSV
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <button
          onClick={downloadTemplate}
          className="px-4 py-2 border-2 border-blue-primary text-blue-primary rounded-lg text-sm font-medium hover:bg-blue-light transition-colors"
        >
          Download CSV Template
        </button>
      </div>

      {/* Preview Table */}
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-grey-border rounded-lg overflow-hidden">
            <thead className="bg-grey-light">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-text-muted">#</th>
                <th className="text-left px-3 py-2 font-semibold text-text-muted">Question</th>
                <th className="text-left px-3 py-2 font-semibold text-text-muted">A</th>
                <th className="text-left px-3 py-2 font-semibold text-text-muted">B</th>
                <th className="text-left px-3 py-2 font-semibold text-text-muted">C</th>
                <th className="text-left px-3 py-2 font-semibold text-text-muted">D</th>
                <th className="text-left px-3 py-2 font-semibold text-text-muted">Ans</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className={row.error ? 'bg-red-fail-bg' : 'bg-white'}>
                  <td className="px-3 py-2 text-text-muted">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <input className="w-full bg-transparent border-b border-grey-border focus:border-blue-primary outline-none py-1" value={row.questionText} onChange={(e) => updateRow(idx, 'questionText', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className="w-full bg-transparent border-b border-grey-border focus:border-blue-primary outline-none py-1" value={row.optionA} onChange={(e) => updateRow(idx, 'optionA', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className="w-full bg-transparent border-b border-grey-border focus:border-blue-primary outline-none py-1" value={row.optionB} onChange={(e) => updateRow(idx, 'optionB', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className="w-full bg-transparent border-b border-grey-border focus:border-blue-primary outline-none py-1" value={row.optionC} onChange={(e) => updateRow(idx, 'optionC', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className="w-full bg-transparent border-b border-grey-border focus:border-blue-primary outline-none py-1" value={row.optionD} onChange={(e) => updateRow(idx, 'optionD', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <select className="bg-transparent border-b border-grey-border focus:border-blue-primary outline-none py-1" value={row.correctOption} onChange={(e) => updateRow(idx, 'correctOption', e.target.value)}>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeRow(idx)} className="text-red-accent hover:text-red-hover text-xs font-bold">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Error rows indicator */}
          {rows.some(r => r.error) && (
            <p className="text-red-accent text-xs mt-2 font-medium">
              ⚠ Some rows have errors (highlighted in red). Fix them before importing.
            </p>
          )}

          <div className="mt-4">
            <Button onClick={handleImport} loading={importing}>
              Confirm Import ({rows.length} questions)
            </Button>
          </div>
        </div>
      )}

      {message && (
        <p className={`text-sm font-medium ${message.startsWith('Error') ? 'text-red-accent' : 'text-green-pass'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
