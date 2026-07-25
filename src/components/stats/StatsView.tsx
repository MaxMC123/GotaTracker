import React, { useState, useMemo } from 'react';
import { Flame, Trash2, Calendar, Award, Droplets, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, AreaChart, Area } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatMlOrL } from '../../services/calculator';

export const StatsView: React.FC = () => {
  const { logs, dailyGoalMl, currentStreak, maxStreak, totalLitersAllTime, deleteWaterLog } = useApp();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  // Weekly data calculations
  const weeklyData = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const result: { day: string; dateStr: string; ml: number; target: number }[] = [];

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];

      const dayTotal = logs
        .filter((l) => l.timestamp.startsWith(dateStr))
        .reduce((sum, l) => sum + l.amountMl, 0);

      result.push({
        day: dayName,
        dateStr,
        ml: dayTotal,
        target: dailyGoalMl,
      });
    }

    return result;
  }, [logs, dailyGoalMl]);

  // Monthly data calculations (last 30 days aggregated into 5-day periods or daily)
  const monthlyData = useMemo(() => {
    const result: { dateStr: string; label: string; ml: number; target: number }[] = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayNum = date.getDate();

      const dayTotal = logs
        .filter((l) => l.timestamp.startsWith(dateStr))
        .reduce((sum, l) => sum + l.amountMl, 0);

      result.push({
        dateStr,
        label: `${dayNum}`,
        ml: dayTotal,
        target: dailyGoalMl,
      });
    }

    return result;
  }, [logs, dailyGoalMl]);

  // Daily logs sorted latest first
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = useMemo(() => {
    return logs
      .filter((l) => l.timestamp.startsWith(todayStr))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs, todayStr]);

  return (
    <div className="px-4 py-3 space-y-5 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Estadísticas y Rachas</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Seguimiento de tu rendimiento de hidratación</p>
        </div>

        {/* Total Liters Badge */}
        <div className="px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-blue-600 dark:text-cyan-400 font-bold text-xs flex items-center gap-1.5">
          <Droplets className="w-4 h-4 text-blue-500" />
          <span>{totalLitersAllTime} Litros Total</span>
        </div>
      </div>

      {/* Streak Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-90">Racha Actual</span>
            <Flame className="w-5 h-5 fill-white/80 animate-bounce" />
          </div>
          <div className="text-3xl font-black mt-2">{currentStreak} <span className="text-sm font-normal">días</span></div>
          <p className="text-[10px] opacity-80 mt-1">Días seguidos cumpliendo tu meta</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Mejor Racha</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black mt-2 text-slate-800 dark:text-slate-100">{maxStreak} <span className="text-sm font-normal text-slate-400">días</span></div>
          <p className="text-[10px] text-slate-400 mt-1">Récord máximo alcanzado</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Consumo de Agua</h3>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Mensual
            </button>
          </div>
        </div>

        {/* Recharts Render */}
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            {timeframe === 'weekly' ? (
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} ml`, 'Consumo']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <ReferenceLine y={dailyGoalMl} stroke="#00bcd4" strokeDasharray="3 3" label={{ value: 'Meta', fill: '#00bcd4', fontSize: 10 }} />
                <Bar dataKey="ml" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} ml`, 'Consumo']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="ml" stroke="#00bcd4" fill="#0284c7" fillOpacity={0.3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Log History */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Registros de Hoy</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">{todayLogs.length} tomas</span>
        </div>

        {todayLogs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Aún no has registrado tomas de agua hoy.</p>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((log) => {
              const timeFormatted = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 font-bold text-sm">
                      💧
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.containerLabel}</div>
                      <div className="text-[10px] text-slate-400">{timeFormatted}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400">+{log.amountMl} ml</span>
                    <button
                      onClick={() => deleteWaterLog(log.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
