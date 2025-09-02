'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { X, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import defaultReviewsData from '@/data/reviews.json';
import { useReviewSubmission } from '@/hooks/useReviews';
import { StarRating, FeedbackSelect, ProfileImageInput } from './ReviewSmUI';
import { REVIEW_VALIDATION_RULES, validateReviewField, validateReviewData } from '@/lib/validations';

// ReviewForm Component
export default function ReviewForm({ isOpen, onClose, onSuccess }) {
  const { isSubmitting, hasSubmitted, submitReview, getUserReview } = useReviewSubmission();
  const { isSignedIn, user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    profession: '',
    feedback: '',
    rating: 0,
  });

  // Validation state
  const [errors, setErrors] = useState({
    name: '',
    feedback: '',
    rating: '',
  });

  // Character count state
  const [charCounts, setCharCounts] = useState({
    name: 0,
    profession: 0,
    feedback: 0,
  });

  // Field interaction tracking
  const [touched, setTouched] = useState({
    name: false,
    feedback: false,
    rating: false,
  });

  // Editing state
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Update character count
    setCharCounts((prev) => ({ ...prev, [name]: value.length }));
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Validate field and update error state
    const error = validateReviewField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
    // Mark rating as touched
    setTouched((prev) => ({ ...prev, rating: true }));
    // Validate rating
    const error = validateReviewField('rating', newRating);
    setErrors((prev) => ({ ...prev, rating: error }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      image: '',
      name: user?.fullName || user?.firstName || '',
      profession: '',
      feedback: '',
      rating: 0,
    });

    setErrors({
      name: '',
      feedback: '',
      rating: '',
    });

    setCharCounts({
      name: 0,
      profession: 0,
      feedback: 0,
    });

    setTouched({
      name: false,
      feedback: false,
      rating: false,
    });

    setIsEditing(false);
  };

  // Load existing review
  const loadExistingReview = async () => {
    try {
      const existingReview = await getUserReview();

      if (existingReview) {
        setFormData({
          image: existingReview.image || '',
          name: existingReview.name || '',
          profession: existingReview.profession || '',
          feedback: existingReview.feedback || '',
          rating: existingReview.rating || 5,
        });

        setCharCounts({
          name: existingReview.name?.length || 0,
          profession: existingReview.profession?.length || 0,
          feedback: existingReview.feedback?.length || 0,
        });

        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading existing review:', error);
    }
  };

  // Effect for modal open/close
  useEffect(() => {
    if (!isOpen) return;

    if (!isSignedIn) {
      onClose();
      return;
    }

    if (user && !hasSubmitted) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || user.firstName || prev.name,
      }));
      setCharCounts((prev) => ({
        ...prev,
        name: (user.fullName || user.firstName || prev.name).length,
      }));
    }

    if (hasSubmitted) {
      loadExistingReview();
    } else {
      resetForm();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasSubmitted, isSignedIn, user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      feedback: true,
      rating: true,
    });

    // Validate all fields
    const validationErrors = validateReviewData(formData);

    // Update all error states
    setErrors(validationErrors);

    // If there are any errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Prepare submission data
    const submissionData = { ...formData };
    if (submissionData.image === '') {
      delete submissionData.image;
    }

    // Send review to server
    const result = await submitReview(formData);
    if (result.success) {
      onSuccess(result.data, result.isNew);
      onClose();
      resetForm();
    }
  };

  // Update feedback field
  const handleFeedbackSelect = (feedback) => {
    setFormData((prev) => ({ ...prev, feedback }));
    setCharCounts((prev) => ({ ...prev, feedback: feedback.length }));
    setTouched((prev) => ({ ...prev, feedback: true }));
    // Validate feedback
    const error = validateReviewField('feedback', feedback);
    setErrors((prev) => ({ ...prev, feedback: error }));
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Animation settings
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  return (
    <div className="fixed inset-0 bg-primary flex-center z-50 p-4">
      <motion.div
        className="bg-secondary rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-primary"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-7 flex items-start justify-between">
          <h2 className="text-xl text-gradient-1">{isEditing ? 'Update Your Experience' : 'Share Your Experience'}</h2>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="border border-red-800 rounded-md transition-colors p-1 mt-0.5 bg-secondary-card hover:scale-105 hover:rounded-full"
          >
            <X strokeWidth={3} size={18} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Profile Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <ProfileImageInput
                value={formData.image}
                onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
                name={formData.name}
              />
            </motion.div>

            {/* Name Field */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Your Name (Required)"
                  onChange={handleInputChange}
                  className="review-modal-input pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {charCounts.name}/{REVIEW_VALIDATION_RULES.name.maxLength}
                </div>
              </div>
              {(touched.name || errors.name) && errors.name && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.name}</p>
              )}
            </motion.div>

            {/* Profession Field */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="relative">
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  placeholder="Your Profession (Optional)"
                  onChange={handleInputChange}
                  className="review-modal-input pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {charCounts.profession}/{REVIEW_VALIDATION_RULES.profession.maxLength}
                </div>
              </div>
            </motion.div>

            {/* Rating Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full p-3 rounded-md bg-primary shadow font-semibold flex flex-col gap-2"
            >
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6">
                <label className="flex gap-1">
                  {formData.rating > 0 ? (
                    <span className="text-base font-semibold flex gap-1">
                      Rating <em className="text-yellow-500">{formData.rating}</em> star{formData.rating > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-400 dark:text-gray-500">Rating (Required)</span>
                  )}
                </label>
                <StarRating rating={formData.rating} onRatingChange={handleRatingChange} readonly={false} />
              </div>
              {(touched.rating || errors.rating) && errors.rating && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.rating}</p>
              )}
            </motion.div>

            {/* Feedback Field */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="relative">
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  placeholder="Your Feedback (Required)"
                  onChange={handleInputChange}
                  className="min-h-32 review-modal-input pr-16"
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                  {charCounts.feedback}/{REVIEW_VALIDATION_RULES.feedback.maxLength}
                </div>
              </div>

              {/* Quick Feedback Options */}
              <div className="mt-3">
                <FeedbackSelect
                  value={formData.feedback}
                  onChange={handleFeedbackSelect}
                  placeholder="Select a feedback template"
                  options={defaultReviewsData.defaultFeedbacks}
                />
              </div>

              {/* Error Messages */}
              {(touched.feedback || errors.feedback) && errors.feedback && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.feedback}</p>
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </>
              ) : isEditing ? (
                'Update Review'
              ) : (
                'Submit Review'
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
