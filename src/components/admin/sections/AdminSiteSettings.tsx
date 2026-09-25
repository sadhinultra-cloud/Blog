import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Save, Download, Upload, RotateCcw, Key, ShieldCheck, Check } from 'lucide-react';

export const AdminSiteSettings: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    exportBlogData,
    importBlogData,
    resetToDefaultDemoData,
    changeAdminPassword,
  } = useBlog();

  const [siteTitle, setSiteTitle] = useState(siteSettings.siteTitle);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [logoText, setLogoText] = useState(siteSettings.logoText);
  const [logoUrl, setLogoUrl] = useState(siteSettings.logoUrl || '');
  const [contactEmail, setContactEmail] = useState(siteSettings.contactEmail);
  const [contactPhone, setContactPhone] = useState(siteSettings.contactPhone || '');
  const [contactAddress, setContactAddress] = useState(siteSettings.contactAddress || '');
  const [defaultLanguage, setDefaultLanguage] = useState(siteSettings.defaultLanguage);
  const [enableLanguageToggle, setEnableLanguageToggle] = useState(siteSettings.enableLanguageToggle);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteTitle,
      tagline,
      logoText,
      logoUrl: logoUrl || undefined,
      contactEmail,
      contactPhone: contactPhone || undefined,
      contactAddress: contactAddress || undefined,
      defaultLanguage,
      enableLanguageToggle,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPwMessage({ text: 'Password must be at least 4 characters.', error: true });
      return;
    }
    const success = changeAdminPassword(oldPassword, newPassword);
    if (success) {
      setPwMessage({ text: 'Admin security passcode updated successfully!' });
      setOldPassword('');
      setNewPassword('');
    } else {
      setPwMessage({ text: 'Incorrect current password.', error: true });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const success = importBlogData(text);
      if (success) {
        alert('Blog data snapshot restored successfully!');
      } else {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Warning: This will restore the factory default demo articles, categories, theme and site settings. Any custom changes will be overwritten. Proceed?'
      )
    ) {
      resetToDefaultDemoData();
      alert('Default editorial demo data restored.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          System Configuration & Identity
        </h2>
        <p className="text-xs text-neutral-500">
          Core site branding, contact coordinates, multi-language toggles, backups, and security.
        </p>
      </div>

      {/* Main General Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              General Identity & Branding
            </h3>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? 'Saved!' : 'Save General Info'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                Site Brand Title *
              </label>
              <input
                type="text"
                value={siteTitle}
                onChange={e => setSiteTitle(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                Header Logo Display Text
              </label>
              <input
                type="text"
                value={logoText}
                onChange={e => setLogoText(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none font-bold"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Brand Tagline & Subheading
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                Physical / Studio Address
              </label>
              <input
                type="text"
                value={contactAddress}
                onChange={e => setContactAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
                Default Site Language
              </label>
              <select
                value={defaultLanguage}
                onChange={e => setDefaultLanguage(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="en" className="dark:bg-neutral-900">English (en)</option>
                <option value="bn" className="dark:bg-neutral-900">বাংলা - Bengali (bn)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableLanguageToggle}
                  onChange={e => setEnableLanguageToggle(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span style={{ color: 'var(--text-primary)' }}>
                  Enable Language Switcher in Header (EN / বাংলা)
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Security & Passcode Change */}
      <form
        onSubmit={handlePasswordChange}
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-neutral-400" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Admin Access & Passcode Security
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          Default administrative password is <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono font-bold">admin123</code>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              New Passcode
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {pwMessage && (
          <p className={`text-xs font-medium ${pwMessage.error ? 'text-rose-500' : 'text-emerald-500'}`}>
            {pwMessage.text}
          </p>
        )}

        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          Update Security Passcode
        </button>
      </form>

      {/* Snapshot Backup & Recovery */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          Data Portability, Snapshot Backups & Factory Reset
        </h3>
        <p className="text-xs text-neutral-500">
          Export your entire database (articles, comments, taxonomies, settings) to a single portable JSON file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportBlogData}
            className="px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Export Blog JSON Snapshot</span>
          </button>

          <label
            className="px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>Restore JSON Backup</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-2 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Factory Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
