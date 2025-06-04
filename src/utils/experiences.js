import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const experiencesDirectory = path.join(process.cwd(), 'data/experiences');

export function getAllExperienceSlugs() {
  try {
    if (!fs.existsSync(experiencesDirectory)) {
      fs.mkdirSync(experiencesDirectory, { recursive: true });
      return [];
    }
    
    const fileNames = fs.readdirSync(experiencesDirectory);
    return fileNames.map(fileName => {
      return {
        params: {
          slug: fileName.replace(/\.mdx$/, '')
        }
      };
    });
  } catch (error) {
    console.error('Error getting experience slugs:', error);
    return [];
  }
}

export function getAllExperienceData() {
  try {
    if (!fs.existsSync(experiencesDirectory)) {
      fs.mkdirSync(experiencesDirectory, { recursive: true });
      return [];
    }
    
    const fileNames = fs.readdirSync(experiencesDirectory);
    const allExperienceData = fileNames.map(fileName => {
      // Remove ".mdx" from file name to get id
      const slug = fileName.replace(/\.mdx$/, '');
      
      // Read markdown file as string
      const fullPath = path.join(experiencesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      
      // Combine the data with the id
      return {
        slug,
        id: slug,
        ...matterResult.data,
        content: matterResult.content
      };
    });
    
    // Sort experiences by year in descending order
    return allExperienceData.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      // If years are the same, sort by start date if available
      if (a.startDate && b.startDate) {
        return new Date(b.startDate) - new Date(a.startDate);
      }
      return 0;
    });
  } catch (error) {
    console.error('Error getting experience data:', error);
    return [];
  }
}
