import React from 'react';
import { useBlog } from '../../../context/BlogContext';
import { ThemeConfig } from '../../../types';
import { DEFAULT_THEME_SETTINGS } from '../../../data/defaultData';
import { Palette, Sun, Moon, Monitor, Check, RotateCcw, Sparkles } from 'lucide-react';

export const AdminThemeSettings: React.FC = () => {
  const { siteSettings, updateThemeConfig, setThemeMode, resetToDefaultDemoData } = useBlog();
  const themeConfig: ThemeConfig = siteSettings.themeConfig || DEFAULT_THEME_SETTINGS;

  // Curated theme presets
  const presets = [
    {
      name: 'Minimal Monochrome',
      desc: 'High-contrast black & white editorial journal',
      light: {
        bgPrimary: '#FAFAFA',
        bgSecondary: '#F4F4F5',
        cardBg: '#FFFFFF',
        textPrimary: '#09090B',
        textSecondary: '#52525B',
        accentPrimary: '#18181B',
        borderColor: '#E4E4E7',
        btnBg: '#18181B',
        btnText: '#FAFAFA',
        linkColor: '#18181B',
        headerBg: 'rgba(250, 250, 250, 0.85)',
        footerBg: '#F4F4F5',
      },
      dark: {
        bgPrimary: '#09090B',
        bgSecondary: '#121215',
        cardBg: '#18181B',
        textPrimary: '#FAFAFA',
        textSecondary: '#A1A1AA',
        accentPrimary: '#FAFAFA',
        borderColor: '#27272A',
        btnBg: '#FAFAFA',
        btnText: '#09090B',
        linkColor: '#38BDF8',
        headerBg: 'rgba(9, 9, 11, 0.85)',
        footerBg: '#121215',
      },
    },
    {
      name: 'Warm Sepia Editorial',
      desc: 'Vintage print paper with warm walnut tones',
      light: {
        bgPrimary: '#FAF7F2',
        bgSecondary: '#F2EDE4',
        cardBg: '#FFFFFF',
        textPrimary: '#2D251E',
        textSecondary: '#6B5E51',
        accentPrimary: '#B45309',
        borderColor: '#E6DDD0',
        btnBg: '#2D251E',
        btnText: '#FAF7F2',
        linkColor: '#B45309',
        headerBg: 'rgba(250, 247, 242, 0.85)',
        footerBg: '#F2EDE4',
      },
      dark: {
        bgPrimary: '#1C1917',
        bgSecondary: '#292524',
        cardBg: '#262220',
        textPrimary: '#F5F5F4',
        textSecondary: '#A8A29E',
        accentPrimary: '#F59E0B',
        borderColor: '#44403C',
        btnBg: '#F5F5F4',
        btnText: '#1C1917',
        linkColor: '#FBBF24',
        headerBg: 'rgba(28, 25, 23, 0.85)',
        footerBg: '#292524',
      },
    },
    {
      name: 'Midnight Tech',
      desc: 'Deep slate blue aesthetic for engineering platforms',
      light: {
        bgPrimary: '#F8FAFC',
        bgSecondary: '#F1F5F9',
        cardBg: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        accentPrimary: '#2563EB',
        borderColor: '#E2E8F0',
        btnBg: '#0F172A',
        btnText: '#FFFFFF',
        linkColor: '#2563EB',
        headerBg: 'rgba(248, 250, 252, 0.85)',
        footerBg: '#F1F5F9',
      },
      dark: {
        bgPrimary: '#0B0F19',
        bgSecondary: '#111827',
        cardBg: '#151E33',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        accentPrimary: '#38BDF8',
        borderColor: '#1E293B',
        btnBg: '#38BDF8',
        btnText: '#0B0F19',
        linkColor: '#38BDF8',
        headerBg: 'rgba(11, 15, 25, 0.85)',
        footerBg: '#111827',
      },
    },
    {
      name: 'Emerald Botanical',
      desc: 'Earthy forest tones with organic greens',
      light: {
        bgPrimary: '#F7FAF7',
        bgSecondary: '#ECF3EC',
        cardBg: '#FFFFFF',
        textPrimary: '#1A2E1A',
        textSecondary: '#4A634A',
        accentPrimary: '#059669',
        borderColor: '#D8E5D8',
        btnBg: '#1A2E1A',
        btnText: '#FFFFFF',
        linkColor: '#059669',
        headerBg: 'rgba(247, 250, 247, 0.85)',
        footerBg: '#ECF3EC',
      },
      dark: {
        bgPrimary: '#0A120A',
        bgSecondary: '#132113',
        cardBg: '#182A18',
        textPrimary: '#F0FDF4',
        textSecondary: '#86EFAC',
        accentPrimary: '#10B981',
        borderColor: '#243A24',
        btnBg: '#10B981',
        btnText: '#0A120A',
        linkColor: '#34D399',
        headerBg: 'rgba(10, 18, 10, 0.85)',
        footerBg: '#132113',
      },
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    updateThemeConfig({
      light: { ...themeConfig.light, ...preset.light },
      dark: { ...themeConfig.dark, ...preset.dark },
    });
  };

  const handleLightColorChange = (key: keyof ThemeConfig['light'], val: string) => {
    updateThemeConfig({
      light: {
        ...themeConfig.light,
        [key]: val,
      },
    });
  };

  const handleDarkColorChange = (key: keyof ThemeConfig['dark'], val: string) => {
    updateThemeConfig({
      dark: {
        ...themeConfig.dark,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Design System & Dynamic Theme Engine
        </h2>
        <p className="text-xs text-neutral-500">
          Calibrate color palettes, responsive typography scales, container metrics, and border radii.
        </p>
      </div>

      {/* Mode Selector */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Default Color Mode
        </h3>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => setThemeMode('light')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              themeConfig.mode === 'light' ? 'ring-2 ring-blue-500 font-bold' : ''
            }`}
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs">Light Mode</span>
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              themeConfig.mode === 'dark' ? 'ring-2 ring-blue-500 font-bold' : ''
            }`}
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Moon className="w-5 h-5 text-sky-400" />
            <span className="text-xs">Dark Mode</span>
          </button>
          <button
            onClick={() => setThemeMode('system')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              themeConfig.mode === 'system' ? 'ring-2 ring-blue-500 font-bold' : ''
            }`}
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Monitor className="w-5 h-5 text-purple-400" />
            <span className="text-xs">System Auto</span>
          </button>
        </div>
      </div>

      {/* 1-Click Curated Presets */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            1-Click Editorial Presets
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          Apply master-crafted palettes balancing contrast, optical legibility, and editorial warmth.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map(p => (
            <div
              key={p.name}
              onClick={() => applyPreset(p)}
              className="p-4 rounded-xl border hover:border-neutral-500 transition-all cursor-pointer flex flex-col justify-between group"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-1">
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.light.bgPrimary }} />
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.light.accentPrimary }} />
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.dark.bgPrimary }} />
                  </div>
                  <h4 className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </h4>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">{p.desc}</p>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mt-3 block group-hover:underline">
                Apply Palette →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography & Container Metrics */}
      <div
        className="p-6 rounded-2xl border space-y-5"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Typography Pairing & Structural Scale
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Headings Display Font
            </label>
            <select
              value={themeConfig.typography.headingFont}
              onChange={e =>
                updateThemeConfig({
                  typography: { ...themeConfig.typography, headingFont: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="'Playfair Display', Georgia, serif" className="dark:bg-neutral-900">
                Playfair Display (Editorial Serif)
              </option>
              <option value="'Plus Jakarta Sans', sans-serif" className="dark:bg-neutral-900">
                Plus Jakarta Sans (Modern Display)
              </option>
              <option value="'Inter', sans-serif" className="dark:bg-neutral-900">
                Inter (Clean Technical)
              </option>
              <option value="system-ui, sans-serif" className="dark:bg-neutral-900">
                System UI Native
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Body Text Font
            </label>
            <select
              value={themeConfig.typography.bodyFont}
              onChange={e =>
                updateThemeConfig({
                  typography: { ...themeConfig.typography, bodyFont: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="'Inter', sans-serif" className="dark:bg-neutral-900">Inter</option>
              <option value="'Plus Jakarta Sans', sans-serif" className="dark:bg-neutral-900">
                Plus Jakarta Sans
              </option>
              <option value="Georgia, serif" className="dark:bg-neutral-900">Georgia (Serif)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Bangla Language Font
            </label>
            <select
              value={themeConfig.typography.banglaFont}
              onChange={e =>
                updateThemeConfig({
                  typography: { ...themeConfig.typography, banglaFont: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="'Hind Siliguri', sans-serif" className="dark:bg-neutral-900">
                Hind Siliguri (Recommended)
              </option>
              <option value="'Noto Sans Bengali', sans-serif" className="dark:bg-neutral-900">
                Noto Sans Bengali
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Corner Radius
            </label>
            <select
              value={themeConfig.borderRadius}
              onChange={e => updateThemeConfig({ borderRadius: e.target.value as any })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="none" className="dark:bg-neutral-900">None (0px - Brutalist)</option>
              <option value="subtle" className="dark:bg-neutral-900">Subtle (6px)</option>
              <option value="rounded" className="dark:bg-neutral-900">Rounded (12px)</option>
              <option value="generous" className="dark:bg-neutral-900">Generous (18px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Color Pickers Matrix (Light & Dark) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Light Theme Palette */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Light Mode Palette Matrix
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Background Primary', key: 'bgPrimary' },
              { label: 'Background Secondary', key: 'bgSecondary' },
              { label: 'Card Surface', key: 'cardBg' },
              { label: 'Border Color', key: 'borderColor' },
              { label: 'Primary Text', key: 'textPrimary' },
              { label: 'Secondary Text', key: 'textSecondary' },
              { label: 'Accent / Brand', key: 'accentPrimary' },
              { label: 'Button Background', key: 'btnBg' },
              { label: 'Button Text', key: 'btnText' },
              { label: 'Link Color', key: 'linkColor' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(themeConfig.light as any)[item.key]}
                    onChange={e => handleLightColorChange(item.key as any, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={(themeConfig.light as any)[item.key]}
                    onChange={e => handleLightColorChange(item.key as any, e.target.value)}
                    className="w-24 px-2 py-1 text-xs font-mono rounded border bg-transparent"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Theme Palette */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Dark Mode Palette Matrix
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Background Primary', key: 'bgPrimary' },
              { label: 'Background Secondary', key: 'bgSecondary' },
              { label: 'Card Surface', key: 'cardBg' },
              { label: 'Border Color', key: 'borderColor' },
              { label: 'Primary Text', key: 'textPrimary' },
              { label: 'Secondary Text', key: 'textSecondary' },
              { label: 'Accent / Brand', key: 'accentPrimary' },
              { label: 'Button Background', key: 'btnBg' },
              { label: 'Button Text', key: 'btnText' },
              { label: 'Link Color', key: 'linkColor' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(themeConfig.dark as any)[item.key]}
                    onChange={e => handleDarkColorChange(item.key as any, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={(themeConfig.dark as any)[item.key]}
                    onChange={e => handleDarkColorChange(item.key as any, e.target.value)}
                    className="w-24 px-2 py-1 text-xs font-mono rounded border bg-transparent"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
