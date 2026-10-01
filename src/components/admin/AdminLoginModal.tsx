import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { BOOTSTRAP_ADMIN_EMAIL } from '../../firebase';
import { Shield, Key, ArrowRight, Check, AlertCircle, X, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginSuccess,
}) => {
  const { loginAdmin } = useBlog();
  const { loginWithGoogle, loginWithEmail, currentUser, userProfile, isAdmin } = useAuth();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [useEmailMode, setUseEmailMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthorized = () => {
    setError(null);
    setPassword('');
    setEmail('');
    if (onSuccess) onSuccess();
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleGoogleAdminLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const profile = await loginWithGoogle();
      const isOwner = profile?.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
      const hasAdminRights =
        isOwner || profile?.role === 'super_admin' || profile?.role === 'admin';

      if (hasAdminRights) {
        loginAdmin('admin123', profile?.role === 'editor' ? 'editor' : 'super_admin');
        handleAuthorized();
      } else {
        setError(
          `লগইন সফল হয়েছে, কিন্তু ${profile?.email} অ্যাকাউন্টের এখনো Admin এক্সেস নেই। অনুগ্রহ করে মাস্টার এডমিন (${BOOTSTRAP_ADMIN_EMAIL})-এর সাথে যোগাযোগ করুন।`
        );
      }
    } catch (err: any) {
      console.error(err);
      setError('গুগল লগইনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useEmailMode) {
      setLoading(true);
      loginWithEmail(email, password)
        .then((profile) => {
          const isOwner = profile?.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
          const hasAdminRights =
            isOwner || profile?.role === 'super_admin' || profile?.role === 'admin';
          if (hasAdminRights) {
            loginAdmin('admin123', profile?.role === 'editor' ? 'editor' : 'super_admin');
            handleAuthorized();
          } else {
            setError('এই অ্যাকাউন্টের এডমিন এক্সেস নেই।');
          }
        })
        .catch((err) => {
          setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
        })
        .finally(() => setLoading(false));
      return;
    }

    const ok = loginAdmin(password.trim());
    if (ok) {
      handleAuthorized();
    } else {
      setError('পাসওয়ার্ড সঠিক নয়। "admin123" বা "editor123" ব্যবহার করুন।');
    }
  };

  const handleQuickFill = (pass: string) => {
    setPassword(pass);
    const ok = loginAdmin(pass);
    if (ok) {
      handleAuthorized();
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
            style={{
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
            }}
          >
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Admin Access Control
          </h3>
          <p className="text-xs text-neutral-500">
            Firebase Auth এবং নিরাপদ ভূমিকা ভিত্তিক এক্সেস কন্ট্রোল।
          </p>
        </div>

        {/* Google 1-Click Sign-in for Admins */}
        <button
          type="button"
          onClick={handleGoogleAdminLogin}
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
          <span className="text-[10px] text-neutral-400 uppercase font-mono">অথবা পাসফ্রেজ দিয়ে</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {useEmailMode && (
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Firebase Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {useEmailMode ? 'Firebase Password' : 'Admin Passphrase'}
              </label>
              <button
                type="button"
                onClick={() => setUseEmailMode(!useEmailMode)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {useEmailMode ? 'সরাসরি পাসফ্রেজ ব্যবহার করুন' : 'ইমেইল/পাসওয়ার্ড ব্যবহার করুন'}
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500 font-mono"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
              <Key className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3" />
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
            <span>{loading ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন (Authorize & Enter)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="border-t pt-4 space-y-2 text-xs" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block text-center">
            Demo Credentials (1-Click Login)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickFill('admin123')}
              className="p-2 rounded-lg border text-left hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer flex flex-col"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                Super Admin
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">admin123</span>
            </button>
            <button
              onClick={() => handleQuickFill('editor123')}
              className="p-2 rounded-lg border text-left hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer flex flex-col"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                Editor Role
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">editor123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
