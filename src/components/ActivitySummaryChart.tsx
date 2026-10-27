/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Scroll,
  GraduationCap,
  Microscope,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  generateLast7DaysActivities,
  calculateActivityStats,
  DayActivity,
} from '../utils/activityMetrics';
import { TabType } from './Navbar';

interface ActivitySummaryChartProps {
  onNavigateTab?: (tab: TabType) => void;
}

export const ActivitySummaryChart: React.FC<ActivitySummaryChartProps> = ({
  onNavigateTab,
}) => {
  const [dataMode, setDataMode] = useState<'grouped' | 'stacked'>('grouped');
  const [activeFilter, setActiveFilter] = useState<'all' | 'sermoes' | 'ebd' | 'estudos'>('all');

  const activities: DayActivity[] = useMemo(() => {
    return generateLast7DaysActivities();
  }, []);

  const stats = useMemo(() => {
    return calculateActivityStats(activities);
  }, [activities]);

  // Custom Dark Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      return (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-3.5 shadow-2xl text-xs space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-amber-300 font-serif">{item?.fullDate || label}</span>
            <span className="text-[10px] text-slate-400 font-mono">Total: {item?.total} atividades</span>
          </div>

          <div className="space-y-1">
            {(activeFilter === 'all' || activeFilter === 'sermoes') && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Sermões Gerados:</span>
                </span>
                <strong className="font-mono text-amber-400">{item?.sermoes}</strong>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'ebd') && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Aulas de EBD:</span>
                </span>
                <strong className="font-mono text-indigo-400">{item?.ebd}</strong>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'estudos') && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Estudos & Raio-X:</span>
                </span>
                <strong className="font-mono text-emerald-400">{item?.estudos}</strong>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1.5 border border-amber-500/20">
            <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Frequência Ministerial</span>
          </div>

          <h3 className="text-xl font-bold font-serif text-slate-900">
            Resumo de Atividades dos Últimos 7 Dias
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe o volume de sermões homiléticos gerados, aulas para EBD estruturadas e análises de versículos nos originais.
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setDataMode('grouped')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                dataMode === 'grouped'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Barras Lado a Lado
            </button>
            <button
              onClick={() => setDataMode('stacked')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                dataMode === 'stacked'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Empilhado</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Sermons */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'sermoes' ? 'all' : 'sermoes')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'sermoes'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-slate-50 border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Sermões</span>
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <Scroll className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {stats.totalSermoes}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Esboços gerados</span>
        </div>

        {/* EBD */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'ebd' ? 'all' : 'ebd')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'ebd'
              ? 'bg-indigo-50 border-indigo-400 shadow-xs'
              : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Aulas EBD</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {stats.totalEbd}
          </div>
          <span className="text-[11px] text-indigo-700 font-medium">Planos de aula</span>
        </div>

        {/* Biblical Studies & X-Ray */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'estudos' ? 'all' : 'estudos')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'estudos'
              ? 'bg-emerald-50 border-emerald-400 shadow-xs'
              : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Estudos & Raio-X</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
              <Microscope className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {stats.totalEstudos}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Exegeses profundas</span>
        </div>

        {/* Average Frequency */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Média Diária</span>
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {stats.averagePerDay}
          </div>
          <span className="text-[11px] text-purple-700 font-medium">Estudos/dia (consistente)</span>
        </div>
      </div>

      {/* Main Recharts Bar Chart Container */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={activities}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="dayKey"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 12, fontWeight: 600 }}
              iconType="circle"
            />

            {(activeFilter === 'all' || activeFilter === 'sermoes') && (
              <Bar
                name="Sermões Homiléticos"
                dataKey="sermoes"
                fill="#f59e0b"
                stackId={dataMode === 'stacked' ? 'a' : undefined}
                radius={dataMode === 'stacked' ? [0, 0, 0, 0] : [6, 6, 0, 0]}
              />
            )}

            {(activeFilter === 'all' || activeFilter === 'ebd') && (
              <Bar
                name="Aulas de EBD"
                dataKey="ebd"
                fill="#6366f1"
                stackId={dataMode === 'stacked' ? 'a' : undefined}
                radius={dataMode === 'stacked' ? [0, 0, 0, 0] : [6, 6, 0, 0]}
              />
            )}

            {(activeFilter === 'all' || activeFilter === 'estudos') && (
              <Bar
                name="Estudos & Raio-X"
                dataKey="estudos"
                fill="#10b981"
                stackId={dataMode === 'stacked' ? 'a' : undefined}
                radius={dataMode === 'stacked' ? [6, 6, 0, 0] : [6, 6, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Action Navigation Buttons */}
      {onNavigateTab && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Dia com maior pico produtivo: <strong className="text-slate-900 font-bold">{stats.mostActiveDay}</strong> ({stats.totalGeneral} estudos realizados na semana).
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('sermons')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Scroll className="w-3.5 h-3.5 text-amber-600" />
              <span>Gerar Novo Sermão</span>
            </button>

            <button
              onClick={() => onNavigateTab('ebd')}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Montar Aula EBD</span>
            </button>

            <button
              onClick={() => onNavigateTab('xray')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Microscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fazer Raio-X</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
