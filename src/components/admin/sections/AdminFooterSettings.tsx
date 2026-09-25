import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Save, Twitter, Github, Linkedin, Youtube, Instagram, Facebook, Rss } from 'lucide-react';

export const AdminFooterSettings: React.FC = () => {
  const { siteSettings, updateFooterConfig, updateSocialLinks, updateSiteSettings } = useBlog();
  const { footerConfig, socialLinks } = siteSettings;

  const [copyrightText, setCopyrightText] = useState(footerConfig?.copyrightText || siteSettings.copyrightText || '© 2026 AL-IMRAN. All rights reserved.');
  const [description, setDescription] = useState(footerConfig?.description || siteSettings.description || '');

  const [twitter, setTwitter] = useState(socialLinks.twitter || '');
  const [github, setGithub] = useState(socialLinks.github || '');
  const [linkedin, setLinkedin] = useState(socialLinks.linkedin || '');
  const [youtube, setYoutube] = useState(socialLinks.youtube || '');
  const [instagram, setInstagram] = useState(socialLinks.instagram || '');
  const [facebook, setFacebook] = useState(socialLinks.facebook || '');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterConfig({
      copyrightText,
      description,
    });
    updateSocialLinks({
      twitter: twitter || undefined,
      github: github || undefined,
      linkedin: linkedin || undefined,
      youtube: youtube || undefined,
      instagram: instagram || undefined,
      facebook: facebook || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Footer Architecture & Social Media Channels
          </h2>
          <p className="text-xs text-neutral-500">
            Define legal copyright attributions, footer description, and social profile URLs.
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-90 shadow-sm cursor-pointer"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saved ? 'Saved Successfully!' : 'Save Footer Settings'}</span>
        </button>
      </div>

      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Footer Copy & Attribution
        </h3>

        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
            Legal Copyright Text
          </label>
          <input
            type="text"
            value={copyrightText}
            onChange={e => setCopyrightText(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
            Footer Mission Statement / Tagline
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none leading-relaxed"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Social Profile Destination URLs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-primary)' }}>
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>X (formerly Twitter)</span>
            </label>
            <input
              type="url"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
              placeholder="https://x.com/username"
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-primary)' }}>
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </label>
            <input
              type="url"
              value={github}
              onChange={e => setGithub(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-primary)' }}>
              <Linkedin className="w-3.5 h-3.5 text-blue-500" />
              <span>LinkedIn</span>
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-primary)' }}>
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube Channel</span>
            </label>
            <input
              type="url"
              value={youtube}
              onChange={e => setYoutube(e.target.value)}
              placeholder="https://youtube.com/@channel"
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
