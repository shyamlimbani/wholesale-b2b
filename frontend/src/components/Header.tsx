'use client';

import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import Link from 'next/link';
import { Menu, X, Search, Grid, ChevronDown, Download, LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CatalogDownloadModal from './CatalogDownloadModal';
import toast from 'react-hot-toast';
import { getImageUrl } from '../lib/imageHelper';

const getCategoryEmoji = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('machinery') || n.includes('industrial') || n.includes('tool') || n.includes('cnc')) return '⚙️';
  if (n.includes('textile') || n.includes('fabric') || n.includes('apparel') || n.includes('garment') || n.includes('cloth') || n.includes('bag')) return '👜';
  if (n.includes('electronic') || n.includes('cable') || n.includes('sensor') || n.includes('light') || n.includes('circuit')) return '⚡';
  if (n.includes('agriculture') || n.includes('food') || n.includes('spice') || n.includes('grain') || n.includes('crop')) return '🌾';
  if (n.includes('medical') || n.includes('health') || n.includes('surgical') || n.includes('care')) return '🏥';
  if (n.includes('beauty') || n.includes('cosmetic')) return '💄';
  if (n.includes('home') || n.includes('kitchen')) return '🏠';
  return '📦';
};

interface HeaderProps {
  onSearch?: (query: string, category: string) => void;
  initialSearch?: string;
  initialCategory?: string;
}

