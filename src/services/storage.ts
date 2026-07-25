import { Achievement, UserProfile, WaterLog } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'gotatracker_user_profile',
  LOGS: 'gotatracker_water_logs',
  ACHIEVEMENTS: 'gotatracker_achievements',
  AUTH_SESSION: 'gotatracker_auth_session',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_glass',
    title: 'Primer Vaso',
    description: 'Registra tu primera toma de agua.',
    icon: '🥛',
    targetValue: 1,
    currentValue: 0,
    unlocked: false,
    category: 'first',
  },
  {
    id: 'first_week',
    title: 'Primera Semana',
    description: 'Cumple tu meta de hidratación 7 días seguidos.',
    icon: '🗓️',
    targetValue: 7,
    currentValue: 0,
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'streak_30',
    title: '30 Días Imparable',
    description: 'Mantén una racha de hidratación por 30 días seguidos.',
    icon: '🔥',
    targetValue: 30,
    currentValue: 0,
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'liters_100',
    title: 'Océano de 100 Litros',
    description: 'Consume un total acumulado de 100 Litros de agua.',
    icon: '🌊',
    targetValue: 100,
    currentValue: 0,
    unlocked: false,
    category: 'volume',
  },
  {
    id: 'perfect_week',
    title: 'Semana Perfecta',
    description: 'Alcanza exactamente el 100% o más de tu meta 7 días seguidos.',
    icon: '💧',
    targetValue: 7,
    currentValue: 0,
    unlocked: false,
    category: 'perfect',
  },
  {
    id: 'early_bird',
    title: 'Madrugador Hidratado',
    description: 'Registra un vaso de agua antes de las 8:00 AM.',
    icon: '🌅',
    targetValue: 1,
    currentValue: 0,
    unlocked: false,
    category: 'time',
  },
  {
    id: 'super_hydrated',
    title: 'Súper Hidratado',
    description: 'Registra más de 3,000 ml de agua en un solo día.',
    icon: '⚡',
    targetValue: 3000,
    currentValue: 0,
    unlocked: false,
    category: 'volume',
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  uid: 'demo_user_123',
  name: 'Max Enrique',
  email: 'max@ejemplo.com',
  age: 26,
  weightKg: 72,
  heightCm: 175,
  sex: 'male',
  activityLevel: 'active',
  climate: 'temperate',
  calculatedGoalMl: 2700,
  customGoalMl: 2700,
  wakeUpTime: '07:30',
  sleepTime: '23:00',
  reminderFrequencyMinutes: 90,
  notificationsEnabled: true,
  onboardingCompleted: true,
  createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
};

// Seed sample historical logs for the past 7 days so charts and statistics look populated!
export function getSeedLogs(userId: string, goalMl: number): WaterLog[] {
  const logs: WaterLog[] = [];
  const now = new Date();

  // Create logs for past 6 days + today
  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = dayDate.toISOString().split('T')[0];

    // Morning log (8:30 AM)
    const morningTime = new Date(`${dateStr}T08:30:00`).toISOString();
    logs.push({
      id: `seed_${i}_1`,
      userId,
      amountMl: 500,
      containerType: 'bottle_500',
      containerLabel: 'Botella de agua',
      timestamp: morningTime,
    });

    // Noon log (12:15 PM)
    const noonTime = new Date(`${dateStr}T12:15:00`).toISOString();
    logs.push({
      id: `seed_${i}_2`,
      userId,
      amountMl: 750,
      containerType: 'bottle_750',
      containerLabel: 'Termo deportivo',
      timestamp: noonTime,
    });

    // Afternoon log (15:45 PM)
    const afternoonTime = new Date(`${dateStr}T15:45:00`).toISOString();
    logs.push({
      id: `seed_${i}_3`,
      userId,
      amountMl: 500,
      containerType: 'bottle_500',
      containerLabel: 'Botella de agua',
      timestamp: afternoonTime,
    });

    // Evening log (19:30 PM)
    if (i !== 0) {
      // Past days completed goal fully
      const eveningTime = new Date(`${dateStr}T19:30:00`).toISOString();
      logs.push({
        id: `seed_${i}_4`,
        userId,
        amountMl: 1000,
        containerType: 'custom',
        containerLabel: 'Jarra de agua con limón',
        timestamp: eveningTime,
      });
    }
  }

  return logs;
}

export function loadStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profile from storage', e);
  }
  return null;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to storage', e);
  }
}

export function loadStoredLogs(): WaterLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading water logs', e);
  }
  return [];
}

export function saveStoredLogs(logs: WaterLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving water logs', e);
  }
}

export function loadStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading achievements', e);
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveStoredAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {
    console.error('Error saving achievements', e);
  }
}
