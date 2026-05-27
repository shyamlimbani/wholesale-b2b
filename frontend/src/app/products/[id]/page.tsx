'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { ProductService, CategoryService } from '@/services/apiService';
import { ArrowLeft, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        const productData = await ProductService.getById(params.id as string);
        setProduct(productData);
        setActiveImage(productData.image || "/placeholder.png");
        
        if (productData.category) {
          const categories = await CategoryService.getAll();
          const cat = categories.find((c) => c._id === productData.category);
          if (cat) {
            setCategory(cat);
            // Fetch related products for this category
            const allProducts = await ProductService.getAll();
            const related = allProducts.filter(p => p.category === cat._id && p._id !== productData._id).slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProductAndRelated();
    }
  }, [params.id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
          <Loader2 className="w-10 h-10 text-[#cc3a07] animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc]">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
          <Link href="/" className="text-[#cc3a07] hover:underline">Return to Marketplace</Link>
        </div>
      </MainLayout>
    );
  }

  const whatsappUrl = `https://wa.me/${product.whatsapp?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(`Hello, I would like to inquire about your product: ${product.name}`)}`;

  // Combine main image with gallery images for thumbnails
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <MainLayout>
      <div className="bg-[#fafbfc] pt-4 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Banner & Breadcrumb */}
          <div className="bg-[#f9ebe6] py-3 px-5 rounded-lg flex items-center justify-between mb-8">
            <h1 className="font-bold text-slate-800 text-lg">Product Details</h1>
            <div className="flex items-center text-sm text-slate-500 font-medium">
              <Link href="/" className="text-[#cc3a07] hover:underline">Home</Link>
              <span className="mx-2">-</span>
              <span className="text-slate-500">Product Details</span>
            </div>
          </div>

          <div className="mb-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* LEFT SIDE: Image Gallery */}
            <div className="w-full lg:w-[45%] flex flex-col gap-4">
              <div className="aspect-square w-full relative bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 shrink-0 border bg-white p-1 overflow-hidden transition-all ${
                        activeImage === img ? 'border-[#cc3a07] ring-1 ring-[#cc3a07] shadow-sm' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Product Info */}
            <div className="w-full lg:w-[55%] flex flex-col">
              
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {category && (
                <div className="mb-6 flex items-center text-sm text-slate-500">
                  <span className="font-semibold text-slate-700 mr-2">Category:</span>
                  <Link href={`/?category=${category.slug}`} className="text-[#cc3a07] hover:underline">
                    {category.name}
                  </Link>
                </div>
              )}

              {/* Price Area */}
              <div className="mb-8">
                <div className="text-4xl font-bold text-[#cc3a07] flex items-baseline gap-2">
                  ₹{product.price?.toLocaleString('en-IN') || 0}
                  <span className="text-sm font-medium text-slate-500">/ Piece</span>
                </div>
              </div>

              {/* Top Quick Details / Wholesale Specifications */}
              {(product.sku || product.hsnCode || product.piecesPerCarton || product.stock || product.dimensions || product.productWeight || product.shippingWeight) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm border-t border-b border-slate-100 py-6 mb-8 text-slate-600">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {product.sku && <div className="flex"><span className="w-32 shrink-0 font-medium text-slate-800">SKU</span> <span className="mr-2">:</span> <span>{product.sku}</span></div>}
                    {product.hsnCode && <div className="flex"><span className="w-32 shrink-0 font-medium text-slate-800">HSN CODE</span> <span className="mr-2">:</span> <span>{product.hsnCode}</span></div>}
                    {product.piecesPerCarton && <div className="flex"><span className="w-32 shrink-0 font-medium text-slate-800">Piece per Carton</span> <span className="mr-2">:</span> <span>{product.piecesPerCarton}</span></div>}
                    {product.stock && <div className="flex"><span className="w-32 shrink-0 font-medium text-slate-800">Stock</span> <span className="mr-2">:</span> <span className="text-green-600 font-semibold">{product.stock}</span></div>}
                  </div>
                  {/* Right Column */}
                  <div className="space-y-3">
                    {product.dimensions && <div className="flex"><span className="w-32 shrink-0 font-medium text-slate-800">Dimensions</span> <span className="mr-2">:</span> <span>{product.dimensions}</span></div>}
                    {product.productWeight && <div className="flex"><span className="w-32 shrink-0 font-medium text-slate-800">Product Weight</span> <span className="mr-2">:</span> <span>{product.productWeight}</span></div>}
                    {product.shippingWeight && <div className="flex"><span className="w-32 shrink-0 font-medium text-slate-800">Shipping Weight</span> <span className="mr-2">:</span> <span>{product.shippingWeight}</span></div>}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto pt-4 w-full">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20b858] text-white px-8 py-3.5 flex items-center justify-center gap-3 transition-colors font-bold text-base uppercase tracking-wide"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Inquiry on WhatsApp
                </a>
              </div>

            </div>
          </div>

          {/* Bottom Large Description Area */}
          <div className="bg-white border border-slate-200 mb-12">
            <div className="border-b border-slate-200">
              <h2 className="text-base font-bold text-[#cc3a07] px-6 py-4 inline-block border-b-2 border-[#cc3a07] relative top-[1px]">
                Description
              </h2>
            </div>
            
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-wide">{product.name}</h3>
              
              <div className="prose prose-slate max-w-none prose-sm sm:prose-base">
                <p className="whitespace-pre-wrap text-slate-600 mb-8 leading-relaxed">
                  {product.description}
                </p>

                {product.features && (
                  <div className="mt-8">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Features :</h4>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600">
                      {product.features.split('\n').filter(Boolean).map((feature, idx) => (
                        <li key={idx} className="leading-relaxed">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="w-full pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6 flex items-center gap-3">
                <span className="h-5 w-1.5 bg-[#cc3a07] rounded-full"></span>
                Related Products in {category?.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relProduct) => (
                  <ProductCard 
                    key={relProduct._id} 
                    product={relProduct} 
                    category={category || undefined}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
