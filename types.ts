// =============================================================================
// TYPES OpenZyra - Définitions centralisées des structures de données
// =============================================================================
// Ce fichier contient TOUTES les interfaces TypeScript utilisées dans l'application.
// Il est crucial de maintenir ces définitions à jour lors de l'ajout de nouvelles
// fonctionnalités. Les types sont organisés par domaine fonctionnel.
// =============================================================================

// =============================================================================
// DONNÉES BRUTES (venant du CSV OVH)
// =============================================================================

/**
 * RawRecord - Enregistrement brut extrait d'un fichier CSV OVH
 * Représente une ligne du fichier source avant tout traitement
 */
export interface RawRecord {
  phoneLine: string;        // Numéro de ligne destinataire (NDI ou SIP)
  datetime: Date;           // Date et heure de l'appel
  duration: number;         // Durée en secondes
  callingNumber: string;    // Numéro de l'appelant (source)
  nature: string;           // Nature de l'appel (reçu, émis, etc.)
  waitTime?: number;        // Durée de sonnerie/attente explicite si présente dans le CSV
}

// =============================================================================
// CONFIGURATION TÉLÉPHONIQUE
// =============================================================================

/**
 * LineType - Types de lignes téléphoniques supportés
 * - NDI: Numéro de Direct Inward Dialing (numéro de présentation principal)
 * - SIP: Session Initiation Protocol (postes physiques des agents)
 * - FAX: Ligne fax spécifique
 * - UNKNOWN: Type non déterminé (à configurer manuellement)
 */
export type LineType = 'NDI' | 'SIP' | 'FAX' | 'UNKNOWN';

/**
 * LineConfig - Configuration d'une ligne téléphonique
 * Chaque ligne doit être identifiée avec un type et un nom descriptif
 * IMPORTANT: La distinction NDI/SIP est cruciale pour les calculs de statistiques
 */
export interface LineConfig {
  number: string;           // Numéro normalisé (+33XXXXXXXXX)
  type: LineType;          // Type de ligne (voir LineType ci-dessus)
  name: string;            // Nom affiché (ex: "Alice Martin", "Poste 101")
}

/**
 * TimeRange - Plage horaire pour les horaires d'ouverture
 * Format 24h: "08:30", "17:00"
 */
export interface TimeRange {
  start: string;           // Heure de début (HH:MM)
  end: string;             // Heure de fin (HH:MM)
}

/**
 * DaySchedule - Planning d'un jour de la semaine
 * Un jour peut avoir plusieurs plages horaires (ex: matin + après-midi)
 */
export interface DaySchedule {
  isOpen: boolean;         // Jour ouvré ou fermé
  ranges: TimeRange[];     // Plages horaires (vide si fermé)
}

/**
 * WeekSchedule - Planning hebdomadaire complet
 * Utilisé pour déterminer si un appel est "Hors Ouverture"
 */
export interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

/**
 * ProjectConfig - Configuration complète d'un projet téléphonique
 * Cette structure est sauvegardée dans les exports JSON/ZIP
 * Elle définit comment interpréter les données CSV
 */
export interface ProjectConfig {
  mainNdi: string;         // NDI principal du groupe (ex: +33123456789)
  lines: Record<string, LineConfig>;  // Map de toutes les lignes connues (clé = numéro)
  schedule?: WeekSchedule;   // Horaires d'ouverture (optionnel pour rétrocompatibilité)
}

/**
 * ProjectExport - Structure d'export/import complet d'un projet
 * Permet de sauvegarder et restaurer l'état complet avec données brutes
 */
export interface ProjectExport {
  config: ProjectConfig;           // Configuration téléphonique
  rawRecords: RawRecord[];         // Données brutes originales
}

// =============================================================================
// DONNÉES TRAITÉES (résultat du clustering et analyse)
// =============================================================================

/**
 * SessionRecord - Appel regroupé et analysé
 * Un appel téléphonique complet peut générer plusieurs RawRecord dans le CSV
 * (sonnerie NDI, transfert SIP, etc.). Cette structure regroupe ces événements.
 */
