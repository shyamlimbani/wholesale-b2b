'use client';

import React, { useState, useEffect } from 'react';
import { FooterMenu, Settings } from '@/types';
import { FooterMenuService, SettingsService } from '@/services/apiService';
import { useSettings } from '@/context/SettingsContext';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Link as LinkIcon,
  GripVertical,
  Save,
  Info,
  Share2,
  Globe,
  Building,
  Mail,
  Smartphone,
  Check,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

const PRESET_SECTIONS = ['Quick Links', 'Categories', 'Company', 'Support', 'Wholesale Links'];

export default function FooterAdmin() {
  const { refreshFooterMenus, refreshSettings, settings: globalSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'menus' | 'info'>('menus');
  const [menus, setMenus] = useState<FooterMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Drag and Drop States
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  // Link Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<FooterMenu | null>(null);
  const [isCustomSection, setIsCustomSection] = useState(false);
  const [linkFormData, setLinkFormData] = useState({
    sectionTitle: '',
    customSectionTitle: '',
    menuTitle: '',
    menuLink: '',
    order: 0,
    isActive: true,
  });

  // Settings Form State
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [footerText, setFooterText] = useState('');
  const [footerDescription, setFooterDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  
  // Settings Social
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Settings Files
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
  const [footerLogoUrl, setFooterLogoUrl] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await FooterMenuService.getAll();
      setMenus(data);
      
      const setts = await SettingsService.get();
      if (setts) {
        setWebsiteName(setts.websiteName || '');
        setWhatsappNumber(setts.whatsappNumber || '');
        setFooterText(setts.footerText || '');
        setFooterDescription(setts.footerDescription || '');
        setContactEmail(setts.contactEmail || '');
        setContactAddress(setts.contactAddress || '');
        setFooterLogoUrl(setts.footerLogo || '');
        
        if (setts.socialLinks) {
          setFacebook(setts.socialLinks.facebook || '');
          setInstagram(setts.socialLinks.instagram || '');
          setTwitter(setts.socialLinks.twitter || '');
          setLinkedin(setts.socialLinks.linkedin || '');
        }
      }
    } catch (e) {
      console.error('Failed to load footer data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Preset Section Selection options in links
  const existingSections = Array.from(new Set(menus.map((m) => m.sectionTitle)));
  const availableSections = Array.from(new Set([...PRESET_SECTIONS, ...existingSections]));

  // Reorder HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string, section: string) => {
    setDraggedId(id);
    setDraggedSection(section);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string, targetSection: string) => {
    e.preventDefault();
    if (draggedId === targetId || draggedSection !== targetSection) return;
  };

  const handleDrop = (e: React.DragEvent, targetId: string, targetSection: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId || draggedSection !== targetSection) return;

    const sectionItems = [...menus.filter((m) => m.sectionTitle === targetSection)];
    sectionItems.sort((a, b) => a.order - b.order);

    const draggedIdx = sectionItems.findIndex((m) => m._id === draggedId);
    const targetIdx = sectionItems.findIndex((m) => m._id === targetId);

    if (draggedIdx === -1 || targetIdx === -1) return;

    const [removed] = sectionItems.splice(draggedIdx, 1);
    sectionItems.splice(targetIdx, 0, removed);

    const updatedSectionItems = sectionItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    const otherItems = menus.filter((m) => m.sectionTitle !== targetSection);
    setMenus([...otherItems, ...updatedSectionItems]);
    setHasUnsavedOrder(true);
    setDraggedId(null);
    setDraggedSection(null);
  };

  const handleSaveReorder = async () => {
    setReordering(true);
    try {
      const orders = menus.map((m) => ({ id: m._id, order: m.order }));
      await FooterMenuService.reorder(orders);
      setHasUnsavedOrder(false);
      await refreshFooterMenus();
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving footer menu order');
    } finally {
      setReordering(false);
    }
  };

  // Open Modal for Create or Edit
  const handleOpenLinkModal = (menu?: FooterMenu) => {
    if (menu) {
      setEditingMenu(menu);
      const isPreset = PRESET_SECTIONS.includes(menu.sectionTitle);
      setIsCustomSection(!isPreset);
      setLinkFormData({
        sectionTitle: isPreset ? menu.sectionTitle : '',
        customSectionTitle: isPreset ? '' : menu.sectionTitle,
        menuTitle: menu.menuTitle,
        menuLink: menu.menuLink,
        order: menu.order,
        isActive: menu.isActive,
      });
    } else {
      setEditingMenu(null);
      setIsCustomSection(false);
      
      // Calculate order for new item
      const defaultSec = availableSections[0] || 'Quick Links';
      const itemsInSec = menus.filter((m) => m.sectionTitle === defaultSec);
      
      setLinkFormData({
        sectionTitle: defaultSec,
        customSectionTitle: '',
        menuTitle: '',
        menuLink: '/',
        order: itemsInSec.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSection = isCustomSection
      ? linkFormData.customSectionTitle.trim()
      : linkFormData.sectionTitle;

    if (!finalSection) {
      alert('Section title is required');
      return;
    }

    const payload = {
      sectionTitle: finalSection,
      menuTitle: linkFormData.menuTitle,
      menuLink: linkFormData.menuLink,
      order: linkFormData.order,
      isActive: linkFormData.isActive,
    };

    try {
      if (editingMenu) {
        await FooterMenuService.update(editingMenu._id, payload);
      } else {
        await FooterMenuService.create(payload);
      }
      setIsModalOpen(false);
      await refreshFooterMenus();
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving footer link');
    }
  };

  const handleLinkDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this footer link?')) {
      try {
        await FooterMenuService.delete(id);
        await refreshFooterMenus();
        await loadData();
      } catch (err) {
        console.error(err);
        alert('Error deleting link');
      }
    }
  };

  // Submit Settings
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSuccess('');
    setSettingsError('');

    const formData = new FormData();
    formData.append('websiteName', websiteName);
    formData.append('whatsappNumber', whatsappNumber);
    formData.append('footerText', footerText);
    formData.append('footerDescription', footerDescription);
    formData.append('contactEmail', contactEmail);
    formData.append('contactAddress', contactAddress);
    
    // Copy existing headers parameters if defined globally to prevent clearing
    if (globalSettings) {
      formData.append('seoTitle', globalSettings.seoTitle || '');
      formData.append('seoDescription', globalSettings.seoDescription || '');
      formData.append('searchPlaceholder', globalSettings.searchPlaceholder || '');
      formData.append('navbarBgColor', globalSettings.navbarBgColor || '');
      formData.append('navbarTextColor', globalSettings.navbarTextColor || '');
      formData.append('headerSpacingY', globalSettings.headerSpacingY || '');
    }

    const socialLinks = { facebook, instagram, twitter, linkedin };
    formData.append('socialLinks', JSON.stringify(socialLinks));

    if (footerLogoFile) {
      formData.append('footerLogo', footerLogoFile);
    }

    try {
      await SettingsService.update(formData);
      setSettingsSuccess('Footer configurations saved successfully!');
      
      // Update global context cache
      await refreshSettings();
      setFooterLogoFile(null);
      
      // Reload updated info
      const updated = await SettingsService.get();
      if (updated) {
        setFooterLogoUrl(updated.footerLogo || '');
      }
    } catch (err: any) {
      setSettingsError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Render Section Columns logic
  const groupedMenus = {};
  menus.forEach((item) => {
    // @ts-ignore
    if (!groupedMenus[item.sectionTitle]) {
      // @ts-ignore
      groupedMenus[item.sectionTitle] = [];
    }
    // @ts-ignore
    groupedMenus[item.sectionTitle].push(item);
  });
  // Sort items inside each section
  Object.keys(groupedMenus).forEach((key) => {
    // @ts-ignore
    groupedMenus[key].sort((a, b) => a.order - b.order);
  });

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Footer Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your B2B marketplace footer menus, sections, and brand details.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          {hasUnsavedOrder && activeTab === 'menus' && (
            <button
              onClick={handleSaveReorder}
              disabled={reordering}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition shadow-sm"
            >
              {reordering ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
              Save Ordering
            </button>
          )}
          <button
            onClick={() => handleOpenLinkModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Footer Link
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl p-1 border border-gray-100">
        <button
          onClick={() => setActiveTab('menus')}
          className={`flex-1 md:flex-initial px-6 py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
            activeTab === 'menus' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <GripVertical className="w-4.5 h-4.5" />
          Columns & Menu Links
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 md:flex-initial px-6 py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
            activeTab === 'info' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Info className="w-4.5 h-4.5" />
          Footer Information & Branding
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-500 font-semibold">Loading footer workspace...</span>
        </div>
      ) : activeTab === 'menus' ? (
        <div className="space-y-6">
          {hasUnsavedOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs text-amber-800">
              <span className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                You have drag-and-drop order updates that are not saved to the server yet. Click "Save Ordering" to apply.
              </span>
              <button
                onClick={handleSaveReorder}
                disabled={reordering}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold transition ml-4 shrink-0"
              >
                Save Ordering
              </button>
            </div>
          )}

          {Object.keys(groupedMenus).length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500">
              No footer columns or links found. Click "Add Footer Link" to build your dynamic footer schema!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.keys(groupedMenus).map((section) => (
                <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gray-50/70 border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">{section}</span>
                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {/* @ts-ignore */}
                      {groupedMenus[section].length} Links
                    </span>
                  </div>
                  
                  <div className="p-4 divide-y divide-gray-100">
                    {/* @ts-ignore */}
                    {groupedMenus[section].map((link, idx) => (
                      <div
                        key={link._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, link._id, link.sectionTitle)}
                        onDragOver={(e) => handleDragOver(e, link._id, link.sectionTitle)}
                        onDrop={(e) => handleDrop(e, link._id, link.sectionTitle)}
                        className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50/50 transition cursor-grab active:cursor-grabbing group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-gray-600 transition" />
                          <div className="min-w-0">
                            <span className="font-semibold text-gray-800 text-sm block truncate">{link.menuTitle}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 font-mono truncate">
                              <LinkIcon className="w-3 h-3 text-blue-500" />
                              {link.menuLink}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              link.isActive ? 'bg-green-50 text-green-700 border border-green-150' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {link.isActive ? 'Active' : 'Disabled'}
                          </span>
                          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
                            <button
                              onClick={() => handleOpenLinkModal(link)}
                              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleLinkDelete(link._id)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Settings Tab */
        <form onSubmit={handleSettingsSubmit} className="space-y-6">
          {settingsSuccess && (
            <div className="bg-green-50 text-green-700 p-4 border border-green-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-5 h-5" />
              {settingsSuccess}
            </div>
          )}
          {settingsError && (
            <div className="bg-red-50 text-red-655 p-4 border border-red-200 rounded-xl text-xs font-semibold">
              {settingsError}
            </div>
          )}

          {/* Branding & Logo */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3.5">
              <Building className="w-4.5 h-4.5 text-blue-600" />
              Footer Logo & Description
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Footer Branding Logo File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setFooterLogoFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {footerLogoUrl && !footerLogoFile && (
                  <div className="mt-3 relative bg-slate-900 p-3 rounded-lg max-w-xs overflow-hidden flex items-center justify-center">
                    <Image
                      src={footerLogoUrl}
                      alt="Footer Logo Preview"
                      width={180}
                      height={60}
                      unoptimized={true}
                      className="h-10 w-auto object-contain bg-transparent brightness-0 invert"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Footer Description Summary</label>
                <textarea
                  rows={3}
                  value={footerDescription}
                  onChange={(e) => setFooterDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  placeholder="Provide a B2B summary statement about wholesale directory sourcing..."
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3.5">
              <Mail className="w-4.5 h-4.5 text-blue-600" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Inquiry WhatsApp</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    placeholder="e.g. 919876543210 (No spaces/plus)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Support Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    placeholder="e.g. info@wholesaleb2b.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Registered Postal Address</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    placeholder="e.g. Noida, Sector 62, India"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3.5">
              <Share2 className="w-4.5 h-4.5 text-blue-600" />
              Social Media URL Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Facebook Page URL</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  placeholder="https://facebook.com/company"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Instagram Profile URL</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  placeholder="https://instagram.com/company"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Twitter Profile URL</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  placeholder="https://twitter.com/company"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Linkedin Company URL</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  placeholder="https://linkedin.com/company/name"
                />
              </div>
            </div>
          </div>

          {/* Copyright text */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-3.5">
              <Globe className="w-4.5 h-4.5 text-blue-600" />
              Copyright & Trademark Statement
            </h2>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Copyright Statement</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                placeholder="e.g., © 2026 B2B Wholesale Marketplace. All rights reserved."
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={settingsLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-sm transition flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              {settingsLoading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <Save className="w-4.5 h-4.5" />
              )}
              <span>Save Footer Configurations</span>
            </button>
          </div>
        </form>
      )}

      {/* Link CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingMenu ? 'Edit Footer Link' : 'Add Footer Link'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form id="footer-link-form" onSubmit={handleLinkSubmit} className="space-y-5">
                
                {/* Column Section selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Footer Section / Column</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                        <input
                          type="radio"
                          name="section_type"
                          checked={!isCustomSection}
                          onChange={() => setIsCustomSection(false)}
                          className="text-blue-600"
                        />
                        Select Existing Section
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                        <input
                          type="radio"
                          name="section_type"
                          checked={isCustomSection}
                          onChange={() => setIsCustomSection(true)}
                          className="text-blue-600"
                        />
                        Create Custom Column Section
                      </label>
                    </div>

                    {!isCustomSection ? (
                      <select
                        value={linkFormData.sectionTitle}
                        onChange={(e) => setLinkFormData({ ...linkFormData, sectionTitle: e.target.value })}
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition text-sm"
                      >
                        {availableSections.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                        {availableSections.length === 0 && (
                          <option value="Quick Links">Quick Links</option>
                        )}
                      </select>
                    ) : (
                      <div>
                        <input
                          type="text"
                          required
                          value={linkFormData.customSectionTitle}
                          onChange={(e) => setLinkFormData({ ...linkFormData, customSectionTitle: e.target.value })}
                          className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition text-sm"
                          placeholder="e.g. Premium Services, Hot Products"
                        />
                        <p className="text-xs text-gray-500 mt-1">Provide a column title that links will be grouped under.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Link Title / Display Name</label>
                  <input
                    type="text"
                    required
                    value={linkFormData.menuTitle}
                    onChange={(e) => setLinkFormData({ ...linkFormData, menuTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition text-sm"
                    placeholder="e.g., About Us, Request Bulk Quote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Target URL Path / External Link</label>
                  <input
                    type="text"
                    required
                    value={linkFormData.menuLink}
                    onChange={(e) => setLinkFormData({ ...linkFormData, menuLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition font-mono text-sm"
                    placeholder="e.g. /about-us, /products, or https://partner.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Starting with "/" indicates an internal marketplace link, or provide full URL (http/https).</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={linkFormData.order}
                    onChange={(e) => setLinkFormData({ ...linkFormData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl mt-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={linkFormData.isActive}
                      onChange={(e) => setLinkFormData({ ...linkFormData, isActive: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-sm font-semibold text-gray-700">Display link in Footer Column</span>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-650 hover:bg-gray-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="footer-link-form"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-sm text-sm"
              >
                {editingMenu ? 'Save Changes' : 'Create Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
