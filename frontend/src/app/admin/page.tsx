'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/apiService';
import { AdminStats } from '@/types';
import { Package, Grid, Image as ImageIcon, MessageSquare, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await AdminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-500 font-semibold">Loading dashboard statistics...</span>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'text-blue-600 bg-blue-50',
      href: '/admin/products',
    },
    {
      label: 'Total Categories',
      value: stats?.totalCategories ?? 0,
      icon: Grid,
      color: 'text-purple-600 bg-purple-50',
      href: '/admin/categories',
    },
    {
      label: 'Active Banners',
      value: stats?.activeBanners ?? 0,
      icon: ImageIcon,
      color: 'text-yellow-600 bg-yellow-50',
      href: '/admin/banners',
    },
    {
      label: 'Simulated Inquiries',
      value: stats?.pendingInquiries ?? 0,
      icon: MessageSquare,
      color: 'text-green-600 bg-green-50',
      href: '/admin',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-gray-550 mt-1">Manage wholesale listings, banners, and catalog categories.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-xs border border-gray-150 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</h3>
                <p className="text-3xl font-black text-gray-800 mt-2">{card.value}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-650 hover:text-blue-800 mt-4 transition"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Marketplace Operational Logs
        </h2>
        <div className="space-y-3.5 text-xs">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-600 font-semibold">Backend Connection</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md font-bold uppercase tracking-wider text-[10px]">
              ONLINE
            </span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-600 font-semibold">Image Upload Integration</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md font-bold uppercase tracking-wider text-[10px]">
              Cloudinary Stream Ready
            </span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-600 font-semibold">Client Data Mode</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-bold uppercase tracking-wider text-[10px]">
              Axios live + Local Demo Fallback
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
