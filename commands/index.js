#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const initCommand = require('./init');
const addCommand = require('./add');

program
  .name('rmt')
  .description('CLI for managing requirements and tests')

program.addCommand(initCommand);
program.addCommand(addCommand);


// Move the CLI entry point to the commands directory
// This file will be moved to /commands/index.js

program.parse(process.argv);