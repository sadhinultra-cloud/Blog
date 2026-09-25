import {
  Author,
  Category,
  Tag,
  Post,
  Comment,
  MediaItem,
  CustomPage,
  NewsletterSubscriber,
  ContactMessage,
  MenuItem,
  SiteSettings,
  ThemeSettings,
  HomepageSection,
  AnalyticsData,
  AdsConfig,
} from '../types';

export const THEME_PRESETS: { name: string; light: any; dark: any }[] = [
  {
    name: 'Classic Black & White',
    light: {
      primaryBg: '#FFFFFF',
      secondaryBg: '#F7F7F7',
      primaryText: '#111111',
      secondaryText: '#666666',
      border: '#E5E5E5',
      cardBg: '#FFFFFF',
      primaryAccent: '#111111',
      buttonBg: '#111111',
      buttonText: '#FFFFFF',
      hover: '#333333',
      headerBg: '#FFFFFF',
      footerBg: '#0B0B0B',
      linkColor: '#111111',
    },
    dark: {
      primaryBg: '#0B0B0B',
      secondaryBg: '#141414',
      primaryText: '#FFFFFF',
      secondaryText: '#A1A1A1',
      border: '#292929',
      cardBg: '#141414',
      primaryAccent: '#FFFFFF',
      buttonBg: '#FFFFFF',
      buttonText: '#111111',
      hover: '#E5E5E5',
      headerBg: '#0B0B0B',
      footerBg: '#050505',
      linkColor: '#F3F4F6',
    },
  },
  {
    name: 'Modern Blue',
    light: {
      primaryBg: '#FAFAFA',
      secondaryBg: '#EFF6FF',
      primaryText: '#0F172A',
      secondaryText: '#475569',
      border: '#E2E8F0',
      cardBg: '#FFFFFF',
      primaryAccent: '#2563EB',
      buttonBg: '#2563EB',
      buttonText: '#FFFFFF',
      hover: '#1D4ED8',
      headerBg: '#FFFFFF',
      footerBg: '#0F172A',
      linkColor: '#2563EB',
    },
    dark: {
      primaryBg: '#090D16',
      secondaryBg: '#0F172A',
      primaryText: '#F8FAFC',
      secondaryText: '#94A3B8',
      border: '#1E293B',
      cardBg: '#0F172A',
      primaryAccent: '#3B82F6',
      buttonBg: '#3B82F6',
      buttonText: '#FFFFFF',
      hover: '#60A5FA',
      headerBg: '#090D16',
      footerBg: '#05070B',
      linkColor: '#60A5FA',
    },
  },
  {
    name: 'Emerald',
    light: {
      primaryBg: '#FBFDFB',
      secondaryBg: '#F0FDF4',
      primaryText: '#064E3B',
      secondaryText: '#374151',
      border: '#E5E7EB',
      cardBg: '#FFFFFF',
      primaryAccent: '#059669',
      buttonBg: '#059669',
      buttonText: '#FFFFFF',
      hover: '#047857',
      headerBg: '#FFFFFF',
      footerBg: '#06281E',
      linkColor: '#059669',
    },
    dark: {
      primaryBg: '#051A14',
      secondaryBg: '#0B2920',
      primaryText: '#ECFDF5',
      secondaryText: '#A7F3D0',
      border: '#144637',
      cardBg: '#0B2920',
      primaryAccent: '#10B981',
      buttonBg: '#10B981',
      buttonText: '#064E3B',
      hover: '#34D399',
      headerBg: '#051A14',
      footerBg: '#020C09',
      linkColor: '#34D399',
    },
  },
  {
    name: 'Crimson',
    light: {
      primaryBg: '#FFFDFD',
      secondaryBg: '#FFF1F2',
      primaryText: '#18181B',
      secondaryText: '#52525B',
      border: '#E4E4E7',
      cardBg: '#FFFFFF',
      primaryAccent: '#E11D48',
      buttonBg: '#E11D48',
      buttonText: '#FFFFFF',
      hover: '#BE123C',
      headerBg: '#FFFFFF',
      footerBg: '#18181B',
      linkColor: '#E11D48',
    },
    dark: {
      primaryBg: '#0F080A',
      secondaryBg: '#1F1014',
      primaryText: '#FAFAFA',
      secondaryText: '#A1A1AA',
      border: '#3F1D27',
      cardBg: '#1F1014',
      primaryAccent: '#FB7185',
      buttonBg: '#FB7185',
      buttonText: '#0F080A',
      hover: '#F43F5E',
      headerBg: '#0F080A',
      footerBg: '#080405',
      linkColor: '#FB7185',
    },
  },
  {
    name: 'Minimal Gray',
    light: {
      primaryBg: '#F8F9FA',
      secondaryBg: '#F1F3F5',
      primaryText: '#212529',
      secondaryText: '#495057',
      border: '#DEE2E6',
      cardBg: '#FFFFFF',
      primaryAccent: '#343A40',
      buttonBg: '#212529',
      buttonText: '#FFFFFF',
      hover: '#495057',
      headerBg: '#FFFFFF',
      footerBg: '#1A1D20',
      linkColor: '#343A40',
    },
    dark: {
      primaryBg: '#121212',
      secondaryBg: '#1A1A1A',
      primaryText: '#E0E0E0',
      secondaryText: '#9E9E9E',
      border: '#2E2E2E',
      cardBg: '#1A1A1A',
      primaryAccent: '#CCCCCC',
      buttonBg: '#E0E0E0',
      buttonText: '#121212',
      hover: '#FFFFFF',
      headerBg: '#121212',
      footerBg: '#080808',
      linkColor: '#CCCCCC',
    },
  },
];

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  mode: 'light',
  lightColors: {
    primaryBg: '#FFFFFF',
    secondaryBg: '#F7F7F7',
    primaryText: '#111111',
    secondaryText: '#666666',
    border: '#E5E5E5',
    cardBg: '#FFFFFF',
    primaryAccent: '#111111',
    buttonBg: '#111111',
    buttonText: '#FFFFFF',
    hover: '#333333',
    headerBg: '#FFFFFF',
    footerBg: '#0B0B0B',
    linkColor: '#111111',
  },
  darkColors: {
    primaryBg: '#0B0B0B',
    secondaryBg: '#141414',
    primaryText: '#FFFFFF',
    secondaryText: '#A1A1A1',
    border: '#292929',
    cardBg: '#141414',
    primaryAccent: '#FFFFFF',
    buttonBg: '#FFFFFF',
    buttonText: '#111111',
    hover: '#D4D4D4',
    headerBg: '#0B0B0B',
    footerBg: '#050505',
    linkColor: '#F3F4F6',
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    baseFontSizePx: 16,
    headingScale: 1.25,
    lineHeight: 1.65,
    letterSpacing: 'normal',
  },
  borderRadiusPx: 12,
  containerMaxWidthPx: 1240,
  cardShadow: 'subtle',
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'AL-IMRAN BLOG',
  tagline: 'Technology • Learning • Lifestyle',
  description: 'A distinguished publication exploring deep software engineering, system architecture, modern design aesthetics, and reflective essays.',
  logoText: 'AL-IMRAN',
  logoIcon: 'Feather',
  authorName: 'Al-Imran',
  authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  footerText: 'An independent digital publication dedicated to thoughtful technical analysis, intentional product architecture, and insightful human curiosity.',
  copyrightText: '© 2026 AL-IMRAN. All rights reserved.',
  contactEmail: 'contact@al-imran.me',
  socialLinks: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    telegram: 'https://telegram.org',
  },
  sidebar: {
    showSearch: true,
    showCategories: true,
    showPopularPosts: true,
    showRecentPosts: true,
    showNewsletter: true,
  },
  heroConfig: {
    enabled: true,
    selectedPostId: 'post-1',
    layout: 'overlay',
    height: 'medium',
    overlayOpacity: 0.55,
    buttonText: 'Read Full Feature',
  },
  blogConfig: {
    postsPerPage: 6,
    gridColumns: 3,
    cardStyle: 'editorial',
    showAuthor: true,
    showReadingTime: true,
    showViewCount: true,
    showCategoryBadge: true,
    showDate: true,
  },
  seo: {
    defaultTitle: 'AL-IMRAN — Technology, Learning & Modern Architecture',
    titleTemplate: '%s | AL-IMRAN Publication',
    defaultMetaDescription: 'A high-end editorial blog covering progressive web architecture, engineering leadership, and intentional living.',
    defaultOgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    robotsTxt: `User-agent: *\nAllow: /\nSitemap: https://al-imran.me/sitemap.xml`,
  },
  adsConfig: {
    enabled: false,
    googleAdsenseClientId: '',
    autoAdsEnabled: false,
    testMode: false,
    slots: {
      header_top: {
        id: 'header_top',
        name: 'Header Top / Below Navigation',
        nameBn: 'হেডার ব্যানার (মেনুর নিচে)',
        enabled: false,
        type: 'adsense',
        adClient: '',
        adSlotId: '',
        adFormat: 'horizontal',
        bannerImageUrl: '',
        targetUrl: '',
        altText: 'Promoted Advertisement',
        openInNewTab: true,
        customCode: '',
      },
      in_article: {
        id: 'in_article',
        name: 'In-Article / Inside Post Content',
        nameBn: 'পোস্টের ভেতর বিজ্ঞাপন (মাঝখানে)',
        enabled: false,
        type: 'adsense',
        adClient: '',
        adSlotId: '',
        adFormat: 'rectangle',
        bannerImageUrl: '',
        targetUrl: '',
        altText: 'Editorial Sponsor',
        openInNewTab: true,
        customCode: '',
      },
      homepage_feed: {
        id: 'homepage_feed',
        name: 'Homepage Magazine Feed Banner',
        nameBn: 'হোমপেজ সেকশন ব্যানার',
        enabled: false,
        type: 'adsense',
        adClient: '',
        adSlotId: '',
        adFormat: 'horizontal',
        bannerImageUrl: '',
        targetUrl: '',
        altText: 'Special Partner',
        openInNewTab: true,
        customCode: '',
      },
      sidebar: {
        id: 'sidebar',
        name: 'Sidebar / Aside Widget Banner',
        nameBn: 'সাইডবার ব্যানার বিজ্ঞাপন',
        enabled: false,
        type: 'adsense',
        adClient: '',
        adSlotId: '',
        adFormat: 'vertical',
        bannerImageUrl: '',
        targetUrl: '',
        altText: 'Featured Sponsor',
        openInNewTab: true,
        customCode: '',
      },
      footer_above: {
        id: 'footer_above',
        name: 'Above Footer Banner',
        nameBn: 'ফুটারের ওপরের বিজ্ঞাপন',
        enabled: false,
        type: 'adsense',
        adClient: '',
        adSlotId: '',
        adFormat: 'horizontal',
        bannerImageUrl: '',
        targetUrl: '',
        altText: 'Advertisement',
        openInNewTab: true,
        customCode: '',
      },
    },
  },
};

