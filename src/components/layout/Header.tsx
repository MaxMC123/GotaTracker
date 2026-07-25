import React from 'react';
import { Bell, Flame, User, LayoutGrid, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { user, currentStreak, setIsReminderModalOpen, setIsWidgetModalOpen, setIsAuthModalOpen } = useApp();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 19) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  return (
    <header className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
      {/* Greeting & Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          title="Ver perfil / Iniciar sesión"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </button>

        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
            {greeting()}
          </p>
          <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]">
            {user?.name || 'Hola, Hidratado'}
          </h1>
        </div>
      </div>

      {/* Right Controls: Streak & Quick Tools */}
      <div className="flex items-center gap-2">
        {/* Streak Counter Badge */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 font-bold text-xs shadow-xs"
          title="Racha de días consecutivos cumpliendo tu meta"
        >
          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-bounce" />
          <span>{currentStreak}d</span>
        </div>

        {/* Reminders Settings Button */}
        <button
          onClick={() => setIsReminderModalOpen(true)}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition cursor-pointer"
          title="Configurar recordatorios"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Widget Preview Modal Trigger */}
        <button
          onClick={() => setIsWidgetModalOpen(true)}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition cursor-pointer"
          title="Ver Widget Android M3"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
