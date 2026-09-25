import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { CustomPage } from '../../../types';
import { Plus, Edit2, Trash2, X, FileText, ExternalLink, Save } from 'lucide-react';

interface AdminPagesManagerProps {
  onViewPage: (slug: string) => void;
}

export const AdminPagesManager: React.FC<AdminPagesManagerProps> = ({ onViewPage }) => {
  const { customPages, updateCustomPage, createCustomPage, deleteCustomPage } = useBlog();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const startEdit = (page: CustomPage) => {
    setEditingId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setIsPublished(Boolean(page.isPublished ?? (page.status === 'published')));
    setIsCreating(false);
  };

  const startNew = () => {
    setIsCreating(true);
    setEditingId(null);
    setTitle('');
    setSlug('');
    setContent('# New Page\n\nWrite your page prose here in markdown...');
    setIsPublished(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
      content: content.trim(),
      status: (isPublished ? 'published' : 'draft') as 'published' | 'draft',
      isPublished,
      updatedAt: new Date().toISOString(),
    };

    if (isCreating) {
      createCustomPage(payload);
      setIsCreating(false);
    } else if (editingId) {
      updateCustomPage(editingId, payload);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string, pageTitle: string) => {
    if (window.confirm(`Delete page "${pageTitle}"?`)) {
      deleteCustomPage(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Custom Pages & Legal Policies
          </h2>
          <p className="text-xs text-neutral-500">
            Create and maintain static editorial pages like About, Projects, Privacy Policy, and Terms.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={startNew}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer shadow-sm"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Page</span>
          </button>
        )}
      </div>

      {/* Page Editor */}
      {(isCreating || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-2xl border space-y-4 animate-in fade-in"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {isCreating ? 'Create Custom Page' : 'Edit Custom Page'}
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
              <label className="text-xs font-semibold block mb-1">Page Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
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
              <label className="text-xs font-semibold block mb-1">URL Path Slug</label>
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
            <label className="text-xs font-semibold block mb-1">Page Prose Content (Markdown)</label>
            <textarea
              rows={12}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-3 text-xs font-mono rounded-lg border bg-transparent focus:outline-none leading-relaxed"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span style={{ color: 'var(--text-primary)' }}>Published & Publicly Accessible</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                }}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Page</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Pages List */}
      <div className="space-y-3">
        {customPages.map(page => (
          <div
            key={page.id}
            className="p-4 rounded-xl border flex items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {page.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                  <span>/{page.slug}</span>
                  <span>•</span>
                  <span>{(page.isPublished ?? (page.status === 'published')) ? 'Live' : 'Hidden'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewPage(page.slug)}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                title="View live page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => startEdit(page)}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-blue-600 dark:text-blue-400 transition-colors"
                title="Edit page"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(page.id, page.title)}
                className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 transition-colors"
                title="Delete page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
