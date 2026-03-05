import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, Image, Font, StyleSheet } from '@react-pdf/renderer';
import { styles } from './ReportStyles';
import { Stats, ProjectConfig, DateRange, ChartsData, LineConfig, WeekSchedule } from '../../types';
import { formatDuration } from '../../utils/formatters';

interface ReportDocumentProps {
  stats: Stats;
  config: ProjectConfig | null;
  dateRange: DateRange;
  charts: {
    hourly: string | null;
    daily: string | null;
    distribution: string | null;
    dailyRate: string | null;
  };
  chartsData?: ChartsData;
  logoData: string | null;
}

// Logo path for OpenZyra - using webp
const LOGO_PATH = '/OpenZyra.webp';

// Disable hyphenation globally to prevent ugly word breaks
Font.registerHyphenationCallback((word) => [word]);

// Component that displays logo - OpenZyra logo
const LogoImage = ({ logoData }: { logoData: string | null }) => {
  if (!logoData) {
    // Render text placeholder if no image data
    return (
      <View style={{ marginBottom: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1e293b', letterSpacing: -0.5 }}>
          OpenZyra
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 24, alignItems: 'center' }}>
      <Image 
        src={logoData}
        style={{ width: 200, height: 60, objectFit: 'contain' }}
      />
    </View>
  );
};

// Composant pour l'en-tête de chaque page
const PageHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <View style={styles.header} wrap={false}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>{subtitle}</Text>
  </View>
);

