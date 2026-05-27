'use client';

import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({
  phoneNumber,
  message = 'Hello, I am interested in your products.',
  className = '',
  children,
}: WhatsAppButtonProps) {
  const { settings } = useSettings();

  // Clean and format the phone number
  const finalPhone = (phoneNumber || settings?.whatsappNumber || '919876543210')
    .replace(/\+/g, '')
    .replace(/\s+/g, '')
    .trim();

  const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;

  if (children) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25d366] text-white hover:bg-[#20ba5a] px-4 py-2.5 rounded-lg font-semibold shadow-md transition-colors ${className}`}
    >
      <FaWhatsapp className="w-5 h-5 fill-current" />
      <span>Send WhatsApp Inquiry</span>
    </a>
  );
}
