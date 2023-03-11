#!/usr/bin/env node
"use strict";
// TODO: Get destination folder from command line
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxen_1 = __importDefault(require("boxen"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const appName = 'Generate Build Info';
const blankStr = '';
const buildDate = new Date(Date.now());
const inputFile = path_1.default.join(process.cwd(), 'package.json');
const outputFileName = 'buildinfo.js';
// const outputFolder = path.join(process.cwd(), 'src/app');
// const outputFile = path.join(outputFolder, 'buildinfo.js');
var outputFolder;
var outputFile;
// Check our command-line argument(s)
const argv = yargs(hideBin(process.argv)).argv;
if (!argv.outputFolder) {
    console.log(chalk_1.default.red('\nError: Output folder not specified\n'));
    process.exit(1);
}
outputFolder = path_1.default.join(process.cwd(), argv.outputFolder);
outputFile = path_1.default.join(outputFolder, outputFileName);
function outputHighlighted(highlight, msg) {
    console.log(chalk_1.default.yellow(`${highlight}: `) + msg);
}
// Opening window
console.log((0, boxen_1.default)(appName, { padding: 1 }));
outputHighlighted('Output folder', outputFolder);
outputHighlighted('Output file', outputFile);
try {
    if (!fs_1.default.existsSync(outputFolder)) {
        console.log(chalk_1.default.red('\nError: Output folder does not exist\n'));
        process.exit(1);
    }
}
catch (err) {
    console.error(err);
}
outputHighlighted('\nInput file', inputFile);
try {
    if (!fs_1.default.existsSync(inputFile)) {
        console.log(chalk_1.default.red('\nError: This is not a nodeJS project, cannot find `package.json` in this folder\n'));
        process.exit(1);
    }
}
catch (err) {
    console.error(err);
}
let rawData = fs_1.default.readFileSync(inputFile);
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
    fs_1.default.writeFileSync(outputFile, outputStr, 'utf8');
    console.log(chalk_1.default.green('\nOutput file written successfully\n'));
}
catch (err) {
    console.log(chalk_1.default.red('\nError: Unable to write to file\n'));
    console.log(err);
}
