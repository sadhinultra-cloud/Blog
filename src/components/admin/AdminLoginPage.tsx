import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { BOOTSTRAP_ADMIN_EMAIL } from '../../firebase';
import { Shield, ArrowLeft, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const { loginAdmin } = useBlog();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        onLoginSuccess();
      } else {
        setError(
          `লগইন সফল হয়েছে, কিন্তু "${profile?.email}" অ্যাকাউন্টের Admin অধিকার নেই। শুধুমাত্র অনুমোদিত এডমিন অ্যাকাউন্ট প্রবেশ করতে পারে।`
        );
      }
    } catch (err: any) {
      console.error(err);
      setError('গুগল লগইনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div
        className="w-full max-w-md rounded-3xl border p-8 sm:p-10 shadow-2xl space-y-7 relative transition-all"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Top return link */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onBackToSite}
            className="text-xs font-semibold flex items-center gap-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </button>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            Admin Portal
          </span>
        </div>

        {/* Shield Icon & Title */}
        <div className="text-center space-y-3">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
            }}
          >
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Editorial Admin Console
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
              প্রশাসনিক নিয়ন্ত্রণ কেন্দ্রে প্রবেশ করতে অনুমোদিত Google অ্যাকাউন্ট ব্যবহার করুন।
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ONLY Continue with Google Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 border shadow-sm hover:shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--card-bg)',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span>প্রমাণীকরণ করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Security & Authentication Info */}
        <div className="pt-2 border-t flex items-center justify-center gap-1.5 text-[11px] text-neutral-400" style={{ borderColor: 'var(--border-color)' }}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured with Firebase OAuth 2.0</span>
        </div>
      </div>
    </div>
  );
};
