const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const addCommand = new Command('add')
  .description('Add a new reqtest object to the project.rmt file')
  .action(() => {
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
    const reqtestName = require('readline-sync').question('Enter the name of the reqtest object: ');

    // Generate a unique ID using the current date, time, and a random set of three letters
    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const uniqueId = `${formattedDate}-${formattedTime}-${randomLetters}`;

    const newReqtest = templateContent
      .replace(/{reqtest_name}/g, reqtestName)
      .replace(/{reqtest_id}/g, uniqueId);

    // Ensure a new line before appending the new reqtest object
    const projectFileContent = fs.readFileSync(projectFilePath, 'utf-8');
    const updatedContent = projectFileContent.trimEnd() + '\n\n' + newReqtest;

    fs.writeFileSync(projectFilePath, updatedContent);

    console.log(`Reqtest object "${reqtestName}" with ID "${uniqueId}" has been added to the project.rmt file.`);
  });

module.exports = addCommand;