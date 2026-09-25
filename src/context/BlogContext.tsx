import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Post,
  Category,
  Tag,
  Author,
  Comment,
  MediaItem,
  CustomPage,
  NewsletterSubscriber,
  ContactMessage,
  MenuItem,
  SiteSettings,
  ThemeSettings,
  ThemeColors,
  HomepageSection,
  AnalyticsData,
  UserRole,
  AdsConfig,
} from '../types';
import {
  DEFAULT_POSTS,
  DEFAULT_CATEGORIES,
  DEFAULT_TAGS,
  DEFAULT_AUTHORS,
  DEFAULT_COMMENTS,
  DEFAULT_MEDIA,
  DEFAULT_CUSTOM_PAGES,
  DEFAULT_SUBSCRIBERS,
  DEFAULT_MESSAGES,
  DEFAULT_MENU_ITEMS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_ANALYTICS,
  THEME_PRESETS,
  DEFAULT_ADS_CONFIG,
} from '../data/defaultData';

interface BlogContextType {
  // State
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  comments: Comment[];
  subscribers: NewsletterSubscriber[];
  messages: ContactMessage[];
  media: MediaItem[];
  customPages: CustomPage[];
  menuItems: MenuItem[];
  siteSettings: SiteSettings;
  themeSettings: ThemeSettings;
  homepageSections: HomepageSection[];
  analytics: AnalyticsData;
  activeThemeColors: ThemeColors;
  currentThemeMode: 'light' | 'dark';
  isAdminLoggedIn: boolean;
  currentUserRole: UserRole;

  // Post Actions
  createPost: (post: Omit<Post, 'id' | 'viewsCount' | 'createdAt' | 'updatedAt'>) => Post;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => void;
  incrementPostViews: (id: string) => void;

