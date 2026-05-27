import api from '../lib/api';
import { Product, Category, Banner, Settings, AdminStats, Page, NavbarLink, FooterMenu, Lead, PopupSetting } from '../types';

// ==========================================
// MOCK DATA FOR DEMO & FALLBACK
// ==========================================

const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'cat-1',
    name: 'Industrial Machinery',
    slug: 'industrial-machinery',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=500&auto=format&fit=crop&q=80',
    description: 'Heavy machines, CNC, lathes, and fabrication equipment',
  },
  {
    _id: 'cat-2',
    name: 'Textiles & Garments',
    slug: 'textiles-garments',
    image: 'https://images.unsplash.com/photo-1558271821-65ab9014453a?w=500&auto=format&fit=crop&q=80',
    description: 'Cotton, polyester, fabrics, garments, and apparel materials',
  },
  {
    _id: 'cat-3',
    name: 'Electronics & Electrical',
    slug: 'electronics-electrical',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&auto=format&fit=crop&q=80',
    description: 'Sensors, cables, lighting, circuits, and consumer devices',
  },
  {
    _id: 'cat-4',
    name: 'Agriculture & Food',
    slug: 'agriculture-food',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=80',
    description: 'Organic grains, bulk spices, fresh produce, and fertilizers',
  },
  {
    _id: 'cat-5',
    name: 'Medical & Healthcare',
    slug: 'medical-healthcare',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
    description: 'Medical disposables, surgical items, masks, and clinical equipment',
  },
];


const MOCK_BANNERS: Banner[] = [
  {
    _id: 'ban-1',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80',
    link: '/?category=industrial-machinery',
    order: 1,
    isActive: true,
  },
  {
    _id: 'ban-2',
    image: 'https://images.unsplash.com/photo-1558271821-65ab9014453a?w=1600&auto=format&fit=crop&q=80',
    link: '/?category=textiles-garments',
    order: 2,
    isActive: true,
  },
  {
    _id: 'ban-3',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop&q=80',
    link: '/?category=electronics-electrical',
    order: 3,
    isActive: true,
  },
];

const MOCK_SETTINGS: Settings = {
  logo: '',
  footerLogo: '',
  whatsappNumber: '919876543210',
  websiteName: 'IndiB2B Marketplace',
  seoTitle: 'IndiB2B Marketplace - Find Suppliers & Manufacturers',
  seoDescription: 'Connecting wholesale buyers with verified B2B suppliers, manufacturers, exporters, and logistics providers.',
  footerText: '© 2026 IndiB2B Wholesale Inc. All rights reserved. Made for wholesale business transactions.',
  footerDescription: 'Connecting wholesale B2B buyers with verified manufacturers and direct suppliers globally. Simplify your bulk sourcing process.',
  contactEmail: 'info@indib2bwholesale.com',
  contactAddress: 'Industrial Sector 62, Noida, Uttar Pradesh, India',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  searchPlaceholder: 'Search For items...',
  navbarBgColor: '#ffffff',
  navbarTextColor: '#1f2937',
  headerSpacingY: '4',
};

// ==========================================
// CLIENT STATE (IN-MEMORY PERSISTENCE FOR DEMO)
// ==========================================


let localCategories: Category[] = [];
let localBanners: Banner[] = [];
let localSettings: Settings = { ...MOCK_SETTINGS };

const loadLocalState = () => {
  if (typeof window === 'undefined') return;
  

  const categories = localStorage.getItem('local_categories');
  const banners = localStorage.getItem('local_banners');
  const settings = localStorage.getItem('local_settings');


  localCategories = categories ? JSON.parse(categories) : [...MOCK_CATEGORIES];
  localBanners = banners ? JSON.parse(banners) : [...MOCK_BANNERS];
  localSettings = settings ? JSON.parse(settings) : { ...MOCK_SETTINGS };
};

