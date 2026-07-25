import { ActivityLevel, ClimateType, Sex } from '../types';

/**
 * Calculates recommended daily water intake in milliliters based on physical metrics
 */
export function calculateWaterGoal(
  weightKg: number,
  activityLevel: ActivityLevel,
  climate: ClimateType,
  sex: Sex,
  age: number
): { calculatedMl: number; calculatedLiters: number; breakdown: { baseMl: number; activityBonusMl: number; climateBonusMl: number; ageSexBonusMl: number } } {
  // Base requirement: 35 ml per kg of body weight
  const baseMl = Math.round((weightKg || 70) * 35);

  // Activity bonus
  let activityBonusMl = 0;
  switch (activityLevel) {
    case 'sedentary':
      activityBonusMl = 0;
      break;
    case 'lightly_active':
      activityBonusMl = 300;
      break;
    case 'active':
      activityBonusMl = 600;
      break;
    case 'very_active':
      activityBonusMl = 1000;
      break;
  }

  // Climate bonus
  let climateBonusMl = 0;
  switch (climate) {
    case 'cold':
      climateBonusMl = 0;
      break;
    case 'temperate':
      climateBonusMl = 250;
      break;
    case 'hot':
      climateBonusMl = 550;
      break;
  }

  // Sex & Age adjustment
  let ageSexBonusMl = 0;
  if (sex === 'male') {
    ageSexBonusMl += 200;
  }
  if (age < 18) {
    ageSexBonusMl += 100;
  } else if (age > 65) {
    // Older adults need careful hydration monitoring
    ageSexBonusMl += 150;
  }

  const totalMl = Math.max(1200, Math.min(5000, baseMl + activityBonusMl + climateBonusMl + ageSexBonusMl));
  const roundedMl = Math.round(totalMl / 50) * 50; // Round to nearest 50ml

  return {
    calculatedMl: roundedMl,
    calculatedLiters: Number((roundedMl / 1000).toFixed(2)),
    breakdown: {
      baseMl,
      activityBonusMl,
      climateBonusMl,
      ageSexBonusMl,
    },
  };
}

export function formatMlOrL(ml: number): string {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(2).replace(/\.00$/, '')} L`;
  }
  return `${ml} ml`;
}

export function getActivityLabel(level: ActivityLevel): string {
  switch (level) {
    case 'sedentary':
      return 'Sedentario (poco movimiento)';
    case 'lightly_active':
      return 'Poco activo (ejercicio 1-3 días/sem)';
    case 'active':
      return 'Activo (ejercicio 4-5 días/sem)';
    case 'very_active':
      return 'Muy activo (deporte diario / trabajo físico)';
  }
}

export function getClimateLabel(climate: ClimateType): string {
  switch (climate) {
    case 'cold':
      return 'Frío (ambiente fresco)';
    case 'temperate':
      return 'Templado (clima moderado)';
    case 'hot':
      return 'Caluroso (alta temperatura / sudoración)';
  }
}
