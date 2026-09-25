import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Mail, Send, CheckCircle, Shield } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { subscribeNewsletter } = useBlog();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribeNewsletter(email);
    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setEmail('');
    } else {
      setMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setMsg(null), 5000);
  };

  return (
    <section
      id="newsletter-section"
      className="w-full my-16 p-8 sm:p-12 rounded-2xl border relative overflow-hidden text-center"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div
          className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: 'var(--btn-bg)',
            color: 'var(--btn-text)',
          }}
        >
          <Mail className="w-6 h-6" />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
        >
          Curated Editorial Dispatches
        </h2>

        <p className="text-sm sm:text-base leading-relaxed text-neutral-500 max-w-xl mx-auto">
          Delivered every Sunday morning. No spam, no algorithmic fluff—pure technical depth, design philosophy, and essays on intentional living.
        </p>

        <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border bg-white dark:bg-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            required
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-md"
            style={{
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
            }}
          >
            <span>Subscribe</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {msg && (
          <p
            className={`text-xs p-2.5 rounded-lg max-w-md mx-auto flex items-center justify-center gap-2 ${
              msg.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{msg.text}</span>
          </p>
        )}

        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            100% Privacy Respected
          </span>
          <span>•</span>
          <span>Unsubscribe Anytime with 1-Click</span>
        </div>
      </div>
    </section>
  );
};