const saveLocalState = () => {
  if (typeof window === 'undefined') return;

  localStorage.setItem('local_categories', JSON.stringify(localCategories));
  localStorage.setItem('local_banners', JSON.stringify(localBanners));
  localStorage.setItem('local_settings', JSON.stringify(localSettings));
};

// Load initial local state
if (typeof window !== 'undefined') {
  loadLocalState();
  saveLocalState();
}

// Helper to wait
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// API SERVICES
// ==========================================

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const { data } = await api.get('/categories');
      // If backend returns nothing or is empty, use mock
      if (!data || data.length === 0) return localCategories;
      return data;
    } catch (e) {
      console.warn('Category fetch error, falling back to mock:', e);
      return localCategories;
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      const { data } = await api.get(`/categories/${id}`);
      return data;
    } catch (e) {
      const found = localCategories.find((c) => c._id === id);
      if (found) return found;
      throw e;
    }
  },

  create: async (formData: FormData): Promise<Category> => {
    try {
      const { data } = await api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Category create error, creating locally:', e);
      const name = formData.get('name') as string;
      const slug = formData.get('slug') as string || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const description = formData.get('description') as string;
      
      const newCat: Category = {
        _id: `cat-${Date.now()}`,
        name,
        slug,
        description,
        image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=500&auto=format&fit=crop&q=80',
      };
      
      localCategories.push(newCat);
      saveLocalState();
      return newCat;
    }
  },

  update: async (id: string, formData: FormData): Promise<Category> => {
    try {
      const { data } = await api.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Category update error, updating locally:', e);
      const index = localCategories.findIndex((c) => c._id === id);
      if (index === -1) throw new Error('Category not found');

      const name = formData.get('name') as string;
      const slug = formData.get('slug') as string;
      const description = formData.get('description') as string;

      localCategories[index] = {
        ...localCategories[index],
        name: name || localCategories[index].name,
        slug: slug || localCategories[index].slug,
        description: description || localCategories[index].description,
      };

      saveLocalState();
      return localCategories[index];
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (e) {
      console.warn('Category delete error, deleting locally:', e);
      localCategories = localCategories.filter((c) => c._id !== id);
      saveLocalState();
    }
  },
};



