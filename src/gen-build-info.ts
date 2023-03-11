#!/usr/bin/env node

// TODO: Get destination folder from command line

import boxen from 'boxen';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const appName = 'Generate Build Info';
const blankStr = '';
const buildDate = new Date(Date.now());
const inputFile = path.join(process.cwd(), 'package.json');
const outputFileName = 'buildinfo.js';

// const outputFolder = path.join(process.cwd(), 'src/app');
// const outputFile = path.join(outputFolder, 'buildinfo.js');
var outputFolder: string;
var outputFile: string;

// Check our command-line argument(s)
const argv = yargs(hideBin(process.argv)).argv
if (!argv.outputFolder) {
    console.log(chalk.red('\nError: Output folder not specified\n'));
    process.exit(1);
}

outputFolder = path.join(process.cwd(), argv.outputFolder);
outputFile = path.join(outputFolder, outputFileName);

function outputHighlighted(highlight: string, msg: string) {
    console.log(chalk.yellow(`${highlight}: `) + msg);
}

// Opening window
console.log(boxen(appName, { padding: 1 }));
outputHighlighted('Output folder', outputFolder);
outputHighlighted('Output file', outputFile);

try {
    if (!fs.existsSync(outputFolder)) {
        console.log(chalk.red('\nError: Output folder does not exist\n'));
        process.exit(1);
    }
} catch (err) {
    console.error(err);
}

outputHighlighted('\nInput file', inputFile);
try {
    if (!fs.existsSync(inputFile)) {
        console.log(chalk.red('\nError: This is not a nodeJS project, cannot find `package.json` in this folder\n'));
        process.exit(1);
    }
} catch (err) {
    console.error(err);
}

let rawData = fs.readFileSync(inputFile);
let packageDotJSON = JSON.parse(rawData.toString());

let buildVersion = packageDotJSON.version;
outputHighlighted('Build version', buildVersion);
outputHighlighted('Build date', `${buildDate.toString()} (${buildDate.getTime().toString()})`);

let outputStr = 'export const buildInfo = {\n';
outputStr += `  buildVersion: "${buildVersion}",\n`;
outputStr += `  buildDate: ${buildDate.getTime()},\n`;
outputStr += '}';

console.log('\nWriting output file');
try {
    fs.writeFileSync(outputFile, outputStr, 'utf8');
    console.log(chalk.green('\nOutput file written successfully\n'));
} catch (err) {
    console.log(chalk.red('\nError: Unable to write to file\n'));
    console.log(err);
}