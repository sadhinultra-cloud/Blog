import React, { useEffect, useRef } from 'react';
import { useBlog } from '../../context/BlogContext';
import { AdSlotLocation } from '../../types';
import { ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

interface AdSlotProps {
  slot: AdSlotLocation;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({ slot, className = '' }) => {
  const { siteSettings } = useBlog();
  const adsConfig = siteSettings?.adsConfig;
  const adRef = useRef<HTMLDivElement>(null);

  const slotConfig = adsConfig?.slots?.[slot];
  const isMasterEnabled = adsConfig?.enabled ?? false;
  const isSlotEnabled = slotConfig?.enabled ?? false;
  const isTestMode = adsConfig?.testMode ?? false;

  // Google AdSense auto-push execution
  useEffect(() => {
    if (!isMasterEnabled && !isTestMode) return;
    if (!isSlotEnabled && !isTestMode) return;

    if (slotConfig?.type === 'adsense') {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        // Adsbygoogle will throw if already loaded or blocked by ad-blocker; catch silently
      }
    }
  }, [slotConfig, isMasterEnabled, isSlotEnabled, isTestMode]);

  // If ads are completely disabled and not in test/preview mode, collapse completely
  if (!isMasterEnabled && !isTestMode) {
    return null;
  }

  // If specific slot is not enabled and not in test mode, collapse
  if (!isSlotEnabled && !isTestMode) {
    return null;
  }

  if (!slotConfig) {
    return null;
  }

  const clientId = slotConfig.adClient?.trim() || adsConfig?.googleAdsenseClientId?.trim();
  const slotId = slotConfig.adSlotId?.trim();

  // Test / Placeholder Mode
  if (isTestMode || (slotConfig.type === 'adsense' && (!clientId || !slotId))) {
    return (
      <div
        className={`w-full my-6 p-4 rounded-xl border border-dashed transition-all ${className}`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
        data-ad-slot-name={slot}
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 font-semibold text-amber-500">
            <Sparkles className="w-3.5 h-3.5" />
            Ad Preview Slot • {slotConfig.nameBn || slotConfig.name}
          </span>
          <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px]">
            {slotConfig.type.toUpperCase()}
          </span>
        </div>

        <div className="py-6 text-center space-y-2">
          {slotConfig.type === 'adsense' ? (
            <>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Google AdSense ({slotConfig.adFormat || 'responsive'})
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                Publisher: {clientId || '(Client ID not set yet)'} | Slot ID: {slotId || '(Slot ID not set yet)'}
              </p>
              {!clientId && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  এডমিন প্যানেলে Ad Manager থেকে আপনার Google AdSense Client ID ও Slot ID বসালেই বিজ্ঞাপন চালু হবে।
                </p>
              )}
            </>
          ) : slotConfig.type === 'custom_banner' ? (
            <>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Custom Banner Ad
              </p>
              <p className="text-xs text-neutral-500">
                Target URL: {slotConfig.targetUrl || '(No URL provided)'}
              </p>
              {slotConfig.bannerImageUrl && (
                <img
                  src={slotConfig.bannerImageUrl}
                  alt={slotConfig.altText || 'Banner'}
                  className="max-h-32 mx-auto rounded-lg object-contain mt-2"
                />
              )}
            </>
          ) : (
            <p className="text-xs text-neutral-500 font-mono">Custom HTML/Script Ad Slot</p>
          )}
        </div>
      </div>
    );
  }

  // 1. Google AdSense Slot
  if (slotConfig.type === 'adsense') {
    return (
      <div
        ref={adRef}
        className={`w-full my-6 text-center overflow-hidden transition-all ${className}`}
        data-ad-slot-id={slotId}
      >
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1 text-center">
          Advertisement • বিজ্ঞাপন
        </div>
        <div className="min-h-[90px] flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format={slotConfig.adFormat || 'auto'}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // 2. Custom Banner Slot (Image + Link)
  if (slotConfig.type === 'custom_banner' && slotConfig.bannerImageUrl) {
    const content = (
      <div className="relative group overflow-hidden rounded-xl border transition-all hover:opacity-95" style={{ borderColor: 'var(--border-color)' }}>
        <img
          src={slotConfig.bannerImageUrl}
          alt={slotConfig.altText || 'Sponsored Advertisement'}
          className="w-full h-auto object-cover max-h-48 sm:max-h-60 mx-auto"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
          <span>Sponsored</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </div>
      </div>
    );

    return (
      <div className={`w-full my-6 text-center ${className}`}>
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1 text-center">
          Advertisement • বিজ্ঞাপন
        </div>
        {slotConfig.targetUrl ? (
          <a
            href={slotConfig.targetUrl}
            target={slotConfig.openInNewTab ? '_blank' : '_self'}
            rel="sponsored noopener noreferrer"
            className="inline-block w-full cursor-pointer"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    );
  }

  // 3. Custom Code / Raw HTML/Script
  if (slotConfig.type === 'custom_code' && slotConfig.customCode) {
    return (
      <div className={`w-full my-6 text-center overflow-hidden ${className}`}>
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1 text-center">
          Advertisement • বিজ্ঞাপন
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: slotConfig.customCode }}
          className="inline-block w-full"
        />
      </div>
    );
  }

  return null;
};
