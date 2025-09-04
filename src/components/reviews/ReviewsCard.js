'use client';

import Image from 'next/image';
import { StarRating } from './ReviewSmUI';
import { FaQuoteRight } from 'react-icons/fa';
import { useState } from 'react';

//
// ─── SINGLE REVIEW CARD UI ───────────────────────────────────────
//
export function ReviewCard({ review }) {
  const { image, name, profession, feedback, rating } = review;
  const [imgSrc, setImgSrc] = useState(image);
  const [hasError, setHasError] = useState(false);

  // Generate default avatar URL
  const getDefaultAvatar = (name) => {
    if (!name) return 'https://ui-avatars.com/api/?name=User&background=random';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  // Handle image error
  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getDefaultAvatar(name));
    }
  };

  // Check if URL is valid
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      if (url.startsWith('data:')) return true;
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Use default avatar if image is invalid
  const finalImageSrc = isValidUrl(imgSrc) && !hasError ? imgSrc : getDefaultAvatar(name);

  return (
    <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300 hover:-translate-y-0.5 hover:scale-[1.015]">
      <div className="onMobile review-card content bg-primary-card border-primary transition-500 p-6 overflow-hidden rounded-xl hover:border-transparent w-full h-full z-10 group min-h-[310px] flex flex-col justify-between">
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-20 min-w-20 h-20 rounded-xl overflow-hidden border-4 border-primary">
            <Image
              src={finalImageSrc}
              alt={name}
              fill
              className="object-cover"
              unoptimized={finalImageSrc.includes('ui-avatars.com') || finalImageSrc.startsWith('data:')}
              onError={handleImageError}
            />
          </div>
          <div>
            <div className="review-title-div text-primary text-xl max-h-[1.5em] group-hover:max-h-[500px] transition-all duration-700 ease-in-out overflow-hidden">
              <h4 className="review-title line-clamp-1 group-hover:line-clamp-none">{name}</h4>
            </div>

            <div className="review-title-div font-medium text-[15px] max-h-[1.5em] group-hover:max-h-[500px] transition-all duration-700 ease-in-out overflow-hidden">
              <p className="review-title line-clamp-1 group-hover:line-clamp-none">{profession}</p>
            </div>
          </div>
        </div>

        <div className="review-text-div leading-relaxed mb-5 max-h-[6.5em] group-hover:max-h-[1500px] transition-all duration-1500 ease-in-out overflow-hidden">
          <p className="review-text line-clamp-4 group-hover:line-clamp-none">{feedback}</p>
        </div>

        <div className="flex items-center justify-between">
          <StarRating rating={rating} readonly={true} />
          <FaQuoteRight className="size-10 text-tertiary" />
        </div>
      </div>
    </div>
  );
}

//
// ─── REVIEW SKELETON CARD UI ──────────────────────────────────────
//
export const SkeletonReviewCard = () => {
  return (
    <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300 animate-pulse hover:-translate-y-0.5 hover:scale-[1.015]">
      <div className="content bg-secondary-card border-primary flex-col-center transition-300 overflow-hidden rounded-xl w-full h-full p-8 z-10 min-h-[280px]">
        <div className="flex items-center w-full mb-4">
          {/* Avatar */}
          <div className="relative size-18 rounded-xl overflow-hidden border-4 border-gray-200 dark:border-slate-700 skeleton-fields" />

          {/* Name and profession */}
          <div className="ml-4 flex flex-col justify-center flex-grow">
            <div className="h-5 w-2/3 mb-2 rounded skeleton-fields" />
            <div className="h-4 w-1/2 rounded skeleton-fields" />
          </div>
        </div>

        {/* Feedback text skeleton */}
        <div className="space-y-2 mb-4 w-full">
          <div className="h-4 w-full rounded skeleton-fields" />
          <div className="h-4 w-full rounded skeleton-fields" />
          <div className="h-4 w-full rounded skeleton-fields" />
          <div className="h-4 w-5/6 rounded skeleton-fields" />
        </div>

        {/* Star rating and quote icon */}
        <div className="flex items-center justify-between w-full mt-auto">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 mr-1.5 rounded skeleton-fields" />
            ))}
          </div>
          <div className="w-10 h-10 rounded skeleton-fields" />
        </div>
      </div>
    </div>
  );
};
