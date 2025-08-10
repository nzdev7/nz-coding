import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Map category names to their corresponding JSON files
const CATEGORY_FILES = {
  'Business & Services': 'business-services.json',
  Creative: 'creative.json',
  Community: 'community.json',
  'E-commerce': 'ecommerce.json',
};

/**
 * Reads and combines all project data from multiple JSON files
 * Returns an array of all projects across all categories
 */
function getAllProjectsFromFiles() {
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data', 'projects');
    let allProjects = [];

    // Loop through each category file and read its projects
    Object.values(CATEGORY_FILES).forEach((filename) => {
      try {
        const filePath = path.join(dataDir, filename);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const categoryData = JSON.parse(fileContent);

          // Add projects from this category to our main array
          if (Array.isArray(categoryData.projects)) {
            allProjects = allProjects.concat(categoryData.projects);
          }
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error reading ${filename}:`, error);
      }
    });

    return allProjects;
  } catch (error) {
    console.error('Error reading project files:', error);
    return [];
  }
}

/**
 * Reads projects from a specific category file only
 * More efficient when we only need one category
 */
function getProjectsByCategory(categoryName) {
  try {
    const filename = CATEGORY_FILES[categoryName];
    if (!filename) return [];

    const filePath = path.join(process.cwd(), 'src', 'data', 'projects', filename);
    if (!fs.existsSync(filePath)) return [];

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const categoryData = JSON.parse(fileContent);

    return categoryData.projects || [];
  } catch (error) {
    console.error(`Error reading category ${categoryName}:`, error);
    return [];
  }
}

/**
 * Applies various filters to the projects array based on search parameters
 * Supports: search text, category, subcategory, and featured status
 */
function filterProjects(projects, searchParams) {
  let filteredProjects = [...projects];

  // Filter by search text (searches title, description, and technologies)
  const search = searchParams.get('search');
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filteredProjects = filteredProjects.filter(
      (project) =>
        searchRegex.test(project.title) ||
        searchRegex.test(project.shortDescription) ||
        searchRegex.test(project.detailedDescription) ||
        project.technologies.some((tech) => searchRegex.test(tech))
    );
  }

  // Filter by category
  const category = searchParams.get('category');
  if (category && category.toLowerCase() !== 'all') {
    filteredProjects = filteredProjects.filter((project) => project.category === category);
  }

  // Filter by subcategory
  const subcategory = searchParams.get('subcategory');
  if (subcategory && subcategory.toLowerCase() !== 'all') {
    filteredProjects = filteredProjects.filter((project) => project.subcategory === subcategory);
  }

  // Filter by featured status
  const isFeatured = searchParams.get('isFeatured');
  if (isFeatured && isFeatured.toLowerCase() !== 'all') {
    filteredProjects = filteredProjects.filter((project) => project.isFeatured === (isFeatured === 'true'));
  }

  return filteredProjects;
}

/**
 * Sorts projects based on their type
 * Featured projects: random order, Regular projects: newest first
 */
function sortProjects(projects, isFeatured) {
  if (isFeatured === 'true') {
    // Random shuffle for featured projects to show variety
    return projects.sort(() => Math.random() - 0.5);
  } else {
    // Sort by creation date (newest first)
    return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

/**
 * Splits the results into pages for better performance and UX
 * Returns only the projects for the requested page
 */
function paginateProjects(projects, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return projects.slice(startIndex, endIndex);
}

/**
 * Main API endpoint handler for GET requests
 * Handles project fetching with filtering, sorting, and pagination
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract pagination and filter parameters from the request
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const isFeatured = searchParams.get('isFeatured');
    const category = searchParams.get('category');

    // Performance optimization: load only specific category if filtering by one
    let allProjects;
    if (category && category.toLowerCase() !== 'all' && CATEGORY_FILES[category]) {
      // Load only the specific category file for better performance
      allProjects = getProjectsByCategory(category);
    } else {
      // Load all projects from all files
      allProjects = getAllProjectsFromFiles();
    }

    // Apply all the filters based on search parameters
    const filteredProjects = filterProjects(allProjects, searchParams);

    // Sort the filtered results appropriately
    const sortedProjects = sortProjects(filteredProjects, isFeatured);

    // Special handling for featured projects (no pagination needed)
    if (isFeatured === 'true') {
      const limitedProjects = sortedProjects.slice(0, limit);
      return NextResponse.json({
        projects: limitedProjects,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: limitedProjects.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    // Apply pagination for regular project listings
    const totalCount = sortedProjects.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedProjects = paginateProjects(sortedProjects, page, limit);

    // Return the final results with pagination info
    return NextResponse.json({
      projects: paginatedProjects,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
