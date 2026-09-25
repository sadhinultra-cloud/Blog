import React, { useState, useMemo } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Post, PostStatus } from '../../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  CheckCircle,
  FileText,
  Clock,
} from 'lucide-react';

interface AdminPostsManagerProps {
  onNewPost: () => void;
  onEditPost: (postId: string) => void;
  onViewPost: (slug: string) => void;
}

export const AdminPostsManager: React.FC<AdminPostsManagerProps> = ({
  onNewPost,
  onEditPost,
  onViewPost,
}) => {
  const { posts, categories, authors, deletePost, duplicatePost, updatePost } = useBlog();
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filtered = useMemo(() => {
    return posts.filter(post => {
      const matchesQ =
        !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));

      const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
      const matchesCat = selectedCat === 'all' || post.categoryId === selectedCat;

      return matchesQ && matchesStatus && matchesCat;
    });
  }, [posts, query, selectedStatus, selectedCat]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      deletePost(id);
    }
  };

  const handleToggleStatus = (post: Post) => {
    const nextStatus: PostStatus = post.status === 'published' ? 'draft' : 'published';
    updatePost(post.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Article Management Desk
          </h2>
          <p className="text-xs text-neutral-500">
            Publish, edit, duplicate, and organize all editorial dispatches across categories.
          </p>
        </div>

        <button
          onClick={onNewPost}
          className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:opacity-90 shadow-sm self-start cursor-pointer"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div
        className="p-4 rounded-xl border flex flex-wrap items-center gap-3"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search dispatches by title or tag..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none cursor-pointer"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <option value="all" className="dark:bg-neutral-900">All Statuses</option>
          <option value="published" className="dark:bg-neutral-900">Published</option>
          <option value="draft" className="dark:bg-neutral-900">Draft</option>
          <option value="scheduled" className="dark:bg-neutral-900">Scheduled</option>
          <option value="archived" className="dark:bg-neutral-900">Archived</option>
        </select>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none cursor-pointer"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <option value="all" className="dark:bg-neutral-900">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id} className="dark:bg-neutral-900">
              {c.name}
            </option>
          ))}
        </select>

        <span className="text-xs font-mono text-neutral-400 ml-auto">
          {filtered.length} article{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Articles Table */}
      <div
        className="rounded-xl border overflow-hidden shadow-xs"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="border-b uppercase font-bold tracking-wider text-[10px] text-neutral-400"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <tr>
                <th className="p-3.5">Article Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Views</th>
                <th className="p-3.5">Published Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map(post => {
                  const cat = categories.find(c => c.id === post.categoryId);
                  const author = authors.find(a => a.id === post.authorId);

                  const statusColors: Record<PostStatus, string> = {
                    published: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                    draft: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                    scheduled: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
                    archived: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
                  };

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="p-3.5 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.featuredImage}
                            alt=""
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span
                              onClick={() => onEditPost(post.id)}
                              className="font-bold block truncate hover:underline cursor-pointer"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {post.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-400">
                              <span>/{post.slug}</span>
                              {post.language === 'bn' && (
                                <span className="font-bold text-neutral-500">বাংলা</span>
                              )}
                              {post.isFeatured && (
                                <span className="text-amber-500 font-bold">★ Hero</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {cat ? (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                          >
                            {cat.name}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-neutral-500">
                        {author ? author.name : 'Unknown'}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-opacity hover:opacity-80 ${statusColors[post.status]}`}
                          title="Click to toggle Draft / Published"
                        >
                          {post.status}
                        </button>
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-right font-mono font-medium text-neutral-500">
                        {post.viewsCount || 0}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-neutral-400 font-mono text-[11px]">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewPost(post.slug)}
                            className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                            title="View live article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicatePost(post.id)}
                            className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                            title="Duplicate post"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditPost(post.id)}
                            className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-blue-600 dark:text-blue-400 transition-colors"
                            title="Edit post"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 transition-colors"
                            title="Delete post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
