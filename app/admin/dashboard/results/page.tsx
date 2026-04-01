'use client';

import React, { useState, useEffect } from 'react';
import { ResultsTable } from '@/components/admin/ResultsTable';

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/results')
      .then(res => res.json())
      .then(data => {
        setResults(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Exam Results</h1>

      {loading ? (
        <p className="text-text-muted">Loading results...</p>
      ) : (
        <ResultsTable results={results} />
      )}
    </div>
  );
}
