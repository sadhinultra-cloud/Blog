import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { NavItem } from '../../../types';
import { Plus, ArrowUp, ArrowDown, Trash2, Edit2, X, Check, Navigation } from 'lucide-react';

export const AdminNavigationSettings: React.FC = () => {
  const { siteSettings, updateNavigation, updateHeaderConfig } = useBlog();
  const navigation: NavItem[] = siteSettings.navigation || [];
  const headerConfig = siteSettings.headerConfig || {
    isSticky: true,
    showSearch: true,
    showThemeToggle: true,
    showRssButton: true,
  };

  const [newLabel, setNewLabel] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newExternal, setNewExternal] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newPath.trim()) return;

    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      path: newPath.trim(),
      url: newPath.trim(),
      order: navigation.length + 1,
      isExternal: newExternal,
      enabled: true,
    };

    updateNavigation([...navigation, newItem]);
    setNewLabel('');
    setNewPath('');
    setNewExternal(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const items = [...navigation];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    const reordered = items.map((item, i) => ({ ...item, order: i + 1 }));
    updateNavigation(reordered);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    updateNavigation(navigation.map((n: NavItem) => (n.id === id ? { ...n, enabled } : n)));
  };

  const handleDelete = (id: string) => {
    updateNavigation(navigation.filter((n: NavItem) => n.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Header Navigation & Top Bar Controls
        </h2>
        <p className="text-xs text-neutral-500">
          Reorder links, add external documentation destinations, and configure header widgets.
        </p>
      </div>

      {/* Header Behavior Toggles */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Header Behavior & Action Buttons
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={headerConfig.isSticky}
              onChange={e => updateHeaderConfig({ isSticky: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Sticky Glass Header</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={headerConfig.showSearch}
              onChange={e => updateHeaderConfig({ showSearch: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Search Modal Trigger</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={headerConfig.showThemeToggle}
              onChange={e => updateHeaderConfig({ showThemeToggle: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>Theme Toggle Switch</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={headerConfig.showRssButton}
              onChange={e => updateHeaderConfig({ showRssButton: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>RSS Feeds Button</span>
          </label>
        </div>
      </div>

      {/* Navigation Links Manager */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-neutral-400" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Header Navigation Menu Items
          </h3>
        </div>

        <div className="space-y-2.5">
          {navigation.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-neutral-400 w-4">
                  0{idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                      {item.label}
                    </h4>
                    {item.isExternal && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-500 font-mono">
                        External
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">{item.path}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={e => handleToggle(item.id, e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-[11px]" style={{ color: 'var(--text-primary)' }}>
                    {item.enabled ? 'Visible' : 'Hidden'}
                  </span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 rounded border disabled:opacity-30 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === navigation.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 rounded border disabled:opacity-30 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add link form */}
        <form onSubmit={handleAdd} className="pt-4 border-t flex flex-wrap gap-2.5 items-center" style={{ borderColor: 'var(--border-color)' }}>
          <input
            type="text"
            placeholder="Label (e.g. Essays)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            required
            className="px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none w-36"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <input
            type="text"
            placeholder="Path (e.g. /category/philosophy)"
            value={newPath}
            onChange={e => setNewPath(e.target.value)}
            required
            className="flex-1 min-w-[180px] px-3 py-1.5 text-xs rounded-lg border bg-transparent font-mono focus:outline-none"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={newExternal}
              onChange={e => setNewExternal(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text-primary)' }}>External Tab</span>
          </label>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            Add Menu Item
          </button>
        </form>
      </div>
    </div>
  );
};