export interface SessionRecord {
  id: string;              // Identifiant unique (appelant-timestamp)
  callingNumber: string;   // Numéro de l'appelant
  phoneLine: string;       // Ligne principale sollicitée (NDI)
  involvedLines: string[]; // Toutes les lignes impliquées dans l'appel
  answeredBy: string[];    // Noms des agents qui ont décroché (SIP)
  datetime: Date;          // Date/heure de l'appel
  duration: number;        // Durée de conversation (somme des SIP, en secondes)
  waitTime: number;        // Temps d'attente avant réponse (calculé: NDI - SIP)
  status: 'Répondu' | 'Manqué' | 'Hors Ouverture';  // Statut final de l'appel
  dateStr: string;         // Date formatée YYYY-MM-DD (pour regroupement)
  hour: number;            // Heure de l'appel (0-23, pour stats horaires)
  isBusinessHour?: boolean; // Flag: appel pendant horaires d'ouverture
}

// =============================================================================
// OPTIONS DE TRI ET FILTRAGE
// =============================================================================

/**
 * SortKey - Colonnes pouvant être triées dans le tableau d'appels
 */
export type SortKey = 'datetime' | 'duration';

/**
 * SortDirection - Direction du tri
 */
export type SortDirection = 'asc' | 'desc';

/**
 * DateRange - Plage de dates pour le filtrage global
 * Format: YYYY-MM-DD
 */
export interface DateRange {
  start: string;
  end: string;
}

// =============================================================================
// STATISTIQUES ET ANALYSE
// =============================================================================

/**
 * Stats - Indicateurs clés de performance (KPIs) calculés
 * Ces valeurs sont affichées dans les cartes de statistiques et le PDF
 */
export interface Stats {
  // Compteurs de base
  totalCalls: number;              // Total des appels pendant horaires d'ouverture
  answeredCount: number;           // Appels répondus
  answeredRate: number;            // Taux de réponse (%)
  missedCount: number;             // Appels manqués (sonnerie mais pas de réponse)
  missedRate: number;                // Taux d'appels manqués (%)

  // Durées
  totalDuration: number;           // Durée totale de conversation (secondes)
  avgCallDuration: number;         // Durée moyenne par appel (secondes)
  avgAnsweredWaitTime: number;       // Temps d'attente moyen avant réponse (secondes)

  // Classements
  topAgents: { name: string, count: number }[];      // Top 10 agents par nombre d'appels
  topCallers: { number: string, count: number, answered: number, missed: number }[];  // Top 10 appelants

  // Moyennes
  avgCallsPerDay: number;           // Moyenne d'appels par jour calendaire

  // Hors ouverture
  avgCallsOutsideHours: number;      // Moyenne d'appels hors horaires par jour
  avgCallsInsideHours: number;       // Moyenne d'appels pendant horaires par jour
  totalMissedOutsideHours: number;   // Total des appels hors ouverture
}

/**
 * ChartsData - Données pour les graphiques recharts
 * Deux types de visualisation: horaire (par heure) et journalière (par jour)
 */
export interface ChartsData {
  hourly: { 
    hour: string;            // Label affiché (ex: "14h")
    rawHour: number;         // Valeur numérique (0-23) pour le tri
    Répondu: number;         // Nombre d'appels répondus à cette heure
    Manqué: number;          // Nombre d'appels manqués à cette heure
    HorsOuverture: number;   // Nombre d'appels hors ouverture à cette heure
  }[];
  daily: { 
    date: string;            // Date (YYYY-MM-DD)
    Répondu: number;         // Appels répondus ce jour
    Manqué: number;          // Appels manqués ce jour
    HorsOuverture: number;   // Appels hors ouverture ce jour
  }[];
  distribution: {
    name: string;            // Label: "Répondus", "Manqués", "Hors Ouverture"
    value: number;           // Nombre d'appels
    color: string;           // Couleur hex
  }[];
  dailyRate: {
    date: string;            // Date (YYYY-MM-DD)
    rate: number;            // Taux de réponse (0-100)
  }[];
}

// =============================================================================
// ÉTAT DES FILTRES UI
// =============================================================================

/**
 * FilterState - Valeurs des filtres dans la barre de filtres
 * Ces filtres permettent une analyse granulaire des données
 */
export interface FilterState {
  date: string;            // Filtre date partielle (JJ/MM/AAAA ou partie)
  timeStart: string;       // Heure début (HH:MM)
  timeEnd: string;           // Heure fin (HH:MM)
  caller: string;            // Filtre numéro appelant (partiel)
  called: string;            // Filtre ligne appelée (partiel)
  status: 'all' | 'Répondu' | 'Manqué' | 'Hors Ouverture';  // Filtre statut
}