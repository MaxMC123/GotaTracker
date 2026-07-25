import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Battery, Wifi, Signal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { useAndroidFrame, setUseAndroidFrame, theme, setTheme } = useApp();
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col items-center justify-start py-0 md:py-6 px-0 md:px-4">
      {/* Top Floating Control Bar for Frame & Dark Mode Toggle */}
      <header className="w-full max-w-md md:max-w-4xl mb-3 px-4 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">GotaTracker Android M3</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Frame Mode Toggle */}
          <button
            onClick={() => setUseAndroidFrame(!useAndroidFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Cambiar vista de marco móvil / pantalla completa"
          >
            {useAndroidFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Vista Extendida</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Marco Android</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Alternar Modo Claro / Oscuro"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      {useAndroidFrame ? (
        /* Phone Frame Wrapper */
        <div className="relative w-full max-w-[420px] h-[100vh] md:h-[860px] bg-slate-900 rounded-none md:rounded-[44px] shadow-2xl p-1 md:p-3 border-0 md:border-[8px] border-slate-800 overflow-hidden flex flex-col transition-all duration-300">
          {/* Camera Notch / Camera Hole Punch */}
          <div className="hidden md:block absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 bg-slate-950 rounded-full border border-slate-800"></div>
          </div>

          {/* Phone Screen Container */}
          <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900 rounded-none md:rounded-[36px] overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className="w-full h-8 bg-transparent px-5 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 z-40 select-none pt-1">
              <span>{timeStr}</span>
              <div className="flex items-center gap-1.5 opacity-90">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-green-500" />
              </div>
            </div>

            {/* App Body Content */}
            <div className="flex-1 overflow-y-auto pb-16 relative scrollbar-none">
              {children}
            </div>

            {/* Android Home Indicator Bar */}
            <div className="w-full h-4 bg-transparent flex items-center justify-center z-40 pb-1">
              <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      ) : (
        /* Expanded Full Screen Container */
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[800px]">
          <div className="flex-1 overflow-y-auto pb-20 p-4 md:p-8">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
