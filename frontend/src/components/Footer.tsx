'use client';

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import Link from 'next/link';
import { Phone, MapPin, Mail } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import Image from 'next/image';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer() {
  const { settings, categories, footerMenus } = useSettings();

  const socialLinks = settings?.socialLinks || {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  };

  // Group active footer menus by sectionTitle
  const groupedMenus: { [sectionTitle: string]: typeof footerMenus } = {};
  footerMenus.forEach((item) => {
    if (item.isActive !== false) {
      if (!groupedMenus[item.sectionTitle]) {
        groupedMenus[item.sectionTitle] = [];
      }
      groupedMenus[item.sectionTitle].push(item);
    }
  });

  // Sort items inside each section by order
  Object.keys(groupedMenus).forEach((section) => {
    groupedMenus[section].sort((a, b) => a.order - b.order);
  });

  // Sort section columns by their minimum item order
  const sortedSections = Object.keys(groupedMenus).sort((secA, secB) => {
    const minOrderA = Math.min(...groupedMenus[secA].map((item) => item.order));
    const minOrderB = Math.min(...groupedMenus[secB].map((item) => item.order));
    return minOrderA - minOrderB;
  });

  const defaultDescription = 'Connecting wholesale B2B buyers with verified manufacturers and direct suppliers globally. Simplify your bulk sourcing process.';

  return (
    <footer className="bg-slate-950 text-slate-350 border-t border-slate-900 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-10">
          
          {/* Col 1: About, Logo & Socials */}
          <div className="flex flex-col gap-5 md:col-span-2 xl:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              {settings?.footerLogo ? (
                <div className="flex items-center justify-start overflow-hidden bg-transparent">
                  <Image
                    src={settings.footerLogo.includes('?') ? `${settings.footerLogo}&v=${encodeURIComponent(settings.updatedAt || Date.now())}` : `${settings.footerLogo}?v=${encodeURIComponent(settings.updatedAt || Date.now())}`}
                    alt={settings?.websiteName || 'Wholesale B2B'}
                    width={180}
                    height={60}
                    unoptimized={true}
                    className="h-10 w-auto object-contain bg-transparent brightness-0 invert"
                  />
                </div>
              ) : (
                <span className="font-extrabold text-xl text-white tracking-tight">
                  {settings?.websiteName || 'Wholesale B2B'}
                </span>
              )}
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings?.footerDescription || settings?.seoDescription || defaultDescription}
            </p>
            {/* Social Icons */}
            <div className="flex gap-4.5 mt-2">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#cc3a07] transition">
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition">
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#cc3a07] transition">
                  <TwitterIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#cc3a07] transition">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2..N: Dynamic Database columns */}
          {sortedSections.map((section) => (
            <div key={section} className="flex flex-col gap-4">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest border-l-2 border-[#cc3a07] pl-2.5">
                {section}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {groupedMenus[section].map((item) => (
                  <li key={item._id}>
                    {item.menuLink.startsWith('/') ? (
                      <Link href={item.menuLink} className="hover:text-white transition text-slate-400 block py-0.5">
                        {item.menuTitle}
                      </Link>
                    ) : (
                      <a href={item.menuLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition text-slate-400 block py-0.5">
                        {item.menuTitle}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Fallback default columns if database menus are empty */}
          {sortedSections.length === 0 && (
            <>
              {/* Fallback Col 2: Top Categories */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest border-l-2 border-[#cc3a07] pl-2.5">
                  Top Categories
                </h4>
                <ul className="space-y-2.5 text-xs">
                  {categories.slice(0, 5).map((cat) => (
                    <li key={cat._id}>
                      <Link href={`/?category=${cat.slug}`} className="hover:text-white transition text-slate-400 block py-0.5">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  {categories.length === 0 && (
                    <li className="text-slate-500">No categories loaded</li>
                  )}
                </ul>
              </div>

              {/* Fallback Col 3: Quick Links */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest border-l-2 border-[#cc3a07] pl-2.5">
                  Quick Links
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link href="/" className="hover:text-white transition text-slate-400 block py-0.5">
                      Marketplace Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-white transition text-slate-400 block py-0.5">
                      Explore Products
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Last Col: Contact & Help Panel */}
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1 xl:col-span-2">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-widest border-l-2 border-[#cc3a07] pl-2.5">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#cc3a07] shrink-0" />
                <span className="text-slate-300 font-medium">+{settings?.whatsappNumber || '919876543210'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#cc3a07] shrink-0" />
                <span className="text-slate-300 truncate">{settings?.contactEmail || 'info@indib2bwholesale.com'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#cc3a07] shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-400">{settings?.contactAddress || 'Industrial Sector 62, Noida, Uttar Pradesh, India'}</span>
              </div>
              <div className="pt-2 max-w-xs">
                <WhatsAppButton
                  message="Hi, I would like to get help or support with ordering products on your platform."
                  className="w-full text-xs font-bold py-3 flex items-center justify-center gap-2 rounded-xl"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="border-t border-slate-900 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>{settings?.footerText || `© 2026 ${settings?.websiteName || 'Wholesale B2B'}. All rights reserved.`}</p>
          <div className="flex gap-5 font-medium">
            <Link href="/privacy-policy" className="hover:text-slate-450 transition">Privacy Policy</Link>
            <Link href="/terms-of-use" className="hover:text-slate-450 transition">Terms of Use</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
