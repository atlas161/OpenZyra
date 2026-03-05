import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Sparkles,
  FileSpreadsheet,
  BarChart3,
  Filter,
  PieChart,
  Route,
  Download,
  Settings,
  Save,
  Layers,
  Shield,
  Table,
  Upload,
  BarChart2,
  Sliders,
  Lock,
  ChevronRight,
  Check,
  Clock,
  Phone,
  Share2,
  PhoneIncoming,
  Pause,
  X
} from 'lucide-react';

// =============================================================================
// DONNÉES EN DUR (HARDCODED) - Pas de fichier JSON
// =============================================================================

const FEATURES_DATA = {
  features: [
    {
      id: "analyse-csv-ovh",
      slug: "analyse-csv-ovh",
      title: "Analyse de Relevés CSV OVH",
      shortDescription: "Importez et analysez automatiquement vos relevés d'appels OVH au format CSV",
      fullDescription: "OpenZyra lit directement vos fichiers CSV OVH et extrait automatiquement toutes les informations pertinentes : dates, durées, numéros, statuts d'appel. Plus besoin de manipuler des tableaux Excel complexes.",
      icon: "FileSpreadsheet",
      category: "import",
      tags: ["csv", "ovh", "import", "automatique"],
      benefits: [
        "Import par simple glisser-déposer",
        "Support des fichiers CSV et ZIP",
        "Détection automatique des colonnes",
        "Encodage UTF-8 automatique",
        "Analyse instantanée sans upload serveur"
      ],
      details: {
        formats: ["CSV", "ZIP"],
        maxSize: "100MB",
        encoding: "UTF-8, ISO-8859-1",
        separator: "Point-virgule ou virgule"
      },
      seo: {
        keywords: "analyse csv ovh, releves appels csv, importer ovh, telephonie ovh analyse",
        metaDescription: "Analysez vos relevés d'appels OVH en CSV avec OpenZyra. Import automatique, statistiques instantanées, 100% privé."
      },
      order: 1
    },
    {
      id: "statistiques-temps-reel",
      slug: "statistiques-temps-reel",
      title: "Statistiques en Temps Réel",
      shortDescription: "Visualisez instantanément vos métriques clés avec des tableaux de bord interactifs",
      fullDescription: "Obtenez une vue d'ensemble complète de votre activité téléphonique en quelques secondes. OpenZyra calcule automatiquement toutes les statistiques essentielles pour évaluer la performance de votre groupe d'appel.",
      icon: "BarChart3",
      category: "analytics",
      tags: ["stats", "kpi", "metriques", "performance"],
      benefits: [
        "Taux de réponse en temps réel",
        "Temps d'attente moyen et maximum",
        "Nombre total d'appels analysés",
        "Distribution des statuts (Répondu/Manqué)",
        "Durée moyenne des conversations"
      ],
      stats: [
        { label: "Taux de Réponse", value: "94.2%", icon: "Phone" },
        { label: "Temps d'Attente Moyen", value: "12.5s", icon: "Clock" },
        { label: "Appels Analysés", value: "15,420", icon: "BarChart3" }
      ],
      seo: {
        keywords: "statistiques appels, metriques telephonie, taux reponse, analyse performance",
        metaDescription: "Tableaux de bord de statistiques téléphoniques en temps réel. Taux de réponse, temps d'attente, performance groupe d'appel."
      },
      order: 2
    },
    {
      id: "filtres-avances",
      slug: "filtres-avances",
      title: "Filtres Avancés",
      shortDescription: "Filtrez vos appels par date, heure, numéro, statut et lignes sollicitées",
      fullDescription: "Segmentez précisément vos données pour analyser des périodes spécifiques, identifier les appels d'un numéro particulier, ou isoler les appels manqués sur une ligne donnée. La combinaison de filtres permet une analyse granulaire.",
      icon: "Filter",
      category: "analytics",
      tags: ["filtres", "recherche", "segmentation", "analyse"],
      benefits: [
        "Filtre par plage de dates personnalisable",
        "Filtre par tranche horaire",
        "Recherche par numéro appelant",
        "Filtre par lignes sollicitées",
        "Filtrage par statut (Répondu/Manqué/Total)"
      ],
      filters: [
        { name: "Date", type: "range", example: "01/01/2026 - 31/01/2026" },
        { name: "Heure", type: "range", example: "08:00 - 18:00" },
        { name: "Appelant", type: "search", example: "+33 1 23 45 67 89" },
        { name: "Lignes", type: "multiselect", example: "SIP 1, SIP 2, NDI" }
      ],
      seo: {
        keywords: "filtres appels, recherche telephonique, segmentation donnees, analyse ciblee",
        metaDescription: "Filtres avancés pour analyser vos appels par date, heure, numéro et statut. Segmentation précise de vos données téléphoniques."
      },
      order: 3
    },
    {
      id: "graphiques-interactifs",
      slug: "graphiques-interactifs",
      title: "Graphiques Interactifs",
      shortDescription: "Visualisez vos données avec des graphiques horaires et journaliers détaillés",
      fullDescription: "Comprenez vos patterns d'appel grâce à des visualisations claires. Identifiez les pics d'activité, les plages horaires calmes, et les tendances sur plusieurs mois pour optimiser votre staffing.",
      icon: "PieChart",
      category: "analytics",
      tags: ["graphiques", "charts", "visualisation", "tendances"],
      benefits: [
        "Distribution horaire des appels (24h)",
        "Répartition journalière sur la période",
        "Identification des pics d'activité",
        "Visualisation des appels manqués vs répondus",
        "Graphiques responsive et interactifs"
      ],
      chartTypes: [
        { name: "Distribution Horaire", type: "bar", description: "Appels par heure sur 24h" },
        { name: "Évolution Journalière", type: "line", description: "Tendance sur la période sélectionnée" }
      ],
      seo: {
        keywords: "graphiques appels, visualisation telephonie, distribution horaire, tendances appels",
        metaDescription: "Graphiques interactifs pour visualiser vos statistiques d'appels. Distribution horaire, évolution journalière, pics d'activité."
      },
      order: 4
    },
    {
      id: "trace-appel-detaillee",
      slug: "trace-appel-detaillee",
      title: "Tracé d'Appel Détaillé",
      shortDescription: "Visualisez le parcours complet de chaque appel avec temps d'attente et transferts",
      fullDescription: "Cliquez sur n'importe quel appel pour voir sa trace complète : quand il a été reçu, sur quelles lignes, combien de temps en attente, qui a répondu, et la durée totale. Comprenez précisément ce qui s'est passé.",
      icon: "Route",
      category: "analytics",
      tags: ["trace", "details", "parcours", "appel"],
      benefits: [
        "Vue chronologique de l'appel",
        "Temps d'attente par étape",
        "Lignes sollicitées visuellement",
        "Identification du répondeur",
        "Durée de conversation finale"
      ],
      callSteps: [
        { step: 1, label: "Appel entrant", icon: "PhoneIncoming" },
        { step: 2, label: "Mise en attente", icon: "Pause" },
        { step: 3, label: "Distribution lignes", icon: "Share2" },
        { step: 4, label: "Réponse/Abandon", icon: "Phone" }
      ],
      seo: {
        keywords: "trace appel, parcours appel, detail appel, analyse appel par appel",
        metaDescription: "Visualisez le tracé détaillé de chaque appel. Temps d'attente, lignes sollicitées, transferts, durée de conversation."
      },
      order: 5
    },
    {
      id: "export-multiformats",
      slug: "export-multiformats",
      title: "Export Multi-Formats",
      shortDescription: "Exportez vos analyses en PDF, CSV, JSON ou ZIP complet",
      fullDescription: "Partagez vos rapports avec votre équipe ou archivez-les. OpenZyra génère des rapports professionnels incluant statistiques, graphiques et données brutes dans les formats standards du marché.",
      icon: "Download",
      category: "export",
      tags: ["export", "pdf", "csv", "rapport", "partage"],
      benefits: [
        "Export PDF avec graphiques et statistiques",
        "Export CSV des données filtrées",
        "Export ZIP complet (PDF + CSV + Config)",
        "Export JSON de la configuration",
        "Rapports professionnels prêts à partager"
      ],
      exportFormats: [
        { format: "PDF", content: "Stats, graphiques, tableau récapitulatif", useCase: "Présentation management" },
        { format: "CSV", content: "Données brutes filtrées", useCase: "Analyse Excel externe" },
        { format: "ZIP", content: "PDF + CSV + Fichier de config", useCase: "Archive complète" },
        { format: "JSON", content: "Configuration lignes et horaires", useCase: "Sauvegarde réutilisable" }
      ],
      seo: {
        keywords: "export rapports, pdf telephonie, export csv, partage statistiques",
        metaDescription: "Exportez vos analyses téléphoniques en PDF, CSV, ZIP ou JSON. Rapports professionnels avec statistiques et graphiques."
      },
      order: 6
    },
    {
      id: "configuration-lignes",
      slug: "configuration-lignes",
      title: "Configuration des Lignes",
      shortDescription: "Configurez vos lignes NDI et SIP avec leurs horaires d'ouverture",
      fullDescription: "Définissez précisément votre configuration téléphonique : quelles lignes sont des NDI (numéros principaux), quelles lignes sont des SIP (postes agents), et leurs horaires d'ouverture. OpenZyra adapte l'analyse à votre setup.",
      icon: "Settings",
      category: "configuration",
      tags: ["configuration", "ndi", "sip", "lignes", "setup"],
      benefits: [
        "Détection automatique des lignes depuis CSV",
        "Configuration NDI vs SIP",
        "Personnalisation des noms de lignes",
        "Définition des horaires d'ouverture",
        "Import/export de configuration"
      ],
      configOptions: [
        { type: "NDI", description: "Numéro de téléphone principal (ex: 01 23 45 67 89)", color: "blue" },
        { type: "SIP", description: "Ligne interne agent (ex: 100, 101, 102)", color: "green" },
        { type: "Horaires", description: "Heures d'ouverture par jour", color: "orange" }
      ],
      seo: {
        keywords: "configuration ovh, lignes sip, lignes ndi, parametres groupe appel",
        metaDescription: "Configurez vos lignes OVH (NDI/SIP) et horaires dans OpenZyra. Import automatique depuis fichier OVH ou manuel."
      },
      order: 7
    },
    {
      id: "sauvegarde-projets",
      slug: "sauvegarde-projets",
      title: "Sauvegarde de Projets",
      shortDescription: "Sauvegardez et rechargez vos analyses complètes avec un fichier ZIP",
      fullDescription: "Ne perdez jamais votre travail d'analyse. Exportez un projet complet contenant vos données brutes, votre configuration et vos filtres dans un fichier ZIP. Rechargez-le plus tard pour reprendre l'analyse exactement où vous l'avez laissée.",
      icon: "Save",
      category: "export",
      tags: ["sauvegarde", "projet", "zip", "archive"],
      benefits: [
        "Sauvegarde complète (données + config)",
        "Rechargement ultérieur instantané",
        "Partage d'analyses avec collègues",
        "Archivage mensuel/annuel",
        "Restauration exacte de l'état"
      ],
      projectContents: [
        "Données brutes des CSV importés",
        "Configuration des lignes et horaires",
        "Historique complet des appels",
        "Métadonnées de l'analyse"
      ],
      seo: {
        keywords: "sauvegarde analyse, projet openzyra, archivage telephonie, partage analyse",
        metaDescription: "Sauvegardez vos analyses complètes dans des fichiers ZIP. Données, configuration, filtres - tout est conservé pour rechargement futur."
      },
      order: 8
    },
    {
      id: "multi-fichiers",
      slug: "multi-fichiers",
      title: "Support Multi-Fichiers",
      shortDescription: "Importez plusieurs fichiers CSV simultanément pour une analyse consolidée",
      fullDescription: "Analysez des périodes étendues en important plusieurs mois de relevés en une seule fois. OpenZyra consolide automatiquement les données et détecte les groupes téléphoniques présents dans les différents fichiers.",
      icon: "Layers",
      category: "import",
      tags: ["multi-fichiers", "consolidation", "import multiple", "aggregation"],
      benefits: [
        "Import simultané de plusieurs CSV",
        "Détection automatique des groupes",
        "Consolidation chronologique",
        "Analyse sur plusieurs mois",
        "Gestion des doublons"
      ],
      supportedScenarios: [
        { scenario: "Plusieurs mois", example: "janvier.csv + février.csv + mars.csv" },
        { scenario: "Plusieurs groupes", example: "groupe1.csv + groupe2.csv" },
        { scenario: "Mix CSV/JSON", example: "data.csv + config.json (OVH)" }
      ],
      seo: {
        keywords: "import multiple csv, consolidation donnees, analyse multi mois, plusieurs fichiers",
        metaDescription: "Importez plusieurs fichiers CSV simultanément dans OpenZyra. Consolidation automatique pour analyse sur de longues périodes."
      },
      order: 9
    },
    {
      id: "100-prive",
      slug: "100-prive",
      title: "100% Privé & Client-Side",
      shortDescription: "Vos données ne quittent jamais votre navigateur, aucun serveur externe",
      fullDescription: "Contrairement à la plupart des outils d'analyse, OpenZyra fonctionne entièrement dans votre navigateur. Vos fichiers CSV contenant des données sensibles (numéros de téléphone, historique d'appels) ne sont jamais uploadés sur un serveur. Confidentialité totale garantie.",
      icon: "Shield",
      category: "security",
      tags: ["confidentialite", "securite", "client-side", "prive"],
      benefits: [
        "Aucun upload de données",
        "Traitement local dans le navigateur",
        "Aucune base de données externe",
        "Pas de compte requis",
        "Conformité RGPD naturelle"
      ],
      securityFeatures: [
        { feature: "Traitement Local", description: "Tout se passe dans votre navigateur" },
        { feature: "Pas de Cookies", description: "Aucun tracking ni publicité" },
        { feature: "Open Source", description: "Code transparent et vérifiable" },
        { feature: "Mémoire volatile", description: "Données effacées en fermant l'onglet" }
      ],
      seo: {
        keywords: "confidentialite donnees, analyse privee, client side, securite telephonie, rgpd",
        metaDescription: "Analyse 100% privée de vos relevés d'appels. Vos données ne quittent jamais votre navigateur. Aucun serveur, aucun upload, confidentialité totale."
      },
      order: 10
    },
    {
      id: "tableau-appels",
      slug: "tableau-appels",
      title: "Tableau d'Appels Interactif",
      shortDescription: "Consultez votre historique d'appels avec tri, pagination et filtres",
      fullDescription: "Parcourez votre historique d'appels complet dans un tableau performant. Triez par date, durée ou statut. Naviguez avec la pagination. Cliquez sur un appel pour voir sa trace détaillée. Exportez les résultats filtrés.",
      icon: "Table",
      category: "analytics",
      tags: ["tableau", "historique", "liste", "consultation"],
      benefits: [
        "Tri par colonne (date, durée, statut)",
        "Pagination pour grandes volumétries",
        "Recherche instantanée",
        "Clic pour détail d'appel",
        "Export des résultats filtrés"
      ],
      tableFeatures: [
        { feature: "Tri", columns: ["Date/Heure", "Appelant", "Durée", "Statut"] },
        { feature: "Pagination", itemsPerPage: "20, 50, 100 lignes" },
        { feature: "Filtres", options: ["Date", "Heure", "Numéro", "Statut"] }
      ],
      seo: {
        keywords: "tableau appels, historique telephonique, liste appels, consultation releves",
        metaDescription: "Tableau interactif de votre historique d'appels. Tri, pagination, filtres, et accès détaillé à chaque appel."
      },
      order: 11
    }
  ],
  categories: [
    { id: "import", name: "Import & Données", icon: "Upload", description: "Fonctionnalités d'import et gestion des fichiers" },
    { id: "analytics", name: "Analyse & Statistiques", icon: "BarChart2", description: "Visualisation et analyse des données" },
    { id: "export", name: "Export & Partage", icon: "Download", description: "Export des rapports et sauvegarde" },
    { id: "configuration", name: "Configuration", icon: "Sliders", description: "Paramétrage des lignes et options" },
    { id: "security", name: "Confidentialité", icon: "Lock", description: "Sécurité et protection des données" }
  ]
};

