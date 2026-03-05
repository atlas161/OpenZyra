import React, { useState, useEffect } from 'react';
import { X, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleTimePickerProps {
  isOpen: boolean;
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
  title?: string;
  minTime?: string; // Format HH:MM - pour la validation (heure de fin doit être après heure de début)
}

/**
 * ScheduleTimePicker - Sélecteur d'heure amélioré pour les horaires d'ouverture
 * 
 * Inspiré du ClockPicker dans TimeRangePicker.tsx
 * Utilise un format 12h avec AM/PM plutôt que 24h pour une meilleure UX
 */
export const ScheduleTimePicker: React.FC<ScheduleTimePickerProps> = ({
  isOpen,
  value,
  onChange,
  onClose,
  title = "Sélectionner l'heure",
  minTime
}) => {
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [isPM, setIsPM] = useState(false);

  // Parse minTime pour validation
  const minHours = minTime ? parseInt(minTime.split(':')[0]) : -1;
  const minMinutes = minTime ? parseInt(minTime.split(':')[1]) : -1;
  const hasMinTime = !!minTime;

  // Convertir heure d'affichage (format 12h)
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  // Vérifier si une heure est désactivée
  const isHourDisabled = (h: number, pm: boolean) => {
    if (!hasMinTime) return false;
    let hour24 = h === 12 ? 0 : h;
    if (pm && hour24 !== 0) hour24 += 12;
    if (!pm && hour24 === 0) hour24 = 12;
    return hour24 < minHours;
  };

  // Vérifier si une minute est désactivée pour l'heure courante
  const isMinuteDisabled = (m: number) => {
    if (!hasMinTime) return false;
    if (hours > minHours) return false;
    if (hours < minHours) return true;
    return m < minMinutes;
  };

  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':').map(Number);
      setHours(h || 0);
      setMinutes(m || 0);
      setIsPM((h || 0) >= 12);
      setMode('hour');
    }
  }, [value, isOpen]);

  const handleConfirm = () => {
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(formatted);
    // Ne pas appeler onClose ici - le parent contrôle la fermeture via isOpen
  };

  const getClockNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = ((i * 30) - 90) * (Math.PI / 180);
      const radius = 85;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const isSelected = mode === 'hour' && displayHours === i;
      const disabled = isHourDisabled(i, isPM);
      
      // Label d'affichage: 13-23 en mode PM, 1-12 en mode AM
      let displayLabel = i.toString();
      if (isPM) {
        displayLabel = i === 12 ? '12' : (i + 12).toString();
      }
      
      numbers.push(
        <button
          key={i}
          onClick={() => {
            if (disabled) return;
            // Convertir 12h vers 24h selon AM/PM
            let newHour = i === 12 ? 0 : i;
            if (isPM && newHour !== 0) newHour += 12;
            if (!isPM && newHour === 0) newHour = 12;
            setHours(newHour);
            setMode('minute');
          }}
          disabled={disabled}
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            disabled
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : isSelected 
                ? 'bg-[#1F4597] text-white shadow-lg scale-110' 
                : 'bg-white text-slate-600 hover:bg-[#1F4597]/10'
          }`}
          style={{ 
            left: `calc(50% + ${x}px - 20px)`, 
            top: `calc(50% + ${y}px - 20px)` 
          }}
        >
          {displayLabel}
        </button>
      );
    }
    return numbers;
  };

  const getMinuteMarks = () => {
    const marks = [];
    for (let i = 0; i < 60; i += 5) {
      const angle = ((i * 6) - 90) * (Math.PI / 180);
      const radius = 85;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const isSelected = mode === 'minute' && Math.floor(minutes / 5) * 5 === i;
      const disabled = isMinuteDisabled(i);
      
      marks.push(
        <button
          key={i}
          onClick={() => {
            if (disabled) return;
            setMinutes(i);
          }}
          disabled={disabled}
          className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${
            disabled
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : isSelected 
                ? 'bg-[#1F4597] text-white shadow-lg scale-110' 
                : 'bg-white text-slate-500 hover:bg-[#1F4597]/10'
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
      return (hours % 12) * 30 + (minutes / 60) * 30;
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
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl p-5 w-[320px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#1F4597]" />
            <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Digital Display */}
        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-1 bg-[#1F4597]/5 rounded-xl px-4 py-2 border border-[#1F4597]/10">
            <button 
              onClick={() => setMode('hour')}
              className={`text-2xl font-bold transition-colors ${mode === 'hour' ? 'text-[#1F4597]' : 'text-slate-400'}`}
            >
              {displayHours.toString().padStart(2, '0')}
            </button>
            <span className="text-xl text-slate-400">:</span>
            <button 
              onClick={() => setMode('minute')}
              className={`text-2xl font-bold transition-colors ${mode === 'minute' ? 'text-[#1F4597]' : 'text-slate-400'}`}
            >
              {minutes.toString().padStart(2, '0')}
            </button>
            <span className="text-sm font-medium text-slate-500 ml-1">
              {isPM ? 'PM' : 'AM'}
            </span>
          </div>
        </div>

        {/* AM/PM Toggle */}
        <div className="flex justify-center gap-2 mb-3">
          <button
            onClick={() => {
              setIsPM(false);
              // Convertir l'heure en AM si nécessaire
              if (hours >= 12) setHours(hours - 12);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              !isPM ? 'bg-[#1F4597] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Matin
          </button>
          <button
            onClick={() => {
              setIsPM(true);
              // Convertir l'heure en PM si nécessaire
              if (hours < 12) setHours(hours + 12);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              isPM ? 'bg-[#1F4597] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Après-midi
          </button>
        </div>

        {/* Mode Indicator */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode('hour')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'hour' 
                ? 'bg-[#1F4597]/10 text-[#1F4597]' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Heure
          </button>
          <button
            onClick={() => setMode('minute')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'minute' 
                ? 'bg-[#1F4597]/10 text-[#1F4597]' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Minute
          </button>
        </div>

        {/* Analog Clock */}
        <div className="relative mx-auto mb-4" style={{ width: 220, height: 220 }}>
          <div className="absolute inset-0 rounded-full bg-slate-50 border-2 border-slate-100" />
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#1F4597] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20" />
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 bg-[#1F4597] origin-bottom rounded-full z-10 transition-transform duration-200"
            style={{ 
              height: mode === 'hour' ? '60px' : '75px',
              transform: `translate(-50%, -100%) rotate(${getHandRotation()}deg)`
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              {mode === 'hour' ? getClockNumbers() : getMinuteMarks()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick minute buttons */}
        {mode === 'minute' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-1 mb-3 flex-wrap"
          >
            {[0, 15, 30, 45].map(m => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                disabled={isMinuteDisabled(m)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  minutes === m
                    ? 'bg-[#1F4597] text-white'
                    : isMinuteDisabled(m)
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-600 hover:bg-[#1F4597]/10'
                }`}
              >
                :{m.toString().padStart(2, '0')}
              </button>
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg bg-[#1F4597] text-white text-sm font-medium hover:bg-[#152d6e] transition-colors flex items-center justify-center gap-1"
          >
            <Check size={16} />
            Valider
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleTimePicker;
