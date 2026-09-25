import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Plus, Tag as TagIcon, Trash2, Edit2, Check } from 'lucide-react';

export const AdminTagsManager: React.FC = () => {
  const { tags, posts, createTag, deleteTag } = useBlog();
  const [newTagName, setNewTagName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    createTag(newTagName.trim());
    setNewTagName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Keyword & Tag Index
          </h2>
          <p className="text-xs text-neutral-500">
            Categorical keyword labels attached to articles for indexing and discovery.
          </p>
        </div>
      </div>

      {/* Add tag input form */}
      <form
        onSubmit={handleCreate}
        className="p-4 rounded-xl border flex items-center gap-3 max-w-md"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <TagIcon className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="New tag label (e.g. Distributed, React, AI)..."
          value={newTagName}
          onChange={e => setNewTagName(e.target.value)}
          className="flex-1 text-xs bg-transparent focus:outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          Add Tag
        </button>
      </form>

      {/* Tags Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tags.map(tag => {
          const count = posts.filter(p => p.tags.includes(tag.name)).length;

          return (
            <div
              key={tag.id}
              className="p-3 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="min-w-0">
                <span className="font-mono text-xs font-semibold block truncate" style={{ color: 'var(--text-primary)' }}>
                  #{tag.name}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {count} article{count === 1 ? '' : 's'}
                </span>
              </div>

              <button
                onClick={() => deleteTag(tag.id)}
                className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-neutral-400 hover:text-rose-600 transition-colors"
                title="Delete tag"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
