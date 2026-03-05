import React from 'react';
import { motion } from 'framer-motion';
import { FileText, RefreshCw, Users, CheckCircle2, Smartphone, Phone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange, ProjectConfig } from '../types';
import { DateRangePicker } from './DateRangePicker';

interface SidebarProps {
  allRawRecordsCount: number;
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  projectConfig: ProjectConfig | null;
  setShowConfig: (show: boolean) => void;
  handleReset: () => void;
  minDate?: string;
  maxDate?: string;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  allRawRecordsCount,
  dateRange,
  setDateRange,
  projectConfig,
  setShowConfig,
  handleReset,
  minDate,
  maxDate,
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const configuredLinesCount = projectConfig ? Object.keys(projectConfig.lines).length : 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar with smooth width animation */}
      <motion.aside
        layout
        initial={false}
        animate={{ 
          width: isCollapsed ? 48 : 320,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 35,
          mass: 0.8
        }}
        className={`
          fixed md:static inset-y-0 left-0 z-40
          bg-white border-r border-slate-200
          shadow-xl md:shadow-none flex-shrink-0 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {isCollapsed ? (
          /* Collapsed View */
          <div className="hidden md:flex flex-col items-center py-3 h-full">
            <motion.button
              layout
              onClick={onToggleCollapse}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors mb-3"
              title="Développer le panneau"
            >
              <motion.div
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={20} />
              </motion.div>
            </motion.button>
            
            <div className="w-6 h-px bg-slate-200 mb-3" />
            
            <motion.button
              layout
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-2"
              title="Réinitialiser"
            >
              <RefreshCw size={18} />
            </motion.button>
            
            <motion.button
              layout
              onClick={() => setShowConfig(true)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors"
              title={`Configurer les lignes (${configuredLinesCount})`}
            >
              <Users size={18} />
            </motion.button>
          </div>
        ) : (
          /* Expanded View */
          <motion.div 
            layout
            className="flex flex-col h-full p-4 md:pt-3 md:pb-6 md:px-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4 md:mb-3">
              <h2 className="text-lg font-bold text-slate-800 md:hidden">Menu</h2>
              <button 
                onClick={onClose}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <motion.div layout>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Fichiers sources</h3>
                  <motion.button
                    layout
                    onClick={onToggleCollapse}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden md:flex p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors"
                    title="Réduire le panneau"
                  >
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronLeft size={20} />
                    </motion.div>
                  </motion.button>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText size={18} className="text-gray-500" />
                  <div className="flex flex-col overflow-hidden flex-1">
                    <span className="text-sm text-gray-700 font-medium truncate">
                      {allRawRecordsCount} lignes brutes
                    </span>
                    <span className="text-xs text-gray-400">Importées depuis CSV</span>
                  </div>
                  <motion.button 
                    onClick={handleReset} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition" 
                    title="Réinitialiser"
                  >
                    <RefreshCw size={14} />
                  </motion.button>
                </div>
              </motion.div>

              <motion.div layout>
                <DateRangePicker 
                  dateRange={dateRange} 
                  onChange={setDateRange}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </motion.div>

              <motion.div layout className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Groupe d'appel ({configuredLinesCount})
                  </h3>
                  <button 
                    onClick={() => setShowConfig(true)} 
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Modifier
                  </button>
                </div>

                {/* Section NDI */}
                {projectConfig && Object.values(projectConfig.lines).filter((l: any) => l.type === 'NDI').length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={14} className="text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">Lignes NDI</span>
                      <span className="text-[10px] bg-blue-600/10 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                        {Object.values(projectConfig.lines).filter((l: any) => l.type === 'NDI').length}
                      </span>
                    </div>
                    <div className="space-y-1 border rounded-lg p-2 bg-blue-600/5 border-blue-600/10">
                      {Object.values(projectConfig.lines)
                        .filter((l: any) => l.type === 'NDI')
                        .map((line: any) => (
                          <div key={line.number} className="flex items-center gap-2 p-1.5 rounded text-sm">
                            <Phone size={14} className="text-blue-600 shrink-0" />
                            <span className="text-gray-700 text-xs truncate">{line.name ? `${line.name} (${line.number})` : line.number}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Section SIP */}
                {projectConfig && Object.values(projectConfig.lines).filter((l: any) => l.type === 'SIP').length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone size={14} className="text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-600">Lignes SIP</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                        {Object.values(projectConfig.lines).filter((l: any) => l.type === 'SIP').length}
                      </span>
                    </div>
                    <div className="space-y-1 border rounded-lg p-2 bg-emerald-50 border-emerald-200">
                      {Object.values(projectConfig.lines)
                        .filter((l: any) => l.type === 'SIP')
                        .map((line: any) => (
                          <div key={line.number} className="flex items-center gap-2 p-1.5 rounded text-sm">
                            <Smartphone size={14} className="text-emerald-600 shrink-0" />
                            <span className="text-gray-700 text-xs truncate">{line.name ? `${line.name} (${line.number})` : line.number}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Section Autres */}
                {projectConfig && Object.values(projectConfig.lines).filter((l: any) => l.type !== 'SIP' && l.type !== 'NDI').length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={14} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-500">Autres lignes</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                        {Object.values(projectConfig.lines).filter((l: any) => l.type !== 'SIP' && l.type !== 'NDI').length}
                      </span>
                    </div>
                    <div className="space-y-1 border rounded-lg p-2 bg-gray-50 border-gray-200">
                      {Object.values(projectConfig.lines)
                        .filter((l: any) => l.type !== 'SIP' && l.type !== 'NDI')
                        .map((line: any) => (
                          <div key={line.number} className="flex items-center gap-2 p-1.5 rounded text-sm">
                            <CheckCircle2 size={14} className="text-gray-500 shrink-0" />
                            <span className="text-gray-700 text-xs truncate">{line.name ? `${line.name} (${line.number})` : line.number}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium ml-auto">
                              {line.type || '?'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {configuredLinesCount === 0 && (
                  <div className="text-xs text-center text-gray-500 italic p-2">
                    Aucune ligne configurée
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Seuls les appels arrivant sur ces lignes sont analysés. Si un appel est décroché par l'une d'elles, il est considéré comme répondu.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
};
