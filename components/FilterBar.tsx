import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter as FilterIcon, X, CheckCircle2, XCircle, Calendar, Clock, User, Hash, ChevronUp, ChevronDown } from 'lucide-react';
import { FilterState, ProjectConfig } from '../types';
import { TimeRangePicker } from './TimeRangePicker';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resultCount: number;
  callerSuggestions?: string[];
  calledSuggestions?: string[];
  projectConfig?: ProjectConfig | null;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  setFilters, 
  resultCount, 
  callerSuggestions = [],
  calledSuggestions = [],
  projectConfig = null
}) => {
  const [showFilters, setShowFilters] = useState(true);
  const [showCallerDropdown, setShowCallerDropdown] = useState(false);
  const [showCalledDropdown, setShowCalledDropdown] = useState(false);
  const callerRef = useRef<HTMLDivElement>(null);
  const calledRef = useRef<HTMLDivElement>(null);
  
  // Track dropdown positions for scroll updates
  const [, forceUpdate] = useState({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (callerRef.current && !callerRef.current.contains(event.target as Node)) {
        setShowCallerDropdown(false);
      }
      if (calledRef.current && !calledRef.current.contains(event.target as Node)) {
        setShowCalledDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update dropdown positions on scroll/resize
  useEffect(() => {
    if (!showCallerDropdown && !showCalledDropdown) return;
    
    const handleScrollOrResize = () => {
      // Force re-render to update dropdown positions
      forceUpdate({});
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [showCallerDropdown, showCalledDropdown]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'caller') setShowCallerDropdown(false);
    if (key === 'called') setShowCalledDropdown(false);
  };

  // Get line display name from config
  const getLineDisplayName = (number: string): string => {
    if (!projectConfig?.lines) return number;
    const line = projectConfig.lines[number];
    if (line?.name && line.name !== number) {
      return `${line.name} (${number})`;
    }
    return number;
  };

  // Get top 6 caller suggestions
  const topCallerSuggestions = useMemo(() => {
    if (!filters.caller.trim()) return callerSuggestions.slice(0, 6);
    const input = filters.caller.toLowerCase();
    return callerSuggestions
      .filter(c => c.toLowerCase().includes(input))
      .slice(0, 6);
  }, [filters.caller, callerSuggestions]);

  // Get top 6 called suggestions with names
  const topCalledSuggestions = useMemo(() => {
    const suggestions = calledSuggestions.map(num => ({
      number: num,
      display: getLineDisplayName(num)
    }));
    
    if (!filters.called.trim()) return suggestions.slice(0, 6);
    const input = filters.called.toLowerCase();
    return suggestions
      .filter(c => c.display.toLowerCase().includes(input) || c.number.toLowerCase().includes(input))
      .slice(0, 6);
  }, [filters.called, calledSuggestions, projectConfig]);

  const clearFilters = () => {
    setFilters({
      date: '',
      timeStart: '',
      timeEnd: '',
      caller: '',
      called: '',
      status: 'all'
    });
  };

  const activeFilterCount = (filters.date ? 1 : 0) + (filters.timeStart || filters.timeEnd ? 1 : 0) + (filters.caller ? 1 : 0) + (filters.called ? 1 : 0) + (filters.status !== 'all' ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 md:mb-6" style={{ position: 'relative', zIndex: 10 }}>
        <div className="p-3 md:p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <FilterIcon size={16} className="text-blue-600 md:w-[18px] md:h-[18px]" />
                <h3 className="font-bold text-slate-700 text-sm md:text-base">Filtres avancés</h3>
                {activeFilterCount > 0 && (
                    <span className="bg-blue-600/10 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </div>
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
                {showFilters ? <ChevronUp size={16} className="md:w-[18px] md:h-[18px]" /> : <ChevronDown size={16} className="md:w-[18px] md:h-[18px]" />}
            </button>
        </div>

        {showFilters && (
            <div className="p-3 md:p-5">
                {/* Row 1: Date + Time Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                    {/* Date */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <Calendar size={12}/> Date
                        </label>
                        <input 
                            type="text" 
                            placeholder="ex: 12/05" 
                            value={filters.date}
                            onChange={(e) => handleFilterChange('date', e.target.value)}
                            className="w-full text-sm p-2 md:p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[blue-600]/20 focus:border-blue-600 transition-all h-[38px] md:h-[42px]"
                        />
                    </div>

                    {/* Time Range - New UX */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <Clock size={12}/> Plage horaire
                        </label>
                        <TimeRangePicker 
                            valueStart={filters.timeStart}
                            valueEnd={filters.timeEnd}
                            onChangeStart={(val) => handleFilterChange('timeStart', val)}
                            onChangeEnd={(val) => handleFilterChange('timeEnd', val)}
                        />
                    </div>
                </div>

                {/* Row 2: Caller + Called with autocomplete */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                    {/* Caller with autocomplete */}
                    <div className="space-y-1" ref={callerRef} style={{ position: 'relative' }}>
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <User size={12}/> Appelant
                        </label>
                        <input 
                            type="text" 
                            placeholder="Numéro..." 
                            value={filters.caller}
                            onChange={(e) => {
                                handleFilterChange('caller', e.target.value);
                                setShowCallerDropdown(true);
                            }}
                            onFocus={() => setShowCallerDropdown(true)}
                            className="w-full text-sm p-2 md:p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[blue-600]/20 focus:border-blue-600 transition-all h-[38px] md:h-[42px]"
                        />
                        {/* Autocomplete Dropdown - Fixed positioning to escape overflow */}
                        {showCallerDropdown && topCallerSuggestions.length > 0 && (
                            <div 
                                className="fixed mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto"
                                style={{ 
                                    zIndex: 9999,
                                    minWidth: callerRef.current?.offsetWidth || 200,
                                    left: callerRef.current?.getBoundingClientRect().left || 0,
                                    top: (callerRef.current?.getBoundingClientRect().bottom || 0) + 4
                                }}
                            >
                                {topCallerSuggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleFilterChange('caller', suggestion)}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-600/10 hover:text-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Called with autocomplete */}
                    <div className="space-y-1" ref={calledRef} style={{ position: 'relative' }}>
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <Hash size={12}/> Appelé
                        </label>
                        <input 
                            type="text" 
                            placeholder="Poste ou Ligne..." 
                            value={filters.called}
                            onChange={(e) => {
                                handleFilterChange('called', e.target.value);
                                setShowCalledDropdown(true);
                            }}
                            onFocus={() => setShowCalledDropdown(true)}
                            className="w-full text-sm p-2 md:p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[blue-600]/20 focus:border-blue-600 transition-all h-[38px] md:h-[42px]"
                        />
                        {/* Autocomplete Dropdown - Fixed positioning */}
                        {showCalledDropdown && topCalledSuggestions.length > 0 && (
                            <div 
                                className="fixed mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto"
                                style={{ 
                                    zIndex: 9999,
                                    minWidth: calledRef.current?.offsetWidth || 200,
                                    left: calledRef.current?.getBoundingClientRect().left || 0,
                                    top: (calledRef.current?.getBoundingClientRect().bottom || 0) + 4
                                }}
                            >
                                {topCalledSuggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleFilterChange('called', suggestion.number)}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-600/10 hover:text-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                                    >
                                        {suggestion.display}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Tabs + Reset */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 pt-3 md:pt-4 border-t border-slate-100">
                    <div className="flex p-1 bg-slate-100 rounded-lg w-full md:w-auto overflow-x-auto no-scrollbar">
                        {(['all', 'Répondu', 'Manqué', 'Hors Ouverture'] as const).map((status) => {
                            const isActive = filters.status === status;
                            let label = 'Tout';
                            let icon = null;
                            
                            if (status === 'Répondu') { label = 'Répondus'; icon = <CheckCircle2 size={12} className={`md:w-[14px] md:h-[14px] ${isActive ? "text-emerald-300" : "text-emerald-600"}`} />; }
                            if (status === 'Manqué') { label = 'Perdus'; icon = <XCircle size={12} className={`md:w-[14px] md:h-[14px] ${isActive ? "text-red-300" : "text-red-600"}`} />; }
                            if (status === 'Hors Ouverture') { label = 'Hors Horaires'; icon = <Clock size={12} className={`md:w-[14px] md:h-[14px] ${isActive ? "text-slate-400" : "text-slate-500"}`} />; }

                            return (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange('status', status)}
                                    className={`flex-none px-2 md:px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap
                                        ${isActive 
                                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {icon}
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-xs font-medium text-slate-500">
                            {resultCount} résultats
                        </span>
                        {activeFilterCount > 0 && (
                            <button 
                                onClick={clearFilters}
                                className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 font-medium"
                            >
                                <X size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">Effacer les filtres</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
