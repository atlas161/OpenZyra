// =============================================================================
// OpenZyra - APPLICATION PRINCIPALE (index.tsx)
// =============================================================================
// Ce fichier est le point d'entrée de l'application React. Il contient:
// - La gestion d'état globale (useState pour tous les états)
// - La logique d'import CSV et parsing
// - La configuration téléphonique (NDI/SIP)
// - Les calculs de statistiques (useMemo pour les KPIs)
// - La génération PDF et les exports
// - Le routing conditionnel entre les différentes vues
//
// STRUCTURE DES ÉTATS (ordre d'apparition):
// 1. Données brutes et traitées (allRawRecords, data)
// 2. Sécurité (isPinVerified, showPinModal)
// 3. UI/UX (loading, error, isAnalyzing)
// 4. Upload et fichiers (pendingFiles, showUploadModal)
// 5. Génération rapports (isPdfGenerating, isZipGenerating)
// 6. Navigation UI (isSidebarOpen, isSidebarCollapsed)
// 7. Sélection et tracé d'appels (selectedCall, showCallTrace)
// 8. Configuration téléphonique (telephonyGroups, detectedLines, projectConfig)
// 9. Filtres et pagination (filters, dateRange, sortConfig, currentPage)
//
// FLUX PRINCIPAL:
// Upload CSV → parseCSV() → detectLines → ConfigModal → processSessions() → Stats
// =============================================================================

import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Filter } from 'lucide-react';

// Bibliothèques lourdes - chargées uniquement quand nécessaire
const html2canvas = () => import('html2canvas').then(m => m.default);
const pdfRenderer = () => import('@react-pdf/renderer').then(m => m.pdf);
const JSZip = () => import('jszip').then(m => m.default);
const saveAs = () => import('file-saver').then(m => m.saveAs);

// Types
import { RawRecord, SessionRecord, SortKey, SortDirection, Stats, ChartsData, FilterState, ProjectConfig, ProjectExport, LineConfig } from './types';

// Utilitaires
import { parseCSV } from './utils/csv';
import { processSessions } from './utils/processing';
import { formatDateTime, normalizePhoneNumber, formatDuration } from './utils/formatters';
import { defaultSchedule } from './utils/schedule';

// Composants CRITIQUES (chargés immédiatement - LCP)
import { ConfigModal } from './components/ConfigModal';
import { LandingPage } from './components/LandingPage';
import { LegalPage } from './components/LegalPage';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { CallTable } from './components/CallTable';
import { UploadModal } from './components/UploadModal';
import { AnalysisLoader } from './components/AnalysisLoader';
import { FilterBar } from './components/FilterBar';
import { Breadcrumb } from './components/Breadcrumb';

