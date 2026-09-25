import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Mail, Trash2, CheckCircle2, Clock, MailOpen, Reply, AlertCircle } from 'lucide-react';

export const AdminMessagesInbox: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useBlog();
  const [selectedId, setSelectedId] = useState<string | null>(messages[0]?.id || null);

  const selectedMsg = messages.find(m => m.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Editorial Desk Communications & Inquiries
        </h2>
        <p className="text-xs text-neutral-500">
          Messages received from readers, research collaborators, and partners via the contact form.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[480px]">
        {/* Messages List Column */}
        <div
          className="md:col-span-5 rounded-2xl border overflow-hidden flex flex-col"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="p-3.5 border-b flex items-center justify-between text-xs font-semibold" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <span>Inquiries ({messages.length})</span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {messages.filter(m => !m.read).length} unread
            </span>
          </div>

          <div className="divide-y overflow-y-auto flex-1 max-h-[500px]" style={{ borderColor: 'var(--border-color)' }}>
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                Inbox is clear. No active communications.
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedId(msg.id);
                    if (!msg.read) markMessageRead(msg.id, true);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    selectedId === msg.id ? 'bg-neutral-100 dark:bg-neutral-800/70' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold truncate ${!msg.read ? 'text-blue-600 dark:text-blue-400' : ''}`} style={{ color: !msg.read ? undefined : 'var(--text-primary)' }}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h5 className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {msg.subject}
                  </h5>

                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Message Detail Column */}
        <div
          className="md:col-span-7 rounded-2xl border p-6 flex flex-col justify-between"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          {selectedMsg ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedMsg.subject}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                    <span>From: <strong>{selectedMsg.name}</strong> ({selectedMsg.email})</span>
                    <span>•</span>
                    <span>{new Date(selectedMsg.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markMessageRead(selectedMsg.id, !selectedMsg.read)}
                    className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 text-xs font-medium"
                    title={selectedMsg.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {selectedMsg.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      deleteMessage(selectedMsg.id);
                      setSelectedId(null);
                    }}
                    className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-neutral-400 hover:text-rose-600"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                <p className="whitespace-pre-wrap">{selectedMsg.message}</p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center py-16 space-y-2 text-neutral-400">
              <Mail className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs font-semibold">Select an inquiry from the left to read full dispatch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
