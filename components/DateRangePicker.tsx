import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { DateRange } from '../types';

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (newRange: DateRange) => void;
  minDate?: string; // YYYY-MM-DD issue du fichier
  maxDate?: string; // YYYY-MM-DD issue du fichier
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onChange, minDate, maxDate }) => {
  // Conversion YYYY-MM-DD (State Global) vers JJ/MM/AAAA (Affichage Input)
  const formatToDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  const [startInput, setStartInput] = useState(formatToDisplay(dateRange.start));
  const [endInput, setEndInput] = useState(formatToDisplay(dateRange.end));
  const [error, setError] = useState<string | null>(null);
  
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStartInput(formatToDisplay(dateRange.start));
    setEndInput(formatToDisplay(dateRange.end));
    validateRange(dateRange.start, dateRange.end);
  }, [dateRange]);

  const validateRange = (start: string, end: string) => {
      setError(null);
      if (!minDate || !maxDate) return;

      if (start && start < minDate) {
          setError(`Début avant le ${formatToDisplay(minDate)}`);
          return;
      }
      if (end && end > maxDate) {
          setError(`Fin après le ${formatToDisplay(maxDate)}`);
          return;
      }
      if (start && end && start > end) {
          setError("La date de début doit être avant la fin");
          return;
      }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleInput = (value: string, isStart: boolean) => {
    // 1. Nettoyage
    const numbers = value.replace(/\D/g, '');
    const truncated = numbers.slice(0, 8);
    
    // 2. Formatage visuel
    let formatted = truncated;
    if (truncated.length >= 3) {
      formatted = `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
    }
    if (truncated.length >= 5) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5)}`;
    }

    if (isStart) setStartInput(formatted);
    else setEndInput(formatted);

    // 3. Validation et Update
    if (truncated.length === 8) {
      const day = parseInt(truncated.slice(0, 2));
      const month = parseInt(truncated.slice(2, 4));
      const year = parseInt(truncated.slice(4, 8));

      const dateObj = new Date(year, month - 1, day);
      if (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
      ) {
        const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (isStart) {
          onChange({ ...dateRange, start: isoDate });
          // UX: Sauter au champ suivant si on vient de finir de taper la date de début
          endInputRef.current?.focus(); 
        } else {
          onChange({ ...dateRange, end: isoDate });
        }
      }
    } else if (truncated.length === 0) {
        if (isStart) onChange({ ...dateRange, start: '' });
        else onChange({ ...dateRange, end: '' });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
        <Calendar size={14} /> Période d'analyse
      </label>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1 group">
            <input
                type="text"
                value={startInput}
                onChange={(e) => handleInput(e.target.value, true)}
                onFocus={handleFocus}
                placeholder="JJ/MM/AAAA"
                maxLength={10}
                className={`w-full text-sm p-2 pl-3 border rounded-lg outline-none transition-all text-center shadow-sm
                ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : dateRange.start ? 'border-blue-600/30 bg-blue-600/5 text-blue-600 font-semibold focus:border-blue-600' : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-[blue-600]/20'}
                `}
            />
            {!dateRange.start && (
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <span className="text-[10px] text-gray-400">Début</span>
                </div>
            )}
        </div>

        <ArrowRight size={14} className="text-gray-400 shrink-0" />

        <div className="relative flex-1 group">
            <input
                ref={endInputRef}
                type="text"
                value={endInput}
                onChange={(e) => handleInput(e.target.value, false)}
                onFocus={handleFocus}
                placeholder="JJ/MM/AAAA"
                maxLength={10}
                className={`w-full text-sm p-2 pl-3 border rounded-lg outline-none transition-all text-center shadow-sm
                ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : dateRange.end ? 'border-blue-600/30 bg-blue-600/5 text-blue-600 font-semibold focus:border-blue-600' : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-[blue-600]/20'}
                `}
            />
             {!dateRange.end && (
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <span className="text-[10px] text-gray-400">Fin</span>
                </div>
            )}
        </div>
      </div>
      
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="leading-tight">{error}</span>
        </div>
      )}
      
      {!error && minDate && maxDate && (
         <div className="text-[10px] text-gray-400 text-center">
            Données disponibles du {formatToDisplay(minDate)} au {formatToDisplay(maxDate)}
         </div>
      )}
    </div>
  );
};
