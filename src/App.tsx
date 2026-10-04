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

import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/common/AuthModal';

// Modals
import { SearchModal } from './components/common/SearchModal';
import { FeedsViewerModal } from './components/common/FeedsViewerModal';
import { AdSlot } from './components/ads/AdSlot';

// Admin
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { ArrowLeft } from 'lucide-react';

const parseRouteFromLocation = (): string => {
  if (typeof window === 'undefined') return 'home';

  // 1. Check pathname (e.g. /admin, /admin/)
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
  if (pathname === 'admin' || pathname.startsWith('admin/')) {
    return 'admin';
  }

  // 2. Check hash (e.g. #admin, #/admin)
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash === 'admin' || hash.startsWith('admin/')) {
    return 'admin';
  }

  if (hash) return hash;
  if (pathname && pathname !== 'index.html') return pathname;
  return 'home';
};

const BlogAppContent: React.FC = () => {
  const { siteSettings, customPages, isAdminLoggedIn } = useBlog();
  const { isAdmin } = useAuth();

  // Navigation state: 'home', 'article/slug', 'category/slug', 'categories', 'contact', 'admin', or custom page slug
  const [route, setRoute] = useState<string>(() => parseRouteFromLocation());

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFeedsOpen, setIsFeedsOpen] = useState(false);

  // Sync route with URL bar
  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    if (newRoute === 'home') {
      window.history.pushState(null, '', '/');
    } else if (newRoute === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else {
      window.location.hash = newRoute;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseRouteFromLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
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
      if (!isAdminLoggedIn && !isAdmin) {
        return (
          <AdminLoginPage
            onLoginSuccess={() => setRoute('admin')}
            onBackToSite={() => navigateTo('home')}
          />
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
          onOpenFeeds={() => setIsFeedsOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
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
    <AuthProvider>
      <BlogProvider>
        <BlogAppContent />
      </BlogProvider>
    </AuthProvider>
  );
}