export default function Header({ onSearch, initialSearch = '', initialCategory = '' }: HeaderProps) {
  const { settings, categories, navbar, user, logoutUser, setShowLoginPopup } = useSettings();
  const router = useRouter();

  const [searchVal, setSearchVal] = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const initials = user && user.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal, selectedCat);
    } else {
      const params = new URLSearchParams();
      if (searchVal) params.set('search', searchVal);
      if (selectedCat) params.set('category', selectedCat);
      router.push(`/?${params.toString()}`);
    }
  };

  const selectSearchCategory = (slug: string) => {
    setSelectedCat(slug);
    setSearchDropdownOpen(false);
  };

  const getCategoryName = (slug: string) => {
    if (!slug) return 'All Categories';
    const cat = categories.find((c) => c.slug === slug);
    return cat ? cat.name : 'All Categories';
  };

  // Extract settings or use defaults
  const searchPlaceholder = settings?.searchPlaceholder || 'Search For items...';
  const navbarBgColor = settings?.navbarBgColor || '#ffffff';
  const navbarTextColor = settings?.navbarTextColor || '#1f2937';
  const headerSpacingY = settings?.headerSpacingY || '4'; // Tailwind py-4

  return (
    <header className="sticky top-0 z-35 w-full flex flex-col shadow-sm">
      {/* TOP HEADER (Logo + Search) */}
      <div 
        className="bg-white" 
        style={{ padding: `${Number(headerSpacingY) * 0.25}rem 0` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 md:gap-10">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
              {settings?.logo ? (
                <div className="flex items-center justify-center overflow-hidden bg-transparent">
                  <Image
                    src={settings.logo}
                    alt={settings.websiteName || 'My Website'}
                    width={180}
                    height={60}
                    unoptimized={true}
                    className="h-10 md:h-14 w-auto object-contain bg-transparent"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="bg-[#cc3a07] text-white p-2 rounded-xl shadow-sm">
                    <Grid className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg sm:text-2xl text-slate-800 tracking-tight">
                    {settings?.websiteName || 'Wholesale B2B'}
                  </span>
                </div>
              )}
            </Link>

            {/* Large Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-2xl bg-white border border-[#cc3a07] rounded-md overflow-hidden transition-all shadow-xs mx-auto"
            >
              {/* TextInput Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => setSearchVal('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="bg-[#cc3a07] hover:bg-[#a82f05] text-white text-sm px-8 py-2.5 transition-all flex items-center justify-center shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Action Buttons (Download + Login/Logout + Mobile Toggle) */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Download Catalog Button (Hidden on very small screens, visible on md+) */}
              <button
                onClick={() => setDownloadModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"
              >
                <Download className="w-4 h-4 text-[#cc3a07]" />
                <span>Catalog</span>
              </button>

              {/* Dynamic User Profile/Login on Header */}
              {user ? (
                <div 
                  className="relative flex items-center"
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {/* Premium User Profile Button with SVG Avatar & Dropdown Chevron */}
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 bg-white border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all select-none cursor-pointer duration-200"
                  >
                    {/* SVG Avatar with Monogram initials */}
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#cc3a07] to-[#a82f05] flex items-center justify-center text-white text-xs font-black shadow-inner border border-white/20">
                      {initials}
                      {/* Online status dot */}
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-500"></span>
                    </div>
                    <span className="max-w-[60px] sm:max-w-[100px] truncate text-slate-800 font-bold">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Stripe/Shopify-style Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full pt-2.5 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-white border border-slate-150 rounded-2xl shadow-xl p-4.5 text-slate-700 flex flex-col gap-3.5 bg-gradient-to-b from-white to-slate-50/50">
                        
                        {/* Profile Card Header */}
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#cc3a07] to-[#a82f05] flex items-center justify-center text-white text-sm font-black shadow-md border border-white">
                            {initials}
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-500 animate-pulse"></span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="font-extrabold text-slate-900 text-sm truncate leading-tight">{user.name}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">{user.mobile}</div>
                          </div>
                        </div>

                        <div className="border-t border-slate-100"></div>

                        {/* Dropdown Options */}
                        <div className="flex flex-col gap-1">
                          {/* Option: My Profile */}
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              toast.success("Profile is verified & active!");
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#cc3a07] transition-all cursor-pointer text-left font-semibold text-sm"
                          >
                            <span className="flex items-center gap-2.5">
                              <svg className="w-4.5 h-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>My Profile</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 font-extrabold px-1.5 py-0.5 rounded-sm">Active</span>
                          </button>

                          {/* Option: Logout */}
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logoutUser();
                              toast.success("Logged out successfully");
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer text-left"
                          >
                            <LogOut className="w-4.5 h-4.5 text-rose-500" />
                            <span>Logout</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Button with Premium SVG Login Icon */
                <button
                  onClick={() => setShowLoginPopup(true)}
                  className="flex items-center gap-2 bg-white hover:bg-[#f9ebe6] text-[#cc3a07] border border-[#cc3a07]/30 hover:border-[#cc3a07] px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm hover:shadow-md cursor-pointer duration-200"
                >
                  <svg className="w-4.5 h-4.5 text-[#cc3a07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4 pb-2">
            <form onSubmit={handleSearchSubmit} className="flex border-2 border-[#cc3a07] rounded-full overflow-hidden shadow-xs bg-white">
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full px-4 py-2 text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="bg-[#cc3a07] hover:bg-[#a82f05] text-white px-4 py-2 text-sm font-semibold transition flex items-center justify-center shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION MENU */}
      <nav 
        className="hidden md:block w-full border-t border-slate-100/60 shadow-xs"
        style={{ backgroundColor: navbarBgColor, color: navbarTextColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ul className="flex items-center gap-7 h-14 text-[14px] font-semibold tracking-normal">
            {/* Hardcoded Home */}
            <li>
              <Link href="/" className="hover:text-[#cc3a07] transition-colors">
                Home
              </Link>
            </li>

            {/* Categories Dropdown in Nav - Fixed Hover Mega Menu */}
            <li className="group h-full flex items-center">
              <button 
                className="flex items-center gap-1.5 hover:text-[#cc3a07] transition-colors focus:outline-hidden text-slate-700 font-semibold group-hover:text-[#cc3a07] cursor-pointer"
              >
                Category
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-[#cc3a07]" />
              </button>
              
              {/* Invisible Hover Bridge & Dropdown Menu Container */}
              <div 
                className="absolute left-0 right-0 top-full pt-2 w-full z-50 hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {/* Compact category mega menu grid - Text Only */}
                <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-5 grid grid-cols-4 gap-x-6 gap-y-2.5 text-slate-700 font-medium">
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <Link 
                        key={cat._id} 
                        href={`/category/${cat.slug}`}
                        className="flex items-center px-3.5 py-2 rounded-lg text-slate-700 hover:text-[#cc3a07] hover:bg-[#f9ebe6] transition-all duration-150 cursor-pointer select-none text-sm font-semibold truncate"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-4 text-center text-slate-400 text-xs font-semibold">
                      No categories found
                    </div>
                  )}
                </div>
              </div>
            </li>

            {/* Dynamic CMS Navbar Links */}
            {navbar.filter(n => n.isVisible).map((navLink) => (
              <li key={navLink._id}>
                <Link href={navLink.link} className="hover:text-[#cc3a07] transition-colors">
                  {navLink.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 p-0 transition-all duration-300">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <span className="font-bold text-slate-800">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-xl text-slate-500 hover:bg-slate-200 border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              {/* Mobile User Profile Section */}
              {user ? (
                <div className="px-4 py-4 mb-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col gap-3.5 mx-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#cc3a07] to-[#a82f05] flex items-center justify-center text-white text-xs font-black shadow-sm border border-white">
                      {initials}
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-500"></span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Business Profile</div>
                      <div className="font-extrabold text-slate-900 text-sm truncate leading-tight">{user.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">{user.mobile}</div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100/80"></div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        toast.success("Profile is verified & active!");
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition border border-slate-200 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4.5 h-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                      </span>
                      <span className="text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 font-extrabold px-1.5 py-0.5 rounded-sm">Verified</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logoutUser();
                        toast.success("Logged out successfully");
                      }}
                      className="w-full text-center bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-xl text-xs font-bold transition border border-rose-100 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 mb-4 mx-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLoginPopup(true);
                    }}
                    className="w-full text-center bg-[#cc3a07] hover:bg-[#a82f05] text-white py-2.5 rounded-xl text-sm font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </button>
                </div>
              )}

              <ul className="space-y-1 px-4">
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-slate-700 hover:text-[#cc3a07] hover:bg-slate-50 px-4 py-3 rounded-xl transition"
                  >
                    Home
                  </Link>
                </li>

                {/* Mobile Download Catalog */}
                <li>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDownloadModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between text-sm font-semibold text-[#cc3a07] hover:bg-[#f9ebe6] px-4 py-3 rounded-xl transition"
                  >
                    <span>Download Catalog</span>
                    <Download className="w-4 h-4" />
                  </button>
                </li>
                
                {/* Mobile Categories Accordion */}
                <li className="py-2">
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#cc3a07] px-4 py-3 rounded-xl transition cursor-pointer select-none"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-180 text-[#cc3a07]' : ''}`} />
                  </button>

                  {/* Expandable Accordion Menu */}
                  {mobileCategoriesOpen && (
                    <ul className="space-y-1 mt-1 pl-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      {categories.map(cat => (
                        <li key={cat._id}>
                          <Link
                            href={`/category/${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-[#cc3a07] hover:bg-slate-50 px-4 py-2.5 rounded-xl transition"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 font-semibold"></div>
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                
                <li className="border-t border-slate-100 my-2"></li>

                {/* Mobile CMS Pages */}
                {navbar.filter(n => n.isVisible).map(navLink => (
                  <li key={navLink._id}>
                    <Link
                      href={navLink.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-semibold text-slate-700 hover:text-[#cc3a07] hover:bg-slate-50 px-4 py-3 rounded-xl transition"
                    >
                      {navLink.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
          </div>
        </div>
      )}

      {/* Download Catalog Modal */}
      <CatalogDownloadModal 
        isOpen={downloadModalOpen} 
        onClose={() => setDownloadModalOpen(false)} 
      />
    </header>
  );
}
