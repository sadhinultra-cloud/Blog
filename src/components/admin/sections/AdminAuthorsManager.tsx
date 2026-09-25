import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Author } from '../../../types';
import { Plus, Edit2, Trash2, X, ExternalLink, User } from 'lucide-react';

export const AdminAuthorsManager: React.FC = () => {
  const { authors, posts, updateAuthor, createAuthor, deleteAuthor } = useBlog();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff Contributor');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const startEdit = (author: Author) => {
    setEditingId(author.id);
    setName(author.name);
    setRole(author.role);
    setBio(author.bio);
    setAvatar(author.avatar);
    setEmail(author.email);
    setWebsite(author.website || '');
    setTwitter(author.socialLinks?.twitter || '');
    setGithub(author.socialLinks?.github || '');
    setLinkedin(author.socialLinks?.linkedin || '');
    setIsCreating(false);
  };

  const startNew = () => {
    setIsCreating(true);
    setEditingId(null);
    setName('');
    setRole('Guest Columnist');
    setBio('');
    setAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80');
    setEmail('');
    setWebsite('');
    setTwitter('');
    setGithub('');
    setLinkedin('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `author-${Date.now()}`,
      role: role.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
      email: email.trim(),
      website: website.trim() || undefined,
      socialLinks: {
        twitter: twitter.trim() || undefined,
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
      },
    };

    if (isCreating) {
      createAuthor(payload);
      setIsCreating(false);
    } else if (editingId) {
      updateAuthor(editingId, payload);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string, authorName: string) => {
    if (authors.length <= 1) {
      alert('You cannot delete the only remaining author.');
      return;
    }
    if (window.confirm(`Delete author "${authorName}"? Any posts under them will remain in the database.`)) {
      deleteAuthor(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Editorial Writers & Authors
          </h2>
          <p className="text-xs text-neutral-500">
            Manage writer personas, editorial credentials, avatars, and social portfolios.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={startNew}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer shadow-sm"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Author</span>
          </button>
        )}
      </div>

      {/* Editor Form */}
      {(isCreating || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-2xl border space-y-4 animate-in fade-in"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {isCreating ? 'Create Author Profile' : 'Edit Author Profile'}
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
              <label className="text-xs font-semibold block mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Editorial Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Lead Systems Architect"
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Avatar Photo URL</label>
              <input
                type="url"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Author Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Short professional biography..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none leading-relaxed"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold block mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-2.5 py-1 text-xs rounded border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold block mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={twitter}
                onChange={e => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-2.5 py-1 text-xs rounded border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold block mb-1">GitHub URL</label>
              <input
                type="url"
                value={github}
                onChange={e => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-2.5 py-1 text-xs rounded border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              Save Author
            </button>
          </div>
        </form>
      )}

      {/* Authors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {authors.map(author => {
          const count = posts.filter(p => p.authorId === author.id).length;

          return (
            <div
              key={author.id}
              className="p-5 rounded-xl border flex items-start gap-4"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-14 h-14 rounded-full object-cover border flex-shrink-0"
                style={{ borderColor: 'var(--border-color)' }}
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {author.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(author)}
                      className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white"
                      title="Edit author"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(author.id, author.name)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-600"
                      title="Delete author"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <span className="text-xs text-neutral-400 font-medium block">
                  {author.role} • {count} published dispatch{count === 1 ? '' : 'es'}
                </span>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {author.bio}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
