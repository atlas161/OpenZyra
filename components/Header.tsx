import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Settings, HelpCircle, Menu, Download } from 'lucide-react';
import { ProjectConfig } from '../types';
import { ExportModal } from './ExportModal';

interface HeaderProps {
  telephonyGroups: string[];
  projectConfig: ProjectConfig | null;
  setShowConfig: (show: boolean) => void;
  handleExportCSV: () => void;
  handleDownloadPDF: () => void;
  handleExportZip: () => void;
  handleExportJSON: () => void;
  isPdfGenerating: boolean;
  isZipGenerating?: boolean;
  isCsvGenerating?: boolean;
  isJsonGenerating?: boolean;
  onOpenDocs: () => void;
  onMenuClick: () => void;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  telephonyGroups,
  projectConfig,
  setShowConfig,
  handleExportCSV,
  handleDownloadPDF,
  handleExportZip,
  handleExportJSON,
  isPdfGenerating,
  isZipGenerating,
  isCsvGenerating,
  isJsonGenerating,
  onOpenDocs,
  onMenuClick,
  onReset
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  
  const configuredLinesCount = projectConfig 
    ? Object.keys(projectConfig.lines).length 
    : 0;

  return (
    <>
    <header className="bg-white shadow-sm border-b px-3 md:px-6 py-3 md:py-4 flex items-center justify-between z-50 sticky top-0">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={22} />
        </button>
        <motion.button 
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
          title="Retour à l'accueil"
        >
          <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="154" height="32" className="h-8 md:h-10 w-auto" />
        </motion.button>
      </div>
      
      <div className="flex items-center gap-1 md:gap-6">
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 border-r pr-6">
          <div className="flex items-center gap-2" title="Groupes de Téléphonie détectés">
            <Hash size={16} className="text-gray-400" />
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{telephonyGroups.length > 0 ? telephonyGroups.join(', ') : 'Aucun'}</span>
          </div>
        </div>
        
        <div className="flex gap-1 md:gap-2">
            <button 
              onClick={() => setShowConfig(true)}
              className="p-2 md:p-2.5 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-sm"
              title="Modifier la configuration du groupe"
            >
              <Settings size={16} className="md:w-[18px] md:h-[18px]" />
            </button>

            <button
              onClick={onOpenDocs}
              className="p-2 md:p-2.5 text-[#1F4597] bg-[#5087FF]/10 border-[#5087FF]/30 hover:bg-[#5087FF]/20 rounded-lg hover:text-[#1F4597] transition shadow-sm"
              title="Guide d'Utilisation"
            >
              <HelpCircle size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 md:p-2.5 text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg hover:bg-emerald-200 transition shadow-sm disabled:opacity-70"
              title="Exporter..."
              disabled={isPdfGenerating || isZipGenerating || isCsvGenerating || isJsonGenerating}
            >
              <Download size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
        </div>
      </div>
    </header>

    <ExportModal
      isOpen={showExportModal}
      onClose={() => setShowExportModal(false)}
      onExportCSV={handleExportCSV}
      onExportPDF={handleDownloadPDF}
      onExportZip={handleExportZip}
      onExportJSON={handleExportJSON}
      isPdfGenerating={isPdfGenerating}
      isZipGenerating={isZipGenerating}
      isCsvGenerating={isCsvGenerating}
      isJsonGenerating={isJsonGenerating}
      hasConfig={!!projectConfig}
    />
    </>
  );
};
