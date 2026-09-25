import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { LatestArticlesGrid } from '../home/LatestArticlesGrid';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface CategoryPageViewProps {
  slug: string;
  onBack: () => void;
  onSelectPost: (slug: string) => void;
  onNavigateCategory: (slug: string) => void;
}

export const CategoryPageView: React.FC<CategoryPageViewProps> = ({
  slug,
  onBack,
  onSelectPost,
  onNavigateCategory,
}) => {
  const { categories, posts } = useBlog();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <button onClick={onBack} className="px-4 py-2 rounded-lg text-sm font-semibold bg-neutral-900 text-white">
          Return to Home
        </button>
      </div>
    );
  }

  const categoryPosts = posts.filter(p => p.categoryId === category.id && p.status === 'published');

  return (
    <div className="w-full pb-20">
      {/* Category Header */}
      <div
        className="py-12 px-4 sm:px-6 lg:px-8 border-b mb-10"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="mx-auto max-w-5xl space-y-3">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </button>

          <div className="flex items-center gap-3 pt-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
              Discipline Showcase
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
          >
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl leading-relaxed">
            {category.description}
          </p>

          <div className="text-xs text-neutral-400 font-mono pt-1">
            {categoryPosts.length} published dispatch{categoryPosts.length === 1 ? '' : 'es'}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--container-max-width)' }}>
        {categoryPosts.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <BookOpen className="w-8 h-8 mx-auto opacity-30" />
            <p className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
              No articles published in this category yet.
            </p>
            <p className="text-xs text-neutral-500">Check back soon for new dispatches.</p>
          </div>
        ) : (
          <LatestArticlesGrid
            onSelectPost={onSelectPost}
            onNavigateCategory={onNavigateCategory}
            customTitle={`All ${category.name} Dispatches`}
          />
        )}
      </div>
    </div>
  );
};
