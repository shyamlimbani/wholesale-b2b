'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Package, Grid, Image as ImageIcon, Settings, LogOut, X, FileText, Link as LinkIcon, List, Users, Sliders } from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Grid },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'CMS Pages', href: '/admin/pages', icon: FileText },
  { name: 'Navbar Links', href: '/admin/navbar', icon: LinkIcon },
  { name: 'Footer Links', href: '/admin/footer', icon: List },
  { name: 'Wholesale Leads', href: '/admin/leads', icon: Users },
  { name: 'Popup Settings', href: '/admin/popup-settings', icon: Sliders },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { email, logout } = useAuthStore();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 bg-[#0f172a] text-white z-50 border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800 shrink-0">
        <span className="text-xl font-extrabold text-white tracking-tight">Admin Portal</span>
        <button className="lg:hidden text-gray-400 hover:text-white p-1.5 transition" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-semibold ${
                isActive
                  ? 'bg-[#cc3a07] text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 shrink-0">
        <div className="mb-4 px-4">
          <p className="text-xs text-gray-400 truncate">Signed in as</p>
          <p className="text-xs font-bold text-gray-200 truncate">{email || 'admin@gmail.com'}</p>
        </div>
        <button
          onClick={() => {
            logout();
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
            onClose();
          }}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition font-semibold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
