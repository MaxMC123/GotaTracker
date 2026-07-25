import React from 'react';
import { Plus, Undo2, Sparkles, Droplets } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatMlOrL } from '../../services/calculator';

export const LiquidProgress: React.FC = () => {
  const {
    todayTotalMl,
    dailyGoalMl,
    todayProgressPercent,
    setIsQuickAddOpen,
    lastLog,
    undoLastLog,
  } = useApp();

  const remainingMl = Math.max(0, dailyGoalMl - todayTotalMl);

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-4 px-4 w-full">
      {/* Liquid Circle Container */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 my-2 flex items-center justify-center">
        {/* Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-cyan-300/30 blur-xl animate-pulse"></div>

        {/* Outer Circular Rim */}
        <div className="relative w-full h-full rounded-full border-4 border-blue-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-xl flex items-center justify-center overflow-hidden p-3">
          {/* Liquid Filling Animation Background */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300 transition-all duration-1000 ease-out opacity-85 dark:opacity-75"
            style={{ height: `${Math.min(100, todayProgressPercent)}%` }}
          >
            {/* Wave SVG Animation Top Border */}
            <div className="absolute -top-3 left-0 w-[200%] h-6 opacity-80 animate-[wave_4s_linear_infinite]">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-cyan-300">
                <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,-30 1200,40 L1200,120 L0,120 Z"></path>
              </svg>
            </div>
          </div>

          {/* Central Stats Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 rounded-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-md w-48 h-48 md:w-52 md:h-52 shadow-inner border border-white/40 dark:border-slate-700/50">
            <div className="flex items-baseline justify-center gap-0.5 text-blue-600 dark:text-cyan-400 font-black tracking-tight">
              <span className="text-4xl md:text-5xl">{todayProgressPercent}</span>
              <span className="text-xl md:text-2xl">%</span>
            </div>

            <div className="mt-1 text-slate-700 dark:text-slate-200 font-bold text-sm">
              {formatMlOrL(todayTotalMl)}
              <span className="text-slate-400 dark:text-slate-500 font-normal text-xs ml-1">
                / {formatMlOrL(dailyGoalMl)}
              </span>
            </div>

            <div className="mt-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-medium text-[11px] border border-blue-100 dark:border-slate-700">
              {remainingMl === 0 ? '🎉 ¡Meta Alcanzada!' : `Faltan ${formatMlOrL(remainingMl)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <div className="p-1 rounded-lg bg-white/20 group-hover:rotate-90 transition duration-300">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <span>Bebí Agua</span>
          <Droplets className="w-5 h-5 opacity-80 animate-bounce ml-1" />
        </button>

        {/* Undo button if a log was recently added */}
        {lastLog && (
          <button
            onClick={undoLastLog}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Deshacer última toma ({lastLog.amountMl} ml)</span>
          </button>
        )}
      </div>
    </div>
  );
};