// =============================================================================
// TYPES
// =============================================================================

interface Feature {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  category: string;
  tags: string[];
  benefits: string[];
  screenshot?: string | null;
  details?: Record<string, any>;
  stats?: Array<{ label: string; value: string; icon: string }>;
  filters?: Array<{ name: string; type: string; example: string }>;
  chartTypes?: Array<{ name: string; type: string; description: string }>;
  callSteps?: Array<{ step: number; label: string; icon: string }>;
  exportFormats?: Array<{ format: string; content: string; useCase: string }>;
  configOptions?: Array<{ type: string; description: string; color: string }>;
  projectContents?: string[];
  supportedScenarios?: Array<{ scenario: string; example: string }>;
  securityFeatures?: Array<{ feature: string; description: string }>;
  tableFeatures?: Array<{ feature: string; columns?: string[]; itemsPerPage?: string; options?: string[] }>;
  seo: {
    keywords: string;
    metaDescription: string;
  };
  order: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FeaturesData {
  features: Feature[];
  categories: Category[];
}

// =============================================================================
// ICON MAPPING
// =============================================================================

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileSpreadsheet, BarChart3, Filter, PieChart, Route, Download, Settings, Save, Layers, Shield, Table,
  Upload, BarChart2, Sliders, Lock, Clock, Phone, Share2, PhoneIncoming, Pause, Check, X
};

