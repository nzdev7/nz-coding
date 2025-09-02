'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { Navigation, Scrollbar, Autoplay } from 'swiper/modules';
import { ServiceCard, SkeletonServiceCard } from './ServiceCard';
import serviceData from '@/data/services.json';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

//
// ─── SERVICE SLIDER ───────────────────────────────────────────────
//
const NavButton = ({ type }) => (
  <button className={`${type}-s-btn btn-secondary rounded-lg translate-y-0 py-3 px-3.5`}>
    {type === 'prev' ? <FaAnglesLeft className="size-4.5" /> : <FaAnglesRight className="size-4.5" />}
  </button>
);

export const ServiceSlider = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No services to display</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        className="max-w-[350px] md:max-w-3xl xl:max-w-full service-slider"
        loop={true}
        grabCursor={true}
        modules={[Navigation, Scrollbar, Autoplay]}
        navigation={{ prevEl: '.prev-s-btn', nextEl: '.next-s-btn' }}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        scrollbar={{ draggable: true }}
        onTouchStart={(swiper) => swiper.autoplay.stop()}
        onTouchEnd={(swiper) => swiper.autoplay.start()}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
        }}
      >
        {services.map((service) => (
          <SwiperSlide key={service.id} className="p-2 pb-8">
            <ServiceCard service={service} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-between mt-6 max-w-[350px] md:max-w-3xl xl:max-w-full mx-auto">
        <Link href="/services" className="btn-primary rounded-xl text-center">
          View All Services
        </Link>
        <div className="flex items-center gap-5">
          <NavButton type="prev" />
          <NavButton type="next" />
        </div>
      </div>
    </div>
  );
};

//
// ─── SKELETON UI ──────────────────────────────────────────────────
//
export const ServiceCardSkeleton = () => {
  const [skeletonCount, setSkeletonCount] = useState(1);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setSkeletonCount(6);
      } else if (width >= 768) {
        setSkeletonCount(2);
      } else {
        setSkeletonCount(1);
      }
    };

    updateCount();
    window.addEventListener('resize', updateCount);

    return () => window.removeEventListener('resize', updateCount);
  }, []);

  return (
    <div className="max-w-sm md:max-w-3xl xl:max-w-full mx-auto grid gap-6 md:gap-10 3xl:gap-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <SkeletonServiceCard key={i} />
      ))}
    </div>
  );
};

//
// ─── MAIN UI COMPONENT WITH STYLE LOADING ─────────────────────────
//
export const FeaturedServicesUI = ({ services, isLoading = false }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Show skeleton while styles are loading
  if (isLoading) {
    return <ServiceCardSkeleton />;
  }

  if (isDesktop) {
    return (
      <div className="grid grid-cols-3 gap-5 2xl:gap-10 3xl:gap-13">
        {services.slice(0, 6).map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    );
  }

  return <ServiceSlider services={services} />;
};

//
// ─── MAIN COMPONENT WITH LOADING EFFECT ──────────────────────────
//
const FeaturedServices = () => {
  const [isStylesLoading, setIsStylesLoading] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Get services data from imported JSON
    const servicesData = serviceData.services || []; // Fixed this line
    setServices(servicesData);

    // Add a brief delay to ensure CSS styles are fully loaded
    const styleLoadingTimer = setTimeout(() => {
      setIsStylesLoading(false);
    }, 150);

    return () => {
      clearTimeout(styleLoadingTimer);
    };
  }, []);

  return <FeaturedServicesUI services={services} isLoading={isStylesLoading} />;
};

export default FeaturedServices;
