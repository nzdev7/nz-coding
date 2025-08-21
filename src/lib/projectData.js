// Static imports - data loaded at build time
import creative from '@/data/projects/creative.json';
import community from '@/data/projects/community.json';
import ecommerce from '@/data/projects/ecommerce.json';
import businessServices from '@/data/projects/business-services.json';

// Map category names to their data
const CATEGORY_DATA = {
  'Business & Services': businessServices,
  Creative: creative,
  Community: community,
  'E-commerce': ecommerce,
};

/**
 * Get all projects from all categories
 */
export const getAllProjects = () => {
  const allProjects = [];
  Object.values(CATEGORY_DATA).forEach((categoryData) => {
    if (Array.isArray(categoryData.projects)) {
      allProjects.push(...categoryData.projects);
    }
  });
  return allProjects;
};

/**
 * Get projects from a specific category
 */
export const getProjectsByCategory = (categoryName) => {
  const categoryData = CATEGORY_DATA[categoryName];
  return categoryData?.projects || [];
};

/**
 * Find a single project by ID
 */
export const getProjectById = (id) => {
  const allProjects = getAllProjects();
  return allProjects.find((project) => project._id === id);
};

/**
 * Apply filters to projects array (same logic as API route)
 */
export const filterProjects = (projects, filters) => {
  let filteredProjects = [...projects];

  // Filter by search text
  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    filteredProjects = filteredProjects.filter(
      (project) =>
        searchRegex.test(project.title) ||
        searchRegex.test(project.shortDescription) ||
        searchRegex.test(project.detailedDescription) ||
        project.technologies.some((tech) => searchRegex.test(tech))
    );
  }

  // Filter by category
  if (filters.category && filters.category.toLowerCase() !== 'all') {
    filteredProjects = filteredProjects.filter((project) => project.category === filters.category);
  }

  // Filter by subcategory
  if (filters.subcategory && filters.subcategory.toLowerCase() !== 'all') {
    filteredProjects = filteredProjects.filter((project) => project.subcategory === filters.subcategory);
  }

  // Filter by featured status
  if (filters.isFeatured && filters.isFeatured.toLowerCase() !== 'all') {
    filteredProjects = filteredProjects.filter((project) => project.isFeatured === (filters.isFeatured === 'true'));
  }

  return filteredProjects;
};

/**
 * Sort projects (same logic as API route)
 */
export const sortProjects = (projects, isFeatured) => {
  if (isFeatured === 'true') {
    // Random shuffle for featured projects
    return projects.sort(() => Math.random() - 0.5);
  } else {
    // Sort by creation date (newest first)
    return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

/**
 * Apply pagination to projects array
 */
export const paginateProjects = (projects, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return projects.slice(startIndex, endIndex);
};

/**
 * Get featured projects with limit
 */
export const getFeaturedProjects = (limit = 6) => {
  const allProjects = getAllProjects();
  const featuredProjects = allProjects.filter((project) => project.isFeatured);
  const shuffled = featuredProjects.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
};

/**
 * Main function to get filtered, sorted, and paginated projects
 */
export const getProjectsWithFilters = (filters = {}) => {
  const { page = 1, limit = 12, search = '', category = '', subcategory = '', isFeatured = '' } = filters;

  // Get initial projects
  let allProjects;
  if (category && category.toLowerCase() !== 'all' && CATEGORY_DATA[category]) {
    allProjects = getProjectsByCategory(category);
  } else {
    allProjects = getAllProjects();
  }

  // Apply filters
  const filteredProjects = filterProjects(allProjects, {
    search,
    category,
    subcategory,
    isFeatured,
  });

  // Sort projects
  const sortedProjects = sortProjects(filteredProjects, isFeatured);

  // Handle featured projects (no pagination)
  if (isFeatured === 'true') {
    const limitedProjects = sortedProjects.slice(0, limit);
    return {
      projects: limitedProjects,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: limitedProjects.length,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  // Apply pagination for regular projects
  const totalCount = sortedProjects.length;
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedProjects = paginateProjects(sortedProjects, page, limit);

  return {
    projects: paginatedProjects,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
