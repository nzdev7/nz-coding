'use client';

import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import ReviewForm from '@/components/reviews/ReviewForm';

export default function ClientReviewPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { addNewReview, updateReview } = useReviews();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (!isLoaded) return;

    // If not signed in, redirect back
    if (!isSignedIn) {
      toast.error('Please sign in to submit a review');
      router.back();
      return;
    }

    // If signed in, automatically open the review form
    setIsFormOpen(true);
  }, [isSignedIn, isLoaded, router, userId]);

  const handleSuccess = (reviewData, isNew) => {
    // Update the reviews list immediately
    if (isNew) {
      addNewReview(reviewData);
      toast.success('Thank you for sharing your experience!');
    } else {
      updateReview(reviewData);
      toast.success('Your review has been updated successfully!');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    router.back();
  };

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not signed in (will redirect home)
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex-center">
        <div className="text-center">
          <p>Redirecting to back...</p>
        </div>
      </div>
    );
  }

  return <ReviewForm isOpen={isFormOpen} onClose={handleClose} onSuccess={handleSuccess} />;
}
