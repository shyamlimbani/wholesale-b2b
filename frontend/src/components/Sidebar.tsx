'use client';

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Search, RefreshCw, FolderOpen } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  productCounts: Record<string, number>;
}

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
  onReset,
  isMobileOpen = false,
  onMobileClose,
  productCounts,
}: SidebarProps) {
  const { categories } = useSettings();

  const filterContent = (
    <div className="flex flex-col bg-white">
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 text-sm">Categories</h3>
      </div>
      <div className="flex flex-col w-full">
        <button
          onClick={() => onCategoryChange('')}
          className={`flex justify-between items-center text-left text-sm py-2.5 px-4 border-b border-gray-100 transition-colors ${
            selectedCategory === ''
              ? 'bg-[#cc3a07] text-white font-medium border-l-2 border-l-[#cc3a07]'
              : 'text-gray-700 hover:bg-gray-50 border-l-2 border-l-transparent'
          }`}
        >
          <span className="truncate pr-2">All Products</span>
          <span className="text-xs text-gray-500">({productCounts['all'] || 0})</span>
        </button>
        {categories.map((cat) => {
          const count = productCounts[cat._id] || 0;
          return (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`flex justify-between items-center text-left text-sm py-2.5 px-4 border-b border-gray-100 transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#cc3a07] text-white font-medium border-l-2 border-l-[#cc3a07]'
                  : 'text-gray-700 hover:bg-gray-50 border-l-2 border-l-transparent'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span className="text-xs text-gray-500">
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white rounded border border-gray-200 shrink-0 sticky top-20 hidden lg:block overflow-hidden self-start">
        {filterContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl z-10 animate-slide-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">Filter Catalog</span>
              <button
                onClick={onMobileClose}
                className="p-1.5 text-slate-500 hover:bg-slate-100 border border-slate-100 rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white">{filterContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
