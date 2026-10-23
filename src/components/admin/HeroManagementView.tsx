'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Image as ImageIcon,
  Sliders,
  Type,
  Link2,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Monitor,
  Smartphone,
  Sparkles,
  Upload,
  Cloud,
  Loader2,
  FileVideo,
  FileImage,
  Check,
  Info,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { defaultHeroData, HeroData } from '@/types/hero';

interface VideoPreset {
  label: string;
  videoUrl: string;
  posterUrl: string;
  headline: string;
  subtitle: string;
}

const PRESETS: VideoPreset[] = [
  {
    label: 'Creative Stylist (Reference Match)',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=2000&q=80',
    headline: 'Creative staffing for what\'s next.',
    subtitle: 'Our proprietary recruitment technology, decades of expertise, and award-winning teams connect you with elite talent who are shaping the future of marketing and design.',
  },
  {
    label: 'Digital Momentum & Ecosystem',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2000&q=80',
    headline: 'One company. Multiple ways to move forward.',
    subtitle: 'Mighty Warner unites Digital & Growth, Technology, and Talent Solutions under one connected enterprise ecosystem.',
  },
  {
    label: 'Modern Software & Engineering',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
    headline: 'What are you building?',
    subtitle: 'A brand. A product. A team. We engineer scalable web applications, custom platforms, and automation systems.',
  },
];

