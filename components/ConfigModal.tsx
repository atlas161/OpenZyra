// =============================================================================
// CONFIGMODAL - Configuration Téléphonique
// =============================================================================
// Ce composant gère la configuration du projet téléphonique en 3 étapes:
// 1. Sélection du NDI principal (numéro de présentation)
// 2. Configuration des lignes SIP (postes des agents)
// 3. Définition des horaires d'ouverture
//
// FLUX:
// - Affiché automatiquement après import CSV si configuration incomplète
// - Ou accessible depuis le menu "Configuration" à tout moment
// - Sauvegarde la config dans localStorage + l'applique au traitement
//
// IMPORTANCE:
// La distinction correcte NDI/SIP est CRUCIALE pour les calculs de statistiques.
// Un mauvais mapping entraîne des durées et temps d'attente incorrects.
// =============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Settings, X, Phone, Loader2, Save, PhoneCall, Clock, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, Building2, Calendar, ChevronDown, Check } from 'lucide-react';
import { ProjectConfig, LineConfig, LineType, WeekSchedule, DaySchedule } from '../types';
import { defaultSchedule } from '../utils/schedule';
import { TimePickerModal } from './TimePickerModal';
import { ScheduleTimePicker } from './ScheduleTimePicker';

/**
 * Props du ConfigModal
 */
interface ConfigModalProps {
  detectedLines: string[];              // Lignes détectées dans le CSV
  initialConfig: ProjectConfig | null;  // Configuration existante (édition)
  setShowConfig: (show: boolean) => void;  // Fonction de fermeture
  loading: boolean;                     // État de chargement global
  applyConfiguration: (config: ProjectConfig) => void;  // Application de la config
}

/** Étapes du wizard de configuration */
type ConfigStep = 1 | 2 | 3;

/** Labels français pour les jours de la semaine */
const DAY_LABELS: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche'
};

/**
 * ConfigModal - Wizard de configuration téléphonique
 * Guide l'utilisateur dans la configuration NDI/SIP/horaires
 */
