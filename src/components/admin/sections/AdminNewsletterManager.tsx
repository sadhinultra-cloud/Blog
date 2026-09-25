import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Mail, Download, Trash2, Plus, Users, CheckCircle } from 'lucide-react';

export const AdminNewsletterManager: React.FC = () => {
  const { newsletterSubscribers, subscribeNewsletter, deleteNewsletterSubscriber } = useBlog();
  const [newEmail, setNewEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const res = subscribeNewsletter(newEmail.trim());
    setMsg(res.message);
    setNewEmail('');
    setTimeout(() => setMsg(null), 3000);
  };

  const handleExportCSV = () => {
    const csvRows = [
      'Email,Status,SubscribedAt',
      ...newsletterSubscribers.map(
        s => `"${s.email}","${s.status}","${s.subscribedAt}"`
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Newsletter Audience & Dispatch List
          </h2>
          <p className="text-xs text-neutral-500">
            Direct syndicated readership. Export to Mailchimp, Substack, ConvertKit, or internal mailer.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer self-start"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Subscriber CSV</span>
        </button>
      </div>

      {/* Manual subscriber add form */}
      <form
        onSubmit={handleAdd}
        className="p-4 rounded-xl border flex items-center gap-3 max-w-md"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <Mail className="w-4 h-4 text-neutral-400" />
        <input
          type="email"
          placeholder="Add reader email address manually..."
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          required
          className="flex-1 text-xs bg-transparent focus:outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          Add
        </button>
      </form>

      {msg && (
        <p className="text-xs text-emerald-600 font-medium">{msg}</p>
      )}

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden shadow-xs"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <table className="w-full text-left text-xs">
          <thead
            className="border-b uppercase font-bold tracking-wider text-[10px] text-neutral-400"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <tr>
              <th className="p-3.5">Subscriber Email</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Subscribed Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {newsletterSubscribers.map(sub => (
              <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                <td className="p-3.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {sub.email}
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {sub.status}
                  </span>
                </td>
                <td className="p-3.5 text-neutral-400 font-mono">
                  {new Date(sub.subscribedAt).toLocaleDateString()}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => deleteNewsletterSubscriber(sub.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
                    title="Remove subscriber"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
