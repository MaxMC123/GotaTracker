import React, { useState } from 'react';
import { Award, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AchievementsView: React.FC = () => {
  const { achievements } = useApp();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="px-4 py-3 space-y-4 animate-fadeIn">
      {/* Title & Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Insignias & Logros</span>
            <h2 className="text-xl font-bold mt-0.5">Colección de Medallas</h2>
            <p className="text-xs opacity-90 mt-1">Has desbloqueado {unlockedCount} de {achievements.length} logros</p>
          </div>
          <Award className="w-10 h-10 text-cyan-200 animate-pulse" />
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-cyan-300 h-full rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
            filter === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          Todos ({achievements.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
            filter === 'unlocked'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          Desbloqueados ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
            filter === 'locked'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          Bloqueados ({achievements.length - unlockedCount})
        </button>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {filteredAchievements.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition duration-200 flex items-center gap-4 ${
                ach.unlocked
                  ? 'bg-white dark:bg-slate-800/80 border-blue-200 dark:border-blue-900 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 opacity-75'
              }`}
            >
              {/* Badge Icon */}
              <div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                  ach.unlocked
                    ? 'bg-gradient-to-tr from-blue-500 to-cyan-400 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                }`}
              >
                {ach.icon}
                {!ach.unlocked && (
                  <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center">
                    <Lock className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Title & Desc */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${ach.unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {ach.title}
                  </h3>
                  {ach.unlocked && (
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Desbloqueado
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ach.description}</p>

                {/* Progress bar if locked */}
                {!ach.unlocked && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] font-medium text-slate-400 mb-1">
                      <span>Progreso</span>
                      <span>{ach.currentValue} / {ach.targetValue}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
