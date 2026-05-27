'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LeadService } from '../services/apiService';
import { useSettings } from '../context/SettingsContext';
import { Loader2, ArrowRight, ShieldCheck, Smartphone, User, X } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function LeadCapturePopup() {
  const pathname = usePathname();
  const { settings, user, loginUser, showLoginPopup, setShowLoginPopup, popupSettings } = useSettings();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLeadCaptured = localStorage.getItem('b2b_lead_captured');
      
      // Determine if we should show based on isEnabled toggle and user session
      const isMandatoryEnabled = popupSettings?.isEnabled ?? true;
      const isLoggedOut = !isLeadCaptured || !user;
      
      const shouldShow = ((isMandatoryEnabled && isLoggedOut) || showLoginPopup) && !isAdmin;
      
      if (shouldShow) {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
      } else {
        setIsOpen(false);
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [pathname, isAdmin, user, showLoginPopup, popupSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.trim();
    if (!cleanMobile) {
      setErrorMsg('Please enter your mobile number.');
      return;
    }

    if (cleanMobile.length < 10) {
      setErrorMsg('Mobile number must be at least 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      await LeadService.create({
        name: name.trim(),
        mobile: cleanMobile,
      });

      // Session success
      loginUser(name.trim(), cleanMobile);
      setShowLoginPopup(false);
      toast.success(`Welcome back, ${name.trim()}!`);
      setIsOpen(false);
      document.body.style.overflow = 'unset';
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isClosable = user !== null || (typeof window !== 'undefined' && localStorage.getItem('b2b_lead_captured') === 'true');

  // Dynamic CMS Settings fallbacks
  const titleText = popupSettings?.title || "Welcome to India's Trusted Wholesale Marketplace";
  const subtitleText = popupSettings?.subtitle || "Connect with verified suppliers and buyers instantly.";
  const descText = popupSettings?.description || "Please enter your credentials to explore the premium wholesale catalog, download bulk catalogs, and request direct factory pricing.";
  const buttonLabel = popupSettings?.buttonText || "Explore Wholesale Deals";
  const termsLabelText = popupSettings?.termsText || "Verified B2B Business Verification";
  const logoSrc = popupSettings?.logo || settings?.logo;
  const bgImg = popupSettings?.backgroundImage || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      
      {/* Dynamic Popup Split Card */}
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 flex overflow-hidden relative max-h-[90vh] md:h-[600px]">
        
        {/* Close Button */}
        {isClosable && (
          <button
            type="button"
            onClick={() => {
              setShowLoginPopup(false);
              setIsOpen(false);
              document.body.style.overflow = 'unset';
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer z-50 bg-white/80 backdrop-blur-xs border border-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* LEFT SIDE (Branding Illustration & Background Image - Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 relative bg-slate-955 overflow-hidden select-none">
          {/* Background Image */}
          <Image
            src={bgImg}
            alt="B2B Wholesale Marketplace"
            fill
            unoptimized={true}
            className="object-cover opacity-50"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-955/30 to-slate-955/10"></div>

          {/* Branding Copy with Glassmorphism */}
          <div className="absolute inset-0 p-10 flex flex-col justify-end text-white space-y-4">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                {titleText}
              </h3>
              <p className="text-sm text-slate-200 mt-2 font-medium">
                {subtitleText}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Form Content) */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center overflow-y-auto relative bg-white">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-6">
            {logoSrc ? (
              <div className="mb-4 max-w-[180px] overflow-hidden flex items-center justify-center">
                <Image
                  src={logoSrc}
                  alt={settings?.websiteName || 'B2B Marketplace'}
                  width={180}
                  height={60}
                  unoptimized={true}
                  className="h-10 sm:h-12 w-auto object-contain bg-transparent"
                />
              </div>
            ) : (
              <span className="font-extrabold text-2xl text-[#cc3a07] tracking-tight mb-3">
                {settings?.websiteName || 'B2B Wholesale'}
              </span>
            )}
            
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
              {titleText}
            </h2>
            <p className="text-xs text-slate-500 font-medium px-2 leading-relaxed">
              {descText}
            </p>
          </div>

          {/* Lead Capture Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name</label>
              <div className="relative">
                <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#cc3a07]/20 focus:border-[#cc3a07] transition text-slate-800"
                  placeholder="e.g. Shyam Limbani"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number (Wholesale Inquiry)</label>
              <div className="relative">
                <Smartphone className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  pattern="[0-9]*"
                  min={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#cc3a07]/20 focus:border-[#cc3a07] transition text-slate-800 font-mono"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#cc3a07] hover:bg-[#a82f05] disabled:bg-[#e88a72] text-white font-bold py-3 px-6 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-[0_4px_16px_rgba(204,58,7,0.3)] mt-4 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{buttonLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure badge */}
          <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            <ShieldCheck className="w-4.5 h-4.5 text-green-500" />
            {termsLabelText}
          </div>

        </div>

      </div>
    </div>
  );
}
