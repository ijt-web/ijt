'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });

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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      // Spec: If result already exists → navigate directly to Result Page
      if (data.redirect === 'result') {
        router.push('/result');
        return;
      }

      localStorage.setItem('student_token', data.token);
      // Spec: On success → navigate to Splash Screen
      router.push('/splash');
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
            <img src={logoUrl} alt="IJT Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
          ) : (
            <div className="w-16 h-16 bg-blue-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              IJT
            </div>
          )}
          <h1 className="text-3xl font-bold text-text-dark tracking-tight">
            Welcome Back
          </h1>
          <p className="text-text-muted mt-2">
            Islami Jamiat Talba Examination System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Student ID" 
            placeholder="Enter your Student ID"
            required
            value={formData.studentId}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          {error && (
            <div className="p-4 bg-red-fail-bg text-red-accent rounded-lg border border-red-accent/20 text-sm font-bold flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
          >
            Login
          </Button>

          <p className="text-center text-sm text-text-muted mt-4">
            New here? <a href="/register" className="text-blue-primary font-semibold hover:underline">Register now</a>
          </p>
        </form>
      </Card>
    </div>
  );
}
