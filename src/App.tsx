import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/layout/AndroidFrame';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { LiquidProgress } from './components/home/LiquidProgress';
import { SmartInsightCard } from './components/home/SmartInsightCard';
import { StatsView } from './components/stats/StatsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { CameraScannerModal } from './components/camera/CameraScannerModal';
import { ProfileView } from './components/profile/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { QuickAddModal } from './components/home/QuickAddModal';
import { ReminderSettingsModal } from './components/reminders/ReminderSettingsModal';
import { WidgetPreviewModal } from './components/widget/WidgetPreviewModal';
import { formatMlOrL } from './services/calculator';
import { Plus, Flame, Sparkles } from 'lucide-react';

const MainScreen: React.FC = () => {
  const { activeTab, setIsQuickAddOpen, todayTotalMl, dailyGoalMl, currentStreak } = useApp();

  return (
    <div className="relative min-h-full flex flex-col justify-between">
      {/* Header */}
      <Header />

      {/* Main Tab View Content */}
      <main className="flex-1 pb-4">
        {activeTab === 'home' && (
          <div className="space-y-3">
            {/* Liquid Ring Progress Indicator */}
            <LiquidProgress />

            {/* Local AI Habit Insights & Climate Recommendation */}
            <SmartInsightCard />

            {/* Quick Metrics Summary Cards */}
            <div className="px-4 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hoy Bebido</div>
                  <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
                    {formatMlOrL(todayTotalMl)}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-bold text-xs">
                  💧
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Racha</div>
                  <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
                    {currentStreak} Días
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 font-bold text-xs">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && <StatsView />}
        {activeTab === 'camera' && <CameraScannerModal />}
        {activeTab === 'achievements' && <AchievementsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <AuthModal />
      <OnboardingWizard />
      <QuickAddModal />
      <ReminderSettingsModal />
      <WidgetPreviewModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidFrame>
        <MainScreen />
      </AndroidFrame>
    </AppProvider>
  );
}
