import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { reviewRateLimit, hasUserSubmittedReview, markUserAsSubmitted } from '@/lib/ratelimit';
import { validateReviewData } from '@/lib/validations';

// Helper function to validate image URLs
async function validateImageUrl(imageUrl) {
  if (!imageUrl || imageUrl.includes('ui-avatars.com')) {
    return { isValid: true, url: imageUrl };
  }

  try {
    // Simple URL validation
    new URL(imageUrl);
    return { isValid: true, url: imageUrl };
  } catch (error) {
    return { isValid: false, url: null };
  }
}

// GET - Fetch all reviews (public)
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST - Create new review (authenticated)
export async function POST(request) {
  try {
    // Await the auth function call
    const { userId } = await auth();
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { image, name, profession, feedback, rating } = await request.json();

    // Validate input data
    const reviewData = { image, name, profession, feedback, rating };
    const validationErrors = validateReviewData(reviewData);

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          validationErrors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user has already submitted a review
    const hasSubmitted = await hasUserSubmittedReview(userId);
    if (hasSubmitted) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already submitted a review. You can update your existing review instead.',
        },
        { status: 400 }
      );
    }

    // Apply rate limiting
    const { success: rateLimitSuccess } = await reviewRateLimit.limit(userId);
    if (!rateLimitSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Handle image URL validation
    const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&format=png&size=200`;
    let finalImageUrl = defaultAvatarUrl;

    if (image) {
      const { isValid } = await validateImageUrl(image);
      if (isValid) {
        finalImageUrl = image;
      }
      // If image is invalid, we'll use the default avatar (already set above)
    }

    // Create new review with validated image URL
    const newReview = new Review({
      userId,
      image: finalImageUrl,
      name,
      profession: profession || 'Professional User',
      feedback,
      rating,
    });

    await newReview.save();

    // Mark user as having submitted a review
    await markUserAsSubmitted(userId);

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}
