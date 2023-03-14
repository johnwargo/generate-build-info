# Generate Build Info

Command line utility for npm-based packages that generates a simple `buildinfo.json` file in a specified folder with the expectation that the application in the project folder reads the file and displays the contents somehow within the application. 

Here's a link to the NPM project: https://www.npmjs.com/package/generate-build-info

For example, if the project is a web application (like [React](https://reactjs.org/) or [Vue.js](https://vuejs.org/)), the application code can read the generated file and display the build version and build date on the web application's footer.

The contents of the file look like this:

```json
{
  "buildVersion": "1.0.0",
  "buildDateMs": 1678724886957,
  "buildDateStr": "3/13/2023, 12:28:06 PM"
}
```

## Usage

To install the module as a dependency in the application project, open a terminal window or command prompt and execute the following command:

```shell
npm install generate-build-info --save-dev 
```

This approach allows you to easily execute the module in the standard `npm run build` process.

To install the module globally, open a terminal window or command prompt and execute the following command:

```shell
npm install generate-build-info -g
```

With this approach, you can execute the module in a terminal window or command prompt from any folder on your development system.

When you execute the module, it reads the local project's `package.json` file, and, using the file's `version` property and the current date/time, creates the `buildinfo.json` file in a folder location specified on the command line.

After installation, execute the module using the `gen-build-info` command passing in the destination location for the generated file:

```shell
gen-build-info <target_folder>
```

For example, to create the file in the current folder, use the following:

```shell
gen-build-info .
```

for npm-based web applications, you'll likely put the file in the project's `src` folder:

```shell
gen-build-info src
```

For npm-based Static Site Generators that use a data folder, you might  use:

```shell
gen-build-info src/_data
```

**Note:** The module will not create the target folder for you.

To use the module during an npm-driven build process, you can open the project's `package.json` file and update the project's existing `build` script:

```text
"build": "npm version patch && gen-build-info && <your_project_build_command>",
```

For example, for a React.js project it would look like this:

```text
"build": "npm version patch && gen-build-info && react-scripts build",
```

The `npm version patch` part of the build step increments the patch version in the `package.json` file before calling `gen-build-info`.

With this in place, when you execute `npm run build` to build a production version of the app, `npm` will update the version number in the project's `package.json` file, generate an updated version of the `buildinfo.js` file, then generate the production build of the app.

The next step is to read the file in you app and use it whatever way makes the most sense for your app. 

## Background

This module is a generic version of my [react-build-info](https://github.com/johnwargo/react-build-info) and [ionic-build-info](https://github.com/johnwargo/ionic-build-info) projects. In these earlier projects, the target folder is standard, so the modules put the generated file where the project expects it to be and simplifies the command line. 

I created this version when I started working with [Eleventy](https://www.11ty.dev/) and wanted an easy way to create a data file in the project that I could use to display an Eleventy site's build version and date on the site. Eleventy already has a way to display the build date in the site since it's a static site generator and all files are generated at build time, but I wanted a way to display the site's platform version (changes to the site, not the site's articles).

***

You can find information on many different topics on my [personal blog](http://www.johnwargo.com). Learn about all of my publications at [John Wargo Books](http://www.johnwargobooks.com).

If you find this code useful and feel like thanking me for providing it, please consider <a href="https://www.buymeacoffee.com/johnwargo" target="_blank">Buying Me a Coffee</a>, or making a purchase from [my Amazon Wish List](https://amzn.com/w/1WI6AAUKPT5P9).
