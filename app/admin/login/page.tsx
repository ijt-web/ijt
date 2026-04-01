'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => { if (data.logoUrl) setLogoUrl(data.logoUrl); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unauthorized');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-navy via-blue-dark to-blue-primary bg-[length:200%_200%] animate-gradient-shift flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative floating blur spheres */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-blue-primary/40 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <Card className="w-full max-w-md !bg-white/95 backdrop-blur-xl shadow-glass border border-white/20 animate-slide-up relative z-10">
        <div className="text-center mb-8">
          {logoUrl ? (
            <img src={logoUrl} alt="Org Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
          ) : (
            <div className="w-16 h-16 bg-blue-dark rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
          <h1 className="text-3xl font-bold text-text-dark tracking-tight">
            Admin Panel
          </h1>
          <p className="text-text-muted mt-2">
            Study Aid project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Password"
            type="password"
            placeholder="Enter admin password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="p-4 bg-red-fail-bg text-red-accent rounded-lg border border-red-accent/20 text-sm font-bold flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
