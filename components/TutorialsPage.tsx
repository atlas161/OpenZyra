import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  Download,
  Settings,
  BarChart3,
  Search,
  Tag,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Github,
  PhoneOff,
  FileText,
  Save,
  Filter
} from 'lucide-react';

// Types
interface TutorialStep {
  step: number;
  title: string;
  content: string;
  tip?: string;
}

interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  readTime: string;
  icon: string;
  tags: string[];
  seo: {
    keywords: string;
    metaDescription: string;
  };
  steps: TutorialStep[];
  relatedTutorials: string[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface TutorialsData {
  tutorials: Tutorial[];
  categories: Category[];
}

interface TutorialsPageProps {
  onBack: () => void;
  onOpenFAQ?: () => void;
  onOpenFeatures?: () => void;
  onOpenAlternatives?: () => void;
  onOpenDocs?: () => void;
  onOpenLegal?: () => void;
  tutorialSlug?: string | null;
}

// Icon mapping
const IconMap: Record<string, React.ElementType> = {
  Download,
  Settings,
  Clock,
  BookOpen,
  BarChart3,
  HelpCircle,
  Sparkles,
  Github,
  PhoneOff,
  FileText,
  Save,
  Filter
};

// Animated background
const AnimatedBackground: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute inset-0 bg-slate-50" />
    <div 
      className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full opacity-30"
      style={{
        background: 'radial-gradient(circle, rgba(147,197,253,0.4) 0%, rgba(191,219,254,0.2) 50%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'float 25s ease-in-out infinite'
      }}
    />
    <div 
      className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full opacity-25"
      style={{
        background: 'radial-gradient(circle, rgba(165,180,252,0.4) 0%, rgba(199,210,254,0.2) 50%, transparent 70%)',
        filter: 'blur(70px)',
        animation: 'float 30s ease-in-out infinite reverse'
      }}
    />
    <style>{`
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -30px) scale(1.05); }
        66% { transform: translate(-20px, 20px) scale(0.95); }
      }
    `}</style>
  </div>
);

