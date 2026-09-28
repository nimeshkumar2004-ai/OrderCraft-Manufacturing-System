import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search records...',
  className = '',
  autoFocus = false
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-9 pr-8 py-2 bg-white text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-2xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
