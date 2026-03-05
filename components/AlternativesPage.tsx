import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check,
  X,
  Sparkles,
  Shield,
  DollarSign,
  Lock,
  Zap,
  BarChart3,
  Download,
  Clock,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

// =============================================================================
// DONNÉES EN DUR (HARDCODED) - Comparatifs avec les alternatives
// =============================================================================

const ALTERNATIVES_DATA = {
  introduction: {
    title: "Alternatives & Comparatif",
    subtitle: "Pourquoi choisir OpenZyra pour analyser vos appels OVH ?",
    description: "Comparaison détaillée avec les solutions existantes pour l'analyse de relevés d'appels téléphoniques. Découvrez pourquoi OpenZyra est l'outil le plus adapté pour votre groupe d'appel OVH."
  },
  
  OpenZyra: {
    name: "OpenZyra",
    tagline: "Outil d'analyse OVH gratuit et 100% privé",
    price: "Gratuit",
    priceNote: "À vie",
    icon: "Sparkles",
    color: "blue",
    features: {
      "Analyse CSV OVH": true,
      "100% Client-side (pas d'upload)": true,
      "Gratuit": true,
      "Export PDF": true,
      "Export CSV": true,
      "Statistiques temps réel": true,
      "Graphiques interactifs": true,
      "Filtres avancés": true,
      "Configuration NDI/SIP": true,
      "Support multi-fichiers": true,
      "Sauvegarde projet (ZIP)": true,
      "Tracé appel détaillé": true,
      "Open Source": true,
      "Sans compte": true,
      "Sans limitation de données": true,
      "Support technique": "Communautaire (GitHub)",
      "Formation incluse": "Tutoriels en ligne"
    }
  },

  alternatives: [
    {
      id: "excel-manuel",
      name: "Excel Manuel",
      tagline: "Tableur traditionnel",
      price: "Gratuit (si vous avez Office)",
      priceNote: "Avec Microsoft Office ou LibreOffice",
      icon: "BarChart3",
      color: "gray",
      type: "manuel",
      description: "La méthode classique : importer vos CSV dans Excel et créer des tableaux croisés dynamiques et graphiques manuellement.",
      features: {
        "Analyse CSV OVH": "Possible mais complexe",
        "100% Client-side (pas d'upload)": true,
        "Gratuit": "Avec Office/LibreOffice existant",
        "Export PDF": true,
        "Export CSV": true,
        "Statistiques temps réel": "Nécessite formules complexes",
        "Graphiques interactifs": "Basiques uniquement",
        "Filtres avancés": "Manuels",
        "Configuration NDI/SIP": "Non",
        "Support multi-fichiers": "Complexe",
        "Sauvegarde projet (ZIP)": "Non",
        "Tracé appel détaillé": "Non",
        "Open Source": "Non",
        "Sans compte": true,
        "Sans limitation de données": true,
        "Support technique": "Aucun",
        "Formation incluse": "Non"
      },
      pros: ["Contrôle total des données", "Personnalisation infinie", "Pas d'apprentissage si vous connaissez Excel"],
      cons: ["Temps de setup très long (2-3h)", "Formules complexes à créer", "Pas de détection automatique NDI/SIP", "Pas de tracé d'appel", "Pas de sauvegarde projet complète"]
    },
    {
      id: "ovh-manager",
      name: "OVH Manager",
      tagline: "Interface officielle OVH",
      price: "Gratuit (inclus avec ligne)",
      priceNote: "Nécessite un compte OVH",
      icon: "Shield",
      color: "orange",
      type: "officiel",
      website: "https://www.ovhtelecom.fr/",
      description: "L'interface officielle d'OVH pour consulter les relevés d'appels de vos lignes téléphoniques.",
      features: {
        "Analyse CSV OVH": "Téléchargement CSV uniquement",
        "100% Client-side (pas d'upload)": "Non (données sur serveurs OVH)",
        "Gratuit": "Avec abonnement OVH",
        "Export PDF": "Basique",
        "Export CSV": true,
        "Statistiques temps réel": "Limitées",
        "Graphiques interactifs": "Non",
        "Filtres avancés": "Basiques",
        "Configuration NDI/SIP": "Partielle",
        "Support multi-fichiers": "Non",
        "Sauvegarde projet (ZIP)": "Non",
        "Tracé appel détaillé": "Non",
        "Open Source": "Non",
        "Sans compte": "Non (compte OVH requis)",
        "Sans limitation de données": true,
        "Support technique": "Support OVH payant",
        "Formation incluse": "Documentation OVH"
      },
      pros: ["Officiel et fiable", "Directement lié à vos lignes", "Pas de manipulation de fichiers"],
      cons: ["Pas d'analyse approfondie", "Pas de graphiques avancés", "Pas de comparaison multi-périodes", "Interface vieillotte", "Pas de stats temps d'attente détaillées"]
    },
    {
      id: "outils-payants",
      name: "Outils Analytics Payants",
      tagline: "Solutions SaaS de reporting",
      price: "30€ - 200€/mois",
      priceNote: "Par utilisateur ou par ligne",
      icon: "DollarSign",
      color: "red",
      type: "payant",
      examples: ["Talkdesk", "Aircall", "Ringover Analytics", "MightyCall"],
      description: "Solutions professionnelles de reporting téléphonique, généralement liées à des centrales téléphoniques cloud.",
      features: {
        "Analyse CSV OVH": "Souvent impossible (besoin API)",
        "100% Client-side (pas d'upload)": "Non (SaaS cloud)",
        "Gratuit": "Non",
        "Export PDF": true,
        "Export CSV": true,
        "Statistiques temps réel": true,
        "Graphiques interactifs": true,
        "Filtres avancés": true,
        "Configuration NDI/SIP": true,
        "Support multi-fichiers": "Via API",
        "Sauvegarde projet (ZIP)": "Export standard",
        "Tracé appel détaillé": "Oui (souvent payant)",
        "Open Source": "Non",
        "Sans compte": "Non",
        "Sans limitation de données": "Selon plan",
        "Support technique": "Support payant inclus",
        "Formation incluse": "Souvent payante"
      },
      pros: ["Fonctionnalités avancées", "Support professionnel", "Intégrations CRM", "Tableaux de bord temps réel"],
      cons: ["Coût mensuel élevé", "Nécessite migration vers leur téléphonie", "Courbe d'apprentissage", "Dépendance au fournisseur", "Pas compatible OVH directement"]
    },
    {
      id: "bi-tools",
      name: "Outils BI (Power BI, Tableau)",
      tagline: "Business Intelligence avancée",
      price: "10€ - 70€/mois",
      priceNote: "Licence utilisateur + formation",
      icon: "BarChart3",
      color: "purple",
      type: "bi",
      examples: ["Microsoft Power BI", "Tableau", "Qlik Sense", "Looker Studio"],
      description: "Outils de Business Intelligence pour créer des dashboards et analyses avancées à partir de vos données CSV.",
      features: {
        "Analyse CSV OVH": "Import CSV manuel",
        "100% Client-side (pas d'upload)": "Non (cloud BI)",
        "Gratuit": "Versions limitées",
        "Export PDF": true,
        "Export CSV": true,
        "Statistiques temps réel": "Via connecteurs",
        "Graphiques interactifs": true,
        "Filtres avancés": true,
        "Configuration NDI/SIP": "Manuelle",
        "Support multi-fichiers": true,
        "Sauvegarde projet (ZIP)": "Via export BI",
        "Tracé appel détaillé": "Complexe à configurer",
        "Open Source": "Non",
        "Sans compte": "Non",
        "Sans limitation de données": "Selon licence",
        "Support technique": "Support éditeur ou communautaire",
        "Formation incluse": "Cours payants"
      },
      pros: ["Très puissant", "Multi-sources de données", "Visualisations avancées", "Partage d'entreprise"],
      cons: ["Coût licence + formation", "Setup complexe (jours/semaines)", "Besoin de compétences techniques", "Surcharge pour simple analyse d'appels", "Trop complexe pour usage ponctuel"]
    },
    {
      id: "scripts-python",
      name: "Scripts Python/R",
      tagline: "Solution technique sur mesure",
      price: "Gratuit (développement requis)",
      priceNote: "Coût en temps de développement",
      icon: "Zap",
      color: "yellow",
      type: "technique",
      description: "Développement de scripts personnalisés en Python, R ou autre pour analyser les fichiers CSV d'appels.",
      features: {
        "Analyse CSV OVH": "À développer",
        "100% Client-side (pas d'upload)": "Possible",
        "Gratuit": "Open source mais dev requis",
        "Export PDF": "Via librairies",
        "Export CSV": true,
        "Statistiques temps réel": "À développer",
        "Graphiques interactifs": "Via matplotlib/plotly",
        "Filtres avancés": "À coder",
        "Configuration NDI/SIP": "À coder",
        "Support multi-fichiers": "À coder",
        "Sauvegarde projet (ZIP)": "À coder",
        "Tracé appel détaillé": "À coder",
        "Open Source": true,
        "Sans compte": true,
        "Sans limitation de données": true,
        "Support technique": "Stack Overflow",
        "Formation incluse": "Aucune"
      },
      pros: ["100% personnalisable", "Open source", "Gratuit si vous avez les compétences", "Automatisation possible"],
      cons: ["Nécessite compétences de développement", "Temps de développement conséquent", "Maintenance à assurer", "Pas d'interface utilisateur", "Pas de support"]
    }
  ],

  comparisonTable: {
    title: "Tableau comparatif détaillé",
    criteria: [
      { id: "prix", name: "Prix", icon: "DollarSign" },
      { id: "confidentialite", name: "Confidentialité", icon: "Lock" },
      { id: "facilite", name: "Facilité d'utilisation", icon: "Sparkles" },
      { id: "fonctionnalites", name: "Fonctionnalités", icon: "Zap" },
      { id: "support", name: "Support", icon: "Users" },
      { id: "rapidite", name: "Mise en route", icon: "Clock" }
    ],
    scores: {
      "OpenZyra": { prix: 5, confidentialite: 5, facilite: 5, fonctionnalites: 4, support: 3, rapidite: 5 },
      "Excel Manuel": { prix: 4, confidentialite: 5, facilite: 2, fonctionnalites: 2, support: 1, rapidite: 1 },
      "OVH Manager": { prix: 5, confidentialite: 3, facilite: 4, fonctionnalites: 2, support: 3, rapidite: 5 },
      "Outils Payants": { prix: 1, confidentialite: 2, facilite: 4, fonctionnalites: 5, support: 5, rapidite: 3 },
      "BI Tools": { prix: 2, confidentialite: 2, facilite: 2, fonctionnalites: 5, support: 3, rapidite: 1 },
      "Scripts Python": { prix: 4, confidentialite: 5, facilite: 1, fonctionnalites: 3, support: 1, rapidite: 1 }
    }
  },

  useCases: [
    {
      title: "PME avec groupe d'appel OVH",
      description: "Vous avez un groupe d'appel OVH (ga123456) avec plusieurs lignes SIP et souhaitez suivre les performances.",
      recommendation: "OpenZyra",
      reason: "Gratuit, configuration NDI/SIP automatique, tracé d'appel complet."
    },
    {
      title: "Analyse ponctuelle mensuelle",
      description: "Vous souhaitez simplement consulter vos statistiques une fois par mois sans y passer des heures.",
      recommendation: "OpenZyra",
      reason: "Import CSV instantané, stats en quelques secondes, pas de configuration à refaire."
    },
    {
      title: "Entreprise avec besoins CRM avancés",
      description: "Vous avez besoin d'intégrer les appels à votre CRM avec scoring automatique et workflows.",
      recommendation: "Outils Payants (Talkdesk, Aircall)",
      reason: "Intégrations natives, API, automations avancées. Budget nécessaire."
    },
    {
      title: "Équipe tech avec ressources dev",
      description: "Vous avez une équipe de développeurs et souhaitez une solution 100% personnalisée.",
      recommendation: "Scripts Python ou OpenZyra (open source)",
      reason: "OpenZyra est open source et peut être forké, ou développez vos propres scripts."
    }
  ],

  seo: {
    title: "Alternatives à OpenZyra - Comparatif analyse téléphonie OVH",
    description: "Comparez OpenZyra avec Excel, OVH Manager, Power BI, et autres solutions d'analyse d'appels. Gratuit vs payant, client-side vs cloud.",
    keywords: "alternatives analyse appels, comparatif telephonie OVH, outils reporting appels, OpenZyra vs Excel, analyse CSV gratuite"
  }
};

