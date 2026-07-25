export type Sex = 'male' | 'female' | 'other';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'active' | 'very_active';

export type ClimateType = 'cold' | 'temperate' | 'hot';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  age: number;
  weightKg: number;
  heightCm: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  climate: ClimateType;
  calculatedGoalMl: number;
  customGoalMl: number;
  wakeUpTime: string; // "07:00"
  sleepTime: string;  // "23:00"
  reminderFrequencyMinutes: number; // e.g. 60, 90, 120
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

export type ContainerType = 'glass_250' | 'bottle_500' | 'bottle_750' | 'custom';

export interface WaterLog {
  id: string;
  userId: string;
  amountMl: number;
  containerType: ContainerType;
  containerLabel: string;
  timestamp: string; // ISO string
  notes?: string;
  photoUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  currentValue: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'first' | 'streak' | 'volume' | 'time' | 'perfect';
}

export interface HabitPattern {
  hour: number; // 0..23
  count: number;
  probability: number;
}

export interface SmartInsight {
  id: string;
  title: string;
  description: string;
  type: 'recommendation' | 'alert' | 'habit_detected' | 'climate_warning';
  actionable?: {
    type: 'adjust_goal' | 'drink_now' | 'update_climate';
    suggestedGoalMl?: number;
  };
  createdAt: string;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  totalMl: number;
  goalMl: number;
  percentage: number;
  logsCount: number;
  goalMet: boolean;
}
