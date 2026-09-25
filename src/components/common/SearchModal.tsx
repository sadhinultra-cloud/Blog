import React, { useState, useMemo, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Search, X, Calendar, Clock, ArrowRight, BookOpen, Tag as TagIcon } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectPost }) => {
  const { posts, categories, tags, authors } = useBlog();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (post.status !== 'published') return false;

      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.subtitle && post.subtitle.toLowerCase().includes(q)) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'all' || post.categoryId === selectedCategory;
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      const matchesAuthor = selectedAuthor === 'all' || post.authorId === selectedAuthor;

      return matchesQuery && matchesCat && matchesTag && matchesAuthor;
    });
  }, [posts, query, selectedCategory, selectedTag, selectedAuthor]);

  if (!isOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="search-modal-dialog"
        className="w-full max-w-3xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[80vh] transition-transform animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <Search className="w-5 h-5 opacity-50 flex-shrink-0" />
          <input
            id="search-modal-input"
            type="text"
            placeholder="Search dispatches, tutorials, Bangla articles, concepts, tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base focus:outline-none placeholder:text-neutral-400 font-medium"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>

        {/* Filters Bar */}
        <div
          className="p-3 border-b flex flex-wrap items-center gap-2 text-xs"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">Filter by:</span>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded border bg-transparent font-medium focus:outline-none cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="all" className="dark:bg-neutral-900">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id} className="dark:bg-neutral-900">
                {c.name}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="px-2.5 py-1 rounded border bg-transparent font-medium focus:outline-none cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="all" className="dark:bg-neutral-900">All Tags</option>
            {tags.map(t => (
              <option key={t.id} value={t.name} className="dark:bg-neutral-900">
                #{t.name}
              </option>
            ))}
          </select>

          {/* Author Filter */}
          <select
            value={selectedAuthor}
            onChange={e => setSelectedAuthor(e.target.value)}
            className="px-2.5 py-1 rounded border bg-transparent font-medium focus:outline-none cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="all" className="dark:bg-neutral-900">All Authors</option>
            {authors.map(a => (
              <option key={a.id} value={a.id} className="dark:bg-neutral-900">
                {a.name}
              </option>
            ))}
          </select>

          <span className="ml-auto text-[11px] text-neutral-500 font-mono">
            {filteredPosts.length} result{filteredPosts.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto opacity-30" />
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                No articles matched your criteria
              </p>
              <p className="text-xs text-neutral-500">
                Try broadening your keyword or clearing selected category and tag filters.
              </p>
            </div>
          ) : (
            filteredPosts.map(post => {
              const cat = categories.find(c => c.id === post.categoryId);
              const author = authors.find(a => a.id === post.authorId);

              return (
                <div
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post.slug);
                    onClose();
                  }}
                  className="p-3.5 rounded-lg border hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer flex gap-4 items-start group"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-20 h-20 rounded object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {cat && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{
                            backgroundColor: `${cat.color}15`,
                            color: cat.color,
                          }}
                        >
                          {cat.name}
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTimeMinutes} min read
                      </span>
                    </div>

                    <h4
                      className="font-bold text-sm sm:text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {post.title}
                    </h4>

                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-400">
                      <span>By {author ? author.name : 'Staff'}</span>
                      <span>•</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all self-center" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
