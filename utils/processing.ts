// =============================================================================
// MOTEUR D'ANALYSE D'APPELS - utils/processing.ts
// =============================================================================
// Ce module transforme les RawRecord (lignes CSV) en SessionRecord (appels groupés).
// Il implémente l'algorithme de clustering qui regroupe les événements téléphoniques
// appartenant à une même session d'appel.
//
// ALGORITHME DE CLUSTERING:
// 1. Trier par numéro appelant, puis par date chronologique
// 2. Regrouper les enregistrements si:
//    - Même numéro appelant ET
//    - Intervalle < 2 minutes (120 secondes) entre événements
// 3. Pour chaque cluster, déterminer:
//    - Statut: Répondu (SIP avec durée>0), Manqué, ou Hors Ouverture
//    - Durée: somme des durées SIP (conversation réelle)
//    - Attente: durée NDI - durée SIP (temps avant réponse)
//    - Agents: noms des SIP ayant décroché
//
// IMPORTANT: La distinction NDI/SIP est cruciale:
// - NDI = Numéro de présentation (sonnerie, attente)
// - SIP = Postes physiques (agents)
// =============================================================================

import { RawRecord, SessionRecord, ProjectConfig } from '../types';
import { isWithinSchedule } from './schedule';

/**
 * processSessions - Transforme les enregistrements bruts en sessions groupées
 * @param records - Tableau de RawRecord (issues du CSV)
 * @param config - Configuration téléphonique (NDI, SIP, horaires)
 * @returns Tableau de SessionRecord (appels analysés)
 */
