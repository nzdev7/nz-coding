// src/lib/ratelimit.js
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Rate limiter for review submissions.
// Allows each user to create only 1 review within 32 years.
export const reviewRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(1, '999999999s'),
  analytics: true,
});

// Helper function to check if user has already submitted a review
export async function hasUserSubmittedReview(userId) {
  try {
    const key = `review_submitted:${userId}`;
    const hasSubmitted = await redis.get(key);
    return hasSubmitted === 'true';
  } catch (error) {
    console.error('Error checking review submission status:', error);
    return false;
  }
}

// Helper function to mark user as having submitted a review
export async function markUserAsSubmitted(userId) {
  try {
    const key = `review_submitted:${userId}`;
    await redis.set(key, 'true');
    return true;
  } catch (error) {
    console.error('Error marking user as submitted:', error);
    return false;
  }
}
