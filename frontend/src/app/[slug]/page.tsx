'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageService } from '../../services/apiService';
import { Page } from '../../types';
import MainLayout from '../../components/layout/MainLayout';
import { Loader2, FileText, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '../../context/SettingsContext';

export default function CMSPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { settings } = useSettings();
  
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const data = await PageService.getBySlug(slug);
        setPage(data);
      } catch (err: any) {
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  // Dynamic SEO update client-side
  useEffect(() => {
    if (page) {
      document.title = page.seoTitle || `${page.title} - ${settings?.websiteName || 'Wholesale B2B'}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', page.seoDescription || page.heroSubtitle || '');
      }
    }
  }, [page, settings]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-44">
          <Loader2 className="w-10 h-10 animate-spin text-[#cc3a07]" />
        </div>
      </MainLayout>
    );
  }

  if (error || !page) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl inline-flex mb-6 border border-red-100">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Page Not Found</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">The wholesale policy or documentation page you are looking for does not exist or has been modified.</p>
          <Link href="/" className="bg-[#cc3a07] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#a82f05] transition shadow-sm hover:shadow">
            Return to Marketplace
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16">
        
        {/* Premium Light Gradient Hero Section */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-[#f9ebe6]/40 border-b border-slate-100/80 pt-14 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb navigation */}
            <nav className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 mb-6 uppercase tracking-widest">
              <Link href="/" className="hover:text-[#cc3a07] transition flex items-center gap-1">
                <Home className="w-3 h-3" />
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-800 font-semibold">{page.title}</span>
            </nav>

            {/* Page Header Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-none mb-5 uppercase">
              {page.title}
            </h1>

            {/* Hero Subtitle / Brief Description */}
            <p className="text-base md:text-lg text-slate-500 font-medium max-w-3xl leading-relaxed">
              {page.heroSubtitle || `Wholesale trade guidelines, agreements, and contract records regarding ${page.title.toLowerCase()} policy.`}
            </p>
          </div>
        </div>

        {/* Content Overlapping Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16 z-20 relative">
          <div className="bg-white rounded-3xl p-6 md:p-14 shadow-sm border border-slate-100/70">
            <div 
              className="cms-b2b-content max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
