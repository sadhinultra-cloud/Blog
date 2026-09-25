import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { Cpu, Code, Globe, ShieldCheck, BookOpen, Coffee, ArrowRight, Folder } from 'lucide-react';

interface CategoriesDirectoryViewProps {
  onNavigateCategory: (slug: string) => void;
  onSelectPost: (slug: string) => void;
}

export const CategoriesDirectoryView: React.FC<CategoriesDirectoryViewProps> = ({
  onNavigateCategory,
  onSelectPost,
}) => {
  const { categories, posts } = useBlog();

  const iconMap: Record<string, React.ElementType> = {
    Cpu,
    Code,
    Globe,
    ShieldCheck,
    BookOpen,
    Coffee,
  };

  const activeCategories = categories.filter(c => c.enabled);

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div
        className="py-14 px-4 sm:px-6 lg:px-8 border-b mb-12"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="mx-auto max-w-5xl space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            <Folder className="w-3.5 h-3.5" />
            <span>Taxonomy Directory</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
          >
            Disciplines & Categories
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Explore our index of technical writing, software architecture, and reflective essays arranged by field of inquiry.
          </p>
        </div>
      </div>

      {/* Categories Cards */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--container-max-width)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map(cat => {
            const Icon = (cat.icon && iconMap[cat.icon]) || BookOpen;
            const catPosts = posts.filter(p => p.categoryId === cat.id && p.status === 'published');

            return (
              <div
                key={cat.id}
                className="rounded-2xl border p-6 flex flex-col justify-between transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {catPosts.length} article{catPosts.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <h2
                    onClick={() => onNavigateCategory(cat.slug)}
                    className="text-xl font-bold tracking-tight mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {cat.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <div>
                  {/* Top 2 Recent Articles preview */}
                  {catPosts.length > 0 && (
                    <div className="border-t pt-4 mb-4 space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                        Recent In {cat.name}:
                      </span>
                      {catPosts.slice(0, 2).map(p => (
                        <div
                          key={p.id}
                          onClick={() => onSelectPost(p.slug)}
                          className="text-xs font-semibold line-clamp-1 hover:underline cursor-pointer"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          • {p.title}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onNavigateCategory(cat.slug)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span>Browse All {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
