import React from 'react';
import { Droplet, BarChart3, Camera, Award, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: 'home' | 'stats' | 'camera' | 'achievements' | 'profile';
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Inicio', icon: Droplet },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'camera', label: 'Escáner IA', icon: Camera, badge: 'IA' },
    { id: 'achievements', label: 'Logros', icon: Award },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around px-2 z-40 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer group"
          >
            {/* Active pill background */}
            <div
              className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />

              {/* Badge for AI Scanner */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 text-[9px] font-black bg-cyan-500 text-white px-1 py-0.2 rounded-full leading-none animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] mt-0.5 font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
