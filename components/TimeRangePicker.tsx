import React, { useState, useRef, useEffect } from 'react';
import { Clock, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeRangePickerProps {
  valueStart: string;
  valueEnd: string;
  onChangeStart: (val: string) => void;
  onChangeEnd: (val: string) => void;
  className?: string;
}

interface ClockPickerProps {
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
  cancelLabel?: string;
  minTime?: string; // Format HH:MM
}

const ClockPicker: React.FC<ClockPickerProps> = ({ value, onChange, onConfirm, onCancel, title, subtitle, cancelLabel, minTime }) => {
  const [hours, setHours] = useState(parseInt(value?.split(':')[0]) || 0);
  const [minutes, setMinutes] = useState(parseInt(value?.split(':')[1]) || 0);
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [isPM, setIsPM] = useState((parseInt(value?.split(':')[0]) || 0) >= 12);

  // Parse minTime for validation
  const minHours = minTime ? parseInt(minTime.split(':')[0]) : 0;
  const minMinutes = minTime ? parseInt(minTime.split(':')[1]) : 0;
  const hasMinTime = !!minTime;

  // Convert display hours (12h format)
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  // Check if an hour is disabled
  const isHourDisabled = (h: number) => {
    if (!hasMinTime) return false;
    return h < minHours;
  };

  // Check if a minute is disabled for current hour
  const isMinuteDisabled = (m: number) => {
    if (!hasMinTime) return false;
    if (hours > minHours) return false;
    if (hours < minHours) return true;
    return m < minMinutes;
  };

  useEffect(() => {
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(formatted);
  }, [hours, minutes, onChange]);

  const getClockNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = ((i * 30) - 90) * (Math.PI / 180);
      const radius = 85;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const isSelected = mode === 'hour' && displayHours === i;
      
      // Display label: 13-23 in PM mode, 1-12 in AM mode
      let displayLabel = i.toString();
      if (isPM) {
        displayLabel = i === 12 ? '12' : (i + 12).toString();
      }
      
      numbers.push(
        <button
          key={i}
          onClick={() => {
            // Convert 12h to 24h based on AM/PM
            let newHour = i === 12 ? 0 : i;
            if (isPM && newHour !== 12) newHour += 12;
            if (!isPM && newHour === 12) newHour = 0;
            setHours(newHour);
            setMode('minute');
          }}
          className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            isSelected 
              ? 'bg-[#1F4597] text-white shadow-lg scale-110' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
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
            onConfirm();
          }}
          disabled={disabled}
          className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${
            disabled
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : isSelected 
                ? 'bg-[#1F4597] text-white shadow-lg scale-110' 
                : 'bg-white text-slate-500 hover:bg-slate-100'
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

  return (
    <div className="w-[280px]">
      {/* Header - only show if title provided */}
      {title && (
        <div className="text-center mb-3">
          {subtitle && <p className="text-[10px] text-slate-400 uppercase tracking-wider">{subtitle}</p>}
          <p className="text-base font-bold text-slate-800">{title}</p>
        </div>
      )}

      {/* Digital Display */}
      <div className="flex justify-center mb-3">
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-4 py-2">
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
          onClick={() => setIsPM(false)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            !isPM ? 'bg-[#1F4597] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Matin (AM)
        </button>
        <button
          onClick={() => setIsPM(true)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            isPM ? 'bg-[#1F4597] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Après-midi (PM)
        </button>
      </div>

      {/* Analog Clock */}
      <div className="relative mx-auto mb-4" style={{ width: 220, height: 220 }}>
        <div className="absolute inset-0 rounded-full bg-slate-50 border-2 border-slate-100" />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#1F4597] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20" />
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 bg-[#1F4597] origin-bottom rounded-full z-10"
          style={{ 
            height: mode === 'hour' ? '60px' : '75px',
            transform: `translate(-50%, -100%) rotate(${getHandRotation()}deg)`
          }}
        />
        {mode === 'hour' ? getClockNumbers() : getMinuteMarks()}
      </div>

      {/* Footer */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
        >
          {cancelLabel || 'Annuler'}
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-lg bg-[#1F4597] text-white text-sm font-medium hover:bg-[#1F4597] flex items-center justify-center gap-1"
        >
          <Check size={14} />
          Valider
        </button>
      </div>
    </div>
  );
};

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  valueStart,
  valueEnd,
  onChangeStart,
  onChangeEnd,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'start' | 'end'>('start');
  const [tempStart, setTempStart] = useState(valueStart || '08:00');
  const [tempEnd, setTempEnd] = useState(valueEnd || '18:00');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setStep('start');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartConfirm = () => {
    setStep('end');
  };

  const handleEndConfirm = () => {
    onChangeStart(tempStart);
    onChangeEnd(tempEnd);
    setIsOpen(false);
    setStep('start');
  };

  const handleCancel = () => {
    setIsOpen(false);
    setStep('start');
    setTempStart(valueStart || '08:00');
    setTempEnd(valueEnd || '18:00');
  };

  const handleBack = () => {
    setStep('start');
  };

  const clearRange = () => {
    onChangeStart('');
    onChangeEnd('');
  };

  const hasValue = valueStart && valueEnd;
  const displayText = hasValue ? `${valueStart} → ${valueEnd}` : 'Toute la journée';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button - using div to allow nested clickable elements */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setStep('start');
        }}
        className={`
          flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all h-[42px] w-full justify-between cursor-pointer
          ${hasValue 
            ? 'bg-[#1F4597]/10 border-[#5087FF]/30 text-[#1F4597]' 
            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-[#1F4597]'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="text-sm font-medium">{displayText}</span>
        </div>
        {hasValue && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              clearRange();
            }}
            className="p-0.5 hover:bg-[#1F4597]/20 rounded-full cursor-pointer"
          >
            <X size={14} />
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-slate-200 p-4"
          style={{
            left: Math.max(16, (containerRef.current?.getBoundingClientRect().left || 0)),
            top: (containerRef.current?.getBoundingClientRect().bottom || 0) + 8,
            width: 312
          }}
        >
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className={`flex items-center gap-1 ${step === 'start' ? 'text-[#1F4597]' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'start' ? 'bg-[#1F4597] text-white' : 'bg-slate-200'}`}>
                1
              </div>
              <span className="text-xs font-medium">Début</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
            <div className={`flex items-center gap-1 ${step === 'end' ? 'text-[#1F4597]' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'end' ? 'bg-[#1F4597] text-white' : 'bg-slate-200'}`}>
                2
              </div>
              <span className="text-xs font-medium">Fin</span>
            </div>
          </div>

          {/* Clock Animation Container */}
          <div className="relative overflow-hidden" style={{ height: 380 }}>
            <AnimatePresence mode="wait">
              {step === 'start' ? (
                <motion.div
                  key="start"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ClockPicker
                    value={tempStart}
                    onChange={setTempStart}
                    onConfirm={handleStartConfirm}
                    onCancel={handleCancel}
                    subtitle="Étape 1/2"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="end"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-[280px]">
                    <ClockPicker
                      value={tempEnd}
                      onChange={setTempEnd}
                      onConfirm={handleEndConfirm}
                      onCancel={handleBack}
                      cancelLabel="Retour"
                      minTime={tempStart}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangePicker;
