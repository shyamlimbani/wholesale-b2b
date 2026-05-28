'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { PopupSettingService } from '@/services/apiService';
import { Save, Loader2, Info, Eye, Settings2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminPopupSettings() {
  const { refreshPopupSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [termsText, setTermsText] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  // Logo / Background files
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const loadPopupSettings = async () => {
      setLoading(true);
      try {
        const data = await PopupSettingService.get();
        if (data) {
          setTitle(data.title || '');
          setSubtitle(data.subtitle || '');
          setDescription(data.description || '');
          setButtonText(data.buttonText || '');
          setTermsText(data.termsText || '');
          setIsEnabled(data.isEnabled ?? true);
          setLogoUrl(data.logo || '');
          setBackgroundUrl(data.backgroundImage || '');
          setImageUrl(data.image || '');
        }
      } catch (err) {
        console.error('Failed to load popup settings', err);
        toast.error('Failed to load popup configurations');
      } finally {
        setLoading(false);
      }
    };
    loadPopupSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('description', description);
    formData.append('buttonText', buttonText);
    formData.append('termsText', termsText);
    formData.append('isEnabled', String(isEnabled));

    if (logoFile) {
      formData.append('logo', logoFile);
    }
    if (backgroundFile) {
      formData.append('backgroundImage', backgroundFile);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await PopupSettingService.update(formData);
      toast.success('Login popup settings updated successfully!');
      
      // Update global context cache
      await refreshPopupSettings();
      
      // Clear files
      setLogoFile(null);
      setBackgroundFile(null);
      setImageFile(null);

      // Reload urls
      const updated = await PopupSettingService.get();
      if (updated) {
        setLogoUrl(updated.logo || '');
        setBackgroundUrl(updated.backgroundImage || '');
        setImageUrl(updated.image || '');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update popup settings');
      toast.error('Failed to save popup settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-500 font-semibold">Loading popup configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Login Popup Settings</h1>
        <p className="text-sm text-gray-500">Configure content, logos, backgrounds, and status of the dynamic B2B Lead capture block.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="bg-red-50 text-red-655 p-4 rounded-xl text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Card 1: Status & Mandatory toggle */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Settings2 className="w-4.5 h-4.5 text-blue-600" />
            Behavior & Controls
          </h2>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-800">Mandatory Lead Capture Lock</span>
              <span className="text-xs text-slate-500">If enabled, unauthenticated visitors are blocked by the login screen on load.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Card 2: Texts & Content */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Info className="w-4.5 h-4.5 text-blue-600" />
            Popup Content Text
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Popup Main Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="e.g. Welcome to India's Trusted Wholesale Marketplace"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Subtitle (Branding Card)</label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="e.g. Connect with verified suppliers and buyers instantly."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Popup Description Text</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="Provide description info..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Form Action Button Text</label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  placeholder="e.g. Explore Wholesale Deals"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Bottom Terms / Badge Text</label>
                <input
                  type="text"
                  required
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  placeholder="e.g. Verified B2B Business Verification"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Media branding */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <ImageIcon className="w-4.5 h-4.5 text-blue-600" />
            Media & Graphics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Slot */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Popup Logo Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logoUrl && !logoFile && (
                <div className="mt-2 p-2 border border-slate-100 bg-slate-50 rounded-xl max-w-[160px] overflow-hidden flex items-center justify-center">
                  <Image
                    src={logoUrl}
                    alt="Popup Logo"
                    width={150}
                    height={50}
                    unoptimized={true}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              )}
            </div>

            {/* Background Illustration Slot */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Left Side Background Illustration</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setBackgroundFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {backgroundUrl && !backgroundFile && (
                <div className="mt-2 p-2 border border-slate-100 bg-slate-50 rounded-xl max-w-[160px] overflow-hidden flex items-center justify-center">
                  <Image
                    src={backgroundUrl}
                    alt="Background"
                    width={150}
                    height={100}
                    unoptimized={true}
                    className="h-20 w-auto object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Foreground Image Slot */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Foreground Image / Illustration</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageUrl && !imageFile && (
                <div className="mt-2 p-2 border border-slate-100 bg-slate-50 rounded-xl max-w-[160px] overflow-hidden flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt="Foreground Illustration"
                    width={150}
                    height={100}
                    unoptimized={true}
                    className="h-20 w-auto object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <Save className="w-4.5 h-4.5" />
            )}
            <span>Save Popup Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
