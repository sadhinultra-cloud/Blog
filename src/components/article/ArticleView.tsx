import React, { useEffect, useState, useMemo } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Post, Comment } from '../../types';
import { ShareButtons } from '../common/ShareButtons';
import { AdSlot } from '../ads/AdSlot';
import {
  Clock,
  Calendar,
  Eye,
  ArrowLeft,
  ArrowRight,
  User,
  MessageSquare,
  Bookmark,
  Send,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface ArticleViewProps {
  slug: string;
  onBack: () => void;
  onSelectPost: (slug: string) => void;
  onNavigateCategory: (slug: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  slug,
  onBack,
  onSelectPost,
  onNavigateCategory,
}) => {
  const { posts, categories, authors, comments, addComment, incrementPostViews } = useBlog();

  // Find post
  const post = posts.find(p => p.slug === slug);

  // Reading progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // New Comment Form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentWebsite, setCommentWebsite] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | undefined>(undefined);
  const [spamAnswer, setSpamAnswer] = useState('');
  const [commentFeedback, setCommentFeedback] = useState<string | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  // Increment view count on mount
  useEffect(() => {
    if (post) {
      incrementPostViews(post.id);
    }
  }, [post?.id, incrementPostViews]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <p className="text-neutral-500">The requested editorial dispatch does not exist or was moved.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === post.categoryId);
  const author = authors.find(a => a.id === post.authorId);

  // Post comments (only approved comments)
  const postComments = comments.filter(c => c.postId === post.id && c.status === 'approved');

  // Related posts (same category, excluding current)
  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.status === 'published' && p.categoryId === post.categoryId)
    .slice(0, 3);

  // Prev / Next posts
  const published = posts.filter(p => p.status === 'published');
  const currentIndex = published.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? published[currentIndex - 1] : null;
  const nextPost = currentIndex < published.length - 1 ? published[currentIndex + 1] : null;

  // Extract table of contents headings from markdown content
  const headings = useMemo(() => {
    const lines = post.content.split('\n');
    const result: { id: string; text: string; level: number }[] = [];
    lines.forEach(line => {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-');
        result.push({ id, text, level });
      }
    });
    return result;
  }, [post.content]);

  // Handle Comment Submission with simple math anti-spam check (e.g., 3 + 4 = 7)
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentEmail.trim() || !commentText.trim()) return;

    if (spamAnswer.trim() !== '7') {
      alert('Verification math answer is incorrect. Please enter 7 for (3 + 4).');
      return;
    }

    addComment({
      postId: post.id,
      authorName: commentName.trim(),
      authorEmail: commentEmail.trim(),
      authorWebsite: commentWebsite.trim() || undefined,
      content: commentText.trim(),
      parentId: replyParentId,
    });

    setCommentFeedback('Your comment has been submitted and published. Thank you for contributing!');
    setCommentName('');
    setCommentEmail('');
    setCommentWebsite('');
    setCommentText('');
    setSpamAnswer('');
    setReplyParentId(undefined);

    setTimeout(() => setCommentFeedback(null), 6000);
  };

  const copySnippet = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Render markdown text into rich elements
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block trigger
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const codeString = codeBuffer.join('\n');
          const currentIdx = codeBlockIndex++;
          elements.push(
            <div key={`code-${i}`} className="relative my-6 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950">
              <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400 font-mono">
                <span>{codeLanguage || 'typescript'}</span>
                <button
                  onClick={() => copySnippet(codeString, currentIdx)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedCodeIdx === currentIdx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono text-neutral-200 overflow-x-auto leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Headings
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim();
        const id = text.toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-');
        elements.push(
          <h2
            key={`h2-${i}`}
            id={id}
            className="text-2xl sm:text-3xl font-extrabold mt-10 mb-4 scroll-mt-24 tracking-tight"
            style={{
              color: 'var(--text-primary)',
              fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--heading-font)',
            }}
          >
            {text}
          </h2>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim();
        const id = text.toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-');
        elements.push(
          <h3
            key={`h3-${i}`}
            id={id}
            className="text-xl sm:text-2xl font-bold mt-8 mb-3 scroll-mt-24 tracking-tight"
            style={{
              color: 'var(--text-primary)',
              fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--heading-font)',
            }}
          >
            {text}
          </h3>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`bq-${i}`}
            className="my-6 pl-5 py-2 border-l-4 italic text-base sm:text-lg leading-relaxed"
            style={{
              borderColor: 'var(--accent-primary)',
              color: 'var(--text-secondary)',
            }}
          >
            {line.replace('> ', '')}
          </blockquote>
        );
        continue;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`li-${i}`} className="ml-5 list-disc text-base mb-1.5 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        elements.push(
          <li key={`oli-${i}`} className="ml-5 list-decimal text-base mb-1.5 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {line.replace(/^\d+\.\s+/, '')}
          </li>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        continue;
      }

      // Standard paragraph
      elements.push(
        <p
          key={`p-${i}`}
          className="text-base sm:text-lg mb-5 leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--body-font)',
          }}
        >
          {line}
        </p>
      );
    }

    return elements;
  };

  return (
    <article id="article-page-container" className="w-full pb-20">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 z-50 transition-all duration-150"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: category?.color || 'var(--accent-primary)',
        }}
      />

      {/* Breadcrumbs */}
      <nav
        className="mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-2 text-xs font-medium text-neutral-400"
        style={{ maxWidth: 'var(--container-max-width)' }}
      >
        <button onClick={onBack} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <button
          onClick={() => category && onNavigateCategory(category.slug)}
          className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          {category ? category.name : 'Blog'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="truncate max-w-xs text-neutral-500" style={{ color: 'var(--text-primary)' }}>
          {post.title}
        </span>
      </nav>

      {/* Article Header (Centered Editorial) */}
      <header
        className="mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 max-w-4xl text-center space-y-4"
      >
        {/* Category Pill */}
        {category && (
          <button
            onClick={() => onNavigateCategory(category.slug)}
            className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer hover:opacity-90"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </button>
        )}

        {/* Title */}
        <h1
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.18] tracking-tight ${
            post.language === 'bn' ? 'font-serif' : ''
          }`}
          style={{
            color: 'var(--text-primary)',
            fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--heading-font)',
          }}
        >
          {post.title}
        </h1>

        {/* Subtitle */}
        {post.subtitle && (
          <p
            className="text-base sm:text-xl text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto"
            style={{
              fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : 'var(--body-font)',
            }}
          >
            {post.subtitle}
          </p>
        )}

        {/* Author & Meta Row */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 border-y py-3.5" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            {author?.avatar ? (
              <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="text-left">
              <span className="font-semibold block text-sm" style={{ color: 'var(--text-primary)' }}>
                {author?.name || 'Staff Writer'}
              </span>
              <span className="text-[11px] text-neutral-500">{author?.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {post.viewsCount || 0} views
            </span>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mb-10">
        <div className="rounded-2xl overflow-hidden border shadow-sm aspect-[16/9] w-full" style={{ borderColor: 'var(--border-color)' }}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        {post.imageCaption && (
          <p className="text-center text-xs text-neutral-500 mt-2.5 italic">
            {post.imageCaption}
          </p>
        )}
      </div>

      {/* Main Reading Column (Constrained to 760-840px for optimal typography) */}
      <div className="mx-auto px-4 sm:px-6 max-w-[820px]">
        {/* Table of Contents if multiple headings exist */}
        {headings.length > 2 && (
          <div
            className="p-5 rounded-xl border mb-10 text-xs"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold uppercase tracking-wider text-neutral-500 block mb-2.5">
              Table of Contents
            </span>
            <ul className="space-y-1.5">
              {headings.map(h => (
                <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
                  <a
                    href={`#${h.id}`}
                    className="hover:underline text-neutral-600 dark:text-neutral-300 font-medium"
                  >
                    • {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rendered Prose Content */}
        <div className="prose-editorial">{renderContent(post.content)}</div>

        {/* In-Article Advertisement Slot */}
        <AdSlot slot="in_article" className="my-8" />

        {/* Tags */}
        <div className="pt-8 pb-6 border-t mt-12 flex flex-wrap items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 mr-2">
            Discipline Tags:
          </span>
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-md text-xs font-mono border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Social Sharing Bar */}
        <div className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 mb-12" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <ShareButtons title={post.title} />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-semibold text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            ↑ Back to Top
          </button>
        </div>

        {/* Author Bio Box */}
        {author && (
          <div
            className="p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-14"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
            }}
          >
            <img
              src={author.avatar}
              alt={author.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-neutral-300 dark:border-neutral-700 flex-shrink-0"
            />
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {author.name}
                  </h4>
                  <span className="text-xs text-neutral-500 font-medium">{author.role}</span>
                </div>
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold underline underline-offset-4 flex items-center justify-center sm:justify-start gap-1"
                    style={{ color: 'var(--link-color)' }}
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {author.bio}
              </p>
            </div>
          </div>
        )}

        {/* Previous & Next Post Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-14 border-b" style={{ borderColor: 'var(--border-color)' }}>
          {prevPost ? (
            <button
              onClick={() => onSelectPost(prevPost.slug)}
              className="p-4 rounded-xl border text-left hover:border-neutral-500 transition-all cursor-pointer group"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Previous Dispatch
              </span>
              <p className="font-semibold text-sm line-clamp-1 mt-1" style={{ color: 'var(--text-primary)' }}>
                {prevPost.title}
              </p>
            </button>
          ) : (
            <div />
          )}

          {nextPost && (
            <button
              onClick={() => onSelectPost(nextPost.slug)}
              className="p-4 rounded-xl border text-right hover:border-neutral-500 transition-all cursor-pointer group"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-end gap-1">
                Next Dispatch
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <p className="font-semibold text-sm line-clamp-1 mt-1" style={{ color: 'var(--text-primary)' }}>
                {nextPost.title}
              </p>
            </button>
          )}
        </div>

        {/* Article Sponsor / Ad Slot */}
        <AdSlot slot="sidebar" className="my-8" />

        {/* Comments Section */}
        {post.allowComments && (
          <section id="comments-section" className="pt-12 space-y-8">
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 opacity-60" />
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Reader Discourse ({postComments.length})
                </h3>
              </div>
              <span className="text-xs text-neutral-400">Moderated Discussion</span>
            </div>

            {/* List of Comments */}
            <div className="space-y-4">
              {postComments.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 italic">
                  No comments yet. Be the first reader to spark thoughtful discourse on this dispatch.
                </p>
              ) : (
                postComments.map(comment => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-xl border space-y-2 ${comment.parentId ? 'ml-6 sm:ml-10 bg-neutral-50 dark:bg-neutral-900/50' : ''}`}
                    style={{
                      backgroundColor: comment.parentId ? undefined : 'var(--card-bg)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {comment.authorName}
                        </span>
                        {comment.authorWebsite && (
                          <a
                            href={comment.authorWebsite}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] underline opacity-60 hover:opacity-100"
                          >
                            website
                          </a>
                        )}
                      </div>
                      <span className="text-neutral-400 text-[11px]">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {comment.content}
                    </p>

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          setReplyParentId(comment.id);
                          document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[11px] font-semibold text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Submit Comment Form */}
            <div
              id="comment-form"
              className="p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {replyParentId ? 'Reply to Comment' : 'Leave a Thoughtful Response'}
                </h4>
                {replyParentId && (
                  <button
                    onClick={() => setReplyParentId(undefined)}
                    className="text-xs text-rose-500 font-semibold cursor-pointer"
                  >
                    Cancel Reply
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitComment} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-neutral-500"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 block mb-1">
                      Email Address * (Never Published)
                    </label>
                    <input
                      type="email"
                      value={commentEmail}
                      onChange={e => setCommentEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                      className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-neutral-500"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 block mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={commentWebsite}
                    onChange={e => setCommentWebsite(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-neutral-500"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 block mb-1">
                    Your Comment *
                  </label>
                  <textarea
                    rows={4}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Share constructive feedback or technical insights..."
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-neutral-500"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Anti-spam Verification */}
                <div className="p-3 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Anti-spam verification: What is 3 + 4?</span>
                  </div>
                  <input
                    type="text"
                    value={spamAnswer}
                    onChange={e => setSpamAnswer(e.target.value)}
                    placeholder="Enter answer (7)"
                    required
                    className="w-28 px-3 py-1.5 text-xs rounded border text-center font-mono bg-white dark:bg-black focus:outline-none"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-400">
                    Civil discourse only. Markdown code supported.
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                  >
                    <span>Submit Comment</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {commentFeedback && (
                  <p className="text-xs p-2.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>{commentFeedback}</span>
                  </p>
                )}
              </form>
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-16 mt-16 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Related Editorial Dispatches
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onSelectPost(rel.slug);
                  }}
                  className="group rounded-xl border overflow-hidden cursor-pointer"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                >
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="aspect-[16/10] w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-bold text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400" style={{ color: 'var(--text-primary)' }}>
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-neutral-400 block font-mono">
                      {rel.readingTimeMinutes} min read
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
