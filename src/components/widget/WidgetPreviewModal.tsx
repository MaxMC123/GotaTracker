import React from 'react';
import { X, Plus, Sparkles, LayoutGrid, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatMlOrL } from '../../services/calculator';
import { AppIcon } from '../common/AppIcon';

export const WidgetPreviewModal: React.FC = () => {
  const { isWidgetModalOpen, setIsWidgetModalOpen, todayTotalMl, dailyGoalMl, todayProgressPercent, addWaterLog } = useApp();

  if (!isWidgetModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Widget Pantalla de Inicio</h3>
          </div>
          <button
            onClick={() => setIsWidgetModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Vista previa del Widget Android Material Design 3 listo para Jetpack Glance:
        </p>

        {/* Android Home Screen Widget Mockup */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-3 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AppIcon size={16} />
              <span className="text-[11px] font-bold text-slate-300">GotaTracker Widget</span>
            </div>
            <span className="text-[10px] bg-blue-900/60 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
              {todayProgressPercent}% Meta
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-2xl font-black text-white">{formatMlOrL(todayTotalMl)}</div>
              <div className="text-[11px] text-slate-400">de {formatMlOrL(dailyGoalMl)} objetivo</div>
            </div>

            {/* Compact Progress Meter */}
            <div className="w-14 h-14 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-cyan-400 opacity-80"
                style={{ height: `${todayProgressPercent}%` }}
              ></div>
              <span className="relative z-10 text-xs font-black text-white">{todayProgressPercent}%</span>
            </div>
          </div>

          {/* Quick Add Buttons on Widget */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => addWaterLog(250, 'glass_250', 'Vaso 250ml')}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[3]" /> 250ml
            </button>
            <button
              onClick={() => addWaterLog(500, 'bottle_500', 'Botella 500ml')}
              className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[3]" /> 500ml
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsWidgetModalOpen(false)}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition"
        >
          Cerrar Vista Previa
        </button>
      </div>
    </div>
  );
};
