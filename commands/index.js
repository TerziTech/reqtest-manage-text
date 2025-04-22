#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const initCommand = require('./init');
const addCommand = require('./add');
const { parseRmtFile } = require('./parser');
const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const editString = require('edit-string');

program
  .name('rmt')
  .description('CLI for managing requirements and tests')

program.addCommand(initCommand);
program.addCommand(addCommand);

/**
 * Lists all reqtest objects in the project.rmt file.
 */
function listReqtests() {
    const filePath = './project.rmt';

    if (!fs.existsSync(filePath)) {
        console.error('Error: project.rmt file not found. Please run "rmt init" to create one.');
        return;
    }

    const reqtests = parseRmtFile(filePath);

    if (reqtests.length === 0) {
        console.log('No reqtest objects found in the project.rmt file.');
        return;
    }

    console.log('List of reqtest objects:');
    reqtests.forEach((reqtest, index) => {
        console.log(`${index + 1}. ${reqtest.name}`);
    });
}

/**
 * Removes a reqtest object from the project.rmt file with tab completion.
 */
function removeReqtest() {
    const filePath = './project.rmt';

    if (!fs.existsSync(filePath)) {
        console.error('Error: project.rmt file not found. Please run "rmt init" to create one.');
        return;
    }

    const reqtests = parseRmtFile(filePath);
    const reqtestNames = reqtests.map(reqtest => reqtest.name);

    if (reqtestNames.length === 0) {
        console.log('No reqtest objects found in the project.rmt file.');
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: (line) => {
            const hits = reqtestNames.filter(name => name.startsWith(line));
            return [hits.length ? hits : reqtestNames, line];
        }
    });

    rl.question('Enter the name of the reqtest object to remove: ', (name) => {
        if (!reqtestNames.includes(name)) {
            console.log(`Reqtest object "${name}" not found in the project.rmt file.`);
        } else {
            const updatedContent = fs.readFileSync(filePath, 'utf-8')
                .split("\n\n")
                .filter(block => !block.includes(`.'. ${name}`))
                .join("\n\n");

            fs.writeFileSync(filePath, updatedContent, 'utf-8');
            console.log(`Reqtest object "${name}" has been removed from the project.rmt file.`);
        }

        rl.close();
    });
}

/**
 * Provides detailed information about a specific reqtest object.
 */
function detailsReqtest() {
    const filePath = './project.rmt';

    if (!fs.existsSync(filePath)) {
        console.error('Error: project.rmt file not found. Please run "rmt init" to create one.');
        return;
    }

    const reqtests = parseRmtFile(filePath);
    const reqtestNames = reqtests.map(reqtest => reqtest.name);

    if (reqtestNames.length === 0) {
        console.log('No reqtest objects found in the project.rmt file.');
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: (line) => {
            const hits = reqtestNames.filter(name => name.startsWith(line));
            return [hits.length ? hits : reqtestNames, line];
        }
    });

    rl.question('Enter the name of the reqtest object to view details: ', (name) => {
        const reqtest = reqtests.find(req => req.name === name);

        if (!reqtest) {
            console.log(`Reqtest object "${name}" not found in the project.rmt file.`);
        } else {
            console.log(`Details for reqtest object "${name}":`);
            Object.entries(reqtest).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
        }

        rl.close();
    });
}

/**
 * Opens a specific reqtest object in the project.rmt file for inline editing.
 */
async function editReqtest() {
    const filePath = './project.rmt';

    if (!fs.existsSync(filePath)) {
        console.error('Error: project.rmt file not found. Please run "rmt init" to create one.');
        return;
    }

    const reqtests = parseRmtFile(filePath);
    const reqtestNames = reqtests.map(reqtest => reqtest.name);

    if (reqtestNames.length === 0) {
        console.log('No reqtest objects found in the project.rmt file.');
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: (line) => {
            const hits = reqtestNames.filter(name => name.startsWith(line));
            return [hits.length ? hits : reqtestNames, line];
        }
    });

    rl.question('Enter the name of the reqtest object to edit: ', async (name) => {
        const reqtest = reqtests.find(req => req.name === name);

        if (!reqtest) {
            console.log(`Reqtest object "${name}" not found in the project.rmt file.`);
        } else {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const fileLines = fileContent.split('\n');
            const startLine = fileLines.findIndex(line => line.includes(`.'. ${name}`)) + 1; // Calculate the correct line number

            if (startLine === 0) {
                console.log(`Could not locate the reqtest object "${name}" in the file.`);
            } else {
                exec(`code -g ${filePath}:${startLine}`, (err) => {
                    if (err) {
                        console.error('Error opening the file in Visual Studio Code:', err);
                    }
                });
            }
        }

        rl.close();
    });
}

const listCommand = new Command('list')
  .description('List all reqtest objects in the project.rmt file')
  .action(() => {
    const { listReqtests } = require('./index');
    listReqtests();
  });

program.addCommand(listCommand);

const removeCommand = new Command('remove')
  .description('Remove a reqtest object from the project.rmt file with tab completion')
  .action(() => {
    const { removeReqtest } = require('./index');
    removeReqtest();
  });

program.addCommand(removeCommand);

const detailsCommand = new Command('details')
  .description('View details of a specific reqtest object in the project.rmt file')
  .action(() => {
    const { detailsReqtest } = require('./index');
    detailsReqtest();
  });

program.addCommand(detailsCommand);

const editCommand = new Command('edit')
  .description('Edit a specific reqtest object in the project.rmt file')
  .action(() => {
    const { editReqtest } = require('./index');
    editReqtest();
  });

program.addCommand(editCommand);

module.exports = { listReqtests, removeReqtest, detailsReqtest, editReqtest };

// Move the CLI entry point to the commands directory
// This file will be moved to /commands/index.js

program.parse(process.argv);