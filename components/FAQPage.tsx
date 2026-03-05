import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search,
  HelpCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Lock,
  FileText,
  Phone,
  BarChart3,
  Download,
  CheckCircle,
  AlertCircle,
  Github
} from 'lucide-react';
import faqData from '../data/faq.json';

// =============================================================================
// TYPES
// =============================================================================

interface FAQItemData {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  seo?: {
    keywords: string[];
  };
}

interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FAQData {
  introduction: {
    title: string;
    subtitle: string;
    description: string;
  };
  categories: FAQCategory[];
  faqs: FAQItemData[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ArrowLeft, HelpCircle, MessageCircle, ChevronDown, ChevronUp, Zap, Shield, Lock,
  FileText, Phone, BarChart3, Download, CheckCircle, AlertCircle, Github, Search
};

const getIcon = (iconName: string, size: number = 24, className: string = '') => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon size={size} className={className} /> : <HelpCircle size={size} className={className} />;
};

// =============================================================================
// COMPONENTS
// =============================================================================

const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-slate-50" />
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5087FF]/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1F4597]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  </div>
);

const CategoryCard: React.FC<{
  category: FAQCategory;
  isActive: boolean;
  onClick: () => void;
  count: number;
}> = ({ category, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    className={`group relative p-4 rounded-2xl text-left transition-all duration-300 ${
      isActive 
        ? 'bg-[#5087FF] text-white shadow-lg shadow-[#5087FF]/25' 
        : 'bg-white/80 hover:bg-white text-slate-700 hover:shadow-lg border border-slate-200/50'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
      isActive ? 'bg-white/20' : 'bg-[#5087FF]/10'
    }`}>
      {getIcon(category.icon, 20, isActive ? 'text-white' : 'text-[#1F4597]')}
    </div>
    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
    <p className={`text-xs ${isActive ? 'text-[#5087FF]/50' : 'text-slate-500'}`}>
      {count} questions
    </p>
  </button>
);

const FAQItem: React.FC<{
  faq: FAQItemData;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ faq, isExpanded, onToggle }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-6 flex items-start gap-4 text-left hover:bg-[#5087FF]/5 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-[#5087FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <MessageCircle size={16} className="text-[#1F4597]" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 pr-8">{faq.question}</h3>
      </div>
      <div className="flex-shrink-0">
        {isExpanded ? (
          <ChevronUp size={20} className="text-slate-400" />
        ) : (
          <ChevronDown size={20} className="text-slate-400" />
        )}
      </div>
    </button>
    
    {isExpanded && (
      <div className="px-6 pb-6 pl-16 border-t border-slate-100">
        <p className="text-slate-600 leading-relaxed mb-4">
          {faq.answer}
        </p>
        
        {/* SEO Keywords (hidden visually but indexed) */}
        <div className="flex flex-wrap gap-1 mt-4">
          {faq.keywords.map((kw) => (
            <span key={kw} className="px-2 py-1 rounded-full bg-blue-50 text-[#1F4597] text-xs">
              #{kw}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const FAQPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const data = faqData as FAQData;

  // Filter FAQs
  const filteredFaqs = React.useMemo(() => {
    let faqs = data.faqs;
    
    if (selectedCategory) {
      faqs = faqs.filter(f => f.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      faqs = faqs.filter(f => 
        f.question.toLowerCase().includes(query) ||
        f.answer.toLowerCase().includes(query) ||
        f.seo.keywords.some(k => k.toLowerCase().includes(query))
      );
    }
    
    return faqs;
  }, [searchQuery, selectedCategory, data.faqs]);

  // Count FAQs per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.categories.forEach(cat => {
      counts[cat.id] = data.faqs.filter(f => f.category === cat.id).length;
    });
    return counts;
  }, [data.faqs, data.categories]);

  // Toggle FAQ expansion
  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Expand all in current view
  const expandAll = () => {
    setExpandedFaqs(filteredFaqs.map(f => f.id));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedFaqs([]);
  };

  // SEO - Update meta tags
  useEffect(() => {
    document.title = data.seo.title;
    setIsVisible(true);
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.seo.description);
    }

    // Add JSON-LD structured data for FAQPage
    const existingScript = document.getElementById('faq-jsonld');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = 'faq-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': data.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
    document.head.appendChild(script);

    return () => {
      const script = document.getElementById('faq-jsonld');
      if (script) script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-50 w-full px-6 py-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-[#1F4597] transition-colors p-2 rounded-full hover:bg-blue-50"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">FAQ</h1>
                <p className="text-sm text-slate-500">Questions fréquentes sur l'analyse d'appels OVH</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 border border-slate-200/50 
                         focus:border-[#5087FF] focus:ring-[#5087FF]/202 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <main className={`relative z-10 max-w-7xl mx-auto px-6 py-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Introduction */}
        <section className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">{data.introduction.title}</h2>
          <p className="text-slate-600">{data.introduction.description}</p>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-[#1F4597] text-white' 
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/50'
              }`}
            >
              Toutes ({data.faqs.length})
            </button>
            {data.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'bg-[#1F4597] text-white' 
                    : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/50'
                }`}
              >
                {getIcon(category.icon, 16)}
                {category.name} ({categoryCounts[category.id]})
              </button>
            ))}
          </div>
        </section>

        {/* Expand/Collapse Controls */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-slate-500">
            {filteredFaqs.length} question{filteredFaqs.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-sm text-[#1F4597] hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Tout déplier
            </button>
            <button
              onClick={collapseAll}
              className="text-sm text-slate-500 hover:text-slate-600 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Tout replier
            </button>
          </div>
        </div>

        {/* FAQ List */}
        <section className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isExpanded={expandedFaqs.includes(faq.id)}
              onToggle={() => toggleFaq(faq.id)}
            />
          ))}
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-500">Aucune question ne correspond à votre recherche</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="mt-4 text-[#1F4597] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>

        {/* Contact / Support */}
        <section className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Vous ne trouvez pas votre réponse ?</h2>
            <p className="text-slate-600 mb-6">
              Consultez nos tutoriels détaillés ou rejoignez notre communauté sur GitHub pour poser vos questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://github.com/atlas161/OpenZyra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <Github size={20} />
                GitHub
              </a>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1F4597] text-white hover:bg-blue-700 transition-colors"
              >
                <Zap size={20} />
                Essayer OpenZyra
              </button>
            </div>
          </div>
        </section>

        {/* SEO Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/50">
          <div className="text-center max-w-2xl mx-auto">
            <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="154" height="32" className="h-8 w-auto mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-4">
              {data.seo.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
              {data.seo.keywords.split(', ').map((kw) => (
                <span key={kw}>#{kw.replace(/ /g, '-')}</span>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default FAQPage;
