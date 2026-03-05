import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Filter, 
  Clock, 
  Users, 
  Lightbulb,
  BarChart3,
  FileQuestion
} from 'lucide-react';

interface HelpPageProps {
  onBack?: () => void;
}

// Simple background like LandingPage - pastel blue theme
const SimpleBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Base gradient - soft blue pastel */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-[#5087FF]/10 to-[#1F4597]/80" />
    
    {/* Subtle dot pattern */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}
    />
    
    {/* Subtle gradient orbs */}
    <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#5087FF]/20 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#1F4597]/20 rounded-full blur-3xl" />
  </div>
);

// Simple card component matching LandingPage style
const SimpleCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  step?: number;
}> = ({ icon, title, description, step }) => (
  <div className="group relative bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-[#5087FF]/30 
                  hover:border-[#5087FF]/50 transition-all duration-300 p-5">
    <div className="flex items-start gap-4">
      {step && (
        <div className="w-8 h-8 rounded-full bg-[#5087FF]/10 text-[#1F4597] flex items-center justify-center text-sm font-bold shrink-0">
          {step}
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#5087FF]/10 to-[#5087FF]/5 border-[#5087FF]/30
                      border border-blue-200 flex items-center justify-center shrink-0
                      group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

// FAQ Item component
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-[#5087FF]/30 p-5 hover:border-blue-300 transition-colors">
    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
      <FileQuestion size={16} className="text-blue-600" />
      {question}
    </h5>
    <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
  </div>
);

export const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    document.body.style.overflow = 'unset';
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col font-sans relative">
      <SimpleBackground />
      
      {/* Navbar - pastel blue theme */}
      <nav className={`w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto relative z-10
                      transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-3">
          <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="192" height="40" className="h-10 w-auto" />
        </div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-[#1F4597] text-white rounded-lg font-medium 
                    hover:bg-[#1F4597] transition-colors shadow-sm text-sm"
        >
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 py-12 w-full max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 delay-100
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-[#5087FF] text-xs font-medium mb-4">
            <HelpCircle size={14} />
            <span>Centre d'Aide</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Comment fonctionne <span className="text-blue-600">l'outil</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Guide complet pour comprendre et utiliser l'outil d'analyse téléphonique.
          </p>
        </div>

        {/* Steps Section */}
        <div className={`w-full mb-12 transition-all duration-700 delay-200
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Comment ça marche</h2>
          <div className="space-y-3">
            <SimpleCard
              step={1}
              icon={<Filter className="text-blue-600" size={22} />}
              title="Importez vos fichiers CSV"
              description="Glissez-déposez vos fichiers CSV OVH ou sélectionnez-les depuis votre ordinateur. Vos données restent dans votre navigateur."
            />
            <SimpleCard
              step={2}
              icon={<Users className="text-blue-600" size={22} />}
              title="Configuration"
              description="Définissez votre ligne principale (NDI), identifiez vos postes SIP et configurez vos horaires d'ouverture."
            />
            <SimpleCard
              step={3}
              icon={<BarChart3 className="text-blue-600" size={22} />}
              title="Analyse & Rapports"
              description="Obtenez vos statistiques détaillées, exportez en CSV, JSON ou PDF. Suivez vos performances."
            />
          </div>
        </div>

        {/* Concepts Section */}
        <div className={`w-full mb-12 transition-all duration-700 delay-300
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-[#5087FF]/30 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Lightbulb size={20} className="text-blue-600"/>
              Concepts Clés
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#5087FF]/10 p-4 rounded-lg border border-[#5087FF]/30">
                <h4 className="font-bold text-[#5087FF] text-sm flex items-center gap-2 mb-2">
                  <Users size={16}/> La Session d'Appel
                </h4>
                <p className="text-sm text-slate-600">
                  Un seul appel physique génère plusieurs lignes (menu, sonneries...). OpenZyra regroupe ces lignes pour reconstituer le parcours complet.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-bold text-amber-700 text-sm flex items-center gap-2 mb-2">
                  <Clock size={16}/> La Plage Horaire
                </h4>
                <p className="text-sm text-slate-600">
                  Les indicateurs ne sont calculés que sur les heures d'ouverture. Le reste est classé "Hors Ouverture".
                </p>
              </div>
            </div>

            <h3 className="font-bold text-slate-800 mb-3">Statuts des Appels</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-700">Hors Ouverture</strong>
                  <p className="text-slate-500">Appels reçus en dehors des plages horaires configurées.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-green-700">Répondu</strong>
                  <p className="text-slate-500">Un poste interne (SIP) a décroché avec une durée supérieure à 0.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-red-700">Manqué</strong>
                  <p className="text-slate-500">Pendant les horaires, aucun poste n'a décroché (durée = 0).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`w-full transition-all duration-700 delay-400
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Questions Fréquentes</h2>
          <div className="space-y-3">
            <FaqItem
              question="Pourquoi mes chiffres sont différents de mon téléphone ?"
              answer="Les téléphones affichent souvent les 'appels bruts'. Si un appel sonne sur 3 postes, le téléphone voit 3 événements. OpenZyra consolide cela en 1 seul événement pour vous donner la vraie charge de travail."
            />
            <FaqItem
              question="Comment sont comptés les appels répétés ?"
              answer="Si un numéro appelle plusieurs fois d'affilée (avec moins de 30 minutes entre chaque tentative), cela est compté comme un seul incident. Si l'un des appels est décroché, l'ensemble est considéré comme 'Répondu'."
            />
            <FaqItem
              question="Que contient l'export ZIP complet ?"
              answer="Le ZIP contient : la configuration (config.json), les données en CSV, et le rapport PDF avec les graphiques."
            />
            <FaqItem
              question="Mes données sont-elles sécurisées ?"
              answer="Absolument. OpenZyra fonctionne 100% dans votre navigateur. Aucune donnée n'est envoyée vers nos serveurs."
            />
          </div>
        </div>
      </main>

      {/* Footer - pastel blue theme */}
      <footer className={`relative z-10 py-6 border-t border-[#5087FF]/30 bg-white/50 backdrop-blur-sm
                         transition-all duration-700 delay-500
                         ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="154" height="32" className="h-8 w-auto" />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-slate-500">
            <span className="text-slate-500 text-center">100% Client-side • Vos données restent privées</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Système opérationnel</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

