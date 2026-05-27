'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, Category, NavbarLink, Page, FooterMenu, PopupSetting } from '../types';
import { SettingsService, CategoryService, NavbarService, PageService, FooterMenuService, PopupSettingService } from '../services/apiService';

interface SettingsContextType {
  settings: Settings | null;
  categories: Category[];
  navbar: NavbarLink[];
  pages: Page[];
  footerMenus: FooterMenu[];
  loading: boolean;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshNavbar: () => Promise<void>;
  refreshPages: () => Promise<void>;
  refreshFooterMenus: () => Promise<void>;
  user: { name: string; mobile: string } | null;
  loginUser: (name: string, mobile: string) => void;
  logoutUser: () => void;
  showLoginPopup: boolean;
  setShowLoginPopup: (show: boolean) => void;
  popupSettings: PopupSetting | null;
  refreshPopupSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbar, setNavbar] = useState<NavbarLink[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [footerMenus, setFooterMenus] = useState<FooterMenu[]>([]);
  const [user, setUser] = useState<{ name: string; mobile: string } | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [popupSettings, setPopupSettings] = useState<PopupSetting | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPopupSettings = async () => {
    try {
      const data = await PopupSettingService.get();
      setPopupSettings(data);
    } catch (e) {
      console.error('Failed to load popup settings', e);
    }
  };

  const refreshSettings = async () => {
    try {
      const data = await SettingsService.get();
      setSettings(data);
      if (typeof window !== 'undefined' && data) {
        // Dynamic SEO Update on Client Side
        document.title = data.seoTitle || data.websiteName || 'Wholesale B2B';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.seoDescription || '');
        }
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  const refreshNavbar = async () => {
    try {
      const data = await NavbarService.getAll({ active: true });
      setNavbar(data);
    } catch (e) {
      console.error('Failed to load navbar', e);
    }
  };

  const refreshPages = async () => {
    try {
      const data = await PageService.getAll({ active: true });
      setPages(data);
    } catch (e) {
      console.error('Failed to load pages', e);
    }
  };

  const refreshFooterMenus = async () => {
    try {
      const data = await FooterMenuService.getAll({ active: true });
      setFooterMenus(data);
    } catch (e) {
      console.error('Failed to load footer menus', e);
    }
  };

  const loginUser = (name: string, mobile: string) => {
    const userData = { name, mobile };
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('b2b_lead_captured', 'true');
    }
  };

  const logoutUser = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('b2b_lead_captured');
    }
  };

  useEffect(() => {
    // Load user session client-side
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }

    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        refreshSettings(), 
        refreshCategories(),
        refreshNavbar(),
        refreshPages(),
        refreshFooterMenus(),
        refreshPopupSettings()
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        categories,
        navbar,
        pages,
        footerMenus,
        loading,
        refreshSettings,
        refreshCategories,
        refreshNavbar,
        refreshPages,
        refreshFooterMenus,
        user,
        loginUser,
        logoutUser,
        showLoginPopup,
        setShowLoginPopup,
        popupSettings,
        refreshPopupSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
