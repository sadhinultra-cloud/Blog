import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  X,
  Sparkles,
  Check,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'গুগল সাইন ইনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('আপনার নাম লিখুন।');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('এই ইমেইল দিয়ে ইতোমধ্যে একটি একাউন্ট খোলা আছে। সাইন ইন করুন।');
      } else if (err?.code === 'auth/weak-password') {
        setError('পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে।');
      } else {
        setError(err?.message || 'লগইন করতে সমস্যা হয়েছে।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-2xl space-y-6 relative"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div
            className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center shadow-xs"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {mode === 'signup' ? 'নতুন একাউন্ট তৈরি করুন' : 'সাইটে সাইন ইন করুন'}
          </h3>
          <p className="text-xs text-neutral-500">
            {mode === 'signup'
              ? 'নিবন্ধন করে কমেন্ট করুন ও সব ফিচারের সাথে যুক্ত থাকুন'
              : 'আপনার গুগল একাউন্ট বা ইমেইল দিয়ে সহজেই প্রবেশ করুন'}
          </p>
        </div>

        {/* Google 1-Click Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-3 border shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>গুগল দিয়ে প্রবেশ করুন (Google Sign-In)</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-[10px] text-neutral-400 uppercase font-mono">অথবা ইমেইল দিয়ে</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                আপনার নাম
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="আপনার পূর্ণ নাম"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              ইমেইল এড্রেস
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500 font-mono"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 cursor-pointer shadow-xs disabled:opacity-50"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <span>{loading ? 'অপেক্ষা করুন...' : mode === 'signup' ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'সাইন ইন'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs pt-1 text-neutral-500">
          {mode === 'signup' ? (
            <span>
              ইতোমধ্যে একাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signin');
                }}
                className="font-bold underline text-blue-600 dark:text-blue-400 cursor-pointer"
              >
                লগইন করুন
              </button>
            </span>
          ) : (
            <span>
              নতুন একাউন্ট খুলতে চান?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signup');
                }}
                className="font-bold underline text-blue-600 dark:text-blue-400 cursor-pointer"
              >
                রেজিস্ট্রেশন করুন
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
