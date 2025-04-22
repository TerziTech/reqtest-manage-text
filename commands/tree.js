import fs from 'fs';
import { parseRmtFile } from './parser.js';
import { render } from 'ink';
import React from 'react';
import TreeUI from './treeUI.js';

function treeReqtest() {
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

    // Render the interactive tree UI using Ink
    render(React.createElement(TreeUI, { reqtests, filePath }));
}

export { treeReqtest };