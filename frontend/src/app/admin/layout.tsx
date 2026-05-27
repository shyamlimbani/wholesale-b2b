'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Menu, LogOut } from 'lucide-react';

import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, email, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token && pathname !== '/admin/login') {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const localToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (!localToken) return null;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Reusable Admin Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="ml-0 md:ml-64 flex-1 bg-gray-100 min-h-screen flex flex-col w-full">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="ml-4 font-semibold text-gray-800 lg:hidden">Admin Dashboard</span>
          </div>

          {/* Top Navbar Profile Dropdown */}
          <div className="relative ml-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {email ? email.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-gray-700">{email || 'Admin'}</span>
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{email || 'Admin'}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-650 hover:bg-red-50 hover:text-red-700 rounded-md font-semibold flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
