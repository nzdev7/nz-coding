// src/app/reviews/page.js

import { ChevronsRight } from 'lucide-react';
import ReviewsGrid from '@/components/reviews/ReviewsGrid';
import { ShareExperienceButton } from '@/components/reviews/ReviewSmUI';

export const metadata = {
  title: 'Professional Reviews - Client Testimonials & Feedback',
  description:
    'Explore our comprehensive collection of client reviews including testimonials, project feedback, and client experiences. See what our satisfied clients say about our work.',
};

const ReviewsPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="bg-secondary flex-col-center text-center h-[450px] xl:h-[500px] 3xl:h-[550px] pt-10 xl:pt-12 3xl:pt-14 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-9 2xl:px-12 3xl:px-16">
        <div className="flex-center font-semibold lg-subtitle relative max-w-max mx-auto px-0.5 space-x-2 xl:text-lg 3xl:text-xl">
          <span className="text-gradient">Home</span>
          <ChevronsRight className="text-tertiary mt-1 pointer-events-none size-5 xl:size-6 3xl:size-6.5" />
          <span className="text-gradient-1">Reviews List</span>
        </div>

        <h1 className="text-gradient-1 text-5xl xl:text-6xl 3xl:text-7xl my-6">Reviews</h1>

        <p className="max-w-2xl mx-auto text-center xl:text-[17px]">
          Discover what our clients have to say about their experience working with us. From project testimonials to
          feedback on our collaboration process, see why clients choose us for their web development needs.
        </p>

        <div className="w-full flex-center mt-6">
          <ShareExperienceButton />
        </div>
      </div>

      <ReviewsGrid />
    </div>
  );
};

export default ReviewsPage;
