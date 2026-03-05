import React from 'react';
import { Phone, CheckCircle2, PhoneMissed, Clock, Timer, Hourglass, Info, CalendarDays, Award, ArrowUpRight, ArrowDownRight, Users, Sun, Moon, BellOff } from 'lucide-react';
import { Stats } from '../types';
import { formatDuration } from '../utils/formatters';

export const StatsCards: React.FC<{ stats: Stats }> = ({ stats }) => {
  return (
    <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-gray-500 text-xs md:text-sm font-medium">Appels entrants</div>
                    <Phone className="text-[#1F4597] bg-[#5087FF]/10 p-1 md:p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
                <div className="text-xs text-gray-400 mt-1 hidden sm:block">Visiteurs uniques</div>
            </div>

            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-gray-500 text-xs md:text-sm font-medium">Répondus (groupe)</div>
                    <CheckCircle2 className="text-green-500 bg-green-50 p-1 md:p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.answeredCount}</div>
                <div className="text-xs text-gray-400 mt-1 hidden sm:block">Au moins 1 ligne a décroché</div>
            </div>

            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-gray-500 text-xs md:text-sm font-medium">Perdus (groupe)</div>
                    <PhoneMissed className="text-red-500 bg-red-50 p-1 md:p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.missedCount}</div>
                <div className="text-xs text-gray-400 mt-1 hidden sm:block">Personne n'a répondu</div>
            </div>

            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-gray-500 text-xs md:text-sm font-medium">Durée totale</div>
                    <Clock className="text-purple-500 bg-purple-50 p-1 md:p-1.5 rounded-lg" size={28} />
                </div>
                <div className="text-lg md:text-2xl font-bold text-gray-900">{formatDuration(stats.totalDuration)}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                <div>
                    <div className="text-gray-500 text-xs md:text-sm font-medium mb-1">Taux de réponse</div>
                    <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.answeredRate.toFixed(1)}%</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3 md:mt-4">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.answeredRate}%` }}></div>
                </div>
            </div>

            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                <div>
                    <div className="text-gray-500 text-xs md:text-sm font-medium mb-1">Taux d'appels perdus</div>
                    <div className="text-2xl md:text-3xl font-bold text-red-600">{stats.missedRate.toFixed(1)}%</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3 md:mt-4">
                    <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.missedRate}%` }}></div>
                </div>
            </div>
        </div>

        {/* NOUVELLE LIGNE : Moyennes et Top Agents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-500 text-xs md:text-sm font-medium">Durée moyenne</div>
                        <Timer className="text-[#1F4597] bg-[#5087FF]/10 p-1 md:p-1.5 rounded-lg" size={28} />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{formatDuration(stats.avgCallDuration)}</div>
                </div>
                <div className="text-xs text-gray-400 mt-2 hidden sm:block">Moyenne sur tous les appels</div>
            </div>

            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm flex flex-col justify-between relative group">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-500 text-xs md:text-sm font-medium flex items-center gap-2">
                            Attente moyen
                            <div className="relative hidden sm:block">
                                <Info size={14} className="text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    Calculé via la durée globale sur le NDI MOINS la durée de conversation sur les postes SIP.
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        </div>
                        <Hourglass className="text-orange-500 bg-orange-50 p-1 md:p-1.5 rounded-lg" size={28} />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{formatDuration(stats.avgAnsweredWaitTime)}</div>
                </div>
                <div className="text-xs text-gray-400 mt-2 hidden sm:block">Sur les appels répondus</div>
            </div>
            
            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-500 text-xs md:text-sm font-medium">Moyenne / jour</div>
                        <CalendarDays className="text-sky-500 bg-sky-50 p-1 md:p-1.5 rounded-lg" size={28} />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{Math.round(stats.avgCallsPerDay)}</div>
                </div>
                <div className="text-xs text-gray-400 mt-2 hidden sm:block">Moyenne globale du projet</div>
            </div>

            <div className="bg-white p-3 md:p-5 rounded-xl border shadow-sm row-span-2 lg:row-span-1 flex flex-col">
                <div className="text-gray-500 text-xs md:text-sm font-medium mb-3 flex items-center gap-2">
                    <Award size={16} className="text-blue-600" />
                    Top 5 agents
                </div>
                <div className="flex-1 space-y-2 md:space-y-3 flex flex-col justify-center">
                        {stats.topAgents && stats.topAgents.length > 0 ? (
                            stats.topAgents.slice(0, 5).map((agent, index) => (
                                <div key={index} className="flex items-center justify-between text-xs md:text-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-500'}`}>
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-gray-800 truncate max-w-[100px] md:max-w-none" title={agent.name}>{agent.name}</span>
                                    </div>
                                    <span className="font-bold text-[#1F4597] bg-[#5087FF]/10 px-2 py-0.5 rounded text-xs">{agent.count}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs md:text-sm text-gray-400 text-center italic py-4">Aucun appel répondu</div>
                        )}
                </div>
            </div>
        </div>

        {/* NOUVELLE SECTION : Top 10 + Stats Horaires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top 10 Appelants */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border shadow-sm">
                <div className="text-gray-800 text-lg font-bold mb-4 flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    Top 10 des numéros appelants les plus fréquents
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.topCallers && stats.topCallers.length > 0 ? (
                        stats.topCallers.map((caller, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
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
                 <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Ouverture</div>
                        <div className="text-sm text-gray-600">Moyenne Appels / Jour</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{Math.round(stats.avgCallsInsideHours || 0)}</div>
                    </div>
                    <Sun className="text-amber-500 bg-amber-50 p-2 rounded-lg" size={40} />
                </div>

                <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Hors Ouverture</div>
                        <div className="text-sm text-gray-600">Moyenne Appels / Jour</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{Math.round(stats.avgCallsOutsideHours || 0)}</div>
                    </div>
                    <Moon className="text-slate-500 bg-slate-100 p-2 rounded-lg" size={40} />
                </div>

                <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center justify-between border-l-4 border-l-red-400">
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
    </div>
  );
};