// Tutorial Card Component
const TutorialCard: React.FC<{ 
  tutorial: Tutorial; 
  onClick: () => void;
  isVisible: boolean;
  delay: number;
}> = ({ tutorial, onClick, isVisible, delay }) => {
  const IconComponent = IconMap[tutorial.icon] || BookOpen;
  
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#5087FF]/30 
                  shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-[#1F4597]/10 
                  transition-all duration-500 cursor-pointer overflow-hidden
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#5087FF] 
                          flex items-center justify-center shadow-lg shadow-[#5087FF]/20
                          group-hover:scale-110 transition-transform duration-300">
            <IconComponent size={24} className="text-white" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium
            ${tutorial.category === 'debutant' ? 'bg-green-100 text-green-700' : ''}
            ${tutorial.category === 'intermediaire' ? 'bg-amber-100 text-amber-700' : ''}
            ${tutorial.category === 'avance' ? 'bg-purple-100 text-purple-700' : ''}
          `}>
            {tutorial.difficulty}
          </span>
        </div>
        
        {/* Content */}
        <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-[#1F4597] transition-colors">
          {tutorial.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {tutorial.description}
        </p>
        
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {tutorial.readTime}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} />
            {tutorial.steps.length} étapes
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tutorial.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-[#5087FF]/10 text-[#1F4597] text-xs rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Arrow indicator */}
        <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-[#5087FF]/10 
                        flex items-center justify-center opacity-0 group-hover:opacity-100 
                        transition-all duration-300 group-hover:translate-x-1">
          <ChevronRight size={16} className="text-[#1F4597]" />
        </div>
      </div>
    </div>
  );
};

// Tutorial Detail View
const TutorialDetail: React.FC<{ 
  tutorial: Tutorial; 
  onBack: () => void;
  onSelectTutorial: (slug: string) => void;
  allTutorials: Tutorial[];
}> = ({ tutorial, onBack, onSelectTutorial, allTutorials }) => {
  const [openSteps, setOpenSteps] = useState<number[]>([1]);
  const IconComponent = IconMap[tutorial.icon] || BookOpen;
  
  const toggleStep = (step: number) => {
    setOpenSteps(prev => 
      prev.includes(step) 
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  };
  
  const relatedTutorialsList = allTutorials.filter(t => 
    tutorial.relatedTutorials.includes(t.id)
  );
  
  return (
    <div className="animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-[#1F4597] transition-colors">
          Tutoriels
        </button>
        <ChevronRight size={14} />
        <span className="text-slate-800 font-medium">{tutorial.title}</span>
      </div>
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#5087FF]/30 shadow-lg p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#5087FF] 
                          flex items-center justify-center shadow-lg shadow-[#5087FF]/25">
            <IconComponent size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${tutorial.category === 'debutant' ? 'bg-green-100 text-green-700' : ''}
                ${tutorial.category === 'intermediaire' ? 'bg-amber-100 text-amber-700' : ''}
                ${tutorial.category === 'avance' ? 'bg-purple-100 text-purple-700' : ''}
              `}>
                {tutorial.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={14} />
                {tutorial.readTime} de lecture
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">{tutorial.title}</h1>
            <p className="text-slate-600 text-lg">{tutorial.description}</p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100">
          {tutorial.tags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 bg-[#5087FF]/10 text-[#1F4597] text-sm rounded-lg flex items-center gap-1">
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Steps */}
      <div className="space-y-4 mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Étapes du tutoriel</h2>
        {tutorial.steps.map((step) => (
          <div 
            key={step.step}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#5087FF]/30 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleStep(step.step)}
              className="w-full flex items-center gap-4 p-5 hover:bg-[#5087FF]/10/50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                ${openSteps.includes(step.step) 
                  ? 'bg-[#1F4597] text-white' 
                  : 'bg-[#5087FF]/10 text-[#1F4597]'
                }`}
              >
                {step.step}
              </div>
              <span className="flex-1 font-semibold text-slate-800">{step.title}</span>
              <ChevronDown 
                size={20} 
                className={`text-slate-400 transition-transform duration-300
                  ${openSteps.includes(step.step) ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {openSteps.includes(step.step) && (
              <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                <div className="pl-14">
                  <p className="text-slate-600 leading-relaxed mb-4">{step.content}</p>
                  {step.tip && (
                    <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <Lightbulb size={20} className="text-amber-500 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-amber-700 text-sm">Astuce : </span>
                        <span className="text-amber-700 text-sm">{step.tip}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Related tutorials */}
      {relatedTutorialsList.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#5087FF]/30 shadow-lg p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-[#1F4597]" />
            Tutoriels connexes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTutorialsList.map((related) => (
              <button
                key={related.id}
                onClick={() => onSelectTutorial(related.slug)}
                className="text-left p-4 rounded-xl border border-[#5087FF]/30 hover:border-[#5087FF]/50 
                         hover:bg-[#5087FF]/10/50 transition-all group"
              >
                <h4 className="font-semibold text-slate-800 group-hover:text-[#1F4597] mb-1">
                  {related.title}
                </h4>
                <p className="text-sm text-slate-500 line-clamp-2">{related.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Tutorials Page
export const TutorialsPage: React.FC<TutorialsPageProps> = ({ 
  onBack, 
  onOpenFAQ,
  onOpenFeatures,
  onOpenAlternatives,
  onOpenDocs,
  onOpenLegal,
  tutorialSlug 
}) => {
  const [data, setData] = useState<TutorialsData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  
  useEffect(() => {
    // Load tutorials data
    fetch('/data/tutorials.json')
      .then(res => res.json())
      .then((jsonData: TutorialsData) => {
        setData(jsonData);
        
        // Check if specific tutorial requested
        if (tutorialSlug) {
          const tutorial = jsonData.tutorials.find(t => t.slug === tutorialSlug);
          if (tutorial) {
            setActiveTutorial(tutorial);
          }
        }
      })
      .catch(err => console.error('Failed to load tutorials:', err));
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [tutorialSlug]);
  
  // Filter tutorials
  const filteredTutorials = data?.tutorials.filter(tutorial => {
    const matchesSearch = !searchQuery || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || tutorial.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5087FF]/30 border-t-[#1F4597] rounded-full animate-spin" />
      </div>
    );
  }
  
  // Show single tutorial view
  if (activeTutorial) {
    return (
      <div className="min-h-screen font-sans text-slate-700 relative">
        <AnimatedBackground />
        
        <header className="bg-white/80 backdrop-blur-md border-b border-[#5087FF]/30 shadow-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
            <button 
              onClick={() => {
                setActiveTutorial(null);
                window.location.hash = 'tutoriels';
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1F4597] hover:bg-[#5087FF]/10 text-white rounded-xl transition-all font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Retour aux tutoriels
            </button>
          </div>
        </header>
        
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <TutorialDetail 
            tutorial={activeTutorial} 
            onBack={() => {
              setActiveTutorial(null);
              window.location.hash = 'tutoriels';
            }}
            onSelectTutorial={(slug) => {
              const tutorial = data.tutorials.find(t => t.slug === slug);
              if (tutorial) {
                setActiveTutorial(tutorial);
                window.location.hash = `tutoriels/${slug}`;
              }
            }}
            allTutorials={data.tutorials}
          />
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen font-sans text-slate-700 relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-50 w-full px-6 py-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-[#1F4597] transition-colors p-2 rounded-full hover:bg-[#5087FF]/10"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Centre de Tutoriels</h1>
                <p className="text-sm text-slate-500">Apprenez à maîtriser OpenZyra et OVH</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un tutoriel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 border border-slate-200/50 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Hero section */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Guides et tutoriels
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Apprenez à analyser vos relevés OVH, configurer vos lignes et optimiser votre service client avec nos guides étape par étape.
          </p>
        </div>
        
        {/* Search and filters */}
        <div className={`mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un tutoriel (ex: CSV, configuration, temps d'attente...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-[#5087FF]/30 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-[#5087FF]/20 focus:border-[#5087FF]
                       text-slate-700 placeholder:text-slate-400"
            />
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${!selectedCategory 
                  ? 'bg-[#1F4597] text-white shadow-lg shadow-[#5087FF]/25' 
                  : 'bg-white/80 text-slate-600 hover:bg-[#5087FF]/10 border border-[#5087FF]/30'
                }`}
            >
              Tous
            </button>
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === cat.id
                    ? 'bg-[#1F4597] text-white shadow-lg shadow-[#5087FF]/25' 
                    : 'bg-white/80 text-slate-600 hover:bg-[#5087FF]/10 border border-[#5087FF]/30'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results count */}
        <div className={`mb-4 text-sm text-slate-500 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {filteredTutorials.length} tutoriel{filteredTutorials.length > 1 ? 's' : ''} disponible{filteredTutorials.length > 1 ? 's' : ''}
        </div>
        
        {/* Tutorials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial, index) => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              onClick={() => {
                setActiveTutorial(tutorial);
                window.location.hash = `#tutoriels/${tutorial.slug}`;
              }}
              isVisible={isVisible}
              delay={200 + index * 100}
            />
          ))}
        </div>
        
        {/* No results */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun tutoriel trouvé</h3>
            <p className="text-slate-500">Essayez avec d'autres mots-clés ou réinitialisez les filtres.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="mt-4 px-4 py-2 bg-[#1F4597] text-white rounded-lg hover:bg-[#5087FF]/10 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
        
        {/* Help banner */}
        <div className={`mt-12 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 mb-1">Vous ne trouvez pas ce que vous cherchez ?</h3>
            <p className="text-sm text-emerald-700">
              Consultez la {onOpenDocs ? (
                <button onClick={onOpenDocs} className="underline font-medium hover:text-emerald-800">documentation complète</button>
              ) : (
                <span className="underline font-medium">documentation complète</span>
              )} ou 
              accédez à la {onOpenFAQ ? (
                <button onClick={onOpenFAQ} className="underline font-medium hover:text-emerald-800">FAQ</button>
              ) : (
                <span className="underline font-medium">FAQ</span>
              )}.
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-8 text-center border-t border-[#5087FF]/30 mt-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="154" height="32" className="h-8 w-auto" />
        </div>
        <p className="text-slate-500 text-sm mb-1">© {new Date().getFullYear()} OpenZyra - Licence GNU GPL v3.0</p>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2">
          <button 
            onClick={onOpenLegal}
            className="hover:text-[#1F4597] transition-colors underline"
          >
            Mentions légales
          </button>
          <span>•</span>
          <a href="mailto:contact@openzyra.app" className="hover:text-[#1F4597] transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
};
