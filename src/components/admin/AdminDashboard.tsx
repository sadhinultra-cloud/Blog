import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import {
  BarChart3,
  FileText,
  FolderTree,
  Tag as TagIcon,
  Users,
  FileCode,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Inbox,
  Layout,
  Palette,
  Navigation,
  PanelBottom,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';

import { AdminAnalyticsDashboard } from './sections/AdminAnalyticsDashboard';
import { AdminPostsManager } from './sections/AdminPostsManager';
import { PostEditor } from './PostEditor';
import { AdminCategoriesManager } from './sections/AdminCategoriesManager';
import { AdminTagsManager } from './sections/AdminTagsManager';
import { AdminAuthorsManager } from './sections/AdminAuthorsManager';
import { AdminPagesManager } from './sections/AdminPagesManager';
import { AdminMediaLibrary } from './sections/AdminMediaLibrary';
import { AdminCommentsManager } from './sections/AdminCommentsManager';
import { AdminNewsletterManager } from './sections/AdminNewsletterManager';
import { AdminMessagesInbox } from './sections/AdminMessagesInbox';
import { AdminHomepageBuilder } from './sections/AdminHomepageBuilder';
import { AdminThemeSettings } from './sections/AdminThemeSettings';
import { AdminNavigationSettings } from './sections/AdminNavigationSettings';
import { AdminFooterSettings } from './sections/AdminFooterSettings';
import { AdminSeoSettings } from './sections/AdminSeoSettings';
import { AdminSiteSettings } from './sections/AdminSiteSettings';
import { AdminAdsManager } from './sections/AdminAdsManager';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onViewPost: (slug: string) => void;
  onViewPage: (slug: string) => void;
  onOpenFeeds: () => void;
}

