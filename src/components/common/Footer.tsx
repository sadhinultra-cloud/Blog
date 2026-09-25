import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import {
  Feather,
  Send,
  CheckCircle,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Send as TelegramIcon,
  Rss,
  FileCode,
  Shield,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenFeeds: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenFeeds }) => {
  const { siteSettings, categories, subscribeNewsletter, customPages } = useBlog();
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribeNewsletter(email);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      setEmail('');
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const activeCategories = categories.filter(c => c.enabled).slice(0, 5);

  return (
    <footer
      id="main-footer"
      className="w-full text-white pt-16 pb-12 transition-colors border-t border-neutral-800"
      style={{
        backgroundColor: 'var(--footer-bg)',
      }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 'var(--container-max-width)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold">
                <Feather className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                {siteSettings.siteName}
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
              {siteSettings.footerText || siteSettings.description}
            </p>
            <div className="pt-2 flex items-center gap-3">
              {siteSettings.socialLinks.twitter && (
                <a
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks.github && (
                <a
                  href={siteSettings.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks.linkedin && (
                <a
                  href={siteSettings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks.youtube && (
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks.telegram && (
                <a
                  href={siteSettings.socialLinks.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-4">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              {activeCategories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', cat.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  View all disciplines →
                </button>
              </li>
            </ul>
          </div>

          {/* Editorial Pages */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-4">
              Publication
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Latest Dispatches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('page', 'about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About AL-IMRAN
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('page', 'projects')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Research & Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Editorial Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('page', 'privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-xs text-neutral-400"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('page', 'terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-xs text-neutral-400"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Subscribe & Feeds */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-4">
              Dispatch Dispatcher
            </h4>
            <p className="text-xs text-neutral-400 leading-normal">
              Receive curated long-form essays and architectural breakdowns every Sunday.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-white text-black rounded text-xs font-semibold flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  title="Subscribe"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {statusMsg && (
                <div
                  className={`text-[11px] p-1.5 rounded flex items-center gap-1.5 ${
                    statusMsg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300' : 'bg-rose-950/80 text-rose-300'
                  }`}
                >
                  <CheckCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{statusMsg.text}</span>
                </div>
              )}
            </form>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenFeeds}
                className="text-[11px] px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer border border-neutral-800"
                title="View Sitemap, RSS Feed & Structured Data"
              >
                <Rss className="w-3 h-3 text-amber-400" />
                <span>RSS & Sitemap</span>
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="text-[11px] px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer border border-neutral-800"
              >
                <Shield className="w-3 h-3 text-blue-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright and Bottom Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>{siteSettings.copyrightText}</p>
          <div className="flex items-center gap-4">
            <span>Clean Architecture</span>
            <span>•</span>
            <span>Zero Surveillance</span>
            <span>•</span>
            <span>Universal Typography</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
