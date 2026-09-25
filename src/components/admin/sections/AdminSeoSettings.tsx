import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Search, Save, Globe, Rss, FileCode, CheckCircle } from 'lucide-react';

interface AdminSeoSettingsProps {
  onOpenFeeds: () => void;
}

export const AdminSeoSettings: React.FC<AdminSeoSettingsProps> = ({ onOpenFeeds }) => {
  const { siteSettings, updateSeoSettings } = useBlog();
  const { seo } = siteSettings;

  const [metaTitleDefault, setMetaTitleDefault] = useState(seo.metaTitleDefault);
  const [metaDescriptionDefault, setMetaDescriptionDefault] = useState(seo.metaDescriptionDefault);
  const [ogImageDefault, setOgImageDefault] = useState(seo.ogImageDefault);
  const [twitterCard, setTwitterCard] = useState(seo.twitterCard || 'summary_large_image');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(seo.googleAnalyticsId || '');
  const [googleSiteVerification, setGoogleSiteVerification] = useState(seo.googleSiteVerification || '');
  const [canonicalBaseUrl, setCanonicalBaseUrl] = useState(seo.canonicalBaseUrl || 'https://al-imran.me');
  const [robotsTxt, setRobotsTxt] = useState(seo.robotsTxt || 'User-agent: *\nAllow: /\n\nSitemap: https://al-imran.me/sitemap.xml');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoSettings({
      metaTitleDefault,
      metaDescriptionDefault,
      ogImageDefault,
      twitterCard,
      googleAnalyticsId: googleAnalyticsId || undefined,
      googleSiteVerification: googleSiteVerification || undefined,
      canonicalBaseUrl,
      robotsTxt,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Search Engine Optimization & Syndication
          </h2>
          <p className="text-xs text-neutral-500">
            Configure site-wide meta fallbacks, crawler rules, indexing tags, and web syndication feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFeeds}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Rss className="w-3.5 h-3.5 text-amber-500" />
            <span>Inspect Live Feeds & Schema</span>
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:opacity-90 shadow-sm cursor-pointer"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saved ? 'Saved!' : 'Save SEO Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Meta Defaults */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Default Meta Information
        </h3>

        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
            Default Site Meta Title
          </label>
          <input
            type="text"
            value={metaTitleDefault}
            onChange={e => setMetaTitleDefault(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
            Default Meta Description
          </label>
          <textarea
            rows={2}
            value={metaDescriptionDefault}
            onChange={e => setMetaDescriptionDefault(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none leading-relaxed"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              OpenGraph Fallback Social Image URL
            </label>
            <input
              type="url"
              value={ogImageDefault}
              onChange={e => setOgImageDefault(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Canonical Base URL
            </label>
            <input
              type="url"
              value={canonicalBaseUrl}
              onChange={e => setCanonicalBaseUrl(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none font-mono"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Verification & Analytics */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Webmaster Verification & Telemetry
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Google Search Console Verification Token
            </label>
            <input
              type="text"
              value={googleSiteVerification}
              onChange={e => setGoogleSiteVerification(e.target.value)}
              placeholder="e.g. google-site-verification=abc123xyz"
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent font-mono focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Google Analytics Tracking ID (GA4)
            </label>
            <input
              type="text"
              value={googleAnalyticsId}
              onChange={e => setGoogleAnalyticsId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent font-mono focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Robots.txt Editor */}
      <div
        className="p-6 rounded-2xl border space-y-3"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Robots.txt Direct Editor
        </h3>
        <p className="text-xs text-neutral-500">
          Instructions for Googlebot, Bingbot, and AI web scrapers.
        </p>
        <textarea
          rows={5}
          value={robotsTxt}
          onChange={e => setRobotsTxt(e.target.value)}
          className="w-full p-3 font-mono text-xs rounded-lg border bg-neutral-900 text-neutral-200 focus:outline-none"
        />
      </div>
    </form>
  );
};
