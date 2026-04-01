'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ExamSettingsPage() {
  const [config, setConfig] = useState({
    durationMinutes: 55,
    passingPercentage: 50,
    orgName: 'Islami Jamiat Talba',
    logoUrl: '' as string | null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Load current config
  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        setConfig({
          durationMinutes: data.durationMinutes || 55,
          passingPercentage: data.passingPercentage || 50,
          orgName: data.orgName || 'Islami Jamiat Talba',
          logoUrl: data.logoUrl || null
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Save config
  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationMinutes: config.durationMinutes,
          passingPercentage: config.passingPercentage,
          orgName: config.orgName
        })
      });

      if (!res.ok) throw new Error('Failed to save');
      setMessage('Settings saved successfully!');
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Upload logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch('/api/admin/logo', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setConfig(prev => ({ ...prev, logoUrl: data.logoUrl }));
      setMessage('Logo uploaded successfully!');
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-text-muted">Loading settings...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Exam Settings</h1>

      <Card className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Exam Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              className="px-4 py-3 bg-white border-2 border-grey-border rounded-lg focus:border-blue-primary transition-all"
              value={config.durationMinutes}
              onChange={(e) => setConfig(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Passing Percentage (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              className="px-4 py-3 bg-white border-2 border-grey-border rounded-lg focus:border-blue-primary transition-all"
              value={config.passingPercentage}
              onChange={(e) => setConfig(prev => ({ ...prev, passingPercentage: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <Input
          label="Organization Name"
          value={config.orgName}
          onChange={(e) => setConfig(prev => ({ ...prev, orgName: e.target.value }))}
        />

        {/* Logo Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Logo Upload (PNG/JPG)
          </label>
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img src={config.logoUrl} alt="Current Logo" className="h-16 w-auto object-contain rounded-lg border border-grey-border p-1" />
            )}
            <label className="cursor-pointer px-4 py-3 bg-white border-2 border-dashed border-grey-border rounded-lg hover:border-blue-primary transition-colors text-sm text-text-muted">
              {uploading ? 'Uploading...' : 'Choose file'}
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Message */}
        {message && (
          <p className={`text-sm font-medium ${message.startsWith('Error') ? 'text-red-accent' : 'text-green-pass'}`}>
            {message}
          </p>
        )}

        <Button onClick={handleSave} loading={saving}>
          Save Settings
        </Button>
      </Card>
    </div>
  );
}
