import React, { useState } from 'react';
import { X, CupSoda, Milk, Wine, Flame, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContainerType } from '../../types';

export const QuickAddModal: React.FC = () => {
  const { isQuickAddOpen, setIsQuickAddOpen, addWaterLog } = useApp();

  const [mode, setMode] = useState<'presets' | 'custom'>('presets');
  const [customMl, setCustomMl] = useState<string>('330');
  const [customLabel, setCustomLabel] = useState<string>('Taza de agua');

  if (!isQuickAddOpen) return null;

  const presets: { amount: number; type: ContainerType; label: string; icon: string; desc: string }[] = [
    { amount: 250, type: 'glass_250', label: 'Vaso Pequeño', icon: '🥛', desc: '250 ml' },
    { amount: 500, type: 'bottle_500', label: 'Botella Estándar', icon: '🧴', desc: '500 ml' },
    { amount: 750, type: 'bottle_750', label: 'Termo Deportivo', icon: '🥤', desc: '750 ml' },
  ];

  const handleSelectPreset = (amount: number, type: ContainerType, label: string) => {
    addWaterLog(amount, type, label);
    setIsQuickAddOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customMl, 10);
    if (parsed > 0) {
      addWaterLog(parsed, 'custom', customLabel || 'Toma personalizada');
      setIsQuickAddOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Registrar Toma de Agua</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Selecciona una medida rápida o ingresa una personalizada</p>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl my-4 text-xs font-semibold">
          <button
            onClick={() => setMode('presets')}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              mode === 'presets'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Opciones Rápida
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              mode === 'custom'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Personalizado
          </button>
        </div>

        {/* Presets Mode */}
        {mode === 'presets' ? (
          <div className="space-y-3 my-4">
            {presets.map((item) => (
              <button
                key={item.amount}
                onClick={() => handleSelectPreset(item.amount, item.type, item.label)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xs group-hover:scale-110 transition">
                    {item.icon}
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{item.desc}</div>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-blue-500 text-white font-bold text-xs shadow-xs group-hover:bg-blue-600">
                  +{item.amount} ml
                </div>
              </button>
            ))}

            {/* Switch to Custom Option */}
            <button
              onClick={() => setMode('custom')}
              className="w-full p-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-500 dark:text-slate-400 hover:text-blue-600 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ingresar cantidad exacta personalizada...</span>
            </button>
          </div>
        ) : (
          /* Custom Mode Form */
          <form onSubmit={handleCustomSubmit} className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Cantidad en mililitros (ml)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="10"
                  max="3000"
                  step="10"
                  value={customMl}
                  onChange={(e) => setCustomMl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="330"
                  required
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">ml</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Etiqueta / Recipiente
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Taza de manzanilla, Jarra"
              />
            </div>

            {/* Quick Increment Chips */}
            <div className="flex gap-2">
              {[150, 330, 400, 600].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCustomMl(String(num))}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-lg transition"
                >
                  {num} ml
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Registrar {customMl || 0} ml</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
