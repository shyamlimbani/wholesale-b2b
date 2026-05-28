export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: any;
  image: string;
  images?: string[];
  sku?: string;
  hsnCode?: string;
  piecesPerCarton?: string;
  stock?: string;
  stockQuantity?: number;
  dimensions?: string;
  productWeight?: string;
  shippingWeight?: string;
  specifications?: string;
  material?: string;
  usage?: string;
  features?: string;
  whatsapp: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: any; // Can be ObjectId string or Category object
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  _id: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  _id?: string;
  logo?: string;
  footerLogo?: string;
  whatsappNumber?: string;
  websiteName?: string;
  seoTitle?: string;
  seoDescription?: string;
  footerText?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  searchPlaceholder?: string;
  navbarBgColor?: string;
  navbarTextColor?: string;
  headerSpacingY?: string;
  footerDescription?: string;
  contactEmail?: string;
  contactAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isActive: boolean;
  heroSubtitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavbarLink {
  _id: string;
  title: string;
  link: string;
  order: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FooterMenu {
  _id: string;
  sectionTitle: string;
  menuTitle: string;
  menuLink: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  mobile: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  activeBanners: number;
  pendingInquiries: number;
}

export interface PopupSetting {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  logo?: string;
  backgroundImage?: string;
  buttonText: string;
  termsText: string;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}