export const DEFAULT_ADS_CONFIG: AdsConfig = DEFAULT_SITE_SETTINGS.adsConfig!;

export const DEFAULT_AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Al-Imran',
    slug: 'al-imran',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Systems architect, writer, and open-source enthusiast. Writing about distributed consensus, functional paradigms, and minimalist design craft.',
    email: 'imran@example.com',
    website: 'https://al-imran.me',
    role: 'Editor-in-Chief',
    socialLinks: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'author-2',
    name: 'Sarah Jenkins',
    slug: 'sarah-jenkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    bio: 'Product designer and accessibility advocate. Specializes in typography scales, design tokens, and humane user experiences.',
    email: 'sarah.j@example.com',
    website: 'https://sarahjenkins.design',
    role: 'Contributing Editor',
    socialLinks: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'author-3',
    name: 'Tanvir Ahmed',
    slug: 'tanvir-ahmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Cloud security researcher and developer. Passionate about zero-trust networks, Linux internals, and Bengali tech literature.',
    email: 'tanvir@example.com',
    website: 'https://tanvir.dev',
    role: 'Senior Tech Writer',
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Technology',
    slug: 'technology',
    description: 'Breakthroughs in compute, edge infrastructure, and emergent AI capabilities.',
    color: '#4F46E5',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    order: 1,
    enabled: true,
  },
  {
    id: 'cat-2',
    name: 'Programming',
    slug: 'programming',
    description: 'Clean coding practices, static type systems, compilers, and algorithmic clarity.',
    color: '#0284C7',
    icon: 'Code',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    order: 2,
    enabled: true,
  },
  {
    id: 'cat-3',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern frontend architecture, rendering engines, and high-performance Web standards.',
    color: '#059669',
    icon: 'Globe',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    order: 3,
    enabled: true,
  },
  {
    id: 'cat-4',
    name: 'Security',
    slug: 'security',
    description: 'Cryptographic defenses, zero-trust infrastructure, and cyber durability analysis.',
    color: '#E11D48',
    icon: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    order: 4,
    enabled: true,
  },
  {
    id: 'cat-5',
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Deep-dive walkthroughs, reproducible guides, and masterclasses.',
    color: '#D97706',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    order: 5,
    enabled: true,
  },
  {
    id: 'cat-6',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Deep work, cognitive clarity, intentional minimalism, and mindful reading.',
    color: '#7C3AED',
    icon: 'Coffee',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    order: 6,
    enabled: true,
  },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: 'tag-1', name: 'Architecture', slug: 'architecture', count: 4 },
  { id: 'tag-2', name: 'TypeScript', slug: 'typescript', count: 3 },
  { id: 'tag-3', name: 'Performance', slug: 'performance', count: 3 },
  { id: 'tag-4', name: 'Editorial Design', slug: 'editorial-design', count: 2 },
  { id: 'tag-5', name: 'AI & Inference', slug: 'ai-inference', count: 2 },
  { id: 'tag-6', name: 'Cybersecurity', slug: 'cybersecurity', count: 1 },
  { id: 'tag-7', name: 'বাংলা ব্লগ', slug: 'bangla-blog', count: 1 },
];

