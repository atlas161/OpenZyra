import React, { useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Phone, PhoneIncoming, PhoneMissed, Clock, Calendar, User, Hash } from 'lucide-react';
import { SessionRecord, SortKey, SortDirection } from '../types';
import { formatDateTime, formatDuration } from '../utils/formatters';

interface CallTableProps {
  filteredData: SessionRecord[];
  ITEMS_PER_PAGE: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  sortConfig: { key: SortKey; direction: SortDirection };
  handleSort: (key: SortKey) => void;
  onCallClick?: (call: SessionRecord) => void;
}

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'Répondu') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <Phone size={12} />
        Répondu
      </span>
    );
  }
  if (status === 'Hors Ouverture') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <Clock size={12} />
        Hors Ouverture
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
      <PhoneMissed size={12} />
      Manqué
    </span>
  );
};

export const CallTable: React.FC<CallTableProps> = ({
  filteredData,
  ITEMS_PER_PAGE,
  currentPage,
  setCurrentPage,
  sortConfig,
  handleSort,
  onCallClick
}) => {
  
  // Sort Data
  const sortedLocalData = useMemo(() => {
    const data = [...filteredData];
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (sortConfig.key === 'datetime') {
          return sortConfig.direction === 'asc' ? a.datetime.getTime() - b.datetime.getTime() : b.datetime.getTime() - a.datetime.getTime();
        } else if (sortConfig.key === 'duration') {
          return sortConfig.direction === 'asc' ? a.duration - b.duration : b.duration - a.duration;
        }
        return 0;
      });
    }
    return data;
  }, [filteredData, sortConfig]);

  // Paginate Data
  const localTotalPages = Math.ceil(sortedLocalData.length / ITEMS_PER_PAGE);
  const localPaginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedLocalData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedLocalData, currentPage, ITEMS_PER_PAGE]);

  const renderPaginationControls = () => (
    <div className="flex items-center gap-1">
      <button 
        onClick={() => setCurrentPage(1)} 
        disabled={currentPage === 1} 
        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
        title="Première page"
      >
        <ChevronsLeft size={16} />
      </button>
      <button 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
        disabled={currentPage === 1} 
        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
        title="Page précédente"
      >
        <ChevronLeft size={16} />
      </button>
      
      <span className="text-sm font-medium text-slate-700 px-3 py-2 bg-slate-100 rounded-lg min-w-[100px] text-center">
        {currentPage} / {localTotalPages || 1}
      </span>

      <button 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, localTotalPages))} 
        disabled={currentPage === localTotalPages || localTotalPages === 0} 
        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
        title="Page suivante"
      >
        <ChevronRight size={16} />
      </button>
      <button 
        onClick={() => setCurrentPage(localTotalPages)} 
        disabled={currentPage === localTotalPages || localTotalPages === 0} 
        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
        title="Dernière page"
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
            <PhoneIncoming size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Journal d&apos;appels</h3>
            <p className="text-sm text-slate-500">{filteredData.length} appels au total</p>
          </div>
        </div>
        
        {localTotalPages > 1 && renderPaginationControls()}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th 
                className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('datetime')}
              >
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Date & Heure
                  {sortConfig.key === 'datetime' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Phone size={14} />
                  Appelant
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Hash size={14} />
                  Lignes sollicitées
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  Répondu par
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Clock size={14} />
                  Attente
                </div>
              </th>
              <th 
                className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center gap-1 justify-end">
                  <Clock size={14} />
                  Durée
                  {sortConfig.key === 'duration' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {localPaginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  Aucun appel trouvé
                </td>
              </tr>
            ) : (
              localPaginatedData.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => onCallClick?.(row)}
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        {row.dateStr}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(row.datetime).split(' ')[1]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                      {row.callingNumber}
                  </td>
                  <td className="px-4 py-3">
                    {row.involvedLines.length > 1 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                        {row.involvedLines.length} lignes
                      </span>
                    ) : (
                      <span className="text-sm text-slate-600">{row.involvedLines[0]}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.status === 'Répondu' ? (
                      <span className="text-sm font-medium text-emerald-700">
                        {row.answeredBy?.[0] || 'Inconnu'}
                        {row.answeredBy && row.answeredBy.length > 1 && (
                          <span className="text-xs text-slate-500 ml-1">+{row.answeredBy.length - 1}</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-slate-600">{formatDuration(row.waitTime)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-slate-700">{formatDuration(row.duration)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {localPaginatedData.length === 0 ? (
          <div className="px-4 py-12 text-center text-slate-400">
            Aucun appel trouvé
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {localPaginatedData.map((row) => (
              <div 
                key={row.id} 
                className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer active:bg-slate-100"
                onClick={() => onCallClick?.(row)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-slate-900">{row.dateStr}</span>
                    <span className="text-xs text-slate-500 ml-2">
                      {formatDateTime(row.datetime).split(' ')[1]}
                    </span>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={14} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{row.callingNumber}</span>
                </div>
                {row.involvedLines.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <Hash size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {row.involvedLines.length > 1 
                        ? `${row.involvedLines.length} lignes sollicitées` 
                        : row.involvedLines[0]}
                    </span>
                  </div>
                )}
                {row.status === 'Répondu' && row.answeredBy && row.answeredBy.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-emerald-500" />
                    <span className="text-sm text-emerald-700">
                      {row.answeredBy[0]}
                      {row.answeredBy.length > 1 && <span className="text-xs text-slate-500 ml-1">+{row.answeredBy.length - 1}</span>}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">
                      Attente: <span className="font-medium text-slate-700">{formatDuration(row.waitTime)}</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      Durée: <span className="font-medium text-slate-700">{formatDuration(row.duration)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            <span className="font-medium text-slate-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span>
            {' - '}
            <span className="font-medium text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span>
            {' sur '}
            <span className="font-medium text-slate-900">{filteredData.length}</span>
          </div>
          
          {localTotalPages > 1 && renderPaginationControls()}
        </div>
      )}
    </div>
  );
};

export default CallTable;
