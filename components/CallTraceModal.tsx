import React, { useEffect } from 'react';
import { X, Phone, ArrowRight, User, Clock, Calendar, Smartphone, Hash, CheckCircle2, PhoneMissed, Timer } from 'lucide-react';
import { SessionRecord, ProjectConfig } from '../types';
import { formatDateTime, formatDuration } from '../utils/formatters';

interface CallTraceModalProps {
  call: SessionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  projectConfig: ProjectConfig | null;
}

export const CallTraceModal: React.FC<CallTraceModalProps> = ({ call, isOpen, onClose, projectConfig }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !call) return null;

  // Get line type from config
  const getLineType = (number: string): 'NDI' | 'SIP' | 'FAX' | 'UNKNOWN' => {
    if (!projectConfig?.lines) return 'UNKNOWN';
    const line = projectConfig.lines[number];
    return line?.type || 'UNKNOWN';
  };

  const getLineName = (number: string): string => {
    if (!projectConfig?.lines) return number;
    const line = projectConfig.lines[number];
    return line?.name || number;
  };

  // Build call path steps
  const buildCallPath = () => {
    const steps: Array<{
      type: 'caller' | 'ringing' | 'answered' | 'missed' | 'transferred' | 'outside-hours';
      label: string;
      sublabel?: string;
      duration?: number;
      icon: React.ReactNode;
      color: string;
    }> = [];

    // Step 1: Caller initiates call
    steps.push({
      type: 'caller',
      label: call.callingNumber,
      sublabel: 'Appelant',
      icon: <User size={18} />,
      color: 'bg-slate-600'
    });

    // Step 2: Call rings on lines
    if (call.status === 'Hors Ouverture') {
      steps.push({
        type: 'outside-hours',
        label: 'Hors ouverture',
        sublabel: 'Appel reçu en dehors des heures de bureau',
        duration: call.waitTime,
        icon: <Clock size={18} />,
        color: 'bg-slate-400'
      });
    } else {
      // Show ringing on NDI/involved lines
      call.involvedLines.forEach((line, index) => {
        const lineType = getLineType(line);
        const isNdi = lineType === 'NDI';
        
        steps.push({
          type: 'ringing',
          label: getLineName(line),
          sublabel: isNdi ? 'NDI - Sonnerie' : 'SIP - Sonnerie',
          duration: index === 0 ? call.waitTime : undefined,
          icon: isNdi ? <Phone size={18} /> : <Smartphone size={18} />,
          color: isNdi ? 'bg-blue-600' : 'bg-emerald-600'
        });
      });

      // Step 3: Call answered or missed
      if (call.status === 'Répondu' && call.answeredBy.length > 0) {
        call.answeredBy.forEach((agent, index) => {
          if (index === 0) {
            steps.push({
              type: 'answered',
              label: agent,
              sublabel: 'Appel décroché',
              duration: call.duration,
              icon: <CheckCircle2 size={18} />,
              color: 'bg-emerald-500'
            });
          } else {
            steps.push({
              type: 'transferred',
              label: agent,
              sublabel: 'Transfert',
              icon: <ArrowRight size={18} />,
              color: 'bg-blue-500'
            });
          }
        });
      } else if (call.status === 'Manqué') {
        steps.push({
          type: 'missed',
          label: 'Appel manqué',
          sublabel: `${call.involvedLines.length} ligne${call.involvedLines.length > 1 ? 's' : ''} sollicitée${call.involvedLines.length > 1 ? 's' : ''}`,
          duration: call.waitTime,
          icon: <PhoneMissed size={18} />,
          color: 'bg-red-500'
        });
      }
    }

    return steps;
  };

  const pathSteps = buildCallPath();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] md:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-gradient-to-r from-blue-600/5 to-transparent">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${
              call.status === 'Répondu' ? 'bg-emerald-100' : 
              call.status === 'Manqué' ? 'bg-red-100' : 'bg-slate-100'
            }`}>
              {call.status === 'Répondu' ? (
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
              ) : call.status === 'Manqué' ? (
                <PhoneMissed className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              ) : (
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
              )}
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">Parcours de l&apos;appel</h3>
              <p className="text-xs text-slate-500">ID: {call.id.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} className="md:w-5 md:h-5 text-slate-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Call Summary Card */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 mb-6 border border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="text-sm font-medium text-slate-700">{call.dateStr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <div>
                  <p className="text-xs text-slate-400">Heure</p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatDateTime(call.datetime).split(' ')[1]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-blue-600" />
                <div>
                  <p className="text-xs text-slate-400">Durée totale</p>
                  <p className="text-sm font-medium text-slate-700">{formatDuration(call.duration)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-blue-600" />
                <div>
                  <p className="text-xs text-slate-400">Statut</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    call.status === 'Répondu' ? 'bg-emerald-100 text-emerald-700' : 
                    call.status === 'Manqué' ? 'bg-red-100 text-red-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {call.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Call Path Timeline */}
          <div className="relative">
            <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <ArrowRight size={16} className="text-blue-600" />
              Chemin de l&apos;appel
            </h4>
            
            <div className="space-y-0">
              {pathSteps.map((step, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index < pathSteps.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-[calc(100%+16px)] bg-gradient-to-b from-slate-200 to-slate-300" />
                  )}
                  
                  {/* Icon bubble */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${step.color} shadow-lg`}>
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-blue-600/20 hover:bg-blue-600/5 transition-all duration-200">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800 text-sm">
                          {step.label}
                        </p>
                        {step.duration !== undefined && step.duration > 0 && (
                          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
                            {formatDuration(step.duration)}
                          </span>
                        )}
                      </div>
                      {step.sublabel && (
                        <p className="text-xs text-slate-500 mt-1">{step.sublabel}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          {call.involvedLines.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Hash size={16} className="text-blue-600" />
                Lignes sollicitées ({call.involvedLines.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {call.involvedLines.map((line) => {
                  const lineType = getLineType(line);
                  const isAnswered = call.answeredBy.includes(getLineName(line)) || 
                                    call.answeredBy.some(a => a.includes(line));
                  
                  return (
                    <span
                      key={line}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        lineType === 'NDI' 
                          ? 'bg-blue-600/10 text-blue-600 border-blue-600/20' 
                          : lineType === 'SIP'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      } ${isAnswered ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}
                    >
                      {lineType === 'NDI' ? <Phone size={12} /> : <Smartphone size={12} />}
                      {getLineName(line)}
                      {isAnswered && <CheckCircle2 size={12} className="text-emerald-500" />}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {call.answeredBy.length > 0 && call.status === 'Répondu' && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {call.answeredBy.length > 1 ? 'Agents ayant décroché' : 'Agent ayant décroché'}
              </h4>
              <div className="space-y-2">
                {call.answeredBy.map((agent, idx) => (
                  <div 
                    key={agent} 
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      idx === 0 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      idx === 0 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}>
                      {idx === 0 ? <Phone size={14} /> : <ArrowRight size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 text-sm">{agent}</p>
                      <p className="text-xs text-slate-500">
                        {idx === 0 ? 'Premier décroché' : 'Transfert'}
                      </p>
                    </div>
                    {idx === 0 && call.duration > 0 && (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                        {formatDuration(call.duration)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
