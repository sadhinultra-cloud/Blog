import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Rss,
  Languages,
  ExternalLink,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Crown,
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
  onOpenSearch: () => void;
  onOpenFeeds: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentRoute,
  onOpenSearch,
  onOpenFeeds,
  onOpenAuthModal,
}) => {
  const {
    siteSettings,
    themeMode,
    setThemeMode,
    language,
    setLanguage,
    isAdminLoggedIn,
  } = useBlog();
  const { currentUser, userProfile, isAdmin, isEditor, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = siteSettings?.navigation || [];
  const headerConfig = siteSettings?.headerConfig || {
    isSticky: true,
    showSearch: true,
    showThemeToggle: true,
    showRssButton: true,
  };
  const logoText = siteSettings?.logoText || 'AL-IMRAN';
  const siteTitle = siteSettings?.siteTitle || 'AL-IMRAN';
  const enableLanguageToggle = siteSettings?.enableLanguageToggle ?? true;

  const cycleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  const activeNav = (path: string = '/') => {
    if (path === '/' && currentRoute === 'home') return true;
    if (path === '/categories' && currentRoute === 'categories') return true;
    if (path === '/contact' && currentRoute === 'contact') return true;
    if (currentRoute === path.replace('/', '')) return true;
    return false;
  };

  return (
    <header
      className={`w-full z-40 transition-all ${
        headerConfig.isSticky ? 'sticky top-0 backdrop-blur-md' : 'relative'
      }`}
      style={{
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo / Brand Name */}
        <div className="flex items-center gap-6">
          <a
            href="#home"
            onClick={e => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              {logoText.slice(0, 1) || 'A'}
            </span>
            <div className="flex flex-col">
              <span
                className="font-bold text-lg sm:text-xl tracking-tight leading-none"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                {logoText}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase mt-0.5">
                Editorial
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 ml-4">
            {navigation
              .filter(item => item.enabled)
              .sort((a, b) => a.order - b.order)
              .map(item => {
                const itemPath = item.path || item.url || '/';
                const isActive = activeNav(itemPath);

                if (item.isExternal) {
                  return (
                    <a
                      key={item.id}
                      href={itemPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (itemPath === '/') onNavigate('home');
                      else onNavigate(itemPath.replace('/', ''));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-bold'
                        : 'text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                    }`}
                    style={{
                      color: isActive ? 'var(--text-primary)' : undefined,
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Right Action Icons (Search, Theme, Language, Admin Login) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Trigger */}
          {headerConfig.showSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
              title="Search articles (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                ⌘K
              </span>
            </button>
          )}

          {/* RSS Feed Trigger */}
          {headerConfig.showRssButton && (
            <button
              onClick={onOpenFeeds}
              className="p-2 rounded-xl text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:flex cursor-pointer"
              title="RSS / Sitemap Feeds"
            >
              <Rss className="w-4 h-4" />
            </button>
          )}

          {/* Language Toggle */}
          {enableLanguageToggle && (
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
              title="Switch language between English and Bangla"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="font-mono uppercase">{language === 'en' ? 'BN' : 'EN'}</span>
            </button>
          )}

          {/* Theme Toggle */}
          {headerConfig.showThemeToggle && (
            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title={`Color Mode: ${themeMode}`}
            >
              {themeMode === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : themeMode === 'dark' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : (
                <Monitor className="w-4 h-4 text-purple-400" />
              )}
            </button>
          )}

          {/* Firebase User Profile / Login */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border text-xs font-semibold hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
              >
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
                    style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                  >
                    {(userProfile?.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[90px] truncate hidden sm:inline" style={{ color: 'var(--text-primary)' }}>
                  {userProfile?.displayName || currentUser.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border p-3 shadow-xl space-y-2.5 z-50 animate-in fade-in zoom-in-95"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="border-b pb-2 space-y-1" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="font-bold text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                      {userProfile?.displayName || 'User Profile'}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate">
                      {currentUser.email}
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {userProfile?.role ? userProfile.role.replace('_', ' ') : 'Reader'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>সাইন আউট (Log Out)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal?.()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-neutral-600 dark:text-neutral-300 shadow-xs"
              style={{ borderColor: 'var(--border-color)' }}
              title="Sign in with Google or Email"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>সাইন ইন</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t p-5 space-y-4 animate-in slide-in-from-top-2"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="space-y-1">
            {navigation
              .filter(item => item.enabled)
              .sort((a, b) => a.order - b.order)
              .map(item => {
                const itemPath = item.path || item.url || '/';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (itemPath === '/') onNavigate('home');
                      else onNavigate(itemPath.replace('/', ''));
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono text-neutral-400">/{itemPath.replace('/', '')}</span>
                  </button>
                );
              })}
          </div>

          <div
            className="pt-4 border-t flex items-center justify-between"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="p-2 rounded-lg border text-neutral-500 text-xs font-semibold flex items-center gap-1.5"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFeeds();
                }}
                className="p-2 rounded-lg border text-neutral-500 text-xs font-semibold flex items-center gap-1.5"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Rss className="w-3.5 h-3.5" />
                <span>Feeds</span>
              </button>
            </div>

            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 border border-rose-200 dark:border-rose-900"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal?.();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
              >
                <User className="w-3.5 h-3.5" />
                <span>সাইন ইন</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
