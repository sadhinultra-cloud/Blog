import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Post } from '../../types';
import { Clock, Eye, Calendar, User, ArrowUpRight } from 'lucide-react';

interface LatestArticlesGridProps {
  onSelectPost: (slug: string) => void;
  onNavigateCategory: (slug: string) => void;
  limit?: number;
  excludePostId?: string;
  customTitle?: string;
}

export const LatestArticlesGrid: React.FC<LatestArticlesGridProps> = ({
  onSelectPost,
  onNavigateCategory,
  limit,
  excludePostId,
  customTitle,
}) => {
  const { posts, categories, authors, siteSettings } = useBlog();
  const { blogConfig } = siteSettings;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter published posts
  const publishedPosts = posts.filter(p => p.status === 'published' && p.id !== excludePostId);

  const postsPerPage = limit || blogConfig.postsPerPage || 6;
  const totalPages = Math.ceil(publishedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const displayedPosts = publishedPosts.slice(startIndex, startIndex + postsPerPage);

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[blogConfig.gridColumns || 3];

  return (
    <section id="latest-posts-section" className="w-full mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
          >
            {customTitle || 'Latest Dispatches'}
          </h2>
          <p className="text-xs sm:text-sm mt-0.5 text-neutral-500">
            Carefully curated analyses, tutorials, and philosophical inquiries.
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          Showing {displayedPosts.length} of {publishedPosts.length}
        </span>
      </div>

      {/* Article Grid */}
      <div className={`grid ${gridColsClass} gap-7`}>
        {displayedPosts.map(post => {
          const cat = categories.find(c => c.id === post.categoryId);
          const author = authors.find(a => a.id === post.authorId);

          return (
            <article
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="group flex flex-col rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Category Badge */}
                {blogConfig.showCategoryBadge && cat && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onNavigateCategory(cat.slug);
                    }}
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.name}
                  </button>
                )}

                {post.language === 'bn' && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                    বাংলা
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2.5">
                  {blogConfig.showDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 opacity-60" />
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {blogConfig.showReadingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      {post.readingTimeMinutes} min
                    </span>
                  )}
                  {blogConfig.showViewCount && (
                    <span className="flex items-center gap-1 ml-auto">
                      <Eye className="w-3.5 h-3.5 opacity-60" />
                      {post.viewsCount || 0}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  className={`text-lg sm:text-xl font-bold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 ${
                    post.language === 'bn' ? 'font-serif' : ''
                  }`}
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--heading-font)',
                  }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p
                  className="text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 flex-1"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--body-font)',
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Author Footer */}
                <div
                  className="pt-4 mt-auto border-t flex items-center justify-between"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {blogConfig.showAuthor && (
                    <div className="flex items-center gap-2.5">
                      {author?.avatar ? (
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {author ? author.name : 'Staff Writer'}
                      </span>
                    </div>
                  )}

                  <span className="text-xs font-semibold flex items-center gap-0.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform text-neutral-400 group-hover:text-black dark:group-hover:text-white">
                    <span>Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && !limit && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3.5 py-1.5 rounded border text-xs font-medium disabled:opacity-30 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded text-xs font-semibold transition-colors cursor-pointer ${
                currentPage === i + 1 ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: currentPage === i + 1 ? 'var(--btn-bg)' : 'var(--bg-secondary)',
                color: currentPage === i + 1 ? 'var(--btn-text)' : 'var(--text-primary)',
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3.5 py-1.5 rounded border text-xs font-medium disabled:opacity-30 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};
