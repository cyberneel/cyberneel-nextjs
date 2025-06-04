// Generate dummy experience MDX files for testing infinite scroll performance
const fs = require('fs');
const path = require('path');

const experiencesDirectory = path.join(process.cwd(), 'data/experiences');

// Ensure the directory exists
if (!fs.existsSync(experiencesDirectory)) {
  fs.mkdirSync(experiencesDirectory, { recursive: true });
}

// Sample data to use for generating diverse experiences
const categories = ['education', 'work', 'project'];
const companies = {
  education: ['Stanford University', 'MIT', 'Harvard University', 'UC Berkeley', 'Princeton', 'Yale', 'Georgia Tech', 'Caltech', 'UCLA', 'Carnegie Mellon'],
  work: ['Google', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Adobe', 'IBM', 'Intel', 'SpaceX', 'Tesla', 'Nvidia', 'Twitter', 'Slack'],
  project: ['Personal Website', 'Mobile App', 'Machine Learning Model', 'AI Assistant', 'Game Development', 'Chrome Extension', 'Open Source Contribution', 'IoT System', 'Robotics Project']
};
const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Remote'];
const technologies = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'Swift', 'Kotlin', 'Go', 'Rust',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch', 'Node.js', 'Express', 'MongoDB',
  'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Microservices', 'CI/CD', 'Git', 'GitHub Actions'
];
const keywords = [
  'Web Development', 'Mobile Development', 'Machine Learning', 'AI', 'Data Science', 'Cloud Computing',
  'DevOps', 'Backend', 'Frontend', 'Full Stack', 'UI/UX', 'Cybersecurity', 'Blockchain', 'IoT'
];

// Generate a random date string between startYear and endYear
function randomDateString(startYear, endYear) {
  const month = Math.floor(Math.random() * 12) + 1;
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  return `${month < 10 ? '0' + month : month}/${year}`;
}

// Get 3-5 random items from an array
function getRandomItems(array, min = 3, max = 5) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate lorem ipsum content
function generateLoremIpsum(paragraphs = 1) {
  const lorem = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
  ];
  
  let content = '';
  for (let i = 0; i < paragraphs; i++) {
    content += lorem[i % lorem.length] + ' ';
  }
  
  // Add the ReadMore separator and additional content
  content += '=ReAdMoRe=\n\n';
  
  // Add more detailed content after the separator
  content += '## Details\n\n';
  for (let i = 0; i < paragraphs + 1; i++) {
    content += lorem[(i + 2) % lorem.length] + '\n\n';
  }
  
  // Add a bullet list
  content += '### Key Achievements\n\n';
  content += '- ' + lorem[0].split('.')[0] + '\n';
  content += '- ' + lorem[1].split('.')[0] + '\n';
  content += '- ' + lorem[2].split('.')[0] + '\n\n';
  
  return content;
}

// Generate a title based on category and company
function generateTitle(category, company) {
  if (category === 'education') {
    const degrees = ['B.S.', 'M.S.', 'Ph.D.', 'Bachelor of Arts', 'Master of Engineering'];
    const fields = ['Computer Science', 'Electrical Engineering', 'Data Science', 'Software Engineering', 'Information Technology'];
    return `${degrees[Math.floor(Math.random() * degrees.length)]} in ${fields[Math.floor(Math.random() * fields.length)]}`;
  } else if (category === 'work') {
    const positions = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Full Stack Developer', 'DevOps Engineer', 'ML Engineer', 'UX Designer', 'Frontend Developer', 'Backend Developer'];
    return `${positions[Math.floor(Math.random() * positions.length)]}`;
  } else {
    const prefixes = ['Building', 'Developing', 'Creating', 'Designing', 'Implementing'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${company}`;
  }
}

// Function to create a single experience file
function createExperienceFile(index, year) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const company = companies[category][Math.floor(Math.random() * companies[category].length)];
  const title = generateTitle(category, company);
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  // For work and education, make them span 1-3 years
  const endDate = category !== 'project' ? randomDateString(year, year + 2) : randomDateString(year, year);
  const startDate = randomDateString(Math.max(year - 2, 2010), year);
  
  const techItems = getRandomItems(technologies);
  const keywordItems = getRandomItems(keywords);
  
  // Generate file content
  const content = `---
title: "${title}"
company: "${company}"
location: "${location}"
startDate: "${startDate}"
endDate: "${endDate}"
category: "${category}"
year: ${year}
technologies: [${techItems.map(t => `"${t}"`).join(', ')}]
keywords: [${keywordItems.map(k => `"${k}"`).join(', ')}]
link: "${category === 'project' ? 'https://github.com/cyberneel' : category === 'education' ? 'https://www.stanford.edu' : 'https://www.google.com'}"
---

${generateLoremIpsum(Math.floor(Math.random() * 3) + 2)}
`;

  // Create unique filename
  const filename = `${category}-${year}-${company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}.mdx`;
  const filePath = path.join(experiencesDirectory, filename);
  
  fs.writeFileSync(filePath, content, 'utf8');
  return filename;
}

// Generate experiences across multiple years (2010-2025)
function generateExperiences(count) {
  console.log(`Generating ${count} dummy experiences...`);
  
  const files = [];
  // Generate experiences for years 2010-2025
  for (let i = 0; i < count; i++) {
    // Distribute across years, with more recent years having more experiences
    const yearOffset = Math.floor(Math.pow(Math.random(), 2) * 15); // Weight towards recent years
    const year = 2025 - yearOffset;
    
    const filename = createExperienceFile(i, year);
    files.push(filename);
    
    // Log progress
    if ((i + 1) % 10 === 0) {
      console.log(`Created ${i + 1} experiences...`);
    }
  }
  
  console.log(`Done! Created ${files.length} dummy experience files.`);
  return files;
}

// Generate 50 dummy experiences
const generatedFiles = generateExperiences(50);
console.log(`Files created:\n${generatedFiles.slice(0, 5).join('\n')}...\nand ${generatedFiles.length - 5} more.`);