// =============================================================================
// ICON MAPPING
// =============================================================================

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ArrowLeft, Check, X, Sparkles, Shield, DollarSign, Lock, Zap, BarChart3, Download, Clock, Users, Star,
  ChevronDown, ChevronUp, ExternalLink
};

const getIcon = (iconName: string, size: number = 24, className: string = '') => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon size={size} className={className} /> : <Sparkles size={size} className={className} />;
};

// =============================================================================
// COMPONENTS
// =============================================================================

const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-[#5087FF]/10 to-[#1F4597]/30" />
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5087FF]/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1F4597]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#5087FF]/10 to-[#1F4597]/10 rounded-full blur-3xl" />
  </div>
);

const StarRating: React.FC<{ score: number; max?: number }> = ({ score, max = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={`md:w-[14px] md:h-[14px] ${i < score ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} 
      />
    ))}
  </div>
);

const ValueDisplay: React.FC<{ value: boolean | string }> = ({ value }) => {
  if (value === true) {
    return (
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
        <Check size={18} className="text-emerald-600" />
      </div>
    );
  }
  if (value === false || value === "Non") {
    return (
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
        <X size={18} className="text-red-500" />
      </div>
    );
  }
  return (
    <span className="text-sm text-slate-600 font-medium">{value}</span>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AlternativesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [expandedAlt, setExpandedAlt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'comparison' | 'scores' | 'usecases'>('comparison');
  const [isVisible, setIsVisible] = useState(false);

  const data = ALTERNATIVES_DATA;

  useEffect(() => {
    document.title = data.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.seo.description);
    }
    // Animation d'entrée
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#5087FF]/10 to-[#1F4597]/30">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-50 w-full px-6 py-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-[#1F4597] transition-colors p-2 rounded-full hover:bg-[#5087FF]/10"
            >
              <ArrowLeft size={20} />
            </button>
            <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      <main className={`relative z-10 max-w-7xl mx-auto px-6 py-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Hero */}
        <section className="text-center mb-12">
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {data.introduction.description}
          </p>
        </section>

        {/* Tabs - Responsive avec scroll horizontal sur mobile */}
        <div className="flex justify-start md:justify-center gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 px-2 -mx-2 md:mx-0 scrollbar-hide">
          {[
            { id: 'comparison', label: 'Comparaison', icon: 'BarChart3' },
            { id: 'scores', label: 'Notation', icon: 'Star' },
            { id: 'usecases', label: 'Recommandations', icon: 'Users' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-none flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-[#1F4597] text-white shadow-lg shadow-[#5087FF]/25' 
                  : 'bg-white text-[#1F4597] hover:bg-[#5087FF]/10 border border-slate-200/50'
              }`}
            >
              {getIcon(tab.icon, 14, 'md:w-4 md:h-4')}
              {tab.label}
            </button>
          ))}
        </div>

        {/* OpenZyra Highlight Card */}
        <section className="mb-8 md:mb-12 px-2">
          <div className="group relative bg-gradient-to-br from-[#5087FF] via-[#5087FF] to-violet-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white shadow-2xl shadow-[#5087FF]/30 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_80px_rgba(99,102,241,0.4)] hover:scale-[1.01]">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            {/* Badge recommandé */}
            <div className="absolute -top-1 -right-1">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-4 md:py-1.5 rounded-bl-lg md:rounded-bl-xl rounded-tr-lg md:rounded-tr-xl shadow-lg flex items-center gap-1 md:gap-1.5">
                <Star size={12} className="md:w-[14px] md:h-[14px]" fill="currentColor" />
                <span className="hidden sm:inline">RECOMMANDÉ</span>
                <span className="sm:hidden">TOP</span>
              </div>
            </div>

            {/* Header */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-xl md:rounded-2xl blur-xl scale-110" />
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {getIcon(data.OpenZyra.icon, 24, 'md:w-8 md:h-8 text-white')}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg md:text-2xl font-bold">{data.OpenZyra.name}</h2>
                  <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-white/20 rounded text-[10px] md:text-xs font-medium border border-white/30">OPEN SOURCE</span>
                </div>
                <p className="text-[#5087FF]/50 text-xs md:text-base">{data.OpenZyra.tagline}</p>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#5087FF]/50 bg-clip-text text-transparent">{data.OpenZyra.price}</div>
                <div className="text-xs md:text-sm text-[#5087FF]/70">{data.OpenZyra.priceNote}</div>
              </div>
            </div>
            
            {/* Features Grid - responsive */}
            <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
              {Object.entries(data.OpenZyra.features).slice(0, 10).map(([key, value], idx) => (
                <div 
                  key={key} 
                  className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {typeof value === 'boolean' && value === true ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-emerald-400/30 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="md:w-3 md:h-3 text-emerald-300" />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-amber-300">{value}</span>
                  )}
                  <span className="text-[10px] md:text-sm text-white/90 font-medium truncate">{key}</span>
                </div>
              ))}
            </div>

            {/* CTA mini */}
            <div className="relative mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs md:text-sm text-[#5087FF]/50">
                <span className="font-semibold text-white">+15 000</span> analyses • <span className="font-semibold text-white">100%</span> satisfaits
              </p>
              <button 
                onClick={onBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm hover:bg-[#5087FF]/10 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Essayer maintenant
                <ArrowLeft size={14} className="md:w-4 md:h-4 rotate-180" />
              </button>
            </div>
          </div>
        </section>

        {/* Alternatives Cards */}
        {activeTab === 'comparison' && (
          <section className="space-y-4 md:space-y-6 mb-8 md:mb-12 px-2">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">Les alternatives</h2>
            
            {data.alternatives.map((alt) => (
              <div 
                key={alt.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-200/50 overflow-hidden"
              >
                {/* Header */}
                <div 
                  className="p-3 md:p-6 flex items-center gap-3 md:gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedAlt(expandedAlt === alt.id ? null : alt.id)}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-${alt.color}-100 flex items-center justify-center flex-shrink-0`}>
                    {getIcon(alt.icon, 20, `md:w-6 md:h-6 text-${alt.color}-600`)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base md:text-lg text-slate-900 truncate">{alt.name}</h3>
                    <p className="text-xs md:text-sm text-slate-500 truncate">{alt.tagline}</p>
                  </div>
                  <div className="text-right mr-2 md:mr-4 flex-shrink-0">
                    <div className="font-bold text-slate-900 text-sm md:text-base">{alt.price}</div>
                    <div className="text-[10px] md:text-xs text-slate-500 hidden sm:block">{alt.priceNote}</div>
                  </div>
                  {expandedAlt === alt.id ? (
                    <ChevronUp size={20} className="md:w-6 md:h-6 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="md:w-6 md:h-6 text-slate-400 flex-shrink-0" />
                  )}
                </div>

                {/* Expanded Content */}
                {expandedAlt === alt.id && (
                  <div className="px-3 md:px-6 pb-4 md:pb-6 border-t border-slate-100">
                    <p className="text-slate-600 my-3 md:my-4 text-sm">{alt.description}</p>
                    
                    {alt.examples && (
                      <div className="mb-3 md:mb-4">
                        <span className="text-xs md:text-sm font-medium text-slate-700">Exemples : </span>
                        <span className="text-xs md:text-sm text-slate-500">{alt.examples.join(', ')}</span>
                      </div>
                    )}

                    {/* Pros & Cons */}
                    {alt.pros && alt.cons && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className="bg-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4">
                          <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2 text-sm">
                            <Check size={16} className="md:w-[18px] md:h-[18px]" /> Avantages
                          </h4>
                          <ul className="space-y-1">
                            {alt.pros.map((pro, i) => (
                              <li key={i} className="text-xs md:text-sm text-emerald-700">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 rounded-lg md:rounded-xl p-3 md:p-4">
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm">
                            <X size={16} className="md:w-[18px] md:h-[18px]" /> Inconvénients
                          </h4>
                          <ul className="space-y-1">
                            {alt.cons.map((con, i) => (
                              <li key={i} className="text-xs md:text-sm text-red-700">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                      {Object.entries(alt.features).slice(0, 12).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 bg-slate-50 rounded-lg">
                          <div className="flex-shrink-0 scale-75 md:scale-100">
                            <ValueDisplay value={value} />
                          </div>
                          <span className="text-[10px] md:text-xs text-slate-600 truncate">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <section className="mb-12 px-2">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">{data.comparisonTable.title}</h2>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-slate-700">Solution</th>
                      {data.comparisonTable.criteria.map((criterion) => (
                        <th key={criterion.id} className="p-2 md:p-4 text-center text-xs md:text-sm font-semibold text-slate-700">
                          <div className="flex flex-col items-center gap-1">
                            {getIcon(criterion.icon, 16, 'md:w-[18px] md:h-[18px] text-[#5087FF]')}
                            <span className="text-[10px] md:text-xs">{criterion.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.comparisonTable.scores).map(([name, scores]) => (
                      <tr 
                        key={name} 
                        className={`border-b border-slate-100 ${name === 'OpenZyra' ? 'bg-[#5087FF]/5' : ''}`}
                      >
                        <td className="p-2 md:p-4">
                          <span className={`font-medium text-xs md:text-sm ${name === 'OpenZyra' ? 'text-blue-600' : 'text-slate-900'}`}>
                            {name}
                          </span>
                        </td>
                        {data.comparisonTable.criteria.map((criterion) => (
                          <td key={criterion.id} className="p-2 md:p-4 text-center">
                            <StarRating score={scores[criterion.id as keyof typeof scores] || 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-slate-500">
              Notation sur 5 étoiles : ⭐ = 1 étoile | ⭐⭐⭐⭐⭐ = 5 étoiles
            </div>
          </section>
        )}

        {/* Use Cases */}
        {activeTab === 'usecases' && (
          <section className="mb-12 px-2">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">Quelle solution choisir ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {data.useCases.map((useCase, idx) => (
                <div 
                  key={idx}
                  className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${
                    useCase.recommendation === 'OpenZyra' 
                      ? 'bg-gradient-to-br from-[#5087FF]/10 to-[#1F4597]/10 border-[#5087FF]/30' 
                      : 'bg-white/80 border-slate-200/50'
                  }`}
                >
                  <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2">{useCase.title}</h3>
                  <p className="text-slate-600 text-xs md:text-sm mb-3 md:mb-4">{useCase.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs md:text-sm text-slate-500">Recommandation :</span>
                    <span className={`font-semibold text-xs md:text-sm ${
                      useCase.recommendation === 'OpenZyra' ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      {useCase.recommendation}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 mt-2">{useCase.reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-8 md:py-12 px-2">
          <div className="bg-gradient-to-r from-[#5087FF] to-[#1F4597] rounded-xl md:rounded-2xl p-4 md:p-8 text-white inline-block max-w-2xl mx-auto">
            <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Prêt à essayer OpenZyra ?</h2>
            <p className="text-[#5087FF]/50 text-xs md:text-sm mb-4 md:mb-6">
              Gratuit, 100% privé, compatible avec tous les relevés CSV OVH.
            </p>
            <button
              onClick={onBack}
              className="w-full sm:w-auto bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:bg-[#5087FF]/10 transition-colors"
            >
              Commencer l'analyse →
            </button>
          </div>
        </section>

        {/* SEO Footer */}
        <footer className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-slate-200/50 px-2">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs md:text-sm text-slate-500 mb-2">{data.seo.description}</p>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 text-[10px] md:text-xs text-slate-400">
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

export default AlternativesPage;
