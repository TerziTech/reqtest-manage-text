// rehier.js
// This command recalculates the hierarchy of the reqtest objects in the project.rmt file.

import fs from 'fs';
import path from 'path';

function rehierCommand() {
    const projectFilePath = path.join(process.cwd(), 'project.rmt');

    console.log('Debug: Starting rehierCommand');
    console.log(`Debug: Looking for file at ${projectFilePath}`);

    if (!fs.existsSync(projectFilePath)) {
        console.error('Error: project.rmt file not found in the current directory.');
        process.exit(1);
    }

    const fileContent = fs.readFileSync(projectFilePath, 'utf-8');
    console.log('Debug: Successfully read project.rmt file');

    const lines = fileContent.split('\n');
    console.log(`Debug: File contains ${lines.length} lines`);

    let updatedContent = '';
    let currentHierarchy = 1.0;
    const hierarchyStack = [0]; // Tracks the hierarchy levels based on indentation
    const hierarchyMap = {}; // Maps indentation levels to hierarchy values

    for (let line of lines) {
        const trimmedLine = line.trim();
        console.log(`Debug: Processing line: ${trimmedLine}`);

        if (trimmedLine.startsWith(".'")) {
            const currentIndentation = line.search(/\S|$/); // Find the indentation level
            console.log(`Debug: Found reqtest object with indentation level ${currentIndentation}`);

            if (!(currentIndentation in hierarchyMap)) {
                hierarchyMap[currentIndentation] = currentHierarchy;
            } else {
                hierarchyMap[currentIndentation] += 1.0;
            }

            const newHierarchy = hierarchyMap[currentIndentation];
            console.log(`Debug: Calculated new hierarchy: ${newHierarchy}`);

            if (line.includes('hier:')) {
                line = line.replace(/hier: \d+\.\d+/, `hier: ${newHierarchy.toFixed(1)}`);
                console.log(`Debug: Updated line: ${line}`);
            }

            updatedContent += line + '\n';
        } else {
            updatedContent += line + '\n';
        }
    }

    fs.writeFileSync(projectFilePath, updatedContent.trim(), 'utf-8');
    console.log('Debug: Successfully wrote updated content to project.rmt');
    console.log('Hierarchy recalculated successfully.');
}

export default rehierCommand;