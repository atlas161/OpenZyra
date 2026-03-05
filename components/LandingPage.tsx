import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Shield, 
  Zap,
  BarChart3,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Lock,
  BookOpen,
  Github,
  TrendingUp,
  Clock,
  Users,
  Award,
  MousePointer2,
  Menu,
  X,
  Download,
  Star,
  CheckCircle2,
  Eye,
  Heart,
  Quote,
  ChevronDown,
  ChevronUp,
  Building2,
  PhoneCall,
  FileText,
  PieChart,
  ArrowUpRight,
  Mail
} from 'lucide-react';

// ==========================================
// HOOK POUR ANIMATIONS AU SCROLL
// ==========================================
const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

interface LandingPageProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDocs: () => void;
  onOpenTutorials?: () => void;
  onOpenFeatures?: () => void;
  onOpenAlternatives?: () => void;
  onOpenFAQ?: () => void;
  onOpenContact?: () => void;
  error: string | null;
  isExiting?: boolean;
}

// ==========================================
// BACKGROUND ARTISTIQUE - Mode clair premium
// ==========================================
const ArtisticBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Gradient clair doux */}
      <div className="absolute inset-0 bg-slate-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-[#5087FF]/5" />
      
      {/* Grille technologique subtile */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(80,135,255,0.4) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(80,135,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Orbes lumineux pastel */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(80,135,255,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'floatOrb1 25s ease-in-out infinite'
        }}
      />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(31,69,151,0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'floatOrb2 30s ease-in-out infinite reverse'
        }}
      />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(80,135,255,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'floatOrb3 20s ease-in-out infinite 5s'
        }}
      />
      
      {/* Lignes lumineuses diagonales */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5087FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#5087FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5087FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="20%" x2="100%" y2="80%" stroke="url(#lineGrad)" strokeWidth="0.5" />
        <line x1="10%" y1="100%" x2="90%" y2="0%" stroke="url(#lineGrad)" strokeWidth="0.5" />
      </svg>
      
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.1); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(0.95); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// COMPOSANTS ARTISTIQUES
// ==========================================

const GlowingBadge: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#5087FF]/20 via-[#1F4597]/20 to-[#5087FF]/20 border border-[#5087FF]/30 rounded-full" />
    <div className="absolute inset-[1px] bg-white/90 backdrop-blur rounded-full" />
    {icon && <span className="relative text-[#5087FF]">{icon}</span>}
    <span className="relative text-sm text-slate-700 font-medium">{children}</span>
  </div>
);

