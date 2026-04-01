'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    studentId: '',
    password: '',
    class: '9'
  });

  useEffect(() => {
    // Generate a secure 5-digit Student ID on mount
    const generatedId = Math.floor(10000 + Math.random() * 90000).toString();
    setFormData(prev => ({ ...prev, studentId: generatedId }));

    // Fetch public config for logo
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Store JWT and Student Info
      localStorage.setItem('student_token', data.token);
      localStorage.setItem('student_name', formData.name);
      localStorage.setItem('student_class', formData.class);
      localStorage.setItem('roll_number', data.rollNumber);
      localStorage.setItem('student_id', formData.studentId);

      // Spec: On success → navigate to Splash Screen
      router.push('/splash');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-primary flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <div className="text-center mb-10">
          {/* Logo: swappable — uses uploaded logo or placeholder */}
          {logoUrl ? (
            <img src={logoUrl} alt="IJT Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
          ) : (
            <div className="w-16 h-16 bg-blue-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              IJT
            </div>
          )}
          <h1 className="text-3xl font-bold text-text-dark tracking-tight">
            Student Registration
          </h1>
          <p className="text-text-muted mt-2">
            Islami Jamiat Talba Examination System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Full Name" 
            placeholder="e.g. Ahmad Ali"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Father's Name" 
            placeholder="e.g. Muhammad Ali"
            required
            value={formData.fatherName}
            onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
          />
          <Input 
            label="System Auto-Generated Student ID" 
            placeholder="Generating..."
            required
            readOnly
            value={formData.studentId}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            className="opacity-70 cursor-not-allowed font-mono text-blue-primary font-bold text-lg select-all"
            title="Your ID is automatically generated to ensure security."
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="At least 6 characters"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Class
            </label>
            <select 
              className="px-4 py-3 bg-white border-2 border-grey-border rounded-lg outline-none focus:border-blue-primary transition-all cursor-pointer"
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
            >
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </div>

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
            className="h-14 text-lg"
          >
            Register
          </Button>

          <p className="text-center text-sm text-text-muted mt-4">
            Already registered? <a href="/login" className="text-blue-primary font-semibold hover:underline">Login here</a>
          </p>
        </form>
      </Card>
    </div>
  );
}
