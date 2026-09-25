export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type UserRole = 'super_admin' | 'editor';

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  email: string;
  website?: string;
  role: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon?: string;
  image?: string;
  order: number;
  enabled: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface PostSEO {
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  postTitle?: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'spam';
  parentId?: string; // for nested replies
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageCaption?: string;
  categoryId: string;
  tags: string[];
  authorId: string;
  status: PostStatus;
  isFeatured: boolean;
  publishedAt: string;
  updatedAt: string;
  scheduledAt?: string;
  readingTimeMinutes: number;
  viewsCount: number;
  seo: PostSEO;
  allowComments: boolean;
  language?: 'en' | 'bn';
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  sizeKb: number;
  dimensions?: string;
  createdAt: string;
  mimeType: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  seoTitle?: string;
  metaDescription?: string;
  status: 'published' | 'draft';
  isPublished?: boolean;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
  status?: 'active' | 'unsubscribed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  read?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  path?: string;
  isExternal?: boolean;
  order: number;
  enabled: boolean;
}

export type NavItem = MenuItem;

export interface ThemeColors {
  primaryBg: string;
  secondaryBg: string;
  primaryText: string;
  secondaryText: string;
  border: string;
  cardBg: string;
  primaryAccent: string;
  buttonBg: string;
  buttonText: string;
  hover: string;
  headerBg: string;
  footerBg: string;
  linkColor: string;
}

export interface TypographySettings {
  fontFamily: string; // 'Plus Jakarta Sans' | 'Inter' | 'Hind Siliguri' | 'Noto Sans Bengali' | 'Playfair Display'
  headingFont: string;
  bodyFont: string;
  banglaFont?: string;
  codeFont?: string;
  baseSize?: string;
  baseFontSizePx: number;
  headingScale: number; // 1.15 to 1.35
  lineHeight: number; // 1.5 to 1.8
  letterSpacing: string; // 'normal' | 'tight' | 'wide'
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  lightColors: ThemeColors;
  darkColors: ThemeColors;
  typography: TypographySettings;
  borderRadiusPx: number;
  containerMaxWidthPx: number;
  cardShadow: 'none' | 'subtle' | 'soft';
  // Aliases for convenience
  light?: any;
  dark?: any;
  borderRadius?: string;
  containerWidth?: string;
}

export type ThemeConfig = ThemeSettings;

export interface HomepageSection {
  id: string;
  type: 'hero' | 'latest' | 'popular' | 'categories' | 'newsletter' | 'custom_html' | 'featured_highlight';
  title?: string;
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

export type AdSlotLocation = 'header_top' | 'in_article' | 'homepage_feed' | 'sidebar' | 'footer_above';

export type AdType = 'adsense' | 'custom_banner' | 'custom_code';

export interface AdSlotConfig {
  id: AdSlotLocation;
  name: string;
  nameBn?: string;
  enabled: boolean;
  type: AdType;
  // Google AdSense fields:
  adClient?: string; // e.g. "ca-pub-xxxxxxxxxxxxxxxx"
  adSlotId?: string; // e.g. "1234567890"
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  // Custom Banner / Affiliate / Link fields:
  bannerImageUrl?: string;
  targetUrl?: string;
  altText?: string;
  openInNewTab?: boolean;
  // Custom Raw HTML / JS Ad tag:
  customCode?: string;
}

export interface AdsConfig {
  enabled: boolean;
  googleAdsenseClientId?: string; // Global Publisher ID, e.g. ca-pub-XXXXXXXXXXXXXXXX
  autoAdsEnabled?: boolean;
  testMode?: boolean; // Shows placeholder boxes when enabled
  slots: Record<AdSlotLocation, AdSlotConfig>;
}

export interface SiteSettings {
  siteName: string;
  siteTitle?: string;
  tagline: string;
  description: string;
  logoText: string;
  logoImage?: string;
  logoUrl?: string;
  logoIcon?: string;
  favicon?: string;
  authorName: string;
  authorPhoto: string;
  footerText: string;
  copyrightText: string;
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  defaultLanguage?: 'en' | 'bn';
  enableLanguageToggle?: boolean;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
    telegram?: string;
    instagram?: string;
  };
  sidebar: {
    showSearch: boolean;
    showCategories: boolean;
    showPopularPosts: boolean;
    showRecentPosts: boolean;
    showNewsletter: boolean;
  };
  heroConfig: {
    enabled: boolean;
    selectedPostId?: string;
    layout: 'overlay' | 'split' | 'minimal';
    height: 'compact' | 'medium' | 'tall';
    overlayOpacity: number;
    buttonText: string;
  };
  blogConfig: {
    postsPerPage: number;
    gridColumns: 1 | 2 | 3;
    cardStyle: 'editorial' | 'bordered' | 'minimal';
    showAuthor: boolean;
    showReadingTime: boolean;
    showViewCount: boolean;
    showCategoryBadge: boolean;
    showDate: boolean;
    showExcerpt?: boolean;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultMetaDescription: string;
    defaultOgImage?: string;
    robotsTxt: string;
    metaTitleDefault?: string;
    metaDescriptionDefault?: string;
    ogImageDefault?: string;
    twitterCard?: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
    canonicalBaseUrl?: string;
  };
  headerConfig?: {
    isSticky: boolean;
    showSearch: boolean;
    showThemeToggle: boolean;
    showRssButton: boolean;
  };
  footerConfig?: {
    copyrightText: string;
    description?: string;
  };
  navigation?: MenuItem[];
  homepageSections?: HomepageSection[];
  themeConfig?: ThemeSettings;
  adsConfig?: AdsConfig;
}

export interface AnalyticsData {
  totalViews: number;
  dailyViews: { date: string; views: number }[];
  topSources: { source: string; percentage: number }[];
  devices: { device: string; count: number }[];
}
