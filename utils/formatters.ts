// =============================================================================
// FONCTIONS DE FORMATAGE - utils/formatters.ts
// =============================================================================
// Utilitaires de présentation pour les données téléphoniques.
// Toutes les fonctions sont pures (pas d'effets de bord) et peuvent être
// utilisées en toute sécurité dans les composants React.
//
// FONCTIONS:
// - formatDuration(): Convertit secondes en format lisible "2m 30s"
// - formatDate(): Formate une date en français (JJ/MM/AAAA)
// - formatDateTime(): Formate date+heure en français (JJ/MM/AAAA HH:mm:ss)
// - normalizePhoneNumber(): Normalise les numéros au format +33XXXXXXXXX
//
// IMPORTANT: normalizePhoneNumber() doit TOUJOURS être utilisée avant
// de comparer des numéros de téléphone (pour éviter les faux non-match
// entre "0123456789", "+33123456789", "0033123456789")
// =============================================================================

/**
 * formatDuration - Convertit des secondes en format lisible
 * @param seconds - Durée en secondes
 * @returns Chaîne formatée (ex: "2m 30s" ou "1h 30m 00s")
 */
export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
  return `${m}m ${pad(s)}s`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Nettoyage : retirer espaces, points, tirets, parenthèses
  let p = phone.replace(/[\s\.\-\(\)]/g, '');
  
  // Format international +33
  if (p.startsWith('+')) return p;
  
  // Format international 0033
  if (p.startsWith('00')) return '+' + p.substring(2);
  
  // Format français 01-09 (10 chiffres) -> +33...
  if (p.length === 10 && p.startsWith('0')) {
      return '+33' + p.substring(1);
  }
  
  return p;
};
