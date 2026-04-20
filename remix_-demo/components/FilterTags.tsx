
import React from 'react';
import { FilterState } from '../types';
import { X } from 'lucide-react';

interface FilterTagsProps {
  filters: FilterState;
  onRemove: (key: keyof FilterState, value: string) => void;
}

export const FilterTags: React.FC<FilterTagsProps> = ({ filters, onRemove }) => {
  const activeTags: { key: keyof FilterState; value: string; label: string }[] = [];

  const getFilterConfig = (key: string) => {
    switch(key) {
      case 'primaryTumors': return { prefix: 'T:', color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' };
      case 'sex': return { prefix: 'S:', color: 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100' };
      case 'ageRanges': return { prefix: 'A:', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' };
      case 'biopsySites': return { prefix: 'L:', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' };
      case 'types': return { prefix: 'O:', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100' };
      case 'treatments': return { prefix: 'Rx:', color: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' };
      default: return { prefix: '', color: 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100' };
    }
  };

  Object.entries(filters).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach(val => {
        activeTags.push({ 
          key: key as keyof FilterState, 
          value: val, 
          label: val
        });
      });
    }
  });

  if (activeTags.length === 0) return (
    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-black uppercase tracking-widest">
      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
      No active filters
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 overflow-hidden max-h-8">
      {activeTags.slice(0, 5).map((tag) => {
        const config = getFilterConfig(tag.key);
        return (
          <div 
            key={`${tag.key}-${tag.value}`}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 border rounded-lg text-[9px] whitespace-nowrap transition-all shadow-sm ${config.color}`}
          >
            <span className="font-bold opacity-50 uppercase tracking-tighter">
              {config.prefix}
            </span>
            <span className="font-black uppercase tracking-tight">{tag.value.replace(/_/g, ' ')}</span>
            <button 
              onClick={() => onRemove(tag.key, tag.value)}
              className="ml-0.5 p-0.5 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={8} />
            </button>
          </div>
        );
      })}
      {activeTags.length > 5 && (
        <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase border border-slate-200 shadow-sm">
          +{activeTags.length - 5} more
        </span>
      )}
    </div>
  );
};
