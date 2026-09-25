import React, { useState, useMemo } from 'react';
import { useBlog } from '../../context/BlogContext';
import { X, Copy, Check, Download, Rss, FileCode, Search } from 'lucide-react';

interface FeedsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedsViewerModal: React.FC<FeedsViewerModalProps> = ({ isOpen, onClose }) => {
  const { posts, siteSettings, categories } = useBlog();
  const [activeTab, setActiveTab] = useState<'rss' | 'sitemap' | 'robots' | 'schema'>('rss');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://al-imran.me';

  // 1. Generate dynamic RSS 2.0 XML
  const rssXml = useMemo(() => {
    const published = posts.filter(p => p.status === 'published');
    const items = published
      .map(p => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <category><![CDATA[${categories.find(c => c.id === p.categoryId)?.name || 'General'}]]></category>
    </item>`)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteSettings.siteName}</title>
    <link>${baseUrl}</link>
    <description>${siteSettings.description}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
  }, [posts, siteSettings, categories, baseUrl]);

  // 2. Generate sitemap.xml
  const sitemapXml = useMemo(() => {
    const published = posts.filter(p => p.status === 'published');
    const urls = [
      `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
      `  <url>\n    <loc>${baseUrl}/blog</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
      `  <url>\n    <loc>${baseUrl}/about</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
      `  <url>\n    <loc>${baseUrl}/contact</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
      ...published.map(
        p => `  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.slice(0, 10) : p.publishedAt.slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      ),
    ].join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }, [posts, baseUrl]);

  // 3. Robots.txt
  const robotsTxt = useMemo(() => {
    return siteSettings.seo.robotsTxt || `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml`;
  }, [siteSettings, baseUrl]);

  // 4. Schema.org JSON-LD Structured Data
  const schemaJson = useMemo(() => {
    const orgSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: siteSettings.siteName,
          description: siteSettings.description,
          publisher: {
            '@type': 'Person',
            name: siteSettings.authorName,
            image: siteSettings.authorPhoto,
          },
        },
        {
          '@type': 'Blog',
          '@id': `${baseUrl}/#blog`,
          url: `${baseUrl}/blog`,
          name: `${siteSettings.siteName} Editorial Dispatches`,
          description: siteSettings.tagline,
          blogPost: posts.slice(0, 5).map(p => ({
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.excerpt,
            image: p.featuredImage,
            datePublished: p.publishedAt,
            dateModified: p.updatedAt,
            mainEntityOfPage: `${baseUrl}/blog/${p.slug}`,
          })),
        },
      ],
    };
    return JSON.stringify(orgSchema, null, 2);
  }, [siteSettings, posts, baseUrl]);

  const activeContent =
    activeTab === 'rss'
      ? rssXml
      : activeTab === 'sitemap'
      ? sitemapXml
      : activeTab === 'robots'
      ? robotsTxt
      : schemaJson;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'rss'
        ? 'rss.xml'
        : activeTab === 'sitemap'
        ? 'sitemap.xml'
        : activeTab === 'robots'
        ? 'robots.txt'
        : 'structured-data.json';
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[85vh]"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <Rss className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              SEO Feeds & Structured Data Engine
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b text-xs font-semibold px-4 pt-2 gap-2"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={() => setActiveTab('rss')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rss' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-neutral-500'
            }`}
          >
            RSS Feed (rss.xml)
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sitemap' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-neutral-500'
            }`}
          >
            Sitemap (sitemap.xml)
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'robots' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-neutral-500'
            }`}
          >
            Robots (robots.txt)
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schema' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-neutral-500'
            }`}
          >
            JSON-LD Schema
          </button>
        </div>

        {/* Code Content View */}
        <div className="p-4 flex-1 overflow-auto bg-neutral-950 text-neutral-200 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap select-all">{activeContent}</pre>
        </div>

        {/* Actions Bar */}
        <div
          className="p-3.5 border-t flex items-center justify-between text-xs"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <span className="text-neutral-500">
            Automatically synchronized with published articles and categories.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded border flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Content'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