// Composants NON-CRITIQUES (lazy loaded - code splitting)
const Sidebar = lazy(() => import('./components/Sidebar').then(m => ({ default: m.Sidebar })));
const ChartsSection = lazy(() => import('./components/ChartsSection').then(m => ({ default: m.ChartsSection })));
const DocumentationPage = lazy(() => import('./components/DocumentationPage').then(m => ({ default: m.DocumentationPage })));
const HelpPage = lazy(() => import('./components/HelpPage').then(m => ({ default: m.HelpPage })));
const FeaturesPage = lazy(() => import('./components/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const TutorialsPage = lazy(() => import('./components/TutorialsPage').then(m => ({ default: m.TutorialsPage })));
const AlternativesPage = lazy(() => import('./components/AlternativesPage').then(m => ({ default: m.AlternativesPage })));
const FAQPage = lazy(() => import('./components/FAQPage').then(m => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const CallTraceModal = lazy(() => import('./components/CallTraceModal').then(m => ({ default: m.CallTraceModal })));
const ReportDocument = lazy(() => import('./components/pdf/ReportDocument').then(m => ({ default: m.ReportDocument })));

// =============================================================================
// ÉTAT GLOBAL DE L'APPLICATION
// =============================================================================
// Les états sont organisés par fonctionnalité. Tous les useState sont déclarés
// ici au début du composant pour faciliter la compréhension de la structure.
// =============================================================================

const App = () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // DONNÉES BRUTES ET TRAITÉES
  // ─────────────────────────────────────────────────────────────────────────────
  // allRawRecords: données CSV parsées avant traitement (format RawRecord)
  // data: sessions regroupées après processSessions() (format SessionRecord)
  // pendingRawRecords: données en attente de validation ConfigModal
  // ─────────────────────────────────────────────────────────────────────────────
  const [allRawRecords, setAllRawRecords] = useState<RawRecord[]>([]);
  const [pendingRawRecords, setPendingRawRecords] = useState<RawRecord[] | null>(null);
  const [data, setData] = useState<SessionRecord[]>([]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ÉTAT UI - Feedback utilisateur
  // ─────────────────────────────────────────────────────────────────────────────
  // loading: traitement en cours (spinner global)
  // error: message d'erreur à afficher
  // isAnalyzing: animation pendant l'analyse CSV
  // ─────────────────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // UPLOAD ET FICHIERS - Gestion des imports
  // ─────────────────────────────────────────────────────────────────────────────
  // pendingFiles: liste des fichiers sélectionnés avant analyse
  // showUploadModal: affichage du modal de sélection de fichiers
  // ─────────────────────────────────────────────────────────────────────────────
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // GÉNÉRATION DE RAPPORTS - PDF, ZIP, CSV, JSON
  // ─────────────────────────────────────────────────────────────────────────────
  // Ces flags bloquent l'UI pendant la génération des exports
  // ─────────────────────────────────────────────────────────────────────────────
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isZipGenerating, setIsZipGenerating] = useState(false);
  const [isCsvGenerating, setIsCsvGenerating] = useState(false);
  const [isJsonGenerating, setIsJsonGenerating] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // NAVIGATION UI - Sidebar responsive
  // ─────────────────────────────────────────────────────────────────────────────
  // isSidebarOpen: sidebar visible (mobile)
  // isSidebarCollapsed: sidebar réduite (desktop)
  // isExiting: animation de sortie avant reset
  // ─────────────────────────────────────────────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // TRACÉ D'APPELS - Modal de détail
  // ─────────────────────────────────────────────────────────────────────────────
  // selectedCall: appel cliqué dans le tableau
  // showCallTrace: affichage du modal avec le tracé détaillé
  // ─────────────────────────────────────────────────────────────────────────────
  const [selectedCall, setSelectedCall] = useState<SessionRecord | null>(null);
  const [showCallTrace, setShowCallTrace] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // CONFIGURATION TÉLÉPHONIQUE
  // ─────────────────────────────────────────────────────────────────────────────
  // telephonyGroups: groupes détectés depuis les noms de fichiers (ex: ga123456-ovh-1)
  // detectedLines: lignes uniques trouvées dans le CSV
  // projectConfig: configuration NDI/SIP/horaires (core du traitement)
  // showDocs: affichage de la page de documentation
  // ─────────────────────────────────────────────────────────────────────────────
  const [telephonyGroups, setTelephonyGroups] = useState<string[]>([]);
  const [detectedLines, setDetectedLines] = useState<string[]>([]);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showTutorials, setShowTutorials] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTRES ET PAGINATION
  // ─────────────────────────────────────────────────────────────────────────────
  // dateRange: plage de dates globale (sidebar)
  // sortConfig: tri du tableau (colonne + direction)
  // currentPage: page actuelle du tableau paginé
  // filters: filtres granulaires (barre de filtres)
  // ─────────────────────────────────────────────────────────────────────────────
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState<{key: SortKey, direction: SortDirection}>({ key: 'datetime', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 100;  // Nombre de lignes par page dans le tableau

  const [filters, setFilters] = useState<FilterState>({
    date: '',
    timeStart: '',
    timeEnd: '',
    caller: '',
    called: '',
    status: 'all'
  });

  // =============================================================================
  // CALCUL DES STATISTIQUES ET FILTRAGE (useMemo)
  // =============================================================================
  // Ce useMemo est le cœur de l'analyse. Il calcule:
  // 1. Les données filtrées selon les critères actifs
  // 2. Tous les KPIs (taux, durées, moyennes)
  // 3. Les données pour les graphiques (horaire et journalier)
  //
  // Dépendances: [data, dateRange, filters] → recalculé à chaque changement
  // =============================================================================
  const { filteredData, stats, charts } = useMemo(() => {
    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 1: Application des filtres
    // ─────────────────────────────────────────────────────────────────────────
    let filtered = data;

    // 1.1 Filtre plage de dates (sidebar)
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);  // Inclure toute la journée de fin
      filtered = filtered.filter(d => d.datetime >= start && d.datetime <= end);
    }

    // 1.2 Filtres granulaires (barre de filtres)
    filtered = filtered.filter(row => {
        // Statut
        if (filters.status !== 'all' && row.status !== filters.status) return false;

        // Date (partielle - recherche dans JJ/MM/AAAA)
        if (filters.date) {
            const rowDate = formatDateTime(row.datetime).split(' ')[0];
            if (!rowDate.includes(filters.date)) return false;
        }

        // Plage horaire (conversion en minutes depuis minuit)
        if (filters.timeStart || filters.timeEnd) {
            const rowMinutes = row.datetime.getHours() * 60 + row.datetime.getMinutes();
            if (filters.timeStart) {
                const [h, m] = filters.timeStart.split(':').map(Number);
                if (rowMinutes < h * 60 + m) return false;
            }
            if (filters.timeEnd) {
                const [h, m] = filters.timeEnd.split(':').map(Number);
                if (rowMinutes > h * 60 + m) return false;
            }
        }

        // Appelant (recherche partielle, insensible à la casse)
        if (filters.caller && !row.callingNumber.toLowerCase().includes(filters.caller.toLowerCase())) return false;

        // Appelé (recherche dans lignes impliquées, répondeurs et NDI principal)
        if (filters.called) {
            const term = filters.called.toLowerCase();
            const involved = row.involvedLines.join(' ').toLowerCase();
            const answeredBy = (row.answeredBy || []).join(' ').toLowerCase();
            const mainNdi = row.phoneLine.toLowerCase();

            if (!involved.includes(term) && !answeredBy.includes(term) && !mainNdi.includes(term)) return false;
        }

        return true;
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 2: Séparation des appels pendant/hors horaires d'ouverture
    // ─────────────────────────────────────────────────────────────────────────
    // Les KPIs principaux ne concernent QUE les heures d'ouverture
    // Les appels "Hors Ouverture" sont comptés séparément
    const businessCalls = filtered.filter(d => d.status === 'Répondu' || d.status === 'Manqué');
    const outsideCalls = filtered.filter(d => d.status === 'Hors Ouverture');

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 3: Calcul des compteurs de base
    // ─────────────────────────────────────────────────────────────────────────
    const totalCalls = businessCalls.length;
    const answered = businessCalls.filter(d => d.status === 'Répondu');
    const missed = businessCalls.filter(d => d.status === 'Manqué');

    const answeredCount = answered.length;
    const missedCount = missed.length;

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 4: Calcul des durées
    // ─────────────────────────────────────────────────────────────────────────
    // Durée totale = somme des durées pendant les heures d'ouverture
    const totalDuration = businessCalls.reduce((acc, curr) => acc + curr.duration, 0);

    // Durée moyenne d'appel = Durée totale / Nombre d'appels
    const avgCallDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

    // Temps d'attente moyen (uniquement sur les appels répondus)
    const totalAnsweredWaitTime = answered.reduce((acc, curr) => acc + curr.waitTime, 0);
    const avgAnsweredWaitTime = answeredCount > 0 ? totalAnsweredWaitTime / answeredCount : 0;

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 5: Calcul des taux (pourcentages)
    // ─────────────────────────────────────────────────────────────────────────
    const answeredRate = totalCalls > 0 ? (answeredCount / totalCalls) * 100 : 0;
    const missedRate = totalCalls > 0 ? (missedCount / totalCalls) * 100 : 0;

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 6: Classement des agents (Top 10)
    // ─────────────────────────────────────────────────────────────────────────
    // Agrégation par nom d'agent (SIP) sur les appels répondus uniquement
    const agentsMap: Record<string, number> = {};
    answered.forEach(call => {
      call.answeredBy?.forEach(agent => {
        if (!agentsMap[agent]) agentsMap[agent] = 0;
        agentsMap[agent]++;
      });
    });

    const topAgents = Object.entries(agentsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 7: Top 10 des appelants (pendant heures d'ouverture uniquement)
    // ─────────────────────────────────────────────────────────────────────────
    const callersMap: Record<string, { count: number, answered: number, missed: number }> = {};
    businessCalls.forEach(call => {
        const caller = call.callingNumber;
        if (!callersMap[caller]) {
            callersMap[caller] = { count: 0, answered: 0, missed: 0 };
        }
        callersMap[caller].count++;
        if (call.status === 'Répondu') {
            callersMap[caller].answered++;
        } else {
            callersMap[caller].missed++;
        }
    });

    const topCallers = Object.entries(callersMap)
        .map(([number, data]) => ({ number, count: data.count, answered: data.answered, missed: data.missed }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 8: Moyenne globale d'appels par jour
    // ─────────────────────────────────────────────────────────────────────────
    // Calculée sur l'ensemble des données (non filtré) pour donner une référence
    const allUniqueDates = new Set(data.map(d => d.dateStr));
    const totalDays = allUniqueDates.size || 1;
    const avgCallsPerDay = data.length / totalDays;

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 9: Statistiques horaires (adaptées à la plage filtrée)
    // ─────────────────────────────────────────────────────────────────────────
    const filteredUniqueDates = new Set(filtered.map(d => d.dateStr));
    const filteredDaysCount = filteredUniqueDates.size || 1;

    const callsInsideHours = filtered.filter(d => d.isBusinessHour).length;
    const callsOutsideHours = filtered.filter(d => !d.isBusinessHour).length;

    const avgCallsInsideHours = callsInsideHours / filteredDaysCount;
    const avgCallsOutsideHours = callsOutsideHours / filteredDaysCount;

    const totalMissedOutsideHours = outsideCalls.length;

    // ─────────────────────────────────────────────────────────────────────────
    // ÉTAPE 10: Préparation des données pour les graphiques
    // ─────────────────────────────────────────────────────────────────────────
    // 10.1 Distribution horaire (24 barres, une par heure)
    const hourlyMap = new Array(24).fill(0).map((_, i) => ({
      hour: `${i}h`,
      rawHour: i,
      Répondu: 0,
      Manqué: 0,
      HorsOuverture: 0
    }));

    filtered.forEach(d => {
      if (d.status === 'Répondu') hourlyMap[d.hour].Répondu++;
      else if (d.status === 'Manqué') hourlyMap[d.hour].Manqué++;
      else if (d.status === 'Hors Ouverture') hourlyMap[d.hour].HorsOuverture++;
    });

    // 10.2 Distribution journalière (une barre par jour avec données)
    const dailyMap: Record<string, { date: string, Répondu: number, Manqué: number, HorsOuverture: number }> = {};
    filtered.forEach(d => {
      if (!dailyMap[d.dateStr]) {
        dailyMap[d.dateStr] = { date: d.dateStr, Répondu: 0, Manqué: 0, HorsOuverture: 0 };
      }
      if (d.status === 'Répondu') dailyMap[d.dateStr].Répondu++;
      else if (d.status === 'Manqué') dailyMap[d.dateStr].Manqué++;
      else if (d.status === 'Hors Ouverture') dailyMap[d.dateStr].HorsOuverture++;
    });
    const dailyData = Object.values(dailyMap).sort((a,b) => a.date.localeCompare(b.date));

    // 10.3 Distribution globale (donut chart)
    const distributionData = [
      { name: 'Répondus', value: answeredCount, color: '#22C55E' },
      { name: 'Manqués', value: missedCount, color: '#EF4444' },
      { name: 'Hors Ouverture', value: outsideCalls.length, color: '#94A3B8' }
    ].filter(d => d.value > 0);

    // 10.4 Taux de réponse journalier (line chart)
    const dailyRateData = dailyData.map(d => {
      const total = d.Répondu + d.Manqué;
      const rate = total > 0 ? (d.Répondu / total) * 100 : 0;
      return { date: d.date, rate: Math.round(rate * 10) / 10 };
    });

    // ─────────────────────────────────────────────────────────────────────────
    // RETOUR: données filtrées, stats et graphiques
    // ─────────────────────────────────────────────────────────────────────────
    return {
      filteredData: filtered,
      stats: {
          totalCalls,
          answeredCount,
          answeredRate,
          missedCount,
          missedRate,
          totalDuration,
          avgCallDuration,
          avgAnsweredWaitTime,
          topAgents,
          avgCallsPerDay,
          topCallers,
          avgCallsInsideHours,
          avgCallsOutsideHours,
          totalMissedOutsideHours
      },
      charts: { hourly: hourlyMap, daily: dailyData, distribution: distributionData, dailyRate: dailyRateData }
    };
  }, [data, dateRange, filters]);

  // =============================================================================
  // GESTION DE LA NAVIGATION - Historique navigateur (bouton retour)
  // =============================================================================
  // Permet d'utiliser le bouton retour/avant du navigateur entre les pages
  // Utilise window.location.hash pour synchroniser l'état avec l'URL
  // =============================================================================

  // Mapping des hashes vers les états de page
  const pageStates: Record<string, { 
    docs: boolean; 
    tutorials: boolean; 
    features: boolean; 
    alternatives: boolean; 
    faq: boolean; 
    contact: boolean; 
    legal: boolean;
    dashboard: boolean;
  }> = {
    'home': { docs: false, tutorials: false, features: false, alternatives: false, faq: false, contact: false, legal: false, dashboard: false },
    'dashboard': { docs: false, tutorials: false, features: false, alternatives: false, faq: false, contact: false, legal: false, dashboard: true },
    'docs': { docs: true, tutorials: false, features: false, alternatives: false, faq: false, contact: false, legal: false, dashboard: false },
    'tutorials': { docs: false, tutorials: true, features: false, alternatives: false, faq: false, contact: false, legal: false, dashboard: false },
    'features': { docs: false, tutorials: false, features: true, alternatives: false, faq: false, contact: false, legal: false, dashboard: false },
    'alternatives': { docs: false, tutorials: false, features: false, alternatives: true, faq: false, contact: false, legal: false, dashboard: false },
    'faq': { docs: false, tutorials: false, features: false, alternatives: false, faq: true, contact: false, legal: false, dashboard: false },
    'contact': { docs: false, tutorials: false, features: false, alternatives: false, faq: false, contact: true, legal: false, dashboard: false },
    'legal': { docs: false, tutorials: false, features: false, alternatives: false, faq: false, contact: false, legal: true, dashboard: false },
  };

  // Fonction pour naviguer vers une page et mettre à jour l'historique
  const navigateToPage = (page: string) => {
    const hash = page === 'home' ? '' : `#${page}`;
    if (window.location.hash !== hash) {
      window.history.pushState({ page }, '', hash);
    }
    updatePageState(page);
  };

  // Met à jour les états React selon la page
  const updatePageState = (page: string) => {
    const state = pageStates[page] || pageStates['home'];
    setShowDocs(state.docs);
    setShowTutorials(state.tutorials);
    setShowFeatures(state.features);
    setShowAlternatives(state.alternatives);
    setShowFAQ(state.faq);
    setShowContact(state.contact);
    setShowLegal(state.legal);
  };

  // Navigation automatique vers le dashboard quand des données sont chargées
  useEffect(() => {
    if (allRawRecords.length > 0 && !loading && !pendingRawRecords) {
      // Si on a des données et qu'on n'est pas déjà sur le dashboard, mettre à jour l'URL
      const currentHash = window.location.hash.slice(1);
      if (currentHash !== 'dashboard' && !pageStates[currentHash]?.dashboard) {
        window.history.pushState({ page: 'dashboard' }, '', '#dashboard');
      }
    }
  }, [allRawRecords.length, loading, pendingRawRecords]);

  // Initialisation: lire l'URL au chargement
  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'home';
    updatePageState(hash);
  }, []);

  // Écouter les changements d'historique (bouton retour/avant)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const hash = window.location.hash.slice(1) || 'home';
      updatePageState(hash);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- Fonctions de navigation publiques ---
  const onOpenDocs = () => navigateToPage('docs');
  const onOpenTutorials = () => navigateToPage('tutorials');
  const onOpenFeatures = () => navigateToPage('features');
  const onOpenAlternatives = () => navigateToPage('alternatives');
  const onOpenFAQ = () => navigateToPage('faq');
  const onOpenContact = () => navigateToPage('contact');
  const onOpenLegal = () => navigateToPage('legal');
  const onBackToHome = () => window.history.back();

  // --- Gestionnaires ---

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Vérifier si c'est un fichier ZIP (projet)
    const isZip = files[0].name.toLowerCase().endsWith('.zip');
    
    if (isZip) {
      if (files.length > 1) {
        alert("Veuillez ne sélectionner qu'un seul fichier de projet (.zip) à la fois.");
        event.target.value = '';
        return;
      }
      
      setIsAnalyzing(true);
      setError(null);
      
      try {
        const JSZipClass = await JSZip();
        const zip = new JSZipClass();
        const zipContent = await zip.loadAsync(files[0]);
        
        const projectFile = zipContent.file("project.json");
        if (!projectFile) {
          throw new Error("Ce fichier ZIP ne semble pas être un projet OpenZyra valide.");
        }
        
        const projectDataStr = await projectFile.async("string");
        const exportData: ProjectExport = JSON.parse(projectDataStr);
        
        if (!exportData.config || !exportData.rawRecords) {
          throw new Error("Le fichier de projet est corrompu ou incomplet.");
        }

        // Restaurer les données (avec conversion des dates en objets Date)
        const recordsWithDates = exportData.rawRecords.map(r => ({
          ...r,
          datetime: new Date(r.datetime)
        }));
        
        setAllRawRecords(recordsWithDates);
        setProjectConfig(exportData.config);
        
        const lines = Array.from(new Set(recordsWithDates.map(r => r.phoneLine))).sort();
        setDetectedLines(lines);
        
        // Déduire les groupes à partir du NDI principal
        const groupMatch = exportData.config.mainNdi.match(/[-_]?(\d+)(?:[.-]|$)/);
        if (groupMatch && groupMatch[1]) {
           setTelephonyGroups([groupMatch[1]]);
        }
        
        // Re-générer les sessions
        const sessions = processSessions(recordsWithDates, exportData.config);
        setData(sessions);
        
        // Restaurer la plage de dates
        if (sessions.length > 0) {
          const sortedAsc = [...sessions].sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
          setDateRange({
            start: sortedAsc[0].dateStr,
            end: sortedAsc[sortedAsc.length - 1].dateStr
          });
        }
        
      } catch (err) {
        console.error("Erreur lors de l'import du projet:", err);
        setError(err instanceof Error ? err.message : "Erreur lors de la lecture du fichier de projet.");
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Comportement normal pour les CSV
      setPendingFiles(prev => [...prev, ...Array.from(files)]);
      setShowUploadModal(true);
    }

    // Réinitialiser l'entrée
    event.target.value = '';
  };

  const handleAddMoreFiles = (fileList: FileList) => {
      setPendingFiles(prev => [...prev, ...Array.from(fileList)]);
  };

  const handleRemoveFile = (index: number) => {
      setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancelUpload = () => {
      setPendingFiles([]);
      setShowUploadModal(false);
  };

  const handleStartAnalysis = async () => {
    if (pendingFiles.length === 0) return;

    setShowUploadModal(false);
    setIsAnalyzing(true);
    setError(null);

    // Délai artificiel pour montrer l'animation
    const startTime = Date.now();

    try {
      let parsedRecords: RawRecord[] = [];
      let loadedConfig: ProjectConfig | null = null;
      const groupsFound = new Set<string>();

      const filePromises = pendingFiles.map(file => {
        return new Promise<void>((resolve, reject) => {
          const nameMatch = file.name.match(/[-_](\d+)(?:[.-]|$)/);
          if (nameMatch && nameMatch[1]) groupsFound.add(nameMatch[1]);

          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string;
              
              if (file.name.toLowerCase().endsWith('.json')) {
                  // Parsing Configuration
                  try {
                      const jsonContent = JSON.parse(content);
                      
                      // Détection Format Inventaire OVH (lines_sip, lines_ndi...)
                      if (Array.isArray(jsonContent.lines_sip) || Array.isArray(jsonContent.lines_ndi)) {
                          console.log("Format Inventaire OVH détecté");
                          
                          const lines: Record<string, LineConfig> = {};
                          let potentialMainNdi = '';

                          // Helper pour normaliser les numéros (0033 -> +33) pour matcher le CSV
                          // UTILISATION DU FORMATTER PARTAGÉ
                          

                          // Traitement des lignes SIP
                          if (Array.isArray(jsonContent.lines_sip)) {
                              jsonContent.lines_sip.forEach((l: any) => {
                                  if (l.serviceName) {
                                      const normalizedNumber = normalizePhoneNumber(l.serviceName);
                                      lines[normalizedNumber] = {
                                          number: normalizedNumber,
                                          type: 'SIP',
                                          name: l.description || normalizedNumber
                                      };
                                  }
                              });
                          }

                          // Traitement des lignes NDI
                          if (Array.isArray(jsonContent.lines_ndi)) {
                              jsonContent.lines_ndi.forEach((l: any) => {
                                  if (l.serviceName) {
                                      const normalizedNumber = normalizePhoneNumber(l.serviceName);
                                      lines[normalizedNumber] = {
                                          number: normalizedNumber,
                                          type: 'NDI',
                                          name: l.description || normalizedNumber
                                      };
                                      
                                      // Tentative de détection du NDI principal
                                      // 1. Si la description contient "NDI" (et pas Fax)
                                      if (!potentialMainNdi && l.description && l.description.toLowerCase().includes('ndi')) {
                                          potentialMainNdi = normalizedNumber;
                                      }
                                  }
                              });
                              // Si aucun NDI détecté par description, on prend le premier de la liste
                              if (!potentialMainNdi && jsonContent.lines_ndi.length > 0) {
                                  potentialMainNdi = normalizePhoneNumber(jsonContent.lines_ndi[0].serviceName);
                              }
                          }

                          loadedConfig = {
                              mainNdi: potentialMainNdi,
                              lines: lines,
                              schedule: defaultSchedule
                          };

                      } else {
                          // Format Standard OpenZyra
                          loadedConfig = jsonContent;
                      }
                  } catch (e) {
                      throw new Error(`Le fichier de configuration ${file.name} est invalide.`);
                  }
              } else {
                  // Parsing Data (CSV)
                  const records = parseCSV(content);
                  // Utilisation de concat ou boucle pour éviter "Maximum call stack size exceeded" avec le spread (...)
                  parsedRecords = parsedRecords.concat(records);
              }
              resolve();
            } catch (err) { reject(err); }
          };
          reader.onerror = () => reject(new Error(`Erreur de lecture du fichier ${file.name}`));
          reader.readAsText(file);
        });
      });

      await Promise.all(filePromises);

      // Assurer un temps d'animation minimum
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
      }

      // SCENARIO 1: Config Only (JSON sans CSV)
      if (parsedRecords.length === 0 && loadedConfig) {
          setProjectConfig(loadedConfig);
          setTelephonyGroups(Array.from(groupsFound).sort());
          alert("Configuration chargée avec succès. Veuillez maintenant importer le fichier CSV de données.");
          setIsAnalyzing(false);
          setPendingFiles([]);
          return;
      }

      if (parsedRecords.length === 0) throw new Error("Aucune donnée valide trouvée.");

      setTelephonyGroups(Array.from(groupsFound).sort());
      
      // Store parsed records temporarily until config is applied
      setPendingRawRecords(parsedRecords);
      
      const csvLines = Array.from(new Set(parsedRecords.map(r => r.phoneLine))).sort();
      setDetectedLines(csvLines);
      
      // Determine Configuration to use (Loaded > Existing > Default)
      let configToApply = loadedConfig || projectConfig;

      // Smart Merge Logic
      let shouldShowConfig = true;

      if (configToApply) {
          // Compare CSV lines with Config lines
          const configLines = Object.keys(configToApply.lines).sort();
          const isMatch = JSON.stringify(csvLines) === JSON.stringify(configLines);

          if (isMatch) {
              console.log("Smart Merge: Config matches Data. Applying automatically.");
              shouldShowConfig = false;
          } else {
              console.log("Smart Merge: Mismatch detected. Opening Config Modal.");
              // We keep configToApply as the basis, but user must validate
          }
      } else {
          // Default Config Setup
          configToApply = {
            mainNdi: csvLines.length > 0 ? csvLines[0] : '',
            lines: csvLines.reduce((acc, line) => {
              acc[line] = { number: line, type: line === csvLines[0] ? 'NDI' : 'UNKNOWN', name: '' };
              return acc;
            }, {} as Record<string, LineConfig>),
            schedule: defaultSchedule
          };
      }
      
      setProjectConfig(configToApply);

      // Réinitialiser les filtres au démarrage d'une nouvelle analyse
      setFilters({
        date: '',
        timeStart: '',
        timeEnd: '',
        caller: '',
        called: '',
        status: 'all'
      });

      if (shouldShowConfig) {
        setShowConfig(true);
        // Reset data view until config is applied
        setData([]);
        // IMPORTANT: Sortir ici pour éviter que le finally ne réinitialise l'état
        // et ne redirige vers la landing page
        setPendingFiles([]);
        return;
      } else {
        // Auto-apply with records passed directly
        applyConfiguration(configToApply, parsedRecords);
      }

      // Effacer les fichiers en attente après succès
      setPendingFiles([]);

    } catch (err) {
      console.error("Detailed Error:", err);
      if (err instanceof Error) {
          console.error("Message:", err.message);
          console.error("Stack:", err.stack);
      }
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
      setPendingFiles([]);
    } finally {
      setIsAnalyzing(false);
      setLoading(false);
    }
  };

  const applyConfiguration = (config: ProjectConfig, records?: RawRecord[]) => {
    setLoading(true);
    setProjectConfig(config);
    
    // Déterminer quels records utiliser
    let recordsToProcess: RawRecord[];
    
    if (records) {
      recordsToProcess = records;
    } else if (pendingRawRecords) {
      recordsToProcess = pendingRawRecords;
    } else {
      recordsToProcess = allRawRecords;
    }
    
    // Petite pause pour laisser l'UI se mettre à jour avant le traitement lourd
    setTimeout(() => {
      try {
        console.log("Starting session processing with config:", config);
        const sessions = processSessions(recordsToProcess, config);
        console.log("Session processing complete. Sessions found:", sessions.length);
        
        // Commit records to allRawRecords
        if (records) {
          setAllRawRecords(records);
        } else if (pendingRawRecords) {
          setAllRawRecords(pendingRawRecords);
          setPendingRawRecords(null);
        }
        
        setData(sessions);
        setShowConfig(false);
        
        // Scroll to top when showing analysis
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Mettre à jour la plage de dates une fois les données traitées
        if (sessions.length > 0) {
          const sortedAsc = [...sessions].sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
          setDateRange({
            start: sortedAsc[0].dateStr,
            end: sortedAsc[sortedAsc.length - 1].dateStr
          });
        }
      } catch (err) {
        console.error("Error processing sessions:", err);
        setError("Une erreur est survenue lors du traitement des données. Veuillez vérifier la configuration.");
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const handleReset = () => {
    // Animation de sortie
    setIsExiting(true);
    
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Attendre la fin de l'animation avant de reset
    setTimeout(() => {
      setAllRawRecords([]);
      setPendingRawRecords(null);
      setData([]);
      setTelephonyGroups([]);
      setDetectedLines([]);
      setProjectConfig(null);
      setDateRange({ start: '', end: '' });
      setError(null);
      setSortConfig({ key: 'datetime', direction: 'desc' });
      setCurrentPage(1);
      setLoading(false);
      setPendingFiles([]);
      setFilters({
        date: '',
        timeStart: '',
        timeEnd: '',
        caller: '',
        called: '',
        status: 'all'
      });
      setIsExiting(false);
      // Revenir à la page d'accueil dans l'historique
      navigateToPage('home');
    }, 500);
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    setIsCsvGenerating(true);

    try {
      const headers = ['Date', 'Heure', 'Appelant', 'Ligne(s) sollicitée(s)', 'Répondu Par', 'Temps d\'attente (s)', 'Durée (s)', 'Statut'];
      const rows = filteredData.map(row => [
        row.dateStr,
        formatDateTime(row.datetime).split(' ')[1],
        row.callingNumber,
        row.involvedLines.join(' + '),
        row.status === 'Répondu' 
          ? (row.answeredBy && row.answeredBy.length > 0 ? row.answeredBy.join(' + ') : 'Inconnu') 
          : '-',
        row.waitTime.toString(),
        row.duration.toString(),
        row.status
      ]);
      const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `rapport_appels_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsCsvGenerating(false);
    }
  };

  const handleExportZip = async () => {
    if (!projectConfig || allRawRecords.length === 0) {
      alert("Impossible d'exporter : configuration ou données manquantes.");
      return;
    }

    setIsZipGenerating(true);

    try {
      const JSZipClass = await JSZip();
      const zip = new JSZipClass();
      const dateStr = new Date().toISOString().slice(0,10);
      
      // 1. Configuration JSON
      const exportData: ProjectExport = {
        config: projectConfig,
        rawRecords: allRawRecords
      };
      zip.file("config.json", JSON.stringify(exportData, null, 2));
      
      // 2. Données CSV
      const headers = ['Date', 'Heure', 'Appelant', 'Statut', 'Répondu Par', 'Temps Attente', 'Durée', 'Lignes Sollicitées'];
      const rows = filteredData.map(row => [
        row.dateStr,
        formatDateTime(row.datetime).split(' ')[1],
        row.callingNumber,
        row.status,
        row.answeredBy || '-',
        formatDuration(row.waitTime || 0),
        formatDuration(row.duration || 0),
        row.involvedLines.join(' + ')
      ]);
      const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
      zip.file(`donnees_${dateStr}.csv`, csvContent);
      
      // 3. Rapport PDF
      setIsPdfGenerating(true);
      try {
        // Charger le logo
        let logoData = null;
        try {
            const logoResponse = await fetch('/medias/logo.png');
            const logoBlob = await logoResponse.blob();
            logoData = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(logoBlob);
            });
        } catch (e) {
            console.warn('Impossible de charger le logo:', e);
        }

        const hourlyChartEl = document.getElementById('chart-hourly');
        const dailyChartEl = document.getElementById('chart-daily');
        const distributionChartEl = document.getElementById('chart-distribution');
        const dailyRateChartEl = document.getElementById('chart-daily-rate');
        let hourlyImg = null;
        let dailyImg = null;
        let distributionImg = null;
        let dailyRateImg = null;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const h2c = await html2canvas();
        const canvas = await h2c(hourlyChartEl, { scale: 2, logging: false, backgroundColor: '#ffffff' });
        hourlyImg = canvas.toDataURL('image/png');
        if (dailyChartEl) {
            const h2c = await html2canvas();
            const canvas = await h2c(dailyChartEl, { scale: 2, logging: false, backgroundColor: '#ffffff' });
            dailyImg = canvas.toDataURL('image/png');
        }
        if (distributionChartEl) {
            const h2c = await html2canvas();
            const canvas = await h2c(distributionChartEl, { scale: 2, logging: false, backgroundColor: '#ffffff' });
            distributionImg = canvas.toDataURL('image/png');
        }
        if (dailyRateChartEl) {
            const h2c = await html2canvas();
            const canvas = await h2c(dailyRateChartEl, { scale: 2, logging: false, backgroundColor: '#ffffff' });
            dailyRateImg = canvas.toDataURL('image/png');
        }
        
        const pdfFunc = await pdfRenderer();
        const ReportDocumentComponent = await ReportDocument;
        const pdfBlob = await pdfFunc(
            <ReportDocumentComponent 
                stats={stats} 
                config={projectConfig} 
                dateRange={dateRange} 
                charts={{ hourly: hourlyImg, daily: dailyImg, distribution: distributionImg, dailyRate: dailyRateImg }}
                chartsData={charts}
                logoData={logoData}
            />
        ).toBlob();
        
        zip.file(`rapport_${dateStr}.pdf`, pdfBlob);
      } catch (pdfErr) {
        console.error("Erreur génération PDF dans ZIP:", pdfErr);
      } finally {
        setIsPdfGenerating(false);
      }
      
      // 4. Générer et télécharger le ZIP
      const blob = await zip.generateAsync({ type: "blob" });
      const saveAsFunc = await saveAs();
      saveAsFunc(blob, `OpenZyra_export_complet_${dateStr}.zip`);
      
    } catch (err) {
      console.error("Erreur lors de l'export ZIP:", err);
      alert("Une erreur est survenue lors de la création du fichier d'export.");
    } finally {
      setIsZipGenerating(false);
    }
  };

  const handleExportJSON = () => {
    if (!projectConfig) return;
    
    setIsJsonGenerating(true);
    
    try {
      const jsonString = JSON.stringify(projectConfig, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `config_OpenZyra_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up memory
    } catch (err) {
      console.error("Erreur export JSON:", err);
      alert("Erreur lors de l'export JSON");
    } finally {
      setIsJsonGenerating(false);
    }
  };

  // NOUVELLE MÉTHODE : Téléchargement PDF via @react-pdf/renderer
  const handleDownloadPDF = async () => {
    setIsPdfGenerating(true);
    
    try {
        // 1. Charger le logo en base64
        let logoData = null;
        try {
            const logoResponse = await fetch('/medias/OpenZyra.png');
            const logoBlob = await logoResponse.blob();
            logoData = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(logoBlob);
            });
        } catch (e) {
            console.warn('Impossible de charger le logo:', e);
        }

        // 2. Capture des graphiques en images
        const hourlyChartEl = document.getElementById('chart-hourly');
        const dailyChartEl = document.getElementById('chart-daily');
        const distributionChartEl = document.getElementById('chart-distribution');
        const dailyRateChartEl = document.getElementById('chart-daily-rate');

        let hourlyImg = null;
        let dailyImg = null;
        let distributionImg = null;
        let dailyRateImg = null;

        await new Promise(resolve => setTimeout(resolve, 500));

        if (hourlyChartEl) {
            const h2c = await html2canvas();
            const canvas = await h2c(hourlyChartEl, { 
                scale: 2,
                logging: false,
                backgroundColor: '#ffffff'
            });
            hourlyImg = canvas.toDataURL('image/png');
        }

        if (dailyChartEl) {
            const h2c = await html2canvas();
            const canvas = await h2c(dailyChartEl, { 
                scale: 2,
                logging: false,
                backgroundColor: '#ffffff'
            });
            dailyImg = canvas.toDataURL('image/png');
        }

        if (distributionChartEl) {
            const h2c = await html2canvas();
            const canvas = await h2c(distributionChartEl, { 
                scale: 2,
                logging: false,
                backgroundColor: '#ffffff'
            });
            distributionImg = canvas.toDataURL('image/png');
        }

        if (dailyRateChartEl) {
            const h2c = await html2canvas();
            const canvas = await h2c(dailyRateChartEl, { 
                scale: 2,
                logging: false,
                backgroundColor: '#ffffff'
            });
            dailyRateImg = canvas.toDataURL('image/png');
        }

        // 3. Génération du document PDF avec le logo
        const pdf = await pdfRenderer();
        const ReportDocumentComponent = await ReportDocument;
        const blob = await pdf(
            <ReportDocumentComponent 
                stats={stats} 
                config={projectConfig} 
                dateRange={dateRange} 
                charts={{ hourly: hourlyImg, daily: dailyImg, distribution: distributionImg, dailyRate: dailyRateImg }}
                chartsData={charts}
                logoData={logoData}
            />
        ).toBlob();

        const saveAsFunc = await saveAs();
        saveAsFunc(blob, `rapport_OpenZyra_${new Date().toISOString().slice(0,10)}.pdf`);

    } catch (err) {
        console.error("Erreur PDF:", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        alert(`Une erreur est survenue lors de la génération du PDF : ${errorMessage}`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Calculate Data Bounds for Validation
  const { minDate, maxDate } = useMemo(() => {
    if (data.length === 0) return { minDate: undefined, maxDate: undefined };
    // data is sorted by datetime descending (newest first)
    // so data[0] is maxDate (newest), data[data.length-1] is minDate (oldest)
    return {
        minDate: data[data.length - 1].dateStr,
        maxDate: data[0].dateStr
    };
  }, [data]);

  useEffect(() => { setCurrentPage(1); }, [filteredData]);

  // --- Render ---

  // RENDER: Page de Documentation (remplace toute l'app si active)
  if (showDocs) {
      return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
          <>
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb items={[
                  { label: 'Documentation', onClick: undefined }
                ]} />
              </div>
            </div>
            <HelpPage onBack={onBackToHome} />
          </>
        </Suspense>
      );
  }

  // RENDER: Page de Tutoriels
  if (showTutorials) {
      return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
          <>
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb items={[
                  { label: 'Tutoriels', onClick: undefined }
                ]} />
              </div>
            </div>
            <TutorialsPage 
                onBack={onBackToHome} 
                onOpenFAQ={onOpenFAQ}
                onOpenFeatures={onOpenFeatures}
                onOpenAlternatives={onOpenAlternatives}
                onOpenDocs={onOpenDocs}
                onOpenLegal={onOpenLegal}
            />
          </>
        </Suspense>
      );
  }

  // RENDER: Page de Fonctionnalités
  if (showFeatures) {
      return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
          <>
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb items={[
                  { label: 'Fonctionnalités', onClick: undefined }
                ]} />
              </div>
            </div>
            <FeaturesPage 
                onBack={onBackToHome} 
                onOpenLegal={onOpenLegal}
            />
          </>
        </Suspense>
      );
  }

  // RENDER: Page FAQ
  if (showFAQ) {
      return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
          <>
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb items={[
                  { label: 'FAQ', onClick: undefined }
                ]} />
              </div>
            </div>
            <FAQPage onBack={onBackToHome} />
          </>
        </Suspense>
      );
  }

  // RENDER: Page Mentions Légales
  if (showLegal) {
      return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
          <>
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb items={[
                  { label: 'Mentions Légales', onClick: undefined }
                ]} />
              </div>
            </div>
            <LegalPage onBack={onBackToHome} />
          </>
        </Suspense>
      );
  }

  // RENDER: Page Contact
  if (showContact) {
      return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
          <>
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb items={[
                  { label: 'Contact', onClick: undefined }
                ]} />
              </div>
            </div>
            <ContactPage onBack={onBackToHome} />
          </>
        </Suspense>
      );
  }

  // RENDER: Page Alternatives
  if (showAlternatives) {
      return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
          <>
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb items={[
                  { label: 'Alternatives', onClick: undefined }
                ]} />
              </div>
            </div>
            <AlternativesPage onBack={onBackToHome} />
          </>
        </Suspense>
      );
  }

  // RENDER: App Principale - Landing Page when no data
  if (allRawRecords.length === 0 && !loading && !pendingRawRecords) {
    return (
        <>
            <div className={`transition-all duration-500 ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <LandingPage 
                  handleFileUpload={handleFileUpload} 
                  onOpenDocs={onOpenDocs}
                  onOpenTutorials={onOpenTutorials}
                  onOpenFeatures={onOpenFeatures}
                  onOpenAlternatives={onOpenAlternatives}
                  onOpenFAQ={onOpenFAQ}
                  onOpenContact={onOpenContact}
                  onOpenLegal={onOpenLegal}
                  error={error} 
                  isExiting={isExiting}
                />
            </div>
            
            {showUploadModal && (
                <UploadModal 
                    files={pendingFiles}
                    onAddFiles={handleAddMoreFiles}
                    onRemoveFile={handleRemoveFile}
                    onAnalyze={handleStartAnalysis}
                    onCancel={handleCancelUpload}
                />
            )}

            {isAnalyzing && <AnalysisLoader />}
        </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        {showConfig && (
          <ConfigModal 
            detectedLines={detectedLines}
            initialConfig={projectConfig}
            setShowConfig={setShowConfig}
            loading={loading}
            applyConfiguration={applyConfiguration}
          />
        )}

        <Header 
          telephonyGroups={telephonyGroups}
          projectConfig={projectConfig}
          setShowConfig={setShowConfig}
          handleExportCSV={handleExportCSV}
          handleDownloadPDF={handleDownloadPDF}
          onMenuClick={() => setIsSidebarOpen(true)}
          handleExportZip={handleExportZip}
          handleExportJSON={handleExportJSON}
          isPdfGenerating={isPdfGenerating}
          isZipGenerating={isZipGenerating}
          onOpenDocs={onOpenTutorials}
          onReset={handleReset}
        />

        <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-violet-50/40 via-slate-50 to-fuchsia-50/30">
          <Suspense fallback={<div className="w-64 flex items-center justify-center bg-white/50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5087FF]"></div></div>}>
            <Sidebar 
              allRawRecordsCount={allRawRecords.length}
              dateRange={dateRange}
              setDateRange={setDateRange}
              projectConfig={projectConfig}
              setShowConfig={setShowConfig}
              handleReset={handleReset}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              minDate={minDate}
              maxDate={maxDate}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </Suspense>

          <main 
            className={`flex-1 bg-gradient-to-br from-violet-50/40 via-slate-50 to-fuchsia-50/30 p-4 md:p-6 min-h-full ${showConfig ? '' : 'overflow-y-auto'}`}
            style={showConfig ? { overflow: 'hidden', touchAction: 'none' } : undefined}
          >
              <div className="space-y-6">
                  <FilterBar 
                    filters={filters} 
                    setFilters={setFilters} 
                    resultCount={filteredData.length}
                    callerSuggestions={Array.from(new Set(data.map(d => d.callingNumber))).sort()}
                    calledSuggestions={Array.from(new Set(data.flatMap(d => d.involvedLines))).sort()}
                    projectConfig={projectConfig}
                  />

                  {filteredData.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                          <Filter size={48} className="mb-4 opacity-50" />
                          <p className="text-lg">Aucune donnée ne correspond aux filtres actuels.</p>
                          {!projectConfig && <p className="text-sm text-red-500 mt-2">Veuillez configurer au moins une ligne du groupe.</p>}
                      </div>
                  ) : (
                    <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5087FF]"></div></div>}>
                      <>
                        <StatsCards stats={stats} />
                        <ChartsSection charts={charts} filterStatus={filters.status} />
                        <CallTable 
                          filteredData={filteredData} 
                          ITEMS_PER_PAGE={ITEMS_PER_PAGE} 
                          currentPage={currentPage} 
                          setCurrentPage={setCurrentPage} 
                          sortConfig={sortConfig} 
                          handleSort={handleSort}
                          onCallClick={(call) => {
                            setSelectedCall(call);
                            setShowCallTrace(true);
                          }}
                        />
                      </>
                    </Suspense>
                  )}
              </div>
          </main>
        </div>
      </div>

      <Suspense fallback={null}>
        <CallTraceModal
          call={selectedCall}
          isOpen={showCallTrace}
          onClose={() => setShowCallTrace(false)}
          projectConfig={projectConfig}
        />
      </Suspense>

      {showUploadModal && (
          <UploadModal 
              files={pendingFiles}
              onAddFiles={handleAddMoreFiles}
              onRemoveFile={handleRemoveFile}
              onAnalyze={handleStartAnalysis}
              onCancel={handleCancelUpload}
          />
      )}

      {isAnalyzing && <AnalysisLoader />}
    </>
  );
};


const root = createRoot(document.getElementById('root')!);
root.render(<App />);
