import React, { useState, useEffect, useRef } from 'react';

interface FrenchTimePickerProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
}

export const FrenchTimePicker: React.FC<FrenchTimePickerProps> = ({ value, onChange, className }) => {
    // Ensure value is HH:MM
    const safeValue = value && value.includes(':') ? value : '00:00';
    const [h, m] = safeValue.split(':');
    
    const [hourInput, setHourInput] = useState(h);
    const [minuteInput, setMinuteInput] = useState(m);
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);

    // Update local state when prop changes
    useEffect(() => {
        if (value && value.includes(':')) {
            const [newH, newM] = value.split(':');
            setHourInput(newH);
            setMinuteInput(newM);
        }
    }, [value]);

    // Select all text on focus
    const handleHourFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handleMinuteFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    // Format hour input
    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        
        if (val.length > 2) {
            val = val.slice(0, 2);
        }
        
        setHourInput(val);
        
        // Auto-update if valid
        if (val.length === 2) {
            const hour = parseInt(val);
            if (hour >= 0 && hour <= 23) {
                onChange(`${val.padStart(2, '0')}:${minuteInput.padStart(2, '0')}`);
                // Move focus to minutes
                minuteRef.current?.focus();
            }
        }
    };

    // Format minute input
    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        
        if (val.length > 2) {
            val = val.slice(0, 2);
        }
        
        setMinuteInput(val);
        
        // Auto-update if valid
        if (val.length === 2) {
            const minute = parseInt(val);
            if (minute >= 0 && minute <= 59) {
                onChange(`${hourInput.padStart(2, '0')}:${val.padStart(2, '0')}`);
            }
        }
    };

    // Handle blur - format and validate
    const handleHourBlur = () => {
        let hour = parseInt(hourInput) || 0;
        hour = Math.max(0, Math.min(23, hour));
        const formatted = hour.toString().padStart(2, '0');
        setHourInput(formatted);
        onChange(`${formatted}:${minuteInput.padStart(2, '0')}`);
    };

    const handleMinuteBlur = () => {
        let minute = parseInt(minuteInput) || 0;
        minute = Math.max(0, Math.min(59, minute));
        const formatted = minute.toString().padStart(2, '0');
        setMinuteInput(formatted);
        onChange(`${hourInput.padStart(2, '0')}:${formatted}`);
    };

    // Handle key down for navigation
    const handleHourKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight' && hourInput.length === 2) {
            e.preventDefault();
            minuteRef.current?.focus();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newHour = (parseInt(hourInput) + 1) % 24;
            const formatted = newHour.toString().padStart(2, '0');
            setHourInput(formatted);
            onChange(`${formatted}:${minuteInput}`);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newHour = (parseInt(hourInput) - 1 + 24) % 24;
            const formatted = newHour.toString().padStart(2, '0');
            setHourInput(formatted);
            onChange(`${formatted}:${minuteInput}`);
        }
    };

    const handleMinuteKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft' && minuteRef.current?.selectionStart === 0) {
            e.preventDefault();
            hourRef.current?.focus();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newMin = (parseInt(minuteInput) + 1) % 60;
            const formatted = newMin.toString().padStart(2, '0');
            setMinuteInput(formatted);
            onChange(`${hourInput}:${formatted}`);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newMin = (parseInt(minuteInput) - 1 + 60) % 60;
            const formatted = newMin.toString().padStart(2, '0');
            setMinuteInput(formatted);
            onChange(`${hourInput}:${formatted}`);
        }
    };

    return (
        <div className={`flex items-center gap-1 text-slate-700 ${className || ''}`}>
            <input
                ref={hourRef}
                type="text"
                inputMode="numeric"
                value={hourInput}
                onChange={handleHourChange}
                onBlur={handleHourBlur}
                onKeyDown={handleHourKeyDown}
                onFocus={handleHourFocus}
                maxLength={2}
                className="w-11 bg-white border border-slate-200 rounded-lg px-1 py-1.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[blue-600] focus:border-transparent hover:border-blue-600 transition-colors"
                placeholder="00"
            />
            <span className="text-slate-400 text-sm font-sans select-none">h</span>
            <input
                ref={minuteRef}
                type="text"
                inputMode="numeric"
                value={minuteInput}
                onChange={handleMinuteChange}
                onBlur={handleMinuteBlur}
                onKeyDown={handleMinuteKeyDown}
                onFocus={handleMinuteFocus}
                maxLength={2}
                className="w-11 bg-white border border-slate-200 rounded-lg px-1 py-1.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[blue-600] focus:border-transparent hover:border-blue-600 transition-colors"
                placeholder="00"
            />
        </div>
    );
};
