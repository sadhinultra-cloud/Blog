import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Mail, Send, CheckCircle, MapPin, MessageSquare, Clock, ArrowLeft } from 'lucide-react';

interface ContactPageViewProps {
  onBack: () => void;
}

export const ContactPageView: React.FC<ContactPageViewProps> = ({ onBack }) => {
  const { siteSettings, sendMessage } = useBlog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    sendMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || 'General Inquiry',
      message: message.trim(),
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div
        className="py-14 px-4 sm:px-6 lg:px-8 border-b mb-12"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-neutral-400 hover:text-black dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dispatches</span>
          </button>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}
          >
            Editorial Inquiries & Discourse
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Have a technical correction, research collaboration proposal, or keynote inquiry? Send a direct dispatch to our editorial desk.
          </p>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Info Column */}
        <div className="md:col-span-5 space-y-6">
          <div
            className="p-6 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Direct Correspondence
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We review every dispatch manually and prioritize communications with clear technical or architectural substance.
            </p>

            <div className="pt-2 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Email</span>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="font-medium hover:underline"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {siteSettings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Response Window</span>
                  <span className="font-medium text-neutral-500">Within 24-48 hours</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-medium text-neutral-500">Distributed • Global Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-7">
          <div
            className="p-6 sm:p-8 rounded-2xl border"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
            }}
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Dispatch Transmitted
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Your note has been securely delivered to the Editor-in-Chief inbox.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="elena@domain.com"
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Question regarding Zero-Trust edge cluster topology"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Elaborate on your thought or inquiry..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500 leading-relaxed"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    Encrypted submission stored in admin communications center.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-sm"
                    style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                  >
                    <span>Transmit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
