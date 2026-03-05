import React from 'react';
import { Loader2, FileDown } from 'lucide-react';

interface ExportProgressProps {
  type: 'pdf' | 'zip' | 'csv' | 'json' | null;
  isGenerating: boolean;
}

export const ExportProgress: React.FC<ExportProgressProps> = ({ type, isGenerating }) => {
  if (!isGenerating || !type) return null;

  const getMessage = () => {
    switch (type) {
      case 'pdf':
        return 'Génération du rapport PDF en cours...';
      case 'zip':
        return 'Création du fichier ZIP en cours...';
      case 'csv':
        return 'Export des données CSV en cours...';
      case 'json':
        return 'Export de la configuration en cours...';
      default:
        return 'Export en cours...';
    }
  };

  const getFileTypeLabel = () => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'zip':
        return 'ZIP';
      case 'csv':
        return 'CSV';
      case 'json':
        return 'JSON';
      default:
        return 'Fichier';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-xl shadow-lg border border-[#1F4597]/20 p-4 flex items-center gap-4 min-w-[300px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-[#1F4597]/10 flex items-center justify-center">
            <FileDown size={24} className="text-[#1F4597]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1F4597] rounded-full flex items-center justify-center">
            <Loader2 size={14} className="text-white animate-spin" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm">
            Export {getFileTypeLabel()}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            {getMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};
