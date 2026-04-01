import React from 'react';

interface NavbarProps {
  title?: string;
  logoUrl?: string;
  children?: React.ReactNode;
}

export function Navbar({ 
  title = "Study Aid Project — Examination", 
  logoUrl, 
  children 
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/85 backdrop-blur-xl shadow-glass border-b border-white/40 z-50 flex items-center justify-between px-6 md:px-12 transition-all">
      <div className="flex items-center gap-4">
        {logoUrl ? (
          <img src={logoUrl} alt="Org Logo" className="h-12 w-auto object-contain" />
        ) : (
          <div className="h-10 px-2 rounded-full bg-blue-primary flex items-center justify-center text-white font-bold text-xs text-center">
            Study Aid
          </div>
        )}
        <h1 className="hidden md:block text-blue-dark font-bold text-lg tracking-tight uppercase">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        {children}
      </div>
    </nav>
  );
}
