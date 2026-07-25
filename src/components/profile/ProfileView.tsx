import React, { useState } from 'react';
import { User, Scale, Activity, Sun, Moon, Bell, RefreshCw, Save, LogOut, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityLevel, ClimateType, Sex } from '../../types';
import { calculateWaterGoal, getActivityLabel, getClimateLabel } from '../../services/calculator';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, logoutUser, clearAllData, setIsReminderModalOpen } = useApp();

  const [age, setAge] = useState<number>(user?.age || 26);
  const [weightKg, setWeightKg] = useState<number>(user?.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(user?.heightCm || 175);
  const [sex, setSex] = useState<Sex>(user?.sex || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user?.activityLevel || 'active');
  const [climate, setClimate] = useState<ClimateType>(user?.climate || 'temperate');
  const [customGoalMl, setCustomGoalMl] = useState<number>(user?.customGoalMl || user?.calculatedGoalMl || 2500);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const { calculatedMl } = calculateWaterGoal(weightKg, activityLevel, climate, sex, age);

    updateProfile({
      age,
      weightKg,
      heightCm,
      sex,
      activityLevel,
      climate,
      calculatedGoalMl: calculatedMl,
      customGoalMl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRecalculateGoal = () => {
    const { calculatedMl } = calculateWaterGoal(weightKg, activityLevel, climate, sex, age);
    setCustomGoalMl(calculatedMl);
  };

  return (
    <div className="px-4 py-3 space-y-5 animate-fadeIn pb-6">
      {/* Profile Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border border-white/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 className="text-lg font-bold truncate max-w-[180px]">{user?.name || 'Perfil de Usuario'}</h2>
            <p className="text-xs text-blue-100">{user?.email || 'registrado en Firebase'}</p>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition text-white cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Physical Metrics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" /> Datos Físicos
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Edad</label>
              <input
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Peso (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Estatura (cm)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value, 10) || 170)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Sexo</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'male', label: 'Masculino' },
                { id: 'female', label: 'Femenino' },
                { id: 'other', label: 'Otro' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSex(item.id as Sex)}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    sex === item.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity & Climate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Estilo de Vida
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Nivel de Actividad Física</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none"
            >
              <option value="sedentary">{getActivityLabel('sedentary')}</option>
              <option value="lightly_active">{getActivityLabel('lightly_active')}</option>
              <option value="active">{getActivityLabel('active')}</option>
              <option value="very_active">{getActivityLabel('very_active')}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Clima de Residencia</label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value as ClimateType)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none"
            >
              <option value="cold">{getClimateLabel('cold')}</option>
              <option value="temperate">{getClimateLabel('temperate')}</option>
              <option value="hot">{getClimateLabel('hot')}</option>
            </select>
          </div>
        </div>

        {/* Goal Adjustment */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sun className="w-4 h-4 text-blue-500" /> Meta Diaria
            </h3>
            <button
              type="button"
              onClick={handleRecalculateGoal}
              className="text-[11px] text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Recalcular
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              <span>Objetivo de Hidratación</span>
              <span className="text-blue-600 dark:text-cyan-400 text-base">{customGoalMl} ml ({Number((customGoalMl / 1000).toFixed(2))} L)</span>
            </div>
            <input
              type="range"
              min="1200"
              max="4500"
              step="50"
              value={customGoalMl}
              onChange={(e) => setCustomGoalMl(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Reminders Button Link */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Horarios y Recordatorios</div>
              <div className="text-[10px] text-slate-400">Respetar horas de sueño y frecuencia</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsReminderModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-cyan-400 font-bold text-xs hover:bg-blue-100 transition cursor-pointer"
          >
            Configurar
          </button>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>¡Perfil Actualizado!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </form>

      {/* Clear Data Reset */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => {
            if (confirm('¿Deseas reiniciar todos tus registros y restaurar la configuración inicial?')) {
              clearAllData();
            }
          }}
          className="text-xs text-slate-400 hover:text-red-500 transition cursor-pointer underline"
        >
          Restablecer todos los datos
        </button>
      </div>
    </div>
  );
};
