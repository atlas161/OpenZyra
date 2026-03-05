// =============================================================================
// GESTION DES HORAIRES D'OUVERTURE - utils/schedule.ts
// =============================================================================
// Ce module détermine si un appel a lieu pendant ou hors des heures d'ouverture.
// Il est utilisé pour classifier les appels et calculer les statistiques
// d'activité hors horaires.
//
// FONCTIONNEMENT:
// 1. WeekSchedule définit les plages horaires pour chaque jour
// 2. isWithinSchedule() vérifie si une date/heure tombe dans ces plages
// 3. Un jour peut avoir plusieurs plages (ex: 8h-12h et 14h-18h)
//
// DEFAULT SCHEDULE:
// Lundi-Vendredi: 8h30-12h30, 14h00-18h00 (vendredi jusqu'à 17h)
// Samedi-Dimanche: Fermé
// =============================================================================

import { WeekSchedule, TimeRange } from '../types';

/**
 * DAYS_MAP - Mapping des index JavaScript (0=Dimanche) vers les clés WeekSchedule
 */
export const DAYS_MAP: (keyof WeekSchedule)[] = [
  'sunday',    // 0
  'monday',    // 1
  'tuesday',   // 2
  'wednesday', // 3
  'thursday',  // 4
  'friday',    // 5
  'saturday'   // 6
];

/**
 * isWithinSchedule - Vérifie si une date/heure est dans les horaires d'ouverture
 * @param date - Date à vérifier
 * @param schedule - Planning hebdomadaire
 * @returns true si l'heure est dans une plage ouverte, false sinon
 */
export const isWithinSchedule = (date: Date, schedule?: WeekSchedule): boolean => {
  if (!schedule) return true; // By default, if no schedule, everything is "in hours" (or maybe handled differently, but for filtering "outside" it implies there is a schedule)

  const dayIndex = date.getDay(); // 0 = Sunday
  const dayName = DAYS_MAP[dayIndex];
  
  // Sécurité : si le planning du jour est manquant, on considère que c'est fermé ou on retourne false par défaut
  const daySchedule = schedule[dayName];
  if (!daySchedule) return false;

  if (!daySchedule.isOpen) return false;

  const minutes = date.getHours() * 60 + date.getMinutes();

  return daySchedule.ranges.some(range => {
    const [startH, startM] = range.start.split(':').map(Number);
    const [endH, endM] = range.end.split(':').map(Number);
    
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    return minutes >= startTotal && minutes < endTotal;
  });
};

export const defaultSchedule: WeekSchedule = {
  monday: { isOpen: true, ranges: [{ start: '08:30', end: '12:30' }, { start: '14:00', end: '18:00' }] },
  tuesday: { isOpen: true, ranges: [{ start: '08:30', end: '12:30' }, { start: '14:00', end: '18:00' }] },
  wednesday: { isOpen: true, ranges: [{ start: '08:30', end: '12:30' }, { start: '14:00', end: '18:00' }] },
  thursday: { isOpen: true, ranges: [{ start: '08:30', end: '12:30' }, { start: '14:00', end: '18:00' }] },
  friday: { isOpen: true, ranges: [{ start: '08:30', end: '12:30' }, { start: '14:00', end: '17:00' }] },
  saturday: { isOpen: false, ranges: [] },
  sunday: { isOpen: false, ranges: [] },
};
