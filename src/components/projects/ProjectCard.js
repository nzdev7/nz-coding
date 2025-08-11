// src/components/projects/ProjectCard.js

import Link from 'next/link';
import Image from 'next/image';

//
// ─── SINGLE PROJECT CARD UI ───────────────────────────────────────
//
export const ProjectCard = ({ project }) => {
  return (
    <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300 hover:-translate-y-0.5 hover:scale-[1.015]">
      <div
        className="content bg-primary-card border-primary flex-col-center transition-300
        overflow-hidden rounded-xl hover:border-transparent w-full h-full p-2 z-10"
      >
        <div>
          <div className="aspect-video relative">
            <Image src={project.image} alt={project.title} fill className="object-cover rounded-t-lg" />
            {/* <Image src={`/projects/${project.image}`} alt={project.title} fill className="object-cover rounded-t-lg" /> */}
          </div>
          <div className="p-5">
            <h3 className="text-gradient font-bold text-xl line-clamp-1">{project.title}</h3>
            <div className="flex items-center justify-start gap-2 mt-1">
              <span className="text-sm font-medium">Category</span> :
              <span className="text-primary font-semibold text-base line-clamp-1">{project.subcategory}</span>
            </div>
            <p className="line-clamp-2 mt-1.5">{project.shortDescription}</p>
            <div className="flex flex-wrap items-center gap-2 mt-4 mb-5">
              {project.technologies?.slice(0, 3).map((tech, index) => (
                <span key={index} className="border-secondary text-primary text-xs px-2 py-1 rounded-full font-medium">
                  {tech}
                </span>
              ))}
              {project.technologies?.length > 3 && (
                <span className="text-xs">+{project.technologies.length - 3} more</span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-300 dark:border-slate-600">
              <Link href={`/projects/${project._id}`} className="btn-primary py-2 text-xs">
                View Details
              </Link>
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-2 text-xs"
                >
                  Live Preview
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//
// ─── PROJECT SKELETON CARD UI ──────────────────────────────────────
//
export const SkeletonProjectCard = () => (
  <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300 animate-pulse hover:-translate-y-0.5 hover:scale-[1.015]">
    <div
      className="content bg-primary-card border-primary flex-col-center transition-300
        overflow-hidden rounded-xl w-full h-full p-2 z-10 min-h-[380px]"
    >
      <div className="w-full">
        {/* Image skeleton with shimmer */}
        <div className="aspect-video rounded-t-lg mb-1 skeleton-fields" />
        <div className="p-5">
          {/* Title with shimmer */}
          <div className="h-6 w-2/3 rounded mb-2 skeleton-fields" />

          {/* Category section with shimmer */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-16 rounded skeleton-fields" />
            <div className="mb-[6px] opacity-40">:</div>
            <div className="h-5 w-28 rounded skeleton-fields" />
          </div>

          {/* Description lines with shimmer */}
          <div className="h-4 w-full rounded mb-1.5 skeleton-fields" />
          <div className="h-4 w-5/6 rounded mb-4 skeleton-fields" />

          {/* Technology tags with shimmer */}
          <div className="flex gap-2 mb-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-16 rounded-full skeleton-fields" />
            ))}
          </div>

          {/* Action buttons with shimmer */}
          <div className="flex items-center justify-between gap-3 pt-4 mt-5 border-t border-gray-300 dark:border-slate-600">
            <div className="h-8 w-24 rounded-lg skeleton-fields" />
            <div className="h-8 w-24 rounded-lg skeleton-fields" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
