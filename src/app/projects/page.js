import { ChevronsRight } from 'lucide-react';
import ProjectsPageUI from '@/components/projects/ProjectsPageUI.js';

// src/app/(pages)/projects/page.js
export const metadata = {
  title: 'Nz | Portfolio Projects',
  description:
    'Discover a curated selection of projects by Nawaz, a full stack developer skilled in building modern, scalable full stack applications using React, Next.js, Node.js, and more.',
};

const ProjectsPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="bg-secondary flex-col-center text-center h-[350px] xl:h-[450px] 3xl:h-[500px] pt-10 xl:pt-12 3xl:pt-14 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-9 2xl:px-12 3xl:px-16">
        <h1 className="text-gradient-1 text-5xl xl:text-6xl 3xl:text-7xl">Projects</h1>

        <div className="flex-center font-semibold lg-subtitle relative max-w-max mx-auto px-0.5 space-x-2 mt-5 xl:text-lg 3xl:text-xl">
          <span className="text-gradient">Home</span>

          <ChevronsRight className="text-tertiary mt-1 pointer-events-none size-5 xl:size-6 3xl:size-6.5" />

          <span className="text-gradient-1">Projects List</span>
        </div>
      </div>

      <ProjectsPageUI />
    </div>
  );
};

export default ProjectsPage;
