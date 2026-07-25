import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Achievement, SmartInsight, UserProfile, WaterLog, ContainerType } from '../types';
import { calculateWaterGoal } from '../services/calculator';
import { generateSmartInsights } from '../services/smartAI';
import {
  DEFAULT_PROFILE,
  INITIAL_ACHIEVEMENTS,
  getSeedLogs,
  loadStoredAchievements,
  loadStoredLogs,
  loadStoredProfile,
  saveStoredAchievements,
  saveStoredLogs,
  saveStoredProfile,
} from '../services/storage';

interface AppContextType {
  user: UserProfile | null;
  logs: WaterLog[];
  achievements: Achievement[];
  insights: SmartInsight[];
  theme: 'light' | 'dark';
  useAndroidFrame: boolean;
  activeTab: 'home' | 'stats' | 'camera' | 'achievements' | 'profile';
  
  // Modals state
  isQuickAddOpen: boolean;
  isReminderModalOpen: boolean;
  isWidgetModalOpen: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register' | 'forgot';
  
  // Handlers
  setTheme: (t: 'light' | 'dark') => void;
  setUseAndroidFrame: (val: boolean) => void;
  setActiveTab: (tab: 'home' | 'stats' | 'camera' | 'achievements' | 'profile') => void;
  setIsQuickAddOpen: (val: boolean) => void;
  setIsReminderModalOpen: (val: boolean) => void;
  setIsWidgetModalOpen: (val: boolean) => void;
  setIsAuthModalOpen: (val: boolean) => void;
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;

  // Auth actions
  loginUser: (email: string, pass: string) => Promise<boolean>;
  registerUser: (name: string, email: string, pass: string) => Promise<boolean>;
  logoutUser: () => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Water Actions
  addWaterLog: (amountMl: number, containerType?: ContainerType, containerLabel?: string) => void;
  deleteWaterLog: (id: string) => void;
  undoLastLog: () => void;
  clearAllData: () => void;

