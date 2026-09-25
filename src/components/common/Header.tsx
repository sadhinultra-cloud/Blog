import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  Feather,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onNavigate, currentView }) => {
  const {
    siteSettings,
    menuItems,
    currentThemeMode,
    toggleThemeMode,
    isAdminLoggedIn,
  } = useBlog();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (url: string, isExternal?: boolean) => {
    setMobileMenuOpen(false);
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (url === '/') {
      onNavigate('home');
    } else if (url === '/blog') {
      onNavigate('blog');
    } else if (url === '/categories') {
      onNavigate('categories');
    } else if (url === '/projects') {
      onNavigate('page', 'projects');
    } else if (url === '/about') {
      onNavigate('page', 'about');
    } else if (url === '/contact') {
      onNavigate('contact');
    } else if (url.startsWith('/category/')) {
      const slug = url.replace('/category/', '');
      onNavigate('category', slug);
    } else if (url.startsWith('/page/')) {
      const slug = url.replace('/page/', '');
      onNavigate('page', slug);
    } else {
      onNavigate('home');
    }
  };

  const activeMenuItems = menuItems.filter(m => m.enabled).sort((a, b) => a.order - b.order);

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled ? 'shadow-sm backdrop-blur-md bg-opacity-95' : ''
      }`}
      style={{
        backgroundColor: 'var(--header-bg)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
        style={{ maxWidth: 'var(--container-max-width)' }}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105"
              style={{
                backgroundColor: 'var(--btn-bg)',
                color: 'var(--btn-text)',
              }}
            >
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <span
                className="font-extrabold text-xl sm:text-2xl tracking-tight block"
                style={{ fontFamily: 'var(--heading-font)' }}
              >
                {siteSettings.siteName}
              </span>
              <span
                className="text-xs hidden sm:block tracking-wide font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {siteSettings.tagline}
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {activeMenuItems.map(item => {
            const isActive =
              (item.url === '/' && currentView === 'home') ||
              (item.url === '/blog' && currentView === 'blog') ||
              (item.url === '/categories' && currentView === 'categories') ||
              (item.url === '/contact' && currentView === 'contact');

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.url, item.isExternal)}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive ? 'font-semibold' : ''
                }`}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                }}
              >
                {item.label}
                {item.isExternal && <ExternalLink className="w-3.5 h-3.5 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Actions (Search, Theme, Admin Access) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instant Search Button */}
          <button
            id="search-trigger-btn"
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-2 rounded-lg text-sm flex items-center gap-2 border transition-colors cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Search articles (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-xs font-normal">Search...</span>
            <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Theme Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleThemeMode}
            className="p-2.5 rounded-lg border transition-all cursor-pointer hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            title={`Switch to ${currentThemeMode === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {currentThemeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Admin Dashboard Switcher */}
          <button
            id="admin-nav-btn"
            onClick={() => onNavigate(isAdminLoggedIn ? 'admin' : 'login')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg border cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden border-t px-5 py-4 space-y-3 transition-all"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            Navigation
          </div>
          <div className="flex flex-col space-y-1">
            {activeMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.url, item.isExternal)}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <span>{item.label}</span>
                {item.isExternal ? <ExternalLink className="w-4 h-4 opacity-50" /> : <BookOpen className="w-4 h-4 opacity-40" />}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(isAdminLoggedIn ? 'admin' : 'login');
              }}
              className="w-full py-2.5 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--btn-bg)',
                color: 'var(--btn-text)',
              }}
            >
              <Shield className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'Enter Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
