import React, { useState, useRef } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Post, PostStatus } from '../../types';
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  Youtube,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Minus,
  Table as TableIcon,
  Sparkles,
  Upload,
} from 'lucide-react';

interface PostEditorProps {
  initialPost?: Post | null;
  postId?: string;
  onSave?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ initialPost, postId, onSave, onCancel, onClose }) => {
  const { posts, categories, tags, authors, createPost, updatePost, uploadMedia, media } = useBlog();

  const activePost = initialPost || (postId ? posts.find(p => p.id === postId) : null);

  const handleClose = () => {
    if (onClose) onClose();
    else if (onCancel) onCancel();
  };

  const handleSaveSuccess = () => {
    if (onSave) onSave();
    if (onClose) onClose();
  };

  const [title, setTitle] = useState(activePost?.title || '');
  const [slug, setSlug] = useState(activePost?.slug || '');
  const [subtitle, setSubtitle] = useState(activePost?.subtitle || '');
  const [excerpt, setExcerpt] = useState(activePost?.excerpt || '');
  const [content, setContent] = useState(activePost?.content || '');
  const [featuredImage, setFeaturedImage] = useState(
    activePost?.featuredImage ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
  );
  const [imageCaption, setImageCaption] = useState(activePost?.imageCaption || '');
  const [categoryId, setCategoryId] = useState(activePost?.categoryId || (categories[0]?.id || 'cat-1'));
  const [selectedTags, setSelectedTags] = useState<string[]>(activePost?.tags || ['Architecture', 'TypeScript']);
  const [tagInput, setTagInput] = useState('');
  const [authorId, setAuthorId] = useState(activePost?.authorId || (authors[0]?.id || 'author-1'));
  const [status, setStatus] = useState<PostStatus>(activePost?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(activePost?.isFeatured || false);
  const [language, setLanguage] = useState<'en' | 'bn'>(activePost?.language || 'en');
  const [readingTime, setReadingTime] = useState<number>(initialPost?.readingTimeMinutes || 5);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo?.seoTitle || '');
  const [metaDesc, setMetaDesc] = useState(initialPost?.seo?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(initialPost?.seo?.focusKeyword || '');

  // Active view: 'edit' or 'split' or 'preview'
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialPost) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s\u0980-\u09FF-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  // Helper to insert markdown at cursor position
  const insertTextAtCursor = (before: string, after: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selected = currentText.substring(start, end) || defaultPlaceholder;

    const replacement = `${before}${selected}${after}`;
    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const uploaded = uploadMedia(file.name, dataUrl, Math.round(file.size / 1024));
      setFeaturedImage(uploaded.url);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || `post-${Date.now()}`,
      subtitle: subtitle.trim() || undefined,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim() || undefined,
      categoryId,
      tags: selectedTags,
      authorId,
      status,
      isFeatured,
      publishedAt: initialPost ? initialPost.publishedAt : new Date().toISOString(),
      readingTimeMinutes: readingTime || 5,
      seo: {
        seoTitle: seoTitle.trim() || title.trim(),
        metaDescription: metaDesc.trim() || excerpt.trim(),
        focusKeyword: focusKeyword.trim() || undefined,
      },
      allowComments: true,
      language,
    };

    if (activePost) {
      updatePost(activePost.id, payload);
    } else {
      createPost(payload);
    }

    handleSaveSuccess();
  };

  return (
    <div className="w-full pb-20">
      {/* Top action bar */}
      <div
        className="sticky top-0 z-30 py-3.5 px-4 sm:px-6 border-b flex items-center justify-between shadow-xs"
        style={{
          backgroundColor: 'var(--header-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="p-2 rounded-lg border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {activePost ? 'Editing Editorial Dispatch' : 'Compose New Editorial Dispatch'}
            </h2>
            <span className="text-[11px] text-neutral-400 font-mono">
              Status: <strong className="uppercase">{status}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex border rounded-lg overflow-hidden text-xs" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                viewMode === 'edit' ? 'bg-neutral-200 dark:bg-neutral-800 font-bold' : ''
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                viewMode === 'split' ? 'bg-neutral-200 dark:bg-neutral-800 font-bold' : ''
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                viewMode === 'preview' ? 'bg-neutral-200 dark:bg-neutral-800 font-bold' : ''
              }`}
              style={{ color: 'var(--text-primary)' }}
            >
              Preview
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:opacity-90 shadow-sm cursor-pointer"
            style={{
              backgroundColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
            }}
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Navigation Tabs (Content, SEO, Settings) */}
        <div className="flex border-b mb-6 text-xs font-semibold gap-6" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'content' ? 'border-black dark:border-white font-bold' : 'border-transparent text-neutral-400'
            }`}
            style={{ color: activeTab === 'content' ? 'var(--text-primary)' : undefined }}
          >
            Article Prose & Media
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'seo' ? 'border-black dark:border-white font-bold' : 'border-transparent text-neutral-400'
            }`}
            style={{ color: activeTab === 'seo' ? 'var(--text-primary)' : undefined }}
          >
            SEO & Social Metadata
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'settings' ? 'border-black dark:border-white font-bold' : 'border-transparent text-neutral-400'
            }`}
            style={{ color: activeTab === 'settings' ? 'var(--text-primary)' : undefined }}
          >
            Publication Parameters
          </button>
        </div>

        {/* Tab 1: Content & Editor */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title & Slug */}
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter a compelling editorial title..."
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent border-b pb-2 focus:outline-none placeholder:text-neutral-400"
                  style={{
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                    fontFamily: language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--heading-font)',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-bold text-neutral-400 block mb-1">
                    Custom URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    placeholder="article-slug"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border font-mono bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold text-neutral-400 block mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value as 'en' | 'bn')}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="en" className="dark:bg-neutral-900">English (Inter / Plus Jakarta)</option>
                    <option value="bn" className="dark:bg-neutral-900">বাংলা (Hind Siliguri / Noto Sans)</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subtitle or philosophical premise (optional)..."
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full text-sm italic bg-transparent border-b pb-2 focus:outline-none placeholder:text-neutral-400"
                  style={{
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border-color)',
                    fontFamily: language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--body-font)',
                  }}
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Short excerpt for article card previews and RSS distribution..."
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none leading-relaxed"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Rich Editor Toolbar */}
            <div
              className="p-2 rounded-xl border flex flex-wrap items-center gap-1 text-xs"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <button
                type="button"
                onClick={() => insertTextAtCursor('## ', '\n', 'Section Heading')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('### ', '\n', 'Sub Heading')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
              <button
                type="button"
                onClick={() => insertTextAtCursor('**', '**', 'bold text')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('*', '*', 'italic text')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('> ', '\n', 'Quoted passage')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
              <button
                type="button"
                onClick={() => insertTextAtCursor('- ', '\n', 'List item')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('1. ', '\n', 'Numbered step')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('```typescript\n', '\n```', '// Your code')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter link URL:', 'https://');
                  if (url) insertTextAtCursor('[', `](${url})`, 'Link Text');
                }}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter image URL:', 'https://images.unsplash.com/...');
                  if (url) insertTextAtCursor('![Image description](', `${url})`);
                }}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('\n---\n')}
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Horizontal Divider"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  insertTextAtCursor(
                    '\n| Concept | Rationale | Performance |\n|---|---|---|\n| Static | Predictable | O(1) |\n'
                  )
                }
                className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Markdown Table"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Split / Single View */}
            <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2 gap-6' : 'grid-cols-1'}`}>
              {/* Textarea Code/Prose */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className="space-y-2">
                  <textarea
                    ref={textareaRef}
                    rows={20}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write your article in Markdown. Use ## for headers, > for quotes, ``` for code blocks..."
                    className="w-full p-4 text-sm font-mono rounded-xl border bg-transparent focus:outline-none leading-relaxed"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                      fontFamily: language === 'bn' ? "'Hind Siliguri', monospace" : 'monospace',
                    }}
                  />
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                    <span>Markdown supported</span>
                  </div>
                </div>
              )}

              {/* Live Preview Panel */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div
                  className="p-6 rounded-xl border overflow-y-auto max-h-[600px] prose-editorial"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">Live Editorial Preview</h2>
                  {content.split('\n').map((line, idx) => {
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-xl font-bold mt-4 mb-2">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-lg font-bold mt-3 mb-1">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('> ')) {
                      return (
                        <blockquote key={idx} className="pl-4 border-l-2 italic text-neutral-500 my-3">
                          {line.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    if (line.startsWith('```')) {
                      return (
                        <pre key={idx} className="p-3 bg-neutral-900 text-neutral-100 rounded text-xs font-mono my-3 overflow-x-auto">
                          {line}
                        </pre>
                      );
                    }
                    if (!line.trim()) return null;
                    return (
                      <p key={idx} className="text-sm mb-3">
                        {line}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Featured Image Section */}
            <div
              className="p-5 rounded-xl border space-y-4"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Featured Cover Image
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={featuredImage}
                  alt="Preview"
                  className="w-40 h-24 rounded-lg object-cover border flex-shrink-0"
                  style={{ borderColor: 'var(--border-color)' }}
                />
                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={e => setFeaturedImage(e.target.value)}
                    placeholder="Paste image URL..."
                    className="w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={e => setImageCaption(e.target.value)}
                    placeholder="Image caption / credit..."
                    className="w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <label className="px-3 py-1.5 rounded text-xs font-semibold border flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local File</span>
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SEO & Social Metadata */}
        {activeTab === 'seo' && (
          <div className="max-w-3xl space-y-6">
            <div
              className="p-5 rounded-xl border space-y-4"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Search Engine Optimization
              </h3>

              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder={title || 'Search title...'}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border bg-transparent focus:outline-none"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                  Recommended length: 50-60 characters ({seoTitle.length} chars)
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  placeholder="Summary for Google and search crawlers..."
                  className="w-full px-3.5 py-2 text-xs rounded-lg border bg-transparent focus:outline-none"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                  Recommended length: 140-160 characters ({metaDesc.length} chars)
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={e => setFocusKeyword(e.target.value)}
                  placeholder="e.g. distributed systems, zero-trust"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border bg-transparent focus:outline-none"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* SERP Search Preview */}
              <div className="border-t pt-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider mb-2">
                  Google Search Result Preview
                </span>
                <div className="p-4 rounded-lg bg-white text-black border border-neutral-200 font-sans space-y-1">
                  <div className="text-xs text-neutral-600 flex items-center gap-1">
                    <span>https://al-imran.me</span>
                    <span>› blog › {slug || 'article-slug'}</span>
                  </div>
                  <h4 className="text-blue-700 text-base font-medium hover:underline cursor-pointer">
                    {seoTitle || title || 'Article Title'}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {metaDesc || excerpt || 'Article excerpt and description will appear here in search engine results.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Publication Parameters */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <div
              className="p-6 rounded-xl border space-y-5"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Primary Discipline / Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="dark:bg-neutral-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Selection */}
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Author Attribution
                  </label>
                  <select
                    value={authorId}
                    onChange={e => setAuthorId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    {authors.map(a => (
                      <option key={a.id} value={a.id} className="dark:bg-neutral-900">
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y py-4" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as PostStatus)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="published" className="dark:bg-neutral-900">Published</option>
                    <option value="draft" className="dark:bg-neutral-900">Draft</option>
                    <option value="scheduled" className="dark:bg-neutral-900">Scheduled</option>
                    <option value="archived" className="dark:bg-neutral-900">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                    Estimated Read Time (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readingTime}
                    onChange={e => setReadingTime(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                    Homepage Featured
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs mt-1">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={e => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span style={{ color: 'var(--text-primary)' }}>Hero/Featured Highlight</span>
                  </label>
                </div>
              </div>

              {/* Tags Management */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded text-xs font-mono border flex items-center gap-1.5"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-neutral-400 hover:text-rose-500 text-xs font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag and press Enter..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
