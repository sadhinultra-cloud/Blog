import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import {
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Rss,
  ArrowUp,
  Mail,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenFeeds: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenFeeds }) => {
  const { siteSettings, categories, subscribeNewsletter } = useBlog();
  const footerConfig = siteSettings?.footerConfig || {
    copyrightText: siteSettings?.copyrightText || '© 2026 AL-IMRAN. All rights reserved.',
    description: siteSettings?.description || 'A dedicated digital journal and laboratory exploring distributed systems, modern web engineering, programming languages, and computational architecture.',
  };
  const socialLinks = siteSettings?.socialLinks || {};
  const logoText = siteSettings?.logoText || 'AL-IMRAN';
  const siteTitle = siteSettings?.siteTitle || 'AL-IMRAN';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeNewsletter(email.trim());
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="w-full border-t transition-colors mt-20"
      style={{
        backgroundColor: 'var(--footer-bg)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
              >
                {logoText.slice(0, 1) || 'A'}
              </span>
              <span
                className="font-bold text-lg tracking-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                {siteTitle}
              </span>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              {footerConfig.description ||
                'A dedicated digital journal and laboratory exploring distributed systems, modern web engineering, programming languages, and computational architecture.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg border text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg border text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                  aria-label="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg border text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg border text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  style={{ borderColor: 'var(--border-color)' }}
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={onOpenFeeds}
                className="p-2 rounded-lg border text-neutral-400 hover:text-amber-500 transition-colors cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
                title="RSS Feed & XML Sitemap"
              >
                <Rss className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider text-neutral-400"
            >
              Editorial Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  Home Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  Category Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  About the Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  Open Source Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div className="space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider text-neutral-400"
            >
              Curated Topics
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`category/${cat.slug}`)}
                    className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider text-neutral-400"
            >
              Direct Syndication
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Receive deep technical essays and architecture reviews directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="reader@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border bg-transparent focus:outline-none"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: 'var(--btn-bg)',
                  color: 'var(--btn-text)',
                }}
              >
                {subscribed ? 'Subscribed!' : 'Join Dispatch'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex flex-wrap items-center gap-3 text-center sm:text-left">
            <span>{footerConfig.copyrightText}</span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => onNavigate('privacy-policy')}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => onNavigate('terms-of-service')}
              className="hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={onOpenFeeds}
              className="hover:underline cursor-pointer text-amber-500 font-mono"
            >
              Sitemap & RSS
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-neutral-400">
              High-Velocity Static Architecture
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
              title="Return to top of page"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
