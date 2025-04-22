import React from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const generateHierarchyNumber = (index, parentNumber = '') => {
    return parentNumber ? `${parentNumber}.${index}` : `${index}`;
};

const TreeUI = ({ reqtests, filePath }) => {
    const [cursor, setCursor] = React.useState(0);
    const [tree, setTree] = React.useState(reqtests);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState('');
    const [message, setMessage] = React.useState('');

    useInput((input, key) => {
        if (!isEditing) {
            if (key.upArrow) {
                setCursor((prev) => (prev > 0 ? prev - 1 : tree.length - 1));
            } else if (key.downArrow) {
                setCursor((prev) => (prev < tree.length - 1 ? prev + 1 : 0));
            } else if (key.ctrl && input === 'q') {
                process.exit();
            } else if (key.ctrl && input === 'n') {
                const newItem = { name: 'New Item', children: [] };
                const updatedTree = [
                    ...tree.slice(0, cursor + 1),
                    newItem,
                    ...tree.slice(cursor + 1),
                ];
                setTree(updatedTree);
                setCursor(cursor + 1); // Move cursor to the new item
            } else if (key.return) {
                setIsEditing(true);
                setEditValue(tree[cursor].name);
            } else if (key.ctrl && input === 's') {
                saveChanges(tree[cursor].name);
            }
        }
    });

    const saveChanges = (newItemName) => {
        try {
            execSync(`npx rmt add --name "${newItemName}"`, { stdio: 'inherit' });
            setMessage(`Reqtest object "${newItemName}" has been added successfully.`);
        } catch (error) {
            setMessage(`Error adding item '${newItemName}': ${error.message}`);
        }
    };

    const handleEditSubmit = (value) => {
        const updatedTree = tree.map((item, index) => {
            if (index === cursor) {
                return { ...item, name: value };
            }
            return item;
        });
        setTree(updatedTree);
        setIsEditing(false);
    };

    return (
        <Box flexDirection="column">
            <Box>
                <Text>Use arrow keys to navigate. `ctrl + q' to quit. `ctrl + n' to insert a new item. Press Enter to edit. Press ctrl + s to save.</Text>
            </Box>
            {message && (
                <Box>
                    <Text color="yellow">{message}</Text>
                </Box>
            )}
            {tree.map((reqtest, index) => (
                <Box key={index} flexDirection="row">
                    <Text color={cursor === index ? 'green' : 'white'}>
                        {cursor === index ? '> ' : '  '}
                        {generateHierarchyNumber(index)} {reqtest.name}
                    </Text>
                    {cursor === index && isEditing && (
                        <TextInput
                            value={editValue}
                            onChange={setEditValue}
                            onSubmit={handleEditSubmit}
                        />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default TreeUI;