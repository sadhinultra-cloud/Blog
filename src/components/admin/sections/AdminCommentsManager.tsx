import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Check, X, ShieldAlert, Trash2, MessageSquare, Reply, ExternalLink } from 'lucide-react';

export const AdminCommentsManager: React.FC = () => {
  const { comments, posts, updateCommentStatus, deleteComment, addComment } = useBlog();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = comments.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const handleSendReply = (postId: string, parentId: string) => {
    if (!replyText.trim()) return;
    addComment({
      postId,
      authorName: 'Editor-in-Chief',
      authorEmail: 'editor@al-imran.me',
      content: replyText.trim(),
      parentId,
    });
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Reader Discourse Moderation Desk
          </h2>
          <p className="text-xs text-neutral-500">
            Review, approve, reply to, and protect your dispatches against automated spam.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex rounded-xl border overflow-hidden text-xs self-start" style={{ borderColor: 'var(--border-color)' }}>
          {(['all', 'pending', 'approved', 'spam'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 font-semibold capitalize transition-colors ${
                filter === tab ? 'bg-neutral-200 dark:bg-neutral-800 font-bold' : ''
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              {tab} ({comments.filter(c => tab === 'all' || c.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center border rounded-xl" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs text-neutral-500">No reader comments under this status filter.</p>
          </div>
        ) : (
          filtered.map(comment => {
            const targetPost = posts.find(p => p.id === comment.postId);

            return (
              <div
                key={comment.id}
                className="p-5 rounded-xl border space-y-3"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        ({comment.authorEmail})
                      </span>
                      {comment.authorWebsite && (
                        <a
                          href={comment.authorWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] underline text-blue-500"
                        >
                          website
                        </a>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      On article: <strong>{targetPost?.title || 'Unknown post'}</strong> •{' '}
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      comment.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : comment.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {comment.content}
                </p>

                {/* Moderation Actions Bar */}
                <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-black dark:hover:text-white font-semibold cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{replyingToId === comment.id ? 'Cancel Reply' : 'Editorial Reply'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => updateCommentStatus(comment.id, 'approved')}
                        className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {comment.status !== 'spam' && (
                      <button
                        onClick={() => updateCommentStatus(comment.id, 'spam')}
                        className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Mark Spam</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Reply Form */}
                {replyingToId === comment.id && (
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write an official editorial reply..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                    <button
                      onClick={() => handleSendReply(comment.postId, comment.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                    >
                      Post Reply
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
