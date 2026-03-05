import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ChartsData } from '../types';

interface ChartsSectionProps {
  charts: ChartsData;
  filterStatus: 'all' | 'Répondu' | 'Manqué' | 'Hors Ouverture';
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ charts, filterStatus }) => {
  const missedRadius: [number, number, number, number] = filterStatus === 'Manqué' ? [4, 4, 0, 0] : [0, 0, 0, 0];
  const outRadius: [number, number, number, number] = filterStatus === 'Hors Ouverture' ? [4, 4, 0, 0] : [0, 0, 0, 0];

  const formatDailyDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTooltipPercent = (value: number, name: string, props: any) => {
    const total = charts.distribution.reduce((acc, curr) => acc + curr.value, 0);
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
    return [`${value} (${percent}%)`, name];
  };

  const formatRateTooltip = (value: number) => [`${value}%`, 'Taux de réponse'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Graphique 1: Distribution horaire (existant) */}
      <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">Distribution horaire</h3>
        <div className="h-[250px] md:h-[320px] w-full pb-4" id="chart-hourly">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.hourly} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip 
                cursor={{fill: '#F3F4F6'}} 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
              />
              <Legend iconType="circle" verticalAlign="bottom" height={40} wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Manqué" name="Manqués" stackId="a" fill="#EF4444" radius={missedRadius} barSize={16} />
              <Bar dataKey="HorsOuverture" name="Hors Ouverture" stackId="a" fill="#94A3B8" radius={outRadius} barSize={16} />
              <Bar dataKey="Répondu" name="Répondus" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique 2: Volume quotidien (existant) */}
      <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">Volume quotidien</h3>
        <div className="h-[250px] md:h-[320px] w-full pb-4" id="chart-daily">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.daily} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={formatDailyDate} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip 
                labelFormatter={(label) => formatDailyDate(label as string)}
                cursor={{fill: '#F3F4F6'}} 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
              />
              <Legend iconType="circle" verticalAlign="bottom" height={40} wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Manqué" name="Manqués" stackId="a" fill="#EF4444" radius={missedRadius} barSize={24} />
              <Bar dataKey="HorsOuverture" name="Hors Ouverture" stackId="a" fill="#94A3B8" radius={outRadius} barSize={24} />
              <Bar dataKey="Répondu" name="Répondus" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique 3: Répartition globale (NOUVEAU - Donut) */}
      <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">Répartition globale</h3>
        <div className="h-[250px] md:h-[320px] w-full pb-4" id="chart-distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts.distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {charts.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={formatTooltipPercent}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={40} 
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique 4: Taux de réponse journalier (NOUVEAU - Line) */}
      <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">Taux de réponse journalier</h3>
        <div className="h-[250px] md:h-[320px] w-full pb-4" id="chart-daily-rate">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.dailyRate} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDailyDate} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 11 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip 
                labelFormatter={(label) => formatDailyDate(label as string)}
                formatter={formatRateTooltip}
                cursor={{ stroke: '#22C55E', strokeWidth: 1 }}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#22C55E" 
                strokeWidth={2}
                dot={{ fill: '#22C55E', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#22C55E', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
