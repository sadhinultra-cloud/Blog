import React, { useState } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { Upload, Copy, Check, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const { media, uploadMedia, deleteMedia } = useBlog();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        uploadMedia(file.name, dataUrl, Math.round(file.size / 1024));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          uploadMedia(file.name, dataUrl, Math.round(file.size / 1024));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Digital Asset & Media Library
          </h2>
          <p className="text-xs text-neutral-500">
            Store, preview, optimize, and reference images for your editorial articles and social cards.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50/20' : ''
        }`}
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: isDragging ? undefined : 'var(--border-color)',
        }}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Drag and drop images here, or browse files
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Supports JPEG, PNG, WEBP, SVG, and GIF
            </p>
          </div>
          <div>
            <label
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all hover:opacity-90 shadow-xs"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              <span>Browse Local Images</span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map(item => (
          <div
            key={item.id}
            className="rounded-xl border overflow-hidden flex flex-col justify-between group transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          >
            <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs truncate max-w-[140px]" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {item.sizeKb} KB
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => copyUrl(item.id, item.url)}
                  className="text-[11px] font-semibold flex items-center gap-1 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteMedia(item.id)}
                  className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
