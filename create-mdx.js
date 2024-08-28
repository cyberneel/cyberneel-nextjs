const fs = require('fs');
const path = require('path');

// Function to create a new MDX file
function createMDXFile(type, fileName, title) {
  const directory = path.join(__dirname, `data/${type}`); // Adjust the path as needed
  const filePath = path.join(directory, `${fileName}.mdx`);

  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    console.error(`Error: The file "${fileName}.mdx" already exists. Please choose a different name.`);
    return;
  }

  // Frontmatter template
  const frontmatter = `---
title: "${title}"
publishedAt: "yyyy-mm-dd"
excerpt: "description"
cover_image_link: "link/to/img"
tags: []
---

Write your content here...
`;

  // Check if directory exists, create if not
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filePath, frontmatter);
  console.log(`MDX file created at ${filePath}`);
}

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: node create-mdx.js <fileName> <title> <date> <tags>');
  process.exit(1);
}

const type = args[0] // posts or blogs
const fileName = args[1];
const title = args[2];
//const date = args[2]; // Expected format: YYYY-MM-DD
//const tags = args.slice(3); // All remaining arguments are treated as tags

createMDXFile(type, fileName, title);
