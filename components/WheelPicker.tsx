import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface WheelPickerProps {
  items: string[];
  value: number;
  onChange: (index: number) => void;
  label?: string;
  className?: string;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  value,
  onChange,
  label,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Handle mouse wheel - only when hovered
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isHovered) return;
    e.preventDefault();
    e.stopPropagation();
    
    if (items.length === 0) return;
    
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(items.length - 1, value + delta));
    if (newIndex !== value) {
      onChange(newIndex);
    }
  }, [isHovered, items.length, value, onChange]);

  // Handle keyboard - only when hovered
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isHovered) return;
    if (items.length === 0) return;
    
    let newIndex = value;
    if (e.key === 'ArrowUp') {
      newIndex = Math.max(0, value - 1);
    } else if (e.key === 'ArrowDown') {
      newIndex = Math.min(items.length - 1, value + 1);
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = items.length - 1;
    }
    
    if (newIndex !== value) {
      e.preventDefault();
      onChange(newIndex);
    }
  }, [isHovered, items.length, value, onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add non-passive wheel listener
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  // Get visible items (current, prev, next)
  const getVisibleItems = () => {
    const prev = value > 0 ? items[value - 1] : null;
    const current = items[value] || '';
    const next = value < items.length - 1 ? items[value + 1] : null;
    return { prev, current, next };
  };

  const { prev, current, next } = getVisibleItems();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && (
        <span className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-36 h-36 bg-white rounded-2xl 
          border-2 border-slate-200 
          flex flex-col items-center justify-center
          cursor-pointer overflow-hidden
          transition-all duration-200
          ${isHovered ? 'border-[#1F4597] shadow-lg shadow-[#1F4597]/20' : ''}
        `}
      >
        {/* Center highlight zone */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gradient-to-r from-transparent via-[#5087FF]/5 to-transparent pointer-events-none" />
        
        {/* Container for items */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Prev item */}
          <div className="h-10 flex items-center justify-center overflow-hidden px-2">
            {prev ? (
              <motion.span
                key={`prev-${value}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.35, y: 0 }}
                className="text-sm font-medium text-slate-400 text-center whitespace-nowrap"
              >
                {prev}
              </motion.span>
            ) : (
              <span className="h-full" />
            )}
          </div>

          {/* Current item */}
          <div className="h-16 flex items-center justify-center overflow-visible z-10 px-2">
            <motion.span
              key={`current-${value}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="text-lg font-bold text-[#1F4597] text-center leading-tight whitespace-nowrap"
            >
              {current}
            </motion.span>
          </div>

          {/* Next item */}
          <div className="h-10 flex items-center justify-center overflow-hidden px-2">
            {next ? (
              <motion.span
                key={`next-${value}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.35, y: 0 }}
                className="text-sm font-medium text-slate-400 text-center whitespace-nowrap"
              >
                {next}
              </motion.span>
            ) : (
              <span className="h-full" />
            )}
          </div>
        </div>
        
        {/* Hover hint */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-2 text-[10px] text-[#1F4597]/70 font-medium"
          >
            Molette ↑↓
          </motion.div>
        )}
      </div>
      
      {/* Navigation arrows */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xs text-slate-500 min-w-[3rem] text-center">
          {value + 1} / {items.length}
        </span>
        <button
          onClick={() => onChange(Math.min(items.length - 1, value + 1))}
          disabled={value === items.length - 1}
          className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WheelPicker;
