import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Search, TrendingUp, Sparkles, Send, CheckCircle, FolderOpen, ArrowRight } from 'lucide-react';

interface SidebarProps {
  onOpenSearch: () => void;
  onSelectPost: (slug: string) => void;
  onNavigateCategory: (slug: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSearch,
  onSelectPost,
  onNavigateCategory,
}) => {
  const { posts, categories, siteSettings, subscribeNewsletter } = useBlog();
  const { sidebar } = siteSettings;
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const published = posts.filter(p => p.status === 'published');

  // Most viewed posts
  const popularPosts = [...published]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 4);

  // Newest posts
  const recentPosts = [...published]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribeNewsletter(email);
    if (res.success) {
      setSubMsg({ type: 'success', text: res.message });
      setEmail('');
    } else {
      setSubMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setSubMsg(null), 4000);
  };

  return (
    <aside id="editorial-sidebar" className="w-full space-y-8">
      {/* 1. Instant Search Widget */}
      {sidebar.showSearch && (
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3
            className="text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Articles</span>
          </h3>
          <button
            onClick={onOpenSearch}
            className="w-full px-3.5 py-2.5 rounded-lg border text-xs text-left flex items-center justify-between transition-colors cursor-pointer group"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <span>Type to search...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded border bg-white dark:bg-black font-mono">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* 2. Categories with Count */}
      {sidebar.showCategories && (
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3
            className="text-xs uppercase font-bold tracking-wider mb-4 flex items-center gap-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Categories</span>
          </h3>
          <div className="space-y-1.5">
            {categories
              .filter(c => c.enabled)
              .map(cat => {
                const count = published.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onNavigateCategory(cat.slug)}
                    className="w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer group hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="group-hover:translate-x-0.5 transition-transform">{cat.name}</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* 3. Popular Posts */}
      {sidebar.showPopularPosts && (
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3
            className="text-xs uppercase font-bold tracking-wider mb-4 flex items-center gap-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>Popular Reads</span>
          </h3>
          <div className="space-y-4">
            {popularPosts.map((post, idx) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post.slug)}
                className="group flex gap-3 items-start cursor-pointer"
              >
                <span className="font-mono text-lg font-extrabold text-neutral-300 dark:text-neutral-700 w-5 flex-shrink-0 leading-none pt-1">
                  0{idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-xs sm:text-sm font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400 font-mono">
                    <span>{post.viewsCount || 0} views</span>
                    <span>•</span>
                    <span>{post.readingTimeMinutes}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Recent Posts */}
      {sidebar.showRecentPosts && (
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3
            className="text-xs uppercase font-bold tracking-wider mb-4 flex items-center gap-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Recent Dispatches</span>
          </h3>
          <div className="space-y-3.5">
            {recentPosts.map(post => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post.slug)}
                className="group flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-xs font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {post.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Newsletter Subscription Box */}
      {sidebar.showNewsletter && (
        <div
          className="p-6 rounded-xl border relative overflow-hidden"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3
            className="text-sm font-bold tracking-tight mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Stay Informed
          </h3>
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            Join 4,000+ engineers, designers, and thinkers receiving our Sunday digest.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-neutral-500"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--btn-bg)',
                color: 'var(--btn-text)',
              }}
            >
              <span>Subscribe</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
          {subMsg && (
            <p
              className={`mt-2 text-[11px] p-2 rounded flex items-center gap-1.5 ${
                subMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{subMsg.text}</span>
            </p>
          )}
        </div>
      )}
    </aside>
  );
};
