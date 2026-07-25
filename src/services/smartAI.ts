import { HabitPattern, SmartInsight, UserProfile, WaterLog } from '../types';

/**
 * Analyzes water consumption patterns over historical logs
 */
export function analyzeConsumptionPatterns(logs: WaterLog[]): HabitPattern[] {
  const hourCounts: { [hour: number]: number } = {};
  for (let h = 0; h < 24; h++) hourCounts[h] = 0;

  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const totalLogs = logs.length || 1;
  return Object.keys(hourCounts).map((hStr) => {
    const hour = parseInt(hStr, 10);
    const count = hourCounts[hour];
    return {
      hour,
      count,
      probability: Number((count / totalLogs).toFixed(3)),
    };
  });
}

/**
 * Identifies peak hydration hours
 */
export function getPeakHydrationHours(patterns: HabitPattern[]): number[] {
  return patterns
    .filter((p) => p.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((p) => p.hour);
}

/**
 * Checks hours since last water log during waking hours
 */
export function getHoursSinceLastDrink(logs: WaterLog[], wakeUpTime: string, sleepTime: string): { hours: number; isOverdue: boolean } {
  if (!logs || logs.length === 0) return { hours: 99, isOverdue: true };

  // Sort latest first
  const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const lastLogTime = new Date(sorted[0].timestamp).getTime();
  const now = new Date().getTime();

  const diffHours = (now - lastLogTime) / (1000 * 60 * 60);

  // Check if current time is within active waking window
  const currentHour = new Date().getHours();
  const wakeHour = parseInt(wakeUpTime.split(':')[0], 10) || 7;
  const sleepHour = parseInt(sleepTime.split(':')[0], 10) || 23;

  const isWakingHours = currentHour >= wakeHour && currentHour < sleepHour;

  return {
    hours: Number(diffHours.toFixed(1)),
    isOverdue: isWakingHours && diffHours >= 2.5,
  };
}

/**
 * Generates personalized smart insights based on local AI rules
 */
export function generateSmartInsights(
  profile: UserProfile,
  todayLogs: WaterLog[],
  allLogs: WaterLog[]
): SmartInsight[] {
  const insights: SmartInsight[] = [];
  const patterns = analyzeConsumptionPatterns(allLogs);
  const peakHours = getPeakHydrationHours(patterns);
  const { hours, isOverdue } = getHoursSinceLastDrink(todayLogs, profile.wakeUpTime, profile.sleepTime);

  const todayTotalMl = todayLogs.reduce((acc, log) => acc + log.amountMl, 0);
  const goalMl = profile.customGoalMl || profile.calculatedGoalMl;
  const percentage = Math.round((todayTotalMl / goalMl) * 100);

  // 1. Inactivity Alert (if 2.5+ hours without drinking during awake time)
  if (isOverdue) {
    insights.push({
      id: 'inactivity_alert',
      title: '⚡ ¡Alerta de Hidratación!',
      description: `Has pasado aproximadamente ${hours >= 24 ? 'varias horas' : `${hours} horas`} sin beber agua. Un vaso de 250 ml repondrá tu energía y mantendrá tu enfoque.`,
      type: 'alert',
      actionable: {
        type: 'drink_now',
      },
      createdAt: new Date().toISOString(),
    });
  }

  // 2. Climate & Activity adjustment recommendation
  if (profile.climate === 'hot') {
    const suggestedIncreaseMl = 300;
    insights.push({
      id: 'climate_recommendation',
      title: '☀️ Clima Caluroso Detectado',
      description: `Al vivir en una zona calurosa, tu cuerpo pierde más líquidos por evaporación. Te recomendamos aumentar tu meta en +${suggestedIncreaseMl} ml hoy para mantener el equilibrio térmico.`,
      type: 'climate_warning',
      actionable: {
        type: 'adjust_goal',
        suggestedGoalMl: goalMl + suggestedIncreaseMl,
      },
      createdAt: new Date().toISOString(),
    });
  } else if (profile.activityLevel === 'very_active') {
    insights.push({
      id: 'activity_recommendation',
      title: '🏃‍♂️ Alto Rendimiento Físico',
      description: `Tu nivel de actividad 'Muy activo' genera mayor desgaste físico. Mantener una hidratación constante antes y después de ejercitarte evita la fatiga muscular.`,
      type: 'recommendation',
      createdAt: new Date().toISOString(),
    });
  }

  // 3. Peak Habit Learning
  if (peakHours.length > 0) {
    const formattedHours = peakHours.map((h) => `${h}:00`).join(', ');
    const nextPeak = peakHours[0];
    const reminderTime = nextPeak === 0 ? '23:45' : `${nextPeak - 1}:45`;

    insights.push({
      id: 'habit_learned',
      title: '🧠 Patrón Inteligente Aprendido',
      description: `La IA detectó que sueles hidratarte alrededor de las ${formattedHours}. Hemos adaptado tus recordatorios inteligentes para avisarte a las ${reminderTime}, justo antes de tu hora habitual.`,
      type: 'habit_detected',
      createdAt: new Date().toISOString(),
    });
  }

  // 4. Progress encouragement
  if (percentage >= 100) {
    insights.push({
      id: 'goal_accomplished',
      title: '🎉 ¡Meta Cumplida!',
      description: '¡Excelente trabajo! Has alcanzado tu objetivo diario de hidratación. Mantener esta constancia mejora tu piel, digestión y nivel de energía.',
      type: 'recommendation',
      createdAt: new Date().toISOString(),
    });
  } else if (percentage >= 50) {
    insights.push({
      id: 'halfway_there',
      title: '💧 Vas a más de la mitad',
      description: `Llevas un ${percentage}% de tu meta (${todayTotalMl} / ${goalMl} ml). ¡Un par de vasos más y lograrás tu objetivo del día!`,
      type: 'recommendation',
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}
