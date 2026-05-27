'use client';

import React from 'react';
import Link from 'next/link';
import { Product, Category } from '@/types';
import { useSettings } from '@/context/SettingsContext';
import { FaWhatsapp } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
  category?: Category;
}

/** Derives a display-safe stock label from numeric quantity */
function getStockLabel(qty?: number): { label: string; color: string } {
  if (qty === undefined || qty === null) {
    return { label: 'In Stock', color: 'text-gray-400' };
  }
  if (qty === 0) return { label: 'Out of Stock', color: 'text-red-400' };
  if (qty <= 10) return { label: 'Limited Stock', color: 'text-amber-500' };
  return { label: 'In Stock', color: 'text-gray-400' };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { settings } = useSettings();

  // WhatsApp number priority: product-level → global settings fallback
  const rawNumber =
    product.whatsapp?.replace(/\D/g, '') ||
    settings?.whatsappNumber?.replace(/\D/g, '') ||
    '';

  const priceFormatted = `₹${product.price.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const waMessage = encodeURIComponent(
    `Hello, I am interested in ${product.name} - ${priceFormatted}`
  );

  const whatsappUrl = rawNumber
    ? `https://wa.me/${rawNumber}?text=${waMessage}`
    : '#';

  const { label: stockLabel, color: stockColor } = getStockLabel(
    product.stockQuantity
  );

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_6px_24px_rgba(204,58,7,0.10)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* ── Image Section ── */}
      <Link href={`/products/${product._id}`} className="block p-4 pb-0">
        <div className="relative bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: '1 / 1' }}>
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = '/placeholder.png')}
          />
        </div>
      </Link>

      {/* ── WhatsApp Button (floating, centered, below image) ── */}
      <div className="flex justify-center -mt-5 relative z-10">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Inquire about ${product.name}`}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            bg-[#25d366] border border-[#25d366] shadow-md
            hover:scale-110 hover:shadow-lg active:scale-95
            transition-all duration-200
            ${!rawNumber ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <FaWhatsapp className="w-5 h-5 text-white" />
        </a>
      </div>

      {/* ── Card Content ── */}
      <div className="px-4 pt-2 pb-4 flex flex-col items-center text-center gap-1.5 flex-1">
        
        {/* Stock Status */}
        <p className={`text-[11px] font-medium tracking-wide ${stockColor} leading-none`}>
          {stockLabel}
          {product.piecesPerCarton && (
            <span className="text-gray-300 mx-1">|</span>
          )}
          {product.piecesPerCarton && (
            <span className="text-gray-400">{product.piecesPerCarton}</span>
          )}
        </p>

        {/* Product Title */}
        <Link href={`/products/${product._id}`} className="w-full">
          <h3 className="text-[13.5px] font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#cc3a07] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-base font-bold text-[#cc3a07] tracking-tight mt-0.5">
          {priceFormatted}
        </p>
      </div>
    </div>
  );
}
