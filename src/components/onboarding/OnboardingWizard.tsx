import React, { useState } from 'react';
import { Droplet, ArrowRight, ArrowLeft, Check, Sparkles, Activity, Thermometer, Scale, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityLevel, ClimateType, Sex } from '../../types';
import { calculateWaterGoal, getActivityLabel, getClimateLabel } from '../../services/calculator';

export const OnboardingWizard: React.FC = () => {
  const { user, completeOnboarding } = useApp();

  const [step, setStep] = useState(1);

  const [age, setAge] = useState<number>(user?.age || 26);
  const [weightKg, setWeightKg] = useState<number>(user?.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(user?.heightCm || 175);
  const [sex, setSex] = useState<Sex>(user?.sex || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('active');
  const [climate, setClimate] = useState<ClimateType>('temperate');

  const [customGoalMl, setCustomGoalMl] = useState<number>(0);

  // Calculate live water recommendation
  const { calculatedMl, calculatedLiters, breakdown } = calculateWaterGoal(weightKg, activityLevel, climate, sex, age);

  const activeGoal = customGoalMl || calculatedMl;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      completeOnboarding({
        age,
        weightKg,
        heightCm,
        sex,
        activityLevel,
        climate,
        customGoalMl: activeGoal,
      });
    }
  };

  if (user?.onboardingCompleted) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-5">
        {/* Step Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Paso {step} de 4</span>
            <span>GotaTracker Onboarding</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Physical Data */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-2">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Datos Personales</h3>
              <p className="text-xs text-slate-500">Necesitamos tus métricas físicas para calcular tu hidratación ideal.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Edad</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Estatura (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value, 10) || 170)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Sexo</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as Sex)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-100"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Activity Level */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Actividad Física</h3>
              <p className="text-xs text-slate-500">¿Con qué frecuencia te ejercitas o te mueves al día?</p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'sedentary', title: 'Sedentario', desc: 'Poco o ningún ejercicio diario' },
                { id: 'lightly_active', title: 'Poco Activo', desc: 'Ejercicio suave 1-3 días a la semana' },
                { id: 'active', title: 'Activo', desc: 'Ejercicio moderado 4-5 días a la semana' },
                { id: 'very_active', title: 'Muy Activo', desc: 'Deporte de alto impacto o trabajo físico' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivityLevel(item.id as ActivityLevel)}
                  className={`w-full p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                    activityLevel === item.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-cyan-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{item.title}</div>
                    <div className="text-[11px] opacity-75">{item.desc}</div>
                  </div>
                  {activityLevel === item.id && <Check className="w-4 h-4 text-blue-600 dark:text-cyan-400 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Climate */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-2">
                <Thermometer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Clima de tu Ciudad</h3>
              <p className="text-xs text-slate-500">Las temperaturas altas aceleran la transpiración y deshidratación.</p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'cold', title: '❄️ Frío', desc: 'Temperaturas bajas o ambiente fresco' },
                { id: 'temperate', title: '⛅ Templado', desc: 'Clima moderado habitual' },
                { id: 'hot', title: '☀️ Caluroso', desc: 'Temperaturas elevadas o mucho calor' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setClimate(item.id as ClimateType)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                    climate === item.id
                      ? 'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-orange-900 dark:text-orange-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{item.title}</div>
                    <div className="text-[11px] opacity-75">{item.desc}</div>
                  </div>
                  {climate === item.id && <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Final Calculated Goal Preview */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-500/30 animate-pulse">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">¡Tu Meta Personalizada!</h3>
              <p className="text-xs text-slate-500">Calculada automáticamente según tus métricas personales</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-slate-700 text-center space-y-2">
              <div className="text-3xl font-black text-blue-600 dark:text-cyan-400">
                {activeGoal} <span className="text-lg">ml</span>
              </div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Equivale a aproximadamente {calculatedLiters} Litros al día
              </div>

              {/* Slider for optional manual tweaking */}
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  Ajustar meta manualmente si lo deseas:
                </label>
                <input
                  type="range"
                  min="1200"
                  max="4500"
                  step="50"
                  value={activeGoal}
                  onChange={(e) => setCustomGoalMl(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex gap-2 pt-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{step === 4 ? 'Comenzar GotaTracker' : 'Siguiente'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