export const ConfigModal: React.FC<ConfigModalProps> = ({
  detectedLines,
  initialConfig,
  setShowConfig,
  loading,
  applyConfiguration
}) => {
  const [currentStep, setCurrentStep] = useState<ConfigStep>(1);
  const [mainNdi, setMainNdi] = useState<string>(initialConfig?.mainNdi || '');
  const [linesConfig, setLinesConfig] = useState<Record<string, LineConfig>>(
    initialConfig?.lines || {}
  );
  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    if (!initialConfig?.schedule) return defaultSchedule;
    return { ...defaultSchedule, ...initialConfig.schedule };
  });
  const [skipSchedule, setSkipSchedule] = useState(false);
  const [showNdiDropdown, setShowNdiDropdown] = useState(false);
  
  // Time picker modal state
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState('08:00');
  const [timePickerTarget, setTimePickerTarget] = useState<{day: keyof WeekSchedule, index: number, field: 'start' | 'end'} | null>(null);
  const [bulkTimePickerOpen, setBulkTimePickerOpen] = useState(false);
  const [bulkTimePickerMode, setBulkTimePickerMode] = useState<'open' | 'close'>('open');

  // Bulk schedule state with day selection
  const [bulkOpen, setBulkOpen] = useState('08:30');
  const [bulkClose, setBulkClose] = useState('18:00');
  const [selectedDaysForBulk, setSelectedDaysForBulk] = useState<Set<string>>(new Set(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']));

  const allLines = useMemo(() => {
    const lines = new Set<string>();
    Object.keys(linesConfig).forEach(line => lines.add(line));
    detectedLines.forEach(line => lines.add(line));
    return Array.from(lines).sort();
  }, [linesConfig, detectedLines]);

  const otherLines = useMemo(() => {
    return allLines.filter(line => line !== mainNdi);
  }, [allLines, mainNdi]);

  const potentialNdis = useMemo(() => {
    return allLines.filter(line => {
      const config = linesConfig[line];
      return config?.type === 'NDI' || line.startsWith('+33');
    });
  }, [allLines, linesConfig]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalScrollTop = window.scrollY;
    
    // Lock scroll on both body and html
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    
    // Prevent any scroll on the document
    const preventScroll = (e: Event) => {
      // Only allow scroll if it's inside the modal content
      const target = e.target as HTMLElement;
      const modalContent = document.querySelector('[data-modal-content]');
      if (modalContent && modalContent.contains(target)) {
        return; // Allow scroll inside modal
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    // Add listeners to document with capture phase
    document.addEventListener('wheel', preventScroll, { capture: true, passive: false });
    document.addEventListener('touchmove', preventScroll, { capture: true, passive: false });
    document.addEventListener('scroll', preventScroll, { capture: true, passive: false });
    
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      
      document.removeEventListener('wheel', preventScroll, { capture: true });
      document.removeEventListener('touchmove', preventScroll, { capture: true });
      document.removeEventListener('scroll', preventScroll, { capture: true });
      
      // Restore scroll position
      window.scrollTo(0, originalScrollTop);
    };
  }, []);

  useEffect(() => {
    const baseLines = initialConfig?.lines || {};
    const mergedLines = { ...baseLines };

    Object.keys(baseLines).forEach(line => {
      if (!mergedLines[line]) {
        mergedLines[line] = baseLines[line];
      }
    });

    detectedLines.forEach(line => {
      if (!mergedLines[line]) {
        mergedLines[line] = { number: line, type: 'UNKNOWN', name: '' };
      }
    });

    setLinesConfig(mergedLines);

    if (initialConfig) {
      setMainNdi(initialConfig.mainNdi);
      setSchedule(prev => ({
        ...defaultSchedule,
        ...(initialConfig.schedule || {})
      }));
    }
  }, [initialConfig, detectedLines]);

  useEffect(() => {
    // Scroll modal content to top when step changes
    const modalContent = document.querySelector('[data-modal-content]');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }, [currentStep]);
  
  const goToStep = (step: ConfigStep) => setCurrentStep(step);
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as ConfigStep);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as ConfigStep);
  };

  const isStep1Valid = mainNdi !== '';
  const isStep2Valid = otherLines.every(line => linesConfig[line]?.type !== 'UNKNOWN');
  const isStep3Valid = skipSchedule || (Object.values(schedule) as DaySchedule[]).some(day => day.isOpen);

  const handleLineTypeChange = (line: string, type: LineType) => {
    setLinesConfig(prev => ({
      ...prev,
      [line]: { ...(prev[line] || { number: line, name: '' }), type }
    }));
  };

  const handleLineNameChange = (line: string, name: string) => {
    setLinesConfig(prev => ({
      ...prev,
      [line]: { ...(prev[line] || { number: line, type: 'UNKNOWN' }), name }
    }));
  };

  const toggleDay = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const addRange = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ranges: [...prev[day].ranges, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const removeRange = (day: keyof WeekSchedule, index: number) => {
    setSchedule(prev => {
      const newRanges = [...prev[day].ranges];
      newRanges.splice(index, 1);
      return {
        ...prev,
        [day]: { ...prev[day], ranges: newRanges }
      };
    });
  };

  const updateRange = (day: keyof WeekSchedule, index: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => {
      const newRanges = [...prev[day].ranges];
      newRanges[index] = { ...newRanges[index], [field]: value };
      return {
        ...prev,
        [day]: { ...prev[day], ranges: newRanges }
      };
    });
  };

  const toggleDayForBulk = (day: keyof WeekSchedule) => {
    setSelectedDaysForBulk(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const applyBulkSchedule = () => {
    const newSchedule = { ...schedule };
    selectedDaysForBulk.forEach(day => {
      newSchedule[day as keyof WeekSchedule] = {
        isOpen: true,
        ranges: [{ start: bulkOpen, end: bulkClose }]
      };
    });
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    if (!isStep1Valid || !isStep2Valid) return;

    const finalLinesConfig = { ...linesConfig };
    if (finalLinesConfig[mainNdi]) {
      finalLinesConfig[mainNdi].type = 'NDI';
    }

    const cleanSchedule: WeekSchedule = JSON.parse(JSON.stringify(schedule));
    (Object.keys(cleanSchedule) as Array<keyof WeekSchedule>).forEach(day => {
      const validRanges = cleanSchedule[day].ranges.filter(r => {
        if (!r.start || !r.end) return false;
        return r.start < r.end;
      });
      validRanges.sort((a, b) => a.start.localeCompare(b.start));
      cleanSchedule[day].ranges = validRanges;
    });

    applyConfiguration({
      mainNdi,
      lines: finalLinesConfig,
      schedule: skipSchedule ? defaultSchedule : cleanSchedule
    });
  };

  const handleTimePickerOpen = (day: keyof WeekSchedule, index: number, field: 'start' | 'end', currentValue: string) => {
    setTimePickerTarget({ day, index, field });
    setTimePickerValue(currentValue || '08:00');
    setTimePickerOpen(true);
  };

  const handleTimePickerConfirm = (value: string) => {
    if (timePickerTarget) {
      updateRange(timePickerTarget.day, timePickerTarget.index, timePickerTarget.field, value);
      
      // Si on vient de valider l'heure de début, passer automatiquement à l'heure de fin
      if (timePickerTarget.field === 'start') {
        const currentRange = schedule[timePickerTarget.day].ranges[timePickerTarget.index];
        setTimePickerTarget({ 
          day: timePickerTarget.day, 
          index: timePickerTarget.index, 
          field: 'end' 
        });
        setTimePickerValue(currentRange?.end || '18:00');
        // Le picker reste ouvert pour sélectionner l'heure de fin
      } else {
        // On a validé l'heure de fin, fermer le picker
        setTimePickerOpen(false);
        setTimePickerTarget(null);
      }
    } else {
      setTimePickerOpen(false);
      setTimePickerTarget(null);
    }
  };

  const handleBulkTimePickerOpen = (mode: 'open' | 'close', currentValue: string) => {
    setBulkTimePickerMode(mode);
    setTimePickerValue(currentValue || '08:00');
    setBulkTimePickerOpen(true);
  };

  const handleBulkTimePickerConfirm = (value: string) => {
    if (bulkTimePickerMode === 'open') {
      setBulkOpen(value);
      // Passer automatiquement à la sélection de l'heure de fermeture
      setBulkTimePickerMode('close');
      setTimePickerValue(bulkClose || '18:00');
      // Le picker reste ouvert
    } else {
      setBulkClose(value);
      // Fermer le picker après validation de l'heure de fin
      setBulkTimePickerOpen(false);
    }
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="flex items-center gap-1 sm:gap-2">
      {[1, 2, 3].map((step, idx) => (
        <React.Fragment key={step}>
          <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentStep === step 
              ? 'bg-[#1F4597] text-white' 
              : currentStep > step 
                ? 'bg-[#5087FF]/10 text-[#1F4597]' 
                : 'bg-slate-100 text-slate-400'
          }`}>
            {currentStep > step ? (
              <CheckCircle2 size={14} />
            ) : (
              <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px] sm:text-xs">
                {step}
              </span>
            )}
            <span className="hidden sm:inline">
              {step === 1 && 'Ligne principale'}
              {step === 2 && 'Configuration'}
              {step === 3 && 'Horaires'}
            </span>
            <span className="sm:hidden">
              {step === 1 && 'Étape 1'}
              {step === 2 && 'Étape 2'}
              {step === 3 && 'Étape 3'}
            </span>
          </div>
          {idx < 2 && (
            <div className={`w-4 sm:w-8 h-px transition-colors ${currentStep > step ? 'bg-[#5087FF]/30' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden" 
      data-config-modal
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Backdrop - capture all scroll events */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm overscroll-none" 
        onClick={() => setShowConfig(false)}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl mx-2 md:mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#5087FF]/10 flex items-center justify-center">
              <Settings size={18} className="md:w-5 md:h-5 text-[#1F4597]" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-900">Configuration</h2>
              <p className="text-xs md:text-sm text-slate-500">
                {currentStep === 1 && "Sélectionnez votre numéro principal"}
                {currentStep === 2 && "Configurez vos lignes téléphoniques"}
                {currentStep === 3 && "Définissez vos horaires d'ouverture"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowConfig(false)} 
            className="p-1.5 md:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="md:w-5 md:h-5 text-slate-400" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 md:px-6 py-2 md:py-3 bg-slate-50 border-b border-slate-200">
          <ProgressBar />
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6"
          style={{ overscrollBehavior: 'contain' }}
          data-modal-content
        >
          {/* ÉTAPE 1: NDI Principal */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-[#1F4597]/5 rounded-xl p-4 border border-[#1F4597]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={18} className="text-[#1F4597]" />
                  <h3 className="font-semibold text-slate-900">Ligne principale du cabinet</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Sélectionnez le numéro principal (NDI) qui recevra les appels entrants. Ce sera la ligne de référence pour vos statistiques.
                </p>

                {/* NDI Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Numéro principal <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => setShowNdiDropdown(!showNdiDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#1F4597]/30 rounded-lg hover:border-[#1F4597] transition-colors text-left"
                  >
                    <span className={mainNdi ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                      {mainNdi ? (
                        linesConfig[mainNdi]?.name ? (
                          <span className="flex items-center gap-2">
                            <span className="text-[#1F4597]">{linesConfig[mainNdi].name}</span>
                            <span className="text-slate-500 font-normal">({mainNdi})</span>
                          </span>
                        ) : (
                          mainNdi
                        )
                      ) : (
                        'Sélectionner un numéro...'
                      )}
                    </span>
                    <ChevronDown size={18} className="text-[#1F4597]" />
                  </button>
                  
                  {showNdiDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#1F4597]/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {allLines.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 text-center">
                          Aucune ligne détectée
                        </div>
                      ) : (
                        <>
                          {potentialNdis.length > 0 && (
                            <div className="px-3 py-2 text-xs font-semibold text-[#1F4597] uppercase bg-[#1F4597]/10">
                              Numéros suggérés (NDI)
                            </div>
                          )}
                          {potentialNdis.map(line => {
                            const lineName = linesConfig[line]?.name;
                            return (
                              <button
                                key={line}
                                onClick={() => {
                                  setMainNdi(line);
                                  setShowNdiDropdown(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#1F4597]/5 transition-colors ${mainNdi === line ? 'bg-[#1F4597]/10' : ''}`}
                              >
                                <span className="flex items-center gap-2 text-sm">
                                  {lineName && <span className="font-medium text-[#1F4597]">{lineName}</span>}
                                  <span>{line}</span>
                                </span>
                                {mainNdi === line && <CheckCircle2 size={16} className="text-[#1F4597]" />}
                              </button>
                            );
                          })}
                          {allLines.filter(l => !potentialNdis.includes(l)).length > 0 && (
                            <>
                              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase bg-slate-50 border-t">
                                Autres lignes
                              </div>
                              {allLines.filter(l => !potentialNdis.includes(l)).map(line => {
                                const lineName = linesConfig[line]?.name;
                                return (
                                  <button
                                    key={line}
                                    onClick={() => {
                                      setMainNdi(line);
                                      setShowNdiDropdown(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#1F4597]/5 transition-colors ${mainNdi === line ? 'bg-[#1F4597]/10' : ''}`}
                                  >
                                    <span className="flex items-center gap-2 text-sm">
                                      {lineName && <span className="font-medium text-[#1F4597]">{lineName}</span>}
                                      <span>{line}</span>
                                    </span>
                                    {mainNdi === line && <CheckCircle2 size={16} className="text-[#1F4597]" />}
                                  </button>
                                );
                              })}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {mainNdi && (
                  <div className="mt-4 p-3 bg-[#1F4597]/10 border border-[#1F4597]/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#1F4597]" />
                      <span className="text-sm text-[#1F4597]">
                        <strong>{mainNdi}</strong> sera défini comme ligne principale
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!isStep1Valid}
                  className="px-6 py-2.5 bg-[#1F4597] text-white font-medium rounded-lg hover:bg-[#1F4597]/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2: Configuration des lignes */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-[#1F4597]/5 rounded-xl p-4 border border-[#1F4597]/20">
                <div className="flex items-center gap-2 mb-3">
                  <PhoneCall size={18} className="text-[#1F4597]" />
                  <h3 className="font-semibold text-slate-900">Configuration des lignes</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Définissez le type de chaque ligne. Les postes internes (SIP) peuvent décrocher les appels. Les lignes externes (NDI) sont des numéros publics.
                </p>

                {/* Ligne principale - violet foncé avec texte blanc */}
                <div className="mb-4 p-3 bg-[#1F4597] border border-[#1F4597] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white/80 uppercase font-medium">Ligne principale</p>
                      <p className="font-medium text-white">{mainNdi}</p>
                    </div>
                    <span className="ml-auto px-2 py-1 bg-white/20 text-white text-xs font-medium rounded">
                      NDI
                    </span>
                  </div>
                </div>

                {/* Autres lignes - fond violet très clair */}
                {otherLines.length > 0 ? (
                  <div className="space-y-2">
                    {otherLines.map((line) => (
                      <div key={line} className="p-3 bg-white border border-[#1F4597]/20 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#1F4597]/10 flex items-center justify-center shrink-0">
                              <Phone size={14} className="text-[#1F4597]" />
                            </div>
                            <span className="text-sm text-slate-700">{line}</span>
                          </div>
                          
                          <div className="flex-1 flex flex-col sm:flex-row gap-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleLineTypeChange(line, 'SIP')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                  linesConfig[line]?.type === 'SIP'
                                    ? 'bg-[#1F4597] text-white'
                                    : 'bg-[#1F4597]/10 text-[#1F4597] hover:bg-[#1F4597]/20'
                                }`}
                              >
                                Poste SIP
                              </button>
                              <button
                                onClick={() => handleLineTypeChange(line, 'NDI')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                  linesConfig[line]?.type === 'NDI'
                                    ? 'bg-[#1F4597] text-white'
                                    : 'bg-[#1F4597]/10 text-[#1F4597] hover:bg-[#1F4597]/20'
                                }`}
                              >
                                Ligne NDI
                              </button>
                            </div>
                            <input
                              type="text"
                              value={linesConfig[line]?.name || ''}
                              onChange={(e) => handleLineNameChange(line, e.target.value)}
                              placeholder="Nom (ex: Dr. Dupont, Accueil...)"
                              className="flex-1 px-3 py-1.5 text-sm bg-[#1F4597]/5 border border-[#1F4597]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4597]/30 focus:border-[#1F4597]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 bg-white border border-[#1F4597]/20 rounded-lg">
                    <p className="text-sm">Aucune autre ligne à configurer</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-[#1F4597] font-medium hover:bg-[#1F4597]/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isStep2Valid}
                  className="px-6 py-2.5 bg-[#1F4597] text-white font-medium rounded-lg hover:bg-[#1F4597]/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3: Horaires - Interface améliorée */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Header section */}
              <div className="bg-[#1F4597]/5 rounded-xl p-4 border border-[#1F4597]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-[#1F4597]" />
                  <h3 className="font-semibold text-slate-900">Horaires d'ouverture</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Définissez vos horaires pour identifier les appels hors ouverture. Les jours non configurés sont considérés comme fermés.
                </p>
              </div>

              {/* Option "Pas d'horaires" */}
              <label className="flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl cursor-pointer hover:border-[#1F4597]/40 transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${skipSchedule ? 'bg-[#1F4597]' : 'bg-slate-100'}`}>
                  <Clock size={20} className={skipSchedule ? 'text-white' : 'text-slate-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-900 block">Je n'ai pas d'horaires spécifiques</span>
                  <span className="text-xs text-slate-500">Tous les appels seront analysés sans distinction</span>
                </div>
                <div className="shrink-0 relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    checked={skipSchedule}
                    onChange={(e) => setSkipSchedule(e.target.checked)}
                    className="appearance-none w-5 h-5 rounded border-2 border-slate-300 checked:bg-[#1F4597] checked:border-[#1F4597] cursor-pointer transition-colors"
                  />
                  {skipSchedule && (
                    <Check size={12} className="absolute text-white pointer-events-none" />
                  )}
                </div>
              </label>

              {!skipSchedule && (
                <>
                  {/* Section: Configuration rapide */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#1F4597]" />
                      <span className="text-sm font-medium text-slate-700">Configuration rapide</span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-slate-500 mb-3">Sélectionnez les jours et définissez l'horaire à appliquer en masse</p>
                      
                      {/* Day selector - styled as toggle buttons */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {[
                          { key: 'monday', label: 'Lun', short: 'L' },
                          { key: 'tuesday', label: 'Mar', short: 'M' },
                          { key: 'wednesday', label: 'Mer', short: 'M' },
                          { key: 'thursday', label: 'Jeu', short: 'J' },
                          { key: 'friday', label: 'Ven', short: 'V' },
                          { key: 'saturday', label: 'Sam', short: 'S' },
                          { key: 'sunday', label: 'Dim', short: 'D' }
                        ].map((day) => {
                          const isSelected = selectedDaysForBulk.has(day.key);
                          return (
                            <button
                              key={day.key}
                              onClick={() => toggleDayForBulk(day.key as keyof WeekSchedule)}
                              className={`min-w-[40px] h-10 px-2 rounded-lg text-xs font-medium transition-all ${
                                isSelected
                                  ? 'bg-[#1F4597] text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                              title={day.label}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Time range selector */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs text-slate-500 font-medium">De</span>
                          <button
                            onClick={() => handleBulkTimePickerOpen('open', bulkOpen)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1F4597]/5 border border-[#1F4597]/20 rounded-lg hover:border-[#1F4597] hover:bg-[#1F4597]/10 transition-all"
                          >
                            <Clock size={14} className="text-[#1F4597]" />
                            <span className="text-sm font-semibold text-[#1F4597]">{bulkOpen}</span>
                          </button>
                        </div>
                        
                        <div className="w-6 h-px bg-slate-300" />
                        
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs text-slate-500 font-medium">À</span>
                          <button
                            onClick={() => handleBulkTimePickerOpen('close', bulkClose)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1F4597]/5 border border-[#1F4597]/20 rounded-lg hover:border-[#1F4597] hover:bg-[#1F4597]/10 transition-all"
                          >
                            <Clock size={14} className="text-[#1F4597]" />
                            <span className="text-sm font-semibold text-[#1F4597]">{bulkClose}</span>
                          </button>
                        </div>
                        
                        <button
                          onClick={applyBulkSchedule}
                          disabled={selectedDaysForBulk.size === 0}
                          className="px-4 py-2 text-sm font-medium bg-[#1F4597] text-white rounded-lg hover:bg-[#152d6e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          Appliquer ({selectedDaysForBulk.size})
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section: Horaires par jour */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#1F4597]" />
                        <span className="text-sm font-medium text-slate-700">Horaires par jour</span>
                      </div>
                      <span className="text-xs text-slate-400">Activez un jour pour configurer ses créneaux</span>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {([
                        { key: 'monday', label: 'Lundi', emoji: '📅' },
                        { key: 'tuesday', label: 'Mardi', emoji: '📅' },
                        { key: 'wednesday', label: 'Mercredi', emoji: '📅' },
                        { key: 'thursday', label: 'Jeudi', emoji: '📅' },
                        { key: 'friday', label: 'Vendredi', emoji: '🎉' },
                        { key: 'saturday', label: 'Samedi', emoji: '☕' },
                        { key: 'sunday', label: 'Dimanche', emoji: '☀️' }
                      ] as const).map((day) => {
                        const dayKey = day.key as keyof WeekSchedule;
                        const isOpen = schedule[dayKey].isOpen;
                        const ranges = schedule[dayKey].ranges;
                        
                        return (
                          <div key={day.key} className={`transition-colors ${isOpen ? 'bg-white' : 'bg-slate-50/50'}`}>
                            {/* Day header */}
                            <div className="px-4 py-3 flex items-center gap-3">
                              <button
                                onClick={() => toggleDay(dayKey)}
                                className={`w-12 h-7 rounded-full transition-all relative ${
                                  isOpen ? 'bg-[#1F4597]' : 'bg-slate-300'
                                }`}
                              >
                                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${
                                  isOpen ? 'left-[calc(100%-26px)]' : 'left-0.5'
                                }`} />
                              </button>
                              
                              <span 
                                onClick={() => toggleDay(dayKey)}
                                className={`font-medium text-sm cursor-pointer select-none ${
                                  isOpen ? 'text-slate-900' : 'text-slate-500'
                                }`}
                              >
                                {day.label}
                              </span>
                              
                              {isOpen && ranges.length > 0 && (
                                <span className="ml-auto text-xs font-medium text-[#1F4597] bg-[#1F4597]/10 px-2 py-1 rounded-full">
                                  {ranges.map(r => `${r.start}-${r.end}`).join(', ')}
                                </span>
                              )}
                              
                              {!isOpen && (
                                <span className="ml-auto text-xs text-slate-400 font-medium px-2 py-1">
                                  Fermé
                                </span>
                              )}
                            </div>
                            
                            {/* Time ranges for open days */}
                            {isOpen && (
                              <div className="px-4 pb-4">
                                <div className="ml-[52px] space-y-2">
                                  {ranges.map((range, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-[#1F4597]/5 rounded-lg">
                                      <div className="flex items-center gap-2 flex-1">
                                        <button
                                          onClick={() => handleTimePickerOpen(dayKey, idx, 'start', range.start)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1F4597]/20 rounded-md hover:border-[#1F4597] hover:shadow-sm transition-all"
                                        >
                                          <Clock size={12} className="text-[#1F4597]" />
                                          <span className="text-sm font-medium text-slate-700">{range.start}</span>
                                        </button>
                                        
                                        <span className="text-slate-400">→</span>
                                        
                                        <button
                                          onClick={() => handleTimePickerOpen(dayKey, idx, 'end', range.end)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1F4597]/20 rounded-md hover:border-[#1F4597] hover:shadow-sm transition-all"
                                        >
                                          <Clock size={12} className="text-[#1F4597]" />
                                          <span className="text-sm font-medium text-slate-700">{range.end}</span>
                                        </button>
                                      </div>
                                      
                                      {ranges.length > 1 && (
                                        <button
                                          onClick={() => removeRange(dayKey, idx)}
                                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Supprimer ce créneau"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  
                                  <button
                                    onClick={() => addRange(dayKey)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-[#1F4597] hover:text-[#152d6e] py-2 px-2 rounded-lg hover:bg-[#1F4597]/5 transition-colors"
                                  >
                                    <Plus size={16} />
                                    Ajouter un créneau
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Footer actions */}
              <div className="flex justify-between pt-2">
                <button
                  onClick={prevStep}
                  className="px-4 py-2.5 text-[#1F4597] font-medium hover:bg-[#1F4597]/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !isStep3Valid}
                  className="px-6 py-2.5 bg-[#1F4597] text-white font-medium rounded-lg hover:bg-[#152d6e] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Finaliser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Time Picker Modals - Using improved ScheduleTimePicker */}
      <ScheduleTimePicker
        isOpen={timePickerOpen}
        value={timePickerValue}
        onChange={handleTimePickerConfirm}
        onClose={() => setTimePickerOpen(false)}
        title={timePickerTarget?.field === 'start' ? "Heure d'ouverture" : "Heure de fermeture"}
      />
      <ScheduleTimePicker
        isOpen={bulkTimePickerOpen}
        value={timePickerValue}
        onChange={handleBulkTimePickerConfirm}
        onClose={() => setBulkTimePickerOpen(false)}
        title={bulkTimePickerMode === 'open' ? "Heure d'ouverture (global)" : "Heure de fermeture (global)"}
      />
    </div>
  );
};

export default ConfigModal;
