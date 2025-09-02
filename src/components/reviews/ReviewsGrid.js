// src/components/reviews/ReviewsGrid.js

'use client';

import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { NotebookPen } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewCard, SkeletonReviewCard } from './ReviewsCard';
import { useReviews } from '@/hooks/useReviews';
import { ShareExperienceButton } from './ReviewSmUI';

//
// ─── PAGINATION COMPONENT ────────────────────────────────────────
//
const PaginationComponent = ({ pageCount, currentPage, onPageChange }) => {
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={onPageChange}
        forcePage={currentPage}
        containerClassName="flex items-center gap-x-2 p-1 bg-primary rounded-md shadow-secondary overflow-hidden cursor-pointer"
        pageClassName="bg-primary-card rounded-md"
        pageLinkClassName="px-3 py-1.5 rounded-md text-sm"
        activeClassName="bg-tertiary text-white"
        activeLinkClassName="bg-tertiary text-white"
        previousLabel={<ChevronLeft size={20} className="pointer-events-none" />}
        nextLabel={<ChevronRight size={20} className="pointer-events-none" />}
        previousLinkClassName="btn-primary px-3 py-1.5 rounded-md hover:-translate-y-0"
        nextLinkClassName="btn-primary px-3 py-1.5 rounded-md hover:-translate-y-0"
        disabledClassName="opacity-50 cursor-not-allowed hover:translate-0"
        disabledLinkClassName="cursor-not-allowed hover:translate-0"
        breakLabel="..."
        breakClassName="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400"
      />
    </div>
  );
};

//
// ─── MAIN REVIEWS GRID COMPONENT ─────────────────────────────────
//
const ReviewsGrid = () => {
  const { reviews, loading, mongoLoaded } = useReviews();
  const [currentPage, setCurrentPage] = useState(0);
  const [processedReviews, setProcessedReviews] = useState([]);

  const itemsPerPage = 12;

  // Process reviews: MongoDB reviews first (sorted by newest), then defaults
  useEffect(() => {
    if (reviews.length > 0) {
      const mongoReviews = [];
      const defaultReviews = [];

      reviews.forEach((review) => {
        // Check if it's a MongoDB review (has _id) or default review (has numeric id)
        if (review._id) {
          mongoReviews.push(review);
        } else {
          defaultReviews.push(review);
        }
      });

      // Sort MongoDB reviews by creation date (newest first)
      mongoReviews.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB - dateA;
      });

      // Combine: MongoDB reviews first, then default reviews
      setProcessedReviews([...mongoReviews, ...defaultReviews]);
      setCurrentPage(0); // Reset to first page when reviews change
    }
  }, [reviews, mongoLoaded]);

  // Calculate current page reviews and pagination
  const totalPages = Math.ceil(processedReviews.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = processedReviews.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);

    // Scroll to top of reviews section
    const reviewsSection = document.getElementById('reviews-grid');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show skeleton during initial loading (150ms)
  if (loading) {
    return (
      <div id="reviews-grid" className="min-h-screen py-20">
        <div className="container">
          <div className="max-w-sm md:max-w-3xl xl:max-w-full mx-auto grid gap-6 md:gap-10 3xl:gap-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonReviewCard key={`skeleton-${index}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no reviews
  if (!processedReviews.length) {
    return (
      <div id="reviews-grid" className="min-h-screen py-20">
        <div className="container">
          <div className="text-center py-16">
            <div className="flex-center mb-4">
              <NotebookPen className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-2xl text-primary mb-2">No Reviews Yet</h3>
            <p className="max-w-md mx-auto">
              Be the first to share your experience and help others discover our services.
            </p>
            <div className="w-full flex-center mt-6">
              <ShareExperienceButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="reviews-grid" className="min-h-screen py-20">
      <div className="container">
        {/* Reviews Grid */}
        <div className="max-w-sm md:max-w-3xl xl:max-w-full mx-auto grid gap-6 md:gap-10 3xl:gap-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {currentReviews.map((review, index) => (
            <ReviewCard key={review._id || review.id || `review-${startIndex + index}`} review={review} />
          ))}
        </div>

        {/* Pagination */}
        <PaginationComponent pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default ReviewsGrid;
