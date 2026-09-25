import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { AdSlotLocation, AdType, AdSlotConfig, AdsConfig } from '../../../types';
import { DEFAULT_ADS_CONFIG } from '../../../data/defaultData';
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Code,
  Image as ImageIcon,
  Sliders,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const AdminAdsManager: React.FC = () => {
  const { siteSettings, updateAdsConfig } = useBlog();
  const adsConfig: AdsConfig = siteSettings?.adsConfig || DEFAULT_ADS_CONFIG;

  const [activeSlot, setActiveSlot] = useState<AdSlotLocation>('header_top');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const slotKeys: AdSlotLocation[] = [
    'header_top',
    'in_article',
    'homepage_feed',
    'sidebar',
    'footer_above',
  ];

  const handleMasterToggle = (enabled: boolean) => {
    updateAdsConfig({ enabled });
    triggerSaveFeedback();
  };

  const handleGlobalClientChange = (clientId: string) => {
    updateAdsConfig({ googleAdsenseClientId: clientId });
  };

  const handleAutoAdsToggle = (autoAdsEnabled: boolean) => {
    updateAdsConfig({ autoAdsEnabled });
    triggerSaveFeedback();
  };

  const handleTestModeToggle = (testMode: boolean) => {
    updateAdsConfig({ testMode });
    triggerSaveFeedback();
  };

  const handleSlotUpdate = (slotId: AdSlotLocation, updates: Partial<AdSlotConfig>) => {
    const currentSlot = adsConfig.slots[slotId] || DEFAULT_ADS_CONFIG.slots[slotId];
    const updatedSlot: AdSlotConfig = {
      ...currentSlot,
      ...updates,
    };

    updateAdsConfig({
      slots: {
        ...adsConfig.slots,
        [slotId]: updatedSlot,
      },
    });
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const currentSlotConfig = adsConfig.slots[activeSlot] || DEFAULT_ADS_CONFIG.slots[activeSlot];

  // Helper to prefill demo/test affiliate banner
  const handleFillDemoBanner = (slotId: AdSlotLocation) => {
    handleSlotUpdate(slotId, {
      enabled: true,
      type: 'custom_banner',
      bannerImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=200&q=80',
      targetUrl: 'https://example.com/special-promotion',
      altText: 'Editorial Technology Partner',
      openInNewTab: true,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              বিজ্ঞাপন ও মনিটাইজেশন ব্যবস্থাপনা (Ad Manager & Google Ads)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">
            Configure Google AdSense publisher ID, unit slot IDs, auto ads, or custom affiliate banners across all key publication zones.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>পরিবর্তন সংরক্ষিত হয়েছে (Saved)</span>
          </div>
        )}
      </div>

      {/* Master Ad Controls Card */}
      <div
        className="p-6 rounded-2xl border space-y-6"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                ওয়েবসাইটে বিজ্ঞাপন চালু রাখুন (Master Ads Toggle)
              </span>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                  adsConfig.enabled
                    ? 'bg-emerald-500/10 text-emerald-500 font-bold'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                {adsConfig.enabled ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              এই অপশন বন্ধ থাকলে ওয়েবসাইটে কোনো বিজ্ঞাপন দেখানো হবে না। চালু করলে কনফিগার করা স্লটগুলো দৃশ্যমান হবে।
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={adsConfig.enabled}
              onChange={e => handleMasterToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Global Google AdSense Client ID & Auto Ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
              Google AdSense Publisher Client ID (ca-pub-...)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={adsConfig.googleAdsenseClientId || ''}
                onChange={e => handleGlobalClientChange(e.target.value)}
                placeholder="ca-pub-1234567890123456"
                className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={triggerSaveFeedback}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
              >
                সংরক্ষণ
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              আপনার Google AdSense ড্যাশবোর্ড থেকে একাউন্ট ক্লায়েন্ট আইডি দিন। এটি স্বয়ংক্রিয়ভাবে স্ক্রিপ্টে যুক্ত হবে।
            </p>
          </div>

          <div className="space-y-4">
            {/* Auto Ads Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                  Google Auto Ads (স্বয়ংক্রিয় বিজ্ঞাপন)
                </span>
                <span className="text-[11px] text-neutral-500">
                  Google AI স্বয়ংক্রিয়ভাবে পেজের ফাঁকা জায়গায় বিজ্ঞাপন বসাবে
                </span>
              </div>
              <input
                type="checkbox"
                checked={adsConfig.autoAdsEnabled ?? false}
                onChange={e => handleAutoAdsToggle(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            {/* Test / Preview Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  Test / Ad Slot Preview Mode (স্লট প্রিভিউ মোড)
                </span>
                <span className="text-[11px] text-neutral-500">
                  বিজ্ঞাপন আইডি না থাকলেও ওয়েবসাইটে প্রতিটি স্লটের অবস্থান দেখতে এটি চালু করুন
                </span>
              </div>
              <input
                type="checkbox"
                checked={adsConfig.testMode ?? false}
                onChange={e => handleTestModeToggle(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slot Management Tabs */}
      <div className="space-y-4">
        <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          নির্দিষ্ট বিজ্ঞাপন স্লটসমূহ (Placement Ad Slots)
        </h2>

        {/* Slot navigation buttons */}
        <div className="flex flex-wrap gap-2">
          {slotKeys.map(key => {
            const slot = adsConfig.slots[key] || DEFAULT_ADS_CONFIG.slots[key];
            const isSelected = activeSlot === key;

            return (
              <button
                key={key}
                onClick={() => setActiveSlot(key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
                style={{
                  backgroundColor: !isSelected ? 'var(--card-bg)' : undefined,
                  borderColor: !isSelected ? 'var(--border-color)' : undefined,
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    slot.enabled ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
                <span>{slot.nameBn || slot.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Slot Configuration Card */}
        <div
          className="p-6 rounded-2xl border space-y-6"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          {/* Slot Header with Enabled Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentSlotConfig.nameBn || currentSlotConfig.name}
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">({currentSlotConfig.id})</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {currentSlotConfig.id === 'header_top' && 'শীর্ষে মেনু বা হেডারের নিচে ফুল-উইডথ বা রেসপনসিভ ব্যানার।'}
                {currentSlotConfig.id === 'in_article' && 'আর্টিকেলের লেখার ভেতরে বা অনুচ্ছেদের মাঝে বিজ্ঞাপন।'}
                {currentSlotConfig.id === 'homepage_feed' && 'হোমপেজে লেটেস্ট পোস্ট বা সেকশনের মাঝখানের ব্যানার।'}
                {currentSlotConfig.id === 'sidebar' && 'আর্টিকেলের সাইডবার বা উইজেট এরিয়ায় ভার্টিক্যাল বা স্কয়ার ব্যানার।'}
                {currentSlotConfig.id === 'footer_above' && 'ফুটারের ঠিক ওপরে বড় ব্যানার বিজ্ঞাপন।'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-500">এই স্লট চালু রাখুন:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSlotConfig.enabled}
                  onChange={e => handleSlotUpdate(activeSlot, { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Ad Type Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
              বিজ্ঞাপনের ধরন বেছে নিন (Ad Format Type)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSlotUpdate(activeSlot, { type: 'adsense' })}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  currentSlotConfig.type === 'adsense'
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                }`}
                style={{ borderColor: currentSlotConfig.type === 'adsense' ? undefined : 'var(--border-color)' }}
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                    Google AdSense
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Slot ID ও Client ID দ্বারা গুগল এডসেন্স
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSlotUpdate(activeSlot, { type: 'custom_banner' })}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  currentSlotConfig.type === 'custom_banner'
                    ? 'border-emerald-500 bg-emerald-500/5'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                }`}
                style={{ borderColor: currentSlotConfig.type === 'custom_banner' ? undefined : 'var(--border-color)' }}
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                    কাস্টম ব্যানার / লিংক
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    নিজের ইমেজ ও ক্লিকেবল লিংক বা স্পন্সর
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSlotUpdate(activeSlot, { type: 'custom_code' })}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  currentSlotConfig.type === 'custom_code'
                    ? 'border-purple-500 bg-purple-500/5'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                }`}
                style={{ borderColor: currentSlotConfig.type === 'custom_code' ? undefined : 'var(--border-color)' }}
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 mt-0.5">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                    কাস্টম স্ক্রিপ্ট / কোড
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    যেকোনো ad network বা HTML ট্যাগ
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields: 1. Google AdSense Fields */}
          {currentSlotConfig.type === 'adsense' && (
            <div className="space-y-4 p-4 rounded-xl border bg-neutral-50/50 dark:bg-neutral-900/20" style={{ borderColor: 'var(--border-color)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-500">
                    Google Ad Slot ID (যেমন: 1234567890)
                  </label>
                  <input
                    type="text"
                    value={currentSlotConfig.adSlotId || ''}
                    onChange={e => handleSlotUpdate(activeSlot, { adSlotId: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-3.5 py-2 rounded-xl border text-sm font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <span className="text-[10px] text-neutral-400">
                    AdSense &gt; By ad unit &gt; Display ads থেকে পাওয়া 'data-ad-slot' নম্বর।
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-500">
                    Ad Format (সাইজ / ফরম্যাট)
                  </label>
                  <select
                    value={currentSlotConfig.adFormat || 'auto'}
                    onChange={e => handleSlotUpdate(activeSlot, { adFormat: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="auto">Auto Responsive (রেসপনসিভ)</option>
                    <option value="horizontal">Horizontal Banner (অনুভূমিক)</option>
                    <option value="rectangle">Rectangle (বক্স / চারকোনা)</option>
                    <option value="vertical">Vertical Skyscraper (লম্বালম্বি)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-500">
                  Custom Client ID Override (ঐচ্ছিক - খালি রাখলে গ্লোবাল আইডি ব্যবহৃত হবে)
                </label>
                <input
                  type="text"
                  value={currentSlotConfig.adClient || ''}
                  onChange={e => handleSlotUpdate(activeSlot, { adClient: e.target.value })}
                  placeholder={adsConfig.googleAdsenseClientId || 'ca-pub-xxxxxxxxxxxxxxxx'}
                  className="w-full px-3.5 py-2 rounded-xl border text-sm font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Form Fields: 2. Custom Banner Fields */}
          {currentSlotConfig.type === 'custom_banner' && (
            <div className="space-y-4 p-4 rounded-xl border bg-neutral-50/50 dark:bg-neutral-900/20" style={{ borderColor: 'var(--border-color)' }}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-500">
                    ব্যানার ইমেজ লিংক (Banner Image URL)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleFillDemoBanner(activeSlot)}
                    className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    ডেমো ব্যানার বসান
                  </button>
                </div>
                <input
                  type="url"
                  value={currentSlotConfig.bannerImageUrl || ''}
                  onChange={e => handleSlotUpdate(activeSlot, { bannerImageUrl: e.target.value })}
                  placeholder="https://example.com/banner-image.jpg"
                  className="w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-500">
                    টার্গেট লিংক / ক্লিক করলে যেখানে যাবে (Target Link)
                  </label>
                  <input
                    type="url"
                    value={currentSlotConfig.targetUrl || ''}
                    onChange={e => handleSlotUpdate(activeSlot, { targetUrl: e.target.value })}
                    placeholder="https://partner-website.com/offer"
                    className="w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-500">
                    Alt Text / বিজ্ঞাপনের শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={currentSlotConfig.altText || ''}
                    onChange={e => handleSlotUpdate(activeSlot, { altText: e.target.value })}
                    placeholder="Special Sponsor Advertisement"
                    className="w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="openNewTab"
                  checked={currentSlotConfig.openInNewTab ?? true}
                  onChange={e => handleSlotUpdate(activeSlot, { openInNewTab: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="openNewTab" className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  ক্লিক করলে নতুন ট্যাবে ওপেন হবে (Open in new window / tab)
                </label>
              </div>

              {currentSlotConfig.bannerImageUrl && (
                <div className="mt-3 p-3 rounded-lg border bg-white dark:bg-neutral-900" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-[10px] font-mono text-neutral-400 block mb-2">প্রিভিউ:</span>
                  <img
                    src={currentSlotConfig.bannerImageUrl}
                    alt="Preview"
                    className="max-h-28 rounded object-cover mx-auto"
                  />
                </div>
              )}
            </div>
          )}

          {/* Form Fields: 3. Custom Code Fields */}
          {currentSlotConfig.type === 'custom_code' && (
            <div className="space-y-3 p-4 rounded-xl border bg-neutral-50/50 dark:bg-neutral-900/20" style={{ borderColor: 'var(--border-color)' }}>
              <label className="block text-xs font-bold text-neutral-500">
                Custom HTML / JS Ad Tag Code
              </label>
              <textarea
                rows={5}
                value={currentSlotConfig.customCode || ''}
                onChange={e => handleSlotUpdate(activeSlot, { customCode: e.target.value })}
                placeholder={'<script>\n  // Paste custom ad snippet or affiliate iframe here\n</script>'}
                className="w-full px-3.5 py-2 rounded-xl border text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <span className="text-[10px] text-neutral-400">
                এখানে পেস্ট করা যেকোনো HTML কোড বা স্ক্রিপ্ট এই স্লটে নিরাপদে রেন্ডার হবে।
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Google AdSense Guide Box */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            গুগল এডসেন্স (Google AdSense) শুরু করার নিয়মাবলী:
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-500 leading-relaxed">
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border" style={{ borderColor: 'var(--border-color)' }}>
            <span className="font-bold text-blue-500 block mb-1">১. Publisher Client ID নিন</span>
            <span>
              Google AdSense একাউন্টে লগইন করে Account &gt; Settings &gt; Account Information থেকে আপনার <code>ca-pub-xxxxxxxxxxxxxxxx</code> আইডিটি কপি করে ওপরে পেস্ট করুন।
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border" style={{ borderColor: 'var(--border-color)' }}>
            <span className="font-bold text-emerald-500 block mb-1">২. Ad Units তৈরি করুন</span>
            <span>
              AdSense ড্যাশবোর্ডে <b>Ads &gt; By ad unit</b> থেকে "Display ads" বা "In-feed ads" তৈরি করুন। প্রতিটি ইউনিটের ১০ সংখ্যার <code>Slot ID</code> পাবেন।
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border" style={{ borderColor: 'var(--border-color)' }}>
            <span className="font-bold text-purple-500 block mb-1">৩. সেভ করে টেস্ট করুন</span>
            <span>
              হেডার, আর্টিকেল বা সাইডবার স্লটটিতে Slot ID বসিয়ে সেভ করুন। গুগল এডসেন্স একাউন্ট ভেরিফাইড হলে স্বয়ংক্রিয়ভাবে বিজ্ঞাপন লোড শুরু হবে।
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
