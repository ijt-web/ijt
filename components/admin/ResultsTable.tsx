'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

interface ResultsTableProps {
  results: any[];
}

type SortKey = 'rollNumber' | 'name' | 'class' | 'stream' | 'marks' | 'total' | 'percentage' | 'passed' | 'submittedAt';

export function ResultsTable({ results }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rollNumber');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStream, setFilterStream] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reviewStudent, setReviewStudent] = useState<any>(null);

  // Sort and filter
  const filtered = useMemo(() => {
    let data = [...results];

    if (filterClass !== 'all') {
      data = data.filter(r => r.student?.class === filterClass);
    }
    if (filterStream !== 'all') {
      data = data.filter(r => (r.stream || r.student?.stream) === filterStream);
    }
    if (filterStatus !== 'all') {
      data = data.filter(r => filterStatus === 'pass' ? r.passed : !r.passed);
    }

    data.sort((a, b) => {
      let valA = sortKey === 'name' ? a.student?.name : sortKey === 'class' ? a.student?.class : sortKey === 'rollNumber' ? a.student?.rollNumber : sortKey === 'stream' ? (a.stream || a.student?.stream) : a[sortKey];
      let valB = sortKey === 'name' ? b.student?.name : sortKey === 'class' ? b.student?.class : sortKey === 'rollNumber' ? b.student?.rollNumber : sortKey === 'stream' ? (b.stream || b.student?.stream) : b[sortKey];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [results, sortKey, sortDir, filterClass, filterStatus]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = 'Roll No,Name,Class,Stream,Marks,Total,Percentage,Status,Submitted At\n';
    const rows = filtered.map(r =>
      `${r.student?.rollNumber},"${r.student?.name}",${r.student?.class},${(r.stream || r.student?.stream)?.toUpperCase()},${r.marks},${r.total},${Math.round(r.percentage)}%,${r.passed ? 'PASS' : 'FAIL'},${new Date(r.submittedAt).toLocaleString()}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="text-left px-3 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider cursor-pointer hover:text-blue-primary select-none"
      onClick={() => handleSort(field)}
    >
      {label} {sortKey === field && (sortDir === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Filters + Export */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="px-3 py-2 border border-grey-border rounded-lg text-sm bg-white"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="all">All Classes</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>
        <select
          className="px-3 py-2 border border-grey-border rounded-lg text-sm bg-white"
          value={filterStream}
          onChange={(e) => setFilterStream(e.target.value)}
        >
          <option value="all">All Streams</option>
          <option value="biology">Biology</option>
          <option value="computer">Computer</option>
        </select>
        <select
          className="px-3 py-2 border border-grey-border rounded-lg text-sm bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pass">Pass Only</option>
          <option value="fail">Fail Only</option>
        </select>
        <button
          onClick={exportCSV}
          className="ml-auto px-4 py-2 bg-blue-primary text-white rounded-lg text-sm font-medium hover:bg-blue-dark transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl border border-grey-border">
        <table className="w-full text-sm">
          <thead className="bg-grey-light border-b border-grey-border">
            <tr>
              <SortHeader label="Roll No" field="rollNumber" />
              <SortHeader label="Name" field="name" />
              <SortHeader label="Class" field="class" />
              <SortHeader label="Stream" field="stream" />
              <SortHeader label="Marks" field="marks" />
              <SortHeader label="Total" field="total" />
              <SortHeader label="%" field="percentage" />
              <SortHeader label="Status" field="passed" />
              <SortHeader label="Submitted" field="submittedAt" />
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-text-muted">No results found.</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-grey-border last:border-0 hover:bg-grey-light/50 transition-colors">
                  <td className="px-3 py-3 font-mono font-bold text-blue-primary">{r.student?.rollNumber}</td>
                  <td className="px-3 py-3 font-medium text-text-dark">{r.student?.name}</td>
                  <td className="px-3 py-3 text-text-muted">{r.student?.class}</td>
                  <td className="px-3 py-3 text-text-muted uppercase text-xs font-bold tracking-tight">{(r.stream || r.student?.stream || 'all')}</td>
                  <td className="px-3 py-3 font-bold">{r.marks}</td>
                  <td className="px-3 py-3 text-text-muted">{r.total}</td>
                  <td className="px-3 py-3 font-bold">{Math.round(r.percentage)}%</td>
                  <td className="px-3 py-3">
                    <Badge status={r.passed ? 'pass' : 'fail'}>
                      {r.passed ? 'PASS' : 'FAIL'}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-text-muted text-xs">
                    {new Date(r.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => setReviewStudent(r)}
                      className="px-3 py-1 text-xs font-bold text-blue-primary bg-blue-light rounded hover:bg-blue-primary hover:text-white transition-colors"
                    >
                      View Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">
        Showing {filtered.length} of {results.length} results
      </p>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewStudent}
        onClose={() => setReviewStudent(null)}
        title={`Review: ${reviewStudent?.student?.name || ''}`}
      >
        {reviewStudent?.answers && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {reviewStudent.answers.map((a: any, idx: number) => {
              const isCorrect = a.selectedOption === a.question?.correctOption;
              return (
                <div key={a.id} className="p-4 bg-grey-light rounded-lg">
                  <p className="font-medium text-sm mb-2">
                    <span className="text-blue-primary font-bold">Q{idx + 1}.</span> {a.question?.questionText}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const isSelected = a.selectedOption === opt;
                      const isCorrectOpt = a.question?.correctOption === opt;
                      let cls = 'px-2 py-1 rounded border';
                      if (isSelected && isCorrect) cls += ' bg-green-pass-bg border-green-pass text-green-pass font-bold';
                      else if (isSelected && !isCorrect) cls += ' bg-red-fail-bg border-red-accent text-red-accent font-bold';
                      else if (isCorrectOpt) cls += ' bg-green-pass-bg border-green-pass text-green-pass';
                      else cls += ' border-grey-border text-text-muted';
                      return (
                        <span key={opt} className={cls}>
                          {opt}: {a.question?.[`option${opt}`]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
