import React from 'react';
import { useBlog } from '../../../context/BlogContext';
import { ArrowUp, ArrowDown, Eye, Check, Sliders, Layout, Layers } from 'lucide-react';

export const AdminHomepageBuilder: React.FC = () => {
  const { siteSettings, updateHeroConfig, updateBlogConfig, updateHomepageSections, posts } = useBlog();
  const { heroConfig, blogConfig } = siteSettings;
  const homepageSections = siteSettings.homepageSections || [];

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...homepageSections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    // reassign orders
    const updated = newSections.map((sec, i) => ({ ...sec, order: i + 1 }));
    updateHomepageSections(updated);
  };

  const handleToggleSection = (id: string, enabled: boolean) => {
    const updated = homepageSections.map(s => (s.id === id ? { ...s, enabled } : s));
    updateHomepageSections(updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Modular Homepage Section Builder
        </h2>
        <p className="text-xs text-neutral-500">
          Reorder sections, toggle components, adjust editorial hero height, and calibrate magazine density.
        </p>
      </div>

      {/* 1. Section Sequence & Visibility */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neutral-400" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Homepage Layout Architecture & Sequence
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          Use the Up/Down controls to rearrange sections and toggle visibility for visitors.
        </p>

        <div className="space-y-2.5 pt-2">
          {homepageSections.map((section, idx) => (
            <div
              key={section.id}
              className="p-3.5 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-neutral-400 w-4">
                  0{idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    {section.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    ID: {section.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={e => handleToggleSection(section.id, e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-[11px]" style={{ color: 'var(--text-primary)' }}>
                    {section.enabled ? 'Enabled' : 'Hidden'}
                  </span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveSection(idx, 'up')}
                    className="p-1 rounded border disabled:opacity-30 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === homepageSections.length - 1}
                    onClick={() => handleMoveSection(idx, 'down')}
                    className="p-1 rounded border disabled:opacity-30 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Editorial Hero Configuration */}
      <div
        className="p-6 rounded-2xl border space-y-5"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-neutral-400" />
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Hero Showcase Configuration
            </h3>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={heroConfig.enabled}
              onChange={e => updateHeroConfig({ enabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Hero Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Hero Architectural Style
            </label>
            <select
              value={heroConfig.layout}
              onChange={e => updateHeroConfig({ layout: e.target.value as any })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="overlay" className="dark:bg-neutral-900">Magazine Overlay (Immersive)</option>
              <option value="split" className="dark:bg-neutral-900">Split Editorial (Text + Photo)</option>
              <option value="minimal" className="dark:bg-neutral-900">Minimal Clean</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Vertical Height Scale
            </label>
            <select
              value={heroConfig.height}
              onChange={e => updateHeroConfig({ height: e.target.value as any })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="compact" className="dark:bg-neutral-900">Compact (380px)</option>
              <option value="medium" className="dark:bg-neutral-900">Medium (480px)</option>
              <option value="tall" className="dark:bg-neutral-900">Tall Magazine (580px)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Selected Highlight Article
            </label>
            <select
              value={heroConfig.selectedPostId || ''}
              onChange={e => updateHeroConfig({ selectedPostId: e.target.value || undefined })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="" className="dark:bg-neutral-900">Auto (First Featured Dispatch)</option>
              {posts.map(p => (
                <option key={p.id} value={p.id} className="dark:bg-neutral-900">
                  {p.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              CTA Button Label
            </label>
            <input
              type="text"
              value={heroConfig.buttonText}
              onChange={e => updateHeroConfig({ buttonText: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              <span>Overlay Darkening</span>
              <span className="font-mono">{Math.round((heroConfig.overlayOpacity || 0.7) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={0.95}
              step={0.05}
              value={heroConfig.overlayOpacity}
              onChange={e => updateHeroConfig({ overlayOpacity: Number(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid & Density Settings */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neutral-400" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Article Grid Presentation & Metadata Display
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Desktop Grid Columns
            </label>
            <select
              value={blogConfig.gridColumns}
              onChange={e => updateBlogConfig({ gridColumns: Number(e.target.value) as any })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value={1} className="dark:bg-neutral-900">1 Column (Editorial Stream)</option>
              <option value={2} className="dark:bg-neutral-900">2 Columns (Spacious)</option>
              <option value={3} className="dark:bg-neutral-900">3 Columns (Standard Magazine)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Posts Per Page
            </label>
            <input
              type="number"
              min={3}
              max={24}
              value={blogConfig.postsPerPage}
              onChange={e => updateBlogConfig({ postsPerPage: Number(e.target.value) })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Card Style Theme
            </label>
            <select
              value={blogConfig.cardStyle}
              onChange={e => updateBlogConfig({ cardStyle: e.target.value as any })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="editorial" className="dark:bg-neutral-900">Editorial Card</option>
              <option value="bordered" className="dark:bg-neutral-900">Bordered Minimal</option>
              <option value="minimal" className="dark:bg-neutral-900">Flat Minimal</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={blogConfig.showCategoryBadge}
              onChange={e => updateBlogConfig({ showCategoryBadge: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Category Badges</span>
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={blogConfig.showAuthor}
              onChange={e => updateBlogConfig({ showAuthor: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Author Avatars</span>
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={blogConfig.showDate}
              onChange={e => updateBlogConfig({ showDate: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Publish Date</span>
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={blogConfig.showReadingTime}
              onChange={e => updateBlogConfig({ showReadingTime: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Reading Time</span>
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={blogConfig.showViewCount}
              onChange={e => updateBlogConfig({ showViewCount: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>View Count</span>
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={blogConfig.showExcerpt}
              onChange={e => updateBlogConfig({ showExcerpt: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Article Excerpt</span>
          </label>
        </div>
      </div>
    </div>
  );
};
