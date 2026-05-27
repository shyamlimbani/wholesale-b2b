'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Product, Category } from '../../../types';
import { ProductService } from '../../../services/apiService';
import { useSettings } from '../../../context/SettingsContext';
import ProductCard from '../../../components/ProductCard';
import MainLayout from '../../../components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function CategoryPageContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const { categories } = useSettings();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categories && slug) {
      const match = categories.find((c) => c.slug === slug);
      if (match) {
        setCurrentCategory(match);
      }
    }
  }, [categories, slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsData = await ProductService.getAll();
        setAllProducts(productsData);
      } catch (err) {
        console.error('Error fetching category products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  if (!currentCategory && !loading) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Category Not Found</h2>
          <p className="text-slate-500">The wholesale directory you are trying to reach doesn't exist.</p>
          <Link href="/" className="inline-block bg-[#cc3a07] hover:bg-[#a82f05] text-white font-bold px-6 py-2.5 rounded-xl transition text-sm">
            Back to Home
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Filter products belonging to this category
  const filteredProducts = allProducts.filter((product) => {
    if (!currentCategory) return false;
    return product.category === currentCategory._id;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
          <Link href="/" className="hover:text-[#cc3a07] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-600">{currentCategory?.name || 'Category'}</span>
        </div>

        {/* Category Title Section */}
        {currentCategory && (
          <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 select-none">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 uppercase tracking-tight">
              {currentCategory.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">
              {loading ? 'Calculating...' : `${filteredProducts.length} Products Found`}
            </p>
          </div>
        )}

        {/* Products Grid */}
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
                category={currentCategory || undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-slate-100 shadow-xs w-full">
            <h3 className="text-base font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              We couldn't find any products in this category.
            </p>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <Loader2 className="w-10 h-10 text-[#cc3a07] animate-spin" />
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}
