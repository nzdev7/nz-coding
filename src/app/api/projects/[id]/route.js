import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Map category names to their corresponding JSON files
const CATEGORY_FILES = {
  'Business & Services': 'business-services.json',
  Creative: 'creative.json',
  Community: 'community.json',
  'E-commerce': 'ecommerce.json',
};

/**
 * API endpoint to find and return a single project by its ID
 * Searches through all category files to locate the project
 */
export async function GET(request, { params }) {
  try {
    // Extract the project ID from the URL parameters
    const { id } = await params;
    const dataDir = path.join(process.cwd(), 'src', 'data', 'projects');

    // Search through each category file to find the project
    for (const filename of Object.values(CATEGORY_FILES)) {
      try {
        const filePath = path.join(dataDir, filename);

        // Check if the file exists before trying to read it
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const categoryData = JSON.parse(fileContent);

          // Look for the project with matching ID in this category
          if (Array.isArray(categoryData.projects)) {
            const project = categoryData.projects.find((p) => p._id === id);
            if (project) {
              // Found the project! Return it immediately
              return NextResponse.json({ project });
            }
          }
        }
      } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        // Continue searching other files even if one fails
      }
    }

    // Project not found in any category file
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
