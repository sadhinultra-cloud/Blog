import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { Cpu, Code, Globe, ShieldCheck, BookOpen, Coffee, ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onNavigateCategory: (slug: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onNavigateCategory }) => {
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
    <section id="category-showcase-section" className="w-full mb-16">
      <div className="flex items-center justify-between mb-8 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
          >
            Explore by Discipline
          </h2>
          <p className="text-xs sm:text-sm mt-0.5 text-neutral-500">
            Categorized technical treatises, tutorials, and lifestyle essays.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {activeCategories.map(cat => {
          const Icon = (cat.icon && iconMap[cat.icon]) || BookOpen;
          const count = posts.filter(p => p.categoryId === cat.id && p.status === 'published').length;

          return (
            <div
              key={cat.id}
              onClick={() => onNavigateCategory(cat.slug)}
              className="p-5 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <h3
                  className="font-bold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {cat.name}
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
                  {count} article{count === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
