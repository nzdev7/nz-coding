'use client';

import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import { ProjectCard } from './ProjectCard';
import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProjectsWithFilters } from '@/lib/projectData';

// Main UI component for displaying and filtering projects
export default function ProjectsPageUI() {
  // === State management ===
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // === Static category and subcategory options ===
  const categories = useMemo(
    () => ({
      'Business & Services': [
        'Business',
        'Services',
        'Finance',
        'Restaurant',
        'Travel & Tourism',
        'Beauty & Fashion',
        'Healthcare & Wellness',
        'Property Management',
      ],
      Creative: ['Photography', 'Videography', 'Music', 'Blog', 'Personal'],
      Community: ['Nonprofit', 'Events', 'Education', 'Coaching'],
      'E-commerce': ['Online Shopping', 'Online Course'],
    }),
    []
  );

  // === Get filtered projects (instant - no API calls!) ===
  const projectsData = useMemo(() => {
    return getProjectsWithFilters({
      page: currentPage,
      limit: 12,
      search: searchTerm,
      category: selectedCategory,
      subcategory: selectedSubcategory,
    });
  }, [currentPage, searchTerm, selectedCategory, selectedSubcategory]);

  const { projects, pagination } = projectsData;

  // === Clear subcategory if it's not valid for the selected category ===
  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      const validSubcategories = categories[selectedCategory] || [];
      if (!validSubcategories.includes(selectedSubcategory)) {
        setSelectedSubcategory('');
      }
    }
  }, [selectedCategory, selectedSubcategory, categories]);

  // === Reset to page 1 when filters change ===
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSubcategory]);

  // === Handle pagination click ===
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // === Clear all filters and reset state ===
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pt-12 pb-20">
      <div className="container">
        {/* === Search and Filter Section === */}
        <div className="relative bg-secondary shadow-secondary rounded-md p-4 mb-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {/* --- Search Input --- */}
          <div className="relative bg-primary rounded-md border-primary w-full sm:col-span-2 xl:col-span-2">
            {searchTerm || selectedCategory || selectedSubcategory ? (
              <button
                onClick={clearFilters}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                aria-label="Clear search and filters"
              >
                <XCircle className="size-4.5 text-gray-400" />
              </button>
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            )}
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md pl-12 pr-4 py-3 text-sm"
            />
          </div>

          {/* --- Category Filter --- */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-primary rounded-md border-primary p-3 text-sm w-full"
          >
            <option value="">All Categories</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* --- Subcategory Filter --- */}
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={!selectedCategory}
            className={`bg-primary rounded-md border-primary p-3 text-sm w-full ${
              !selectedCategory ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <option value="">All Subcategories</option>
            {selectedCategory &&
              categories[selectedCategory]?.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
          </select>
        </div>

        {/* === Projects List (Instant Loading!) === */}
        {projects.length === 0 ? (
          // --- Show empty state when no projects found ---
          <div className="text-center py-20">
            <Filter size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-gradient text-2xl md:text-3xl">No projects found</h3>
            <p className="mb-4">Try adjusting your search terms or filters</p>
            <button onClick={clearFilters} className="text-primary font-medium hover:underline mx-auto">
              Clear all filters
            </button>
          </div>
        ) : (
          // --- Show projects grid ---
          <div className="max-w-sm md:max-w-3xl xl:max-w-full mx-auto grid gap-6 md:gap-10 3xl:gap-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}

        {/* === Pagination Component === */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <ReactPaginate
              pageCount={pagination.totalPages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              onPageChange={handlePageClick}
              forcePage={currentPage - 1}
              containerClassName="flex items-center gap-x-2 p-1 bg-primary rounded-md shadow-secondary overflow-hidden cursor-pointer"
              pageClassName="bg-primary-card rounded-md"
              pageLinkClassName="px-3 py-1.5 rounded-md text-sm"
              activeClassName="bg-tertiary text-white"
              activeLinkClassName="bg-tertiary text-white"
              previousLabel={<ChevronLeft size={20} className="pointer-events-none" />}
              nextLabel={<ChevronRight size={20} className="pointer-events-none" />}
              previousLinkClassName="btn-primary px-3 py-1.5 rounded-md hover:-translate-y-0"
              nextLinkClassName="btn-primary px-3 py-1.5 rounded-md hover:-translate-y-0"
              disabledClassName="opacity-50 cursor-not-allowed hover:translate-0"
              disabledLinkClassName="cursor-not-allowed hover:translate-0"
              breakLabel="..."
              breakClassName="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// === GoBackButton ===
export const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.back();
      }}
      className="flex items-center space-x-2 text-primary hover:scale-105 transition-transform duration-200 group"
    >
      <ChevronLeft size={20} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform duration-200" />
      <span className="text-sm font-medium">Go Back</span>
    </button>
  );
};
