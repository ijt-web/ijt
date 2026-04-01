'use client';

import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-grey-light">
      <Sidebar />
      {/* Main content — offset by sidebar width on desktop */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 md:p-8 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
