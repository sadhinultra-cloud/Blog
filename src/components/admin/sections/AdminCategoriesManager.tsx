import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Category } from '../../../types';
import { Plus, Edit2, Trash2, Check, X, FolderPlus, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminCategoriesManager: React.FC = () => {
  const { categories, posts, updateCategory, createCategory, deleteCategory } = useBlog();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [icon, setIcon] = useState('BookOpen');
  const [isCreating, setIsCreating] = useState(false);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setColor(cat.color);
    setIcon(cat.icon || 'BookOpen');
    setIsCreating(false);
  };

  const startNew = () => {
    setIsCreating(true);
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setColor('#059669');
    setIcon('Code');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreating) {
      createCategory({
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
        color,
        icon,
        enabled: true,
      });
      setIsCreating(false);
    } else if (editingId) {
      updateCategory(editingId, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        color,
        icon,
      });
      setEditingId(null);
    }
  };

  const handleDelete = (id: string, catName: string) => {
    const count = posts.filter(p => p.categoryId === id).length;
    if (count > 0) {
      if (!window.confirm(`Category "${catName}" has ${count} articles assigned. Are you sure you want to delete it?`)) {
        return;
      }
    }
    deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Category Taxonomy & Styling
          </h2>
          <p className="text-xs text-neutral-500">
            Define topics, badges, distinct brand colors, and discipline descriptions.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={startNew}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer shadow-sm"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Editor Modal or Inline Box */}
      {(isCreating || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-2xl border space-y-4 animate-in fade-in"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {isCreating ? 'Create New Category' : 'Edit Category'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (isCreating) {
                    setSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'));
                  }
                }}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent font-mono focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none leading-relaxed"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Accent Badge Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-28 px-2 py-1 text-xs font-mono rounded border bg-transparent"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Icon Identifier</label>
              <select
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="BookOpen" className="dark:bg-neutral-900">BookOpen (General)</option>
                <option value="Cpu" className="dark:bg-neutral-900">Cpu (Hardware / Systems)</option>
                <option value="Code" className="dark:bg-neutral-900">Code (Programming)</option>
                <option value="Globe" className="dark:bg-neutral-900">Globe (Web / Edge)</option>
                <option value="ShieldCheck" className="dark:bg-neutral-900">ShieldCheck (Security)</option>
                <option value="Coffee" className="dark:bg-neutral-900">Coffee (Philosophy / Life)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const count = posts.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="p-4 rounded-xl border flex items-center justify-between gap-4"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-xs flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name.slice(0, 1)}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">/{cat.slug}</span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                    {cat.description || 'No description provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {count} posts
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