export const DEFAULT_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'The Architecture of Modern Editorial Systems: Crafting Timeless Digital Reading',
    slug: 'architecture-modern-editorial-systems',
    subtitle: 'Why purposeful typography, proportional whitespace, and dynamic theming outperform generic web design.',
    excerpt: 'Examining how deliberate editorial layouts, strict optical spacing, and adaptive color token systems elevate digital content into an engaging reader experience.',
    content: `## The Modern Crisis of Digital Reading

When we observe contemporary online publications, a paradox emerges. Despite vastly superior displays, retina pixel densities, and faster networks, the standard reading experience has arguably deteriorated. Intrusive popups, cluttered widget sidebars, erratic layout shifts, and inconsistent typography create cognitive friction.

> "A great editorial publication does not shout for your attention. It quietly earns your contemplation through disciplined balance, optical proportion, and restful whitespace."

### 1. Typography as the Core Pillar

In print publications like *The New Yorker*, *Monocle*, or *Wired*, typography is never an afterthought. Letters possess weight, breathing room, and intentional relationship to the baseline grid. 

To achieve this in high-performance digital environments, we must establish strict mathematical constraints:

- **Baseline Step Ratio**: Aim for a step scale of **1.25** (Major Third) or **1.333** (Perfect Fourth).
- **Line Length Constraints**: Constrain editorial reading columns to **65–75 characters (ch)**. A line wider than 800px strains human ocular saccades.
- **Rhythmic Vertical Padding**: Section divisions should follow logarithmic rhythm—generous between thoughts, compact between related declarations.

\`\`\`typescript
// Defining optical rhythm and editorial scale
export interface TypographyScale {
  h1: '2.5rem';    // 40px
  h2: '1.875rem';  // 30px
  h3: '1.5rem';    // 24px
  body: '1.0625rem'; // 17px
  lineHeight: 1.68;
  maxMeasure: '72ch';
}
\`\`\`

### 2. Dynamic Color Tokens & Visual Harmony

Rather than relying on stark pure black (\`#000000\`) against stark pure white (\`#FFFFFF\`), timeless publications infuse subtle warmth or coolness into their neutral spectrums. 

> **Important Takeaway**: When designing dark themes, keep contrast ratios comfortably compliant with WCAG AA (at least 4.5:1 for body copy), yet avoid glowing neon whites that induce ocular fatigue during extended evening reading sessions.

### 3. Micro-Interactions and Respecting the Reader

Every transition must feel natural. Notice how smooth scroll indicators, subtle image zooms on hover, and effortless table of contents navigation respect reader focus rather than distracting from the prose.

We built this blog engine to honor that exact philosophy: complete aesthetic control in your hands, paired with an uncompromising standard of editorial quality.`,
    featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'The intersection of minimalist craftsmanship and modern digital publishing.',
    categoryId: 'cat-1',
    tags: ['Architecture', 'Editorial Design', 'Performance'],
    authorId: 'author-1',
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
    readingTimeMinutes: 6,
    viewsCount: 1420,
    seo: {
      seoTitle: 'Architecture of Modern Editorial Systems | AL-IMRAN',
      metaDescription: 'Discover why purposeful typography, proportional whitespace, and dynamic theming outperform generic web design.',
      focusKeyword: 'editorial systems',
    },
    allowComments: true,
    language: 'en',
  },
  {
    id: 'post-2',
    title: 'প্রযুক্তির বিবর্তন ও ডিজিটাল ভবিষ্যৎ: আমাদের ভাবনার নতুন দিগন্ত',
    slug: 'technology-evolution-and-digital-future-bangla',
    subtitle: 'আধুনিক ওয়েব প্রযুক্তি, কৃত্রিম বুদ্ধিমত্তা এবং বাংলা ভাষায় টেকনোলজি চর্চার গুরুত্ব।',
    excerpt: 'তথ্যপ্রযুক্তির দ্রুত পরিবর্তনশীল যুগে কীভাবে আধুনিক সিস্টেম আর্কিটেকচার এবং বাংলা ফন্ট রেন্ডারিং আমাদের জন্য নতুন সুযোগ সৃষ্টি করছে তার বিস্তারিত বিশ্লেষণ।',
    content: `## প্রযুক্তির নতুন বিপ্লব ও আমাদের প্রস্তুতি

বর্তমান বিশ্বের প্রযুক্তিগত পরিমণ্ডলে প্রতিনিয়ত অভাবনীয় পরিবর্তন আসছে। কৃত্রিম বুদ্ধিমত্তা (AI), ক্লাউড কম্পিউটিং এবং আধুনিক ডিসট্রিবিউটেড সিস্টেম এখন শুধুমাত্র গবেষণাগারের বিষয় নয়, বরং আমাদের প্রাত্যহিক জীবনের অবিচ্ছেদ্য অংশ।

> "প্রযুক্তির আসল সৌন্দর্য নিহিত রয়েছে এর সার্বজনীন ব্যবহারে। যখন একটি প্রযুক্তি মানুষের ভাষা ও সংস্কৃতির সাথে একাত্ম হতে পারে, তখনই তার সত্যিকারের প্রভাব প্রকাশ পায়।"

### বাংলা ফন্টের আধুনিকায়ন ও রিডিং এক্সপেরিয়েন্স

ওয়েব প্ল্যাটফর্মে বাংলা লেখার নান্দনিক উপস্থাপন দীর্ঘদিন ধরে একটি চ্যালেঞ্জ ছিল। তবে গুগল ফন্টের **হিন্দ শিলিগুড়ি (Hind Siliguri)** এবং **নোটো সান্স বেঙ্গলি (Noto Sans Bengali)** ফন্ট ব্যবহারের মাধ্যমে বাংলা টেক্সটের স্পষ্টতা ও সৌন্দর্য বহুলাংশে বৃদ্ধি পেয়েছে।

\`\`\`css
/* বাংলা টাইপোগ্রাফির সুনির্দিষ্ট বিন্যাস */
.bangla-editorial {
  font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif;
  line-height: 1.8;
  font-size: 1.125rem;
  letter-spacing: 0.01em;
}
\`\`\`

### ভবিষ্যতের টেকনোলজি ও সম্ভাবনা

1. **বুদ্ধিমান অটোমেশন**: জটিল কাজগুলো দ্রুত ও নিখুঁতভাবে সম্পন্ন করা।
2. **সুরক্ষিত ক্লাউড পরিকাঠামো**: ডেটা সুরক্ষা এবং জিরো-ট্রাস্ট সিকিউরিটির বাস্তবায়ন।
3. **উন্মুক্ত জ্ঞানের বিস্তার**: প্রযুক্তিগত জ্ঞান সহজবোধ্য ভাষায় সবার কাছে পৌঁছে দেওয়া।

আমরা বিশ্বাস করি, প্রযুক্তি ও চিন্তার মেলবন্ধনে সমৃদ্ধ হবে আমাদের আগামীর ডিজিটাল পথচলা।`,
    featuredImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'প্রযুক্তি এবং মানবীয় মেধার সমন্বয়ে নির্মিত আগামীর সম্ভাবনা।',
    categoryId: 'cat-2',
    tags: ['বাংলা ব্লগ', 'Architecture', 'TypeScript'],
    authorId: 'author-3',
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-09-17T08:30:00Z',
    updatedAt: '2026-09-19T11:00:00Z',
    readingTimeMinutes: 5,
    viewsCount: 980,
    seo: {
      seoTitle: 'প্রযুক্তির বিবর্তন ও ডিজিটাল ভবিষ্যৎ | AL-IMRAN',
      metaDescription: 'আধুনিক ওয়েব প্রযুক্তি ও বাংলা টেকনোলজি চর্চার গুরুত্ব নিয়ে বিশদ পর্যালোচনা।',
      focusKeyword: 'বাংলা ব্লগ প্রযুক্তি',
    },
    allowComments: true,
    language: 'bn',
  },
  {
    id: 'post-3',
    title: 'Zero-Trust Networks in Edge Computing: A Pragmatic Defense Blueprint',
    slug: 'zero-trust-networks-edge-computing',
    subtitle: 'Eliminating implicit trust across decentralized micro-gateways and serverless clusters.',
    excerpt: 'A comprehensive engineering guide on mutual TLS, ephemeral token exchange, and hardware-attested trust boundaries in mission-critical deployments.',
    content: `## The Fallacy of Perimeter Security

In traditional network topography, the corporate intranet was treated as a fortified castle. Once traffic breached the outer firewall, internal lateral movement was relatively unrestricted. 

With distributed edge nodes, Kubernetes clusters spanning multi-cloud regions, and remote workers connecting from across the globe, the perimeter has completely dissolved.

### Core Tenets of Zero-Trust

1. **Verify Explicitly**: Always authenticate and authorize based on all available data points.
2. **Use Least Privileged Access**: Limit user access with Just-In-Time and Just-Enough-Access.
3. **Assume Breach**: Minimize blast radius and segment access. Verify end-to-end encryption.

\`\`\`typescript
// Ephemeral mTLS handshake authorization
interface EdgeSecurityContext {
  clientIdentity: string;
  hardwareFingerprint: string;
  tokenExpiresAt: number;
  scopes: readonly ['read:telemetry', 'write:edge_logs'];
}
\`\`\`

> Security is not a product you acquire; it is a discipline of relentless verification and bounded risk.`,
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'High-density edge clusters requiring continuous zero-trust validation.',
    categoryId: 'cat-4',
    tags: ['Cybersecurity', 'Architecture', 'Performance'],
    authorId: 'author-3',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-09-15T14:15:00Z',
    updatedAt: '2026-09-16T18:00:00Z',
    readingTimeMinutes: 7,
    viewsCount: 1140,
    seo: {
      seoTitle: 'Zero-Trust Networks in Edge Computing | AL-IMRAN',
      metaDescription: 'A pragmatic blueprint for zero-trust security architecture across distributed edge clusters.',
      focusKeyword: 'zero trust edge',
    },
    allowComments: true,
    language: 'en',
  },
  {
    id: 'post-4',
    title: 'Mastering TypeScript 5.8: Type-Safe Invariant State Modeling',
    slug: 'mastering-typescript-invariant-state-modeling',
    subtitle: 'Leveraging discriminated unions, template literal types, and satisfaction operators to eliminate impossible states.',
    excerpt: 'How to design compile-time guarantees that make invalid software configurations structurally impossible to compile.',
    content: `## Making Impossible States Unrepresentable

One of the most profound realizations in modern software engineering is that bugs are frequently the byproduct of lax data modeling. When an application can exist in ambiguous configurations—such as \`{ loading: true, error: "Network timeout", data: [...] }\`—runtime defensively checks balloon.

### The Power of Discriminated Unions

Instead of loose optional fields, construct strict finite state machines:

\`\`\`typescript
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading'; progressPercentage?: number }
  | { status: 'success'; data: T; timestamp: string }
  | { status: 'failure'; error: Error; canRetry: boolean };

function renderView<T>(state: RemoteData<T>) {
  switch (state.status) {
    case 'idle':
      return 'Press start to initiate sync.';
    case 'loading':
      return \`Loading: \${state.progressPercentage ?? 0}%\`;
    case 'success':
      return \`Rendered \${JSON.stringify(state.data)}\`;
    case 'failure':
      return \`Failed: \${state.error.message}\`;
  }
}
\`\`\`

By embracing static invariants, you shift defect detection from customer production environments directly into your local build pipeline.`,
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Writing rigorous, expressive TypeScript models with mathematical certainty.',
    categoryId: 'cat-2',
    tags: ['TypeScript', 'Programming', 'Clean Architecture'],
    authorId: 'author-1',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-09-12T11:00:00Z',
    updatedAt: '2026-09-13T09:20:00Z',
    readingTimeMinutes: 4,
    viewsCount: 820,
    seo: {
      seoTitle: 'Mastering TypeScript Invariant State Modeling | AL-IMRAN',
      metaDescription: 'Eliminate impossible runtime states with advanced TypeScript patterns and discriminated unions.',
      focusKeyword: 'typescript state modeling',
    },
    allowComments: true,
    language: 'en',
  },
  {
    id: 'post-5',
    title: 'The Art of Mindful Deep Work in an Era of Cognitive Fragmentation',
    slug: 'art-of-mindful-deep-work',
    subtitle: 'Protecting your attention span, structuring daily focus sprints, and recovering intellectual momentum.',
    excerpt: 'Practical strategies for engineers, designers, and thinkers to cultivate prolonged stretches of creative immersion amid persistent digital notifications.',
    content: `## The Modern Attention Economy

We live in an era where software products are explicitly optimized to harvest human attention. Every ping, badge, and red indicator stimulates micro-spikes of dopamine that fracture focus.

> "Deep work is the ability to focus without distraction on a cognitively demanding task. It is a skill that allows you to quickly master complicated information and produce better results in less time."

### Cultivating High-Yield Focus Rituals

1. **The Morning Monastic Block**: Dedicate the first 90 minutes of your workday strictly to primary synthesis—no email, no Slack, no messaging.
2. **Environment Anchoring**: Associate a specific physical or ambient condition (such as noise-canceling headphones with ambient binaural sound) strictly with deep focus.
3. **Shutdown Completeness**: Close open tabs, write down your starting intention for tomorrow morning, and physically log off.`,
    featuredImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Solitude and calm: prerequisites for deep intellectual synthesis.',
    categoryId: 'cat-6',
    tags: ['Editorial Design', 'Lifestyle'],
    authorId: 'author-2',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-09-09T09:00:00Z',
    updatedAt: '2026-09-10T12:00:00Z',
    readingTimeMinutes: 5,
    viewsCount: 750,
    seo: {
      seoTitle: 'The Art of Mindful Deep Work | AL-IMRAN',
      metaDescription: 'Strategies for safeguarding cognitive attention and producing high-value intellectual work.',
      focusKeyword: 'deep work',
    },
    allowComments: true,
    language: 'en',
  },
  {
    id: 'post-6',
    title: 'Designing Accessible Design Systems with Modern CSS Subgrid & Container Queries',
    slug: 'accessible-design-systems-css-subgrid',
    subtitle: 'Creating responsive components that adapt intuitively to their immediate layout containers rather than viewport extremes.',
    excerpt: 'A hands-on walkthrough demonstrating how CSS container queries, subgrid alignments, and relative color syntax streamline modern editorial components.',
    content: `## Beyond Primitive Media Queries

For over a decade, responsive web design relied on viewport dimensions (\`@media (min-width: 768px)\`). While adequate for simple layouts, it fundamentally broke the dream of truly autonomous, plug-and-play UI widgets.

A card component placed in a narrow sidebar required entirely separate styling than the same card placed in the main hero feed.

### Container Queries to the Rescue

\`\`\`css
.article-card-container {
  container-type: inline-size;
  container-name: article-card;
}

@container article-card (min-width: 450px) {
  .card-inner {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 1.5rem;
  }
}
\`\`\`

Now, wherever the card is mounted—in a multi-column bento grid, modal drawer, or full-width showcase—it seamlessly reformats itself to look proportional.`,
    featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Clean design system components adapting to structural container constraints.',
    categoryId: 'cat-3',
    tags: ['Editorial Design', 'Performance', 'Web Development'],
    authorId: 'author-2',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-09-05T16:00:00Z',
    updatedAt: '2026-09-06T10:00:00Z',
    readingTimeMinutes: 6,
    viewsCount: 640,
    seo: {
      seoTitle: 'Accessible Design Systems with Modern CSS | AL-IMRAN',
      metaDescription: 'Learn how modern CSS container queries and subgrid simplify robust responsive design.',
      focusKeyword: 'css container queries',
    },
    allowComments: true,
    language: 'en',
  },
];

