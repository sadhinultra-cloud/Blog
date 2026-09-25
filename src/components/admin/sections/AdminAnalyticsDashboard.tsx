import React from 'react';
import { useBlog } from '../../../context/BlogContext';
import {
  Eye,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  FolderOpen,
  Mail,
  Plus,
  Palette,
} from 'lucide-react';

interface AdminAnalyticsDashboardProps {
  onNewPost: () => void;
  onNavigateTab: (tab: string) => void;
  onEditPost: (postId: string) => void;
}

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({
  onNewPost,
  onNavigateTab,
  onEditPost,
}) => {
  const { posts, categories, comments, newsletterSubscribers, messages, siteSettings } = useBlog();

  const published = posts.filter(p => p.status === 'published');
  const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const pendingComments = comments.filter(c => c.status === 'pending');
  const unreadMessages = messages.filter(m => !m.read);

  // Top 5 viewed posts
  const topPosts = [...published]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5);

  // Mock traffic days for mini trend bars
  const trafficTrend = [
    { day: 'Mon', views: 820 },
    { day: 'Tue', views: 1140 },
    { day: 'Wed', views: 980 },
    { day: 'Thu', views: 1420 },
    { day: 'Fri', views: 1680 },
    { day: 'Sat', views: 1290 },
    { day: 'Sun', views: 1840 },
  ];
  const maxViews = Math.max(...trafficTrend.map(t => t.views));

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div
        className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Editorial Operations Hub
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {siteSettings.authorName}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Your publication currently holds {published.length} live dispatches reaching global audiences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('theme')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Theme</span>
          </button>
          <button
            onClick={onNewPost}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-90 shadow-sm cursor-pointer"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose Dispatch</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          className="p-5 rounded-2xl border space-y-2"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <Eye className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +18.4% this week
          </span>
        </div>

        <div
          className="p-5 rounded-2xl border space-y-2"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Live Dispatches</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {published.length}
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            {posts.length - published.length} drafts / queued
          </span>
        </div>

        <div
          className="p-5 rounded-2xl border space-y-2"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Subscribers</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {newsletterSubscribers.length.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Direct newsletter readers</span>
        </div>

        <div
          className="p-5 rounded-2xl border space-y-2"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Inquiries & Feedback</span>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {comments.length + messages.length}
          </div>
          <span className="text-[11px] text-rose-500 font-medium">
            {unreadMessages.length} unread message{unreadMessages.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Analytics Charts & Most Read Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Traffic Visualization */}
        <div
          className="lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                7-Day Readership Volume
              </h3>
              <span className="text-xs font-mono text-neutral-400">Active telemetry</span>
            </div>
            <p className="text-xs text-neutral-500 mb-6">
              Aggregated engagement across desktop, mobile, and syndicated RSS feed reader devices.
            </p>
          </div>

          {/* Bar chart representation */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
            {trafficTrend.map((item, i) => {
              const heightPct = Math.round((item.views / maxViews) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.views}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: i === trafficTrend.length - 1 ? 'var(--accent-primary)' : 'var(--border-color)',
                    }}
                  />
                  <span className="text-[10px] font-mono text-neutral-500">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Read Dispatches */}
        <div
          className="lg:col-span-5 p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Top Read Articles
            </h3>
            <button
              onClick={() => onNavigateTab('posts')}
              className="text-xs font-semibold text-neutral-400 hover:text-black dark:hover:text-white"
            >
              All Articles →
            </button>
          </div>

          <div className="space-y-3.5">
            {topPosts.map((post, idx) => (
              <div
                key={post.id}
                onClick={() => onEditPost(post.id)}
                className="p-2.5 rounded-xl border flex items-center justify-between gap-3 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer group"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-neutral-400 w-4">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4
                      className="text-xs font-semibold line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white dark:bg-black text-neutral-600 dark:text-neutral-300 flex-shrink-0">
                  {post.viewsCount || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Recent Reader Discourse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Taxonomy & Publication Distribution
          </h3>
          <div className="space-y-3">
            {categories.map(cat => {
              const count = published.filter(p => p.categoryId === cat.id).length;
              const pct = published.length ? Math.round((count / published.length) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-mono text-neutral-400">
                      {count} articles ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reader Comments Overview */}
        <div
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Recent Reader Comments
            </h3>
            <button
              onClick={() => onNavigateTab('comments')}
              className="text-xs font-semibold text-neutral-400 hover:text-black dark:hover:text-white"
            >
              Moderation Desk →
            </button>
          </div>

          <div className="space-y-3">
            {comments.slice(0, 3).map(c => {
              const targetPost = posts.find(p => p.id === c.postId);
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border text-xs space-y-1"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span style={{ color: 'var(--text-primary)' }}>{c.authorName}</span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-500 line-clamp-1 italic">"{c.content}"</p>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    On: {targetPost?.title || 'Unknown post'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
