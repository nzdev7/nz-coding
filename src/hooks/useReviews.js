// src/hooks/useReviews.js
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import defaultReviewsData from '@/data/reviews.json';

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [mongoLoaded, setMongoLoaded] = useState(false);
  const [showingDefaults, setShowingDefaults] = useState(false);

  useEffect(() => {
    // First, wait for styles to load
    const styleTimer = setTimeout(() => {
      setStylesLoaded(true);
      // Show default reviews immediately after styles load
      setReviews(defaultReviewsData.defaultReviews);
      setShowingDefaults(true);
      setLoading(false);

      // Start fetching MongoDB data
      fetchReviews();
    }, 150);

    return () => clearTimeout(styleTimer);
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // Replace with combined reviews (MongoDB + defaults)
        const combinedReviews = [...result.data, ...defaultReviewsData.defaultReviews];
        setReviews(combinedReviews);
        setMongoLoaded(true);
        setShowingDefaults(false);
      }
      // If MongoDB fails, keep showing default reviews
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load latest reviews, showing cached reviews');
      // Keep default reviews on error
    }
  };

  const getLatestReviews = (count = 9) => {
    return reviews.slice(0, count);
  };

  // Add function to add new review to state
  const addNewReview = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  // Add function to update existing review in state
  const updateReview = (updatedReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === updatedReview._id || review.userId === updatedReview.userId ? updatedReview : review
      )
    );
  };

  return {
    reviews,
    loading, // This will be false after 150ms when defaults are shown
    stylesLoaded,
    mongoLoaded,
    showingDefaults,
    getLatestReviews,
    refetch: fetchReviews,
    addNewReview,
    updateReview,
  };
}

// Keep the existing useReviewSubmission hook unchanged
export function useReviewSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (isSignedIn && userId) {
      checkUserReviewStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userId]);

  const checkUserReviewStatus = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/reviews/${userId}`);
      const result = await response.json();

      if (result.success) {
        setHasSubmitted(true);
        setUserReview(result.data);
      } else {
        setHasSubmitted(false);
        setUserReview(null);
      }
    } catch (error) {
      console.error('Error checking review status:', error);
    }
  };

  const submitReview = async (reviewData) => {
    if (!isSignedIn || !userId) {
      toast.error('Please sign in to submit a review');
      return { success: false, error: 'Authentication required' };
    }

    setIsSubmitting(true);

    try {
      const method = hasSubmitted ? 'PUT' : 'POST';
      const url = hasSubmitted ? `/api/reviews/${userId}` : '/api/reviews';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (result.success) {
        setUserReview(result.data);
        if (!hasSubmitted) {
          setHasSubmitted(true);
        }
        return { success: true, data: result.data, isNew: !hasSubmitted };
      } else {
        toast.error(result.error || 'Failed to submit review');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
      return { success: false, error: 'Failed to submit review' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserReview = async () => {
    if (!userId) return null;

    try {
      const response = await fetch(`/api/reviews/${userId}`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
    return null;
  };

  return {
    isSubmitting,
    hasSubmitted,
    userReview,
    submitReview,
    getUserReview,
    checkUserReviewStatus,
  };
}
