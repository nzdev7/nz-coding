// src/components/reviews/ReviewsSlider.js

'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CgArrowLongLeft, CgArrowLongRight } from 'react-icons/cg';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { ReviewCard, SkeletonReviewCard } from './ReviewsCard';
import { useReviews } from '@/hooks/useReviews';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//
// ─── REVIEW SLIDER ───────────────────────────────────────────────
//
const NavButton = ({ type }) => (
  <button className={`${type}-r-btn text-primary hover:scale-105`}>
    {type === 'prev' ? <CgArrowLongLeft className="size-9" /> : <CgArrowLongRight className="size-9" />}
  </button>
);

export const ReviewSlider = ({ reviews }) => {
  const paginationRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No reviews to display</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        className="max-w-[350px] md:max-w-3xl xl:max-w-full review-slider"
        loop={true}
        grabCursor={true}
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{ prevEl: '.prev-r-btn', nextEl: '.next-r-btn' }}
        pagination={{
          type: 'fraction',
          el: paginationRef.current,
          formatFractionCurrent: (number) => `${number}`,
          formatFractionTotal: (number) => `${number}`,
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          if (paginationRef.current) {
            swiper.pagination.el = paginationRef.current;
            swiper.pagination.init();
            swiper.pagination.update();
          }
        }}
        onTouchStart={(swiper) => swiper.autoplay.stop()}
        onTouchEnd={(swiper) => swiper.autoplay.start()}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {reviews.slice(0, 9).map((review) => (
          <SwiperSlide key={review.id || review._id} className="p-2">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center justify-between max-w-[350px] md:max-w-3xl xl:max-w-full mx-auto mt-2 px-5">
        <div className="flex items-center gap-5">
          <NavButton type="prev" />
          <NavButton type="next" />
        </div>
        <div ref={paginationRef} className="swiper-pagination-fraction text-primary font-medium !w-auto"></div>
      </div>
    </div>
  );
};

//
// ─── SKELETON UI ──────────────────────────────────────────────────
//
export const ReviewCardSkeleton = () => {
  const [skeletonCount, setSkeletonCount] = useState(1);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setSkeletonCount(3);
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
        <SkeletonReviewCard key={i} />
      ))}
    </div>
  );
};

//
// ─── DESKTOP UI COMPONENT ─────────────────────────────────────────
//
export const FeaturedReviewsUI = ({ reviews }) => {
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

  if (isDesktop) {
    return (
      <div className="grid grid-cols-3 gap-5 2xl:gap-10 3xl:gap-13">
        {reviews.slice(0, 6).map((review) => (
          <ReviewCard key={review.id || review._id} review={review} />
        ))}
      </div>
    );
  }

  return <ReviewSlider reviews={reviews} />;
};

//
// ─── MAIN COMPONENT WITH IMPROVED LOADING ──────────────────────────
//
const FeaturedReviews = () => {
  const { reviews, loading } = useReviews();

  // Show skeleton while styles are loading (first 150ms)
  if (loading) {
    return <ReviewCardSkeleton />;
  }

  // After 150ms, show the reviews (defaults first, then real data)
  return (
    <div className="relative">
      <FeaturedReviewsUI reviews={reviews} />
    </div>
  );
};

export default FeaturedReviews;