export const BannerService = {
  getAll: async (params?: { active?: boolean }): Promise<Banner[]> => {
    try {
      const { data } = await api.get('/banners', {
        params: { active: params?.active ? 'true' : 'false' },
      });
      if (!data || data.length === 0) return localBanners.filter(b => !params?.active || b.isActive);
      return data;
    } catch (e) {
      console.warn('Banner fetch error, falling back to mock:', e);
      return localBanners.filter(b => !params?.active || b.isActive);
    }
  },

  create: async (payload: Partial<Banner>): Promise<Banner> => {
    try {
      const { data } = await api.post('/banners', payload);
      return data;
    } catch (e) {
      console.warn('Banner create error, creating locally:', e);
      const newBan: Banner = {
        _id: `ban-${Date.now()}`,
        image: payload.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80',
        link: payload.link,
        order: payload.order || 0,
        isActive: payload.isActive ?? true,
      };

      localBanners.push(newBan);
      localBanners.sort((a, b) => a.order - b.order);
      saveLocalState();
      return newBan;
    }
  },

  update: async (id: string, payload: Partial<Banner>): Promise<Banner> => {
    try {
      const { data } = await api.put(`/banners/${id}`, payload);
      return data;
    } catch (e) {
      console.warn('Banner update error, updating locally:', e);
      const index = localBanners.findIndex((b) => b._id === id);
      if (index === -1) throw new Error('Banner not found');

      localBanners[index] = {
        ...localBanners[index],
        image: payload.image || localBanners[index].image,
        link: payload.link !== undefined ? payload.link : localBanners[index].link,
        order: payload.order !== undefined ? payload.order : localBanners[index].order,
        isActive: payload.isActive !== undefined ? payload.isActive : localBanners[index].isActive,
      };

      localBanners.sort((a, b) => a.order - b.order);
      saveLocalState();
      return localBanners[index];
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/banners/${id}`);
    } catch (e) {
      console.warn('Banner delete error, deleting locally:', e);
      localBanners = localBanners.filter((b) => b._id !== id);
      saveLocalState();
    }
  },
};

export const SettingsService = {
  get: async (): Promise<Settings> => {
    try {
      const { data } = await api.get('/settings');
      if (!data) return localSettings;
      return data;
    } catch (e) {
      console.warn('Settings fetch error, falling back to mock:', e);
      return localSettings;
    }
  },

  update: async (formData: FormData): Promise<Settings> => {
    try {
      const { data } = await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (e) {
      console.warn('Settings update error, updating locally:', e);
      
      const whatsappNumber = formData.get('whatsappNumber') as string;
      const websiteName = formData.get('websiteName') as string;
      const seoTitle = formData.get('seoTitle') as string;
      const seoDescription = formData.get('seoDescription') as string;
      const footerText = formData.get('footerText') as string;
      const footerDescription = formData.get('footerDescription') as string;
      const contactEmail = formData.get('contactEmail') as string;
      const contactAddress = formData.get('contactAddress') as string;
      const facebook = formData.get('facebook') as string;
      const instagram = formData.get('instagram') as string;
      const twitter = formData.get('twitter') as string;
      const linkedin = formData.get('linkedin') as string;

      const logoFile = formData.get('logo') as File | null;
      const footerLogoFile = formData.get('footerLogo') as File | null;
      
      let logoUrl = localSettings.logo;
      let footerLogoUrl = localSettings.footerLogo;
      
      if (logoFile && typeof window !== 'undefined') {
        try {
          logoUrl = URL.createObjectURL(logoFile);
        } catch (err) {
          console.error(err);
        }
      }
      if (footerLogoFile && typeof window !== 'undefined') {
        try {
          footerLogoUrl = URL.createObjectURL(footerLogoFile);
        } catch (err) {
          console.error(err);
        }
      }

      localSettings = {
        ...localSettings,
        logo: logoUrl,
        footerLogo: footerLogoUrl,
        whatsappNumber: whatsappNumber || localSettings.whatsappNumber,
        websiteName: websiteName || localSettings.websiteName,
        seoTitle: seoTitle !== undefined ? seoTitle : localSettings.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : localSettings.seoDescription,
        footerText: footerText !== undefined ? footerText : localSettings.footerText,
        footerDescription: footerDescription !== undefined ? footerDescription : localSettings.footerDescription,
        contactEmail: contactEmail !== undefined ? contactEmail : localSettings.contactEmail,
        contactAddress: contactAddress !== undefined ? contactAddress : localSettings.contactAddress,
        socialLinks: {
          facebook: facebook !== undefined ? facebook : localSettings.socialLinks?.facebook,
          instagram: instagram !== undefined ? instagram : localSettings.socialLinks?.instagram,
          twitter: twitter !== undefined ? twitter : localSettings.socialLinks?.twitter,
          linkedin: linkedin !== undefined ? linkedin : localSettings.socialLinks?.linkedin,
        },
        searchPlaceholder: formData.get('searchPlaceholder') as string || localSettings.searchPlaceholder,
        navbarBgColor: formData.get('navbarBgColor') as string || localSettings.navbarBgColor,
        navbarTextColor: formData.get('navbarTextColor') as string || localSettings.navbarTextColor,
        headerSpacingY: formData.get('headerSpacingY') as string || localSettings.headerSpacingY,
      };

      saveLocalState();
      return localSettings;
    }
  },
};

export const AdminService = {
  getStats: async (): Promise<AdminStats> => {
    try {
      // Try to fetch real counts if possible
      const products = await ProductService.getAll();
      const categories = await CategoryService.getAll();
      const banners = await BannerService.getAll();
      
      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        activeBanners: banners.filter((b) => b.isActive).length,
        pendingInquiries: 5, // Mock inquiry count
      };
    } catch (e) {
      return {
        totalProducts: 0,
        totalCategories: localCategories.length,
        activeBanners: localBanners.filter((b) => b.isActive).length,
        pendingInquiries: 3,
      };
    }
  },
};

export const ProductService = {
  getAll: async (params?: { category?: string; search?: string }): Promise<Product[]> => {
    try {
      const { data } = await api.get('/products', { params });
      return data;
    } catch (e) {
      return [];
    }
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (payload: Partial<Product>): Promise<Product> => {
    const { data } = await api.post('/products', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Product>): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  exportCsvUrl: `${api.defaults.baseURL || '/api'}/products/export`,

  importCsv: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

export const PageService = {
  getAll: async (params?: { active?: boolean }): Promise<Page[]> => {
    try {
      const { data } = await api.get('/pages', {
        params: { active: params?.active ? 'true' : 'false' },
      });
      return data;
    } catch (e) {
      return [];
    }
  },

  getBySlug: async (slug: string): Promise<Page> => {
    const { data } = await api.get(`/pages/${slug}`);
    return data;
  },

  create: async (payload: Partial<Page>): Promise<Page> => {
    const { data } = await api.post('/pages', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Page>): Promise<Page> => {
    const { data } = await api.put(`/pages/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pages/${id}`);
  },
};

export const NavbarService = {
  getAll: async (params?: { active?: boolean }): Promise<NavbarLink[]> => {
    try {
      const { data } = await api.get('/navbar', {
        params: { active: params?.active ? 'true' : 'false' },
      });
      return data;
    } catch (e) {
      return [];
    }
  },

  create: async (payload: Partial<NavbarLink>): Promise<NavbarLink> => {
    const { data } = await api.post('/navbar', payload);
    return data;
  },

  update: async (id: string, payload: Partial<NavbarLink>): Promise<NavbarLink> => {
    const { data } = await api.put(`/navbar/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/navbar/${id}`);
  },
};

export const FooterMenuService = {
  getAll: async (params?: { active?: boolean }): Promise<FooterMenu[]> => {
    try {
      const { data } = await api.get('/footer-menus', {
        params: { active: params?.active ? 'true' : 'false' },
      });
      return data;
    } catch (e) {
      return [];
    }
  },

  create: async (payload: Partial<FooterMenu>): Promise<FooterMenu> => {
    const { data } = await api.post('/footer-menus', payload);
    return data;
  },

  update: async (id: string, payload: Partial<FooterMenu>): Promise<FooterMenu> => {
    const { data } = await api.put(`/footer-menus/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/footer-menus/${id}`);
  },

  reorder: async (orders: { id: string; order: number }[]): Promise<void> => {
    await api.put('/footer-menus/reorder', { orders });
  },
};

export const LeadService = {
  create: async (payload: { name: string; mobile: string }): Promise<any> => {
    const { data } = await api.post('/leads', payload);
    return data.lead;
  },

  getAll: async (params?: { search?: string }): Promise<Lead[]> => {
    try {
      const { data } = await api.get('/leads', { params });
      console.log('Leads API res.data:', data);
      return data.leads || [];
    } catch (e) {
      console.error('Error fetching leads:', e);
      return [];
    }
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },
};

export const PopupSettingService = {
  get: async (): Promise<PopupSetting> => {
    try {
      const { data } = await api.get('/popup-settings');
      return data;
    } catch (e) {
      console.warn('PopupSettings fetch error, returning defaults:', e);
      return {
        title: "Welcome to India's Trusted Wholesale Marketplace",
        subtitle: 'Connect with verified suppliers and buyers instantly.',
        description: 'Please enter your credentials to explore the premium wholesale catalog, download bulk catalogs, and request direct factory pricing.',
        logo: '',
        backgroundImage: '',
        buttonText: 'Explore Wholesale Deals',
        termsText: 'Verified B2B Business Verification',
        isEnabled: true,
      };
    }
  },

  update: async (formData: FormData): Promise<PopupSetting> => {
    const { data } = await api.put('/popup-settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
