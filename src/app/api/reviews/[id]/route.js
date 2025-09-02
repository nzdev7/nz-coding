import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
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

// GET - Fetch user's own review
export async function GET(request, { params }) {
  try {
    // Await the auth function call
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    // For authenticated requests, return the user's own review
    const review = await Review.findOne({ userId });
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch review' }, { status: 500 });
  }
}

// PUT - Update existing review
export async function PUT(request, { params }) {
  try {
    // Await the auth function call
    const { userId } = await auth();
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

    const updatedReview = await Review.findOneAndUpdate(
      { userId },
      {
        name,
        profession: profession || 'Professional User',
        image: finalImageUrl,
        feedback,
        rating,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);

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

    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}
