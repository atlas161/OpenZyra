import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Server, 
  FolderOpen, 
  RefreshCw, 
  Zap, 
  ArrowRight,
  HelpCircle,
  FileText,
  Scale
} from 'lucide-react';
import LegalPage from './LegalPage';

interface EmptyStateProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOVHSelect: () => void;
  onOVHUpdate?: () => void;
  onOpenDocs: () => void;
  error: string | null;
  isExiting?: boolean;
}

// Animated background component - Artistic mesh gradient with organic shapes
const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/60" />
      
      {/* Animated gradient orbs */}
      <div 
        className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-40 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(125,26,134,0.3) 0%, rgba(247,158,255,0.1) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      <div 
        className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(247,158,255,0.4) 0%, rgba(156,39,176,0.1) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'float 25s ease-in-out infinite reverse'
        }}
      />
      
      <div 
        className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(125,26,134,0.2) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'float 30s ease-in-out infinite 5s'
        }}
      />
      
      {/* Organic blob shapes */}
      <svg 
        className="absolute top-20 right-1/4 w-96 h-96 opacity-20"
        viewBox="0 0 200 200"
        style={{ animation: 'rotate 40s linear infinite' }}
      >
        <path
          fill="url(#blob-gradient-1)"
          d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,89.1,-2.9C88.1,12.2,83.4,26.9,74.8,39.4C66.2,51.9,53.7,62.2,40.1,69.1C26.5,76,11.8,79.5,-2.6,81.8C-17,84.1,-31.2,85.2,-44.3,79.8C-57.4,74.4,-69.4,62.5,-77.3,48.6C-85.2,34.7,-89,18.8,-88.1,3.2C-87.2,-12.4,-81.6,-27.7,-71.8,-40.1C-62,-52.5,-48,-62,-34.1,-69.6C-20.2,-77.2,-6.4,-82.9,7.8,-85.2C22,-87.5,36.5,-83.6,44.7,-76.4Z"
          transform="translate(100 100)"
        />
        <defs>
          <linearGradient id="blob-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="blue-600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="blue-300" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
      
      <svg 
        className="absolute bottom-32 left-20 w-80 h-80 opacity-15"
        viewBox="0 0 200 200"
        style={{ animation: 'rotate 35s linear infinite reverse' }}
      >
        <path
          fill="url(#blob-gradient-2)"
          d="M39.9,-65.7C52.8,-58.8,65.3,-50.1,73.5,-38.3C81.7,-26.5,85.6,-11.6,84.3,2.5C83,16.6,76.5,29.9,66.7,40.8C56.9,51.7,43.8,60.2,29.9,66.2C16,72.2,1.3,75.7,-13.4,74.6C-28.1,73.5,-42.8,67.8,-55.6,59.1C-68.4,50.4,-79.3,38.7,-84.2,24.4C-89.1,10.1,-88,-6.8,-82.3,-21.3C-76.6,-35.8,-66.3,-47.9,-53.6,-55.1C-40.9,-62.3,-25.8,-64.6,-11.2,-65.2C3.4,-65.8,17,-64.7,39.9,-65.7Z"
          transform="translate(100 100)"
        />
        <defs>
          <linearGradient id="blob-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="blue-600" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Wave pattern overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%237D1A86' fill-opacity='0.1' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          animation: 'wave 10s ease-in-out infinite'
        }}
      />
      
      {/* Subtle dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, blue-600 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Noise texture overlay for organic feel */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  handleFileUpload, 
  handleOVHSelect, 
  onOVHUpdate, 
  onOpenDocs,
  error, 
  isExiting 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  useEffect(() => {
    if (!isExiting) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isExiting]);

  if (showLegal) {
    return <LegalPage onBack={() => setShowLegal(false)} />;
  }

  return (
    <div className={`h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col font-sans relative transition-all duration-500 ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <AnimatedBackground />
      
      {/* Navbar */}
      <nav className={`w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto relative z-10
                      transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-3">
          <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1F4597] transition-colors"
          >
            <HelpCircle size={18} />
            <span className="hidden sm:inline">Documentation</span>
          </button>
          <span className="text-sm font-medium text-slate-400">v2.1</span>
        </div>
      </nav>

      {/* Main Content - Pushes footer below viewport */}
      <main className="flex-1 flex flex-col items-center px-4 pt-16 pb-8 w-full max-w-5xl mx-auto relative z-10">
        
        {/* Hero Section */}
        <div className={`text-center mb-10 transition-all duration-1000 delay-200
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Maîtrisez chaque
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5087FF]/30 to-[#1F4597]"> appel</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Analysez vos flux d'appels en toute simplicité. Données 100% locales.
          </p>
        </div>

        {/* Action Cards - Vertical Layout */}
        <div className={`w-full max-w-xl mx-auto flex flex-col gap-4 mb-8 transition-all duration-1000 delay-400
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* OVH Card - Prominent, main option */}
          <div className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-white/80 overflow-hidden
                          hover:shadow-xl hover:shadow-[#1F4597]/10 hover:border-[#5087FF]/30 
                          transition-all duration-300 ease-out">
            {/* Hover glow - smooth in and out */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5087FF]/5 via-[#1F4597]/5 to-[#5087FF]/5 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F4597]/10 to-[#5087FF]/10 
                              border border-[#5087FF]/20 flex items-center justify-center flex-shrink-0
                              group-hover:scale-105 transition-transform duration-300">
                  <Server size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Connexion OVH Directe</h3>
                  <p className="text-sm text-slate-500">Via API OVH</p>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                Connectez-vous directement à votre compte OVH pour récupérer automatiquement vos relevés d&apos;appels.
              </p>

              {onOVHUpdate && (
                <button
                  onClick={onOVHUpdate}
                  className="w-full mb-3 bg-slate-50 text-blue-600 px-4 py-2.5 rounded-lg font-medium text-sm
                           hover:bg-[#1F4597]/5 transition-colors duration-200 
                           flex items-center justify-center gap-2 border border-slate-200"
                >
                  <RefreshCw size={16} />
                  Mettre à jour les données OVH
                </button>
              )}

              <button
                onClick={handleOVHSelect}
                className="w-full relative overflow-hidden bg-[#1F4597] text-white px-4 py-3 rounded-lg font-semibold text-sm
                         hover:bg-[#1F4597] hover:shadow-lg hover:shadow-[#5087FF]/20
                         transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FolderOpen size={18} />
                <span>Sélectionner un groupe OVH</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* CSV Card - Smaller, below */}
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-teal-100/60 overflow-hidden
                          hover:shadow-md hover:border-teal-200 
                          transition-all duration-300 ease-out">
            
            <div className="relative p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-100 to-teal-50 
                            border border-teal-200 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={18} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-slate-700">Import Manuel</h3>
                <p className="text-xs text-slate-400">CSV / ZIP</p>
              </div>
              <button
                onClick={() => {
                  const fileInput = document.getElementById('file-upload-input') as HTMLInputElement | null;
                  fileInput?.click();
                }}
                className="bg-teal-500 text-white px-3 py-1.5 rounded-md text-xs font-medium
                         hover:bg-teal-600 transition-colors duration-200 flex items-center gap-1"
              >
                <FileText size={12} />
                <span>Fichiers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input 
          type="file" 
          accept=".csv,.zip" 
          multiple 
          onChange={handleFileUpload} 
          className="hidden" 
          id="file-upload-input"
        />

        {/* Error Display */}
        {error && (
          <div className={`max-w-lg w-full mb-6 transition-all duration-500 ${error ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 shadow-sm">
              <Zap size={20} className="text-red-500 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Spacer to push footer down */}
        <div className="flex-1 min-h-[40vh]" />
      </main>

      {/* Footer - Transparent to show background */}
      <footer className={`relative z-10 py-6 border-t border-slate-200/40
                         transition-all duration-1000 delay-1000
                         ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="115" height="24" className="h-6 w-auto opacity-50" />
            <span className="text-slate-400 text-xs">© {new Date().getFullYear()} OpenZyra</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-slate-400">
            <span className="text-slate-500 text-center">Application créée et administrée par Angelo DISCEPOLI - Fondateur OpenZyra</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>Système opérationnel</span>
              </div>
              <button 
                onClick={() => setShowLegal(true)}
                className="hover:text-[#1F4597] transition-colors flex items-center gap-1"
              >
                <Scale size={12} />
                Mentions légales
              </button>
              <a href="mailto:contact@openzyra.app" className="hover:text-[#1F4597] transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmptyState;
