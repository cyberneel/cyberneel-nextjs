// Count experiences by year
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const experiencesDirectory = path.join(process.cwd(), 'data/experiences');

// Ensure the directory exists
if (!fs.existsSync(experiencesDirectory)) {
  console.log('Experiences directory does not exist');
  process.exit(1);
}

// Get all experience files
const files = fs.readdirSync(experiencesDirectory);
console.log(`Total experience files: ${files.length}`);

// Count by year and category
const yearCounts = {};
const categoryCounts = {
  education: 0,
  work: 0,
  project: 0
};

files.forEach(file => {
  const filePath = path.join(experiencesDirectory, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);
  
  // Count by year
  if (data.year) {
    yearCounts[data.year] = (yearCounts[data.year] || 0) + 1;
  }
  
  // Count by category
  if (data.category) {
    categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
  }
});

// Sort years in descending order
const sortedYears = Object.keys(yearCounts).sort((a, b) => b - a);

console.log('\nExperiences by Year:');
sortedYears.forEach(year => {
  console.log(`${year}: ${yearCounts[year]} experiences`);
});

console.log('\nExperiences by Category:');
Object.keys(categoryCounts).forEach(category => {
  console.log(`${category}: ${categoryCounts[category]} experiences`);
});
