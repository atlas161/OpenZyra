import React from 'react';
import { Briefcase, Users, Phone, CheckCircle2, XCircle, Clock, Hash, CalendarDays, ArrowUpRight, ArrowDownRight, Sun, Moon, BellOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Stats, ChartsData, DateRange, ProjectConfig } from '../types';
import { formatDuration } from '../utils/formatters';

interface PDFTemplateProps {
  dateRange: DateRange;
  projectConfig: ProjectConfig | null;
  stats: Stats;
  charts: ChartsData;
  filterStatus: 'all' | 'Répondu' | 'Manqué' | 'Hors Ouverture';
  allRawRecordsCount: number;
  totalCallsFiltered: number;
}

export const PDFTemplate: React.FC<PDFTemplateProps> = ({ 
  dateRange,
  projectConfig,
  stats,
  charts,
  filterStatus,
  allRawRecordsCount,
  totalCallsFiltered
}) => {
  const formatDatePretty = (dateStr: string) => {
    if(!dateStr) return '...';
    const [y, m, d] = dateStr.split('-');
    return d + '/' + m + '/' + y;
  };

  const missedRadius: [number, number, number, number] = filterStatus === 'Manqué' ? [4, 4, 0, 0] : [0, 0, 0, 0];
  const outRadius: [number, number, number, number] = filterStatus === 'Hors Ouverture' ? [4, 4, 0, 0] : [0, 0, 0, 0];
  
  const configuredLinesCount = projectConfig ? Object.keys(projectConfig.lines).length : 0;

  return (
    <div id="print-root" className="w-[1200px] bg-white text-gray-800 p-12 mx-auto relative overflow-hidden" style={{ minHeight: '1697px' }}>
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-gray-200 pb-6 mb-8">
        <div>
          <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="h-12 w-auto mb-2" />
          <p className="text-lg text-gray-500 font-medium uppercase tracking-widest">Rapport d'Analyse Téléphonique</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-500 uppercase">Période d'Analyse</p>
          <div className="flex items-center gap-2 mt-1 text-xl font-bold text-slate-800">
            <CalendarDays className="text-violet-600" size={24} />
            <span>{formatDatePretty(dateRange.start)} <span className="text-gray-400 font-normal mx-1">-</span> {formatDatePretty(dateRange.end)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mb-8">
          {/* COLONNE GAUCHE: Métadonnées */}
          <div className="col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase size={18} /> Métadonnées
                </h3>

                <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Généré le</p>
                      <p className="text-sm font-semibold">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Filtre Appliqué (Statut)</p>
                      <p className="text-sm font-bold capitalize bg-white inline-block px-2 py-1 rounded border border-gray-200 shadow-sm">{filterStatus === 'all' ? 'Tous les appels' : filterStatus}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Total Lignes Brutes</p>
                      <p className="text-sm font-semibold">{allRawRecordsCount.toLocaleString()} lignes</p>
                    </div>
                </div>
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-violet-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users size={18} /> Configuration du Groupe
                </h3>

                {projectConfig && (
                  <div className="mb-4 bg-white p-3 rounded-lg border border-violet-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Numéro Principal (NDI)</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Phone size={14} className="text-violet-500" />
                        {projectConfig.mainNdi}
                      </div>
                  </div>
                )}

                <p className="text-xs font-medium text-violet-700 mb-2">Autres Lignes Actives ({configuredLinesCount - 1 > 0 ? configuredLinesCount - 1 : 0})</p>
                <div className="flex flex-wrap gap-2">
                  {projectConfig && Object.values(projectConfig.lines).filter((l: any) => l.number !== projectConfig.mainNdi).map((line: any) => (
                    <div key={line.number} className="bg-white border border-violet-200 px-2 py-1 rounded text-xs text-violet-900 shadow-sm flex items-center gap-1.5">
                      <Hash size={12} className="text-violet-400" />
                      {line.name ? line.name + ' (' + line.number + ')' : line.number}
                    </div>
                  ))}
                </div>
                {configuredLinesCount <= 1 && (
                   <p className="text-xs text-violet-600/70 italic mt-2">Aucune ligne interne configurée.</p>
                )}
            </div>

            {/* Top 5 Agents (PDF) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users size={18} className="text-violet-600" /> Top 5 des agents
                </h3>
                <div className="space-y-3">
                    {stats.topAgents && stats.topAgents.length > 0 ? (
                        stats.topAgents.map((agent, index) => {
                            const bgColor = index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-500';
                            return (
                                <div key={index} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold " + bgColor}>
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-gray-800 truncate max-w-[150px]">{agent.name}</span>
                                    </div>
                                    <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded text-xs">{agent.count}</span>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-xs text-gray-400 italic">Aucun appel répondu</p>
                    )}
                </div>
            </div>
          </div>

          {/* COLONNE DROITE: Statistiques */}
          <div className="col-span-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="bg-violet-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Statistiques Clés
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Box Total */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Appels Uniques</p>
                  <div className="p-2 bg-slate-100 rounded-lg"><Phone size={20} className="text-slate-600"/></div>
                </div>
                <p className="text-5xl font-black text-slate-800 mb-1">{totalCallsFiltered}</p>
                <div className="flex justify-between items-center mt-1">
                   <p className="text-xs text-slate-500">Moyenne: {formatDuration(stats.avgCallDuration)} / appel</p>
                   <p className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{Math.round(stats.avgCallsPerDay)} / jour</p>
                </div>
              </div>

              {/* Box Attente */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Attente Moyenne</p>
                  <div className="p-2 bg-slate-100 rounded-lg"><Clock size={20} className="text-slate-600"/></div>
                </div>
                <p className="text-5xl font-black text-slate-800 mb-1">{formatDuration(stats.avgAnsweredWaitTime)}</p>
                <p className="text-xs text-slate-500">Temps réel (Global NDI - Conversation SIP)</p>
              </div>

              {/* Box Répondus */}
              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Appels Répondus</p>
                  <div className="p-2 bg-emerald-100 rounded-lg"><CheckCircle2 size={20} className="text-emerald-700"/></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-emerald-800">{stats.answeredCount}</p>
                  <p className="text-xl font-bold text-emerald-600">({stats.answeredRate.toFixed(1)}%)</p>
                </div>
              </div>

               {/* Box Manqués */}
               <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-rose-700 uppercase tracking-wider">Appels Manqués</p>
                  <div className="p-2 bg-rose-100 rounded-lg"><XCircle size={20} className="text-rose-700"/></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-rose-800">{stats.missedCount}</p>
                  <p className="text-xl font-bold text-rose-600">({stats.missedRate.toFixed(1)}%)</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 mt-12 flex items-center gap-3">
              <span className="bg-violet-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Répartition Horaire
            </h2>

            <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.hourly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="hour" 
                        axisLine={false}
                        tickLine={false}
                        tick={{fill: '#64748B', fontSize: 12}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{fill: '#64748B', fontSize: 12}}
                      />
                      <Legend 
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                      {(filterStatus === 'all' || filterStatus === 'Répondu') && 
                        <Bar dataKey="Répondu" name="Répondu" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} barSize={30} />
                      }
                      {(filterStatus === 'all' || filterStatus === 'Hors Ouverture') && 
                        <Bar dataKey="HorsOuverture" name="Hors Ouverture" stackId="a" fill="#94A3B8" radius={outRadius} barSize={30} />
                      }
                      {(filterStatus === 'all' || filterStatus === 'Manqué') && 
                        <Bar dataKey="Manqué" name="Manqué" stackId="a" fill="#F43F5E" radius={missedRadius} barSize={30} />
                      }
                  </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* NOUVELLE SECTION : Top 10 + Stats Horaires */}
      <div className="mt-8 mb-20 grid grid-cols-3 gap-6">
          
          {/* Top 10 Appelants */}
          <div className="col-span-2 bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
              <div className="text-gray-800 text-xl font-bold mb-6 flex items-center gap-2">
                  <Users size={24} className="text-violet-500" />
                  Top 10 des numéros appelants
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  {stats.topCallers && stats.topCallers.length > 0 ? (
                      stats.topCallers.map((caller, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                              <div className="flex items-center gap-3">
                                  <div className="text-xs font-bold text-slate-400 w-4 text-right">{index + 1}.</div>
                                  <div className="text-sm font-semibold text-slate-700">{caller.number}</div>
                              </div>
                              <div className="flex flex-col items-end">
                                  <div className="font-black text-slate-800 leading-none mb-1">{caller.count}</div>
                                  <div className="flex items-center gap-2 text-[10px] font-bold">
                                      <span className="text-emerald-600 flex items-center gap-0.5" title="Répondus">
                                          {caller.answered}
                                          <ArrowUpRight size={10} />
                                      </span>
                                      <span className="text-red-500 flex items-center gap-0.5" title="Manqués">
                                          {caller.missed}
                                          <ArrowDownRight size={10} />
                                      </span>
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="col-span-full text-center py-8 text-slate-400 italic">
                          Aucune donnée disponible.
                      </div>
                  )}
              </div>
          </div>

          {/* Stats Horaires */}
          <div className="flex flex-col gap-4">
               <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Ouverture</div>
                      <div className="text-sm text-gray-600">Moyenne Appels / Jour</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{Math.round(stats.avgCallsInsideHours || 0)}</div>
                  </div>
                  <Sun className="text-amber-500 bg-amber-50 p-2 rounded-lg" size={40} />
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Hors Ouverture</div>
                      <div className="text-sm text-gray-600">Moyenne Appels / Jour</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{Math.round(stats.avgCallsOutsideHours || 0)}</div>
                  </div>
                  <Moon className="text-slate-500 bg-slate-100 p-2 rounded-lg" size={40} />
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center justify-between border-l-4 border-l-red-400">
                  <div>
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Hors Ouverture</div>
                      <div className="text-sm text-gray-600">Total Appels Manqués</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMissedOutsideHours || 0}</div>
                      <div className="text-xs text-red-400 mt-1">Sur la période filtrée</div>
                  </div>
                  <BellOff className="text-red-500 bg-red-50 p-2 rounded-lg" size={40} />
              </div>
          </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-12 left-12 right-12 text-center pt-6 border-t border-gray-200">
          <p className="text-sm font-bold text-slate-400">Généré par OpenZyra - Outil d'analyse des appels OpenZyra Télécom</p>
      </div>
    </div>
  );
};
