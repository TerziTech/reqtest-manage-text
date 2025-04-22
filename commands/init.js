import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const initCommand = new Command('init')
  .description('Initialize a new project')
  .action(() => {
    const projectFilePath = path.join(process.cwd(), 'project.rmt');

    if (fs.existsSync(projectFilePath)) {
      console.log('A project.rmt file already exists in this directory. Initialization aborted.');
      return;
    }

    fs.writeFileSync(projectFilePath, '# Project Initialization\n\nThis is your project.rmt file.');
    console.log('Project initialized! A new project.rmt file has been created.');
  });

export default initCommand;