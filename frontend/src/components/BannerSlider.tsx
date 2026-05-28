'use client';

import React from 'react';
import { Banner } from '../types';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imageHelper';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface BannerSliderProps {
  banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[220px] sm:h-[350px] md:h-[500px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={banners.length > 1}
        autoplay={banners.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
        pagination={{ clickable: true }}
        navigation={banners.length > 1}
        className="w-full h-full"
      >
        {banners.map((banner, index) => {
          const imageUrl = getImageUrl(banner.image);
          const cacheBuster = banner.updatedAt ? banner.updatedAt : Date.now();
          const versionedSrc = imageUrl.includes('?')
            ? `${imageUrl}&v=${encodeURIComponent(cacheBuster)}`
            : `${imageUrl}?v=${encodeURIComponent(cacheBuster)}`;

          return (
            <SwiperSlide key={banner._id || index} className="w-full h-full relative cursor-pointer flex items-center justify-center bg-slate-50/50">
              {banner.link ? (
                <Link href={banner.link} className="block w-full h-full relative">
                  <img
                    src={versionedSrc}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-contain transition-opacity duration-500"
                  />
                </Link>
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={versionedSrc}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-contain transition-opacity duration-500"
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
      
      {/* Custom Styles for Swiper Pagination & Navigation to make it look premium */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet-active {
          background-color: #ffffff !important;
          width: 24px !important;
          border-radius: 5px !important;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.2);
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease !important;
          opacity: 0;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.1);
        }
        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
