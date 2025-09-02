'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth, SignUpButton } from '@clerk/nextjs';
import { FaChevronDown, FaStar } from 'react-icons/fa';
import { useReviewSubmission } from '@/hooks/useReviews';
import { validateReviewField, REVIEW_VALIDATION_RULES } from '@/lib/validations';

//
// ─── Share Experience Button ───────────────────────────────────────────────
//
export function ShareExperienceButton({ onReviewSubmitted }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { hasSubmitted } = useReviewSubmission();

  // If user is not signed in, show SignUpButton with default mode
  if (!isSignedIn) {
    return (
      <SignUpButton mode="modal" forceRedirectUrl="/client-review">
        <button className="btn-primary">Share Your Experience</button>
      </SignUpButton>
    );
  }

  // If user is signed in, handle navigation to client review
  const handleClick = () => {
    router.push('/client-review');
  };

  return (
    <button onClick={handleClick} className="btn-primary">
      {hasSubmitted ? 'Update Your Experience' : 'Share Your Experience'}
    </button>
  );
}

//
// ─── Star Rating Component ───────────────────────────────────────
//
export function StarRating({ rating, onRatingChange, readonly = false, size = 20 }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starRating) => {
    if (!readonly && onRatingChange) onRatingChange(starRating);
  };

  const handleStarHover = (starRating) => {
    if (!readonly) setHoveredRating(starRating);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoveredRating(0);
  };

  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <FaStar
            size={size}
            className={`${
              star <= (hoveredRating || rating) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

//
// ─── Feedback Select Component ───────────────────────────────────────
//
export function FeedbackSelect({ options, value, onChange, placeholder, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (feedback) => {
    onChange(feedback);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="review-modal-input transition-300 flex items-center text-left justify-between"
        >
          <span
            className={`w-[88%] sm:w-[93%] font-semibold line-clamp-1 ${
              value ? 'text-secondary' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {value || placeholder}
          </span>
          <FaChevronDown
            className={`transition-transform text-gray-400 dark:text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="w-full max-h-60 absolute bottom-full mb-2 space-y-1 p-1.5 z-10 shadow-xl overflow-y-auto bg-primary rounded-md ring-2 ring-cyan-600 dark:ring-cyan-400">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full p-3 text-left bg-primary-card rounded-md shadow-2xl"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//
// ─── Profile Image Input Component ───────────────────────────────────
//
// Update the ProfileImageInput component in ReviewSmUI.js
export function ProfileImageInput({ value = '', onChange, name }) {
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileKey, setFileKey] = useState(Date.now());
  const [inputMethod, setInputMethod] = useState('upload');
  const [validationError, setValidationError] = useState('');

  // Helper function to validate URLs
  const isValidUrl = (urlString) => {
    if (!urlString) return false;
    try {
      if (urlString.startsWith('data:')) return true;
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Generate default avatar URL using ui-avatars (matching your schema)
  const getDefaultAvatar = (name) => {
    if (!name) return 'https://ui-avatars.com/api/?name=User&background=random';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  // Initialize states when component mounts or props change
  useEffect(() => {
    setUrlInput(value || '');

    if (value && isValidUrl(value)) {
      setPreviewUrl(value);
      setValidationError('');
    } else {
      setPreviewUrl(getDefaultAvatar(name));
      if (value && !isValidUrl(value)) {
        setValidationError('Invalid image URL');
      }
    }
  }, [value, name]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > REVIEW_VALIDATION_RULES.image.maxSize) {
        setValidationError(REVIEW_VALIDATION_RULES.image.message.maxSize);
        return;
      }

      // Validate file type
      if (!REVIEW_VALIDATION_RULES.image.allowedFormats.includes(file.type)) {
        setValidationError(REVIEW_VALIDATION_RULES.image.message.invalidFormat);
        return;
      }

      setValidationError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setPreviewUrl(result);
        setUrlInput('');
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    const url = e.target.value || '';
    setUrlInput(url);
    onChange(url);

    // Validate image URL
    const error = validateReviewField('image', url);
    setValidationError(error);

    // Only update preview if URL is valid or empty
    if (url === '') {
      setPreviewUrl(getDefaultAvatar(name));
    } else if (isValidUrl(url)) {
      setPreviewUrl(url);
    }
  };

  // Handle clear image
  const handleClearImage = () => {
    const defaultAvatar = getDefaultAvatar(name);
    setUrlInput('');
    setPreviewUrl(defaultAvatar);
    onChange('');
    setFileKey(Date.now());
    setValidationError('');
  };

  // Handle input method change
  const handleMethodChange = (method) => {
    setInputMethod(method);
    setValidationError('');
    if (method === 'upload') {
      setFileKey(Date.now());
    }
  };

  // Handle image load error
  const handleImageError = () => {
    const defaultAvatar = getDefaultAvatar(name);
    setPreviewUrl(defaultAvatar);

    // Save default avatar URL instead of broken image URL
    onChange(defaultAvatar);

    if (urlInput && !urlInput.includes('ui-avatars.com')) {
      setValidationError('Failed to load image. Using default avatar.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end space-x-5">
        {/* Image Preview */}
        <div className="flex-shrink-0">
          {previewUrl && isValidUrl(previewUrl) ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-4 border-primary">
              <Image
                fill
                src={previewUrl}
                alt="Profile preview"
                className="object-cover"
                unoptimized={previewUrl.startsWith('data:') || previewUrl.includes('ui-avatars.com')}
                onError={handleImageError}
              />
            </div>
          ) : (
            <div className="w-20 h-18 rounded-xl flex-center border-4 border-primary">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Input Method Toggle */}
        <div className="flex space-x-5 mb-1">
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded-md ${
              inputMethod === 'upload' ? 'btn-primary translate-y-0 scale-100 cursor-not-allowed' : 'btn-secondary'
            }`}
            onClick={() => handleMethodChange('upload')}
          >
            Upload
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded-md ${
              inputMethod === 'url' ? 'btn-primary translate-y-0 scale-100 cursor-not-allowed' : 'btn-secondary'
            }`}
            onClick={() => handleMethodChange('url')}
          >
            URL
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div>
        {inputMethod === 'upload' ? (
          <div>
            <input
              key={fileKey}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="review-modal-input cursor-pointer"
            />
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              placeholder="Profile Image URL"
              onChange={handleUrlChange}
              className="flex-1 review-modal-input"
            />
            {urlInput && (
              <button
                type="button"
                onClick={handleClearImage}
                className="px-3 py-1 font-semibold btn-primary translate-y-0 rounded-md text-sm"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Validation Error Display */}
        {validationError && <p className="text-red-500 text-sm mt-2 ml-1">{validationError}</p>}
      </div>
    </div>
  );
}
