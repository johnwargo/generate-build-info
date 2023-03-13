#!/usr/bin/env node

// TODO: Enable flag to switch output to typescript, or pick output format from command line

enum HighlightType {
    Red, Yellow, Green
}

// node modules
import fs from 'fs';
import path from 'path';

// Third-party modules
import boxen from 'boxen';
import chalk from 'chalk';

// local constants
const appName = 'Generate Build Info';
const buildDate = new Date(Date.now());
const inputFile = path.join(process.cwd(), 'package.json');
const outputFileName = 'buildinfo.json';
const newline="\n";

const red = HighlightType.Red;
const yellow = HighlightType.Yellow;
const green = HighlightType.Green;

var outputFolder;
var outputFile;

function writeConsole(color: HighlightType, highlightText: string, msg: string) {
    if (color == HighlightType.Red) console.log(newline + chalk.red(`${highlightText}: `) + msg + newline);
    if (color == HighlightType.Yellow) console.log(chalk.yellow(`${highlightText}: `) + msg);
    if (color == HighlightType.Green) console.log(chalk.green(`${highlightText}: `) + msg);
}

console.log(boxen(appName, { padding: 1 }));

writeConsole(HighlightType.Yellow, 'Input file', inputFile);
try {
    if (!fs.existsSync(inputFile)) {
        writeConsole(red, 'Error',
            'This is not a nodeJS project, cannot find `package.json` in this folder.');
        process.exit(1);
    }
} catch (err: any) {
    writeConsole(red, 'Error', err.message);
    process.exit(1);
}

// Check our command-line argument(s)
// parse the first argument
const pathObj: any = path.parse(process.argv[0]);
// is it node? Then we have three arguments, otherwise two
var tmpStr = pathObj.name == 'node'? process.argv[2]: process.argv[1];
if (tmpStr == undefined) {
    writeConsole(red, 'Error', 'Output folder not specified on command line');
    process.exit(1);
}

outputFolder = path.join(process.cwd(), tmpStr);
writeConsole(yellow, 'Output folder', outputFolder);

try {
    if (!fs.existsSync(outputFolder)) {
        writeConsole(red, 'Error', 'Output folder does not exist, please try again');
        process.exit(1);
    }
} catch (err: any) {
    writeConsole(red, 'Error', err.message);
    process.exit(1);
}

outputFile = path.join(outputFolder, outputFileName);
writeConsole(yellow, 'Output file', outputFile);

let rawData = fs.readFileSync(inputFile);
let packageDotJSON = JSON.parse(rawData.toString());

let buildVersion = packageDotJSON.version;
writeConsole(green, '\nBuild version', buildVersion);
writeConsole(green, 'Build date', `${buildDate.toString()} (${buildDate.getTime().toString()} in ms)`);

// javascript output
// let outputStr = 'export const buildInfo = {\n';
// outputStr += `  buildVersion: "${buildVersion}",\n`;
// outputStr += `  buildDate: ${buildDate.getTime()},\n`;
// outputStr += '}';

const buildInfo = {
    buildVersion: buildVersion,
    buildDateMs: buildDate.getTime(),
    buildDateStr: buildDate.toLocaleString()
};
let outputStr = JSON.stringify(buildInfo, null, 2);

try {
    fs.writeFileSync(outputFile, outputStr, 'utf8');
    writeConsole(green, 'Success', 'Output file written successfully\n');
} catch (err: any) {
    writeConsole(red, 'Error', 'Unable to write to file')
    console.dir(err);
}
