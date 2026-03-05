import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#fafafa',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#3a3a3c'
  },
  // Typography helpers
  text: {
    fontFamily: 'Helvetica'
  },
  
  // Top decorative gradient strip - using brand color
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#1F4597'
  },
  
  // Cover Page
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20
  },
  coverAccentLine: {
    width: 60,
    height: 3,
    backgroundColor: '#1F4597',
    marginBottom: 20,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c2c2e',
    letterSpacing: -1.5
  },
  coverBy: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#86868b',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#1F4597',
    marginBottom: 32,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  coverDate: {
    fontSize: 15,
    color: '#2c2c2e',
    fontWeight: 'bold'
  },
  coverDateLabel: {
    fontSize: 11,
    color: '#86868b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  brandAccent: {
    color: '#1F4597'
  },
  brandLight: {
    color: '#5087FF'
  },
  
  // Configuration Section (Cover Page) - Using brand colors and subtle pattern
  configContainer: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    alignSelf: 'stretch',
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    shadowColor: '#1F4597',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  configHeader: {
    backgroundColor: '#1F4597',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  configTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid'
  },
  configRowVertical: {
    flexDirection: 'column',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid',
    width: '100%'
  },
  configScheduleRow: {
    borderBottomWidth: 0,
    backgroundColor: '#faf8fb',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  configLabel: {
    fontSize: 9,
    color: '#1F4597',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flexShrink: 0
  },
  configValue: {
    fontSize: 10,
    color: '#2c2c2e',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    paddingLeft: 12
  },
  configValueBlockText: {
    fontSize: 10,
    color: '#2c2c2e',
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'left',
    lineHeight: 1.5
  },
  
  // Help Box - NDI vs SIP explanation
  helpBox: {
    marginTop: 20,
    marginHorizontal: 30,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
    borderLeftStyle: 'solid',
    overflow: 'hidden'
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 14,
    gap: 10
  },
  helpIcon: {
    width: 22,
    height: 22,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
    borderBottomLeftRadius: 11,
    backgroundColor: '#34c759',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  helpTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  helpContent: {
    padding: 14
  },
  helpItem: {
    marginBottom: 10
  },
  helpLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4
  },
  helpDescription: {
    fontSize: 9,
    color: '#57575c',
    lineHeight: 1.5
  },
  helpDivider: {
    height: 1,
    backgroundColor: '#e5e5ea',
    marginTop: 10,
    marginBottom: 10
  },
  
  // Header/Footer with brand colors
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1F4597',
    borderBottomStyle: 'solid'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F4597',
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#86868b',
    fontStyle: 'italic'
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    borderTopStyle: 'solid',
    paddingTop: 12
  },
  footerText: {
    fontSize: 9,
    color: '#86868b'
  },

  // Sections with brand accent
  section: {
    marginBottom: 18
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F4597',
    marginBottom: 6,
    letterSpacing: -0.3,
    borderLeftWidth: 3,
    borderLeftColor: '#5087FF',
    borderLeftStyle: 'solid',
    paddingLeft: 10
  },
  sectionDescription: {
    fontSize: 9,
    color: '#66666b',
    marginBottom: 12,
    lineHeight: 1.4,
    textAlign: 'justify',
    paddingLeft: 13
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  
  // Cards - Enhanced with brand colors and subtle depth
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    shadowColor: '#1F4597',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  cardLabel: {
    fontSize: 8,
    color: '#1F4597',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c2c2e',
    letterSpacing: -0.5
  },
  cardSubtext: {
    fontSize: 9,
    color: '#86868b',
    marginTop: 8,
    lineHeight: 1.3
  },

  // Charts container with enhanced styling
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#1F4597',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  chartImage: {
    width: '100%',
    height: 190,
    objectFit: 'contain'
  },
  insightBox: {
    backgroundColor: '#fef3c7', 
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    borderLeftStyle: 'solid'
  },
  insightText: {
    fontSize: 10,
    color: '#92400e',
    fontWeight: 'bold'
  },

  // Guide Cards with brand colors
  guideCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    overflow: 'hidden',
    shadowColor: '#1F4597',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  guideFullCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: '#1F4597',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  guideCardHeader: {
    backgroundColor: '#f0fdf4',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  guideCardIcon: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#166534',
    backgroundColor: '#bbf7d0',
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4
  },
  guideCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  guideCardContent: {
    padding: 16
  },
  guideText: {
    fontSize: 10,
    color: '#3a3a3c',
    lineHeight: 1.5,
    marginBottom: 8
  },
  guideBold: {
    fontWeight: 'bold',
    color: '#1F4597'
  },
  guideExample: {
    fontSize: 10,
    color: '#1F4597',
    fontWeight: 'bold',
    backgroundColor: '#f0f4ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    marginVertical: 10,
    textAlign: 'center'
  },
  guideBullet: {
    marginTop: 8,
    gap: 4
  },
  guideBulletText: {
    fontSize: 9,
    color: '#57575c',
    lineHeight: 1.4
  },
  
  // Flow diagram styles
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4
  },
  // Flow diagram with brand colors
  flowNumber: {
    width: 24,
    height: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#1F4597',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 4
  },
  flowText: {
    fontSize: 10,
    color: '#3a3a3c',
    flex: 1
  },
  flowArrow: {
    fontSize: 14,
    color: '#86868b',
    textAlign: 'center',
    marginVertical: 2,
    paddingLeft: 5
  },
  
  // Calculation cards with brand styling
  calcCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    padding: 16,
    shadowColor: '#1F4597',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  calcTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F4597',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8ed',
    borderBottomStyle: 'solid',
    paddingBottom: 10
  },
  calcItem: {
    marginBottom: 12
  },
  calcLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c2c2e',
    marginBottom: 4
  },
  calcFormula: {
    fontSize: 9,
    color: '#1F4597',
    backgroundColor: '#f0f4ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    marginBottom: 6,
    fontStyle: 'italic'
  },
  calcDesc: {
    fontSize: 9,
    color: '#57575c',
    lineHeight: 1.4
  },
  calcDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12
  },
  
  // Minimal KPI Cards - Clean design like StatsCards
  simpleCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },
  simpleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  simpleCardLabel: {
    fontSize: 9,
    color: '#86868b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1
  },
  simpleCardIcon: {
    width: 28,
    height: 28,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  simpleCardIconBlue: { backgroundColor: '#f0f4ff' },
  simpleCardIconGreen: { backgroundColor: '#f0fdf4' },
  simpleCardIconRed: { backgroundColor: '#fef2f2' },
  simpleCardIconAmber: { backgroundColor: '#fffbeb' },
  simpleCardIconPurple: { backgroundColor: '#f3e8ff' },
  simpleCardIconText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  simpleCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    letterSpacing: -0.5,
    marginBottom: 4
  },
  simpleCardValueGreen: { color: '#34c759' },
  simpleCardValueRed: { color: '#ff3b30' },
  simpleCardValueAmber: { color: '#f59e0b' },
  simpleCardSubtext: {
    fontSize: 9,
    color: '#aeaeb2',
    lineHeight: 1.3
  },
  // Progress bar for rates
  progressContainer: {
    marginTop: 12,
    height: 4,
    backgroundColor: '#f2f2f7',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
    overflow: 'hidden'
  },
  progressBarGreen: {
    height: 4,
    backgroundColor: '#34c759',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2
  },
  progressBarRed: {
    height: 4,
    backgroundColor: '#ff3b30',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2
  },
  // Simple section container
  simpleSection: {
    marginBottom: 20
  },
  simpleSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 12,
    letterSpacing: -0.3
  },
  simpleSectionGrid: {
    gap: 10
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    overflow: 'hidden',
    shadowColor: '#1F4597',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  kpiCardHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  kpiCardHeaderBlue: {
    backgroundColor: '#f0f4ff',
    borderBottomWidth: 2,
    borderBottomColor: '#0071e3',
    borderBottomStyle: 'solid'
  },
  kpiCardHeaderGreen: {
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 2,
    borderBottomColor: '#34c759',
    borderBottomStyle: 'solid'
  },
  kpiCardHeaderRed: {
    backgroundColor: '#fef2f2',
    borderBottomWidth: 2,
    borderBottomColor: '#ff3b30',
    borderBottomStyle: 'solid'
  },
  kpiCardHeaderAmber: {
    backgroundColor: '#fffbeb',
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
    borderBottomStyle: 'solid'
  },
  kpiCardLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  kpiCardLabelBlue: { color: '#0071e3' },
  kpiCardLabelGreen: { color: '#34c759' },
  kpiCardLabelRed: { color: '#ff3b30' },
  kpiCardLabelAmber: { color: '#f59e0b' },
  kpiCardContent: {
    padding: 14,
    alignItems: 'center'
  },
  kpiCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -1,
    marginBottom: 4
  },
  kpiCardValueBlue: { color: '#0071e3' },
  kpiCardValueGreen: { color: '#34c759' },
  kpiCardValueRed: { color: '#ff3b30' },
  kpiCardValueAmber: { color: '#f59e0b' },
  kpiCardValueDark: { color: '#2c2c2e' },
  kpiCardSubtext: {
    fontSize: 9,
    color: '#86868b',
    textAlign: 'center',
    lineHeight: 1.3
  },
  kpiCardBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    paddingTop: 3,
    paddingBottom: 3,
    paddingHorizontal: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },
  kpiCardBadgeGreen: {
    backgroundColor: '#34c759',
    color: '#ffffff'
  },
  kpiCardBadgeRed: {
    backgroundColor: '#ff3b30',
    color: '#ffffff'
  },
  kpiCardBadgeAmber: {
    backgroundColor: '#f59e0b',
    color: '#ffffff'
  },
  // Section container with background
  statsSection: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#1F4597',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  statsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid'
  },
  statsSectionIcon: {
    width: 32,
    height: 32,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  statsSectionIconText: {
    fontSize: 14,
    color: '#1F4597',
    fontWeight: 'bold'
  },
  statsSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F4597',
    letterSpacing: -0.3
  },
  statsSectionSubtitle: {
    fontSize: 9,
    color: '#86868b',
    marginTop: 2
  },
  defGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12
  },
  defItem: {
    width: '48%',
    marginBottom: 8
  },
  // Definition with brand colors
  defTerm: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F4597',
    marginBottom: 2
  },
  defDesc: {
    fontSize: 8,
    color: '#57575c',
    lineHeight: 1.3
  },

  // Tables - Artistic redesign with brand accent
  table: {
    width: '100%',
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#f0f0f0',
    borderLeftColor: '#f0f0f0',
    borderRightColor: '#f0f0f0',
    borderBottomColor: '#e5e5ea',
    borderTopStyle: 'solid',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid'
  },
  // Tables with brand styling
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1F4597',
    borderBottomStyle: 'solid'
  },
  tableHeaderCell: {
    fontSize: 9,
    color: '#1F4597',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  tableRow: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f7',
    borderBottomStyle: 'solid',
    alignItems: 'center'
  },
  tableRowEven: {
    backgroundColor: '#fafafa'
  },
  tableCell: {
    fontSize: 9,
    color: '#3a3a3c'
  },
  tableCellBold: {
    fontSize: 9,
    color: '#1F4597',
    fontWeight: 'bold'
  }
});
