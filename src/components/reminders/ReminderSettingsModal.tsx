import React, { useState } from 'react';
import { X, Bell, Moon, Sun, Clock, Check, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReminderSettingsModal: React.FC = () => {
  const { isReminderModalOpen, setIsReminderModalOpen, user, updateProfile } = useApp();

  const [wakeUpTime, setWakeUpTime] = useState(user?.wakeUpTime || '07:30');
  const [sleepTime, setSleepTime] = useState(user?.sleepTime || '23:00');
  const [frequency, setFrequency] = useState<number>(user?.reminderFrequencyMinutes || 90);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);

  const [notificationSentMessage, setNotificationSentMessage] = useState(false);

  if (!isReminderModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      wakeUpTime,
      sleepTime,
      reminderFrequencyMinutes: frequency,
      notificationsEnabled,
    });
    setIsReminderModalOpen(false);
  };

  const handleTestNotification = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.error('Notification error', e);
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💧 GotaTracker: Hora de Hidratarte', {
        body: '¡Un sorbo de agua mantendrá tu metabolismo activo y tu concentración al 100%!',
        icon: '/favicon.ico',
      });
    }

    setNotificationSentMessage(true);
    setTimeout(() => setNotificationSentMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Configurar Recordatorios</h3>
          </div>
          <button
            onClick={() => setIsReminderModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Active Hours */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
              Horarios de Actividad (Respetar Horas de Sueño)
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Sun className="w-3 h-3 text-amber-500" /> Hora Despertar
                </span>
                <input
                  type="time"
                  value={wakeUpTime}
                  onChange={(e) => setWakeUpTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Moon className="w-3 h-3 text-indigo-400" /> Hora Dormir
                </span>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Frecuencia de Alertas
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { min: 45, label: 'Cada 45 min' },
                { min: 60, label: 'Cada 1 hora' },
                { min: 90, label: 'Cada 1.5 horas' },
                { min: 120, label: 'Cada 2 horas' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.min}
                  onClick={() => setFrequency(item.min)}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    frequency === item.min
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test Notification Trigger */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleTestNotification}
              className="w-full py-2 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 text-blue-600 dark:text-cyan-400 font-bold text-xs rounded-xl border border-blue-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Probar Notificación de Ejemplo</span>
            </button>
            {notificationSentMessage && (
              <p className="text-[10px] text-green-600 font-bold text-center mt-1">
                ¡Notificación enviada al dispositivo!
              </p>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Guardar Configuración</span>
          </button>
        </form>
      </div>
    </div>
  );
};
