#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HighlightType;
(function (HighlightType) {
    HighlightType[HighlightType["Red"] = 0] = "Red";
    HighlightType[HighlightType["Yellow"] = 1] = "Yellow";
    HighlightType[HighlightType["Green"] = 2] = "Green";
})(HighlightType || (HighlightType = {}));
// import boxen from 'boxen';
// import chalk from 'chalk';
// import fs from 'fs';
// import path from 'path';
const boxen = require('boxen');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const yargs_1 = require("yargs");
// const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const appName = 'Generate Build Info';
const buildDate = new Date(Date.now());
const inputFile = path.join(process.cwd(), 'package.json');
const outputFileName = 'buildinfo.js';
const red = HighlightType.Red;
const yellow = HighlightType.Yellow;
const green = HighlightType.Green;
var outputFolder;
var outputFile;
function writeConsole(color, highlightText, msg) {
    if (color == HighlightType.Red)
        console.log(chalk.red(`${highlightText}: `) + msg);
    if (color == HighlightType.Yellow)
        console.log(chalk.yellow(`${highlightText}: `) + msg);
    if (color == HighlightType.Green)
        console.log(chalk.green(`${highlightText}: `) + msg);
}
// Check our command-line argument(s)
const argv = (0, yargs_1.default)(hideBin(process.argv)).argv;
if (!argv.outputFolder) {
    writeConsole(red, 'Error', 'Output folder not specified\n');
    process.exit(1);
}
outputFolder = path.join(process.cwd(), argv.outputFolder);
outputFile = path.join(outputFolder, outputFileName);
console.log(boxen(appName, { padding: 1 }));
writeConsole(yellow, 'Output folder', outputFolder);
writeConsole(yellow, 'Output file', outputFile);
try {
    if (!fs.existsSync(outputFolder)) {
        writeConsole(red, 'Error', 'Output folder does not exist\n');
        process.exit(1);
    }
}
catch (err) {
    writeConsole(red, 'Error', err.message);
    process.exit(1);
}
writeConsole(HighlightType.Yellow, '\nInput file', inputFile);
try {
    if (!fs.existsSync(inputFile)) {
        writeConsole(red, 'Error', 'This is not a nodeJS project, cannot find `package.json` in this folder\n');
        process.exit(1);
    }
}
catch (err) {
    writeConsole(red, 'Error', err.message);
    process.exit(1);
}
let rawData = fs.readFileSync(inputFile);
let packageDotJSON = JSON.parse(rawData.toString());
let buildVersion = packageDotJSON.version;
writeConsole(green, 'Build version', buildVersion);
writeConsole(green, 'Build date', `${buildDate.toString()} (${buildDate.getTime().toString()})`);
let outputStr = 'export const buildInfo = {\n';
outputStr += `  buildVersion: "${buildVersion}",\n`;
outputStr += `  buildDate: ${buildDate.getTime()},\n`;
outputStr += '}';
console.log('\nWriting output file');
try {
    fs.writeFileSync(outputFile, outputStr, 'utf8');
    writeConsole(green, 'Success', 'Output file written successfully\n');
}
catch (err) {
    writeConsole(red, 'Error', 'Unable to write to file\n');
    console.dir(err);
}
