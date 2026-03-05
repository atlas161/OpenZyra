import React from 'react';
import { Loader2, FileSpreadsheet, BarChart3, CheckCircle2 } from 'lucide-react';

export const AnalysisLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[70] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-ping opacity-20"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-blue-600/20">
            <Loader2 size={48} className="text-blue-600 animate-spin" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyse en cours...</h2>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        Nous traitons vos fichiers pour générer vos statistiques. <br/>
        Cela ne prendra que quelques instants.
      </p>

      <div className="flex gap-8 text-sm text-slate-400">
        <div className="flex items-center gap-2 animate-pulse delay-75">
            <FileSpreadsheet size={16} />
            <span>Lecture CSV</span>
        </div>
        <div className="flex items-center gap-2 animate-pulse delay-150">
            <CheckCircle2 size={16} />
            <span>Consolidation</span>
        </div>
        <div className="flex items-center gap-2 animate-pulse delay-300">
            <BarChart3 size={16} />
            <span>Génération graphiques</span>
        </div>
      </div>
    </div>
  );
};