export function HeroManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<HeroData>(defaultHeroData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cloudinary upload states
  const [cloudinaryStatus, setCloudinaryStatus] = useState<{ configured: boolean; cloudName: string | null }>({
    configured: false,
    cloudName: null,
  });
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current config on load
  useEffect(() => {
    async function loadHeroConfig() {
      setIsLoading(true);
      try {
        const [heroRes, uploadStatusRes] = await Promise.all([
          fetch('/api/admin/hero'),
          fetch('/api/admin/upload'),
        ]);

        const heroJson = await heroRes.json();
        if (heroJson.success && heroJson.data) {
          setFormData(heroJson.data);
        }

        const uploadJson = await uploadStatusRes.json();
        if (uploadJson.success) {
          setCloudinaryStatus({
            configured: uploadJson.cloudinaryConfigured,
            cloudName: uploadJson.cloudName,
          });
        }
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Failed to load hero configuration' });
      } finally {
        setIsLoading(false);
      }
    }
    loadHeroConfig();
  }, []);

  const handleChange = (field: keyof HeroData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (preset: VideoPreset) => {
    setFormData((prev) => ({
      ...prev,
      videoUrl: preset.videoUrl,
      fallbackImageUrl: preset.posterUrl,
      title: preset.headline,
      subtitle: preset.subtitle,
    }));
    setFeedback({ type: 'success', message: `Applied "${preset.label}" preset` });
  };

  // Upload file to Cloudinary / Local API
  const handleFileUpload = async (file: File, type: 'video' | 'image') => {
    const isVideo = type === 'video';
    if (isVideo) {
      setIsUploadingVideo(true);
      setVideoUploadProgress(25);
    } else {
      setIsUploadingImage(true);
      setImageUploadProgress(25);
    }

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'mighty-warner/hero');
      uploadData.append('resource_type', type);

      // Pass previous media URL so the server automatically deletes the old asset from Cloudinary
      const previousUrl = isVideo ? formData.videoUrl : formData.fallbackImageUrl;
      if (previousUrl) {
        uploadData.append('previousUrl', previousUrl);
      }

      if (isVideo) setVideoUploadProgress(65);
      else setImageUploadProgress(65);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      if (isVideo) {
        setVideoUploadProgress(100);
        handleChange('videoUrl', json.url);
        setFeedback({
          type: 'success',
          message: `New video uploaded to Cloudinary CDN! Previous video was automatically removed from Cloudinary.`,
        });
      } else {
        setImageUploadProgress(100);
        handleChange('fallbackImageUrl', json.url);
        setFeedback({
          type: 'success',
          message: `New fallback image uploaded to Cloudinary CDN! Previous image was automatically removed from Cloudinary.`,
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'File upload error' });
    } finally {
      if (isVideo) {
        setTimeout(() => setIsUploadingVideo(false), 600);
      } else {
        setTimeout(() => setIsUploadingImage(false), 600);
      }
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: 'success', message: 'Hero section published & updated on live storefront!' });
      } else {
        throw new Error(json.error || 'Failed to save');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving hero settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset hero section fields to defaults?')) {
      setFormData(defaultHeroData);
      setFeedback({ type: 'success', message: 'Reset to default settings (click Save & Publish to apply)' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading Hero Section Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-lg animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-500 dark:text-emerald-200'
              : 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/80 dark:border-rose-500 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3 text-sm font-bold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action Bar & Cloudinary Status */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
          isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Homepage Hero Section</h2>
              {/* Cloudinary Integration Badge */}
              {cloudinaryStatus.configured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Cloud className="w-3 h-3" />
                  <span>Cloudinary CDN ({cloudinaryStatus.cloudName})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env">
                  <Cloud className="w-3 h-3" />
                  <span>Cloudinary Ready (Local Fallback Active)</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Full-width video background with editorial typography & direct media uploads</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live</span>
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Editor */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Video & Visual Assets */}
          <div
            className={`p-6 rounded-2xl border space-y-6 shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Play className="w-4 h-4 text-indigo-500" />
                <span>Video Background Settings & Uploads</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Step 01</span>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Quick Sample Presets (Click to Auto-Fill)
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      formData.videoUrl === p.videoUrl && formData.title === p.headline
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isDark
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Upload Dropzone & Direct URL */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <FileVideo className="w-4 h-4 text-indigo-400" />
                  <span>Hero Background Video</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">MP4 or WebM format</span>
              </div>

              {/* Video File Upload Box */}
              <div
                onClick={() => videoFileInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center relative overflow-hidden group ${
                  isDark
                    ? 'border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 hover:border-indigo-500'
                    : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/80 hover:border-indigo-600'
                }`}
              >
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'video');
                  }}
                />

                {isUploadingVideo ? (
                  <div className="py-2 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                    <div className="text-xs font-bold">Uploading video to {cloudinaryStatus.configured ? 'Cloudinary' : 'storage'}...</div>
                    <div className="w-48 mx-auto bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${videoUploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Click to upload video file (Cloudinary CDN)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Supports MP4 / WebM • Max 100MB
                    </span>
                  </div>
                )}
              </div>

              {/* Direct Video URL Input */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Or paste external Video Direct URL:</span>
                <input
                  type="url"
                  required
                  placeholder="https://res.cloudinary.com/... or https://your-cdn.com/hero.mp4"
                  value={formData.videoUrl}
                  onChange={(e) => handleChange('videoUrl', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all focus:outline-none border ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            {/* Poster / Fallback Image Upload & URL */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <FileImage className="w-4 h-4 text-emerald-400" />
                  <span>Fallback Poster Image</span>
                </label>
                <span className="text-[11px] text-slate-400">JPG, PNG, or WebP</span>
              </div>

              {/* Image File Upload Box */}
              <div
                onClick={() => imageFileInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center relative overflow-hidden group ${
                  isDark
                    ? 'border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 hover:border-emerald-500'
                    : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/80 hover:border-emerald-600'
                }`}
              >
                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'image');
                  }}
                />

                {isUploadingImage ? (
                  <div className="py-2 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
                    <div className="text-xs font-bold">Uploading image to {cloudinaryStatus.configured ? 'Cloudinary' : 'storage'}...</div>
                    <div className="w-48 mx-auto bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${imageUploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Click to upload fallback image file (Cloudinary CDN)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      High-resolution poster displayed while video buffers
                    </span>
                  </div>
                )}
              </div>

              {/* Direct Image URL Input */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Or paste image URL:</span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                  value={formData.fallbackImageUrl}
                  onChange={(e) => handleChange('fallbackImageUrl', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all focus:outline-none border ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            {/* Overlay Darkness Slider */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cinematic Overlay Darkness</span>
                </label>
                <span className="text-xs font-mono font-bold text-indigo-400">{formData.overlayOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={formData.overlayOpacity}
                onChange={(e) => handleChange('overlayOpacity', Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>10% (Lighter)</span>
                <span>55% (Balanced contrast)</span>
                <span>90% (Deep dark)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Typography & Copy Content */}
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Type className="w-4 h-4 text-indigo-500" />
                <span>Headline & Text Messaging</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Step 02</span>
            </div>


            {/* Main Headline */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold">
                  Main Headline Display <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {formData.title.length} characters
                </span>
              </div>
              <textarea
                required
                rows={2}
                placeholder="Creative staffing for what's next."
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-base font-extrabold transition-all focus:outline-none border ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Large, chunky display typography shown prominently over the video.
              </p>
            </div>

            {/* Supporting Subtitle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold">Supporting Subtitle / Paragraph</label>
                <span className="text-[10px] font-mono text-slate-400">
                  {formData.subtitle.length} characters
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Our proprietary recruitment technology, decades of expertise..."
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs leading-relaxed transition-all focus:outline-none border ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                }`}
              />
            </div>
          </div>

          {/* Section 3: Call To Action Buttons */}
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Link2 className="w-4 h-4 text-indigo-500" />
                <span>Call-To-Action Buttons</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Step 03</span>
            </div>

            {/* Primary Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Primary Button Label (Translucent Glass)</label>
                <input
                  type="text"
                  placeholder="SEARCH JOBS"
                  value={formData.ctaText}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all focus:outline-none border ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Primary Button Link</label>
                <input
                  type="text"
                  placeholder="/work"
                  value={formData.ctaLink}
                  onChange={(e) => handleChange('ctaLink', e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none border ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            {/* Secondary Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Secondary Button Label (Outlined)</label>
                <input
                  type="text"
                  placeholder="FIND TALENT"
                  value={formData.secondaryCtaText}
                  onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all focus:outline-none border ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Secondary Button Link</label>
                <input
                  type="text"
                  placeholder="/contact"
                  value={formData.secondaryCtaLink}
                  onChange={(e) => handleChange('secondaryCtaLink', e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none border ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Publishing to Storefront...' : 'Save & Publish Hero Section'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