  // Derived state
  todayTotalMl: number;
  dailyGoalMl: number;
  todayProgressPercent: number;
  currentStreak: number;
  maxStreak: number;
  totalLitersAllTime: number;
  lastLog: WaterLog | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const loaded = loadStoredProfile();
    return loaded || DEFAULT_PROFILE;
  });

  const [logs, setLogs] = useState<WaterLog[]>(() => {
    const stored = loadStoredLogs();
    if (stored.length > 0) return stored;
    // Seed default logs for rich initial experience
    const seeded = getSeedLogs('demo_user_123', 2700);
    saveStoredLogs(seeded);
    return seeded;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    return loadStoredAchievements();
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [useAndroidFrame, setUseAndroidFrame] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'camera' | 'achievements' | 'profile'>('home');

  // Modal states
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Last log for undo capability
  const [lastLog, setLastLog] = useState<WaterLog | null>(null);

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  // Filter today's logs
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayLogs = useMemo(() => {
    return logs.filter((log) => log.timestamp.startsWith(todayStr));
  }, [logs, todayStr]);

  const todayTotalMl = useMemo(() => {
    return todayLogs.reduce((acc, l) => acc + l.amountMl, 0);
  }, [todayLogs]);

  const dailyGoalMl = useMemo(() => {
    if (!user) return 2500;
    return user.customGoalMl || user.calculatedGoalMl || 2500;
  }, [user]);

  const todayProgressPercent = useMemo(() => {
    if (dailyGoalMl <= 0) return 0;
    return Math.min(100, Math.round((todayTotalMl / dailyGoalMl) * 100));
  }, [todayTotalMl, dailyGoalMl]);

  // Total Liters All Time
  const totalLitersAllTime = useMemo(() => {
    const totalMl = logs.reduce((acc, l) => acc + l.amountMl, 0);
    return Number((totalMl / 1000).toFixed(1));
  }, [logs]);

  // Calculate Streaks
  const { currentStreak, maxStreak } = useMemo(() => {
    if (!logs.length) return { currentStreak: 0, maxStreak: 0 };

    // Group logs by date string YYYY-MM-DD
    const logsByDate: { [date: string]: number } = {};
    logs.forEach((l) => {
      const dateKey = l.timestamp.split('T')[0];
      logsByDate[dateKey] = (logsByDate[dateKey] || 0) + l.amountMl;
    });

    const datesWithGoalMet = Object.keys(logsByDate)
      .filter((dateKey) => logsByDate[dateKey] >= dailyGoalMl)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let max = 0;
    let tempStreak = 0;

    // Check consecutive days starting today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);

    // If today's goal is met, streak includes today
    const todayDateStr = checkDate.toISOString().split('T')[0];
    if (logsByDate[todayDateStr] >= dailyGoalMl) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check if yesterday met goal to keep active streak
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (logsByDate[dateStr] >= dailyGoalMl) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate max historical streak
    const allUniqueDates = Object.keys(logsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let lastTime = 0;
    allUniqueDates.forEach((dateStr) => {
      if (logsByDate[dateStr] >= dailyGoalMl) {
        const curTime = new Date(dateStr).getTime();
        if (lastTime === 0 || curTime - lastTime === 86400000) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        if (tempStreak > max) max = tempStreak;
        lastTime = curTime;
      }
    });

    return {
      currentStreak: streak,
      maxStreak: Math.max(streak, max),
    };
  }, [logs, dailyGoalMl]);

  // Check and unlock achievements
  useEffect(() => {
    let changed = false;
    const updatedAchievements = achievements.map((ach) => {
      let newValue = ach.currentValue;
      let shouldUnlock = ach.unlocked;

      switch (ach.id) {
        case 'first_glass':
          newValue = logs.length;
          if (newValue >= 1) shouldUnlock = true;
          break;
        case 'first_week':
          newValue = currentStreak;
          if (newValue >= 7) shouldUnlock = true;
          break;
        case 'streak_30':
          newValue = currentStreak;
          if (newValue >= 30) shouldUnlock = true;
          break;
        case 'liters_100':
          newValue = totalLitersAllTime;
          if (newValue >= 100) shouldUnlock = true;
          break;
        case 'perfect_week':
          newValue = currentStreak;
          if (newValue >= 7) shouldUnlock = true;
          break;
        case 'early_bird':
          const earlyLogs = logs.filter((l) => {
            const hour = new Date(l.timestamp).getHours();
            return hour < 8;
          });
          newValue = earlyLogs.length;
          if (newValue >= 1) shouldUnlock = true;
          break;
        case 'super_hydrated':
          const maxDayMl = Math.max(0, todayTotalMl);
          newValue = maxDayMl;
          if (newValue >= 3000) shouldUnlock = true;
          break;
      }

      if (newValue !== ach.currentValue || shouldUnlock !== ach.unlocked) {
        changed = true;
        return {
          ...ach,
          currentValue: newValue,
          unlocked: shouldUnlock,
          unlockedAt: shouldUnlock && !ach.unlocked ? new Date().toISOString() : ach.unlockedAt,
        };
      }
      return ach;
    });

    if (changed) {
      setAchievements(updatedAchievements);
      saveStoredAchievements(updatedAchievements);
    }
  }, [logs, currentStreak, totalLitersAllTime, todayTotalMl]);

  // Smart Insights generator
  const insights = useMemo(() => {
    if (!user) return [];
    return generateSmartInsights(user, todayLogs, logs);
  }, [user, todayLogs, logs]);

  // Action: Add Water Log
  const addWaterLog = (amountMl: number, containerType: ContainerType = 'glass_250', containerLabel = 'Vaso de agua') => {
    if (!user) return;

    const newLog: WaterLog = {
      id: `log_${Date.now()}`,
      userId: user.uid,
      amountMl,
      containerType,
      containerLabel,
      timestamp: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    saveStoredLogs(updatedLogs);
    setLastLog(newLog);

    // Trigger celebratory confetti if completing or exceeding goal!
    const newTodayTotal = todayTotalMl + amountMl;
    if (todayTotalMl < dailyGoalMl && newTodayTotal >= dailyGoalMl) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2196F3', '#00BCD4', '#64B5F6', '#E3F2FD'],
      });
    }
  };

  const deleteWaterLog = (id: string) => {
    const filtered = logs.filter((l) => l.id !== id);
    setLogs(filtered);
    saveStoredLogs(filtered);
  };

  const undoLastLog = () => {
    if (lastLog) {
      deleteWaterLog(lastLog.id);
      setLastLog(null);
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    setLogs([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setUser(null);
  };

  // Auth actions
  const loginUser = async (email: string, _pass: string) => {
    const existing = loadStoredProfile();
    const userToSet: UserProfile = existing || {
      ...DEFAULT_PROFILE,
      email,
      name: email.split('@')[0] || 'Usuario',
    };
    setUser(userToSet);
    saveStoredProfile(userToSet);
    setIsAuthModalOpen(false);
    return true;
  };

  const registerUser = async (name: string, email: string, _pass: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_PROFILE,
      uid: `usr_${Date.now()}`,
      name: name || 'Usuario',
      email,
      onboardingCompleted: false, // Trigger onboarding wizard for new user!
    };
    setUser(newUser);
    saveStoredProfile(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logoutUser = () => {
    setUser((prev) => (prev ? { ...prev, onboardingCompleted: false } : null));
    setIsAuthModalOpen(true);
  };

  const completeOnboarding = (profileData: Partial<UserProfile>) => {
    if (!user) return;
    const { calculatedMl } = calculateWaterGoal(
      profileData.weightKg || user.weightKg,
      profileData.activityLevel || user.activityLevel,
      profileData.climate || user.climate,
      profileData.sex || user.sex,
      profileData.age || user.age
    );

    const updated: UserProfile = {
      ...user,
      ...profileData,
      calculatedGoalMl: calculatedMl,
      customGoalMl: profileData.customGoalMl || calculatedMl,
      onboardingCompleted: true,
    };

    setUser(updated);
    saveStoredProfile(updated);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated };
    setUser(newProfile);
    saveStoredProfile(newProfile);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        logs,
        achievements,
        insights,
        theme,
        useAndroidFrame,
        activeTab,
        isQuickAddOpen,
        isReminderModalOpen,
        isWidgetModalOpen,
        isAuthModalOpen,
        authMode,
        setTheme,
        setUseAndroidFrame,
        setActiveTab,
        setIsQuickAddOpen,
        setIsReminderModalOpen,
        setIsWidgetModalOpen,
        setIsAuthModalOpen,
        setAuthMode,
        loginUser,
        registerUser,
        logoutUser,
        completeOnboarding,
        updateProfile,
        addWaterLog,
        deleteWaterLog,
        undoLastLog,
        clearAllData,
        todayTotalMl,
        dailyGoalMl,
        todayProgressPercent,
        currentStreak,
        maxStreak,
        totalLitersAllTime,
        lastLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
