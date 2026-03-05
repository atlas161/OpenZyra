import React, { useRef, useEffect } from 'react';
import { Plus, Play, X, FileSpreadsheet, FileJson } from 'lucide-react';

interface UploadModalProps {
  files: File[];
  onAddFiles: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
  onAnalyze: () => void;
  onCancel: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ 
  files, 
  onAddFiles, 
  onRemoveFile, 
  onAnalyze, 
  onCancel 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files.length === 0) {
      onCancel();
    }
  }, [files, onCancel]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const formattedSize = (totalSize / 1024).toFixed(1) + ' KB';

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.json')) {
      return <FileJson size={20} />;
    }
    return <FileSpreadsheet size={20} />;
  };

  return (
    <div 
      className='fixed inset-0 z-[9999] flex items-center justify-center p-4'
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onCancel}
    >
      <div 
        className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#5087FF]/30'
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0'>
          <div>
            <h3 className='text-base md:text-lg font-bold text-slate-800'>Fichiers selectionnes</h3>
            <p className='text-xs text-slate-500'>{files.length} fichier(s) • {formattedSize}</p>
          </div>
          <button onClick={onCancel} className='text-slate-400 hover:text-[#1F4597] transition-colors p-1'>
            <X size={18} className='md:w-5 md:h-5' />
          </button>
        </div>

        <div className='p-3 md:p-6 overflow-y-auto space-y-2 md:space-y-3 flex-1' style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {files.map((file, index) => {
            const isJson = file.name.toLowerCase().endsWith('.json');
            return (
              <div key={file.name + '-' + index} className={'flex items-center justify-between p-2.5 md:p-3 bg-white border border-[#5087FF]/30 rounded-xl shadow-sm group transition-all ' + (isJson ? 'hover:border-t-[#1F4597]' : 'hover:border-[#5087FF]/30')}>
                <div className='flex items-center gap-2 md:gap-3 overflow-hidden'>
                  <div className={'w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ' + (isJson ? 'bg-amber-50 text-amber-600' : 'bg-[#5087FF]/10 text-[#1F4597]')}>
                    {getFileIcon(file.name)}
                  </div>
                  <div className='flex flex-col overflow-hidden'>
                    <span className='text-sm font-medium text-slate-700 truncate max-w-[150px] md:max-w-[250px]' title={file.name}>{file.name}</span>
                    <span className='text-[10px] text-slate-400'>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveFile(index)}
                  className='p-1.5 md:p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 shrink-0'
                  title='Retirer'
                >
                  <X size={14} className='md:w-4 md:h-4' />
                </button>
              </div>
            );
          })}
        </div>

        <div className='p-3 md:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-2 md:gap-3 shrink-0'>
          <input 
            type='file' 
            ref={fileInputRef}
            className='hidden' 
            accept='.csv,.json' 
            multiple 
            onChange={handleFileChange} 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className='flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm md:text-base'
          >
            <Plus size={16} className='md:w-[18px] md:h-[18px]' />
            Ajouter
          </button>
          
          <button 
            onClick={onAnalyze}
            className='flex-[2] flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-[#1F4597] text-white font-semibold rounded-xl hover:bg-[#152d6e] transition-all shadow-lg shadow-[#5087FF]/20 text-sm md:text-base'
          >
            <Play size={16} className='md:w-[18px] md:h-[18px]' fill='currentColor' />
            Analyser
          </button>
        </div>
      </div>
    </div>
  );
};
