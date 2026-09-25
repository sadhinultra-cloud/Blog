import React, { useState, useEffect } from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Public Views
import { HeroSection } from './components/home/HeroSection';
import { LatestArticlesGrid } from './components/home/LatestArticlesGrid';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { NewsletterSection } from './components/home/NewsletterSection';
import { ArticleView } from './components/article/ArticleView';
import { CategoryPageView } from './components/pages/CategoryPageView';
import { CategoriesDirectoryView } from './components/pages/CategoriesDirectoryView';
import { ContactPageView } from './components/pages/ContactPageView';
import { CustomPageView } from './components/pages/CustomPageView';

// Modals
import { SearchModal } from './components/common/SearchModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { FeedsViewerModal } from './components/common/FeedsViewerModal';
import { AdSlot } from './components/ads/AdSlot';

// Admin
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';

const BlogAppContent: React.FC = () => {
  const { siteSettings, customPages, isAdminLoggedIn } = useBlog();

  // Navigation state: 'home', 'article/slug', 'category/slug', 'categories', 'contact', 'admin', or custom page slug
  const [route, setRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'home';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isFeedsOpen, setIsFeedsOpen] = useState(false);

  // Sync hash with route
  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    window.location.hash = newRoute === 'home' ? '' : newRoute;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      setRoute(hash || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global keydown for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if current route is an article or category
  const isArticleRoute = route.startsWith('article/');
  const articleSlug = isArticleRoute ? route.replace('article/', '') : null;

  const isCategoryRoute = route.startsWith('category/');
  const categorySlug = isCategoryRoute ? route.replace('category/', '') : null;

  const isAdminRoute = route === 'admin';

  // Render the appropriate public view or admin
  const renderMainView = () => {
    if (isAdminRoute) {
      if (!isAdminLoggedIn) {
        return (
          <div className="min-h-[70vh] flex items-center justify-center p-6">
            <div
              className="max-w-md w-full p-8 rounded-2xl border text-center space-y-4 shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Editorial Admin Console
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Authentication required. Enter your editorial passcode to manage dispatches, taxonomies, and design configurations.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigateTo('home')}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return Home</span>
                </button>
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <AdminDashboard
          onBackToSite={() => navigateTo('home')}
          onViewPost={slug => navigateTo(`article/${slug}`)}
          onViewPage={slug => navigateTo(slug)}
          onOpenFeeds={() => setIsFeedsOpen(true)}
        />
      );
    }

    if (route === 'home') {
      // Dynamic Homepage Sections based on siteSettings.homepageSections
      const sections = siteSettings.homepageSections || [];
      const enabledSections = [...sections]
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

      return (
        <div className="space-y-12 sm:space-y-16">
          {enabledSections.map(sec => {
            if (sec.type === 'hero') {
              return (
                <React.Fragment key={sec.id}>
                  <HeroSection
                    onSelectPost={(slug: string) => navigateTo(`article/${slug}`)}
                    onNavigateCategory={(slug: string) => navigateTo(`category/${slug}`)}
                  />
                  <AdSlot slot="homepage_feed" />
                </React.Fragment>
              );
            }
            if (sec.type === 'latest') {
              return (
                <LatestArticlesGrid
                  key={sec.id}
                  onSelectPost={(slug: string) => navigateTo(`article/${slug}`)}
                  onNavigateCategory={(slug: string) => navigateTo(`category/${slug}`)}
                />
              );
            }
            if (sec.type === 'categories') {
              return (
                <CategoryShowcase
                  key={sec.id}
                  onNavigateCategory={(slug: string) => navigateTo(`category/${slug}`)}
                />
              );
            }
            if (sec.type === 'newsletter') {
              return <NewsletterSection key={sec.id} />;
            }
            return null;
          })}
        </div>
      );
    }

    if (isArticleRoute && articleSlug) {
      return (
        <ArticleView
          slug={articleSlug}
          onBack={() => navigateTo('home')}
          onSelectPost={(slug: string) => navigateTo(`article/${slug}`)}
          onNavigateCategory={(slug: string) => navigateTo(`category/${slug}`)}
        />
      );
    }

    if (isCategoryRoute && categorySlug) {
      return (
        <CategoryPageView
          slug={categorySlug}
          onBack={() => navigateTo('categories')}
          onSelectPost={(slug: string) => navigateTo(`article/${slug}`)}
          onNavigateCategory={(slug: string) => navigateTo(`category/${slug}`)}
        />
      );
    }

    if (route === 'categories') {
      return (
        <CategoriesDirectoryView
          onNavigateCategory={(slug: string) => navigateTo(`category/${slug}`)}
          onSelectPost={(slug: string) => navigateTo(`article/${slug}`)}
        />
      );
    }

    if (route === 'contact') {
      return <ContactPageView onBack={() => navigateTo('home')} />;
    }

    // Check if matching custom page
    const matchingPage = customPages.find(p => p.slug === route);
    if (matchingPage) {
      return <CustomPageView slug={route} onNavigate={r => navigateTo(r)} />;
    }

    // 404 Fallback
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-4">
        <span className="font-mono text-4xl font-bold tracking-tight text-neutral-400">404</span>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Editorial Dispatch Not Found
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          The requested page or publication entry does not exist or may have been archived.
        </p>
        <div className="pt-4">
          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Editorial Index</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Header (hidden in active Admin Dashboard view) */}
      {!isAdminRoute && (
        <Header
          onNavigate={navigateTo}
          currentRoute={route}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          onOpenFeeds={() => setIsFeedsOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {!isAdminRoute && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSlot slot="header_top" />
          </div>
        )}
        {renderMainView()}
        {!isAdminRoute && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSlot slot="footer_above" />
          </div>
        )}
      </main>

      {/* Footer (hidden in active Admin Dashboard view) */}
      {!isAdminRoute && (
        <Footer
          onNavigate={navigateTo}
          onOpenFeeds={() => setIsFeedsOpen(true)}
        />
      )}

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPost={slug => {
          setIsSearchOpen(false);
          navigateTo(`article/${slug}`);
        }}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          navigateTo('admin');
        }}
      />

      <FeedsViewerModal
        isOpen={isFeedsOpen}
        onClose={() => setIsFeedsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BlogProvider>
      <BlogAppContent />
    </BlogProvider>
  );
}
