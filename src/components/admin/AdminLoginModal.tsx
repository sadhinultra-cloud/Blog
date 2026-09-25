import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Shield, Key, ArrowRight, Check, AlertCircle, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess, onLoginSuccess }) => {
  const { loginAdmin } = useBlog();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthorized = () => {
    setError(null);
    setPassword('');
    if (onSuccess) onSuccess();
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(password.trim());
    if (ok) {
      handleAuthorized();
    } else {
      setError('Invalid password. Try "admin123" for Super Admin or "editor123" for Editor.');
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
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div
            className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center shadow-sm"
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
            Authenticate to enter the comprehensive publication control center.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Passphrase / Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
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
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 cursor-pointer shadow-sm"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <span>Authorize & Enter</span>
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
