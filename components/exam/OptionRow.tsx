import React from 'react';

interface OptionRowProps {
  label: string; // "A", "B", "C", "D"
  text: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionRow({ label, text, selected, onClick }: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border-2 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]
        ${selected 
          ? 'bg-blue-light border-blue-primary shadow-sm' 
          : 'bg-white border-grey-border hover:bg-blue-light/30 hover:border-blue-primary/30'
        }`}
    >
      {/* Radio indicator */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200
        ${selected ? 'border-blue-primary bg-white' : 'border-grey-border bg-white'}`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue-primary" />}
      </div>

      {/* Option label + text */}
      <span className={`font-medium ${selected ? 'text-blue-primary' : 'text-text-dark'}`}>
        <span className="font-bold mr-2">{label}.</span>
        {text}
      </span>
    </button>
  );
}