export const processSessions = (records: RawRecord[], config: ProjectConfig): SessionRecord[] => {
  if (!records || records.length === 0) return [];
  if (!config) {
      console.error("processSessions: Config is missing");
      return [];
  }

  // Sécurisation de l'accès à config.lines
  const getLineConfig = (line: string) => {
      if (!config.lines) return null;
      return config.lines[line];
  };

  // 1. Trier TOUS les enregistrements par Numéro Appelant puis par Date
  const sortedRecords = [...records].sort((a, b) => {
    if (a.callingNumber === b.callingNumber) {
      return a.datetime.getTime() - b.datetime.getTime();
    }
    return a.callingNumber.localeCompare(b.callingNumber);
  });

  const sessions: SessionRecord[] = [];
  let currentCluster: RawRecord[] = [];

  const finalizeCluster = (cluster: RawRecord[]) => {
    if (cluster.length === 0) return;

    // ÉTAPE 2 : Filtrer les appels reçus via le NDI principal
    // MODIFICATION : On ne rejette plus les clusters sans NDI principal pour supporter les CSV contenant uniquement des lignes SIP
    const hasMainNdi = cluster.some(r => r.phoneLine === config.mainNdi);
    
    // Isoler la ligne du NDI principal si présente, sinon prendre le premier enregistrement
    const mainNdiRecord = cluster.find(r => r.phoneLine === config.mainNdi);
    const referenceRecord = mainNdiRecord || cluster[0];

    // Séparer les lignes NDI (attente/SVI) des lignes SIP (postes réels)
    const ndiRecords = cluster.filter(r => {
       if (r.phoneLine === config.mainNdi) return true;
       const lc = getLineConfig(r.phoneLine);
       return lc && lc.type === 'NDI';
    });
    
    const sipRecords = cluster.filter(r => {
       const lc = getLineConfig(r.phoneLine);
       return lc && lc.type === 'SIP';
    });

    // ÉTAPE 3 : Déterminer le statut (Répondu, Manqué ou Hors Ouverture)
    // Un appel est considéré comme répondu si au moins un poste SIP a décroché (durée > 0)
    const answeredSipRecords = sipRecords.filter(r => r.duration > 0);
    const isAnswered = answeredSipRecords.length > 0;
    
    // Déterminer si l'appel est dans les horaires d'ouverture
    const isBusinessHour = isWithinSchedule(referenceRecord.datetime, config.schedule);

    let status: 'Répondu' | 'Manqué' | 'Hors Ouverture';
    
    if (!isBusinessHour) {
        // Priorité absolue aux horaires : Si fermé -> Hors Ouverture (même si répondu)
        status = 'Hors Ouverture';
    } else if (isAnswered) {
        status = 'Répondu';
    } else {
        status = 'Manqué';
    }

    // ÉTAPE 4 : Calculer le Temps Global (sur les NDI)
    // On calcule l'union des intervalles de temps des lignes NDI
    let totalNdiDuration = 0;
    if (ndiRecords.length > 0) {
        const intervals = ndiRecords.map(r => ({
            start: r.datetime.getTime(),
            end: r.datetime.getTime() + r.duration * 1000
        })).sort((a, b) => a.start - b.start);
        
        let currentInterval = intervals[0];
        let totalMs = 0;
        
        for (let i = 1; i < intervals.length; i++) {
            const next = intervals[i];
            if (next.start <= currentInterval.end) {
                currentInterval.end = Math.max(currentInterval.end, next.end);
            } else {
                totalMs += currentInterval.end - currentInterval.start;
                currentInterval = next;
            }
        }
        totalMs += currentInterval.end - currentInterval.start;
        totalNdiDuration = Math.round(totalMs / 1000);
    }
    
    // Temps de Conversation réel (duration) = Somme des durées des postes SIP (les agents) ayant décroché
    const duration = sipRecords.reduce((acc, r) => acc + r.duration, 0);

    // ÉTAPE 5 : Calculer le Temps d'Attente Réel
    // Formule : Temps Global NDI - Temps de Conversation SIP
    // Applicable uniquement aux appels 'Répondu' ou 'Manqué' (Pendant les horaires)
    let waitTime = 0;
    if (status === 'Répondu' || status === 'Manqué') {
        waitTime = Math.max(0, totalNdiDuration - duration);
    }

    const involvedLines = Array.from(new Set(cluster.map(r => r.phoneLine)));

    // Extraire les noms/numéros des agents ayant répondu
    const answeredBy = answeredSipRecords.map(r => {
        const lineConfig = getLineConfig(r.phoneLine);
        return lineConfig && lineConfig.name ? lineConfig.name : r.phoneLine;
    });

    sessions.push({
      id: `${referenceRecord.callingNumber}-${referenceRecord.datetime.getTime()}`,
      callingNumber: referenceRecord.callingNumber,
      phoneLine: referenceRecord.phoneLine, // Le NDI principal
      involvedLines: involvedLines,
      answeredBy: Array.from(new Set(answeredBy)),
      datetime: referenceRecord.datetime,
      duration: duration, // La durée de l'appel mesurée sur le(s) SIP(s)
      waitTime: waitTime, // Le temps d'attente mesuré sur le(s) NDI(s)
      status: status,
      // Use local date string construction to avoid UTC shift
      dateStr: (() => {
          const y = referenceRecord.datetime.getFullYear();
          const m = String(referenceRecord.datetime.getMonth() + 1).padStart(2, '0');
          const d = String(referenceRecord.datetime.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
      })(),
      hour: referenceRecord.datetime.getHours(),
      isBusinessHour
    });
  };

  for (const record of sortedRecords) {
    if (isNaN(record.datetime.getTime())) continue;

    if (currentCluster.length === 0) {
      currentCluster.push(record);
      continue;
    }

    const lastInCluster = currentCluster[currentCluster.length - 1];
    const isSameCaller = lastInCluster.callingNumber === record.callingNumber;
    
    // ÉTAPE 1 (suite) : Regrouper par chronologie (moins de 2 minutes / 120 secondes)
    const timeDiff = Math.abs(record.datetime.getTime() - lastInCluster.datetime.getTime()) / 1000;
    const isCloseEnough = timeDiff <= 120; // 2 minutes

    if (isSameCaller && isCloseEnough) {
      currentCluster.push(record);
    } else {
      finalizeCluster(currentCluster);
      currentCluster = [record];
    }
  }
  finalizeCluster(currentCluster);

  // Trier les sessions finales par date décroissante
  sessions.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
  
  return sessions;
};
