#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HighlightType;
(function (HighlightType) {
    HighlightType[HighlightType["Red"] = 0] = "Red";
    HighlightType[HighlightType["Yellow"] = 1] = "Yellow";
    HighlightType[HighlightType["Green"] = 2] = "Green";
})(HighlightType || (HighlightType = {}));
// node modules
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// Third-party modules
var boxen = require('boxen');
var chalk = require('chalk');
var yargs = require('yargs/yargs');
var hideBin = require('yargs/helpers').hideBin;
// local constants
var appName = 'Generate Build Info';
var buildDate = new Date(Date.now());
var inputFile = path_1.default.join(process.cwd(), 'package.json');
var outputFileName = 'buildinfo.js';
var red = HighlightType.Red;
var yellow = HighlightType.Yellow;
var green = HighlightType.Green;
var outputFolder;
var outputFile;
function writeConsole(color, highlightText, msg) {
    if (color == HighlightType.Red)
        console.log(chalk.red("".concat(highlightText, ": ")) + msg);
    if (color == HighlightType.Yellow)
        console.log(chalk.yellow("".concat(highlightText, ": ")) + msg);
    if (color == HighlightType.Green)
        console.log(chalk.green("".concat(highlightText, ": ")) + msg);
}
// Check our command-line argument(s)
var argv = yargs(hideBin(process.argv)).argv;
if (!argv.outputFolder) {
    writeConsole(red, 'Error', 'Output folder not specified\n');
    process.exit(1);
}
outputFolder = path_1.default.join(process.cwd(), argv.outputFolder);
outputFile = path_1.default.join(outputFolder, outputFileName);
console.log(boxen(appName, { padding: 1 }));
writeConsole(yellow, 'Output folder', outputFolder);
writeConsole(yellow, 'Output file', outputFile);
try {
    if (!fs_1.default.existsSync(outputFolder)) {
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
    if (!fs_1.default.existsSync(inputFile)) {
        writeConsole(red, 'Error', 'This is not a nodeJS project, cannot find `package.json` in this folder\n');
        process.exit(1);
    }
}
catch (err) {
    writeConsole(red, 'Error', err.message);
    process.exit(1);
}
var rawData = fs_1.default.readFileSync(inputFile);
var packageDotJSON = JSON.parse(rawData.toString());
var buildVersion = packageDotJSON.version;
writeConsole(green, 'Build version', buildVersion);
writeConsole(green, 'Build date', "".concat(buildDate.toString(), " (").concat(buildDate.getTime().toString(), ")"));
var outputStr = 'export const buildInfo = {\n';
outputStr += "  buildVersion: \"".concat(buildVersion, "\",\n");
outputStr += "  buildDate: ".concat(buildDate.getTime(), ",\n");
outputStr += '}';
console.log('\nWriting output file');
try {
    fs_1.default.writeFileSync(outputFile, outputStr, 'utf8');
    writeConsole(green, 'Success', 'Output file written successfully\n');
}
catch (err) {
    writeConsole(red, 'Error', 'Unable to write to file\n');
    console.dir(err);
}
