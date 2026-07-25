import React from 'react';
import { Sparkles, AlertTriangle, Lightbulb, Thermometer, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SmartInsight } from '../../types';

export const SmartInsightCard: React.FC = () => {
  const { insights, user, updateProfile, setIsQuickAddOpen } = useApp();

  if (!insights || insights.length === 0) return null;

  // Show top insight first
  const topInsight: SmartInsight = insights[0];

  const handleApplyAdjustment = () => {
    if (topInsight.actionable?.suggestedGoalMl && user) {
      updateProfile({
        customGoalMl: topInsight.actionable.suggestedGoalMl,
      });
    } else if (topInsight.actionable?.type === 'drink_now') {
      setIsQuickAddOpen(true);
    }
  };

  const getCardStyle = (type: SmartInsight['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200';
      case 'climate_warning':
        return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/60 text-orange-900 dark:text-orange-200';
      case 'habit_detected':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200';
    }
  };

  const getIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500 animate-bounce shrink-0" />;
      case 'climate_warning':
        return <Thermometer className="w-5 h-5 text-orange-500 shrink-0" />;
      case 'habit_detected':
        return <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />;
      default:
        return <Lightbulb className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="w-full px-4 my-2">
      <div className={`p-4 rounded-2xl border shadow-xs transition-all duration-300 ${getCardStyle(topInsight.type)}`}>
        <div className="flex items-start gap-3">
          {getIcon(topInsight.type)}

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wide opacity-80 flex items-center gap-1">
                <span>IA Local GotaTracker</span>
              </h4>
            </div>

            <h3 className="font-bold text-sm mt-0.5">{topInsight.title}</h3>
            <p className="text-xs mt-1 leading-relaxed opacity-90">{topInsight.description}</p>

            {/* Action Button if actionable */}
            {topInsight.actionable && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleApplyAdjustment}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-xs border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {topInsight.actionable.type === 'adjust_goal' ? (
                    <>
                      <span>Aplicar meta ({topInsight.actionable.suggestedGoalMl} ml)</span>
                      <Check className="w-3.5 h-3.5 text-green-500 stroke-[3]" />
                    </>
                  ) : (
                    <>
                      <span>Registrar agua ahora</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
