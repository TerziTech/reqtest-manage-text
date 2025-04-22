import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';

const addCommand = new Command('add')
  .description('Add a new reqtest object to the project.rmt file')
  .option('--name <name>', 'Specify the name of the reqtest object')
  .action((options) => {
    const projectFilePath = path.join(process.cwd(), 'project.rmt');
    const templateFilePath = path.join(process.cwd(), 'docs', 'reqtesttemplate.rmt');

    if (!fs.existsSync(projectFilePath)) {
      console.error('Error: project.rmt file not found. Please run "rmt init" first.');
      return;
    }

    if (!fs.existsSync(templateFilePath)) {
      console.error('Error: reqtesttemplate.rmt file not found in the docs/ directory.');
      return;
    }

    const templateContent = fs.readFileSync(templateFilePath, 'utf-8');
    const reqtestName = options.name || readlineSync.question('Enter the name of the reqtest object: ');

    const projectFileContent = fs.readFileSync(projectFilePath, 'utf-8');
    const reqtests = projectFileContent.split("\n\n").map(reqtest => {
        const nameMatch = reqtest.match(/\.'\.\s*(.*?)\n/); // Adjusted regex to match the name after .'.
        return nameMatch ? { name: nameMatch[1].trim() } : null;
    }).filter(reqtest => reqtest !== null);

    const reqtestNames = reqtests.map(reqtest => reqtest.name);
    if (reqtestNames.includes(reqtestName)) {
      console.error(`Error: A reqtest object with the name "${reqtestName}" already exists.`);
      return;
    }

    // Generate a unique ID using the current date, time, and a random set of three letters
    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const randomLetters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const uniqueId = `${formattedDate}-${formattedTime}-${randomLetters}`;

    const newReqtest = templateContent
      .replace(/{reqtest_name}/g, reqtestName)
      .replace(/{reqtest_id}/g, uniqueId);

    // Ensure a new line before appending the new reqtest object
    const updatedContent = projectFileContent.trimEnd() + '\n\n' + newReqtest;

    fs.writeFileSync(projectFilePath, updatedContent);

    console.log(`Reqtest object "${reqtestName}" with ID "${uniqueId}" has been added to the project.rmt file.`);
  });

export default addCommand;