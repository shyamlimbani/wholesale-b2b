'use client';

import React, { useState, useEffect } from 'react';
import { Settings } from '@/types';
import { SettingsService } from '@/services/apiService';
import { useSettings } from '@/context/SettingsContext';
import { Save, Loader2, ShieldCheck, Globe, Share2, Info, LayoutTemplate } from 'lucide-react';
import Image from 'next/image';

export default function AdminSettings() {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [websiteName, setWebsiteName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [footerText, setFooterText] = useState('');
  const [footerDescription, setFooterDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  
  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Social
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Header Customization
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const [navbarBgColor, setNavbarBgColor] = useState('#1e293b');
  const [navbarTextColor, setNavbarTextColor] = useState('#ffffff');
  const [headerSpacingY, setHeaderSpacingY] = useState('4');

  // Logo files
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
  const [footerLogoUrl, setFooterLogoUrl] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await SettingsService.get();
        if (data) {
          setWebsiteName(data.websiteName || '');
          setWhatsappNumber(data.whatsappNumber || '');
          setFooterText(data.footerText || '');
          setFooterDescription(data.footerDescription || '');
          setContactEmail(data.contactEmail || '');
          setContactAddress(data.contactAddress || '');
          setSeoTitle(data.seoTitle || '');
          setSeoDescription(data.seoDescription || '');
          setLogoUrl(data.logo || '');
          setFooterLogoUrl(data.footerLogo || '');
          
          if (data.socialLinks) {
            setFacebook(data.socialLinks.facebook || '');
            setInstagram(data.socialLinks.instagram || '');
            setTwitter(data.socialLinks.twitter || '');
            setLinkedin(data.socialLinks.linkedin || '');
          }
          
          setSearchPlaceholder(data.searchPlaceholder || 'Search premium products, verified suppliers...');
          setNavbarBgColor(data.navbarBgColor || '#1e293b');
          setNavbarTextColor(data.navbarTextColor || '#ffffff');
          setHeaderSpacingY(data.headerSpacingY || '4');
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('websiteName', websiteName);
    formData.append('whatsappNumber', whatsappNumber);
    formData.append('footerText', footerText);
    formData.append('footerDescription', footerDescription);
    formData.append('contactEmail', contactEmail);
    formData.append('contactAddress', contactAddress);
    formData.append('seoTitle', seoTitle);
    formData.append('seoDescription', seoDescription);
    
    const socialLinks = { facebook, instagram, twitter, linkedin };
    formData.append('socialLinks', JSON.stringify(socialLinks));

    formData.append('searchPlaceholder', searchPlaceholder);
    formData.append('navbarBgColor', navbarBgColor);
    formData.append('navbarTextColor', navbarTextColor);
    formData.append('headerSpacingY', headerSpacingY);

    if (logoFile) {
      formData.append('logo', logoFile);
    }
    if (footerLogoFile) {
      formData.append('footerLogo', footerLogoFile);
    }

    try {
      await SettingsService.update(formData);
      setSuccessMsg('Marketplace settings updated successfully!');
      
      // Update global context cache
      await refreshSettings();
      
      // Clear files
      setLogoFile(null);
      setFooterLogoFile(null);
      // Reload urls from settings context if updated
      const updated = await SettingsService.get();
      if (updated) {
        setLogoUrl(updated.logo || '');
        setFooterLogoUrl(updated.footerLogo || '');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-500 font-semibold">Loading marketplace parameters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Portal Configurations</h1>
        <p className="text-sm text-gray-550">Adjust branding, whatsapp inquiry endpoints, SEO metatags, and footer labels.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {successMsg && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-xs font-bold border border-green-200">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 text-red-655 p-4 rounded-xl text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Card 1: Branding & Contact */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Info className="w-4.5 h-4.5 text-blue-600" />
            General Branding & Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Portal Website Name (Optional)</label>
              <input
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. IndiaMART Wholesale"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Inquiry WhatsApp (Optional)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 919876543210 (No spaces or plus)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Marketplace Logo File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logoUrl && !logoFile && (
                <div className="mt-3 relative bg-transparent p-2 border border-gray-200 rounded-lg max-w-xs overflow-hidden flex items-center justify-center">
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    width={200}
                    height={80}
                    unoptimized={true}
                    className="h-16 w-auto object-contain bg-transparent"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Footer Logo File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setFooterLogoFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {footerLogoUrl && !footerLogoFile && (
                <div className="mt-3 relative bg-transparent p-2 border border-gray-200 rounded-lg max-w-xs overflow-hidden flex items-center justify-center">
                  <Image
                    src={footerLogoUrl}
                    alt="Footer Logo"
                    width={200}
                    height={80}
                    unoptimized={true}
                    className="h-16 w-auto object-contain bg-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Copyright / Footer Statement</label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. © 2026 Wholesale India Inc. All rights reserved."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Footer Description Summary</label>
            <textarea
              rows={2}
              value={footerDescription}
              onChange={(e) => setFooterDescription(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide a B2B description summary for the footer..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Support Email Address</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. support@wholesaleb2b.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Registered Postal Address</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Noida, Sector 62, Uttar Pradesh, India"
              />
            </div>
          </div>
        </div>

        {/* Card 2: SEO Meta */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Globe className="w-4.5 h-4.5 text-blue-600" />
            SEO & Metadata Configurations
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Meta SEO Title</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. India's Largest B2B Manufacturing Directory"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Meta SEO Description</label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide a search-indexing caption summarizing manufacturing services, exporters, categories, etc..."
            />
          </div>
        </div>

        {/* Card 3: Social Links */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Share2 className="w-4.5 h-4.5 text-blue-600" />
            Social Media Page Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Facebook Page URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/my-page"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Instagram Page URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/my-page"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Twitter Profile URL</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/my-page"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Linkedin Company URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/my-page"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Header & Layout Customization */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <LayoutTemplate className="w-4.5 h-4.5 text-blue-600" />
            Header & Layout Settings
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Search Bar Placeholder</label>
            <input
              type="text"
              value={searchPlaceholder}
              onChange={(e) => setSearchPlaceholder(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Search premium products, verified suppliers..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Navbar Background Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={navbarBgColor}
                  onChange={(e) => setNavbarBgColor(e.target.value)}
                  className="h-10 w-10 border rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={navbarBgColor}
                  onChange={(e) => setNavbarBgColor(e.target.value)}
                  className="flex-1 px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Navbar Text Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={navbarTextColor}
                  onChange={(e) => setNavbarTextColor(e.target.value)}
                  className="h-10 w-10 border rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={navbarTextColor}
                  onChange={(e) => setNavbarTextColor(e.target.value)}
                  className="flex-1 px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Header Top Spacing</label>
              <select
                value={headerSpacingY}
                onChange={(e) => setHeaderSpacingY(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2">Small (py-2)</option>
                <option value="4">Medium (py-4)</option>
                <option value="6">Large (py-6)</option>
                <option value="8">Extra Large (py-8)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-sm transition flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {submitting ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <Save className="w-4.5 h-4.5" />
            )}
            <span>Save Portal Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
