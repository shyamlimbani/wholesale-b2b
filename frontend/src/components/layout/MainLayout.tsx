'use client';

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string, category: string) => void;
  initialSearch?: string;
  initialCategory?: string;
}

export default function MainLayout({
  children,
  onSearch,
  initialSearch,
  initialCategory,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc]">
      <Header
        onSearch={onSearch}
        initialSearch={initialSearch}
        initialCategory={initialCategory}
      />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