const getIcon = (iconName: string, size: number = 24, className: string = '') => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon size={size} className={className} /> : <Sparkles size={size} className={className} />;
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  </div>
);

const CategoryCard: React.FC<{ category: Category; isActive: boolean; onClick: () => void }> = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-2xl text-left transition-all duration-300 ${
      isActive 
        ? 'bg-[#5087FF] text-white shadow-lg' 
        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/50'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
      isActive ? 'bg-white/20' : 'bg-[#5087FF]/10'
    }`}>
      {getIcon(category.icon, 20, isActive ? 'text-white' : 'text-blue-600')}
    </div>
    <h3 className="font-semibold text-sm">{category.name}</h3>
    <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
      {category.description}
    </p>
  </button>
);

const FeatureCard: React.FC<{ feature: Feature; onClick: () => void }> = ({ feature, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-6 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/50 hover:border-[#5087FF]/30 transition-all duration-300 group"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#5087FF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#5087FF]/20 transition-all">
        {getIcon(feature.icon, 24, 'text-[#5087FF]')}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-[#1F4597] transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2">{feature.shortDescription}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {feature.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </button>
);

const FeatureDetail: React.FC<{ feature: Feature; onBack: () => void }> = ({ feature, onBack }) => {
  useEffect(() => {
    document.title = `${feature.title} - OpenZyra`;
  }, [feature]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatedBackground />
      
      <header className="relative z-50 w-full px-6 py-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-[#1F4597] transition-colors p-2 rounded-full hover:bg-[#5087FF]/10"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-sm text-slate-500">Détail de la fonctionnalité</span>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur rounded-3xl p-8 border border-slate-200/50">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#5087FF] flex items-center justify-center flex-shrink-0">
              {getIcon(feature.icon, 32, 'text-white')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h1>
              <p className="text-slate-600">{feature.shortDescription}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none mb-8">
            <p className="text-slate-700 leading-relaxed">{feature.fullDescription}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Avantages</h2>
            <ul className="space-y-3">
              {feature.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {feature.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const FeaturesPage: React.FC<{ onBack: () => void; onOpenLegal?: () => void }> = ({ onBack, onOpenLegal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const data = FEATURES_DATA;

  // Filter features
  const filteredFeatures = useMemo(() => {
    let features = data.features;
    
    if (selectedCategory) {
      features = features.filter(f => f.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      features = features.filter(f => 
        f.title.toLowerCase().includes(query) ||
        f.shortDescription.toLowerCase().includes(query) ||
        f.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    return features.sort((a, b) => a.order - b.order);
  }, [searchQuery, selectedCategory, data.features]);

  // Update document title for SEO
  useEffect(() => {
    document.title = 'Fonctionnalités OpenZyra - Analyse téléphonique OVH';
    setIsVisible(true);
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Découvrez toutes les fonctionnalités de OpenZyra : analyse CSV OVH, statistiques temps réel, filtres avancés, export PDF, 100% privé.');
    }
  }, []);

  if (selectedFeature) {
    return <FeatureDetail feature={selectedFeature} onBack={() => setSelectedFeature(null)} />;
  }

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
                className="flex items-center gap-2 text-slate-600 hover:text-[#1F4597] transition-colors p-2 rounded-full hover:bg-[#5087FF]/10"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Fonctionnalités</h1>
                <p className="text-sm text-slate-500">Découvrez tout ce que OpenZyra peut faire pour vous</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une fonctionnalité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 border border-slate-200/50 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <main className={`relative z-10 max-w-7xl mx-auto px-6 py-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Parcourir par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                !selectedCategory 
                  ? 'bg-[#5087FF] text-white shadow-lg' 
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                !selectedCategory ? 'bg-white/20' : 'bg-[#5087FF]/10'
              }`}>
                <Sparkles size={20} className={!selectedCategory ? 'text-white' : 'text-blue-600'} />
              </div>
              <h3 className="font-semibold text-sm">Toutes</h3>
              <p className={`text-xs ${!selectedCategory ? 'text-blue-100' : 'text-slate-500'}`}>
                {data.features.length} fonctionnalités
              </p>
            </button>
            
            {data.categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedCategory 
                ? data.categories.find(c => c.id === selectedCategory)?.name 
                : 'Toutes les fonctionnalités'}
            </h2>
            <span className="text-sm text-slate-500">
              {filteredFeatures.length} résultat{filteredFeatures.length > 1 ? 's' : ''}
            </span>
          </div>
          
          {filteredFeatures.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onClick={() => setSelectedFeature(feature)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-500">Aucune fonctionnalité ne correspond à votre recherche</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>

        {/* SEO Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/50">
          <div className="text-center max-w-2xl mx-auto">
            <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="154" height="32" className="h-8 w-auto mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-4">
              Outil d'analyse de relevés d'appels OVH 100% gratuit et privé. 
              Importez vos CSV, visualisez vos statistiques, exportez vos rapports.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
              <span>© {new Date().getFullYear()} OpenZyra</span>
              <span>•</span>
              <button 
                onClick={onOpenLegal}
                className="hover:text-[#1F4597] transition-colors underline"
              >
                Mentions légales (GNU GPL v3)
              </button>
              <span>•</span>
              <a href="mailto:contact@openzyra.app" className="hover:text-[#1F4597] transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default FeaturesPage;
