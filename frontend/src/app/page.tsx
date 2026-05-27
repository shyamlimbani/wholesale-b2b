'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Banner, Product } from '../types';
import { BannerService, ProductService } from '../services/apiService';
import { useSettings } from '../context/SettingsContext';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import BannerSlider from '../components/BannerSlider';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { SlidersHorizontal, Loader2, Search } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useSettings();

  // Search & Filter State from URL
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Local States
  const [banners, setBanners] = useState<Banner[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Frontend Filter States
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  
  // Sidebar states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bannersData, productsData] = await Promise.all([
          BannerService.getAll({ active: true }),
          ProductService.getAll({ search: searchParam }) // Fetch all products for the current global search, no category filter
        ]);
        setBanners(bannersData);
        setAllProducts(productsData);
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParam]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategorySlug('');
    setSidebarSearch('');
    if (searchParam) {
      router.push('/');
    }
  };

  // Route updates
  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    // Remove category from URL if it exists to cleanly move to frontend filtering
    if (categoryParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('category');
      router.replace(`/?${params.toString()}`);
    }
  };

  const handleGlobalSearch = (query: string, category: string) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (category) {
      setSelectedCategorySlug(category);
    }
    router.push(`/?${params.toString()}`);
  };

  // Frontend Filtering Logic
  const filteredProducts = allProducts.filter(product => {
    // Category Filter
    if (selectedCategorySlug) {
      const selectedCatObj = categories.find(c => c.slug === selectedCategorySlug);
      if (selectedCatObj && product.category !== selectedCatObj._id) {
        return false;
      }
    }
    
    // Sidebar Search Filter
    if (sidebarSearch) {
      const searchLower = sidebarSearch.toLowerCase();
      if (!product.name.toLowerCase().includes(searchLower) && 
          !product.description.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate Product Counts dynamically
  const productCounts = categories.reduce((acc, cat) => {
    acc[cat._id] = allProducts.filter(p => p.category === cat._id).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Add total for 'All Products'
  productCounts['all'] = allProducts.length;

  return (
    <MainLayout
      onSearch={handleGlobalSearch}
      initialSearch={searchParam}
      initialCategory={selectedCategorySlug || categoryParam}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
        
        {/* Banner Slider - Always Visible */}
        {banners.length > 0 && (
          <section className="w-full">
            <BannerSlider banners={banners} />
          </section>
        )}

        {/* Main Products section with Left Sidebar */}
        <section className="flex flex-col lg:flex-row gap-8 w-full items-start">
          
          {/* Left Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0 hidden lg:block">
            <Sidebar
              selectedCategory={selectedCategorySlug}
              onCategoryChange={handleCategoryChange}
              searchQuery={sidebarSearch}
              onSearchQueryChange={setSidebarSearch}
              onReset={handleResetFilters}
              isMobileOpen={mobileFiltersOpen}
              onMobileClose={() => setMobileFiltersOpen(false)}
              productCounts={productCounts}
            />
          </div>

          {/* Right Product Grid */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            
            {/* Toolbar for grid */}
            <div className="flex justify-between items-center bg-white px-4 py-3 rounded border border-gray-200 mb-2">
              <div className="text-sm font-medium text-gray-600">
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Loading products...</span>
                  ) : (
                    <span>Showing <strong className="text-gray-900">{filteredProducts.length}</strong> products</span>
                  )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-slate-100 rounded-xl text-xs font-semibold text-slate-650 hover:bg-slate-50 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#cc3a07]" />
                <span>Filters</span>
              </button>
            </div>

            {loading ? (
               <div className="flex justify-center items-center py-20">
                 <Loader2 className="w-10 h-10 animate-spin text-[#cc3a07]" />
               </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    category={categories.find(c => c._id === product.category)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-slate-100 shadow-xs w-full">
                <div className="bg-[#f9ebe6] p-5 rounded-full mb-5 text-[#cc3a07]">
                  <Search className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">No products found</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                  We couldn't find any products matching your current criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#cc3a07] hover:bg-[#a82f05] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_4px_12px_rgba(204,58,7,0.25)]"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <Loader2 className="w-10 h-10 text-[#cc3a07] animate-spin" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
