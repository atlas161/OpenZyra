import React, { useState, useEffect } from 'react';
import { X, FileJson, Printer, Save, FileSpreadsheet, Loader2, Check, FileDown } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onExportZip: () => void;
  onExportJSON: () => void;
  isPdfGenerating: boolean;
  isZipGenerating?: boolean;
  isCsvGenerating?: boolean;
  isJsonGenerating?: boolean;
  hasConfig: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExportCSV,
  onExportPDF,
  onExportZip,
  onExportJSON,
  isPdfGenerating,
  isZipGenerating,
  isCsvGenerating,
  isJsonGenerating,
  hasConfig
}) => {
  const [selected, setSelected] = useState<string[]>(['zip']);
  const [hasExportStarted, setHasExportStarted] = useState(false);

  const isExporting = isPdfGenerating || isZipGenerating || isCsvGenerating || isJsonGenerating;

  useEffect(() => {
    if (isExporting) {
      setHasExportStarted(true);
    } else if (hasExportStarted && !isExporting) {
      // Export finished, close modal after a short delay
      const timer = setTimeout(() => {
        setHasExportStarted(false);
        onClose();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isExporting, hasExportStarted, onClose]);

  if (!isOpen) return null;

  const toggleOption = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleExport = () => {
    if (selected.includes('zip')) {
      onExportZip();
    } else {
      if (selected.includes('pdf')) onExportPDF();
      if (selected.includes('csv')) onExportCSV();
      if (selected.includes('json')) onExportJSON();
    }
    // Don't close immediately - let the useEffect handle it when export finishes
  };

  const getExportMessage = () => {
    if (isZipGenerating) return 'Création du fichier ZIP en cours...';
    if (isPdfGenerating) return 'Génération du PDF en cours...';
    if (isCsvGenerating) return 'Export des données CSV en cours...';
    if (isJsonGenerating) return 'Export de la configuration en cours...';
    return 'Export en cours...';
  };

  const canExport = selected.length > 0 && !isExporting;

  const exportOptions = [
    {
      id: 'zip',
      label: 'Projet complet (.zip)',
      description: 'Configuration + données + rapport PDF',
      icon: Save,
      disabled: false
    },
    {
      id: 'pdf',
      label: 'Rapport PDF',
      description: 'Rapport avec graphiques',
      icon: Printer,
      disabled: false
    },
    {
      id: 'csv',
      label: 'Données CSV',
      description: 'Données analysées',
      icon: FileSpreadsheet,
      disabled: false
    },
    {
      id: 'json',
      label: 'Configuration (.json)',
      description: 'Configuration seule',
      icon: FileJson,
      disabled: !hasConfig
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#5087FF]/30 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {isExporting && (
          <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6">
            <div className="w-20 h-20 rounded-2xl bg-[#1F4597]/10 flex items-center justify-center mb-4 animate-pulse">
              <FileDown size={40} className="text-[#1F4597]" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Loader2 size={24} className="text-[#1F4597] animate-spin" />
              <span className="text-lg font-semibold text-slate-800">Export en cours</span>
            </div>
            <p className="text-slate-500 text-center text-sm">
              {getExportMessage()}
            </p>
            <p className="text-slate-400 text-xs mt-4 text-center">
              Veuillez patienter, le fichier est en cours de génération...
            </p>
          </div>
        )}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">Exporter</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">Selectionnez le format d'export</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-[#1F4597] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-3 md:p-6 space-y-2 md:space-y-3">
          {exportOptions.map((option) => {
            const itemSelected = selected.includes(option.id);
            const Icon = option.icon;
            
            return (
              <label
                key={option.id}
                className={`
                  flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                  ${option.disabled 
                    ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50' 
                    : itemSelected
                      ? 'border-[#1F4597] bg-[#1F4597]/5 shadow-sm'
                      : 'border-slate-200 hover:border-[#5087FF]/50 hover:bg-slate-50'
                  }
                `}
              >
                <div 
                  className={`
                    flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-md border-2 transition-all duration-200 shrink-0
                    ${itemSelected 
                      ? 'bg-[#1F4597] border-[#1F4597]' 
                      : 'border-slate-300 group-hover:border-[#5087FF]'
                    }
                  `}
                >
                  {itemSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                
                <input
                  type="checkbox"
                  checked={itemSelected}
                  onChange={() => !option.disabled && toggleOption(option.id)}
                  disabled={option.disabled}
                  className="sr-only"
                />
                
                <div 
                  className={`
                    p-2 md:p-2.5 rounded-lg transition-all duration-200 shrink-0
                    ${itemSelected 
                      ? 'bg-[#1F4597] text-white shadow-md' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-[#5087FF]/10 group-hover:text-[#1F4597]'
                    }
                  `}
                >
                  <Icon size={18} className="md:w-5 md:h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm md:text-base transition-colors ${itemSelected ? 'text-[#1F4597]' : 'text-slate-700'}`}>
                    {option.label}
                  </div>
                  <div className={`text-xs md:text-sm transition-colors ${itemSelected ? 'text-[#1F4597]/70' : 'text-slate-500'}`}>
                    {option.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        <div className="p-3 md:p-6 border-t border-slate-100 bg-slate-50/50 flex gap-2 md:gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 md:py-3 px-4 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm md:text-base"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={!canExport}
            className={`
              flex-1 py-2.5 md:py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base
              ${canExport
                ? 'bg-[#1F4597] text-white hover:bg-[#152d6e] shadow-lg shadow-[#5087FF]/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {isExporting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Export...
              </span>
            ) : (
              'Exporter'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
