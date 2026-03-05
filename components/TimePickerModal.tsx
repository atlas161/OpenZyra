import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface TimePickerModalProps {
  isOpen: boolean;
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
  title?: string;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  value,
  onChange,
  onClose,
  title = "Sélectionner l'heure"
}) => {
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');

  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':').map(Number);
      setHours(h || 0);
      setMinutes(m || 0);
    }
  }, [value, isOpen]);

  const handleConfirm = () => {
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(formatted);
    onClose();
  };

  const getClockNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 24; i += 1) {
      // Position sur le cadran : 24 heures réparties en cercle
      // 0h en haut (12h sur un cadran normal), puis dans le sens horaire
      const angle = ((i * 15) - 90) * (Math.PI / 180);
      const isSelected = mode === 'hour' && hours === i;
      const isEmphasized = i % 6 === 0; // 0, 6, 12, 18
      
      // Rayon différent pour les heures importantes vs secondaires
      const radius = isEmphasized ? 80 : 60;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      numbers.push(
        <button
          key={i}
          onClick={() => {
            setHours(i);
            setMode('minute');
          }}
          className={`absolute flex items-center justify-center text-xs font-medium transition-all ${
            isSelected
              ? 'w-8 h-8 bg-violet-600 text-white shadow-lg scale-110 rounded-full'
              : isEmphasized
                ? 'w-7 h-7 bg-slate-100 text-slate-700 hover:bg-violet-100 rounded-full'
                : 'w-6 h-6 text-slate-400 hover:bg-slate-50 rounded-full'
          }`}
          style={{ 
            left: `calc(50% + ${x}px - ${isSelected ? 16 : isEmphasized ? 14 : 12}px)`, 
            top: `calc(50% + ${y}px - ${isSelected ? 16 : isEmphasized ? 14 : 12}px)`
          }}
        >
          {i.toString().padStart(2, '0')}
        </button>
      );
    }
    return numbers;
  };

  const getMinuteMarks = () => {
    const marks = [];
    for (let i = 0; i < 60; i += 5) {
      const angle = ((i * 6) - 90) * (Math.PI / 180);
      const radius = 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const isSelected = mode === 'minute' && Math.floor(minutes / 5) * 5 === i;
      
      marks.push(
        <button
          key={i}
          onClick={() => {
            setMinutes(i);
          }}
          className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${
            isSelected 
              ? 'bg-violet-600 text-white shadow-lg scale-110' 
              : 'bg-slate-100 text-slate-600 hover:bg-violet-100'
          }`}
          style={{ 
            left: `calc(50% + ${x}px - 16px)`, 
            top: `calc(50% + ${y}px - 16px)` 
          }}
        >
          {i.toString().padStart(2, '0')}
        </button>
      );
    }
    return marks;
  };

  const getHandRotation = () => {
    if (mode === 'hour') {
      return hours * 15;
    }
    return minutes * 6;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('hour')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'hour' 
                ? 'bg-violet-100 text-violet-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Heures
          </button>
          <button
            onClick={() => setMode('minute')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'minute' 
                ? 'bg-violet-100 text-violet-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Minutes
          </button>
        </div>

        {/* Digital Display */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-6 py-3">
            <button 
              onClick={() => setMode('hour')}
              className={`text-3xl font-bold transition-colors ${mode === 'hour' ? 'text-violet-600' : 'text-slate-400'}`}
            >
              {hours.toString().padStart(2, '0')}
            </button>
            <span className="text-2xl text-slate-400">:</span>
            <button 
              onClick={() => setMode('minute')}
              className={`text-3xl font-bold transition-colors ${mode === 'minute' ? 'text-violet-600' : 'text-slate-400'}`}
            >
              {minutes.toString().padStart(2, '0')}
            </button>
          </div>
        </div>

        {/* Analog Clock */}
        <div className="relative mx-auto mb-4" style={{ width: 200, height: 200 }}>
          <div className="absolute inset-0 rounded-full bg-slate-50 border-2 border-slate-100" />
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-violet-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20" />
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 bg-violet-600 origin-bottom rounded-full z-10"
            style={{ 
              height: mode === 'hour' ? '50px' : '70px',
              transform: `translate(-50%, -100%) rotate(${getHandRotation()}deg)`
            }}
          />
          {mode === 'hour' ? getClockNumbers() : getMinuteMarks()}
        </div>

        {/* Footer */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-1"
          >
            <Check size={16} />
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;