const FloatingStat: React.FC<{ value: string; label: string; icon: React.ReactNode; delay: number }> = 
  ({ value, label, icon, delay }) => (
  <div className="relative group" style={{ animationDelay: `${delay}ms` }}>
    <div className="absolute -inset-2 bg-gradient-to-br from-[#5087FF]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative p-5 rounded-2xl bg-white backdrop-blur-sm border border-slate-200 hover:border-[#5087FF]/30 transition-all duration-300 group-hover:transform group-hover:-translate-y-1 shadow-lg shadow-slate-200/50">
      <div className="w-12 h-12 rounded-xl bg-[#5087FF] flex items-center justify-center mb-3 shadow-lg shadow-[#5087FF]/25">
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string; delay: number }> = 
  ({ icon, title, desc, color, delay }) => (
  <div className="group relative" style={{ animationDelay: `${delay}ms` }}>
    <div className={`absolute -inset-px bg-${color} rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />
    <div className="relative p-7 rounded-3xl bg-white backdrop-blur-xl border border-slate-200 hover:border-[#5087FF]/30 transition-all duration-300 h-full shadow-lg shadow-slate-200/30">
      <div className={`w-14 h-14 rounded-2xl bg-${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-3 group-hover:text-[#1F4597] transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// ==========================================
// SECTIONS ARTISTIQUES SUPPLÉMENTAIRES
// ==========================================

// Hook useScrollAnimation déjà défini plus haut

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = 
  ({ children, className = '', delay = 0 }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Témoignages
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sophie Martin",
      role: "Directrice d'agence",
      company: "Cabinet Immobilier Paris",
      content: "OpenZyra nous a permis d'identifier que 30% de nos appels étaient manqués entre 12h et 14h. Nous avons ajusté nos plages horaires et augmenté notre taux de réponse de 25%.",
      rating: 5
    },
    {
      name: "Thomas Bernard",
      role: "Responsable service client",
      company: "Cabinet Médical Lyon",
      content: "Le fait que ce soit 100% gratuit et open source est incroyable. Nous traitons 2000 appels par semaine et OpenZyra nous aide à optimiser la répartition des secrétaires.",
      rating: 5
    },
    {
      name: "Marie Dubois",
      role: "Gérante",
      company: "Agence de Voyage Bordeaux",
      content: "L'analyse par agent nous a montré que certains collaborateurs étaient submergés. On a rééquilibré les lignes et le stress a diminué immédiatement.",
      rating: 5
    }
  ];

  return (
    <AnimatedSection className="mb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Ils optimisent leur service client avec OpenZyra
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Rejoignez des centaines de professionnels qui ne laissent plus passer d'opportunités.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div 
            key={i} 
            className="group relative p-8 rounded-3xl bg-white backdrop-blur-xl border border-slate-200 hover:border-[#5087FF]/30 transition-all duration-500 hover:transform hover:-translate-y-2 shadow-lg shadow-slate-200/30"
          >
            {/* Gradient glow */}
            <div className="absolute -inset-px bg-gradient-to-r from-[#5087FF]/20 to-[#1F4597]/20 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            
            <div className="relative">
              {/* Quote icon */}
              <Quote size={32} className="text-[#5087FF]/30 mb-4" />
              
              {/* Content */}
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                "{t.content}"
              </p>
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#5087FF] flex items-center justify-center text-white font-bold">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                  <div className="text-xs text-[#5087FF]">{t.company}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

// Comment ça marche
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: FileText,
      title: "Importez votre CSV",
      desc: "Glissez votre fichier de relevé d'appels OVH. Aucune installation, 100% dans le navigateur.",
      color: "blue-500"
    },
    {
      icon: BarChart3,
      title: "Analyse instantanée",
      desc: "OpenZyra traite vos données en quelques secondes et détecte automatiquement les patterns.",
      color: "cyan-500"
    },
    {
      icon: PieChart,
      title: "Visualisez les insights",
      desc: "Explorez les graphiques interactifs, heatmaps horaires, et performances par agent.",
      color: "violet-500"
    },
    {
      icon: ArrowUpRight,
      title: "Optimisez votre service",
      desc: "Prenez des décisions basées sur les données et améliorez votre taux de réponse.",
      color: "emerald-500"
    }
  ];

  return (
    <AnimatedSection className="mb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Comment ça marche ?
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          De l'import à l'action en 4 étapes simples. Sans formation, sans setup complexe.
        </p>
      </div>
      
      <div className="relative">
        {/* Ligne connectrice */}
        <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#5087FF]/30 to-transparent hidden md:block" />
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Step number */}
              <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#5087FF] text-white text-sm font-bold flex items-center justify-center z-10 shadow-lg shadow-[#5087FF]/30">
                {i + 1}
              </div>
              
              {/* Card */}
              <div className="p-6 rounded-2xl bg-white backdrop-blur border border-slate-200 hover:border-[#5087FF]/30 transition-all duration-300 group-hover:transform group-hover:-translate-y-1 h-full shadow-lg shadow-slate-200/30">
                <div className={`w-14 h-14 rounded-2xl bg-${step.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-[#1F4597] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Compatible avec
const CompatibleWithSection: React.FC = () => {
  const compatibilities = [
 { name: "OVH Telecom", desc: "CSV natif", icon: Building2 },
    { name: "100% Offline", desc: "Aucun envoi de données", icon: Shield },
    { name: "Open Source", desc: "Code transparent", icon: Sparkles },
    { name: "Navigateur", desc: "Chrome, Firefox, Safari", icon: PhoneCall },
  ];

  return (
    <AnimatedSection className="mb-20">
      <div className="text-center mb-8">
        <p className="text-slate-400 text-sm uppercase tracking-wider">Compatible avec</p>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        {compatibilities.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group cursor-pointer">
            <item.icon size={24} className="group-hover:text-[#5087FF] transition-colors" />
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-slate-400">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

// FAQ Accordion
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      q: "Est-ce vraiment 100% gratuit ?",
      a: "Oui, totalement. OpenZyra est un projet open source. Pas de freemium, pas de limitations cachées, pas de carte de crédit requise."
    },
    {
      q: "Mes données sont-elles sécurisées ?",
      a: "Absolument. Tout le traitement se fait dans votre navigateur. Vos fichiers CSV ne sont jamais uploadés vers nos serveurs. Vos données restent chez vous."
    },
    {
      q: "Quels formats de fichiers sont supportés ?",
      a: "OpenZyra accepte les fichiers CSV OVH standards ainsi que les exports ZIP. Le parsing est automatique et intelligent."
    },
    {
      q: "Puis-je exporter les rapports ?",
      a: "Oui ! Vous pouvez exporter vos analyses en PDF pour les partager, ou en CSV/JSON pour les intégrer à d'autres outils."
    },
    {
      q: "Comment contribuer au projet ?",
      a: "OpenZyra est sur GitHub. Vous pouvez suggérer des fonctionnalités, reporter des bugs, ou même contribuer au code. Toute aide est bienvenue !"
    }
  ];

  return (
    <AnimatedSection className="mb-32">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-slate-500">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="rounded-2xl bg-white backdrop-blur border border-slate-200 overflow-hidden transition-all duration-300 hover:border-slate-300 shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-slate-800 pr-4">{faq.q}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-300 ${openIndex === i ? 'bg-[#5087FF]/20' : ''}`}>
                  {openIndex === i ? (
                    <ChevronUp size={18} className="text-[#5087FF]" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40' : 'max-h-0'}`}>
                <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Mockup Interface
const MockupInterface: React.FC = () => (
  <div className="relative w-full max-w-3xl mx-auto">
    <div className="absolute -inset-8 bg-gradient-to-r from-[#5087FF]/10 to-[#1F4597]/10 rounded-[3rem] blur-3xl" />
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
      {/* Chrome */}
      <div className="bg-slate-100 p-3 flex items-center gap-2 border-b border-slate-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white rounded-lg py-1 px-3 text-xs text-slate-400 flex items-center justify-center gap-2 border border-slate-200">
            <Lock size={10} />
            app.openzyra.app
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-6 space-y-4 bg-slate-50/50">
        {/* Stats - Exemple de données */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Appels', val: '1.2k', change: '+12%' },
            { label: 'Répondus', val: '89%', change: '+5%' },
            { label: 'Attente', val: '12s', change: '-8s' },
            { label: 'Manqués', val: '34', change: '-6' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-xs mb-1">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-800">{stat.val}</span>
                <span className={`text-[10px] ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-[#5087FF]'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Chart */}
        <div className="h-32 rounded-xl bg-gradient-to-br from-[#5087FF]/10 to-[#1F4597]/5 border border-slate-200 p-4">
          <div className="flex items-end justify-between h-full gap-1">
            {[35, 55, 40, 75, 50, 85, 65, 90, 55, 80, 70, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-[#5087FF] to-[#5087FF]/30 rounded-t-sm transition-all hover:opacity-80"
                style={{ height: `${h}%`, opacity: 0.4 + (i * 0.05) }} />
            ))}
          </div>
        </div>
        {/* Agents - Exemple */}
        <div className="space-y-2">
          {['Sophie Martin', 'Thomas Bernard', 'Marie Dubois'].map((name, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5087FF] flex items-center justify-center text-xs font-bold text-white">
                  {name[0]}
                </div>
                <span className="text-sm text-slate-600">{name}</span>
              </div>
              <div className="flex items-center gap-1">
                {[5, 4, 4][i] === 5 ? <Star size={14} className="text-yellow-400 fill-yellow-400" /> : 
                 [5, 4, 4][i] === 4 ? <Star size={14} className="text-yellow-400 fill-yellow-400" /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// LANDING PAGE PRINCIPALE
// ==========================================

export const LandingPage: React.FC<LandingPageProps> = ({ 
  handleFileUpload, 
  onOpenDocs,
  onOpenTutorials,
  onOpenFeatures,
  onOpenAlternatives,
  onOpenFAQ,
  onOpenContact,
  error, 
  isExiting 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isExiting) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isExiting]);

  // Scroll to top when landing page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input = document.getElementById('file-upload-input') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
      }
      if (input) {
        input.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden font-sans relative transition-all duration-700 ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <ArtisticBackground />
      
      {/* ==========================================
          NAVBAR - Style glassmorphic
      ========================================== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="w-full px-4 md:px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#5087FF] blur-xl opacity-50" />
                <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="relative h-10 md:h-12 w-auto" />
              </div>
            </div>
                        {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Fonctionnalités', onClick: onOpenFeatures, icon: Sparkles },
                { label: 'Tutoriels', onClick: onOpenTutorials, icon: BookOpen },
                { label: 'FAQ', onClick: onOpenFAQ, icon: HelpCircle },
                { label: 'Contact', onClick: onOpenContact, icon: Mail },
              ].map((item, i) => (
                item.onClick && (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="group flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-all rounded-full hover:bg-slate-100"
                  >
                    <item.icon size={16} className="group-hover:text-[#5087FF] transition-colors" />
                    <span>{item.label}</span>
                  </button>
                )
              ))}
              
              <a 
                href="https://github.com/atlas161/OpenZyra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-4 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <Github size={18} />
                <span className="hidden xl:inline">GitHub</span>
              </a>
            </div>

            {/* Mobile Menu Button - Animation morphing */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                {/* Ligne du haut */}
                <span 
                  className={`block h-0.5 w-6 bg-slate-700 rounded-full transition-all duration-300 ease-out origin-center
                    ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                />
                {/* Ligne du milieu */}
                <span 
                  className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ease-out
                    ${mobileMenuOpen ? 'w-0 opacity-0' : 'w-6'}`}
                />
                {/* Ligne du bas */}
                <span 
                  className={`block h-0.5 w-6 bg-slate-700 rounded-full transition-all duration-300 ease-out origin-center
                    ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ==========================================
          MOBILE MENU - Menu latéral avec animations smooth
      ========================================== */}
      
      {/* Overlay sombre - anime l'opacité */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ease-out
          ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Menu latéral - anime la translation */}
      <div 
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl 
          transform transition-transform duration-300 ease-out
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header du menu */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="h-8 w-auto" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Contenu du menu */}
        <div className="p-4 space-y-2">
          {/* Section Navigation */}
          <div className="space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </p>
            
            {[
              { label: 'Fonctionnalités', onClick: onOpenFeatures, icon: Sparkles, color: 'text-[#5087FF]' },
              { label: 'Tutoriels', onClick: onOpenTutorials, icon: BookOpen, color: 'text-emerald-500' },
              { label: 'FAQ', onClick: onOpenFAQ, icon: HelpCircle, color: 'text-violet-500' },
            ].map((item, i) => (
              item.onClick && (
                <button
                  key={i}
                  onClick={() => { item.onClick(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <div className={`p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-md transition-all ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                </button>
              )
            ))}
          </div>
          
          {/* Séparateur */}
          <div className="my-4 border-t border-slate-100" />
          
          {/* Section Plus */}
          <div className="space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Plus
            </p>
            
            {[
              { label: 'Alternatives', onClick: onOpenAlternatives, icon: BarChart3 },
              { label: 'Contact', onClick: onOpenContact, icon: Mail },
            ].map((item, i) => (
              item.onClick && (
                <button
                  key={i}
                  onClick={() => { item.onClick(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-md transition-all">
                    <item.icon size={18} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            ))}
          </div>
          
          {/* Bouton CTA en bas */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                // Attendre que le menu se ferme avant d'ouvrir le file picker
                setTimeout(() => {
                  const input = document.getElementById('file-upload-input') as HTMLInputElement;
                  input?.click();
                }, 100);
              }}
              className="w-full flex items-center justify-center gap-2 p-4 bg-[#5087FF] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#5087FF]/25 transition-all"
            >
              <Download size={20} />
              Analyser mes appels
            </button>
            
            <a 
              href="https://github.com/atlas161/OpenZyra" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-2 p-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all"
            >
              <Github size={20} />
              Voir sur GitHub
            </a>
          </div>
        </div>
      </div>

      {/* ==========================================
          HERO SECTION - Impact maximal
      ========================================== */}
      <main className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Badge trust */}
          <div className="flex justify-center mb-8">
            <GlowingBadge icon={<Star size={14} className="text-yellow-400" />}>
              100% Gratuit • Open Source
            </GlowingBadge>
          </div>

          {/* Headline principale - VENDEUSE */}
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
              <span className="text-slate-800">Chaque appel manqué</span>
              <br />
              <span className="bg-gradient-to-r from-[#1F4597] via-[#5087FF] to-[#1F4597] bg-clip-text text-transparent">
                est un client perdu.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8">
              OpenZyra transforme vos relevés d'appels en insights actionnables. 
              Identifiez les pics d'activité, optimisez vos plages horaires, 
              et ne laissez plus jamais un client attendre.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const input = document.getElementById('file-upload-input') as HTMLInputElement;
                  input?.click();
                }}
                className="group relative px-8 py-4 bg-[#5087FF] rounded-2xl text-white font-semibold text-lg overflow-hidden transition-all hover:brightness-110"
              >
                <span className="relative flex items-center justify-center gap-2">
                  <Download size={20} />
                  Analyser mes appels
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={onOpenDocs}
                className="px-8 py-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 font-medium hover:bg-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Voir la démo
              </button>
            </div>
          </div>

          {/* Stats flottantes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
            <FloatingStat value="∞" label="Analyses illimitées" icon={<BarChart3 size={18} className="text-white" />} delay={800} />
            <FloatingStat value="0€" label="Coût total" icon={<Award size={18} className="text-white" />} delay={900} />
            <FloatingStat value="0s" label="Temps d'attente" icon={<Clock size={18} className="text-white" />} delay={1000} />
            <FloatingStat value="100%" label="Données privées" icon={<Shield size={18} className="text-white" />} delay={1100} />
          </div>

          {/* Mockup Interface */}
          <div className="mb-32">
            <MockupInterface />
          </div>

          {/* ==========================================
              ZONE UPLOAD - Drag & Drop
          ========================================== */}
          <div className="max-w-3xl mx-auto mb-32">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                Commencez en 30 secondes
              </h2>
              <p className="text-slate-500">
                Glissez votre fichier CSV OVH, c'est tout.
              </p>
            </div>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
                ${isDragging 
                  ? 'border-[#5087FF] bg-[#5087FF]/5 scale-[1.02]' 
                  : 'border-slate-300 hover:border-[#5087FF]/50 bg-white hover:bg-slate-50'
                }`}
            >
              <div className="p-12 md:p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[#5087FF] flex items-center justify-center shadow-2xl shadow-[#5087FF]/30 group-hover:scale-110 transition-transform ${isDragging ? 'animate-bounce' : ''}">
                  {isDragging ? (
                    <MousePointer2 size={40} className="text-white" />
                  ) : (
                    <FileSpreadsheet size={40} className="text-white" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {isDragging ? 'Déposez vos fichiers ici' : 'Importez vos données OVH'}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  CSV ou ZIP • Traitement instantané • 100% confidentiel
                </p>
                
                <button
                  onClick={() => {
                    const input = document.getElementById('file-upload-input') as HTMLInputElement;
                    input?.click();
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all border border-slate-200 hover:border-[#5087FF]/30"
                >
                  Sélectionner un fichier
                </button>
              </div>
            </div>
          </div>

          {/* ==========================================
              FONCTIONNALITÉS - Grid artistique
          ========================================== */}
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                L'analyse téléphonique, réinventée
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Des outils puissants pour comprendre et optimiser chaque interaction client.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Zap size={28} className="text-white" />}
                title="Analyse en temps réel"
                desc="Taux de réponse, temps d'attente, pics d'activité. Tous vos KPIs instantanément."
                color="amber-500"
                delay={1400}
              />
              <FeatureCard 
                icon={<Shield size={28} className="text-white" />}
                title="Confidentialité absolue"
                desc="Vos données restent dans votre navigateur. Zero serveur, zero tracking, 100% transparent."
                color="emerald-500"
                delay={1500}
              />
              <FeatureCard 
                icon={<Eye size={28} className="text-white" />}
                title="Visualisations interactives"
                desc="Graphiques, heatmaps et rapports exportables en PDF. Partagez les insights facilement."
                color="[#5087FF]"
                delay={1600}
              />
            </div>
          </div>

          {/* ==========================================
              COMMENT ÇA MARCHE
          ========================================== */}
          <HowItWorksSection />

          {/* ==========================================
              TÉMOIGNAGES
          ========================================== */}
          <TestimonialsSection />

          {/* ==========================================
              FAQ
          ========================================== */}
          <FAQSection />

          {/* ==========================================
              COMPATIBLE AVEC
          ========================================== */}
          <CompatibleWithSection />

          {/* ==========================================
              AVANTAGES CLÉS
          ========================================== */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">Gratuit</div>
                  <div className="text-sm text-slate-500">100% Open Source, sans frais</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#5087FF] mb-1">Privé</div>
                  <div className="text-sm text-slate-500">Vos données restent chez vous</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">Rapide</div>
                  <div className="text-sm text-slate-500">Analyse instantanée en local</div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
              FOOTER CTA
          ========================================== */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Prêt à ne plus manquer une opportunité ?
            </h2>
            <p className="text-slate-500 mb-8">
              Rejoignez les milliers de professionnels qui optimisent leur service client avec OpenZyra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const input = document.getElementById('file-upload-input') as HTMLInputElement;
                  input?.click();
                }}
                className="px-8 py-4 bg-[#1F4597] rounded-2xl text-white font-semibold transition-all hover:brightness-110"
              >
                Commencer gratuitement
              </button>
              <a 
                href="https://github.com/atlas161/OpenZyra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2"
              >
                <Github size={20} />
                Voir sur GitHub
              </a>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="max-w-lg mx-auto mt-8">
              <div className="bg-red-500/20 backdrop-blur border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 text-red-200">
                <Zap size={20} />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="h-6 w-auto opacity-60" />
          <div className="text-sm text-slate-400 text-center">
            © {new Date().getFullYear()} OpenZyra • 
            <a 
              href="https://github.com/atlas161/OpenZyra/blob/main/LICENSE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#1F4597] transition-colors underline"
            >
              GNU GPL v3
            </a>
            • 100% Client-side
          </div>
        </div>
      </footer>

      {/* Hidden file input */}
      <input 
        type="file" 
        accept=".csv,.zip" 
        multiple 
        onChange={handleFileUpload} 
        className="hidden" 
        id="file-upload-input"
      />
    </div>
  );
};

export default LandingPage;
