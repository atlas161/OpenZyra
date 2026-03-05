// =============================================================================
// PARSER CSV UNIVERSEL - utils/csv.ts
// =============================================================================
// Ce module est responsable de l'ingestion des fichiers CSV OVH.
// Il gère:
// - Auto-détection du séparateur (; , tab |)
// - Mapping automatique des colonnes (phoneLine, datetime, duration...)
// - Support multi-formats de dates (FR, ISO, compact YYYYMMDDhhmmss)
// - Normalisation des numéros de téléphone (+33)
// - Extraction optionnelle du temps d'attente si présent
//
// POUR DÉPANNAGE:
// Si un CSV n'est pas reconnu, vérifier:
// 1. La détection séparateur (ligne 12-32)
// 2. Le mapping colonnes (ligne 48-73)
// 3. Le parsing dates (ligne 144-167)
// =============================================================================

import { RawRecord } from '../types';
import { normalizePhoneNumber } from './formatters';

/**
 * parseCSV - Parse un contenu CSV et retourne un tableau de RawRecord
 * @param content - Contenu texte du fichier CSV
 * @returns Tableau d'enregistrements parsés (RawRecord[])
 * @throws Error si colonnes requises manquantes
 */
export const parseCSV = (content: string): RawRecord[] => {
  // Support universel des sauts de ligne (\n, \r\n, \r)
  const lines = content.trim().split(/\r\n|\n|\r/);
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  
  // Auto-détection du séparateur le plus probable
  const candidates = [';', ',', '\t', '|'];
  let separator = ';'; // Défaut
  let maxCount = 0;

  candidates.forEach(sep => {
      // On teste sur le header ET la première ligne de données pour être sûr
      const headerCount = headerLine.split(sep).length - 1;
      const firstLineCount = lines.length > 1 ? lines[1].split(sep).length - 1 : 0;
      
      // On privilégie un séparateur qui donne le même nombre de colonnes (et > 0)
      if (headerCount > 0 && Math.abs(headerCount - firstLineCount) <= 1) {
           if (headerCount > maxCount) {
               maxCount = headerCount;
               separator = sep;
           }
      } else if (headerCount > maxCount) {
           // Fallback si pas de correspondance parfaite
           maxCount = headerCount;
           separator = sep;
      }
  });

  const headers = headerLine.split(separator).map(h => h.trim().replace(/['"]+/g, ''));
  
  const colMap: Record<string, number> = {};
  
  // Helper pour vérifier si un header correspond à une liste de mots-clés
  const matches = (header: string, keywords: string[]) => {
      const h = header.toLowerCase();
      return keywords.some(k => h.includes(k.toLowerCase()));
  };

  let datetimeCol = -1;
  let dateCol = -1;
  let timeCol = -1;

  headers.forEach((h, i) => {
    // Mapping Ligne / NDI / Poste
    if (matches(h, ['phoneLine', 'ligne', 'ndi', 'poste', 'receiver', 'destination'])) colMap.phoneLine = i;
    
    // Identification des candidats pour la date/heure
    // On priorise 'datetime' (qui contient souvent date+heure) sur 'date' (juste jour) ou 'time' (juste heure)
    if (matches(h, ['datetime', 'horodatage'])) datetimeCol = i;
    else if (matches(h, ['date', 'start', 'début'])) dateCol = i;
    else if (matches(h, ['time', 'heure'])) timeCol = i;
    
    // Mapping Durée - EXCLUSION explicite des termes d'attente pour éviter les faux positifs
    const isWaitTerm = matches(h, ['attente', 'wait', 'sonnerie', 'ring']);
    if (matches(h, ['duration', 'durée', 'duree', 'temps', 'length']) && !isWaitTerm) {
        colMap.duration = i;
    }
    
    // Mapping Appelant / Source
    if (matches(h, ['callingNumber', 'calling', 'caller', 'appelant', 'source', 'from', 'expéditeur', 'emetteur'])) colMap.callingNumber = i;
    
    // Mapping Nature / Type
    if (matches(h, ['nature', 'type', 'direction', 'sens'])) colMap.nature = i;
    
    // Détection intelligente d'une colonne de temps d'attente/sonnerie
    if (isWaitTerm && !h.match(/durée.*appel|call.*duration/i)) {
        colMap.waitTime = i;
    }
  });

  // Sélection de la meilleure colonne pour la date
  if (datetimeCol !== -1) {
      colMap.datetime = datetimeCol;
  } else if (dateCol !== -1 && timeCol !== -1) {
      // Cas où date et heure sont séparées
      colMap.dateSplit = dateCol;
      colMap.timeSplit = timeCol;
      // On utilise dateSplit comme placeholder pour datetime
      colMap.datetime = dateCol; 
  } else if (dateCol !== -1) {
      colMap.datetime = dateCol;
  } else if (timeCol !== -1) {
      colMap.datetime = timeCol;
  }

  // Validation des colonnes requises
  const requiredCols = ['phoneLine', 'datetime', 'duration', 'callingNumber'];
  // Si on a dateSplit/timeSplit, on considère que datetime est satisfait (car assigné à dateCol)
  const missingCols = requiredCols.filter(col => colMap[col] === undefined);
  
  if (missingCols.length > 0) {
      throw new Error(`Le fichier CSV est invalide. Colonnes manquantes : ${missingCols.join(', ')}`);
  }

  const records: RawRecord[] = [];

  // Déterminer l'index maximum nécessaire pour ne pas rejeter des lignes valides mais courtes
  const maxRequiredIndex = Math.max(
      colMap.phoneLine, 
      colMap.datetime, 
      colMap.duration, 
      colMap.callingNumber, 
      colMap.nature || 0,
      colMap.waitTime || 0,
      colMap.timeSplit || 0 // Include timeSplit in max index calculation
  );

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = line.split(separator).map(c => c.trim().replace(/['"]+/g, ''));
    
    // On ne rejette la ligne que si elle n'a pas assez de colonnes pour remplir les champs requis
    if (cols.length <= maxRequiredIndex) {
        continue;
    }

    let dateStr = cols[colMap.datetime];
    
    // Si mode Split, on combine
    if (colMap.dateSplit !== undefined && colMap.timeSplit !== undefined) {
        const d = cols[colMap.dateSplit];
        const t = cols[colMap.timeSplit];
        if (d && t) {
            dateStr = `${d}${t}`; // Concaténation simple pour supporter le format YYYYMMDDHHmmss si d=YYYYMMDD et t=HHmmss
            // Si le format est différent (ex: DD/MM/YYYY et HH:mm:ss), on concatène avec un espace
            if (d.includes('/') || d.includes('-')) {
                dateStr = `${d} ${t}`;
            }
        }
    }
    
    if (!dateStr) continue;

    let dateObj = new Date(dateStr);
    
    // Support format français DD/MM/YYYY HH:mm:ss
    if (isNaN(dateObj.getTime())) {
       // Essai de parsing manuel pour DD/MM/YYYY
       const frDateMatch = dateStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
       if (frDateMatch) {
           const [_, day, month, year, hour, min, sec] = frDateMatch;
           dateObj = new Date(
               parseInt(year),
               parseInt(month) - 1,
               parseInt(day),
               hour ? parseInt(hour) : 0,
               min ? parseInt(min) : 0,
               sec ? parseInt(sec) : 0
           );
       }
       // Support format compact YYYYMMDDHHmmss
       else if (/^\d{14}$/.test(dateStr)) {
          const y = parseInt(dateStr.substring(0, 4));
          const m = parseInt(dateStr.substring(4, 6)) - 1;
          const d = parseInt(dateStr.substring(6, 8));
          const h = parseInt(dateStr.substring(8, 10));
          const min = parseInt(dateStr.substring(10, 12));
          const s = parseInt(dateStr.substring(12, 14));
          dateObj = new Date(y, m, d, h, min, s);
       }
    }
    
    // Si la date est toujours invalide, on ignore la ligne
    if (isNaN(dateObj.getTime())) {
        console.warn(`Date invalide ignorée à la ligne ${i + 1}: ${dateStr}`);
        continue;
    }

    // Helper pour parser la durée (supporte 123, 123.45, "00:02:30", "1:30")
    const parseDuration = (val: string): number => {
        if (!val) return 0;
        let sec = 0;
        
        // Si contient ':' -> format HH:MM:SS ou MM:SS
        if (val.includes(':')) {
            const parts = val.split(':').map(p => parseFloat(p) || 0);
            if (parts.length === 3) sec = parts[0] * 3600 + parts[1] * 60 + parts[2];
            else if (parts.length === 2) sec = parts[0] * 60 + parts[1];
        } else {
            // Sinon nombre standard (secondes)
            // Remplacement de la virgule par un point pour les formats français (ex: 12,5)
            sec = parseFloat(val.replace(',', '.')) || 0;
        }
        
        // Traitement des durées négatives (codes erreur ou status spéciaux) -> 0
        return Math.max(0, sec);
    };

    const record: RawRecord = {
      phoneLine: normalizePhoneNumber(cols[colMap.phoneLine] || 'Unknown'),
      datetime: dateObj,
      duration: parseDuration(cols[colMap.duration]),
      callingNumber: normalizePhoneNumber(cols[colMap.callingNumber] || 'Unknown'),
      nature: cols[colMap.nature] || ''
    };

    // Si une colonne d'attente a été trouvée, on l'ajoute
    if (colMap.waitTime !== undefined) {
        record.waitTime = parseDuration(cols[colMap.waitTime]);
    }

    records.push(record);
  }

  return records;
};
