'use client';

import React, { useState } from 'react';
import { X, FileText, Download, Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface CatalogDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogDownloadModal({ isOpen, onClose }: CatalogDownloadModalProps) {
  const { categories } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Determine backend URL. Assuming standard NEXT_PUBLIC_API_URL or relative fallback.
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;
    const downloadUrl = `${baseUrl}/catalog/download/${selectedCategory}`;

    try {
      // Trigger download by creating an anchor tag
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.target = '_blank'; // Required to download cleanly or open pdf in new tab
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Close modal after a short delay
      setTimeout(() => {
        setIsDownloading(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to download catalog', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !isDownloading && onClose()}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#f9ebe6] p-2 rounded-xl text-[#cc3a07]">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Download Catalog</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isDownloading}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <p className="text-sm text-slate-500">
            Generate a professional PDF catalog containing product details, pricing, and stock status.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Category</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={isDownloading}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cc3a07]/20 focus:border-[#cc3a07] font-medium cursor-pointer disabled:opacity-50"
              >
                <option value="all">All Products (Complete Catalog)</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 bg-[#cc3a07] hover:bg-[#a82f05] disabled:bg-[#f9ebe6] text-white py-3.5 rounded-xl font-bold transition-all shadow-sm shadow-[#cc3a07]/20 hover:shadow-[#cc3a07]/40"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
