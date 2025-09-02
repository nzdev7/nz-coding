import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Mail, Check, ArrowUpRight } from 'lucide-react';
import { GoBackButton } from '@/components/projects/ProjectsPageUI';
import FeaturedProjects from '@/components/projects/FeaturedProjects';
import LivePreviewTrigger from '@/components/projects/LivePreviewModal';
import { getProjectById, getAllProjects } from '@/hooks/useProjects';

/**
 * Generate static params for all projects (build-time optimization)
 */
export async function generateStaticParams() {
  const allProjects = getAllProjects();

  return allProjects.map((project) => ({
    id: project._id,
  }));
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return {
      title: 'Project Not Found - Portfolio',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} - Portfolio`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [project.image],
    },
  };
}

/**
 * Main component for project detail page (instant loading!)
 */
const ProjectDetailPage = async ({ params }) => {
  const { id } = await params;
  const project = getProjectById(id); // Instant lookup from static data

  if (!project) {
    notFound();
  }

  return (
    <div className="py-20 md:pt-24 lg:pt-28 2xl:pt-32">
      <div className="container">
        <div className="sm:px-[8%] md:px-[10%] lg:px-[12%] xl:px-[14%]">
          {/* Navigation back to projects list */}
          <div className="mb-6">
            <GoBackButton />
          </div>

          {/* Hero Section - Project image and main action buttons */}
          <div className="bg-secondary shadow rounded-xl mb-10">
            {/* Project Image Display */}
            <div className="relative aspect-video rounded-t-xl overflow-hidden">
              <Image src={project.image} alt={project.title} fill className="object-cover" priority />
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap justify-between gap-2 p-4">
              <Link href="/contact" className="flex-center space-x-2 btn-primary py-2.5">
                <Mail size={14} strokeWidth={3} />
                <span>Contact Me</span>
              </Link>

              {/* Only show Live Preview if websiteUrl exists */}
              {project.websiteUrl && <LivePreviewTrigger url={project.websiteUrl} />}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="">
            {/* Project Description Section */}
            <div className="space-y-10">
              <div className="bg-secondary shadow rounded-xl p-4">
                <h1 className="text-gradient-1 text-3xl mb-4">{project.title}</h1>

                <p className="leading-relaxed">{project.detailedDescription}</p>

                {/* Show additional description only if it exists */}
                {project.additionalDescription && (
                  <p className="leading-relaxed mt-5">{project.additionalDescription}</p>
                )}
              </div>

              {/* Key Features Section - Conditionally rendered */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="bg-secondary shadow rounded-xl p-4">
                  <h3 className="text-primary text-2xl font-bold mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {project.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        {/* Check icon for each feature */}
                        <div className="bg-primary rounded-full shadow p-1 mt-1">
                          <Check className="text-tertiary size-3" strokeWidth={2.5} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar Information */}
            <div className="space-y-10 mt-10">
              {/* Technologies Used Section */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-secondary shadow rounded-xl p-4">
                  <h3 className="text-primary text-2xl font-bold mb-5">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-primary text-tertiary px-3 py-1 rounded-lg text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Meta Information */}
              <div className="bg-secondary shadow rounded-xl p-4">
                <h3 className="text-primary text-2xl font-bold mb-3">Project Info</h3>
                <div className="space-y-3 flex flex-wrap justify-around gap-10">
                  <div>
                    <span className="text-sm">Project Name:</span>
                    <p className="text-tertiary">{project.title}</p>
                  </div>
                  <div>
                    <span className="text-sm">Category:</span>
                    <p className="text-tertiary">{project.category}</p>
                  </div>
                  <div>
                    <span className="text-sm">Type:</span>
                    <p className="text-tertiary">{project.subcategory}</p>
                  </div>

                  {/* Website link - only shown if URL exists */}
                  {project.websiteUrl && (
                    <div>
                      <span className="text-sm">Website:</span>
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Live Site
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action for Similar Work */}
              <div className="bg-secondary shadow rounded-xl p-4 sm:flex sm:items-center sm:justify-around sm:gap-10 sm:flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold text-gradient-1 mb-2">Interested in Similar Work?</h3>
                  <p className="text-sm mb-7 sm:mb-0">Let's discuss your project and bring your ideas to life.</p>
                </div>
                <Link href="/contact" className="flex-center space-x-2 btn-primary py-2.5 text-sm sm:max-w-max">
                  <Mail size={14} strokeWidth={3} />
                  <span>Get In Touch</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects Section */}
        <div className="mt-24 xl:mx-auto xl:max-w-3xl 3xl:max-w-[800px]">
          <div className="text-center mb-10 xl:mb-12 3xl:mb-14 xl:text-left xl:flex xl:items-end xl:justify-between">
            <div>
              <h2 className="text-gradient-1 my-2.5 text-4xl xl:text-[42px]">More Projects</h2>
              <p>Check out these other featured projects from my portfolio</p>
            </div>

            {/* Link to view all projects */}
            <Link href="/projects" className="btn-primary hidden max-w-max xl:flex xl:gap-2 xl:mb-1 group">
              View All Projects
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Display 4 featured projects at the bottom (instant loading!) */}
          <FeaturedProjects limit={4} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