export const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    postId: 'post-1',
    postTitle: 'The Architecture of Modern Editorial Systems',
    authorName: 'David Vance',
    authorEmail: 'david.v@example.com',
    authorWebsite: 'https://davidvance.io',
    content: 'This is the most cohesive breakdown of digital typography constraints I have read in months. The point about restricting reading widths to 72ch makes an enormous psychological difference in reading stamina.',
    createdAt: '2026-09-19T11:20:00Z',
    status: 'approved',
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    postTitle: 'The Architecture of Modern Editorial Systems',
    authorName: 'Al-Imran',
    authorEmail: 'imran@example.com',
    content: 'Thank you David! That optical proportion rule is something we took directly from vintage book typography and adapted into our dynamic CSS variable layout.',
    createdAt: '2026-09-19T13:40:00Z',
    status: 'approved',
    parentId: 'comm-1',
  },
  {
    id: 'comm-3',
    postId: 'post-2',
    postTitle: 'প্রযুক্তির বিবর্তন ও ডিজিটাল ভবিষ্যৎ',
    authorName: 'রাকিবুল হাসান',
    authorEmail: 'rakib@example.com',
    content: 'বাংলায় এমন চমৎকার এবং আধুনিক টেকনিক্যাল আর্টিকেল আরও বেশি প্রয়োজন। ফন্ট সিলেকশন এবং লেআউট অসাধারণ হয়েছে!',
    createdAt: '2026-09-18T14:10:00Z',
    status: 'approved',
  },
  {
    id: 'comm-4',
    postId: 'post-4',
    postTitle: 'Mastering TypeScript 5.8',
    authorName: 'CryptoMarketer2026',
    authorEmail: 'spam@cryptobot.xyz',
    content: 'Click here for guaranteed 500% daily returns with autonomous algorithmic trading...',
    createdAt: '2026-09-20T04:12:00Z',
    status: 'spam',
  },
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'm-1', label: 'Home', url: '/', order: 1, enabled: true },
  { id: 'm-2', label: 'Blog', url: '/blog', order: 2, enabled: true },
  { id: 'm-3', label: 'Categories', url: '/categories', order: 3, enabled: true },
  { id: 'm-4', label: 'Projects', url: '/projects', order: 4, enabled: true },
  { id: 'm-5', label: 'About', url: '/about', order: 5, enabled: true },
  { id: 'm-6', label: 'Contact', url: '/contact', order: 6, enabled: true },
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'sec-hero', type: 'hero', title: 'Featured Editorial Highlight', enabled: true, order: 1 },
  { id: 'sec-latest', type: 'latest', title: 'Latest Dispatches', enabled: true, order: 2 },
  { id: 'sec-popular', type: 'popular', title: 'Trending & Essential Reads', enabled: true, order: 3 },
  { id: 'sec-categories', type: 'categories', title: 'Explore by Discipline', enabled: true, order: 4 },
  { id: 'sec-newsletter', type: 'newsletter', title: 'Editorial Newsletter', enabled: true, order: 5 },
];

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-about',
    title: 'About AL-IMRAN',
    slug: 'about',
    content: `# About This Publication

Welcome to **AL-IMRAN**, an independent digital journal focused on high-order software architecture, timeless product craft, and thoughtful exploration of human ingenuity.

Founded as a refuge from clickbait algorithms and breathless trend cycles, this space is dedicated to depth over speed, precision over hyperbole, and durable knowledge over transient novelties.

---

### Our Editorial Pillars

- **Systemic Rigor**: We dissect software architecture from foundational first-principles.
- **Visual & Typographic Craft**: We treat digital words with the reverence historically reserved for hot-metal typesetting.
- **Multilingual Excellence**: Championing native technological discourse in both English and Bengali (বাংলা).

### The Team

Led by Al-Imran alongside visionary contributing writers, designers, and security researchers globally. Have a suggestion, inquiry, or desire to write for us? Reach out through our [Contact Page](/contact).`,
    seoTitle: 'About AL-IMRAN Publication & Mission',
    metaDescription: 'The story, philosophy, and team behind the AL-IMRAN editorial publication.',
    status: 'published',
    updatedAt: '2026-09-15T12:00:00Z',
  },
  {
    id: 'page-projects',
    title: 'Projects & Research Labs',
    slug: 'projects',
    content: `# Open Projects & Experimental Labs

Here is a curated index of open-source architectures, design frameworks, and technical initiatives developed in tandem with our editorial research.

---

### 1. Apex Editorial Engine
A headless, theme-agnostic publishing infrastructure built with React 19, TypeScript, and microsecond-level state synchronization.
- **Tech**: React 19, TypeScript, CSS Custom Variables
- **Status**: Live Production

### 2. Bengali Typographic Baseline Normalizer
An open-source utility providing optical vertical rhythm alignment for Bengali web typography across major browser engines.
- **Tech**: WebAssembly, Rust, HarfBuzz
- **Status**: Research Preview

### 3. Edge-Attest Zero-Trust Enclave
Lightweight hardware-enforced token verification module for distributed edge micro-gateways.
- **Tech**: Go, eBPF, WireGuard
- **Status**: Public Beta`,
    seoTitle: 'Projects & Labs | AL-IMRAN',
    metaDescription: 'Explore open source architectures, research papers, and technical labs.',
    status: 'published',
    updatedAt: '2026-09-14T09:00:00Z',
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    slug: 'privacy',
    content: `# Privacy Policy

**Effective Date: September 2026**

At AL-IMRAN, we respect your fundamental right to privacy. We do not sell, rent, or monetize your personal information to third-party data brokers.

### 1. Data We Collect
- **Newsletter Subscriptions**: When you subscribe to our journal, we store only your email address to deliver our editorial updates.
- **Contact Inquiries**: When you submit a note via our contact form, your name, email, and message are securely retained solely to respond.
- **Comments**: Public comments require an email address for anti-spam identification.

### 2. Cookie & Tracking Philosophy
We do not use surveillance cookies or cross-site tracking pixels. Local session preferences (such as your chosen Light or Dark theme) are preserved solely within your local device's browser storage.`,
    seoTitle: 'Privacy Policy | AL-IMRAN',
    metaDescription: 'Our commitment to reader privacy, transparent data handling, and zero surveillance tracking.',
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'page-terms',
    title: 'Terms of Service',
    slug: 'terms',
    content: `# Terms of Service

All original essays, code samples, diagrams, and media published on AL-IMRAN are protected by international copyright laws.

You are welcome to quote excerpts (up to 200 words) with clear canonical attribution and backlink to the original article. Code snippets are provided under the MIT License for educational and professional implementation.`,
    seoTitle: 'Terms of Service | AL-IMRAN',
    metaDescription: 'Usage terms, licensing, and attribution guidelines for AL-IMRAN content.',
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z',
  },
];

