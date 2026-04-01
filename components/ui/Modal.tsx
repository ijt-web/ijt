'use client';

import React from 'react';
import { Card } from '../ui/Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content */}
      <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-6 md:p-8 animate-scale-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-dark uppercase tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-grey-light rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </Card>
    </div>
  );
}