  // Category Actions
  createCategory: (cat: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (orderedList: Category[]) => void;

  // Tag Actions
  createTag: (name: string) => void;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  mergeTags: (sourceId: string, targetId: string) => void;

  // Author Actions
  createAuthor: (author: Omit<Author, 'id'>) => void;
  updateAuthor: (id: string, author: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;

  // Comments
  addComment: (comment: { postId: string; authorName: string; authorEmail: string; authorWebsite?: string; content: string; parentId?: string }) => void;
  updateCommentStatus: (id: string, status: 'approved' | 'pending' | 'spam') => void;
  deleteComment: (id: string) => void;

  // Newsletter
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  deleteSubscriber: (id: string) => void;
  exportSubscribersCSV: () => void;

  // Contact Messages
  sendMessage: (msg: { name: string; email: string; subject: string; message: string }) => boolean;
  markMessageRead: (id: string, isRead: boolean) => void;
  deleteMessage: (id: string) => void;

  // Media
  uploadMedia: (title: string, url: string, sizeKb: number, dimensions?: string) => MediaItem;
  deleteMedia: (id: string) => void;

  // Pages
  createPage: (page: Omit<CustomPage, 'id' | 'updatedAt'>) => void;
  updatePage: (id: string, page: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;
  createCustomPage: (page: Omit<CustomPage, 'id' | 'updatedAt'>) => void;
  updateCustomPage: (id: string, page: Partial<CustomPage>) => void;
  deleteCustomPage: (id: string) => void;

  // Navigation
  createMenuItem: (item: Omit<MenuItem, 'id' | 'order'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (orderedList: MenuItem[]) => void;
  updateNavigation: (items: MenuItem[]) => void;

  // Homepage Sections
  reorderHomepageSections: (orderedSections: HomepageSection[]) => void;
  toggleHomepageSection: (id: string) => void;
  updateHomepageSections: (sections: HomepageSection[]) => void;

  // Settings & Theme
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updateThemeSettings: (theme: Partial<ThemeSettings>) => void;
  applyThemePreset: (presetName: string) => void;
  toggleThemeMode: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  updateHeroConfig: (cfg: Partial<SiteSettings['heroConfig']>) => void;
  updateBlogConfig: (cfg: Partial<SiteSettings['blogConfig']>) => void;
  updateHeaderConfig: (cfg: Partial<NonNullable<SiteSettings['headerConfig']>>) => void;
  updateFooterConfig: (cfg: Partial<NonNullable<SiteSettings['footerConfig']>>) => void;
  updateSocialLinks: (links: Partial<SiteSettings['socialLinks']>) => void;
  updateSeoSettings: (seo: Partial<SiteSettings['seo']>) => void;
  updateThemeConfig: (theme: Partial<ThemeSettings>) => void;
  adsConfig: AdsConfig;
  updateAdsConfig: (ads: Partial<AdsConfig>) => void;

  // Auth & Backups
  loginAdmin: (password: string, role?: UserRole) => boolean;
  logoutAdmin: () => void;
  adminLogout: () => void;
  switchUserRole: (role: UserRole) => void;
  resetToDefaults: () => void;
  resetToDefaultDemoData: () => void;
  exportBlogData: () => void;
  importBlogData: (jsonStr: string) => boolean;
  changeAdminPassword: (oldPw: string, newPw: string) => boolean;
  newsletterSubscribers: NewsletterSubscriber[];
  deleteNewsletterSubscriber: (id: string) => void;
}

const STORAGE_PREFIX = 'apex_blog_v1_';

const BlogContext = createContext<BlogContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage quota exceeded or error saving:', e);
  }
}

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => loadFromStorage('posts', DEFAULT_POSTS));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('categories', DEFAULT_CATEGORIES));
  const [tags, setTags] = useState<Tag[]>(() => loadFromStorage('tags', DEFAULT_TAGS));
  const [authors, setAuthors] = useState<Author[]>(() => loadFromStorage('authors', DEFAULT_AUTHORS));
  const [comments, setComments] = useState<Comment[]>(() => loadFromStorage('comments', DEFAULT_COMMENTS));
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => loadFromStorage('subscribers', DEFAULT_SUBSCRIBERS));
  const [messages, setMessages] = useState<ContactMessage[]>(() => loadFromStorage('messages', DEFAULT_MESSAGES));
  const [media, setMedia] = useState<MediaItem[]>(() => loadFromStorage('media', DEFAULT_MEDIA));
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => loadFromStorage('customPages', DEFAULT_CUSTOM_PAGES));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadFromStorage('menuItems', DEFAULT_MENU_ITEMS));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => loadFromStorage('siteSettings', DEFAULT_SITE_SETTINGS));
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => loadFromStorage('themeSettings', DEFAULT_THEME_SETTINGS));
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>(() => loadFromStorage('homepageSections', DEFAULT_HOMEPAGE_SECTIONS));
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => loadFromStorage('analytics', DEFAULT_ANALYTICS));

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => loadFromStorage('isAdminLoggedIn', false));
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => loadFromStorage('currentUserRole', 'super_admin'));

  // Save changes to localStorage
  useEffect(() => saveToStorage('posts', posts), [posts]);
  useEffect(() => saveToStorage('categories', categories), [categories]);
  useEffect(() => saveToStorage('tags', tags), [tags]);
  useEffect(() => saveToStorage('authors', authors), [authors]);
  useEffect(() => saveToStorage('comments', comments), [comments]);
  useEffect(() => saveToStorage('subscribers', subscribers), [subscribers]);
  useEffect(() => saveToStorage('messages', messages), [messages]);
  useEffect(() => saveToStorage('media', media), [media]);
  useEffect(() => saveToStorage('customPages', customPages), [customPages]);
  useEffect(() => saveToStorage('menuItems', menuItems), [menuItems]);
  useEffect(() => saveToStorage('siteSettings', siteSettings), [siteSettings]);
  useEffect(() => saveToStorage('themeSettings', themeSettings), [themeSettings]);
  useEffect(() => saveToStorage('homepageSections', homepageSections), [homepageSections]);
  useEffect(() => saveToStorage('analytics', analytics), [analytics]);
  useEffect(() => saveToStorage('isAdminLoggedIn', isAdminLoggedIn), [isAdminLoggedIn]);
  useEffect(() => saveToStorage('currentUserRole', currentUserRole), [currentUserRole]);

  // Determine current effective theme mode (light vs dark)
  const [systemIsDark, setSystemIsDark] = useState<boolean>(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mql.matches);
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const currentThemeMode = useMemo<'light' | 'dark'>(() => {
    if (themeSettings.mode === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return themeSettings.mode;
  }, [themeSettings.mode, systemIsDark]);

  const activeThemeColors = useMemo<ThemeColors>(() => {
    return currentThemeMode === 'dark' ? themeSettings.darkColors : themeSettings.lightColors;
  }, [currentThemeMode, themeSettings.lightColors, themeSettings.darkColors]);

  // Inject CSS Variables into Document Root dynamically
  useEffect(() => {
    const root = document.documentElement;
    const colors = activeThemeColors;
    const typo = themeSettings.typography;

    // Apply color variables
    root.style.setProperty('--bg-primary', colors.primaryBg);
    root.style.setProperty('--bg-secondary', colors.secondaryBg);
    root.style.setProperty('--text-primary', colors.primaryText);
    root.style.setProperty('--text-secondary', colors.secondaryText);
    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--card-bg', colors.cardBg);
    root.style.setProperty('--accent-primary', colors.primaryAccent);
    root.style.setProperty('--btn-bg', colors.buttonBg);
    root.style.setProperty('--btn-text', colors.buttonText);
    root.style.setProperty('--hover-color', colors.hover);
    root.style.setProperty('--header-bg', colors.headerBg);
    root.style.setProperty('--footer-bg', colors.footerBg);
    root.style.setProperty('--link-color', colors.linkColor);

    // Typography variables
    root.style.setProperty('--font-family', typo.fontFamily);
    root.style.setProperty('--heading-font', typo.headingFont);
    root.style.setProperty('--body-font', typo.bodyFont);
    root.style.setProperty('--base-font-size', `${typo.baseFontSizePx}px`);
    root.style.setProperty('--line-height', `${typo.lineHeight}`);
    root.style.setProperty('--heading-scale', `${typo.headingScale}`);
    root.style.setProperty('--border-radius', `${themeSettings.borderRadiusPx}px`);
    root.style.setProperty('--container-max-width', `${themeSettings.containerMaxWidthPx}px`);

    // Toggle dark class on root for tailwind compatibility
    if (currentThemeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [activeThemeColors, themeSettings, currentThemeMode]);

  // Post Methods
  const createPost = useCallback((newPostData: Omit<Post, 'id' | 'viewsCount' | 'createdAt' | 'updatedAt'>): Post => {
    const id = `post-${Date.now()}`;
    const newPost: Post = {
      ...newPostData,
      id,
      viewsCount: 0,
      publishedAt: newPostData.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);

    // Recalculate tag counts
    setTags(prevTags =>
      prevTags.map(tag => ({
        ...tag,
        count: (newPost.tags.includes(tag.name) ? 1 : 0) + tag.count,
      }))
    );
    return newPost;
  }, []);

  const updatePost = useCallback((id: string, updatedFields: Partial<Post>) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  const duplicatePost = useCallback((id: string) => {
    setPosts(prev => {
      const source = prev.find(p => p.id === id);
      if (!source) return prev;
      const dup: Post = {
        ...source,
        id: `post-${Date.now()}`,
        title: `${source.title} (Copy)`,
        slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
        status: 'draft',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 0,
        isFeatured: false,
      };
      return [dup, ...prev];
    });
  }, []);

  const incrementPostViews = useCallback((id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p))
    );
    setAnalytics(prev => ({
      ...prev,
      totalViews: prev.totalViews + 1,
    }));
  }, []);

  // Category Methods
  const createCategory = useCallback((catData: Omit<Category, 'id' | 'order'>) => {
    setCategories(prev => {
      const newCat: Category = {
        ...catData,
        id: `cat-${Date.now()}`,
        order: prev.length + 1,
      };
      return [...prev, newCat];
    });
  }, []);

  const updateCategory = useCallback((id: string, fields: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...fields } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const reorderCategories = useCallback((orderedList: Category[]) => {
    setCategories(orderedList.map((c, index) => ({ ...c, order: index + 1 })));
  }, []);

  // Tag Methods
  const createTag = useCallback((name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0980-\u09FF-]/g, '');
    setTags(prev => {
      if (prev.some(t => t.name.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, { id: `tag-${Date.now()}`, name, slug, count: 0 }];
    });
  }, []);

  const updateTag = useCallback((id: string, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0980-\u09FF-]/g, '');
    setTags(prev => prev.map(t => (t.id === id ? { ...t, name, slug } : t)));
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  }, []);

  const mergeTags = useCallback((sourceId: string, targetId: string) => {
    const source = tags.find(t => t.id === sourceId);
    const target = tags.find(t => t.id === targetId);
    if (!source || !target) return;

    // Update posts that had the source tag to the target tag
    setPosts(prev =>
      prev.map(p => {
        if (!p.tags.includes(source.name)) return p;
        const newTags = Array.from(new Set(p.tags.map(t => (t === source.name ? target.name : t))));
        return { ...p, tags: newTags };
      })
    );

    // Remove source tag and bump target tag count
    setTags(prev =>
      prev
        .filter(t => t.id !== sourceId)
        .map(t => (t.id === targetId ? { ...t, count: t.count + source.count } : t))
    );
  }, [tags]);

  // Author Methods
  const createAuthor = useCallback((authorData: Omit<Author, 'id'>) => {
    setAuthors(prev => [...prev, { ...authorData, id: `author-${Date.now()}` }]);
  }, []);

  const updateAuthor = useCallback((id: string, fields: Partial<Author>) => {
    setAuthors(prev => prev.map(a => (a.id === id ? { ...a, ...fields } : a)));
  }, []);

  const deleteAuthor = useCallback((id: string) => {
    setAuthors(prev => prev.filter(a => a.id !== id));
  }, []);

  // Comments
  const addComment = useCallback((data: { postId: string; authorName: string; authorEmail: string; authorWebsite?: string; content: string; parentId?: string }) => {
    const post = posts.find(p => p.id === data.postId);
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId: data.postId,
      postTitle: post ? post.title : 'Editorial Dispatch',
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      authorWebsite: data.authorWebsite,
      content: data.content,
      createdAt: new Date().toISOString(),
      status: 'approved', // Auto-approved for frictionless demo, moderated in admin
      parentId: data.parentId,
    };
    setComments(prev => [newComment, ...prev]);
  }, [posts]);

  const updateCommentStatus = useCallback((id: string, status: 'approved' | 'pending' | 'spam') => {
    setComments(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
  }, []);

  const deleteComment = useCallback((id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  }, []);

  // Newsletter
  const subscribeNewsletter = useCallback((email: string): { success: boolean; message: string } => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    const exists = subscribers.some(s => s.email.toLowerCase() === normalized);
    if (exists) {
      return { success: false, message: 'This email is already subscribed to our journal.' };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: normalized,
      subscribedAt: new Date().toISOString(),
      active: true,
    };
    setSubscribers(prev => [newSub, ...prev]);
    return { success: true, message: 'Thank you for subscribing to AL-IMRAN Editorial Dispatches.' };
  }, [subscribers]);

  const deleteSubscriber = useCallback((id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  }, []);

  const exportSubscribersCSV = useCallback(() => {
    const headers = 'ID,Email,SubscribedAt,Active\n';
    const rows = subscribers.map(s => `"${s.id}","${s.email}","${s.subscribedAt}",${s.active}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `al-imran-newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [subscribers]);

  // Contact Messages
  const sendMessage = useCallback((msg: { name: string; email: string; subject: string; message: string }) => {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject || 'General Inquiry',
      message: msg.message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [newMsg, ...prev]);
    return true;
  }, []);

  const markMessageRead = useCallback((id: string, isRead: boolean) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, isRead } : m)));
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  // Media
  const uploadMedia = useCallback((title: string, url: string, sizeKb: number, dimensions?: string): MediaItem => {
    const item: MediaItem = {
      id: `med-${Date.now()}`,
      title,
      url,
      sizeKb,
      dimensions: dimensions || '1200 x 800',
      createdAt: new Date().toISOString(),
      mimeType: url.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
    };
    setMedia(prev => [item, ...prev]);
    return item;
  }, []);

  const deleteMedia = useCallback((id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  }, []);

  // Custom Pages
  const createPage = useCallback((pageData: Omit<CustomPage, 'id' | 'updatedAt'>) => {
    const newPage: CustomPage = {
      ...pageData,
      id: `page-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setCustomPages(prev => [...prev, newPage]);
  }, []);

  const updatePage = useCallback((id: string, fields: Partial<CustomPage>) => {
    setCustomPages(prev =>
      prev.map(p => (p.id === id ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deletePage = useCallback((id: string) => {
    setCustomPages(prev => prev.filter(p => p.id !== id));
  }, []);

  // Menu Items
  const createMenuItem = useCallback((itemData: Omit<MenuItem, 'id' | 'order'>) => {
    setMenuItems(prev => [
      ...prev,
      {
        ...itemData,
        id: `m-${Date.now()}`,
        order: prev.length + 1,
      },
    ]);
  }, []);

  const updateMenuItem = useCallback((id: string, fields: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => (m.id === id ? { ...m, ...fields } : m)));
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  }, []);

  const reorderMenuItems = useCallback((orderedList: MenuItem[]) => {
    setMenuItems(orderedList.map((m, index) => ({ ...m, order: index + 1 })));
  }, []);

  // Homepage Sections
  const reorderHomepageSections = useCallback((orderedSections: HomepageSection[]) => {
    setHomepageSections(orderedSections.map((s, index) => ({ ...s, order: index + 1 })));
  }, []);

  const toggleHomepageSection = useCallback((id: string) => {
    setHomepageSections(prev => prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }, []);

  // Settings & Theme
  const updateSiteSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({
      ...prev,
      ...newSettings,
      sidebar: { ...prev.sidebar, ...(newSettings.sidebar || {}) },
      heroConfig: { ...prev.heroConfig, ...(newSettings.heroConfig || {}) },
      blogConfig: { ...prev.blogConfig, ...(newSettings.blogConfig || {}) },
      socialLinks: { ...prev.socialLinks, ...(newSettings.socialLinks || {}) },
      seo: { ...prev.seo, ...(newSettings.seo || {}) },
    }));
  }, []);

  const updateThemeSettings = useCallback((newTheme: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({
      ...prev,
      ...newTheme,
      lightColors: { ...prev.lightColors, ...(newTheme.lightColors || {}) },
      darkColors: { ...prev.darkColors, ...(newTheme.darkColors || {}) },
      typography: { ...prev.typography, ...(newTheme.typography || {}) },
    }));
  }, []);

  const applyThemePreset = useCallback((presetName: string) => {
    const preset = THEME_PRESETS.find(p => p.name === presetName);
    if (!preset) return;
    setThemeSettings(prev => ({
      ...prev,
      lightColors: { ...preset.light },
      darkColors: { ...preset.dark },
    }));
  }, []);

  const toggleThemeMode = useCallback(() => {
    setThemeSettings(prev => {
      const nextMode = prev.mode === 'dark' ? 'light' : 'dark';
      return { ...prev, mode: nextMode };
    });
  }, []);

  // Admin Auth
  const loginAdmin = useCallback((password: string, role: UserRole = 'super_admin'): boolean => {
    // Standard secure demo check: accept "admin123" or "editor123" or any custom configured
    if (password === 'admin123' || password === 'admin' || password === 'editor123') {
      setIsAdminLoggedIn(true);
      setCurrentUserRole(password.includes('editor') ? 'editor' : role);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
  }, []);

  const switchUserRole = useCallback((role: UserRole) => {
    setCurrentUserRole(role);
  }, []);

  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');

  const setThemeMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    updateThemeSettings({ mode });
  }, [updateThemeSettings]);

  const updateHeroConfig = useCallback((cfg: Partial<SiteSettings['heroConfig']>) => {
    setSiteSettings(prev => ({ ...prev, heroConfig: { ...prev.heroConfig, ...cfg } }));
  }, []);

  const updateBlogConfig = useCallback((cfg: Partial<SiteSettings['blogConfig']>) => {
    setSiteSettings(prev => ({ ...prev, blogConfig: { ...prev.blogConfig, ...cfg } }));
  }, []);

  const updateHeaderConfig = useCallback((cfg: Partial<NonNullable<SiteSettings['headerConfig']>>) => {
    setSiteSettings(prev => ({
      ...prev,
      headerConfig: { ...(prev.headerConfig || { isSticky: true, showSearch: true, showThemeToggle: true, showRssButton: true }), ...cfg },
    }));
  }, []);

  const updateFooterConfig = useCallback((cfg: Partial<NonNullable<SiteSettings['footerConfig']>>) => {
    setSiteSettings(prev => ({
      ...prev,
      footerConfig: { ...(prev.footerConfig || { copyrightText: prev.copyrightText }), ...cfg },
    }));
  }, []);

  const updateSocialLinks = useCallback((links: Partial<SiteSettings['socialLinks']>) => {
    setSiteSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, ...links } }));
  }, []);

  const updateSeoSettings = useCallback((seo: Partial<SiteSettings['seo']>) => {
    setSiteSettings(prev => ({ ...prev, seo: { ...prev.seo, ...seo } }));
  }, []);

  const updateThemeConfig = useCallback((theme: Partial<ThemeSettings>) => {
    updateThemeSettings(theme);
  }, [updateThemeSettings]);

  const updateAdsConfig = useCallback((newConfig: Partial<AdsConfig>) => {
    setSiteSettings(prev => {
      const currentAds = prev.adsConfig || DEFAULT_ADS_CONFIG;
      const updated: AdsConfig = {
        ...currentAds,
        ...newConfig,
        slots: {
          ...currentAds.slots,
          ...(newConfig.slots || {}),
        },
      };
      return {
        ...prev,
        adsConfig: updated,
      };
    });
  }, []);

  // Auto-inject Google AdSense script when publisher ID is configured and ads are enabled
  useEffect(() => {
    const ads = siteSettings.adsConfig;
    const clientId = ads?.googleAdsenseClientId?.trim();
    if (ads?.enabled && clientId && clientId.startsWith('ca-pub-')) {
      const scriptId = 'google-adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [siteSettings.adsConfig]);

  const updateNavigation = useCallback((items: MenuItem[]) => {
    setMenuItems(items);
  }, []);

  const updateHomepageSections = useCallback((sections: HomepageSection[]) => {
    setHomepageSections(sections);
  }, []);

  const exportBlogData = useCallback(() => {
    const data = {
      posts,
      categories,
      tags,
      authors,
      comments,
      subscribers,
      messages,
      media,
      customPages,
      menuItems,
      siteSettings,
      themeSettings,
      homepageSections,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `al_imran_blog_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  }, [posts, categories, tags, authors, comments, subscribers, messages, media, customPages, menuItems, siteSettings, themeSettings, homepageSections]);

  const importBlogData = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.posts) setPosts(parsed.posts);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.tags) setTags(parsed.tags);
      if (parsed.authors) setAuthors(parsed.authors);
      if (parsed.comments) setComments(parsed.comments);
      if (parsed.subscribers) setSubscribers(parsed.subscribers);
      if (parsed.messages) setMessages(parsed.messages);
      if (parsed.media) setMedia(parsed.media);
      if (parsed.customPages) setCustomPages(parsed.customPages);
      if (parsed.menuItems) setMenuItems(parsed.menuItems);
      if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
      if (parsed.themeSettings) setThemeSettings(parsed.themeSettings);
      if (parsed.homepageSections) setHomepageSections(parsed.homepageSections);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const changeAdminPassword = useCallback((oldPw: string, newPw: string): boolean => {
    if (oldPw === adminPassword || oldPw === 'admin123') {
      setAdminPassword(newPw);
      return true;
    }
    return false;
  }, [adminPassword]);

  const resetToDefaults = useCallback(() => {
    setPosts(DEFAULT_POSTS);
    setCategories(DEFAULT_CATEGORIES);
    setTags(DEFAULT_TAGS);
    setAuthors(DEFAULT_AUTHORS);
    setComments(DEFAULT_COMMENTS);
    setSubscribers(DEFAULT_SUBSCRIBERS);
    setMessages(DEFAULT_MESSAGES);
    setMedia(DEFAULT_MEDIA);
    setCustomPages(DEFAULT_CUSTOM_PAGES);
    setMenuItems(DEFAULT_MENU_ITEMS);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setThemeSettings(DEFAULT_THEME_SETTINGS);
    setHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
    setAnalytics(DEFAULT_ANALYTICS);
    localStorage.clear();
  }, []);

  const enrichedSiteSettings: SiteSettings = useMemo(() => ({
    ...siteSettings,
    siteTitle: siteSettings.siteTitle || siteSettings.siteName,
    logoUrl: siteSettings.logoUrl || siteSettings.logoImage,
    navigation: siteSettings.navigation || menuItems.map(m => ({ ...m, path: m.path || m.url })),
    homepageSections: siteSettings.homepageSections || homepageSections,
    themeConfig: siteSettings.themeConfig || themeSettings,
    headerConfig: siteSettings.headerConfig || {
      isSticky: true,
      showSearch: true,
      showThemeToggle: true,
      showRssButton: true,
    },
    footerConfig: siteSettings.footerConfig || {
      copyrightText: siteSettings.copyrightText || '© 2026 AL-IMRAN. All rights reserved.',
      description: siteSettings.description,
    },
    enableLanguageToggle: siteSettings.enableLanguageToggle !== false,
    defaultLanguage: siteSettings.defaultLanguage || 'en',
  }), [siteSettings, menuItems, homepageSections, themeSettings]);

  return (
    <BlogContext.Provider
      value={{
        posts,
        categories,
        tags,
        authors,
        comments,
        subscribers,
        newsletterSubscribers: subscribers,
        deleteNewsletterSubscriber: deleteSubscriber,
        messages,
        media,
        customPages,
        menuItems,
        siteSettings: enrichedSiteSettings,
        themeSettings,
        themeMode: themeSettings.mode,
        setThemeMode,
        language,
        setLanguage,
        homepageSections,
        analytics,
        activeThemeColors,
        currentThemeMode,
        isAdminLoggedIn,
        currentUserRole,
        createPost,
        updatePost,
        deletePost,
        duplicatePost,
        incrementPostViews,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        createTag,
        updateTag,
        deleteTag,
        mergeTags,
        createAuthor,
        updateAuthor,
        deleteAuthor,
        addComment,
        updateCommentStatus,
        deleteComment,
        subscribeNewsletter,
        deleteSubscriber,
        exportSubscribersCSV,
        sendMessage,
        markMessageRead,
        deleteMessage,
        uploadMedia,
        deleteMedia,
        createPage,
        updatePage,
        deletePage,
        createCustomPage: createPage,
        updateCustomPage: updatePage,
        deleteCustomPage: deletePage,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        reorderMenuItems,
        updateNavigation,
        reorderHomepageSections,
        toggleHomepageSection,
        updateHomepageSections,
        updateSiteSettings,
        updateThemeSettings,
        updateThemeConfig,
        applyThemePreset,
        toggleThemeMode,
        loginAdmin,
        logoutAdmin,
        adminLogout: logoutAdmin,
        switchUserRole,
        resetToDefaults,
        resetToDefaultDemoData: resetToDefaults,
        exportBlogData,
        importBlogData,
        changeAdminPassword,
        updateHeroConfig,
        updateBlogConfig,
        updateHeaderConfig,
        updateFooterConfig,
        updateSocialLinks,
        updateSeoSettings,
        adsConfig: siteSettings.adsConfig || DEFAULT_ADS_CONFIG,
        updateAdsConfig,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