// Composant pour le pied de page dynamique
const PageFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>OpenZyra - Confidentiel</Text>
    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} sur ${totalPages}`} />
  </View>
);

// Composant pour les decorations d'arriere-plan subliles
const BackgroundDecoration = () => (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
    {/* Cercle decoratif en haut a droite */}
    <View style={{
      position: 'absolute',
      top: 40,
      right: -60,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: '#1F4597',
      opacity: 0.03
    }} />
    {/* Cercle decoratif en bas a gauche */}
    <View style={{
      position: 'absolute',
      bottom: 80,
      left: -40,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: '#5087FF',
      opacity: 0.04
    }} />
    {/* Petits cercles decoratifs */}
    <View style={{
      position: 'absolute',
      top: 120,
      left: 30,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#1F4597',
      opacity: 0.06
    }} />
    <View style={{
      position: 'absolute',
      bottom: 200,
      right: 40,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#5087FF',
      opacity: 0.08
    }} />
    {/* Ligne decorative verticale */}
    <View style={{
      position: 'absolute',
      left: 20,
      top: 100,
      bottom: 100,
      width: 2,
      backgroundColor: '#1F4597',
      opacity: 0.02
    }} />
  </View>
);

export const ReportDocument: React.FC<ReportDocumentProps> = ({ stats, config, dateRange, charts, chartsData, logoData }) => {
  const formatDate = (d: string) => {
    if (!d) return '-';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  const periodStr = `${formatDate(dateRange.start)} au ${formatDate(dateRange.end)}`;

  // Find peak missed hour
  let peakMissedInsight = null;
  if (chartsData && chartsData.hourly && chartsData.hourly.length > 0) {
    const peakHour = chartsData.hourly.reduce((max, current) => 
      (current.Manqué > max.Manqué) ? current : max
    , chartsData.hourly[0]);

    if (peakHour && peakHour.Manqué > 0) {
      // Removed emoji to fix PDF rendering artifact, using standard text
      peakMissedInsight = `Pic d'appels perdus constaté à ${peakHour.hour} (${peakHour.Manqué} appels)`;
    }
  }

  // Calculate Total Wait Time from average and answered count (since wait time is tracked on answered calls usually)
  // Or if it's available in stats... wait, total wait time is avg * count
  const totalWaitTime = stats.avgAnsweredWaitTime * stats.answeredCount;

  // Build schedule string
  const formatSchedule = (schedule?: WeekSchedule) => {
    if (!schedule) return "Non configuré";
    
    const dayToKey: Record<string, keyof WeekSchedule> = {
        'lundi': 'monday',
        'mardi': 'tuesday',
        'mercredi': 'wednesday',
        'jeudi': 'thursday',
        'vendredi': 'friday',
        'samedi': 'saturday',
        'dimanche': 'sunday'
    };

    const dayMap: Record<string, string> = {
      'lundi': 'Lun', 'mardi': 'Mar', 'mercredi': 'Mer', 'jeudi': 'Jeu', 'vendredi': 'Ven', 'samedi': 'Sam', 'dimanche': 'Dim'
    };

    // Group days by identical ranges
    const groups: { ranges: string, days: string[] }[] = [];
    
    // Iterate in fixed order: Mon -> Sun
    const orderedDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

    orderedDays.forEach(day => {
        const key = dayToKey[day];
        const dayConfig = schedule[key];
        
        if (!dayConfig || !dayConfig.isOpen) return;
        
        // Safeguard against missing ranges
        if (!dayConfig.ranges || !Array.isArray(dayConfig.ranges)) return;

        const rangeStr = dayConfig.ranges.map((r: any) => `${r.start}-${r.end}`).join(' / ');
        
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.ranges === rangeStr) {
            lastGroup.days.push(dayMap[day]);
        } else {
            groups.push({ ranges: rangeStr, days: [dayMap[day]] });
        }
    });

    if (groups.length === 0) return "Fermé";

    return groups.map(g => {
        const dayStr = g.days.length > 2 
            ? `${g.days[0]}-${g.days[g.days.length - 1]}`
            : g.days.join(', ');
        return `${dayStr}: ${g.ranges}`;
    }).join(' • ');
  };

  const scheduleSummary = config && config.schedule ? formatSchedule(config.schedule) : "Non configuré";
  
  // Extract Lines Info safely
  const lines: Record<string, LineConfig> = config?.lines || {};
  const mainLine = config && lines[config.mainNdi] ? lines[config.mainNdi] : null;
  const otherNdis = Object.values(lines).filter(l => l.type === 'NDI' && config && l.number !== config.mainNdi);
  const sipLines = Object.values(lines).filter(l => l.type === 'SIP');

  const otherNdisStr = otherNdis.map(l => l.name ? `${l.name} (${l.number})` : l.number).join(', ');
  const sipLinesStr = sipLines.map(l => l.name ? `${l.name} (${l.number})` : l.number).join(', ');

  const renderConfigItem = (label: string, value: string) => {
    // Switch to vertical layout if value is long
    const isLong = value.length > 60;
    
    if (isLong) {
        return (
            <View style={styles.configRowVertical}>
                <Text style={styles.configLabel}>{label}</Text>
                <Text style={styles.configValueBlockText}>{value}</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.configRow}>
            <Text style={styles.configLabel}>{label}</Text>
            <Text style={styles.configValue}>{value}</Text>
        </View>
    );
  };

  return (
    <Document>
      {/* PAGE 1: COVER */}
      <Page size="A4" style={styles.page}>
        <BackgroundDecoration />
        
        {/* Decorative gradient strip at top */}
        <View style={styles.topGradient} />
        
        <View style={styles.coverContainer}>
          {/* Logo */}
          <LogoImage logoData={logoData} />

          <View style={styles.coverAccentLine} />
          
          <Text style={styles.coverSubtitle}>
            Rapport d'Analyse Téléphonique
          </Text>

          <View style={{ marginTop: 40, marginBottom: 28 }}>
            <Text style={styles.coverDateLabel}>Période analysée</Text>
            <Text style={styles.coverDate}>{periodStr}</Text>
          </View>

          {/* CONFIGURATION SUMMARY */}
          {config && (
              <View style={styles.configContainer}>
                  <View style={styles.configHeader}>
                    <Text style={styles.configTitle}>Paramètres du Rapport</Text>
                  </View>
                  
                  {renderConfigItem(
                      "Ligne Principale (NDI)", 
                      mainLine ? `${mainLine.name ? mainLine.name + ' ' : ''}(${mainLine.number})` : config.mainNdi
                  )}

                  {otherNdis.length > 0 && renderConfigItem("Autres Lignes NDI", otherNdisStr)}

                  {sipLines.length > 0 && renderConfigItem("Lignes SIP Déclarées", sipLinesStr)}

                  <View style={[styles.configRow, styles.configScheduleRow]}>
                      <Text style={styles.configLabel}>Horaires d'Ouverture</Text>
                      <Text style={[styles.configValue, { maxWidth: 250, textAlign: 'right' }]}>{scheduleSummary}</Text>
                  </View>
              </View>
          )}
        </View>

        <View style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center' }}>
          <Text style={styles.footerText}>
            Généré le {new Date().toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Page>

      {/* PAGE 2: GUIDE & EXPLICATIONS */}
      <Page size="A4" style={styles.page}>
        <BackgroundDecoration />
        <PageHeader title="Guide de compréhension" subtitle={periodStr} />

        <View style={styles.row}>
          {/* NDI Section */}
          <View style={[styles.guideCard, { flex: 1 }]} wrap={false}>
            <View style={styles.guideCardHeader}>
              <Text style={styles.guideCardTitle}>NDI - Numéro Direct Inward</Text>
            </View>
            <View style={styles.guideCardContent}>
              <Text style={styles.guideText}>
                <Text style={styles.guideBold}>Qu'est-ce que c'est ?</Text>
              </Text>
              <Text style={styles.guideText}>
                Un NDI est votre numéro de téléphone fixe standard, celui que vos clients voient et composent. C'est la "façade" de votre système téléphonique.
              </Text>
              <Text style={styles.guideExample}>
                Exemple : 03 84 XX XX XX
              </Text>
              <View style={styles.guideBullet}>
                <Text style={styles.guideBulletText}>• Numéro public et visible</Text>
                <Text style={styles.guideBulletText}>• Point d'entrée des appels entrants</Text>
                <Text style={styles.guideBulletText}>• Peut être géographique (03=Franche-Comté) ou national (09)</Text>
              </View>
            </View>
          </View>

          {/* SIP Section */}
          <View style={[styles.guideCard, { flex: 1 }]} wrap={false}>
            <View style={[styles.guideCardHeader, { backgroundColor: '#dbeafe' }]}>
              <Text style={[styles.guideCardTitle, { color: '#1e40af' }]}>SIP - Lignes Internes</Text>
            </View>
            <View style={styles.guideCardContent}>
              <Text style={styles.guideText}>
                <Text style={styles.guideBold}>Qu'est-ce que c'est ?</Text>
              </Text>
              <Text style={styles.guideText}>
                Le SIP est un protocole qui gère vos lignes internes virtuelles. Ce sont les "tuyaux" invisibles qui distribuent les appels à vos téléphones.
              </Text>
              <Text style={styles.guideExample}>
                Exemple : +33230960XXX
              </Text>
              <View style={styles.guideBullet}>
                <Text style={styles.guideBulletText}>• Invisible pour l'appelant</Text>
                <Text style={styles.guideBulletText}>• Chaque téléphone/agent a sa ligne SIP</Text>
                <Text style={styles.guideBulletText}>• Permet le transfert et la gestion d'appels</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Comment ça marche ensemble */}
        <View style={styles.guideFullCard} wrap={false}>
          <View style={[styles.guideCardHeader, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.guideCardTitle, { color: '#92400e' }]}>Comment ça fonctionne ensemble ?</Text>
          </View>
          <View style={styles.guideCardContent}>
            <View style={styles.flowStep}>
              <Text style={styles.flowNumber}>1</Text>
              <Text style={styles.flowText}>Le client appelle votre <Text style={styles.guideBold}>NDI</Text> (numéro public)</Text>
            </View>
            <View style={styles.flowArrow}>↓</View>
            <View style={styles.flowStep}>
              <Text style={styles.flowNumber}>2</Text>
              <Text style={styles.flowText}>L'appel arrive sur votre système et est routé via les <Text style={styles.guideBold}>lignes SIP</Text></Text>
            </View>
            <View style={styles.flowArrow}>↓</View>
            <View style={styles.flowStep}>
              <Text style={styles.flowNumber}>3</Text>
              <Text style={styles.flowText}>Un téléphone SIP sonne et l'agent décroche</Text>
            </View>
            <View style={styles.flowArrow}>↓</View>
            <View style={styles.flowStep}>
              <Text style={styles.flowNumber}>4</Text>
              <Text style={styles.flowText}>L'appel est enregistré dans le rapport avec les statistiques</Text>
            </View>
          </View>
        </View>

        <PageFooter />
      </Page>

      {/* PAGE 3: CALCULS & FORMULES */}
      <Page size="A4" style={styles.page}>
        <BackgroundDecoration />
        <PageHeader title="Comprendre les calculs" subtitle={periodStr} />

        <View style={styles.row}>
          {/* KPI Calculations */}
          <View style={[styles.calcCard, { flex: 1 }]} wrap={false}>
            <Text style={styles.calcTitle}>Indicateurs clés</Text>
            
            <View style={styles.calcItem}>
              <Text style={styles.calcLabel}>Taux de Réponse</Text>
              <Text style={styles.calcFormula}>(Appels Traités ÷ Appels Présentés) × 100</Text>
              <Text style={styles.calcDesc}>Pourcentage d'appels effectivement pris en charge par vos agents.</Text>
            </View>

            <View style={styles.calcDivider} />

            <View style={styles.calcItem}>
              <Text style={styles.calcLabel}>Taux de Perte</Text>
              <Text style={styles.calcFormula}>(Appels Perdus ÷ Appels Présentés) × 100</Text>
              <Text style={styles.calcDesc}>Pourcentage d'appels non pris = abandons + débordements.</Text>
            </View>

            <View style={styles.calcDivider} />

            <View style={styles.calcItem}>
              <Text style={styles.calcLabel}>Moyenne par Jour</Text>
              <Text style={styles.calcFormula}>Total des Appels ÷ Nombre de Jours</Text>
              <Text style={styles.calcDesc}>Volume moyen d'appels sur la période analysée.</Text>
            </View>
          </View>

          {/* Time Calculations */}
          <View style={[styles.calcCard, { flex: 1 }]} wrap={false}>
            <Text style={styles.calcTitle}>Temps & durées</Text>
            
            <View style={styles.calcItem}>
              <Text style={styles.calcLabel}>Temps d'Attente Moyen</Text>
              <Text style={styles.calcFormula}>Somme des Attentes ÷ Nombre d'Appels Traités</Text>
              <Text style={styles.calcDesc}>Temps moyen que le client attend avant qu'un agent décroche.</Text>
            </View>

            <View style={styles.calcDivider} />

            <View style={styles.calcItem}>
              <Text style={styles.calcLabel}>Durée Moyenne d'Appel</Text>
              <Text style={styles.calcFormula}>Somme des Durées ÷ Nombre d'Appels Traités</Text>
              <Text style={styles.calcDesc}>Temps moyen de conversation entre l'agent et le client.</Text>
            </View>

            <View style={styles.calcDivider} />

            <View style={styles.calcItem}>
              <Text style={styles.calcLabel}>Attente Cumulée</Text>
              <Text style={styles.calcFormula}>Attente Moyenne × Nombre d'Appels</Text>
              <Text style={styles.calcDesc}>Temps total passé par tous les clients à attendre.</Text>
            </View>
          </View>
        </View>

        {/* Definitions */}
        <View style={styles.guideFullCard} wrap={false}>
          <View style={[styles.guideCardHeader, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.guideCardTitle, { color: '#92400e' }]}>Définitions des termes</Text>
          </View>
          <View style={styles.defGrid}>
            <View style={styles.defItem}>
              <Text style={styles.defTerm}>Appel Présenté</Text>
              <Text style={styles.defDesc}>Appel qui a atteint votre système (sonné au moins une fois)</Text>
            </View>
            <View style={styles.defItem}>
              <Text style={styles.defTerm}>Appel Traité</Text>
              <Text style={styles.defDesc}>Appel où un agent a décroché et parlé avec le client</Text>
            </View>
            <View style={styles.defItem}>
              <Text style={styles.defTerm}>Appel Perdu</Text>
              <Text style={styles.defDesc}>Appel sans réponse ou raccroché par le client en attente</Text>
            </View>
            <View style={styles.defItem}>
              <Text style={styles.defTerm}>Hors Ouverture</Text>
              <Text style={styles.defDesc}>Appels reçus en dehors des horaires configurés</Text>
            </View>
          </View>
        </View>

        <PageFooter />
      </Page>

        {/* PAGE 4: KPI & GLOBAL STATS */}
      <Page size="A4" style={styles.page}>
        <BackgroundDecoration />
        <PageHeader title="Performance globale" subtitle={periodStr} />

        {/* Vue d'ensemble - Volume */}
        <View style={styles.simpleSection} wrap={false}>
          <Text style={styles.simpleSectionTitle}>Volume d'appels</Text>
          <View style={styles.row}>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Appels entrants</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconBlue]}>
                  <Text style={[styles.simpleCardIconText, { color: '#1F4597' }]}>P</Text>
                </View>
              </View>
              <Text style={styles.simpleCardValue}>{stats.totalCalls}</Text>
              <Text style={styles.simpleCardSubtext}>Total présentés</Text>
            </View>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Répondus</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconGreen]}>
                  <Text style={[styles.simpleCardIconText, { color: '#34c759' }]}>C</Text>
                </View>
              </View>
              <Text style={[styles.simpleCardValue, styles.simpleCardValueGreen]}>{stats.answeredCount}</Text>
              <Text style={styles.simpleCardSubtext}>Pris en charge</Text>
            </View>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Perdus</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconRed]}>
                  <Text style={[styles.simpleCardIconText, { color: '#ff3b30' }]}>M</Text>
                </View>
              </View>
              <Text style={[styles.simpleCardValue, styles.simpleCardValueRed]}>{stats.missedCount}</Text>
              <Text style={styles.simpleCardSubtext}>Sans réponse</Text>
            </View>
          </View>
        </View>

        {/* Taux de performance avec barres */}
        <View style={styles.simpleSection} wrap={false}>
          <Text style={styles.simpleSectionTitle}>Performance</Text>
          <View style={styles.row}>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Taux de réponse</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconGreen]}>
                  <Text style={[styles.simpleCardIconText, { color: '#34c759' }]}>%</Text>
                </View>
              </View>
              <Text style={[styles.simpleCardValue, styles.simpleCardValueGreen]}>{stats.answeredRate.toFixed(1)}%</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBarGreen, { width: `${stats.answeredRate}%` }]} />
              </View>
            </View>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Taux de perte</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconRed]}>
                  <Text style={[styles.simpleCardIconText, { color: '#ff3b30' }]}>%</Text>
                </View>
              </View>
              <Text style={[styles.simpleCardValue, styles.simpleCardValueRed]}>{stats.missedRate.toFixed(1)}%</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBarRed, { width: `${stats.missedRate}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Temps */}
        <View style={styles.simpleSection} wrap={false}>
          <Text style={styles.simpleSectionTitle}>Durées</Text>
          <View style={styles.row}>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Durée moyenne</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconPurple]}>
                  <Text style={[styles.simpleCardIconText, { color: '#9333ea' }]}>T</Text>
                </View>
              </View>
              <Text style={styles.simpleCardValue}>{formatDuration(stats.avgCallDuration)}</Text>
              <Text style={styles.simpleCardSubtext}>Par appel</Text>
            </View>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Durée totale</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconBlue]}>
                  <Text style={[styles.simpleCardIconText, { color: '#1F4597' }]}>H</Text>
                </View>
              </View>
              <Text style={styles.simpleCardValue}>{formatDuration(stats.totalDuration)}</Text>
              <Text style={styles.simpleCardSubtext}>Toutes conversations</Text>
            </View>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Attente moyenne</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconAmber]}>
                  <Text style={[styles.simpleCardIconText, { color: '#f59e0b' }]}>A</Text>
                </View>
              </View>
              <Text style={[styles.simpleCardValue, styles.simpleCardValueAmber]}>{formatDuration(stats.avgAnsweredWaitTime)}</Text>
              <Text style={styles.simpleCardSubtext}>Avant décrochage</Text>
            </View>
          </View>
        </View>

        {/* Hors horaires */}
        <View style={styles.simpleSection} wrap={false}>
          <Text style={styles.simpleSectionTitle}>Hors ouverture</Text>
          <View style={styles.row}>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Total hors horaires</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconRed]}>
                  <Text style={[styles.simpleCardIconText, { color: '#ff3b30' }]}>!</Text>
                </View>
              </View>
              <Text style={[styles.simpleCardValue, styles.simpleCardValueRed]}>{stats.totalMissedOutsideHours}</Text>
              <Text style={styles.simpleCardSubtext}>Appels en fermeture</Text>
            </View>
            <View style={styles.simpleCard}>
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardLabel}>Moyenne / jour</Text>
                <View style={[styles.simpleCardIcon, styles.simpleCardIconAmber]}>
                  <Text style={[styles.simpleCardIconText, { color: '#f59e0b' }]}>J</Text>
                </View>
              </View>
              <Text style={[styles.simpleCardValue, styles.simpleCardValueAmber]}>{Math.round(stats.avgCallsOutsideHours)}</Text>
              <Text style={styles.simpleCardSubtext}>Flux quotidien</Text>
            </View>
          </View>
        </View>

        <PageFooter />
      </Page>

      {/* PAGE 5: CHARTS */}
      <Page size="A4" style={styles.page}>
        <BackgroundDecoration />
        <PageHeader title="Analyses graphiques" subtitle={periodStr} />

        {charts.hourly && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Distribution horaire</Text>
            <Text style={styles.sectionDescription}>
              Ce graphique illustre la répartition des appels tout au long de la journée (cumul sur la période globale). Il permet d'identifier facilement les pics d'activité (heures de pointe) ainsi que les creux. Ces informations sont précieuses pour optimiser la planification de vos effectifs en interne.
            </Text>
            <View style={styles.chartContainer}>
              <Image src={charts.hourly} style={styles.chartImage} />
            </View>
            {peakMissedInsight && (
              <View style={styles.insightBox}>
                <Text style={styles.insightText}>{peakMissedInsight}</Text>
              </View>
            )}
          </View>
        )}

        {charts.daily && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Évolution quotidienne</Text>
            <Text style={styles.sectionDescription}>
              Suivi du volume d'appels jour par jour sur l'ensemble de la période analysée. Cette chronologie permet de repérer les tendances à court et moyen terme, d'identifier les variations liées aux jours de la semaine, et d'observer l'impact d'événements spécifiques externes.
            </Text>
            <View style={styles.chartContainer}>
              <Image src={charts.daily} style={styles.chartImage} />
            </View>
          </View>
        )}

        {charts.distribution && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Répartition globale</Text>
            <Text style={styles.sectionDescription}>
              Vue synthétique de la répartition des appels sur la période complète. Ce graphique permet de comprendre d'un coup d'oeil la proportion entre appels traités, manqués et hors horaires d'ouverture.
            </Text>
            <View style={styles.chartContainer}>
              <Image src={charts.distribution} style={styles.chartImage} />
            </View>
          </View>
        )}

        {charts.dailyRate && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Taux de réponse journalier</Text>
            <Text style={styles.sectionDescription}>
              Évolution du taux de réponse jour par jour. Cette courbe permet d'identifier les jours à problème et d'observer les tendances d'amélioration ou de détérioration de la qualité de service au fil du temps.
            </Text>
            <View style={styles.chartContainer}>
              <Image src={charts.dailyRate} style={styles.chartImage} />
            </View>
          </View>
        )}

        <PageFooter />
      </Page>

      {/* PAGE 6: DETAILS */}
      <Page size="A4" style={styles.page}>
        <BackgroundDecoration />
        <PageHeader title="Détails opérationnels" subtitle={periodStr} />

        <View style={styles.row}>
          {/* TOP AGENTS */}
          <View style={{ flex: 1 }} wrap={false}>
            <Text style={styles.sectionTitle}>Performance agents</Text>
            <Text style={styles.sectionDescription}>
              Classement des agents par volume d'appels traités.
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Agent</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Vol.</Text>
              </View>
              {stats.topAgents.slice(0, 10).map((agent, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]}>
                  <Text style={[styles.tableCell, { flex: 3 }]}>{i + 1}. {agent.name}</Text>
                  <Text style={[styles.tableCellBold, { flex: 1, textAlign: 'right' }]}>{agent.count}</Text>
                </View>
              ))}
              {stats.topAgents.length === 0 && (
                <Text style={[styles.tableCell, { margin: 16, color: '#86868b', fontStyle: 'italic', textAlign: 'center' }]}>Aucune donnée.</Text>
              )}
            </View>
          </View>

          {/* TOP CALLERS */}
          <View style={{ flex: 1 }} wrap={false}>
            <Text style={styles.sectionTitle}>Appelants fréquents</Text>
            <Text style={styles.sectionDescription}>
              Top 10 des numéros les plus actifs.
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Numéro</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Vol.</Text>
              </View>
              {stats.topCallers.slice(0, 10).map((caller, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]}>
                  <Text style={[styles.tableCell, { flex: 3 }]}>{i + 1}. {caller.number}</Text>
                  <Text style={[styles.tableCellBold, { flex: 1, textAlign: 'right' }]}>{caller.count}</Text>
                </View>
              ))}
              {stats.topCallers.length === 0 && (
                <Text style={[styles.tableCell, { margin: 16, color: '#86868b', fontStyle: 'italic', textAlign: 'center' }]}>Aucune donnée.</Text>
              )}
            </View>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};