export type AdminTab =
  | 'analytics'
  | 'posts'
  | 'post-editor'
  | 'categories'
  | 'tags'
  | 'authors'
  | 'pages'
  | 'media'
  | 'comments'
  | 'newsletter'
  | 'messages'
  | 'homepage'
  | 'theme'
  | 'navigation'
  | 'footer'
  | 'seo'
  | 'settings'
  | 'ads';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  onViewPost,
  onViewPage,
  onOpenFeeds,
}) => {
  const {
    siteSettings,
    comments,
    messages,
    themeMode,
    setThemeMode,
    adminLogout,
  } = useBlog();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingCommentsCount = comments.filter(c => c.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  const handleNewPost = () => {
    setEditingPostId(null);
    setActiveTab('post-editor');
  };

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    setActiveTab('post-editor');
  };

  const handleCloseEditor = () => {
    setEditingPostId(null);
    setActiveTab('posts');
  };

  const navGroups = [
    {
      label: 'Editorial Insights',
      items: [
        { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
      ],
    },
    {
      label: 'Content & Publishing',
      items: [
        { id: 'posts', label: 'Articles & Dispatches', icon: FileText },
        { id: 'categories', label: 'Categories', icon: FolderTree },
        { id: 'tags', label: 'Tags & Taxonomy', icon: TagIcon },
        { id: 'authors', label: 'Editorial Writers', icon: Users },
        { id: 'pages', label: 'Custom Pages', icon: FileCode },
        { id: 'media', label: 'Media Library', icon: ImageIcon },
      ],
    },
    {
      label: 'Reader Engagement',
      items: [
        {
          id: 'comments',
          label: 'Comments Desk',
          icon: MessageSquare,
          badge: pendingCommentsCount > 0 ? pendingCommentsCount : undefined,
        },
        { id: 'newsletter', label: 'Audience & Newsletter', icon: Mail },
        {
          id: 'messages',
          label: 'Direct Inquiries',
          icon: Inbox,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
        },
      ],
    },
    {
      label: 'Appearance & Design',
      items: [
        { id: 'homepage', label: 'Homepage Builder', icon: Layout },
        { id: 'theme', label: 'Color System & Fonts', icon: Palette },
        { id: 'navigation', label: 'Header Navigation', icon: Navigation },
        { id: 'footer', label: 'Footer & Socials', icon: PanelBottom },
      ],
    },
    {
      label: 'Infrastructure',
      items: [
        { id: 'ads', label: 'Ad & Google Ads', icon: DollarSign },
        { id: 'seo', label: 'SEO & Syndication', icon: Search },
        { id: 'settings', label: 'Site Settings & Backups', icon: Settings },
      ],
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row transition-colors"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Top Mobile Bar */}
      <div
        className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 z-40 backdrop-blur-md"
        style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg border text-neutral-500"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm tracking-tight">Admin Console</span>
        </div>

        <button
          onClick={onBackToSite}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 text-neutral-500"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 border-r flex flex-col justify-between flex-shrink-0 z-30 transition-all ${
          mobileSidebarOpen
            ? 'fixed inset-y-0 left-0 bg-white dark:bg-neutral-950 shadow-2xl'
            : 'hidden md:flex'
        }`}
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Brand header */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Editorial Control Desk
              </span>
              <h1 className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {siteSettings.siteTitle}
              </h1>
            </div>
            {mobileSidebarOpen && (
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleNewPost}
              className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-90 shadow-xs cursor-pointer"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Compose Article</span>
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-5 overflow-y-auto flex-1">
          {navGroups.map(group => (
            <div key={group.label} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {group.label}
              </span>
              <div className="space-y-0.5 pt-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminTab);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-neutral-100 dark:bg-neutral-800/80 font-bold'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50 text-neutral-500'
                      }`}
                      style={{
                        color: isActive ? 'var(--text-primary)' : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-neutral-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer profile & return to site */}
        <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToSite}
              className="text-xs font-semibold flex items-center gap-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </button>

            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg border text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
              title="Toggle Theme"
            >
              {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div
            className="p-2.5 rounded-xl border flex items-center justify-between"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                AI
              </span>
              <div className="min-w-0">
                <span className="text-[11px] font-bold block truncate" style={{ color: 'var(--text-primary)' }}>
                  Al-Imran
                </span>
                <span className="text-[9px] text-neutral-400 font-mono block">
                  Editor-in-Chief
                </span>
              </div>
            </div>

            <button
              onClick={adminLogout}
              className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full overflow-x-hidden">
        {activeTab === 'analytics' && (
          <AdminAnalyticsDashboard
            onNewPost={handleNewPost}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onEditPost={handleEditPost}
          />
        )}

        {activeTab === 'posts' && (
          <AdminPostsManager
            onNewPost={handleNewPost}
            onEditPost={handleEditPost}
            onViewPost={onViewPost}
          />
        )}

        {activeTab === 'post-editor' && (
          <PostEditor
            postId={editingPostId || undefined}
            onClose={handleCloseEditor}
          />
        )}

        {activeTab === 'categories' && <AdminCategoriesManager />}
        {activeTab === 'tags' && <AdminTagsManager />}
        {activeTab === 'authors' && <AdminAuthorsManager />}
        {activeTab === 'pages' && <AdminPagesManager onViewPage={onViewPage} />}
        {activeTab === 'media' && <AdminMediaLibrary />}
        {activeTab === 'comments' && <AdminCommentsManager />}
        {activeTab === 'newsletter' && <AdminNewsletterManager />}
        {activeTab === 'messages' && <AdminMessagesInbox />}
        {activeTab === 'homepage' && <AdminHomepageBuilder />}
        {activeTab === 'theme' && <AdminThemeSettings />}
        {activeTab === 'navigation' && <AdminNavigationSettings />}
        {activeTab === 'footer' && <AdminFooterSettings />}
        {activeTab === 'seo' && <AdminSeoSettings onOpenFeeds={onOpenFeeds} />}
        {activeTab === 'ads' && <AdminAdsManager />}
        {activeTab === 'settings' && <AdminSiteSettings />}
      </main>
    </div>
  );
};