export const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'elena.rostova@techmail.org', subscribedAt: '2026-09-14T15:20:00Z', active: true },
  { id: 'sub-2', email: 'marcus.chen@distributed.dev', subscribedAt: '2026-09-16T09:11:00Z', active: true },
  { id: 'sub-3', email: 'ananya.sen@academics.ac.bd', subscribedAt: '2026-09-18T18:45:00Z', active: true },
  { id: 'sub-4', email: 'johan.lind@nordiccode.se', subscribedAt: '2026-09-19T12:00:00Z', active: true },
];

export const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Julian Hayes',
    email: 'julian@venturesmith.com',
    subject: 'Keynote invitation for European Architecture Summit',
    message: 'Hello Imran, we were thoroughly impressed by your recent editorial on Zero-Trust Edge clusters and would love to invite you to speak at our upcoming summit in Berlin this November.',
    createdAt: '2026-09-19T16:30:00Z',
    isRead: false,
  },
  {
    id: 'msg-2',
    name: 'Farhana Kabir',
    email: 'farhana@univ-dhaka.edu',
    subject: 'বাংলা টেকনোলজি রিসোর্স সংক্রান্ত আলোচনা',
    message: 'আসসালামু আলাইকুম। আপনাদের বাংলা আর্টিকেলের উপস্থাপনা চমৎকার। আমাদের বিশ্ববিদ্যালয়ের কম্পিউটার ক্লাবের সেমিনারে আপনার একটা সেশন রাখার ব্যাপারে কথা বলতে চাচ্ছিলাম।',
    createdAt: '2026-09-18T11:15:00Z',
    isRead: true,
  },
];

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    title: 'Minimalist Desk Setup',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    sizeKb: 142,
    dimensions: '1200 x 800',
    createdAt: '2026-09-15T10:00:00Z',
    mimeType: 'image/jpeg',
  },
  {
    id: 'med-2',
    title: 'Digital Future Tech',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    sizeKb: 198,
    dimensions: '1200 x 800',
    createdAt: '2026-09-16T12:30:00Z',
    mimeType: 'image/jpeg',
  },
  {
    id: 'med-3',
    title: 'Hardware Cluster Enclave',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    sizeKb: 215,
    dimensions: '1200 x 800',
    createdAt: '2026-09-17T09:15:00Z',
    mimeType: 'image/jpeg',
  },
  {
    id: 'med-4',
    title: 'Code Editor & Architecture',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    sizeKb: 174,
    dimensions: '1200 x 800',
    createdAt: '2026-09-18T14:20:00Z',
    mimeType: 'image/jpeg',
  },
  {
    id: 'med-5',
    title: 'Peaceful Reading Corner',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    sizeKb: 160,
    dimensions: '1200 x 800',
    createdAt: '2026-09-18T17:00:00Z',
    mimeType: 'image/jpeg',
  },
];

export const DEFAULT_ANALYTICS: AnalyticsData = {
  totalViews: 5750,
  dailyViews: [
    { date: 'Sep 15', views: 640 },
    { date: 'Sep 16', views: 790 },
    { date: 'Sep 17', views: 880 },
    { date: 'Sep 18', views: 1050 },
    { date: 'Sep 19', views: 1240 },
    { date: 'Sep 20', views: 980 },
    { date: 'Sep 21', views: 1150 },
  ],
  topSources: [
    { source: 'Direct / Bookmarks', percentage: 44 },
    { source: 'Hacker News / Lobsters', percentage: 26 },
    { source: 'Search Engines (Google, DuckDuckGo)', percentage: 18 },
    { source: 'Social (Twitter, LinkedIn)', percentage: 12 },
  ],
  devices: [
    { device: 'Desktop / Laptops', count: 3220 },
    { device: 'Mobile Phones', count: 2180 },
    { device: 'Tablets / e-Readers', count: 350 },
  ],
};
