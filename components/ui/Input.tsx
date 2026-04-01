import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">
        {label}
      </label>
      <input
        className={`px-4 py-3 bg-white border-2 rounded-lg transition-all duration-200 
          ${error ? 'border-red-500' : 'border-grey-border focus:border-blue-primary'}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
