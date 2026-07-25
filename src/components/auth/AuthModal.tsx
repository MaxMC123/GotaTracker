import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppIcon } from '../common/AppIcon';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, loginUser, registerUser, user } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (authMode === 'login') {
      await loginUser(email || 'demo@gotatracker.app', password);
    } else if (authMode === 'register') {
      await registerUser(name || 'Usuario GotaTracker', email || 'nuevo@gotatracker.app', password);
    } else if (authMode === 'forgot') {
      setResetSent(true);
      setTimeout(() => setResetSent(false), 4000);
    }

    setLoading(false);
  };

  const handleDemoLogin = async () => {
    await loginUser('max@gotatracker.app', 'demo123');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <AppIcon size={28} />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              {authMode === 'login' ? 'Iniciar Sesión' : authMode === 'register' ? 'Crear Cuenta GotaTracker' : 'Recuperar Contraseña'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
              authMode === 'login'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Ingresar
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
              authMode === 'register'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Registro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Nombre Completo</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Correo Electrónico</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-500">Contraseña</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[10px] text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {resetSent && (
            <p className="text-[11px] text-green-600 dark:text-green-400 font-bold text-center bg-green-50 dark:bg-green-950/40 p-2 rounded-xl">
              ¡Enlace de recuperación enviado a tu correo!
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            {authMode === 'login' ? 'Entrar con Firebase Auth' : authMode === 'register' ? 'Crear Mi Cuenta' : 'Enviar Correo de Recuperación'}
          </button>
        </form>

        {/* Demo fast access */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline"
          >
            Entrar en Modo Demostración Rápida
          </button>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-1">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            <span>Sincronización segura con Firebase Firestore</span>
          </div>
        </div>
      </div>
    </div>
  );
};
