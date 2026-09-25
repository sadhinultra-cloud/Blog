import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

interface CustomPageViewProps {
  slug: string;
  onBack?: () => void;
  onNavigate?: (route: string) => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ slug, onBack, onNavigate }) => {
  const { customPages } = useBlog();
  const page = customPages.find(p => p.slug === slug);

  const handleReturn = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate('home');
  };

  if (!page) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-neutral-500">The requested page does not exist or has been moved.</p>
        <button
          onClick={handleReturn}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-neutral-900 text-white cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Render markdown into formatted paragraphs and headings
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) {
        return (
          <h1
            key={i}
            className="text-3xl sm:text-4xl font-extrabold mt-6 mb-4 tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--heading-font)' }}
          >
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3
            key={i}
            className="text-xl sm:text-2xl font-bold mt-8 mb-3 tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--heading-font)' }}
          >
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2
            key={i}
            className="text-2xl sm:text-3xl font-bold mt-8 mb-4 tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--heading-font)' }}
          >
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-5 list-disc text-base mb-1.5 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-8 border-neutral-300 dark:border-neutral-800" />;
      }
      if (!line.trim()) return null;

      return (
        <p key={i} className="text-base sm:text-lg mb-5 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div
        className="py-12 px-4 sm:px-6 lg:px-8 border-b mb-12"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="mx-auto max-w-4xl space-y-3">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
          >
            {page.title}
          </h1>
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last revised {new Date(page.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto px-4 sm:px-6 max-w-[820px] prose-editorial">
        {renderMarkdown(page.content)}
      </div>
    </div>
  );
};
