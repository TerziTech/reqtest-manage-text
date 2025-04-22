import fs from 'fs';

/**
 * Parses the content of a project.rmt file into structured reqtest objects.
 * @param {string} filePath - The path to the project.rmt file.
 * @returns {Array<Object>} - An array of parsed reqtest objects.
 */
export function parseRmtFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const reqtests = [];

  // Match only blocks that start with .'. and end with .'.
  const blockRegex = /\.'\.\s([\s\S]*?)\s\.'\./g; // Fixed regex to match correctly
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const block = match[1].trim();
    const lines = block.split('\n');
    const reqtest = {};

    // The first line is the name of the block
    reqtest.name = lines[0].trim();

    // Parse the key-value pairs in the block
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes(': ')) {
        const [key, value] = line.split(': ').map(part => part.trim());
        reqtest[key] = value;
      }
    }
    reqtests.push(reqtest);
  }
  return reqtests;
}