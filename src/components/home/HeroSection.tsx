import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { Clock, Calendar, ArrowRight, Eye, User } from 'lucide-react';

interface HeroSectionProps {
  onSelectPost: (slug: string) => void;
  onNavigateCategory: (slug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectPost, onNavigateCategory }) => {
  const { posts, categories, authors, siteSettings } = useBlog();
  const { heroConfig } = siteSettings;

  if (!heroConfig.enabled) return null;

  // Find selected hero post or fallback to first featured or first published
  const featuredPost =
    posts.find(p => p.id === heroConfig.selectedPostId && p.status === 'published') ||
    posts.find(p => p.isFeatured && p.status === 'published') ||
    posts.find(p => p.status === 'published');

  if (!featuredPost) return null;

  const category = categories.find(c => c.id === featuredPost.categoryId);
  const author = authors.find(a => a.id === featuredPost.authorId);

  // Height class mapping
  const heightClasses = {
    compact: 'min-h-[380px] sm:min-h-[420px]',
    medium: 'min-h-[460px] sm:min-h-[520px]',
    tall: 'min-h-[560px] sm:min-h-[640px]',
  }[heroConfig.height || 'medium'];

  // 1. Overlay Layout
  if (heroConfig.layout === 'overlay') {
    return (
      <section
        id="hero-section"
        className="w-full relative overflow-hidden rounded-2xl mb-12 sm:mb-16 border shadow-sm group cursor-pointer"
        style={{ borderColor: 'var(--border-color)' }}
        onClick={() => onSelectPost(featuredPost.slug)}
      >
        <div className={`relative w-full ${heightClasses} flex flex-col justify-end p-6 sm:p-10 lg:p-14`}>
          {/* Background Image with Zoom */}
          <img
            src={featuredPost.featuredImage}
            alt={featuredPost.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Gradient & Configurable Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
            style={{ opacity: Math.max(0.65, heroConfig.overlayOpacity || 0.7) }}
          />

          {/* Foreground Editorial Content */}
          <div className="relative z-10 max-w-3xl space-y-3.5 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {category && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onNavigateCategory(category.slug);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-sm"
                  style={{
                    backgroundColor: category.color || '#2563EB',
                    color: '#FFFFFF',
                  }}
                >
                  {category.name}
                </button>
              )}
              <span className="text-white/80 text-xs flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {featuredPost.readingTimeMinutes} min read
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {featuredPost.viewsCount || 0} views
              </span>
            </div>

            <h1
              className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md group-hover:text-neutral-100"
              style={{ fontFamily: 'var(--heading-font)' }}
            >
              {featuredPost.title}
            </h1>

            <p className="text-white/85 text-sm sm:text-base line-clamp-2 max-w-2xl leading-relaxed font-normal">
              {featuredPost.subtitle || featuredPost.excerpt}
            </p>

            {/* Author Meta & CTA Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/80"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-white">{author ? author.name : 'Editor'}</div>
                  <div className="text-xs text-white/70">
                    {new Date(featuredPost.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-xs font-bold tracking-wide shadow-lg group-hover:bg-neutral-100 transition-colors">
                <span>{heroConfig.buttonText || 'Read Article'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. Split Layout
  return (
    <section
      id="hero-section-split"
      className="w-full rounded-2xl overflow-hidden border mb-12 sm:mb-16 grid grid-cols-1 lg:grid-cols-12 group cursor-pointer transition-all"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
      }}
      onClick={() => onSelectPost(featuredPost.slug)}
    >
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-4">
        <div className="flex items-center gap-3">
          {category && (
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {featuredPost.readingTimeMinutes} min read
          </span>
        </div>

        <h1
          className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
        >
          {featuredPost.title}
        </h1>

        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {featuredPost.subtitle || featuredPost.excerpt}
        </p>

        <div className="pt-4 flex items-center justify-between gap-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            {author?.avatar && (
              <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {author?.name}
              </p>
              <p className="text-xs text-neutral-400">
                {new Date(featuredPost.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span
            className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <span>{heroConfig.buttonText || 'Read'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <div className="lg:col-span-5 relative overflow-hidden min-h-[260px] sm:min-h-[340px]">
        <img
          src={featuredPost.featuredImage}
          alt={featuredPost.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
    </section>
  );
};
