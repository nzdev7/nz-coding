'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { ProjectCard, SkeletonProjectCard } from './ProjectCard.js';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//
// ─── PROJECT SLIDER ───────────────────────────────────────────────
//
const NavButton = ({ type, mobile }) => (
  <button
    className={`${type}-btn btn-secondary rounded-lg translate-y-0 ${
      mobile ? 'py-1.5 px-3.5 md:hidden' : 'py-3 px-3.5'
    }`}
  >
    {type === 'prev' ? <FaArrowLeftLong className="size-4.5" /> : <FaArrowRightLong className="size-4.5" />}
  </button>
);

const ProjectLink = ({ className }) => (
  <Link href="/projects" className={`btn-primary rounded-xl text-center ${className}`}>
    View All Projects
  </Link>
);

export const ProjectSlider = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No projects to display</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        className="max-w-sm md:max-w-3xl xl:max-w-full"
        loop={true}
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{ prevEl: '.prev-btn', nextEl: '.next-btn' }}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ el: '.custom-pagination', clickable: true, dynamicBullets: true }}
        onTouchStart={(swiper) => swiper.autoplay.stop()}
        onTouchEnd={(swiper) => swiper.autoplay.start()}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
        }}
      >
        {projects.map((project) => (
          <SwiperSlide key={project._id} className="p-2">
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="max-w-sm md:max-w-3xl xl:max-w-full mx-auto md:mt-6 md:grid md:grid-cols-3 md:items-center">
        <ProjectLink className="mx-3 hidden md:block" />

        <div className="flex justify-between mx-auto md:mx-0 p-3 md:col-span-2">
          <NavButton type="prev" mobile />
          <div className="custom-pagination ml-[25%] mt-3 md:mt-3.5" />
          <NavButton type="next" mobile />

          <div className="hidden md:flex gap-6">
            <NavButton type="prev" />
            <NavButton type="next" />
          </div>
        </div>
        <ProjectLink className="mx-3 mt-6 md:hidden" />
      </div>
    </div>
  );
};

//
// ─── SKELETON UI ──────────────────────────────────────────────────
//
export const ProjectCardSkeleton = ({ limit = 9 }) => {
  const [skeletonCount, setSkeletonCount] = useState(1);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        // For desktop, use the limit but cap at what makes sense for grid
        setSkeletonCount(Math.min(limit, limit === 4 ? 4 : 9));
      } else if (width >= 768) {
        setSkeletonCount(2);
      } else {
        setSkeletonCount(1);
      }
    };

    updateCount();
    window.addEventListener('resize', updateCount);

    return () => window.removeEventListener('resize', updateCount);
  }, [limit]);

  // Determine grid columns based on limit
  const getGridCols = () => {
    if (limit === 4) return 'xl:grid-cols-2'; // 2x2 grid for 4 items
    return 'xl:grid-cols-3'; // 3x3 grid for 9 items
  };

  return (
    <div
      className={`max-w-sm md:max-w-3xl xl:max-w-full mx-auto grid gap-6 md:gap-10 3xl:gap-12 grid-cols-1 md:grid-cols-2 ${getGridCols()}`}
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <SkeletonProjectCard key={i} />
      ))}
    </div>
  );
};

//
// ─── MAIN UI AFTER DATA LOAD ─────────────────────────────────────
//
export const FeaturedProjectsUI = ({ projects, limit = 9 }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [delayedRender, setDelayedRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedRender(true);
    }, 0);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!delayedRender) return null;

  // Determine grid layout based on limit
  const getGridLayout = () => {
    if (limit === 4) return 'grid-cols-2 gap-8 3xl:gap-10'; // 2x2 for 4 items
    return 'grid-cols-3 gap-10 3xl:gap-12'; // 3x3 for 9 items
  };

  if (isDesktop) {
    return (
      <div className={`grid ${getGridLayout()}`}>
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    );
  }

  return <ProjectSlider projects={projects} />;
};

//
// ─── MAIN COMPONENT (FETCH + DISPLAY) ─────────────────────────────
//
const FeaturedProjects = ({ limit = 9, endpoint = '/api/projects?isFeatured=true' }) => {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());

        // Construct full URL
        const url = `${endpoint}&${params.toString()}`;

        const res = await fetch(url);
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error('Failed to fetch featured projects:', err);
        setProjects([]); // Optional: display error UI
      }
    };

    fetchProjects();
  }, [limit, endpoint]);

  if (!projects) return <ProjectCardSkeleton limit={limit} />;

  return <FeaturedProjectsUI projects={projects} limit={limit} />;
};

export default FeaturedProjects;
